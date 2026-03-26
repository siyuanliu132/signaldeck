const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const port = process.env.PORT || 4173;
const root = __dirname;
const providerName = "Twelve Data";
const apiBase = "https://api.twelvedata.com";
const authStorePath = path.join(root, "storage", "auth-store.json");
const sessionCookieName = "signaldeck_sid";
const sessionMaxAgeSeconds = 60 * 60 * 24 * 30;

loadEnvFile();
ensureStorage();

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
};

http
  .createServer(async (request, response) => {
    const requestUrl = new URL(request.url, `http://${request.headers.host}`);

    if (requestUrl.pathname === "/api/config") {
      return respondJson(response, 200, {
        provider: providerName,
        hasServerKey: Boolean(process.env.TWELVE_DATA_API_KEY),
        authProviders: ["email-password"],
      });
    }

    if (requestUrl.pathname === "/api/health") {
      return respondJson(response, 200, {
        ok: true,
        provider: providerName,
      });
    }

    if (requestUrl.pathname === "/api/auth/me" && request.method === "GET") {
      return handleGetCurrentUser(request, response);
    }

    if (requestUrl.pathname === "/api/auth/register" && request.method === "POST") {
      return handleRegister(request, response);
    }

    if (requestUrl.pathname === "/api/auth/login" && request.method === "POST") {
      return handleLogin(request, response);
    }

    if (requestUrl.pathname === "/api/auth/logout" && request.method === "POST") {
      return handleLogout(request, response);
    }

    if (requestUrl.pathname === "/api/me/watchlist" && request.method === "GET") {
      return handleGetWatchlist(request, response);
    }

    if (requestUrl.pathname === "/api/me/watchlist" && request.method === "PUT") {
      return handlePutWatchlist(request, response);
    }

    if (requestUrl.pathname === "/api/market/quotes") {
      return handleQuotes(requestUrl, request, response);
    }

    if (requestUrl.pathname === "/api/market/history") {
      return handleHistory(requestUrl, request, response);
    }

    return serveStatic(requestUrl.pathname, response);
  })
  .listen(port, () => {
    console.log(`SignalDeck running at http://localhost:${port}`);
  });

async function handleRegister(request, response) {
  try {
    const body = await readJsonBody(request);
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!isValidEmail(email)) {
      return respondJson(response, 400, { error: "Enter a valid email address." });
    }

    if (password.length < 8) {
      return respondJson(response, 400, { error: "Password must be at least 8 characters." });
    }

    const store = readAuthStore();
    if (store.users.some(user => user.email === email)) {
      return respondJson(response, 409, { error: "An account with that email already exists." });
    }

    const { salt, hash } = hashPassword(password);
    const user = {
      id: crypto.randomUUID(),
      email,
      passwordSalt: salt,
      passwordHash: hash,
      watchlist: [],
      createdAt: new Date().toISOString(),
    };

    store.users.push(user);
    const session = createSession(store, user.id);
    writeAuthStore(store);
    setSessionCookie(request, response, session.id);

    return respondJson(response, 201, {
      user: publicUser(user),
    });
  } catch (error) {
    return respondJson(response, 400, { error: "Unable to create account." });
  }
}

async function handleLogin(request, response) {
  try {
    const body = await readJsonBody(request);
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    const store = readAuthStore();
    const user = store.users.find(entry => entry.email === email);
    if (!user || !verifyPassword(password, user.passwordSalt, user.passwordHash)) {
      return respondJson(response, 401, { error: "Incorrect email or password." });
    }

    const session = createSession(store, user.id);
    writeAuthStore(store);
    setSessionCookie(request, response, session.id);

    return respondJson(response, 200, {
      user: publicUser(user),
    });
  } catch (error) {
    return respondJson(response, 400, { error: "Unable to sign in." });
  }
}

function handleLogout(request, response) {
  const store = readAuthStore();
  const session = getSessionFromRequest(store, request);
  if (session) {
    store.sessions = store.sessions.filter(entry => entry.id !== session.id);
    writeAuthStore(store);
  }

  clearSessionCookie(response);
  return respondJson(response, 200, { ok: true });
}

function handleGetCurrentUser(request, response) {
  const store = readAuthStore();
  const auth = requireAuth(store, request);
  if (!auth) {
    clearSessionCookie(response);
    return respondJson(response, 200, { user: null });
  }

  auth.session.lastSeenAt = new Date().toISOString();
  writeAuthStore(store);
  return respondJson(response, 200, {
    user: publicUser(auth.user),
  });
}

function handleGetWatchlist(request, response) {
  const store = readAuthStore();
  const auth = requireAuth(store, request);
  if (!auth) {
    return respondJson(response, 401, { error: "Authentication required." });
  }

  return respondJson(response, 200, {
    watchlist: auth.user.watchlist || [],
  });
}

async function handlePutWatchlist(request, response) {
  const store = readAuthStore();
  const auth = requireAuth(store, request);
  if (!auth) {
    return respondJson(response, 401, { error: "Authentication required." });
  }

  try {
    const body = await readJsonBody(request);
    const watchlist = Array.isArray(body.watchlist)
      ? body.watchlist.filter(item => typeof item === "string").slice(0, 50)
      : null;

    if (!watchlist) {
      return respondJson(response, 400, { error: "Watchlist must be an array of symbols." });
    }

    auth.user.watchlist = [...new Set(watchlist)];
    writeAuthStore(store);

    return respondJson(response, 200, {
      watchlist: auth.user.watchlist,
    });
  } catch (error) {
    return respondJson(response, 400, { error: "Unable to update watchlist." });
  }
}

async function handleQuotes(requestUrl, request, response) {
  const symbols = requestUrl.searchParams.get("symbols");
  const apiKey = getApiKey(request);
  if (!symbols) {
    return respondJson(response, 400, { error: "Missing symbols query parameter." });
  }
  if (!apiKey) {
    return respondJson(response, 400, { error: "Missing Twelve Data API key." });
  }

  try {
    const upstream = await fetch(
      `${apiBase}/quote?symbol=${encodeURIComponent(symbols)}&apikey=${encodeURIComponent(apiKey)}`,
    );
    const payload = await upstream.json();
    if (!upstream.ok || payload.status === "error") {
      return respondJson(response, upstream.status || 502, {
        error: payload.message || "Unable to fetch quote data.",
      });
    }

    return respondJson(response, 200, {
      provider: providerName,
      fetchedAt: new Date().toISOString(),
      data: payload,
    });
  } catch (error) {
    return respondJson(response, 502, { error: "Quote request failed." });
  }
}

async function handleHistory(requestUrl, request, response) {
  const symbol = requestUrl.searchParams.get("symbol");
  const interval = requestUrl.searchParams.get("interval") || "15min";
  const outputsize = requestUrl.searchParams.get("outputsize") || "24";
  const apiKey = getApiKey(request);

  if (!symbol) {
    return respondJson(response, 400, { error: "Missing symbol query parameter." });
  }
  if (!apiKey) {
    return respondJson(response, 400, { error: "Missing Twelve Data API key." });
  }

  try {
    const upstream = await fetch(
      `${apiBase}/time_series?symbol=${encodeURIComponent(symbol)}&interval=${encodeURIComponent(interval)}&outputsize=${encodeURIComponent(outputsize)}&apikey=${encodeURIComponent(apiKey)}`,
    );
    const payload = await upstream.json();
    if (!upstream.ok || payload.status === "error") {
      return respondJson(response, upstream.status || 502, {
        error: payload.message || "Unable to fetch time-series data.",
      });
    }

    return respondJson(response, 200, {
      provider: providerName,
      fetchedAt: new Date().toISOString(),
      data: payload,
    });
  } catch (error) {
    return respondJson(response, 502, { error: "Time-series request failed." });
  }
}

function getApiKey(request) {
  return process.env.TWELVE_DATA_API_KEY || request.headers["x-api-key"] || "";
}

function serveStatic(pathname, response) {
  const safePath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.join(root, path.normalize(safePath).replace(/^(\.\.[\/\\])+/, ""));

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(error.code === "ENOENT" ? 404 : 500, {
        "Content-Type": "text/plain; charset=utf-8",
      });
      response.end(error.code === "ENOENT" ? "Not found" : "Server error");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    response.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream",
    });
    response.end(content);
  });
}

function respondJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(payload));
}

function parseCookies(request) {
  const raw = request.headers.cookie || "";
  return raw.split(";").reduce((accumulator, part) => {
    const trimmed = part.trim();
    if (!trimmed) {
      return accumulator;
    }

    const separatorIndex = trimmed.indexOf("=");
    const key = separatorIndex === -1 ? trimmed : trimmed.slice(0, separatorIndex);
    const value = separatorIndex === -1 ? "" : trimmed.slice(separatorIndex + 1);
    accumulator[key] = decodeURIComponent(value);
    return accumulator;
  }, {});
}

function readAuthStore() {
  try {
    const raw = fs.readFileSync(authStorePath, "utf8");
    const parsed = JSON.parse(raw);
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
    };
  } catch (error) {
    return { users: [], sessions: [] };
  }
}

function writeAuthStore(store) {
  fs.writeFileSync(authStorePath, JSON.stringify(store, null, 2));
}

function createSession(store, userId) {
  const session = {
    id: crypto.randomUUID(),
    userId,
    createdAt: new Date().toISOString(),
    lastSeenAt: new Date().toISOString(),
  };

  store.sessions = store.sessions.filter(entry => entry.userId !== userId);
  store.sessions.push(session);
  return session;
}

function getSessionFromRequest(store, request) {
  const cookies = parseCookies(request);
  const sessionId = cookies[sessionCookieName];
  if (!sessionId) {
    return null;
  }

  return store.sessions.find(session => session.id === sessionId) || null;
}

function requireAuth(store, request) {
  const session = getSessionFromRequest(store, request);
  if (!session) {
    return null;
  }

  const user = store.users.find(entry => entry.id === session.userId);
  if (!user) {
    return null;
  }

  return { session, user };
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return { salt, hash };
}

function verifyPassword(password, salt, expectedHash) {
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  const left = Buffer.from(hash, "hex");
  const right = Buffer.from(expectedHash, "hex");
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
  };
}

function setSessionCookie(request, response, sessionId) {
  const secure = request.headers["x-forwarded-proto"] === "https";
  response.setHeader("Set-Cookie", serializeCookie(sessionCookieName, sessionId, {
    httpOnly: true,
    path: "/",
    sameSite: "Lax",
    maxAge: sessionMaxAgeSeconds,
    secure,
  }));
}

function clearSessionCookie(response) {
  response.setHeader("Set-Cookie", serializeCookie(sessionCookieName, "", {
    httpOnly: true,
    path: "/",
    sameSite: "Lax",
    maxAge: 0,
  }));
}

function serializeCookie(name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  if (options.maxAge !== undefined) {
    parts.push(`Max-Age=${options.maxAge}`);
  }
  if (options.httpOnly) {
    parts.push("HttpOnly");
  }
  if (options.path) {
    parts.push(`Path=${options.path}`);
  }
  if (options.sameSite) {
    parts.push(`SameSite=${options.sameSite}`);
  }
  if (options.secure) {
    parts.push("Secure");
  }
  return parts.join("; ");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", chunk => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Body too large"));
        request.destroy();
      }
    });
    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    request.on("error", reject);
  });
}

function ensureStorage() {
  const storageDir = path.join(root, "storage");
  fs.mkdirSync(storageDir, { recursive: true });
  if (!fs.existsSync(authStorePath)) {
    fs.writeFileSync(authStorePath, JSON.stringify({ users: [], sessions: [] }, null, 2));
  }
}

function loadEnvFile() {
  const envPath = path.join(root, ".env");
  if (!fs.existsSync(envPath)) {
    return;
  }

  const content = fs.readFileSync(envPath, "utf8");
  content.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      return;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      return;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  });
}
