const trackedUniverse = [
  { symbol: "NVDA", name: "NVIDIA", session: "intraday", trend: "Intraday continuation", sector: "Semiconductors", theme: "AI infrastructure", marketCap: "Mega cap" },
  { symbol: "MSFT", name: "Microsoft", session: "swing", trend: "Blue-chip swing", sector: "Software", theme: "Platform leader", marketCap: "Mega cap" },
  { symbol: "AMD", name: "Advanced Micro Devices", session: "intraday", trend: "Opening drive", sector: "Semiconductors", theme: "Acceleration trade", marketCap: "Large cap" },
  { symbol: "META", name: "Meta Platforms", session: "overnight", trend: "Overnight carry", sector: "Internet", theme: "Digital ads", marketCap: "Mega cap" },
  { symbol: "AVGO", name: "Broadcom", session: "intraday", trend: "Trend acceleration", sector: "Semiconductors", theme: "Infrastructure leadership", marketCap: "Mega cap" },
  { symbol: "LLY", name: "Eli Lilly", session: "swing", trend: "Quality leader", sector: "Healthcare", theme: "Defensive growth", marketCap: "Mega cap" },
  { symbol: "JPM", name: "JPMorgan Chase", session: "overnight", trend: "Low-vol carry", sector: "Financials", theme: "Rate resilience", marketCap: "Mega cap" },
  { symbol: "COST", name: "Costco", session: "overnight", trend: "Steady hold", sector: "Consumer", theme: "Defensive compounder", marketCap: "Mega cap" },
];

const REFRESH_INTERVAL_MS = 60000;
const HISTORY_INTERVAL = "15min";
const HISTORY_POINTS = 24;

const state = {
  surfaceMode: "ai",
  selectedSymbol: "NVDA",
  apiKey: loadStoredApiKey(),
  apiConfig: { hasServerKey: false, provider: "Twelve Data" },
  quoteMap: {},
  historyMap: {},
  lastUpdatedAt: null,
  isRefreshing: false,
  isLoadingHistory: false,
  loadError: "",
  watchlist: loadWatchlist(),
  searchTerm: "",
  profile: createProfile({
    label: "Balanced momentum",
    description: "Balanced momentum profile with trap-risk penalty enabled.",
    title: "Top setups right now",
    filter: () => true,
    scoreConfig: { momentum: 1, safety: 1, carry: 0.6, sessionBoost: null },
    meta: {
      window: "Open to midday",
      holdBias: "Intraday to overnight",
      riskBias: "Balanced",
      executionNote: "SignalDeck is looking for strong participation with downside control, not blind gap chasing.",
      monitorFocus: "Trend quality, participation, and hold behavior",
    },
  }),
  classicFilters: {
    session: "all",
    minMomentum: 68,
    maxRisk: 48,
    minRelativeVolume: 1.1,
  },
};

const elements = {
  promptButtons: [...document.querySelectorAll(".prompt-pill")],
  tabs: [...document.querySelectorAll(".surface-tab")],
  panels: [...document.querySelectorAll(".mode-panel")],
  aiQuery: document.getElementById("ai-query"),
  runAi: document.getElementById("run-ai"),
  aiSummary: document.getElementById("ai-summary"),
  surfaceCaption: document.getElementById("surface-caption"),
  opportunityList: document.getElementById("opportunity-list"),
  resultsTitle: document.getElementById("results-title"),
  resultsMeta: document.getElementById("results-meta"),
  symbolSearch: document.getElementById("symbol-search"),
  pulseStrip: document.getElementById("pulse-strip"),
  feedStatus: document.getElementById("feed-status-text"),
  lastUpdated: document.getElementById("last-updated"),
  connectionState: document.getElementById("connection-state"),
  dataSourceNote: document.getElementById("data-source-note"),
  apiKeyInput: document.getElementById("api-key-input"),
  saveApiKey: document.getElementById("save-api-key"),
  refreshMarket: document.getElementById("refresh-market"),
  watchlistCount: document.getElementById("watchlist-count"),
  watchlistList: document.getElementById("watchlist-list"),
  briefHeadline: document.getElementById("brief-headline"),
  briefWindow: document.getElementById("brief-window"),
  briefBody: document.getElementById("brief-body"),
  briefMetrics: document.getElementById("brief-metrics"),
  weightCaption: document.getElementById("weight-caption"),
  weightBars: document.getElementById("weight-bars"),
  inspectorSymbol: document.getElementById("inspector-symbol"),
  inspectorTag: document.getElementById("inspector-tag"),
  inspectorPrice: document.getElementById("inspector-price"),
  inspectorScore: document.getElementById("inspector-score"),
  signalList: document.getElementById("signal-list"),
  riskFill: document.getElementById("risk-fill"),
  riskScoreLabel: document.getElementById("risk-score-label"),
  riskNote: document.getElementById("risk-note"),
  contextGrid: document.getElementById("context-grid"),
  sparkline: document.getElementById("sparkline"),
  sessionFilter: document.getElementById("session-filter"),
  momentumFilter: document.getElementById("momentum-filter"),
  riskFilter: document.getElementById("risk-filter"),
  volumeFilter: document.getElementById("volume-filter"),
  momentumValue: document.getElementById("momentum-value"),
  riskValue: document.getElementById("risk-value"),
  volumeValue: document.getElementById("volume-value"),
  applyFilters: document.getElementById("apply-filters"),
  executionHeadline: document.getElementById("execution-headline"),
  executionChip: document.getElementById("execution-chip"),
  executionBody: document.getElementById("execution-body"),
  executionGridList: document.getElementById("execution-grid-list"),
  monitorList: document.getElementById("monitor-list"),
};

bindEvents();
initialize();

async function initialize() {
  elements.apiKeyInput.value = state.apiKey;
  runAiQuery(elements.aiQuery.value.trim());
  render();
  await fetchConfig();
  await refreshMarketData();
  setInterval(() => {
    refreshMarketData({ quiet: true });
  }, REFRESH_INTERVAL_MS);
}

function bindEvents() {
  elements.promptButtons.forEach(button => {
    button.addEventListener("click", () => {
      elements.aiQuery.value = button.dataset.prompt;
      if (state.surfaceMode !== "ai") {
        setSurfaceMode("ai");
      }
      runAiQuery(button.dataset.prompt);
    });
  });

  elements.tabs.forEach(button => {
    button.addEventListener("click", () => setSurfaceMode(button.dataset.mode));
  });

  elements.runAi.addEventListener("click", () => runAiQuery(elements.aiQuery.value.trim()));
  elements.applyFilters.addEventListener("click", applyClassicFilters);
  elements.refreshMarket.addEventListener("click", () => refreshMarketData());
  elements.saveApiKey.addEventListener("click", async () => {
    state.apiKey = elements.apiKeyInput.value.trim();
    saveStoredApiKey(state.apiKey);
    state.loadError = "";
    renderConnectionState();
    await refreshMarketData();
  });
  elements.symbolSearch.addEventListener("input", event => {
    state.searchTerm = event.target.value.trim().toLowerCase();
    render();
  });
  elements.momentumFilter.addEventListener("input", event => {
    elements.momentumValue.textContent = event.target.value;
  });
  elements.riskFilter.addEventListener("input", event => {
    elements.riskValue.textContent = event.target.value;
  });
  elements.volumeFilter.addEventListener("input", event => {
    elements.volumeValue.textContent = `${(event.target.value / 10).toFixed(1)}x`;
  });
}

async function fetchConfig() {
  try {
    const response = await fetch("/api/config");
    if (!response.ok) {
      throw new Error("Unable to load API config.");
    }
    state.apiConfig = await response.json();
  } catch (error) {
    state.loadError = error.message;
  } finally {
    renderConnectionState();
  }
}

function setSurfaceMode(mode) {
  state.surfaceMode = mode;
  elements.tabs.forEach(button => button.classList.toggle("active", button.dataset.mode === mode));
  elements.panels.forEach(panel => panel.classList.toggle("active", panel.dataset.panel === mode));
  elements.surfaceCaption.textContent =
    mode === "ai"
      ? "Translate plain English goals into a market scan profile."
      : "Expose the ranking logic with transparent filters and a cleaner workflow.";
  render();
}

function applyClassicFilters() {
  const session = elements.sessionFilter.value;
  state.classicFilters = {
    session,
    minMomentum: Number(elements.momentumFilter.value),
    maxRisk: Number(elements.riskFilter.value),
    minRelativeVolume: Number(elements.volumeFilter.value) / 10,
  };

  state.profile = createProfile({
    label: "Classic screener",
    description: "Classic screen ranking names by conviction, liquidity, and controlled downside.",
    title: "Classic screener results",
    filter: stock => {
      const matchesSession =
        state.classicFilters.session === "all" || stock.session === state.classicFilters.session;
      return (
        matchesSession &&
        stock.momentum >= state.classicFilters.minMomentum &&
        stock.risk <= state.classicFilters.maxRisk &&
        stock.relativeVolume >= state.classicFilters.minRelativeVolume
      );
    },
    scoreConfig: {
      momentum: 0.95,
      safety: 1.1,
      carry: session === "intraday" ? 0.55 : 1,
      sessionBoost: session === "all" ? null : session,
    },
    meta: {
      window:
        session === "intraday"
          ? "Open to midday"
          : session === "overnight"
            ? "Power hour to next open"
            : session === "swing"
              ? "3 to 5 sessions"
              : "Flexible",
      holdBias:
        session === "intraday"
          ? "Same-day"
          : session === "overnight"
            ? "1 to 2 sessions"
            : session === "swing"
              ? "3 to 5 sessions"
              : "Adaptive",
      riskBias: state.classicFilters.maxRisk <= 30 ? "Conservative" : "Balanced",
      executionNote:
        "The classic screen lets the operator directly control the score through momentum, risk, and volume thresholds.",
      monitorFocus: `${state.classicFilters.minMomentum}+ momentum, ${state.classicFilters.minRelativeVolume.toFixed(1)}x volume, ${state.classicFilters.maxRisk} max risk`,
    },
  });

  render();
}

function runAiQuery(query) {
  const normalized = query.toLowerCase();
  const wantsLowRisk =
    /low risk|safer|controlled downside|avoid|stable|blue[- ]?chip|defensive/.test(normalized);
  const wantsOvernight = /overnight|carry|next day|hold|multi-day/.test(normalized);
  const wantsIntraday = /intraday|open|opening|session|day trade|daylong/.test(normalized);
  const wantsSwing = /swing|3 day|one week|trend continuation/.test(normalized);
  const wantsVolume = /volume|expanding volume|rel volume|participation/.test(normalized);
  const wantsTrapProtection = /trap|fade|avoid|not gap-and-fade|controlled downside/.test(normalized);

  let label = "Balanced momentum";
  let description = "Balanced momentum profile with trap-risk penalty enabled.";
  let scoreConfig = { momentum: 1, safety: 1, carry: 0.6, sessionBoost: null };
  let filter = () => true;
  let title = "Top setups right now";

  if (wantsLowRisk) {
    label = "Safety-biased";
    description = "Prioritizing stable liquidity, cleaner continuation, and lower trap risk.";
    scoreConfig = { momentum: 0.82, safety: 1.35, carry: 0.9, sessionBoost: null };
  }

  if (wantsIntraday) {
    label = wantsLowRisk ? "Intraday quality" : "Intraday momentum";
    description = wantsLowRisk
      ? "Intraday scan tuned for continuation without extreme gap risk."
      : "Intraday scan favoring price expansion, participation, and clean trend quality.";
    scoreConfig = { momentum: 1.25, safety: wantsTrapProtection ? 1.2 : 0.9, carry: 0.45, sessionBoost: "intraday" };
    filter = stock => stock.session === "intraday" || stock.quality >= 82;
    title = "Intraday opportunities";
  }

  if (wantsOvernight) {
    label = "Overnight carry";
    description = "Favoring lower-risk names with enough strength to keep carrying after the close.";
    scoreConfig = { momentum: 0.78, safety: 1.3, carry: 1.28, sessionBoost: "overnight" };
    filter = stock => stock.session !== "intraday" || stock.carry >= 72;
    title = "Overnight candidates";
  }

  if (wantsSwing) {
    label = "Swing continuation";
    description = "Biasing toward cleaner multi-session trends over explosive but fragile names.";
    scoreConfig = { momentum: 0.9, safety: 1.18, carry: 1.15, sessionBoost: "swing" };
    filter = stock => stock.session === "swing" || stock.carry >= 76;
    title = "Swing candidates";
  }

  if (wantsVolume) {
    scoreConfig.momentum += 0.08;
    description = `${description} Relative volume is weighted more heavily.`;
  }

  if (wantsTrapProtection) {
    scoreConfig.safety += 0.14;
  }

  const window =
    title === "Intraday opportunities"
      ? "Open to midday"
      : title === "Overnight candidates"
        ? "Power hour to next open"
        : title === "Swing candidates"
          ? "3 to 5 sessions"
          : "Open to midday";
  const holdBias =
    title === "Intraday opportunities"
      ? "Same-day follow-through"
      : title === "Overnight candidates"
        ? "1 to 2 sessions"
        : title === "Swing candidates"
          ? "3 to 5 sessions"
          : "Intraday to overnight";
  const riskBias =
    scoreConfig.safety >= 1.25 ? "Conservative" : scoreConfig.momentum >= 1.15 ? "Aggressive" : "Balanced";

  state.profile = createProfile({
    label,
    description,
    filter,
    title,
    scoreConfig,
    meta: {
      window,
      holdBias,
      riskBias,
      executionNote:
        title === "Intraday opportunities"
          ? "Look for names that keep structure after the open instead of fading their first push."
          : title === "Overnight candidates"
            ? "Favor names that can carry strength through the close without relying on a one-time spike."
            : title === "Swing candidates"
              ? "Let cleaner multi-session structure outrank the loudest tape action."
              : "Balance upside participation with downside control.",
      monitorFocus: wantsTrapProtection
        ? "Trap protection is active, so failed breakouts are penalized harder."
        : wantsVolume
          ? "Relative volume is weighted more heavily in this scan."
          : "Scanner is balancing conviction, participation, and risk.",
    },
  });

  elements.aiSummary.textContent = `${label} profile active. ${description}`;
  render();
}

async function refreshMarketData(options = {}) {
  if (!state.apiConfig.hasServerKey && !state.apiKey) {
    state.loadError = "Add a Twelve Data API key to fetch real market data.";
    renderConnectionState();
    render();
    return;
  }

  state.isRefreshing = true;
  if (!options.quiet) {
    state.loadError = "";
  }
  renderConnectionState();

  try {
    const symbols = trackedUniverse.map(stock => stock.symbol).join(",");
    const payload = await fetchJson(`/api/market/quotes?symbols=${encodeURIComponent(symbols)}`);
    state.quoteMap = normalizeQuotes(payload.data);
    state.lastUpdatedAt = payload.fetchedAt || new Date().toISOString();
    state.loadError = "";

    if (!state.historyMap[state.selectedSymbol]) {
      await loadHistory(state.selectedSymbol);
    }
  } catch (error) {
    state.loadError = error.message;
  } finally {
    state.isRefreshing = false;
    renderConnectionState();
    render();
  }
}

async function loadHistory(symbol) {
  if (!symbol) {
    return;
  }

  state.isLoadingHistory = true;
  renderConnectionState();

  try {
    const payload = await fetchJson(
      `/api/market/history?symbol=${encodeURIComponent(symbol)}&interval=${encodeURIComponent(HISTORY_INTERVAL)}&outputsize=${HISTORY_POINTS}`,
    );
    state.historyMap[symbol] = normalizeHistory(payload.data);
    state.loadError = "";
  } catch (error) {
    state.loadError = error.message;
  } finally {
    state.isLoadingHistory = false;
    renderConnectionState();
    render();
  }
}

function normalizeQuotes(rawData) {
  if (!rawData) {
    return {};
  }
  if (rawData.symbol) {
    return { [rawData.symbol]: rawData };
  }
  return rawData;
}

function normalizeHistory(rawData) {
  const values = rawData?.values || [];
  return values
    .map(item => Number(item.close))
    .filter(value => Number.isFinite(value))
    .reverse();
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: getApiHeaders(),
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || "Market data request failed.");
  }
  return payload;
}

function getApiHeaders() {
  if (state.apiConfig.hasServerKey || !state.apiKey) {
    return {};
  }

  return {
    "x-api-key": state.apiKey,
  };
}

function getLiveUniverse() {
  return trackedUniverse
    .map(meta => buildStock(meta, state.quoteMap[meta.symbol]))
    .filter(Boolean);
}

function buildStock(meta, quote) {
  if (!quote || quote.status === "error") {
    return null;
  }

  const price = numberOrNull(quote.close) ?? numberOrNull(quote.price);
  const previousClose = numberOrNull(quote.previous_close);
  const open = numberOrNull(quote.open);
  const high = numberOrNull(quote.high);
  const low = numberOrNull(quote.low);
  const volume = numberOrNull(quote.volume);
  const averageVolume = numberOrNull(quote.average_volume);
  const changePct =
    numberOrNull(quote.percent_change) ??
    (price && previousClose ? ((price - previousClose) / previousClose) * 100 : 0);
  const relativeVolume =
    volume && averageVolume ? clamp(volume / averageVolume, 0.3, 5) : 1;
  const volatility =
    high && low && previousClose ? ((high - low) / previousClose) * 100 : Math.abs(changePct) * 1.15;
  const closePosition =
    high && low && price ? clamp((price - low) / Math.max(high - low, 0.01), 0, 1) : 0.5;
  const momentum = clamp(Math.round(62 + changePct * 6 + relativeVolume * 8 + closePosition * 7), 40, 96);
  const risk = clamp(Math.round(56 - changePct * 4 + volatility * 6 - relativeVolume * 5 - closePosition * 7), 14, 78);
  const liquidity = clamp(
    Math.round(40 + Math.log10(Math.max(volume || 1000, 1000)) * 10 + relativeVolume * 8),
    35,
    99,
  );
  const carry = clamp(Math.round(52 + changePct * 3 + closePosition * 18 + relativeVolume * 7), 42, 94);
  const quality = clamp(Math.round(48 + closePosition * 28 + relativeVolume * 7 - volatility * 1.6), 40, 94);
  const gap = open && previousClose ? ((open - previousClose) / previousClose) * 100 : 0;

  return {
    ...meta,
    price: price ?? 0,
    changePct: round(changePct, 2),
    momentum,
    risk,
    relativeVolume: round(relativeVolume, 1),
    liquidity,
    gap: round(gap, 2),
    carry,
    quality,
    volume: volume ?? 0,
    averageVolume: averageVolume ?? 0,
    high: high ?? price ?? 0,
    low: low ?? price ?? 0,
    open: open ?? previousClose ?? price ?? 0,
    previousClose: previousClose ?? price ?? 0,
    headline: buildHeadline(meta, changePct, relativeVolume, closePosition, volatility),
  };
}

function buildHeadline(meta, changePct, relativeVolume, closePosition, volatility) {
  if (changePct > 1.5 && relativeVolume >= 1.2) {
    return `${meta.symbol} is outperforming its average activity level with strong price expansion.`;
  }
  if (changePct >= 0 && closePosition >= 0.65) {
    return `${meta.symbol} is holding near the upper end of its session range, which supports continuation.`;
  }
  if (volatility >= 4) {
    return `${meta.symbol} has a wider intraday range, so the setup needs cleaner confirmation before sizing up.`;
  }
  return `${meta.symbol} is trading in a steadier profile, which can suit lower-risk continuation scans.`;
}

function compositeScore(stock, config) {
  const sessionBonus =
    config.sessionBoost && stock.session === config.sessionBoost
      ? 7
      : config.sessionBoost && stock.session !== config.sessionBoost
        ? -4
        : 0;
  const safetyScore = 100 - stock.risk;
  const participationScore = stock.relativeVolume * 20;
  const raw =
    stock.momentum * (0.42 * config.momentum) +
    safetyScore * (0.28 * config.safety) +
    participationScore * 0.12 +
    stock.liquidity * 0.1 +
    stock.carry * (0.08 * config.carry) +
    stock.quality * 0.08 +
    sessionBonus;

  return clamp(Math.round(raw / 1.08), 58, 96);
}

function createProfile({ label, description, title, filter, scoreConfig, meta }) {
  return {
    label,
    description,
    title,
    filter,
    config: scoreConfig,
    meta,
    score: stock => compositeScore(stock, scoreConfig),
  };
}

function getWeightMix(config) {
  const buckets = [
    { label: "Momentum", value: 42 * config.momentum },
    { label: "Safety", value: 28 * config.safety },
    { label: "Participation", value: 18 },
    { label: "Carry", value: 12 * config.carry },
  ];
  const total = buckets.reduce((sum, bucket) => sum + bucket.value, 0);

  return buckets.map(bucket => ({
    ...bucket,
    share: Math.round((bucket.value / total) * 100),
  }));
}

function getRankedUniverse() {
  return getLiveUniverse()
    .map(stock => ({ ...stock, score: state.profile.score(stock) }))
    .filter(stock => state.profile.filter(stock))
    .filter(stock => {
      if (!state.searchTerm) {
        return true;
      }

      const haystack = `${stock.symbol} ${stock.name} ${stock.theme} ${stock.sector}`.toLowerCase();
      return haystack.includes(state.searchTerm);
    })
    .sort((left, right) => right.score - left.score);
}

function render() {
  const ranked = getRankedUniverse();
  if (ranked.length && !ranked.some(stock => stock.symbol === state.selectedSymbol)) {
    state.selectedSymbol = ranked[0].symbol;
  }

  renderPulseStrip(ranked);
  renderWatchlist();
  renderBrief(ranked);
  renderOpportunityList(ranked);
  renderInspector(ranked);
  renderExecutionMap(ranked);
  renderConnectionState();
  elements.lastUpdated.textContent = state.lastUpdatedAt
    ? `Updated ${new Date(state.lastUpdatedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })}`
    : "Waiting for first data pull";
}

function renderConnectionState() {
  if (state.isRefreshing) {
    elements.feedStatus.textContent = "Refreshing market quotes";
    elements.connectionState.textContent = "Requesting fresh market data from Twelve Data.";
  } else if (state.isLoadingHistory) {
    elements.feedStatus.textContent = "Loading chart history";
    elements.connectionState.textContent = "Pulling historical bars for the selected symbol.";
  } else if (state.loadError) {
    elements.feedStatus.textContent = "Market data unavailable";
    elements.connectionState.textContent = state.loadError;
  } else if (Object.keys(state.quoteMap).length) {
    elements.feedStatus.textContent = "Real market data connected";
    elements.connectionState.textContent = state.apiConfig.hasServerKey
      ? "Server-side API key detected. This build is ready for public deployment."
      : "Using a browser-stored API key. Fine for local testing; use a server env var for public deploys.";
  } else {
    elements.feedStatus.textContent = "Waiting for market data connection";
    elements.connectionState.textContent =
      "Add a free Twelve Data API key or configure a server key before running the scanner.";
  }

  elements.dataSourceNote.textContent =
    "Free-tier mode tracks a curated universe and refreshes once per minute to stay within API-credit limits.";
}

function renderPulseStrip(ranked) {
  const positiveBreadth = ranked.filter(stock => stock.changePct > 0).length;
  const averageScore = ranked.length
    ? Math.round(ranked.reduce((total, stock) => total + stock.score, 0) / ranked.length)
    : 0;
  const bestRelativeVolume = ranked.length
    ? `${Math.max(...ranked.map(stock => stock.relativeVolume)).toFixed(1)}x`
    : "--";
  const averageRisk = ranked.length
    ? `${Math.round(ranked.reduce((total, stock) => total + stock.risk, 0) / ranked.length)} / 100`
    : "--";

  const items = [
    { label: "Scanner profile", value: state.profile.label, note: "Free-data sample universe" },
    { label: "Matches", value: String(ranked.length).padStart(2, "0"), note: `${positiveBreadth} names green on session` },
    { label: "Average conviction", value: averageScore || "--", note: `Risk average ${averageRisk}` },
    { label: "Peak rel. volume", value: bestRelativeVolume, note: "Highest participation in scan" },
  ];

  elements.pulseStrip.innerHTML = items
    .map(
      item => `
        <article class="pulse-item">
          <span class="section-label">${item.label}</span>
          <strong>${item.value}</strong>
          <span>${item.note}</span>
        </article>
      `,
    )
    .join("");
}

function renderWatchlist() {
  elements.watchlistCount.textContent = `${state.watchlist.length} saved`;
  if (!state.watchlist.length) {
    elements.watchlistList.innerHTML =
      `<p class="muted">Save symbols from the opportunity board to build a quick watchlist.</p>`;
    return;
  }

  const liveUniverse = getLiveUniverse();
  const savedStocks = state.watchlist
    .map(symbol => liveUniverse.find(stock => stock.symbol === symbol))
    .filter(Boolean);

  elements.watchlistList.innerHTML = savedStocks
    .map(
      stock => `
        <button class="watchlist-item" data-watch-symbol="${stock.symbol}">
          <div>
            <strong>${stock.symbol}</strong>
            <span>${stock.theme}</span>
          </div>
          <span class="${stock.changePct >= 0 ? "positive" : "negative"}">${formatSigned(stock.changePct)}%</span>
        </button>
      `,
    )
    .join("");

  [...elements.watchlistList.querySelectorAll("[data-watch-symbol]")].forEach(button => {
    button.addEventListener("click", async () => {
      state.selectedSymbol = button.dataset.watchSymbol;
      if (!state.historyMap[state.selectedSymbol]) {
        await loadHistory(state.selectedSymbol);
      } else {
        render();
      }
    });
  });
}

function renderBrief(ranked) {
  const top = ranked[0];
  elements.briefHeadline.textContent = top
    ? `${state.profile.label} is highlighting ${top.symbol} and other clean setups.`
    : "SignalDeck is waiting for real market data before ranking setups.";
  elements.briefWindow.textContent = state.profile.meta.window;
  elements.briefBody.textContent = state.profile.meta.executionNote;

  const metrics = [
    ["Hold bias", state.profile.meta.holdBias],
    ["Risk posture", state.profile.meta.riskBias],
    ["Monitor", state.profile.meta.monitorFocus],
  ];

  elements.briefMetrics.innerHTML = metrics
    .map(
      ([label, value]) => `
        <div>
          <dt>${label}</dt>
          <dd>${value}</dd>
        </div>
      `,
    )
    .join("");

  elements.weightCaption.textContent = "Live score mix";
  elements.weightBars.innerHTML = getWeightMix(state.profile.config)
    .map(
      bucket => `
        <div class="weight-row">
          <span>${bucket.label}</span>
          <div class="weight-track"><span style="width:${bucket.share}%"></span></div>
          <strong>${bucket.share}%</strong>
        </div>
      `,
    )
    .join("");
}

function renderOpportunityList(ranked) {
  elements.resultsTitle.textContent = state.profile.title;
  elements.resultsMeta.textContent = `${ranked.length} matches`;

  if (!ranked.length) {
    elements.opportunityList.innerHTML = `
      <div class="opportunity-row">
        <span></span>
        <div class="ticker-meta">
          <strong>No live matches</strong>
          <span>${state.loadError || "Connect a market-data key or widen the filters."}</span>
        </div>
      </div>
    `;
    return;
  }

  elements.opportunityList.innerHTML = ranked
    .map(
      stock => `
        <button class="opportunity-row ${stock.symbol === state.selectedSymbol ? "active" : ""}" data-symbol="${stock.symbol}">
          <span class="save-cell">
            <span class="save-button ${state.watchlist.includes(stock.symbol) ? "saved" : ""}" data-save-symbol="${stock.symbol}" role="button" aria-label="Save ${stock.symbol}">${state.watchlist.includes(stock.symbol) ? "★" : "☆"}</span>
          </span>
          <div class="ticker-meta">
            <strong>${stock.symbol}</strong>
            <span>${stock.name}</span>
          </div>
          <div>$${stock.price.toFixed(2)} <span class="${stock.changePct >= 0 ? "positive" : "negative"}">${formatSigned(stock.changePct)}%</span></div>
          <div>${stock.momentum}</div>
          <div>${stock.risk}</div>
          <div><span class="score-pill">${stock.score}</span></div>
        </button>
      `,
    )
    .join("");

  [...elements.opportunityList.querySelectorAll(".opportunity-row")].forEach(button => {
    button.addEventListener("click", async () => {
      state.selectedSymbol = button.dataset.symbol;
      if (!state.historyMap[state.selectedSymbol]) {
        await loadHistory(state.selectedSymbol);
      } else {
        render();
      }
    });
  });

  [...elements.opportunityList.querySelectorAll("[data-save-symbol]")].forEach(button => {
    button.addEventListener("click", event => {
      event.stopPropagation();
      toggleWatchlist(button.dataset.saveSymbol);
    });
  });
}

function renderInspector(ranked) {
  const liveUniverse = getLiveUniverse();
  const selected =
    ranked.find(stock => stock.symbol === state.selectedSymbol) ||
    liveUniverse.find(stock => stock.symbol === state.selectedSymbol);

  if (!selected) {
    elements.inspectorSymbol.textContent = "--";
    elements.inspectorTag.textContent = "Awaiting data";
    elements.inspectorPrice.textContent = "--";
    elements.inspectorScore.textContent = "--";
    elements.signalList.innerHTML = `<li>Connect the data source to inspect a symbol.</li>`;
    elements.riskFill.style.width = "0%";
    elements.riskScoreLabel.textContent = "--";
    elements.riskNote.textContent = "Risk context appears here once live quotes arrive.";
    elements.contextGrid.innerHTML = "";
    renderSparkline([]);
    return;
  }

  const score = selected.score ?? state.profile.score(selected);
  const history = state.historyMap[selected.symbol] || [];

  elements.inspectorSymbol.textContent = selected.symbol;
  elements.inspectorTag.textContent = selected.trend;
  elements.inspectorPrice.textContent = `$${selected.price.toFixed(2)}`;
  elements.inspectorScore.textContent = score;

  const signals = [
    `${selected.symbol} is showing <strong>${selected.momentum}</strong> momentum with <strong>${selected.relativeVolume.toFixed(1)}x</strong> relative volume.`,
    `<strong>${selected.quality}</strong> trend quality suggests buyers are ${selected.changePct >= 0 ? "holding gains" : "still testing support"} instead of fully giving up the move.`,
    `${selected.theme} remains the dominant theme, while <strong>${selected.liquidity}</strong> liquidity keeps entries more efficient.`,
    selected.headline,
  ];

  elements.signalList.innerHTML = signals.map(text => `<li>${text}</li>`).join("");

  elements.riskFill.style.width = `${selected.risk}%`;
  elements.riskScoreLabel.textContent = `${selected.risk} / 100 risk`;
  elements.riskNote.textContent =
    selected.risk <= 25
      ? "Risk is relatively contained for this profile."
      : selected.risk <= 40
        ? "Moderate risk, but participation and structure still support the setup."
        : "Elevated risk means this name needs tighter confirmation before aggressive sizing.";

  const context = [
    ["Sector", selected.sector],
    ["Theme", selected.theme],
    ["Market cap", selected.marketCap],
    ["Session bias", toTitleCase(selected.session)],
    ["Gap profile", `${formatSigned(selected.gap)}%`],
    ["Average volume", selected.averageVolume ? formatCompactNumber(selected.averageVolume) : "--"],
  ];

  elements.contextGrid.innerHTML = context
    .map(
      ([label, value]) => `
        <div>
          <dt>${label}</dt>
          <dd>${value}</dd>
        </div>
      `,
    )
    .join("");

  renderSparkline(history);
}

function renderExecutionMap(ranked) {
  const liveUniverse = getLiveUniverse();
  const selected =
    ranked.find(stock => stock.symbol === state.selectedSymbol) ||
    liveUniverse.find(stock => stock.symbol === state.selectedSymbol);

  if (!selected) {
    elements.executionHeadline.textContent = "Execution view appears once a live symbol is selected.";
    elements.executionChip.textContent = "Waiting";
    elements.executionBody.textContent =
      "This panel will turn quote data into a simple trading plan and confirmation checklist.";
    elements.executionGridList.innerHTML = "";
    elements.monitorList.innerHTML = `<li>Connect real market data to enable the execution map.</li>`;
    return;
  }

  const horizon =
    selected.session === "intraday"
      ? "Same day"
      : selected.session === "overnight"
        ? "1 to 2 sessions"
        : "3 to 5 sessions";
  const confirmation =
    selected.relativeVolume >= 1.2
      ? "Participation is already above average volume."
      : "Wait for volume to keep building before trusting the move.";
  const invalidation =
    selected.risk <= 25
      ? "A clean breakdown in trend quality would weaken the thesis."
      : "Loss of relative strength would weaken the setup.";

  elements.executionHeadline.textContent = `${selected.symbol} fits the ${state.profile.label.toLowerCase()} profile best when structure stays intact.`;
  elements.executionChip.textContent = `${toTitleCase(selected.session)} plan`;
  elements.executionBody.textContent = `${selected.name} is being surfaced for ${selected.theme.toLowerCase()}, but the better expression is to let price and participation confirm before getting aggressive.`;

  const executionRows = [
    ["Best use case", selected.trend],
    ["Ideal hold", horizon],
    ["Confirmation", confirmation],
    ["Invalidation", invalidation],
    ["Liquidity", `${selected.liquidity} / 100`],
    ["Relative volume", `${selected.relativeVolume.toFixed(1)}x`],
  ];

  elements.executionGridList.innerHTML = executionRows
    .map(
      ([label, value]) => `
        <div>
          <dt>${label}</dt>
          <dd>${value}</dd>
        </div>
      `,
    )
    .join("");

  const monitorItems = [
    `Watch whether ${selected.symbol} keeps its intraday structure instead of giving back the move.`,
    `Relative volume should stay near or above ${Math.max(1.1, selected.relativeVolume - 0.1).toFixed(1)}x to maintain conviction.`,
    `${selected.risk <= 30 ? "Trap risk is relatively low, so focus on persistence." : "Risk is elevated, so failed continuation should be treated as a warning."}`,
    `The current scanner profile is ${state.profile.meta.riskBias.toLowerCase()}, so position sizing should reflect that posture.`,
  ];

  elements.monitorList.innerHTML = monitorItems.map(item => `<li>${item}</li>`).join("");
}

function renderSparkline(history) {
  if (!history.length) {
    elements.sparkline.innerHTML = `
      <line class="sparkline-grid" x1="0" y1="56" x2="320" y2="56"></line>
      <text x="10" y="58" fill="rgba(148,166,189,0.9)" font-size="12" font-family="IBM Plex Mono, monospace">
        Load a symbol to fetch recent price bars
      </text>
    `;
    return;
  }

  const min = Math.min(...history);
  const max = Math.max(...history);
  const width = 320;
  const height = 110;
  const points = history
    .map((price, index) => {
      const x = (index / (history.length - 1)) * width;
      const y = height - ((price - min) / Math.max(max - min, 0.01)) * (height - 8) - 4;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
  const fillPoints = `0,110 ${points} 320,110`;

  elements.sparkline.innerHTML = `
    <defs>
      <linearGradient id="sparkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#7ef29a"></stop>
        <stop offset="100%" stop-color="#f4b24d"></stop>
      </linearGradient>
    </defs>
    <line class="sparkline-grid" x1="0" y1="88" x2="320" y2="88"></line>
    <line class="sparkline-grid" x1="0" y1="56" x2="320" y2="56"></line>
    <line class="sparkline-grid" x1="0" y1="24" x2="320" y2="24"></line>
    <polygon class="sparkline-fill" points="${fillPoints}"></polygon>
    <polyline class="sparkline-line" points="${points}"></polyline>
  `;
}

function toggleWatchlist(symbol) {
  if (state.watchlist.includes(symbol)) {
    state.watchlist = state.watchlist.filter(item => item !== symbol);
  } else {
    state.watchlist = [...state.watchlist, symbol];
  }

  saveWatchlist(state.watchlist);
  render();
}

function loadStoredApiKey() {
  try {
    return window.localStorage.getItem("signaldeck-api-key") || "";
  } catch (error) {
    return "";
  }
}

function saveStoredApiKey(apiKey) {
  try {
    if (apiKey) {
      window.localStorage.setItem("signaldeck-api-key", apiKey);
    } else {
      window.localStorage.removeItem("signaldeck-api-key");
    }
  } catch (error) {
    console.warn("Unable to persist API key", error);
  }
}

function loadWatchlist() {
  try {
    const raw = window.localStorage.getItem("signaldeck-watchlist");
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function saveWatchlist(watchlist) {
  try {
    window.localStorage.setItem("signaldeck-watchlist", JSON.stringify(watchlist));
  } catch (error) {
    console.warn("Unable to persist watchlist", error);
  }
}

function numberOrNull(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function round(value, decimals) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function formatSigned(value) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}`;
}

function toTitleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatCompactNumber(value) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
