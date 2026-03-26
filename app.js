const SUPABASE_URL = "https://lebhgypjdikxhjbgoklb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_soubqDA83uJO_-lwCy0JmQ_3ghqNddv";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

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

const FORMULA_FIELDS = [
  { key: "price", label: "Price", type: "number" },
  { key: "changePct", label: "Session change %", type: "number" },
  { key: "gap", label: "Gap %", type: "number" },
  { key: "drivePct", label: "Drive from open %", type: "number" },
  { key: "momentum", label: "Momentum", type: "number" },
  { key: "risk", label: "Risk", type: "number" },
  { key: "relativeVolume", label: "Relative volume", type: "number" },
  { key: "quality", label: "Trend quality", type: "number" },
  { key: "carry", label: "Carry strength", type: "number" },
  { key: "liquidity", label: "Liquidity", type: "number" },
  { key: "volatility", label: "Volatility", type: "number" },
  { key: "closePosition", label: "Close position", type: "number" },
  { key: "proxyVwap", label: "VWAP proxy", type: "number" },
  { key: "vwapDrift", label: "Distance from VWAP proxy %", type: "number" },
  { key: "turnover", label: "Approx. turnover", type: "number" },
  { key: "rangePct", label: "Range %", type: "number" },
  { key: "sector", label: "Sector", type: "text" },
  { key: "theme", label: "Theme", type: "text" },
  { key: "session", label: "Session bias", type: "text" },
  { key: "marketCap", label: "Market cap", type: "text" },
];

const CLASSIC_PRESETS = {
  "opening-drive": {
    label: "Opening drive",
    filters: {
      session: "intraday",
      minMomentum: 74,
      maxRisk: 46,
      minRelativeVolume: 1.8,
      sector: "all",
      marketCap: "all",
      minQuality: 72,
      sortBy: "momentum",
      minPrice: 8,
      maxPrice: 80,
      theme: "all",
      groupMode: "AND",
      formulaRules: [
        { id: createRuleId(), field: "gap", operator: ">=", value: "1.5", negate: false },
        { id: createRuleId(), field: "drivePct", operator: ">=", value: "0.4", negate: false },
        { id: createRuleId(), field: "turnover", operator: ">=", value: "8000000", negate: false },
      ],
    },
    summary: "Opening drive loads intraday names with real participation, a constructive gap, and clear drive from the open.",
  },
  "vwap-reclaim": {
    label: "VWAP reclaim",
    filters: {
      session: "intraday",
      minMomentum: 66,
      maxRisk: 42,
      minRelativeVolume: 1.4,
      sector: "all",
      marketCap: "all",
      minQuality: 68,
      sortBy: "quality",
      minPrice: 10,
      maxPrice: 150,
      theme: "all",
      groupMode: "AND",
      formulaRules: [
        { id: createRuleId(), field: "vwapDrift", operator: ">=", value: "0.15", negate: false },
        { id: createRuleId(), field: "closePosition", operator: ">=", value: "0.58", negate: false },
        { id: createRuleId(), field: "relativeVolume", operator: ">=", value: "1.4", negate: false },
      ],
    },
    summary: "VWAP reclaim uses a quote-structure VWAP proxy for now, surfacing names that are holding back above value after early pressure.",
  },
  "liquidity-sweep": {
    label: "Liquidity sweep",
    filters: {
      session: "all",
      minMomentum: 70,
      maxRisk: 52,
      minRelativeVolume: 2.1,
      sector: "all",
      marketCap: "all",
      minQuality: 66,
      sortBy: "relativeVolume",
      minPrice: 5,
      maxPrice: 200,
      theme: "all",
      groupMode: "OR",
      formulaRules: [
        { id: createRuleId(), field: "turnover", operator: ">=", value: "12000000", negate: false },
        { id: createRuleId(), field: "rangePct", operator: ">=", value: "2.4", negate: false },
      ],
    },
    summary: "Liquidity sweep biases toward faster tape, bigger turnover, and names that are actually attracting capital.",
  },
  "clean-carry": {
    label: "Clean carry",
    filters: {
      session: "overnight",
      minMomentum: 60,
      maxRisk: 34,
      minRelativeVolume: 1.2,
      sector: "all",
      marketCap: "Mega cap",
      minQuality: 74,
      sortBy: "score",
      minPrice: 20,
      maxPrice: 300,
      theme: "all",
      groupMode: "AND",
      formulaRules: [
        { id: createRuleId(), field: "carry", operator: ">=", value: "74", negate: false },
        { id: createRuleId(), field: "vwapDrift", operator: ">=", value: "-0.3", negate: false },
      ],
    },
    summary: "Clean carry cuts out fragile tape and prefers higher-quality liquid names that can hold into the next session.",
  },
};

const REFRESH_INTERVAL_MS = 1000 * 60 * 4;
const HISTORY_INTERVAL = "15min";
const HISTORY_POINTS = 24;

const state = {
  surfaceMode: "ai",
  selectedSymbol: "NVDA",
  authMode: "login",
  currentUser: null,
  accountMenuOpen: false,
  aiWorking: false,
  apiKey: loadStoredApiKey(),
  apiConfig: { hasServerKey: false, provider: "Twelve Data" },
  marketTransport: "idle",
  quoteMap: {},
  historyMap: {},
  lastUpdatedAt: null,
  isRefreshing: false,
  isLoadingHistory: false,
  loadError: "",
  watchlist: loadWatchlist(),
  searchTerm: "",
  authMessage: "Guest mode stores watchlists only in this browser.",
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
      intentChips: ["Balanced horizon", "Flow-aware", "Trap filter on"],
      rationale: [
        "The default scan balances momentum against downside control instead of rewarding the loudest gap.",
        "Trend quality and relative volume stay high in the score so thin breakouts lose rank quickly.",
        "This baseline profile is a clean way to demo live names before specializing the horizon.",
      ],
    },
  }),
  classicFilters: {
    session: "all",
    minMomentum: 68,
    maxRisk: 48,
    minRelativeVolume: 1.5,
    sector: "all",
    marketCap: "all",
    minQuality: 70,
    sortBy: "score",
    minPrice: 0,
    maxPrice: 9999,
    theme: "all",
    groupMode: "AND",
    formulaRules: [
      { id: createRuleId(), field: "relativeVolume", operator: ">=", value: "1.5", negate: false },
      { id: createRuleId(), field: "quality", operator: ">=", value: "70", negate: false },
    ],
  },
};

const elements = {
  promptButtons: [...document.querySelectorAll(".prompt-pill")],
  presetButtons: [...document.querySelectorAll("[data-preset]")],
  tabs: [...document.querySelectorAll(".surface-tab")],
  panels: [...document.querySelectorAll(".mode-panel")],
  authTabs: [...document.querySelectorAll(".auth-tab")],
  aiQuery: document.getElementById("ai-query"),
  runAi: document.getElementById("run-ai"),
  aiSummary: document.getElementById("ai-summary"),
  intentChips: document.getElementById("intent-chips"),
  aiRationale: document.getElementById("ai-rationale"),
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
  watchlistNote: document.getElementById("watchlist-note"),
  accountBadge: document.getElementById("account-badge"),
  accountCopy: document.getElementById("account-copy"),
  authEmail: document.getElementById("auth-email"),
  authPassword: document.getElementById("auth-password"),
  authSubmit: document.getElementById("auth-submit"),
  authGoogle: document.getElementById("auth-google"),
  authLogout: document.getElementById("auth-logout"),
  authMessage: document.getElementById("auth-message"),
  topbarSignIn: document.getElementById("topbar-signin"),
  topbarRegister: document.getElementById("topbar-register"),
  topbarAccount: document.getElementById("topbar-account"),
  accountTrigger: document.getElementById("account-trigger"),
  accountDrawer: document.getElementById("account-drawer"),
  accountAvatar: document.getElementById("account-avatar"),
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
  sectorFilter: document.getElementById("sector-filter"),
  marketCapFilter: document.getElementById("market-cap-filter"),
  qualityFilter: document.getElementById("quality-filter"),
  sortFilter: document.getElementById("sort-filter"),
  priceMinFilter: document.getElementById("price-min-filter"),
  priceMaxFilter: document.getElementById("price-max-filter"),
  themeFilter: document.getElementById("theme-filter"),
  formulaRuleList: document.getElementById("formula-rule-list"),
  addFormulaRule: document.getElementById("add-formula-rule"),
  formulaSummary: document.getElementById("formula-summary"),
  presetSummary: document.getElementById("preset-summary"),
  logicModeFilter: document.getElementById("logic-mode-filter"),
  momentumValue: document.getElementById("momentum-value"),
  riskValue: document.getElementById("risk-value"),
  volumeValue: document.getElementById("volume-value"),
  qualityValue: document.getElementById("quality-value"),
  applyFilters: document.getElementById("apply-filters"),
  executionHeadline: document.getElementById("execution-headline"),
  executionChip: document.getElementById("execution-chip"),
  executionBody: document.getElementById("execution-body"),
  executionGridList: document.getElementById("execution-grid-list"),
  monitorList: document.getElementById("monitor-list"),
  spotlightCaption: document.getElementById("spotlight-caption"),
  spotlightSymbol: document.getElementById("spotlight-symbol"),
  spotlightTheme: document.getElementById("spotlight-theme"),
  spotlightMetrics: document.getElementById("spotlight-metrics"),
  spotlightNote: document.getElementById("spotlight-note"),
};

bindEvents();
bindSupabaseAuthListener();
initialize();

async function initialize() {
  elements.apiKeyInput.value = state.apiKey;
  syncClassicControls();
  runAiQuery(elements.aiQuery.value.trim());
  render();
  await fetchConfig();
  await fetchSession();
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
      handleAiRun(button.dataset.prompt);
    });
  });

  elements.presetButtons.forEach(button => {
    button.addEventListener("click", () => applyClassicPreset(button.dataset.preset));
  });

  elements.tabs.forEach(button => {
    button.addEventListener("click", () => setSurfaceMode(button.dataset.mode));
  });

  elements.authTabs.forEach(button => {
    button.addEventListener("click", () => setAuthMode(button.dataset.authMode));
  });
  elements.topbarSignIn.addEventListener("click", () => {
    state.accountMenuOpen = true;
    setAuthMode("login");
    renderAuthState();
  });
  elements.topbarRegister.addEventListener("click", () => {
    state.accountMenuOpen = true;
    setAuthMode("register");
    renderAuthState();
  });
  elements.accountTrigger.addEventListener("click", () => {
    state.accountMenuOpen = !state.accountMenuOpen;
    renderAuthState();
  });

  elements.runAi.addEventListener("click", () => handleAiRun(elements.aiQuery.value.trim()));
  elements.applyFilters.addEventListener("click", applyClassicFilters);
  elements.refreshMarket.addEventListener("click", () => refreshMarketData());
  elements.authSubmit.addEventListener("click", handleAuthSubmit);
  elements.authGoogle.addEventListener("click", handleGoogleAuth);
  elements.authLogout.addEventListener("click", handleLogout);
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
  elements.qualityFilter.addEventListener("input", event => {
    elements.qualityValue.textContent = event.target.value;
  });
  elements.logicModeFilter.addEventListener("change", event => {
    state.classicFilters.groupMode = event.target.value;
    renderFormulaRules();
  });
  elements.addFormulaRule.addEventListener("click", () => {
    state.classicFilters.formulaRules.push(createFormulaRule());
    renderFormulaRules();
  });
  document.addEventListener("click", event => {
    if (!state.accountMenuOpen) {
      return;
    }
    if (!event.target.closest(".account-shell")) {
      state.accountMenuOpen = false;
      renderAuthState();
    }
  });
}

async function handleAiRun(nextQuery) {
  const query = (nextQuery || "").trim();
  if (!query) {
    elements.aiSummary.textContent = "Enter a prompt so SignalDeck can build a scan profile.";
    return;
  }

  elements.aiQuery.value = query;
  state.aiWorking = true;
  renderSurfaceState();
  await wait(420);
  runAiQuery(query);
  state.aiWorking = false;
  render();
}

function syncClassicControls() {
  elements.sessionFilter.value = state.classicFilters.session;
  elements.momentumFilter.value = String(state.classicFilters.minMomentum);
  elements.riskFilter.value = String(state.classicFilters.maxRisk);
  elements.volumeFilter.value = String(Math.round(state.classicFilters.minRelativeVolume * 10));
  elements.sectorFilter.value = state.classicFilters.sector;
  elements.marketCapFilter.value = state.classicFilters.marketCap;
  elements.qualityFilter.value = String(state.classicFilters.minQuality);
  elements.sortFilter.value = state.classicFilters.sortBy;
  elements.priceMinFilter.value = String(state.classicFilters.minPrice);
  elements.priceMaxFilter.value = String(state.classicFilters.maxPrice);
  elements.themeFilter.value = state.classicFilters.theme;
  elements.logicModeFilter.value = state.classicFilters.groupMode;
  elements.momentumValue.textContent = String(state.classicFilters.minMomentum);
  elements.riskValue.textContent = String(state.classicFilters.maxRisk);
  elements.volumeValue.textContent = `${state.classicFilters.minRelativeVolume.toFixed(1)}x`;
  elements.qualityValue.textContent = String(state.classicFilters.minQuality);
}

function applyClassicPreset(presetKey) {
  const preset = CLASSIC_PRESETS[presetKey];
  if (!preset) {
    return;
  }

  state.classicFilters = {
    ...preset.filters,
    formulaRules: preset.filters.formulaRules.map(rule => ({ ...rule, id: createRuleId() })),
  };
  syncClassicControls();
  elements.presetSummary.textContent = `${preset.label} loaded. ${preset.summary}`;
  renderFormulaRules();
  applyClassicFilters();
}

function createFormulaRule() {
  return { id: createRuleId(), field: "relativeVolume", operator: ">=", value: "1.5", negate: false };
}

function createRuleId() {
  return `rule-${Math.random().toString(36).slice(2, 10)}`;
}

function getAccountLabel(user) {
  if (!user?.email) {
    return "Guest mode";
  }

  return user.email.length > 28 ? `${user.email.slice(0, 25)}...` : user.email;
}

function getAccountInitials(user) {
  const source = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || "Guest";
  const clean = String(source).trim();
  if (!clean) {
    return "G";
  }

  const parts = clean
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2);
  if (!parts.length) {
    return "G";
  }

  return parts
    .map(part => part[0])
    .join("")
    .toUpperCase();
}

function sanitizeFormulaRules(rules) {
  return (Array.isArray(rules) ? rules : [])
    .map(rule => ({
      id: rule.id || createRuleId(),
      field: getFormulaFieldMeta(rule.field)?.key || "relativeVolume",
      operator: rule.operator || ">=",
      value: String(rule.value ?? ""),
      negate: Boolean(rule.negate),
    }));
}

function getFormulaFieldMeta(fieldKey) {
  return FORMULA_FIELDS.find(field => field.key === fieldKey) || null;
}

function getOperatorsForRule(rule) {
  return getFormulaFieldMeta(rule.field)?.type === "text"
    ? ["is", "contains", "is not"]
    : [">=", ">", "<=", "<", "=", "!="];
}

function updateFormulaRule(ruleId, prop, value) {
  const rule = state.classicFilters.formulaRules.find(entry => entry.id === ruleId);
  if (!rule) {
    return;
  }

  rule[prop] = prop === "negate" ? Boolean(value) : value;
  if (prop === "field") {
    rule.operator = getOperatorsForRule(rule)[0];
    rule.value = getFormulaFieldMeta(value)?.type === "text" ? "" : "0";
  }
  renderFormulaRules();
}

function matchesFormulaRules(stock, rules, groupMode = "AND") {
  const activeRules = sanitizeFormulaRules(rules).filter(rule => String(rule.value).trim() !== "");
  if (!activeRules.length) {
    return true;
  }

  const results = activeRules.map(rule => evaluateFormulaRule(stock, rule));
  const any = results.some(Boolean);
  const all = results.every(Boolean);

  switch (String(groupMode || "AND").toUpperCase()) {
    case "OR":
      return any;
    case "NAND":
      return !all;
    case "NOR":
      return !any;
    default:
      return all;
  }
}

function evaluateFormulaRule(stock, rule) {
  const meta = getFormulaFieldMeta(rule.field);
  if (!meta) {
    return true;
  }

  const stockValue = stock[rule.field];
  if (meta.type === "text") {
    const left = String(stockValue || "").toLowerCase();
    const right = String(rule.value || "").toLowerCase();
    if (!right) {
      return true;
    }
    let result = left === right;
    if (rule.operator === "contains") {
      result = left.includes(right);
    } else if (rule.operator === "is not") {
      result = left !== right;
    }
    return rule.negate ? !result : result;
  }

  const left = Number(stockValue);
  const right = Number(rule.value);
  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    return true;
  }

  let result;
  switch (rule.operator) {
    case ">=":
      result = left >= right;
      break;
    case ">":
      result = left > right;
      break;
    case "<=":
      result = left <= right;
      break;
    case "<":
      result = left < right;
      break;
    case "!=":
      result = left !== right;
      break;
    default:
      result = left === right;
      break;
  }

  return rule.negate ? !result : result;
}

async function fetchSession() {
  try {
    const { data, error } = await supabaseClient.auth.getUser();
    if (error) {
      throw error;
    }

    state.currentUser = data.user || null;
    if (state.currentUser) {
      await syncWatchlistFromAccount();
      state.authMessage = state.currentUser.email_confirmed_at
        ? "Account active. Watchlist and saved state now follow your profile."
        : "Check your inbox to confirm this email address.";
    } else {
      state.watchlist = loadWatchlist();
    }
  } catch (error) {
    state.currentUser = null;
    state.watchlist = loadWatchlist();
  } finally {
    renderAuthState();
  }
}

function setAuthMode(mode) {
  state.authMode = mode;
  renderAuthState();
}

function bindSupabaseAuthListener() {
  supabaseClient.auth.onAuthStateChange(async (_event, session) => {
    state.currentUser = session?.user || null;
    if (state.currentUser) {
      await syncWatchlistFromAccount();
    } else {
      state.watchlist = loadWatchlist();
    }
    render();
  });
}

async function handleAuthSubmit() {
  const email = elements.authEmail.value.trim();
  const password = elements.authPassword.value;

  try {
    if (state.authMode === "register") {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      if (error) {
        throw error;
      }

      state.currentUser = data.user || null;
      state.authMessage = data.session
        ? "Account created and signed in."
        : "Check your email and click the confirmation link to activate your account.";
    } else {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        throw error;
      }

      state.currentUser = data.user || null;
      state.authMessage = "Signed in successfully.";
    }

    elements.authPassword.value = "";
    if (state.currentUser) {
      await syncWatchlistFromAccount();
    }
    render();
  } catch (error) {
    state.authMessage = error.message;
    renderAuthState();
  }
}

async function handleGoogleAuth() {
  state.authMessage = "Redirecting to Google sign-in...";
  renderAuthState();

  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/`,
    },
  });

  if (error) {
    state.authMessage = error.message;
    renderAuthState();
  }
}

async function handleLogout() {
  try {
    await supabaseClient.auth.signOut();
  } catch (error) {
    // Ignore logout transport errors and clear client state anyway.
  }

  state.currentUser = null;
  state.watchlist = loadWatchlist();
  state.authMessage = "Signed out. Guest mode stores watchlists only in this browser.";
  render();
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
    sector: elements.sectorFilter.value,
    marketCap: elements.marketCapFilter.value,
    minQuality: Number(elements.qualityFilter.value),
    sortBy: elements.sortFilter.value,
    minPrice: Number(elements.priceMinFilter.value) || 0,
    maxPrice: Number(elements.priceMaxFilter.value) || 9999,
    theme: elements.themeFilter.value,
    groupMode: elements.logicModeFilter.value,
    formulaRules: sanitizeFormulaRules(state.classicFilters.formulaRules),
  };

  state.profile = createProfile({
    label: "Classic screener",
    description: "Classic screen ranking names by conviction, liquidity, structure, and controlled downside.",
    title: "Classic screener results",
    filter: stock => {
      const matchesSession =
        state.classicFilters.session === "all" || stock.session === state.classicFilters.session;
      const matchesSector =
        state.classicFilters.sector === "all" || stock.sector === state.classicFilters.sector;
      const matchesMarketCap =
        state.classicFilters.marketCap === "all" || stock.marketCap === state.classicFilters.marketCap;
      const matchesTheme =
        state.classicFilters.theme === "all" || stock.theme === state.classicFilters.theme;
      return (
        matchesSession &&
        matchesSector &&
        matchesMarketCap &&
        matchesTheme &&
        stock.momentum >= state.classicFilters.minMomentum &&
        stock.risk <= state.classicFilters.maxRisk &&
        stock.relativeVolume >= state.classicFilters.minRelativeVolume &&
        stock.quality >= state.classicFilters.minQuality &&
        stock.price >= state.classicFilters.minPrice &&
        stock.price <= state.classicFilters.maxPrice &&
        matchesFormulaRules(stock, state.classicFilters.formulaRules, state.classicFilters.groupMode)
      );
    },
    scoreConfig: {
      momentum: state.classicFilters.sortBy === "momentum" ? 1.14 : 0.96,
      safety: state.classicFilters.maxRisk <= 36 ? 1.2 : 1.08,
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
        "The classic screen lets the operator directly control the score through momentum, risk, sector, quality, and liquidity thresholds.",
      monitorFocus: `${state.classicFilters.groupMode} logic with ${state.classicFilters.formulaRules.length} custom rule${state.classicFilters.formulaRules.length === 1 ? "" : "s"}, plus ${state.classicFilters.minMomentum}+ momentum, ${state.classicFilters.minRelativeVolume.toFixed(1)}x volume, ${state.classicFilters.maxRisk} max risk, and ${state.classicFilters.minQuality}+ quality.`,
      intentChips: [
        session === "all" ? "Any session" : `${toTitleCase(session)} focus`,
        state.classicFilters.sector === "all" ? "All sectors" : state.classicFilters.sector,
        state.classicFilters.marketCap === "all" ? "Any cap tier" : state.classicFilters.marketCap,
        `${state.classicFilters.groupMode} logic`,
      ],
      rationale: [
        `Momentum must stay above ${state.classicFilters.minMomentum}, while risk must stay at or below ${state.classicFilters.maxRisk}.`,
        `${state.classicFilters.minRelativeVolume.toFixed(1)}x relative volume, ${state.classicFilters.minQuality}+ quality, and a ${state.classicFilters.minPrice}-${state.classicFilters.maxPrice} price window are now active.`,
        `${state.classicFilters.sector === "all" ? "No sector override is active." : `${state.classicFilters.sector} is the only sector allowed.`} ${state.classicFilters.marketCap === "all" ? "All cap tiers can appear." : `${state.classicFilters.marketCap} names only.`} ${state.classicFilters.theme === "all" ? "All themes are allowed." : `${state.classicFilters.theme} is the active theme filter.`} Rules now resolve through ${state.classicFilters.groupMode} logic, and individual blocks can be inverted with NOT.`,
      ],
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
  let intentChips = ["Balanced horizon", "Flow-aware", "Trap filter on"];
  const rationale = [
    "SignalDeck starts by reading your requested time horizon so the board favors the right holding period.",
    "Risk posture is then adjusted to penalize unstable spikes and reward cleaner structure.",
    "Participation remains a core input so false moves on weak volume lose rank quickly.",
  ];

  if (wantsLowRisk) {
    label = "Safety-biased";
    description = "Prioritizing stable liquidity, cleaner continuation, and lower trap risk.";
    scoreConfig = { momentum: 0.82, safety: 1.35, carry: 0.9, sessionBoost: null };
    intentChips = ["Safer setups", "Liquidity-first", "Downside control"];
  }

  if (wantsIntraday) {
    label = wantsLowRisk ? "Intraday quality" : "Intraday momentum";
    description = wantsLowRisk
      ? "Intraday scan tuned for continuation without extreme gap risk."
      : "Intraday scan favoring price expansion, participation, and clean trend quality.";
    scoreConfig = { momentum: 1.25, safety: wantsTrapProtection ? 1.2 : 0.9, carry: 0.45, sessionBoost: "intraday" };
    filter = stock => stock.session === "intraday" || stock.quality >= 82;
    title = "Intraday opportunities";
    intentChips = wantsLowRisk
      ? ["Intraday horizon", "Quality bias", "Trap control"]
      : ["Intraday horizon", "Momentum-first", "Open-drive bias"];
  }

  if (wantsOvernight) {
    label = "Overnight carry";
    description = "Favoring lower-risk names with enough strength to keep carrying after the close.";
    scoreConfig = { momentum: 0.78, safety: 1.3, carry: 1.28, sessionBoost: "overnight" };
    filter = stock => stock.session !== "intraday" || stock.carry >= 72;
    title = "Overnight candidates";
    intentChips = ["Overnight hold", "Carry strength", "Cleaner close"];
  }

  if (wantsSwing) {
    label = "Swing continuation";
    description = "Biasing toward cleaner multi-session trends over explosive but fragile names.";
    scoreConfig = { momentum: 0.9, safety: 1.18, carry: 1.15, sessionBoost: "swing" };
    filter = stock => stock.session === "swing" || stock.carry >= 76;
    title = "Swing candidates";
    intentChips = ["Swing horizon", "Trend continuity", "Quality over noise"];
  }

  if (wantsVolume) {
    scoreConfig.momentum += 0.08;
    description = `${description} Relative volume is weighted more heavily.`;
    intentChips = [...intentChips, "Volume confirmation"];
    rationale[2] = "Relative volume got an extra boost, so names without real participation should drop behind cleaner tape.";
  }

  if (wantsTrapProtection) {
    scoreConfig.safety += 0.14;
    intentChips = [...intentChips, "Trap penalty"];
    rationale[1] = "Trap protection is active, so wide-opening spikes and poor hold behavior get penalized more aggressively.";
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
      intentChips: intentChips.slice(0, 4),
      rationale,
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
    state.marketTransport = payload.stale ? "stale" : payload.shared ? "shared" : payload.cached ? "cached" : "fresh";
    state.loadError = "";

    if (!state.historyMap[state.selectedSymbol]) {
      await loadHistory(state.selectedSymbol);
    }
  } catch (error) {
    state.marketTransport = "error";
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
    if (payload.stale) {
      state.marketTransport = "stale";
    }
    state.loadError = "";
  } catch (error) {
    state.marketTransport = "error";
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
  const options = arguments[1] || {};
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getApiHeaders(),
      ...(options.headers || {}),
    },
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
  const drivePct = open && price ? ((price - open) / Math.max(open, 0.01)) * 100 : changePct;
  const proxyVwap = (Number(high || price || 0) + Number(low || price || 0) + Number(price || 0)) / 3;
  const vwapDrift = proxyVwap ? ((price - proxyVwap) / proxyVwap) * 100 : 0;
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
  const turnover = (volume ?? 0) * (price ?? 0);
  const rangePct =
    open && high && low ? ((high - low) / Math.max(open, 0.01)) * 100 : Math.abs(changePct) * 1.25;

  return {
    ...meta,
    price: price ?? 0,
    changePct: round(changePct, 2),
    momentum,
    risk,
    relativeVolume: round(relativeVolume, 1),
    liquidity,
    gap: round(gap, 2),
    drivePct: round(drivePct, 2),
    turnover: round(turnover, 0),
    rangePct: round(rangePct, 2),
    volatility: round(volatility, 2),
    closePosition: round(closePosition, 2),
    proxyVwap: round(proxyVwap, 2),
    vwapDrift: round(vwapDrift, 2),
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
    .sort(compareRankedStocks);
}

function render() {
  const ranked = getRankedUniverse();
  if (ranked.length && !ranked.some(stock => stock.symbol === state.selectedSymbol)) {
    state.selectedSymbol = ranked[0].symbol;
  }

  renderAuthState();
  renderFormulaRules();
  [...document.querySelectorAll(".formula-remove")].forEach(button => {
    button.innerHTML = "&times;";
  });
  renderSurfaceState();
  renderPulseStrip(ranked);
  renderScanDigest(ranked);
  renderWatchlist();
  renderBrief(ranked);
  renderOpportunityList(ranked);
  renderSpotlight(ranked);
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

function renderAuthState() {
  elements.authTabs.forEach(button => {
    button.classList.toggle("active", button.dataset.authMode === state.authMode);
  });

  elements.accountDrawer.hidden = !state.accountMenuOpen;
  elements.accountTrigger.setAttribute("aria-expanded", String(state.accountMenuOpen));
  elements.accountAvatar.textContent = getAccountInitials(state.currentUser);

  if (state.currentUser) {
    elements.accountBadge.textContent = "Account";
    elements.topbarAccount.textContent = getAccountLabel(state.currentUser);
    elements.accountCopy.textContent = "This browser is signed in. Watchlists are stored against your account.";
    elements.watchlistNote.textContent =
      "Signed-in mode syncs this watchlist to your account, so it follows you after login.";
    elements.topbarSignIn.hidden = true;
    elements.topbarRegister.hidden = true;
    elements.authSubmit.hidden = true;
    elements.authGoogle.hidden = true;
    elements.authLogout.hidden = false;
    elements.authEmail.disabled = true;
    elements.authPassword.disabled = true;
    elements.authTabs.forEach(button => {
      button.disabled = true;
    });
  } else {
    elements.accountBadge.textContent = "Guest";
    elements.topbarAccount.textContent = "Guest mode";
    elements.accountCopy.textContent =
      "Create an account to keep watchlists and saved state tied to your profile.";
    elements.watchlistNote.textContent =
      "Guest mode keeps this list in this browser. Sign in to sync it to your account.";
    elements.topbarSignIn.hidden = false;
    elements.topbarRegister.hidden = false;
    elements.authSubmit.hidden = false;
    elements.authGoogle.hidden = false;
    elements.authLogout.hidden = true;
    elements.authEmail.disabled = false;
    elements.authPassword.disabled = false;
    elements.authTabs.forEach(button => {
      button.disabled = false;
    });
    elements.authSubmit.textContent = state.authMode === "register" ? "Create account" : "Sign in";
  }

  elements.authMessage.textContent = state.authMessage;
}

function renderSurfaceState() {
  elements.runAi.disabled = state.aiWorking;
  elements.runAi.textContent = state.aiWorking ? "Parsing intent..." : "Run AI scan";
  elements.aiSummary.textContent = state.aiWorking
    ? "Breaking your prompt into horizon, risk posture, and participation signals."
    : `${state.profile.label} profile active. ${state.profile.description}`;
}

function renderFormulaRules() {
  const rules = sanitizeFormulaRules(state.classicFilters.formulaRules);
  state.classicFilters.formulaRules = rules;

  const mode = String(state.classicFilters.groupMode || "AND").toUpperCase();
  elements.formulaSummary.textContent = rules.length
    ? `${rules.length} rule${rules.length === 1 ? "" : "s"} active. Group logic is ${mode}, and each rule can be inverted with NOT.`
    : "No formula rules yet. Add a rule, choose AND/OR/NAND/NOR, and invert any block with NOT.";

  if (!rules.length) {
    elements.formulaRuleList.innerHTML = `<p class="muted">No custom rules yet.</p>`;
    return;
  }

  elements.formulaRuleList.innerHTML = rules
    .map(
      rule => `
        <div class="formula-rule" data-rule-id="${rule.id}">
          <label class="rule-negate">
            <span class="section-label">NOT</span>
            <input data-rule-prop="negate" type="checkbox" ${rule.negate ? "checked" : ""} />
          </label>
          <label>
            <span class="section-label">Field</span>
            <select data-rule-prop="field">
              ${FORMULA_FIELDS.map(
                field => `<option value="${field.key}" ${field.key === rule.field ? "selected" : ""}>${field.label}</option>`,
              ).join("")}
            </select>
          </label>
          <label>
            <span class="section-label">Operator</span>
            <select data-rule-prop="operator">
              ${getOperatorsForRule(rule)
                .map(
                  operator =>
                    `<option value="${operator}" ${operator === rule.operator ? "selected" : ""}>${operator}</option>`,
                )
                .join("")}
            </select>
          </label>
          <label>
            <span class="section-label">Value</span>
            <input data-rule-prop="value" type="${getFormulaFieldMeta(rule.field)?.type === "text" ? "text" : "number"}" step="any" value="${rule.value}" />
          </label>
          <button class="formula-remove" data-remove-rule="${rule.id}" type="button" aria-label="Remove rule">
            ×
          </button>
        </div>
      `,
    )
    .join("");

  [...elements.formulaRuleList.querySelectorAll("[data-rule-prop]")].forEach(control => {
    const eventName = control.matches("select") || control.type === "checkbox" ? "change" : "input";
    control.addEventListener(eventName, event => {
      const row = event.target.closest("[data-rule-id]");
      const ruleId = row?.dataset.ruleId;
      const prop = event.target.dataset.ruleProp;
      const nextValue = event.target.type === "checkbox" ? event.target.checked : event.target.value;
      updateFormulaRule(ruleId, prop, nextValue);
    });
  });

  [...elements.formulaRuleList.querySelectorAll("[data-remove-rule]")].forEach(button => {
    button.textContent = "×";
    button.addEventListener("click", () => {
      state.classicFilters.formulaRules = state.classicFilters.formulaRules.filter(
        rule => rule.id !== button.dataset.removeRule,
      );
      renderFormulaRules();
    });
  });
}

function renderConnectionState() {
  const managedByServer = state.apiConfig.hasServerKey;
  elements.apiKeyInput.disabled = managedByServer;
  elements.saveApiKey.disabled = managedByServer;

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
    if (state.marketTransport === "shared" || state.marketTransport === "cached") {
      elements.feedStatus.textContent = "Shared market snapshot connected";
      elements.connectionState.textContent =
        "This visitor is reusing a shared server-side market snapshot instead of triggering a brand-new upstream request.";
    } else if (state.marketTransport === "stale") {
      elements.feedStatus.textContent = "Cached market snapshot connected";
      elements.connectionState.textContent =
        "SignalDeck is serving the latest safe cached snapshot because the upstream feed is currently constrained.";
    } else {
      elements.feedStatus.textContent = "Real market data connected";
      elements.connectionState.textContent = state.apiConfig.hasServerKey
        ? "Server-side API key detected. This build is ready for public deployment."
        : "Using a browser-stored API key. Fine for local testing; use a server env var for public deploys.";
    }
  } else {
    elements.feedStatus.textContent = "Waiting for market data connection";
    elements.connectionState.textContent =
      "Add a free Twelve Data API key or configure a server key before running the scanner.";
  }

  elements.dataSourceNote.textContent =
    managedByServer
      ? "Server-managed market data is active. Public visitors do not need to supply their own key, and server-side caching now reduces duplicate upstream calls."
      : "Free-tier mode tracks a curated universe and refreshes every four minutes to stay within API-credit limits.";
}

function renderPulseStrip(ranked) {
  const liveUniverse = getLiveUniverse().map(stock => ({ ...stock, score: state.profile.score(stock) }));
  const topLive = [...liveUniverse].sort(compareRankedStocks)[0];
  const positiveBreadth = liveUniverse.filter(stock => stock.changePct > 0).length;
  const bestRelativeVolume = liveUniverse.length
    ? `${Math.max(...liveUniverse.map(stock => stock.relativeVolume)).toFixed(1)}x`
    : "--";
  const averageRisk = liveUniverse.length
    ? `${Math.round(liveUniverse.reduce((total, stock) => total + stock.risk, 0) / liveUniverse.length)} / 100`
    : "--";

  const items = [
    { label: "Scanner profile", value: state.profile.label, note: "Prompt-driven ranking logic is active" },
    { label: "Live universe", value: String(liveUniverse.length || "--"), note: `${positiveBreadth} names green on session` },
    { label: "Exact matches", value: String(ranked.length), note: ranked.length ? `${ranked[0].symbol} leads the current scan` : "No exact fit yet, widen the screen" },
    { label: "Strongest tape", value: topLive ? topLive.symbol : "--", note: topLive ? `${bestRelativeVolume} peak participation, risk avg ${averageRisk}` : "Waiting for live quotes" },
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

async function syncWatchlistFromAccount() {
  if (!state.currentUser) {
    return;
  }

  const watchlist = state.currentUser.user_metadata?.watchlist;
  state.watchlist = Array.isArray(watchlist) ? watchlist : [];
}

function renderScanDigest(ranked) {
  const chips = state.profile.meta.intentChips || [state.profile.label];
  const rationale = state.profile.meta.rationale || [];
  const top = ranked[0];

  elements.intentChips.innerHTML = chips.length
    ? chips.map(chip => `<span class="intent-chip">${chip}</span>`).join("")
    : `<span class="intent-chip muted-chip">Waiting for a scan profile</span>`;

  const lines = [
    ...(rationale.length ? rationale : ["SignalDeck will explain the active scan logic here."]),
    top ? `${top.symbol} is currently the cleanest live expression of this profile.` : "Once live names rank, the board will name the strongest expression here.",
  ];

  elements.aiRationale.innerHTML = lines.map(line => `<li>${line}</li>`).join("");
}

function renderBrief(ranked) {
  const liveUniverse = getLiveUniverse().map(stock => ({ ...stock, score: state.profile.score(stock) }));
  const top = ranked[0] || [...liveUniverse].sort(compareRankedStocks)[0];
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
  elements.resultsMeta.textContent = `${ranked.length} exact matches`;

  if (!ranked.length) {
    const nearMisses = getLiveUniverse()
      .map(stock => ({ ...stock, score: state.profile.score(stock) }))
      .sort(compareRankedStocks)
      .slice(0, 3);

    elements.opportunityList.innerHTML = `
      <div class="opportunity-empty">
        <div class="ticker-meta">
          <strong>No exact matches yet</strong>
          <span>${state.loadError || "The current screen is strict. Review the closest live names below or widen the filters."}</span>
        </div>
        <div class="near-miss-list">
          ${nearMisses.length
            ? nearMisses
                .map(
                  stock => `
                    <button class="near-miss-chip" data-symbol="${stock.symbol}">
                      <strong>${stock.symbol}</strong>
                      <span>${stock.score} score · ${stock.relativeVolume.toFixed(1)}x rel vol</span>
                    </button>
                  `,
                )
                .join("")
            : `<p class="muted">Connect a market-data key or wait for the next refresh.</p>`}
        </div>
      </div>
    `;
    [...elements.opportunityList.querySelectorAll("[data-symbol]")].forEach(button => {
      button.addEventListener("click", async () => {
        state.selectedSymbol = button.dataset.symbol;
        if (!state.historyMap[state.selectedSymbol]) {
          await loadHistory(state.selectedSymbol);
        } else {
          render();
        }
      });
    });
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

function renderSpotlight(ranked) {
  const lead =
    ranked[0] ||
    getLiveUniverse()
      .map(stock => ({ ...stock, score: state.profile.score(stock) }))
      .sort(compareRankedStocks)[0];

  if (!lead) {
    elements.spotlightCaption.textContent = "Awaiting data";
    elements.spotlightSymbol.textContent = "--";
    elements.spotlightTheme.textContent =
      "The spotlight card will fill once the scanner has a live board to rank.";
    elements.spotlightMetrics.innerHTML = "";
    elements.spotlightNote.textContent =
      "Live data drives this card, so it becomes much more informative after the first successful market refresh.";
    return;
  }

  elements.spotlightCaption.textContent = ranked.length ? "Lead setup" : "Closest live fit";
  elements.spotlightSymbol.textContent = lead.symbol;
  elements.spotlightTheme.textContent = `${lead.theme} in ${lead.sector.toLowerCase()} is currently giving the cleanest expression of this scan.`;
  elements.spotlightMetrics.innerHTML = [
    ["Conviction", `${lead.score}`],
    ["Trend quality", `${lead.quality}`],
    ["Relative volume", `${lead.relativeVolume.toFixed(1)}x`],
    ["Session change", `${formatSigned(lead.changePct)}%`],
  ]
    .map(
      ([label, value]) => `
        <div>
          <dt>${label}</dt>
          <dd>${value}</dd>
        </div>
      `,
    )
    .join("");
  elements.spotlightNote.textContent = `${lead.symbol} is surfacing because ${lead.headline.toLowerCase()} ${lead.risk <= 30 ? "Risk is still relatively contained for this setup." : "Risk is elevated, so confirmation matters before aggressive sizing."}`;
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

  persistWatchlist();
}

function compareRankedStocks(left, right) {
  if (state.profile.label === "Classic screener") {
    const sortBy = state.classicFilters.sortBy;
    if (sortBy === "risk") {
      return left.risk - right.risk || right.score - left.score;
    }

    return (right[sortBy] ?? right.score) - (left[sortBy] ?? left.score) || right.score - left.score;
  }

  return right.score - left.score;
}

async function persistWatchlist() {
  try {
    if (state.currentUser) {
      const { data, error } = await supabaseClient.auth.updateUser({
        data: {
          ...(state.currentUser.user_metadata || {}),
          watchlist: state.watchlist,
        },
      });
      if (error) {
        throw error;
      }

      state.currentUser = data.user;
      await syncWatchlistFromAccount();
    } else {
      saveWatchlist(state.watchlist);
    }
  } catch (error) {
    state.authMessage = error.message;
  } finally {
    render();
  }
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

function wait(ms) {
  return new Promise(resolve => {
    window.setTimeout(resolve, ms);
  });
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
