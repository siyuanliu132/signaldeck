const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const port = process.env.PORT || 4173;
const root = __dirname;
const providerName = "Twelve Data";
const apiBase = "https://api.twelvedata.com";
const openAiResponsesUrl = "https://api.openai.com/v1/responses";
const defaultOpenAiModel = "gpt-4.1-mini";
const authStorePath = path.join(root, "storage", "auth-store.json");
const sessionCookieName = "signaldeck_sid";
const sessionMaxAgeSeconds = 60 * 60 * 24 * 30;
const QUOTE_CACHE_TTL_MS = 1000 * 60 * 4;
const HISTORY_CACHE_TTL_MS = 1000 * 60 * 20;
const marketCache = {
  quotes: new Map(),
  history: new Map(),
};
const inFlightMarketRequests = {
  quotes: new Map(),
  history: new Map(),
};
const openAiScanProfileSchema = {
  name: "scan_profile",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: [
      "label",
      "description",
      "title",
      "sessionBias",
      "sessionBoost",
      "scoreWeights",
      "minQuality",
      "minRelativeVolume",
      "priceMin",
      "priceMax",
      "window",
      "holdBias",
      "riskBias",
      "executionNote",
      "monitorFocus",
      "intentChips",
      "rationale",
    ],
    properties: {
      label: { type: "string" },
      description: { type: "string" },
      title: { type: "string" },
      sessionBias: { type: "string", enum: ["all", "intraday", "overnight", "swing"] },
      sessionBoost: { type: "string", enum: ["none", "intraday", "overnight", "swing"] },
      scoreWeights: {
        type: "object",
        additionalProperties: false,
        required: ["momentum", "safety", "carry"],
        properties: {
          momentum: { type: "number" },
          safety: { type: "number" },
          carry: { type: "number" },
        },
      },
      minQuality: { type: "number" },
      minRelativeVolume: { type: "number" },
      priceMin: { type: "number" },
      priceMax: { type: "number" },
      window: { type: "string" },
      holdBias: { type: "string" },
      riskBias: { type: "string" },
      executionNote: { type: "string" },
      monitorFocus: { type: "string" },
      intentChips: {
        type: "array",
        items: { type: "string" },
      },
      rationale: {
        type: "array",
        items: { type: "string" },
      },
    },
  },
};

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
        authProviders: ["email-password", "google"],
        aiParser: {
          provider: process.env.OPENAI_API_KEY ? "OpenAI Responses" : "Heuristic fallback",
          hasServerKey: Boolean(process.env.OPENAI_API_KEY),
          model: getOpenAiModel(),
        },
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

    if (requestUrl.pathname === "/api/ai/scan-profile" && request.method === "POST") {
      return handleAiScanProfile(request, response);
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

  const cacheKey = symbols;
  const cached = readCacheEntry(marketCache.quotes, cacheKey, QUOTE_CACHE_TTL_MS);
  if (cached) {
    return respondMarketPayload(response, cached, { cached: true });
  }

  const activeRequest = inFlightMarketRequests.quotes.get(cacheKey);
  if (activeRequest) {
    try {
      const sharedPayload = await activeRequest;
      return respondMarketPayload(response, sharedPayload, { cached: true, shared: true });
    } catch (error) {
      const staleEntry = readCacheEntry(marketCache.quotes, cacheKey, Number.MAX_SAFE_INTEGER);
      if (staleEntry) {
        return respondMarketPayload(response, staleEntry, { cached: true, stale: true });
      }
      return respondJson(response, 502, { error: "Quote request failed." });
    }
  }

  try {
    const requestPromise = fetchMarketPayload(
      `${apiBase}/quote?symbol=${encodeURIComponent(symbols)}&apikey=${encodeURIComponent(apiKey)}`,
      "Unable to fetch quote data.",
    );
    inFlightMarketRequests.quotes.set(cacheKey, requestPromise);
    const freshPayload = await requestPromise;
    writeCacheEntry(marketCache.quotes, cacheKey, freshPayload.data, freshPayload.fetchedAt);
    return respondMarketPayload(response, freshPayload);
  } catch (error) {
    const staleEntry = readCacheEntry(marketCache.quotes, cacheKey, Number.MAX_SAFE_INTEGER);
    if (staleEntry) {
      return respondMarketPayload(response, staleEntry, { cached: true, stale: true, warning: error.message });
    }
    return respondJson(response, inferUpstreamStatus(null, error.message), {
      error: error.message || "Quote request failed.",
    });
  } finally {
    inFlightMarketRequests.quotes.delete(cacheKey);
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

  const cacheKey = `${symbol}:${interval}:${outputsize}`;
  const cached = readCacheEntry(marketCache.history, cacheKey, HISTORY_CACHE_TTL_MS);
  if (cached) {
    return respondMarketPayload(response, cached, { cached: true });
  }

  const activeRequest = inFlightMarketRequests.history.get(cacheKey);
  if (activeRequest) {
    try {
      const sharedPayload = await activeRequest;
      return respondMarketPayload(response, sharedPayload, { cached: true, shared: true });
    } catch (error) {
      const staleEntry = readCacheEntry(marketCache.history, cacheKey, Number.MAX_SAFE_INTEGER);
      if (staleEntry) {
        return respondMarketPayload(response, staleEntry, { cached: true, stale: true });
      }
      return respondJson(response, 502, { error: "Time-series request failed." });
    }
  }

  try {
    const requestPromise = fetchMarketPayload(
      `${apiBase}/time_series?symbol=${encodeURIComponent(symbol)}&interval=${encodeURIComponent(interval)}&outputsize=${encodeURIComponent(outputsize)}&apikey=${encodeURIComponent(apiKey)}`,
      "Unable to fetch time-series data.",
    );
    inFlightMarketRequests.history.set(cacheKey, requestPromise);
    const freshPayload = await requestPromise;
    writeCacheEntry(marketCache.history, cacheKey, freshPayload.data, freshPayload.fetchedAt);
    return respondMarketPayload(response, freshPayload);
  } catch (error) {
    const staleEntry = readCacheEntry(marketCache.history, cacheKey, Number.MAX_SAFE_INTEGER);
    if (staleEntry) {
      return respondMarketPayload(response, staleEntry, { cached: true, stale: true, warning: error.message });
    }
    return respondJson(response, inferUpstreamStatus(null, error.message), {
      error: error.message || "Time-series request failed.",
    });
  } finally {
    inFlightMarketRequests.history.delete(cacheKey);
  }
}

async function handleAiScanProfile(request, response) {
  if (!process.env.OPENAI_API_KEY) {
    return respondJson(response, 503, {
      error: "OpenAI parser is not configured on the server.",
    });
  }

  try {
    const body = await readJsonBody(request);
    const query = String(body.query || "").trim();
    if (!query) {
      return respondJson(response, 400, { error: "Missing scan prompt." });
    }

    const profile = await buildAiScanProfile(query);
    return respondJson(response, 200, {
      provider: "OpenAI Responses",
      model: getOpenAiModel(),
      profile,
    });
  } catch (error) {
    return respondJson(response, error.statusCode || 502, {
      error: error.message || "Unable to build an AI scan profile.",
    });
  }
}

function getApiKey(request) {
  return process.env.TWELVE_DATA_API_KEY || request.headers["x-api-key"] || "";
}

function getOpenAiModel() {
  return process.env.OPENAI_MODEL || defaultOpenAiModel;
}

function readCacheEntry(store, key, ttlMs) {
  const entry = store.get(key);
  if (!entry) {
    return null;
  }

  if (Date.now() - entry.cachedAt > ttlMs) {
    store.delete(key);
    return null;
  }

  return entry;
}

function writeCacheEntry(store, key, data, fetchedAt = new Date().toISOString()) {
  store.set(key, {
    data,
    fetchedAt,
    cachedAt: Date.now(),
  });
}

function respondMarketPayload(response, payload, extras = {}) {
  return respondJson(response, 200, {
    provider: providerName,
    fetchedAt: payload.fetchedAt,
    data: payload.data,
    ...extras,
  });
}

async function fetchMarketPayload(url, fallbackMessage) {
  const upstream = await fetch(url);
  const payload = await upstream.json();
  if (!upstream.ok || payload.status === "error") {
    const message = payload.message || fallbackMessage;
    const error = new Error(message);
    error.statusCode = inferUpstreamStatus(upstream.status, message);
    throw error;
  }

  return {
    data: payload,
    fetchedAt: new Date().toISOString(),
  };
}

async function buildAiScanProfile(query) {
  const upstream = await fetch(openAiResponsesUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: getOpenAiModel(),
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "You are configuring SignalDeck, an explainable stock scanner. Turn the user's trading goal into a concise scan profile for a product UI. Do not claim certainty or guaranteed returns. Keep labels short and product-ready. Use sessionBias to express the preferred holding horizon, sessionBoost for scoring emphasis, and sensible thresholds for minQuality, minRelativeVolume, and price range. Keep intentChips to 3 or 4 short phrases and rationale to 3 short sentences.",
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `User request: ${query}`,
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          ...openAiScanProfileSchema,
        },
      },
    }),
  });

  const raw = await upstream.text();
  const payload = parseJsonSafely(raw);
  if (!upstream.ok) {
    const error = new Error(payload?.error?.message || payload?.message || "OpenAI scan-profile request failed.");
    error.statusCode = upstream.status || 502;
    throw error;
  }

  const content = extractOpenAiText(payload);
  const parsed = parseJsonSafely(content);
  if (!parsed) {
    const error = new Error("OpenAI parser returned an unreadable profile payload.");
    error.statusCode = 502;
    throw error;
  }

  return normalizeAiProfilePayload(parsed);
}

function extractOpenAiText(payload) {
  if (!payload || typeof payload !== "object") {
    return "";
  }

  if (typeof payload.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text;
  }

  if (!Array.isArray(payload.output)) {
    return "";
  }

  for (const item of payload.output) {
    const content = Array.isArray(item?.content) ? item.content : [];
    for (const part of content) {
      if (typeof part?.text === "string" && part.text.trim()) {
        return part.text;
      }
      if (part?.json && typeof part.json === "object") {
        return JSON.stringify(part.json);
      }
    }
  }

  return "";
}

function normalizeAiProfilePayload(profile) {
  const sessionBias = pickAllowedValue(profile?.sessionBias, ["all", "intraday", "overnight", "swing"], "all");
  const sessionBoost = pickAllowedValue(
    profile?.sessionBoost,
    ["none", "intraday", "overnight", "swing"],
    sessionBias === "all" ? "none" : sessionBias,
  );

  return {
    label: cleanServerText(profile?.label, "AI scan"),
    description: cleanServerText(profile?.description, "Structured scan profile generated from the user prompt."),
    title: cleanServerText(profile?.title, "AI-ranked setups"),
    sessionBias,
    sessionBoost,
    scoreWeights: {
      momentum: clampNumber(Number(profile?.scoreWeights?.momentum) || 1, 0.55, 1.65),
      safety: clampNumber(Number(profile?.scoreWeights?.safety) || 1, 0.55, 1.65),
      carry: clampNumber(Number(profile?.scoreWeights?.carry) || 0.75, 0.4, 1.5),
    },
    minQuality: clampNumber(Number(profile?.minQuality) || 66, 50, 92),
    minRelativeVolume: clampNumber(Number(profile?.minRelativeVolume) || 1.25, 0.5, 4),
    priceMin: clampNumber(Number(profile?.priceMin) || 0, 0, 1000),
    priceMax: clampNumber(Number(profile?.priceMax) || 9999, 1, 2000),
    window: cleanServerText(profile?.window, "Flexible"),
    holdBias: cleanServerText(profile?.holdBias, "Adaptive"),
    riskBias: cleanServerText(profile?.riskBias, "Balanced"),
    executionNote: cleanServerText(
      profile?.executionNote,
      "Use the generated profile as a market-scan guide, not a certainty claim.",
    ),
    monitorFocus: cleanServerText(
      profile?.monitorFocus,
      "Watch participation, structure, and whether the tape holds after the initial move.",
    ),
    intentChips: cleanServerList(profile?.intentChips, 4, ["AI parsed", "Structured intent"]),
    rationale: cleanServerList(profile?.rationale, 3, [
      "The parser reads time horizon, risk posture, and participation cues from the prompt.",
      "SignalDeck translates that into a structured scan profile instead of freeform text.",
      "The final board remains explainable because the local ranking engine still drives the output.",
    ]),
  };
}

function inferUpstreamStatus(statusCode, message) {
  if (statusCode && statusCode >= 400) {
    return statusCode;
  }

  const normalized = String(message || "").toLowerCase();
  if (
    normalized.includes("api credits") ||
    normalized.includes("rate limit") ||
    normalized.includes("per minute") ||
    normalized.includes("quota")
  ) {
    return 429;
  }

  return 502;
}

function parseJsonSafely(value) {
  if (!value || typeof value !== "string") {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}

function cleanServerText(value, fallback) {
  const text = String(value || "").trim();
  return text || fallback;
}

function cleanServerList(values, limit, fallback) {
  if (!Array.isArray(values)) {
    return fallback;
  }

  const cleaned = values
    .map(item => String(item || "").trim())
    .filter(Boolean)
    .slice(0, limit);

  return cleaned.length ? cleaned : fallback;
}

function pickAllowedValue(value, allowed, fallback) {
  return allowed.includes(value) ? value : fallback;
}

function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, value));
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
