const http = require("http");
const fs = require("fs");
const path = require("path");

loadEnvFile();

const port = process.env.PORT || 4173;
const root = __dirname;
const providerName = "Twelve Data";
const apiBase = "https://api.twelvedata.com";

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
      });
    }

    if (requestUrl.pathname === "/api/health") {
      return respondJson(response, 200, {
        ok: true,
        provider: providerName,
      });
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

function loadEnvFile() {
  const envPath = path.join(__dirname, ".env");
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
