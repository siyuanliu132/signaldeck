const SUPABASE_URL = "https://lebhgypjdikxhjbgoklb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_soubqDA83uJO_-lwCy0JmQ_3ghqNddv";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

const CURATED_LIVE_UNIVERSE = [
  { symbol: "NVDA", name: "NVIDIA", session: "intraday", trend: "Intraday continuation", sector: "Semiconductors", theme: "AI infrastructure", marketCap: "Mega cap" },
  { symbol: "AMD", name: "Advanced Micro Devices", session: "intraday", trend: "Opening drive", sector: "Semiconductors", theme: "Acceleration trade", marketCap: "Large cap" },
  { symbol: "AVGO", name: "Broadcom", session: "intraday", trend: "Trend acceleration", sector: "Semiconductors", theme: "Infrastructure leadership", marketCap: "Mega cap" },
  { symbol: "MU", name: "Micron Technology", session: "intraday", trend: "Memory breakout", sector: "Semiconductors", theme: "Memory cycle", marketCap: "Large cap" },
  { symbol: "QCOM", name: "Qualcomm", session: "swing", trend: "Base continuation", sector: "Semiconductors", theme: "Mobile AI", marketCap: "Large cap" },
  { symbol: "ARM", name: "Arm Holdings", session: "intraday", trend: "High-beta follow-through", sector: "Semiconductors", theme: "Design IP", marketCap: "Large cap" },
  { symbol: "MSFT", name: "Microsoft", session: "swing", trend: "Blue-chip swing", sector: "Software", theme: "Platform leader", marketCap: "Mega cap" },
  { symbol: "ORCL", name: "Oracle", session: "overnight", trend: "Enterprise carry", sector: "Software", theme: "Enterprise AI", marketCap: "Mega cap" },
  { symbol: "CRM", name: "Salesforce", session: "swing", trend: "Workflow follow-through", sector: "Software", theme: "Workflow software", marketCap: "Mega cap" },
  { symbol: "ADBE", name: "Adobe", session: "swing", trend: "Software momentum", sector: "Software", theme: "Creative cloud", marketCap: "Mega cap" },
  { symbol: "PANW", name: "Palo Alto Networks", session: "intraday", trend: "Cybersecurity drive", sector: "Software", theme: "Cybersecurity", marketCap: "Mega cap" },
  { symbol: "AAPL", name: "Apple", session: "overnight", trend: "Steady carry", sector: "Internet", theme: "Ecosystem strength", marketCap: "Mega cap" },
  { symbol: "GOOGL", name: "Alphabet", session: "swing", trend: "Base breakout", sector: "Internet", theme: "Search and cloud", marketCap: "Mega cap" },
  { symbol: "AMZN", name: "Amazon", session: "overnight", trend: "Cloud continuation", sector: "Internet", theme: "Cloud and consumer", marketCap: "Mega cap" },
  { symbol: "META", name: "Meta Platforms", session: "overnight", trend: "Overnight carry", sector: "Internet", theme: "Digital ads", marketCap: "Mega cap" },
  { symbol: "NFLX", name: "Netflix", session: "swing", trend: "Momentum hold", sector: "Internet", theme: "Streaming momentum", marketCap: "Mega cap" },
  { symbol: "UBER", name: "Uber Technologies", session: "intraday", trend: "Consumer platform drive", sector: "Internet", theme: "Mobility platform", marketCap: "Large cap" },
  { symbol: "LLY", name: "Eli Lilly", session: "swing", trend: "Quality leader", sector: "Healthcare", theme: "Defensive growth", marketCap: "Mega cap" },
  { symbol: "UNH", name: "UnitedHealth", session: "overnight", trend: "Defensive carry", sector: "Healthcare", theme: "Managed care", marketCap: "Mega cap" },
  { symbol: "JPM", name: "JPMorgan Chase", session: "overnight", trend: "Low-vol carry", sector: "Financials", theme: "Rate resilience", marketCap: "Mega cap" },
  { symbol: "BAC", name: "Bank of America", session: "overnight", trend: "Value carry", sector: "Financials", theme: "Money center banks", marketCap: "Mega cap" },
  { symbol: "V", name: "Visa", session: "swing", trend: "Quality compounder", sector: "Financials", theme: "Payments quality", marketCap: "Mega cap" },
  { symbol: "GS", name: "Goldman Sachs", session: "intraday", trend: "Capital markets impulse", sector: "Financials", theme: "Capital markets", marketCap: "Large cap" },
  { symbol: "MA", name: "Mastercard", session: "swing", trend: "Payment rail continuation", sector: "Financials", theme: "Payments quality", marketCap: "Mega cap" },
  { symbol: "COST", name: "Costco", session: "overnight", trend: "Steady hold", sector: "Consumer", theme: "Defensive compounder", marketCap: "Mega cap" },
  { symbol: "WMT", name: "Walmart", session: "overnight", trend: "Defensive carry", sector: "Consumer", theme: "Value retail", marketCap: "Mega cap" },
  { symbol: "HD", name: "Home Depot", session: "swing", trend: "Cyclical swing", sector: "Consumer", theme: "Housing spend", marketCap: "Mega cap" },
  { symbol: "TSLA", name: "Tesla", session: "intraday", trend: "High-beta opening drive", sector: "Consumer", theme: "EV beta", marketCap: "Mega cap" },
  { symbol: "XOM", name: "Exxon Mobil", session: "overnight", trend: "Cash-flow carry", sector: "Energy", theme: "Energy cash flow", marketCap: "Mega cap" },
  { symbol: "CVX", name: "Chevron", session: "overnight", trend: "Integrated energy carry", sector: "Energy", theme: "Integrated energy", marketCap: "Mega cap" },
  { symbol: "CAT", name: "Caterpillar", session: "swing", trend: "Industrial swing", sector: "Industrials", theme: "Industrial cyclicals", marketCap: "Mega cap" },
  { symbol: "GE", name: "GE Aerospace", session: "swing", trend: "Industrial leadership", sector: "Industrials", theme: "Aerospace demand", marketCap: "Mega cap" },
];

const MARKET_CONTEXT_UNIVERSE = [
  { symbol: "SPY", label: "S&P 500", kind: "broad", note: "Broad market risk appetite" },
  { symbol: "QQQ", label: "Nasdaq 100", kind: "broad", note: "Growth and software leadership" },
  { symbol: "DIA", label: "Dow proxy", kind: "broad", note: "Industrial and defensive balance" },
  { symbol: "XLK", label: "Technology", kind: "sector", note: "Large-cap technology leadership" },
  { symbol: "XLF", label: "Financials", kind: "sector", note: "Rate and bank participation" },
  { symbol: "XLE", label: "Energy", kind: "sector", note: "Commodity-linked cyclicals" },
  { symbol: "XLV", label: "Healthcare", kind: "sector", note: "Defensive growth tone" },
  { symbol: "VXX", label: "Volatility proxy", kind: "volatility", note: "Fear and hedging proxy" },
];

const LIVE_BATCH_SYMBOLS = CURATED_LIVE_UNIVERSE.map(stock => stock.symbol);
const CONTEXT_BATCH_SYMBOLS = MARKET_CONTEXT_UNIVERSE.map(item => item.symbol);
const CATALOG_OVERRIDES = Object.fromEntries(CURATED_LIVE_UNIVERSE.map(stock => [stock.symbol, stock]));
const MEGA_CAP_SYMBOLS = new Set([
  "AAPL", "ABBV", "ABT", "ADBE", "AMZN", "AVGO", "BAC", "BRK-B", "COST", "CVX", "GOOGL", "GOOG",
  "HD", "JNJ", "JPM", "KO", "LLY", "MA", "MCD", "META", "MSFT", "NFLX", "NVDA", "ORCL", "PG", "TSLA",
  "UNH", "V", "WMT", "XOM",
]);
const SECTOR_LABEL_MAP = {
  "Communication Services": "Communication Services",
  "Consumer Discretionary": "Consumer Discretionary",
  "Consumer Staples": "Consumer Staples",
  "Energy": "Energy",
  "Financials": "Financials",
  "Health Care": "Healthcare",
  "Industrials": "Industrials",
  "Information Technology": "Technology",
  "Materials": "Materials",
  "Real Estate": "Real Estate",
  "Utilities": "Utilities",
};
const THEME_BY_SECTOR = {
  "Communication Services": "Digital platforms",
  "Consumer Discretionary": "Consumer beta",
  "Consumer Staples": "Defensive staples",
  "Energy": "Energy cash flow",
  "Financials": "Capital and rates",
  "Healthcare": "Healthcare quality",
  "Industrials": "Industrial cyclicals",
  "Technology": "Platform and compute",
  "Materials": "Materials cycle",
  "Real Estate": "Real estate income",
  "Utilities": "Defensive yield",
};
const SESSION_BY_SECTOR = {
  "Communication Services": "intraday",
  "Consumer Discretionary": "swing",
  "Consumer Staples": "overnight",
  "Energy": "overnight",
  "Financials": "overnight",
  "Healthcare": "swing",
  "Industrials": "swing",
  "Technology": "intraday",
  "Materials": "swing",
  "Real Estate": "overnight",
  "Utilities": "overnight",
};
const TREND_BY_SECTOR = {
  "Communication Services": "Platform follow-through",
  "Consumer Discretionary": "Consumer momentum",
  "Consumer Staples": "Defensive carry",
  "Energy": "Cash-flow carry",
  "Financials": "Capital strength",
  "Healthcare": "Quality continuation",
  "Industrials": "Industrial swing",
  "Technology": "Growth continuation",
  "Materials": "Cycle-sensitive swing",
  "Real Estate": "Rate-sensitive hold",
  "Utilities": "Defensive hold",
};

function normalizeUniverseSector(sector) {
  return SECTOR_LABEL_MAP[String(sector || "").trim()] || String(sector || "").trim() || "Other";
}

function inferMarketCap(symbol, sourceTags = []) {
  if (MEGA_CAP_SYMBOLS.has(symbol) || sourceTags.includes("nasdaq100")) {
    return "Mega cap";
  }
  return "Large cap";
}

function buildUniverseCatalog(rawCatalog) {
  return rawCatalog.map(entry => {
    const normalizedSector = normalizeUniverseSector(entry.sector);
    const sourceTags = Array.isArray(entry.sourceTags) ? entry.sourceTags : [];
    const override = CATALOG_OVERRIDES[entry.symbol];

    return {
      symbol: entry.symbol,
      name: entry.name,
      session: override?.session || SESSION_BY_SECTOR[normalizedSector] || "swing",
      trend: override?.trend || TREND_BY_SECTOR[normalizedSector] || "Broad-market scan",
      sector: override?.sector || normalizedSector,
      theme: override?.theme || THEME_BY_SECTOR[normalizedSector] || "Broad-market coverage",
      marketCap: override?.marketCap || inferMarketCap(entry.symbol, sourceTags),
      sourceTags,
    };
  });
}

const trackedUniverse = buildUniverseCatalog(
  Array.isArray(window.signalDeckCatalog) && window.signalDeckCatalog.length
    ? window.signalDeckCatalog
    : CURATED_LIVE_UNIVERSE.map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        sector: stock.sector,
        sourceTags: ["curated"],
      })),
);

const FORMULA_FIELDS = [
  { key: "price", label: "Price", type: "number" },
  { key: "volume", label: "Volume", type: "number" },
  { key: "averageVolume", label: "Average volume", type: "number" },
  { key: "changePct", label: "Session change %", type: "number" },
  { key: "gap", label: "Gap %", type: "number" },
  { key: "gapAbs", label: "Absolute gap %", type: "number", getter: stock => Math.abs(Number(stock.gap || 0)) },
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
  { key: "turnover", label: "Dollar volume est. (price x volume)", type: "number" },
  {
    key: "avgTurnover",
    label: "Avg dollar volume est. (price x avg vol)",
    type: "number",
    getter: stock => Number(stock.price || 0) * Number(stock.averageVolume || 0),
  },
  {
    key: "turnoverRatio",
    label: "Dollar vol / avg dollar vol",
    type: "number",
    getter: stock => {
      const avgTurnover = Number(stock.price || 0) * Number(stock.averageVolume || 0);
      if (!avgTurnover) {
        return 0;
      }
      return Number(stock.turnover || 0) / avgTurnover;
    },
  },
  { key: "rangePct", label: "Range %", type: "number" },
  {
    key: "rangeMinusGap",
    label: "Range % minus |gap %|",
    type: "number",
    getter: stock => Number(stock.rangePct || 0) - Math.abs(Number(stock.gap || 0)),
  },
  { key: "sector", label: "Sector", type: "text" },
  { key: "theme", label: "Theme", type: "text" },
  { key: "session", label: "Session bias", type: "text" },
  { key: "marketCap", label: "Market cap", type: "text" },
];

const FIELD_CATEGORY_ORDER = [
  "Market & Extended Hours",
  "Technicals",
  "Security / Structure / Catalyst",
  "Financials",
  "Valuation",
  "Growth",
  "Dividends",
  "Margins & Ratios",
  "Custom Metrics",
];

const BASE_FIELD_CATALOG = [
  { key: "price", label: "Price", category: "Market & Extended Hours", subcategory: "Last trade", type: "number", availability: "live", source: "quote", description: "Last traded price from the shared quote snapshot." },
  { key: "open", label: "Open", category: "Market & Extended Hours", subcategory: "Session structure", type: "number", availability: "live", source: "quote", description: "Current regular-session open from the quote snapshot." },
  { key: "high", label: "High", category: "Market & Extended Hours", subcategory: "Session structure", type: "number", availability: "live", source: "quote", description: "Current session high from the quote snapshot." },
  { key: "low", label: "Low", category: "Market & Extended Hours", subcategory: "Session structure", type: "number", availability: "live", source: "quote", description: "Current session low from the quote snapshot." },
  { key: "previousClose", label: "Previous close", category: "Market & Extended Hours", subcategory: "Session structure", type: "number", availability: "live", source: "quote", description: "Prior closing price used for change and gap calculations." },
  { key: "volume", label: "Volume", category: "Market & Extended Hours", subcategory: "Participation", type: "number", availability: "live", source: "quote", description: "Current session volume from the live quote snapshot." },
  { key: "averageVolume", label: "Average volume", category: "Market & Extended Hours", subcategory: "Participation", type: "number", availability: "live", source: "quote", description: "Average session volume supplied by the quote feed." },
  { key: "changePct", label: "Session change %", category: "Market & Extended Hours", subcategory: "Price change", type: "number", availability: "derived", source: "price / previous close", description: "Percent change versus previous close." },
  { key: "gap", label: "Gap %", category: "Market & Extended Hours", subcategory: "Price change", type: "number", availability: "derived", source: "open / previous close", description: "Gap percentage between the open and previous close." },
  { key: "gapAbs", label: "Absolute gap %", category: "Market & Extended Hours", subcategory: "Price change", type: "number", availability: "derived", source: "abs(gap)", getter: stock => Math.abs(Number(stock.gap || 0)), description: "Absolute gap percentage regardless of direction." },
  { key: "drivePct", label: "Drive from open %", category: "Market & Extended Hours", subcategory: "Price change", type: "number", availability: "derived", source: "price / open", description: "Percent move from the current open to the last price." },
  { key: "rangePct", label: "Range %", category: "Market & Extended Hours", subcategory: "Price change", type: "number", availability: "derived", source: "high / low / open", description: "Session range expressed as a percentage of the open." },
  { key: "rangeMinusGap", label: "Range % minus |gap %|", category: "Market & Extended Hours", subcategory: "Price change", type: "number", availability: "derived", source: "rangePct - abs(gap)", getter: stock => Number(stock.rangePct || 0) - Math.abs(Number(stock.gap || 0)), description: "Useful for separating true expansion from simple gap size." },
  { key: "turnover", label: "Dollar volume estimate", category: "Market & Extended Hours", subcategory: "Participation", type: "number", availability: "derived", source: "price x volume", description: "Synthetic dollar volume estimate built from price times volume." },
  { key: "avgTurnover", label: "Average dollar volume estimate", category: "Market & Extended Hours", subcategory: "Participation", type: "number", availability: "derived", source: "price x averageVolume", getter: stock => Number(stock.price || 0) * Number(stock.averageVolume || 0), description: "Synthetic average dollar volume estimate built from price times average volume." },
  { key: "turnoverRatio", label: "Dollar volume / average dollar volume", category: "Market & Extended Hours", subcategory: "Participation", type: "number", availability: "derived", source: "turnover / avgTurnover", getter: stock => { const avgTurnover = Number(stock.price || 0) * Number(stock.averageVolume || 0); return avgTurnover ? Number(stock.turnover || 0) / avgTurnover : 0; }, description: "Synthetic ratio showing current dollar activity versus average dollar activity." },
  { key: "volatility", label: "Volatility", category: "Market & Extended Hours", subcategory: "Price change", type: "number", availability: "derived", source: "high / low / previous close", description: "Current session volatility estimate derived from the quote range." },
  { key: "proxyVwap", label: "VWAP proxy", category: "Market & Extended Hours", subcategory: "Microstructure", type: "number", availability: "derived", source: "typical price proxy", description: "Quote-structure VWAP proxy built from high, low, and last price." },
  { key: "vwapDrift", label: "Distance from VWAP proxy %", category: "Market & Extended Hours", subcategory: "Microstructure", type: "number", availability: "derived", source: "price / proxyVwap", description: "Distance from the quote-based VWAP proxy in percent." },
  { key: "closePosition", label: "Close position", category: "Market & Extended Hours", subcategory: "Microstructure", type: "number", availability: "derived", source: "price within range", description: "Where the last price sits inside the current session range." },
  { key: "relativeVolume", label: "Relative volume", category: "Technicals", subcategory: "Participation", type: "number", availability: "derived", source: "volume / averageVolume", description: "Current volume versus average volume." },
  { key: "momentum", label: "Momentum", category: "Technicals", subcategory: "Composite scores", type: "number", availability: "derived", source: "local composite", description: "Local composite score weighting price expansion, participation, and structure." },
  { key: "risk", label: "Risk", category: "Technicals", subcategory: "Composite scores", type: "number", availability: "derived", source: "local composite", description: "Local downside risk estimate derived from volatility, structure, and participation." },
  { key: "quality", label: "Trend quality", category: "Technicals", subcategory: "Composite scores", type: "number", availability: "derived", source: "local composite", description: "Local quality score focused on clean structure and hold behavior." },
  { key: "carry", label: "Carry strength", category: "Technicals", subcategory: "Composite scores", type: "number", availability: "derived", source: "local composite", description: "Local carry score favoring cleaner continuation and hold quality." },
  { key: "liquidity", label: "Liquidity", category: "Technicals", subcategory: "Composite scores", type: "number", availability: "derived", source: "local composite", description: "Local liquidity score based on current volume and participation." },
  { key: "session", label: "Session bias", category: "Security / Structure / Catalyst", subcategory: "Structure", type: "text", availability: "live", source: "local universe metadata", description: "Current SignalDeck session label for the tracked name." },
  { key: "sector", label: "Sector", category: "Security / Structure / Catalyst", subcategory: "Classification", type: "text", availability: "live", source: "local universe metadata", description: "Sector label for the tracked name." },
  { key: "theme", label: "Theme", category: "Security / Structure / Catalyst", subcategory: "Classification", type: "text", availability: "live", source: "local universe metadata", description: "Narrative bucket used in the demo universe." },
  { key: "marketCap", label: "Market cap tier", category: "Security / Structure / Catalyst", subcategory: "Classification", type: "text", availability: "live", source: "local universe metadata", description: "Cap bucket assigned to the tracked name." },
];

const LOCKED_FIELD_CATALOG = [
  { key: "rsi14", label: "RSI (14)", category: "Technicals", subcategory: "Oscillators", type: "number", availability: "locked", lockedReason: "Coming soon. Needs richer historical data than the current quote snapshot." },
  { key: "ema9", label: "EMA (9)", category: "Technicals", subcategory: "Moving averages", type: "number", availability: "locked", lockedReason: "Coming soon. Needs richer historical bars and moving-average calculation support." },
  { key: "ema20", label: "EMA (20)", category: "Technicals", subcategory: "Moving averages", type: "number", availability: "locked", lockedReason: "Coming soon. Needs richer historical bars and moving-average calculation support." },
  { key: "sma50", label: "SMA (50)", category: "Technicals", subcategory: "Moving averages", type: "number", availability: "locked", lockedReason: "Coming soon. Needs richer historical bars and moving-average calculation support." },
  { key: "sma200", label: "SMA (200)", category: "Technicals", subcategory: "Moving averages", type: "number", availability: "locked", lockedReason: "Coming soon. Needs deeper history than the current demo feed." },
  { key: "macdLine", label: "MACD line", category: "Technicals", subcategory: "Oscillators", type: "number", availability: "locked", lockedReason: "Coming soon. Needs richer historical data than the current quote snapshot." },
  { key: "macdSignal", label: "MACD signal", category: "Technicals", subcategory: "Oscillators", type: "number", availability: "locked", lockedReason: "Coming soon. Needs richer historical data than the current quote snapshot." },
  { key: "atr14", label: "ATR (14)", category: "Technicals", subcategory: "Volatility", type: "number", availability: "locked", lockedReason: "Coming soon. Needs richer historical bars than the live quote sample." },
  { key: "dist52wHigh", label: "Distance from 52W high %", category: "Technicals", subcategory: "Range", type: "number", availability: "locked", lockedReason: "Coming soon. Needs longer-term historical range data." },
  { key: "dist52wLow", label: "Distance from 52W low %", category: "Technicals", subcategory: "Range", type: "number", availability: "locked", lockedReason: "Coming soon. Needs longer-term historical range data." },
  { key: "exchange", label: "Exchange", category: "Security / Structure / Catalyst", subcategory: "Classification", type: "text", availability: "locked", lockedReason: "Visible in the field library now, but the current demo universe does not expose exchange metadata." },
  { key: "country", label: "Country", category: "Security / Structure / Catalyst", subcategory: "Classification", type: "text", availability: "locked", lockedReason: "Visible in the field library now, but the current demo universe does not expose country metadata." },
  { key: "industry", label: "Industry", category: "Security / Structure / Catalyst", subcategory: "Classification", type: "text", availability: "locked", lockedReason: "Visible in the field library now, but the current demo universe does not expose industry metadata." },
  { key: "float", label: "Float", category: "Security / Structure / Catalyst", subcategory: "Structure", type: "number", availability: "locked", lockedReason: "Coming soon. Float data requires a richer reference-data provider." },
  { key: "sharesOutstanding", label: "Shares outstanding", category: "Security / Structure / Catalyst", subcategory: "Structure", type: "number", availability: "locked", lockedReason: "Coming soon. Shares-outstanding data requires a richer reference-data provider." },
  { key: "shortFloat", label: "Short float %", category: "Security / Structure / Catalyst", subcategory: "Short interest", type: "number", availability: "locked", lockedReason: "Coming soon. Short-interest data requires a provider beyond the current quote feed." },
  { key: "optionable", label: "Optionable", category: "Security / Structure / Catalyst", subcategory: "Structure", type: "text", availability: "locked", lockedReason: "Coming soon. Options metadata is not yet loaded into the demo universe." },
  { key: "shortable", label: "Shortable", category: "Security / Structure / Catalyst", subcategory: "Structure", type: "text", availability: "locked", lockedReason: "Coming soon. Borrow / shortability metadata is not yet loaded." },
  { key: "earningsDate", label: "Earnings date", category: "Security / Structure / Catalyst", subcategory: "Catalyst", type: "text", availability: "locked", lockedReason: "Coming soon. Event calendars require a richer reference-data provider." },
  { key: "earningsTiming", label: "Earnings timing", category: "Security / Structure / Catalyst", subcategory: "Catalyst", type: "text", availability: "locked", lockedReason: "Coming soon. Event calendars require a richer reference-data provider." },
  { key: "insiderOwnership", label: "Insider ownership %", category: "Security / Structure / Catalyst", subcategory: "Ownership", type: "number", availability: "locked", lockedReason: "Coming soon. Ownership data requires a richer fundamentals provider." },
  { key: "insiderTransactions", label: "Insider transactions", category: "Security / Structure / Catalyst", subcategory: "Ownership", type: "text", availability: "locked", lockedReason: "Coming soon. Ownership data requires a richer fundamentals provider." },
  { key: "institutionalOwnership", label: "Institutional ownership %", category: "Security / Structure / Catalyst", subcategory: "Ownership", type: "number", availability: "locked", lockedReason: "Coming soon. Ownership data requires a richer fundamentals provider." },
  { key: "institutionalChange", label: "Institutional change %", category: "Security / Structure / Catalyst", subcategory: "Ownership", type: "number", availability: "locked", lockedReason: "Coming soon. Ownership data requires a richer fundamentals provider." },
  { key: "revenue", label: "Revenue", category: "Financials", subcategory: "Income statement", type: "number", availability: "locked", lockedReason: "Coming soon. Financial statements are not available from the current quote feed." },
  { key: "epsTtm", label: "EPS (TTM)", category: "Financials", subcategory: "Income statement", type: "number", availability: "locked", lockedReason: "Coming soon. Financial statements are not available from the current quote feed." },
  { key: "ebitda", label: "EBITDA", category: "Financials", subcategory: "Income statement", type: "number", availability: "locked", lockedReason: "Coming soon. Financial statements are not available from the current quote feed." },
  { key: "freeCashFlow", label: "Free cash flow", category: "Financials", subcategory: "Cash flow", type: "number", availability: "locked", lockedReason: "Coming soon. Cash-flow fields require a richer fundamentals provider." },
  { key: "peRatio", label: "P/E", category: "Valuation", subcategory: "Multiples", type: "number", availability: "locked", lockedReason: "Coming soon. Valuation multiples are not available from the current quote feed." },
  { key: "psRatio", label: "P/S", category: "Valuation", subcategory: "Multiples", type: "number", availability: "locked", lockedReason: "Coming soon. Valuation multiples are not available from the current quote feed." },
  { key: "evToEbitda", label: "EV / EBITDA", category: "Valuation", subcategory: "Multiples", type: "number", availability: "locked", lockedReason: "Coming soon. Enterprise-value fields require a richer fundamentals provider." },
  { key: "pbRatio", label: "P/B", category: "Valuation", subcategory: "Multiples", type: "number", availability: "locked", lockedReason: "Coming soon. Valuation multiples are not available from the current quote feed." },
  { key: "pegRatio", label: "PEG", category: "Valuation", subcategory: "Multiples", type: "number", availability: "locked", lockedReason: "Coming soon. Growth-adjusted valuation fields require a richer fundamentals provider." },
  { key: "revenueGrowth", label: "Revenue growth %", category: "Growth", subcategory: "Growth rates", type: "number", availability: "locked", lockedReason: "Coming soon. Growth rates require historical financial statements." },
  { key: "epsGrowth", label: "EPS growth %", category: "Growth", subcategory: "Growth rates", type: "number", availability: "locked", lockedReason: "Coming soon. Growth rates require historical financial statements." },
  { key: "ebitdaGrowth", label: "EBITDA growth %", category: "Growth", subcategory: "Growth rates", type: "number", availability: "locked", lockedReason: "Coming soon. Growth rates require historical financial statements." },
  { key: "fcfGrowth", label: "Free cash flow growth %", category: "Growth", subcategory: "Growth rates", type: "number", availability: "locked", lockedReason: "Coming soon. Growth rates require historical financial statements." },
  { key: "dividendYield", label: "Dividend yield %", category: "Dividends", subcategory: "Yield", type: "number", availability: "locked", lockedReason: "Coming soon. Dividend fields are not available from the current quote feed." },
  { key: "payoutRatio", label: "Payout ratio %", category: "Dividends", subcategory: "Yield", type: "number", availability: "locked", lockedReason: "Coming soon. Dividend fields are not available from the current quote feed." },
  { key: "dividendGrowth", label: "Dividend growth %", category: "Dividends", subcategory: "Growth", type: "number", availability: "locked", lockedReason: "Coming soon. Dividend history requires a richer fundamentals provider." },
  { key: "grossMargin", label: "Gross margin %", category: "Margins & Ratios", subcategory: "Margins", type: "number", availability: "locked", lockedReason: "Coming soon. Margin data requires a richer fundamentals provider." },
  { key: "operatingMargin", label: "Operating margin %", category: "Margins & Ratios", subcategory: "Margins", type: "number", availability: "locked", lockedReason: "Coming soon. Margin data requires a richer fundamentals provider." },
  { key: "netMargin", label: "Net margin %", category: "Margins & Ratios", subcategory: "Margins", type: "number", availability: "locked", lockedReason: "Coming soon. Margin data requires a richer fundamentals provider." },
  { key: "roe", label: "ROE %", category: "Margins & Ratios", subcategory: "Returns", type: "number", availability: "locked", lockedReason: "Coming soon. Return-ratio data requires a richer fundamentals provider." },
  { key: "roic", label: "ROIC %", category: "Margins & Ratios", subcategory: "Returns", type: "number", availability: "locked", lockedReason: "Coming soon. Return-ratio data requires a richer fundamentals provider." },
  { key: "debtToEquity", label: "Debt / equity", category: "Margins & Ratios", subcategory: "Leverage", type: "number", availability: "locked", lockedReason: "Coming soon. Balance-sheet ratio data requires a richer fundamentals provider." },
];

const INITIAL_WORKSPACE_STATE = loadWorkspaceState();
const INITIAL_CUSTOM_METRICS = hydrateCustomMetrics(INITIAL_WORKSPACE_STATE.customMetrics || []);

const CLASSIC_PRESETS = {
  "opening-drive": {
    label: "Power-hour carry",
    filters: {
      session: "overnight",
      minMomentum: 64,
      maxRisk: 34,
      minRelativeVolume: 1.3,
      sector: "all",
      marketCap: "Mega cap",
      minQuality: 76,
      sortBy: "score",
      minPrice: 20,
      maxPrice: 300,
      theme: "all",
      groupMode: "AND",
      formulaRules: [
        { id: createRuleId(), field: "carry", operator: ">=", value: "74", negate: false },
        { id: createRuleId(), field: "closePosition", operator: ">=", value: "0.58", negate: false },
        { id: createRuleId(), field: "turnover", operator: ">=", value: "10000000", negate: false },
      ],
    },
    summary: "Power-hour carry favors liquid names that finish the session with enough quality to hold into the next day.",
  },
  "vwap-reclaim": {
    label: "Swing continuation",
    filters: {
      session: "swing",
      minMomentum: 68,
      maxRisk: 38,
      minRelativeVolume: 1.2,
      sector: "all",
      marketCap: "Mega cap",
      minQuality: 78,
      sortBy: "quality",
      minPrice: 20,
      maxPrice: 400,
      theme: "all",
      groupMode: "AND",
      formulaRules: [
        { id: createRuleId(), field: "quality", operator: ">=", value: "78", negate: false },
        { id: createRuleId(), field: "carry", operator: ">=", value: "76", negate: false },
        { id: createRuleId(), field: "vwapDrift", operator: ">=", value: "-0.2", negate: false },
      ],
    },
    summary: "Swing continuation leans on 15-minute structure and quality so cleaner multi-session trends outrank noisy breakouts.",
  },
  "liquidity-sweep": {
    label: "15m trend build",
    filters: {
      session: "swing",
      minMomentum: 66,
      maxRisk: 42,
      minRelativeVolume: 1.4,
      sector: "all",
      marketCap: "all",
      minQuality: 72,
      sortBy: "quality",
      minPrice: 15,
      maxPrice: 400,
      theme: "all",
      groupMode: "AND",
      formulaRules: [
        { id: createRuleId(), field: "turnoverRatio", operator: ">=", value: "1.1", negate: false },
        { id: createRuleId(), field: "rangePct", operator: "<=", value: "6", negate: false },
        { id: createRuleId(), field: "quality", operator: ">=", value: "72", negate: false },
      ],
    },
    summary: "15m trend build looks for steady participation and cleaner range behavior that can support a 2 to 5 session hold.",
  },
  "clean-carry": {
    label: "Defensive carry",
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
    summary: "Defensive carry trims the universe down to steadier liquid names that can survive slower overnight and multi-day holds.",
  },
};

const SCREEN_DEFINITIONS = [
  { key: "scanner", label: "Scanner", description: "AI and classic screen builder", aliases: ["scanner", "scan", "筛选", "扫描", "工作区"] },
  { key: "universe", label: "Universe", description: "Browse the tracked universe", aliases: ["universe", "market", "全量", "全部股票", "市场"] },
  { key: "watchlist", label: "Watchlist", description: "Saved names and quick checks", aliases: ["watchlist", "saved", "自选", "观察列表"] },
  { key: "settings", label: "Settings", description: "Data source, auth, and runtime", aliases: ["settings", "config", "data source", "设置", "数据源"] },
];

const SEARCH_ALIASES = {
  sp500: "sp500",
  "s&p 500": "sp500",
  "标普500": "sp500",
  "标普 500": "sp500",
  nasdaq100: "nasdaq100",
  "nasdaq 100": "nasdaq100",
  "纳指100": "nasdaq100",
  "纳斯达克100": "nasdaq100",
  semiconductors: "Semiconductors",
  半导体: "Semiconductors",
  software: "Software",
  软件: "Software",
  internet: "Internet",
  互联网: "Internet",
  healthcare: "Healthcare",
  医疗: "Healthcare",
  financials: "Financials",
  金融: "Financials",
  consumer: "Consumer",
  消费: "Consumer",
  "ai infrastructure": "AI infrastructure",
  "ai基础设施": "AI infrastructure",
  "platform leader": "Platform leader",
  平台龙头: "Platform leader",
  "opening drive": "opening-drive",
  开盘驱动: "opening-drive",
  "vwap reclaim": "vwap-reclaim",
  "vwap 回收": "vwap-reclaim",
  "liquidity sweep": "liquidity-sweep",
  流动性扫描: "liquidity-sweep",
  "clean carry": "clean-carry",
  干净隔夜: "clean-carry",
};
const REFRESH_INTERVAL_MS = 1000 * 60 * 15;
const HISTORY_INTERVAL = "15min";
const HISTORY_POINTS = 104;
const LOCAL_SEARCH_ALIASES = {
  标普500: "sp500",
  "标普 500": "sp500",
  纳指100: "nasdaq100",
  "纳斯达克100": "nasdaq100",
  半导体: "Semiconductors",
  软件: "Software",
  互联网: "Internet",
  医疗: "Healthcare",
  金融: "Financials",
  消费: "Consumer",
  设置: "settings",
  数据源: "settings",
  自选: "watchlist",
  观察列表: "watchlist",
  扫描: "scanner",
  筛选: "scanner",
  市场: "universe",
  全量: "universe",
  "ai基础设施": "AI infrastructure",
  平台龙头: "Platform leader",
  开盘驱动: "opening-drive",
  流动性扫描: "liquidity-sweep",
  干净隔夜: "clean-carry",
};

function getDefaultClassicFilters() {
  return {
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
  };
}

const state = {
  currentScreen: "scanner",
  surfaceMode: "ai",
  selectedSymbol: "NVDA",
  authMode: "login",
  currentUser: null,
  accountMenuOpen: false,
  authModalOpen: false,
  fieldLibraryOpen: false,
  paletteOpen: false,
  aiWorking: false,
  resultsView: "table",
  formulaPanelMode: "rules",
  aiRuntime: {
    source: "heuristic",
    provider: "Heuristic parser",
    model: "",
    note: "Heuristic parser active until a server-side OpenAI key is configured.",
  },
  apiKey: loadStoredApiKey(),
  apiConfig: {
    hasServerKey: false,
    provider: "Twelve Data",
    aiParser: {
      provider: "Heuristic fallback",
      hasServerKey: false,
      model: "",
    },
  },
  marketTransport: "idle",
  quoteMap: {},
  historyMap: {},
  lastUpdatedAt: null,
  isRefreshing: false,
  isLoadingHistory: false,
  loadError: "",
  watchlist: loadWatchlist(),
  customMetrics: INITIAL_CUSTOM_METRICS,
  paletteQuery: "",
  boardFilterTerm: "",
  universeFilterTerm: "",
  universeSourceFilter: "all",
  universeSectorFilter: "all",
  fieldLibrarySearch: "",
  fieldLibraryNotice: "",
  customMetricDraft: {
    name: "",
    expression: "",
    feedback: "",
    error: "",
    dependencies: [],
  },
  authMessage: "Guest mode stores watchlists only in this browser.",
  profile: createProfile({
    label: "Multi-session quality",
    description: "15-minute structure profile tuned for overnight and multi-day continuation instead of high-frequency tape.",
    title: "Top overnight and swing setups",
    filter: () => true,
    scoreConfig: { momentum: 0.92, safety: 1.16, carry: 1.08, sessionBoost: "swing" },
    meta: {
      window: "15-minute delayed · 1 to 5 sessions",
      holdBias: "Overnight to multi-day",
      riskBias: "Conservative",
      executionNote: "SignalDeck is prioritizing cleaner 15-minute structure, carry strength, and downside control over fast open-drive noise.",
      monitorFocus: "Carry strength, trend quality, and close behavior",
      intentChips: ["15-minute mode", "Overnight bias", "Quality first"],
      rationale: [
        "The default scan now starts from a slower 15-minute horizon so the product can stay honest under delayed-data limits.",
        "Carry strength and trend quality stay ahead of raw opening velocity, so overnight and swing candidates rank more naturally.",
        "This default profile is designed for 1 to 5 session ideas rather than high-frequency intraday chasing.",
      ],
    },
  }),
  classicFilters: hydrateClassicFilters(INITIAL_WORKSPACE_STATE.classicFilters || getDefaultClassicFilters(), INITIAL_CUSTOM_METRICS),
};

const elements = {
  terminalGrid: document.querySelector(".terminal-grid"),
  navLinks: [...document.querySelectorAll("[data-nav-screen]")],
  screens: [...document.querySelectorAll("[data-screen]")],
  promptButtons: [...document.querySelectorAll(".prompt-pill")],
  presetButtons: [...document.querySelectorAll("[data-preset]")],
  tabs: [...document.querySelectorAll(".surface-tab")],
  panels: [...document.querySelectorAll(".mode-panel")],
  authTabs: [...document.querySelectorAll(".auth-tab")],
  authToggle: document.getElementById("auth-toggle"),
  aiQuery: document.getElementById("ai-query"),
  runAi: document.getElementById("run-ai"),
  aiSummary: document.getElementById("ai-summary"),
  aiProviderNote: document.getElementById("ai-provider-note"),
  intentChips: document.getElementById("intent-chips"),
  aiRationale: document.getElementById("ai-rationale"),
  surfaceCaption: document.getElementById("surface-caption"),
  opportunityList: document.getElementById("opportunity-list"),
  resultsTitle: document.getElementById("results-title"),
  resultsMeta: document.getElementById("results-meta"),
  symbolSearch: document.getElementById("symbol-search"),
  topbarSearch: document.getElementById("topbar-search-input"),
  backgroundVideo: document.getElementById("background-video"),
  backgroundVideoSource: document.getElementById("background-video-source"),
  palettePopover: document.getElementById("palette-popover"),
  paletteResults: document.getElementById("palette-results"),
  paletteMeta: document.getElementById("palette-meta"),
  pulseStrip: document.getElementById("pulse-strip"),
  marketContextMeta: document.getElementById("market-context-meta"),
  marketContextGrid: document.getElementById("market-context-grid"),
  universeContextMeta: document.getElementById("universe-context-meta"),
  universeContextGrid: document.getElementById("universe-context-grid"),
  feedStatus: document.getElementById("feed-status-text"),
  lastUpdated: document.getElementById("last-updated"),
  connectionState: document.getElementById("connection-state"),
  settingsFeedStatus: document.getElementById("settings-feed-status"),
  settingsLastUpdated: document.getElementById("settings-last-updated"),
  settingsAiStatus: document.getElementById("settings-ai-status"),
  settingsRuntimeNote: document.getElementById("settings-runtime-note"),
  dataSourceNote: document.getElementById("data-source-note"),
  dataModalCopy: document.getElementById("data-modal-copy"),
  apiKeyInput: document.getElementById("api-key-input"),
  saveApiKey: document.getElementById("save-api-key"),
  refreshMarket: document.getElementById("refresh-market"),
  watchlistCount: document.getElementById("watchlist-count"),
  watchlistList: document.getElementById("watchlist-list"),
  watchlistNote: document.getElementById("watchlist-note"),
  watchlistScreenMeta: document.getElementById("watchlist-screen-meta"),
  watchlistScreenList: document.getElementById("watchlist-screen-list"),
  universeMeta: document.getElementById("universe-meta"),
  universeSearch: document.getElementById("universe-search"),
  universeSectorFilter: document.getElementById("universe-sector-filter"),
  universeSourceFilters: [...document.querySelectorAll("[data-universe-source]")],
  universeList: document.getElementById("universe-list"),
  accountBadge: document.getElementById("account-badge"),
  accountCopy: document.getElementById("account-copy"),
  authModal: document.getElementById("auth-modal"),
  authModalClose: document.getElementById("auth-modal-close"),
  fieldLibraryModal: document.getElementById("field-library-modal"),
  fieldLibraryClose: document.getElementById("field-library-close"),
  fieldLibrarySearch: document.getElementById("field-library-search"),
  fieldLibraryGroups: document.getElementById("field-library-groups"),
  fieldLibraryNotice: document.getElementById("field-library-notice"),
  authEmailWrap: document.getElementById("auth-email-wrap"),
  authPasswordWrap: document.getElementById("auth-password-wrap"),
  authEmail: document.getElementById("auth-email"),
  authPassword: document.getElementById("auth-password"),
  authSubmit: document.getElementById("auth-submit"),
  authGoogle: document.getElementById("auth-google"),
  authLogout: document.getElementById("auth-logout"),
  authMessage: document.getElementById("auth-message"),
  topbarSignIn: document.getElementById("topbar-signin"),
  topbarRegister: document.getElementById("topbar-register"),
  topbarSettings: document.getElementById("topbar-settings"),
  settingsSignIn: document.getElementById("settings-signin"),
  settingsRegister: document.getElementById("settings-register"),
  settingsSignOut: document.getElementById("settings-signout"),
  settingsAccountLabel: document.getElementById("settings-account-label"),
  settingsAccountCopy: document.getElementById("settings-account-copy"),
  topbarAccount: document.getElementById("topbar-account"),
  accountTrigger: document.getElementById("account-trigger"),
  accountDrawer: document.getElementById("account-drawer"),
  accountAvatar: document.getElementById("account-avatar"),
  accountDrawerAvatar: document.getElementById("account-drawer-avatar"),
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
  formulaTabs: [...document.querySelectorAll("[data-formula-panel]")],
  formulaPanels: [...document.querySelectorAll("[data-formula-view]")],
  customMetricName: document.getElementById("custom-metric-name"),
  customMetricExpression: document.getElementById("custom-metric-expression"),
  customMetricDeps: document.getElementById("custom-metric-deps"),
  customMetricFeedback: document.getElementById("custom-metric-feedback"),
  customMetricList: document.getElementById("custom-metric-list"),
  saveCustomMetric: document.getElementById("save-custom-metric"),
  presetSummary: document.getElementById("preset-summary"),
  logicModeFilter: document.getElementById("logic-mode-filter"),
  momentumValue: document.getElementById("momentum-value"),
  riskValue: document.getElementById("risk-value"),
  volumeValue: document.getElementById("volume-value"),
  qualityValue: document.getElementById("quality-value"),
  applyFilters: document.getElementById("apply-filters"),
  filterChipBar: document.getElementById("filter-chip-bar"),
  filterChipMeta: document.getElementById("filter-chip-meta"),
  resultsSurface: document.getElementById("results-surface"),
  viewTable: document.getElementById("view-table"),
  viewCards: document.getElementById("view-cards"),
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
  inspectorColumn: document.getElementById("inspector-column"),
};

function initializeBackgroundMedia() {
  if (!elements.backgroundVideo || !elements.backgroundVideoSource) {
    return;
  }

  const allowsMotion = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
  const allowsDesktopVideo = window.matchMedia("(min-width: 960px)").matches;

  if (!allowsMotion || !allowsDesktopVideo) {
    return;
  }

  const source = elements.backgroundVideoSource.dataset.src;
  if (!source || elements.backgroundVideoSource.src) {
    return;
  }

  elements.backgroundVideoSource.src = source;
  elements.backgroundVideo.load();

  const playAttempt = elements.backgroundVideo.play();
  if (playAttempt && typeof playAttempt.catch === "function") {
    playAttempt.catch(() => {});
  }
}

bindEvents();
bindSupabaseAuthListener();
initialize();

async function initialize() {
  initializeBackgroundMedia();
  consumeUrlAuthError();
  elements.apiKeyInput.value = state.apiKey;
  populateClassicFilterOptions();
  populateUniverseControls();
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

function setSelectOptions(select, values, allLabel, currentValue = "all") {
  const uniqueValues = [...new Set(values.filter(Boolean))].sort((left, right) => left.localeCompare(right));
  if (currentValue && currentValue !== "all" && !uniqueValues.includes(currentValue)) {
    uniqueValues.unshift(currentValue);
  }

  select.innerHTML = "";
  select.append(new Option(allLabel, "all"));
  uniqueValues.forEach(value => {
    select.append(new Option(value, value));
  });
}

function populateClassicFilterOptions() {
  setSelectOptions(
    elements.sectorFilter,
    trackedUniverse.map(stock => stock.sector),
    "All sectors",
    state.classicFilters.sector,
  );
  setSelectOptions(
    elements.marketCapFilter,
    trackedUniverse.map(stock => stock.marketCap),
    "All caps",
    state.classicFilters.marketCap,
  );
  setSelectOptions(
    elements.themeFilter,
    trackedUniverse.map(stock => stock.theme),
    "All themes",
    state.classicFilters.theme,
  );
}

function populateUniverseControls() {
  setSelectOptions(
    elements.universeSectorFilter,
    trackedUniverse.map(stock => stock.sector),
    "All sectors",
    state.universeSectorFilter,
  );
}

function bindEvents() {
  elements.navLinks.forEach(button => {
    button.addEventListener("click", () => {
      setCurrentScreen(button.dataset.navScreen);
    });
  });

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
    state.authModalOpen = true;
    state.accountMenuOpen = false;
    setAuthMode("login");
    renderAuthState();
  });
  elements.topbarRegister.addEventListener("click", () => {
    state.authModalOpen = true;
    state.accountMenuOpen = false;
    setAuthMode("register");
    renderAuthState();
  });
  elements.topbarSettings.addEventListener("click", () => {
    setCurrentScreen("settings");
  });
  elements.settingsSignIn.addEventListener("click", () => {
    state.authModalOpen = true;
    state.accountMenuOpen = false;
    setAuthMode("login");
    renderAuthState();
  });
  elements.settingsRegister.addEventListener("click", () => {
    state.authModalOpen = true;
    state.accountMenuOpen = false;
    setAuthMode("register");
    renderAuthState();
  });
  elements.settingsSignOut.addEventListener("click", handleLogout);
  elements.accountTrigger.addEventListener("click", () => {
    if (!state.currentUser) {
      state.authModalOpen = true;
      setAuthMode("login");
    } else {
      state.accountMenuOpen = !state.accountMenuOpen;
    }
    renderAuthState();
  });
  elements.authModalClose.addEventListener("click", () => {
    state.authModalOpen = false;
    renderAuthState();
  });
  elements.fieldLibraryClose.addEventListener("click", () => {
    state.fieldLibraryOpen = false;
    renderFieldLibrary();
  });

  elements.runAi.addEventListener("click", () => handleAiRun(elements.aiQuery.value.trim()));
  elements.applyFilters.addEventListener("click", applyClassicFilters);
  elements.refreshMarket.addEventListener("click", () => refreshMarketData());
  elements.viewTable.addEventListener("click", () => {
    state.resultsView = "table";
    render();
  });
  elements.viewCards.addEventListener("click", () => {
    state.resultsView = "cards";
    render();
  });
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
    state.boardFilterTerm = event.target.value.trim().toLowerCase();
    render();
  });
  elements.universeSearch.addEventListener("input", event => {
    state.universeFilterTerm = event.target.value.trim().toLowerCase();
    render();
  });
  elements.universeSectorFilter.addEventListener("change", event => {
    state.universeSectorFilter = event.target.value;
    render();
  });
  elements.universeSourceFilters.forEach(button => {
    button.addEventListener("click", () => {
      state.universeSourceFilter = button.dataset.universeSource || "all";
      render();
    });
  });
  elements.topbarSearch.addEventListener("focus", () => {
    state.paletteOpen = true;
    state.paletteQuery = elements.topbarSearch.value.trim().toLowerCase();
    renderPalette();
  });
  elements.topbarSearch.addEventListener("input", event => {
    state.paletteOpen = true;
    state.paletteQuery = event.target.value.trim().toLowerCase();
    renderPalette();
  });
  elements.topbarSearch.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      state.paletteOpen = false;
      renderPalette();
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const [firstMatch] = getCommandPaletteItems(state.paletteQuery);
      if (firstMatch) {
        applyPaletteAction(firstMatch);
      }
    }
  });
  elements.momentumFilter.addEventListener("input", event => {
    elements.momentumValue.textContent = event.target.value;
    applyClassicFilters();
  });
  elements.riskFilter.addEventListener("input", event => {
    elements.riskValue.textContent = event.target.value;
    applyClassicFilters();
  });
  elements.volumeFilter.addEventListener("input", event => {
    elements.volumeValue.textContent = `${(event.target.value / 10).toFixed(1)}x`;
    applyClassicFilters();
  });
  elements.qualityFilter.addEventListener("input", event => {
    elements.qualityValue.textContent = event.target.value;
    applyClassicFilters();
  });
  [
    elements.sessionFilter,
    elements.sectorFilter,
    elements.marketCapFilter,
    elements.sortFilter,
    elements.priceMinFilter,
    elements.priceMaxFilter,
    elements.themeFilter,
  ].forEach(control => {
    control.addEventListener(control.matches("input") ? "input" : "change", applyClassicFilters);
  });
  elements.logicModeFilter.addEventListener("change", event => {
    state.classicFilters.groupMode = event.target.value;
    applyClassicFilters();
  });
  elements.addFormulaRule.addEventListener("click", () => {
    state.fieldLibraryOpen = true;
    state.fieldLibrarySearch = "";
    state.fieldLibraryNotice = "Choose a live or derived field to add it as a rule.";
    renderFieldLibrary();
  });
  elements.fieldLibrarySearch.addEventListener("input", event => {
    state.fieldLibrarySearch = event.target.value;
    renderFieldLibrary();
  });
  elements.formulaTabs.forEach(button => {
    button.addEventListener("click", () => {
      state.formulaPanelMode = button.dataset.formulaPanel;
      renderFormulaPanelState();
    });
  });
  [elements.customMetricName, elements.customMetricExpression].forEach(control => {
    control.addEventListener("input", handleCustomMetricDraftInput);
  });
  elements.saveCustomMetric.addEventListener("click", handleSaveCustomMetric);
  document.addEventListener("click", event => {
    if (!state.accountMenuOpen) {
      if (event.target === elements.authModal) {
        state.authModalOpen = false;
        renderAuthState();
      }
      if (event.target === elements.fieldLibraryModal) {
        state.fieldLibraryOpen = false;
        renderFieldLibrary();
      }
    }
    if (
      state.paletteOpen &&
      !event.target.closest(".topbar-search") &&
      !event.target.closest(".palette-popover")
    ) {
      state.paletteOpen = false;
      renderPalette();
    }
    if (state.accountMenuOpen && !event.target.closest(".account-shell")) {
      state.accountMenuOpen = false;
      renderAuthState();
    }
  });
  document.addEventListener("keydown", event => {
    if (event.key !== "/") {
      return;
    }
    if (event.target instanceof HTMLElement && event.target.closest("input, textarea, select")) {
      return;
    }
    event.preventDefault();
    elements.topbarSearch.focus();
    elements.topbarSearch.select();
  });
}

function handleCustomMetricDraftInput() {
  const name = elements.customMetricName.value;
  const expression = elements.customMetricExpression.value;
  if (!String(name).trim() && !String(expression).trim()) {
    state.customMetricDraft = {
      name: "",
      expression: "",
      feedback: "",
      error: "",
      dependencies: [],
    };
    renderCustomMetricState();
    return;
  }
  const validation = validateCustomMetricDraft(name, expression);
  state.customMetricDraft = {
    name,
    expression,
    feedback: validation.feedback,
    error: validation.error,
    dependencies: validation.dependencies,
  };
  renderCustomMetricState();
}

function handleSaveCustomMetric() {
  handleCustomMetricDraftInput();
  if (state.customMetricDraft.error) {
    renderCustomMetricState();
    return;
  }

  const normalized = normalizeCustomMetric({
    id: createMetricId(),
    name: state.customMetricDraft.name,
    expression: state.customMetricDraft.expression,
  });

  if (!normalized) {
    state.customMetricDraft.error = "Metric could not be saved.";
    renderCustomMetricState();
    return;
  }

  state.customMetrics = [
    ...state.customMetrics.filter(metric => metric.name.toLowerCase() !== normalized.name.toLowerCase()),
    normalized,
  ];
  state.customMetricDraft = {
    name: "",
    expression: "",
    feedback: `${normalized.name} is now available in Rules and the field library.`,
    error: "",
    dependencies: [],
  };
  scheduleWorkspacePersist();
  render();
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
  let usedStructuredParser = false;
  let fallbackReason = "";

  if (state.apiConfig.aiParser?.hasServerKey) {
    try {
      const payload = await fetchJson("/api/ai/scan-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
      applyStructuredAiProfile(payload.profile, payload);
      usedStructuredParser = true;
    } catch (error) {
      fallbackReason = error.message;
    }
  }

  if (!usedStructuredParser) {
    runAiQuery(query, { fallbackReason });
  }

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

function setClassicFiltersFromAi(nextFilters) {
  state.classicFilters = {
    ...getDefaultClassicFilters(),
    ...nextFilters,
    formulaRules: sanitizeFormulaRules(nextFilters.formulaRules || []),
  };
  syncClassicControls();
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
  setSurfaceMode("classic");
  applyClassicFilters();
}

function createFormulaRule() {
  const defaultField = getExecutableFieldCatalog()[0]?.key || "relativeVolume";
  return {
    id: createRuleId(),
    field: defaultField,
    operator: ">=",
    value: getFormulaFieldMeta(defaultField)?.type === "text" ? "" : "0",
    valueSecondary: "",
    negate: false,
  };
}

function createRuleId() {
  return `rule-${Math.random().toString(36).slice(2, 10)}`;
}

function createMetricId() {
  return `metric-${Math.random().toString(36).slice(2, 10)}`;
}

function getWorkspaceSnapshot() {
  return {
    classicFilters: {
      ...state.classicFilters,
      formulaRules: sanitizeFormulaRules(state.classicFilters.formulaRules),
    },
    customMetrics: serializeCustomMetrics(state.customMetrics),
  };
}

function loadWorkspaceState() {
  try {
    const raw = window.localStorage.getItem("signaldeck-screen-state");
    if (!raw) {
      return { classicFilters: getDefaultClassicFilters(), customMetrics: [] };
    }
    const parsed = JSON.parse(raw);
    return {
      classicFilters: parsed?.classicFilters || getDefaultClassicFilters(),
      customMetrics: Array.isArray(parsed?.customMetrics) ? parsed.customMetrics : [],
    };
  } catch (error) {
    return { classicFilters: getDefaultClassicFilters(), customMetrics: [] };
  }
}

function saveWorkspaceState(snapshot) {
  try {
    window.localStorage.setItem("signaldeck-screen-state", JSON.stringify(snapshot));
  } catch (error) {
    console.warn("Unable to persist screen state", error);
  }
}

let workspacePersistTimer = null;

function scheduleWorkspacePersist() {
  saveWorkspaceState(getWorkspaceSnapshot());

  if (!state.currentUser) {
    return;
  }

  window.clearTimeout(workspacePersistTimer);
  workspacePersistTimer = window.setTimeout(() => {
    persistWorkspaceState();
  }, 500);
}

async function persistUserMetadata(patch) {
  if (!state.currentUser) {
    return;
  }

  const { data, error } = await supabaseClient.auth.updateUser({
    data: {
      ...(state.currentUser.user_metadata || {}),
      ...patch,
    },
  });

  if (error) {
    throw error;
  }

  state.currentUser = data.user;
}

async function persistWorkspaceState() {
  try {
    await persistUserMetadata({
      screenState: getWorkspaceSnapshot(),
    });
  } catch (error) {
    state.authMessage = error.message;
  } finally {
    render();
  }
}

function hydrateClassicFilters(filters, customMetrics = null) {
  const defaults = getDefaultClassicFilters();
  return {
    ...defaults,
    ...(filters || {}),
    formulaRules: sanitizeFormulaRules(filters?.formulaRules || defaults.formulaRules, customMetrics),
  };
}

function serializeCustomMetrics(metrics) {
  return (Array.isArray(metrics) ? metrics : []).map(metric => ({
    id: metric.id,
    name: metric.name,
    expression: metric.expression,
    type: "number",
  }));
}

function hydrateCustomMetrics(metrics) {
  return (Array.isArray(metrics) ? metrics : [])
    .map(metric => normalizeCustomMetric(metric))
    .filter(Boolean);
}

function normalizeCustomMetric(metric) {
  const name = String(metric?.name || "").trim();
  const expression = String(metric?.expression || "").trim();
  if (!name || !expression) {
    return null;
  }

  const validation = validateCustomMetricDraft(name, expression);
  if (validation.error) {
    return null;
  }

  return {
    id: metric.id || createMetricId(),
    name,
    expression,
    type: "number",
    dependencies: validation.dependencies,
    compiled: validation.compiled,
    feedback: validation.feedback,
  };
}

function getBaseNumericExpressionFields() {
  return BASE_FIELD_CATALOG.filter(field => field.type === "number" && field.availability !== "locked");
}

function getBaseFieldMeta(fieldKey) {
  return BASE_FIELD_CATALOG.find(field => field.key === fieldKey) || null;
}

function getCustomMetricCatalogItems(customMetrics = null) {
  const metrics = customMetrics || (typeof state === "undefined" ? [] : state.customMetrics);
  return metrics.map(metric => ({
    key: metric.id,
    label: metric.name,
    category: "Custom Metrics",
    subcategory: "Expression builder",
    type: "number",
    availability: "derived",
    source: metric.expression,
    description: metric.feedback || `Built from ${metric.expression}`,
    customMetric: metric,
  }));
}

function getExecutableFieldCatalog(customMetrics = null) {
  return [...BASE_FIELD_CATALOG.filter(field => field.availability !== "locked"), ...getCustomMetricCatalogItems(customMetrics)];
}

function getFullFieldCatalog() {
  return [...BASE_FIELD_CATALOG, ...LOCKED_FIELD_CATALOG, ...getCustomMetricCatalogItems()];
}

function getRuleFieldGroups() {
  return FIELD_CATEGORY_ORDER.map(category => ({
    category,
    fields: getExecutableFieldCatalog().filter(field => field.category === category),
  })).filter(group => group.fields.length);
}

function getFieldCatalogGroups(searchTerm = "") {
  const needle = String(searchTerm || "").trim().toLowerCase();
  return FIELD_CATEGORY_ORDER.map(category => ({
    category,
    fields: getFullFieldCatalog().filter(field => {
      if (field.category !== category) {
        return false;
      }
      if (!needle) {
        return true;
      }

      const haystack = `${field.label} ${field.key} ${field.category} ${field.subcategory || ""} ${field.description || ""}`.toLowerCase();
      return haystack.includes(needle);
    }),
  })).filter(group => group.fields.length);
}

function getRuleFieldSelectOptions(selectedField) {
  return getRuleFieldGroups()
    .map(
      group => `
        <optgroup label="${group.category}">
          ${group.fields
            .map(field => `<option value="${field.key}" ${field.key === selectedField ? "selected" : ""}>${field.label}</option>`)
            .join("")}
        </optgroup>
      `,
    )
    .join("");
}

function getFieldAvailabilityLabel(availability) {
  if (availability === "derived") {
    return "Derived";
  }
  if (availability === "locked") {
    return "Locked";
  }
  return "Live";
}

function getMetricDependencyLabel(fieldKey) {
  return getBaseFieldMeta(fieldKey)?.label || fieldKey;
}

function validateCustomMetricDraft(name, expression) {
  const trimmedName = String(name || "").trim();
  const trimmedExpression = String(expression || "").trim();
  if (!trimmedName) {
    return { error: "Name is required.", dependencies: [], feedback: "", compiled: null };
  }
  if (!trimmedExpression) {
    return { error: "Expression is required.", dependencies: [], feedback: "", compiled: null };
  }

  const tokenPattern = /([A-Za-z_][A-Za-z0-9_]*|\d+(?:\.\d+)?|\.\d+|[()+\-*/,])/g;
  const stripped = trimmedExpression.replace(/\s+/g, "");
  const tokens = trimmedExpression.match(tokenPattern) || [];
  if (tokens.join("").replace(/\s+/g, "") !== stripped) {
    return { error: "Expression contains unsupported characters.", dependencies: [], feedback: "", compiled: null };
  }

  let depth = 0;
  for (const token of tokens) {
    if (token === "(") {
      depth += 1;
    } else if (token === ")") {
      depth -= 1;
      if (depth < 0) {
        return { error: "Parentheses do not match.", dependencies: [], feedback: "", compiled: null };
      }
    }
  }
  if (depth !== 0) {
    return { error: "Parentheses do not match.", dependencies: [], feedback: "", compiled: null };
  }

  for (let index = 0; index < tokens.length; index += 1) {
    if (tokens[index] === "/" && Number(tokens[index + 1]) === 0) {
      return { error: "Potential divide-by-zero risk detected.", dependencies: [], feedback: "", compiled: null };
    }
  }

  const allowedFields = new Set(getBaseNumericExpressionFields().map(field => field.key));
  const supportedFunctions = new Set(["abs", "min", "max"]);
  const dependencies = [];
  const compiledTokens = [];

  for (const token of tokens) {
    if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(token)) {
      if (supportedFunctions.has(token)) {
        compiledTokens.push(`__${token}`);
        continue;
      }
      if (!allowedFields.has(token)) {
        return { error: `Unknown field: ${token}.`, dependencies: [], feedback: "", compiled: null };
      }
      dependencies.push(token);
      compiledTokens.push(`get("${token}")`);
      continue;
    }
    compiledTokens.push(token);
  }

  const compiledSource = compiledTokens.join(" ");

  try {
    const compiled = new Function(
      "get",
      "__abs",
      "__min",
      "__max",
      `"use strict"; const value = (${compiledSource}); if (!Number.isFinite(value)) { throw new Error("Expression did not resolve to a finite number."); } return value;`,
    );

    compiled(() => 1, Math.abs, Math.min, Math.max);

    const uniqueDependencies = [...new Set(dependencies)];
    return {
      error: "",
      dependencies: uniqueDependencies,
      compiled,
      feedback: uniqueDependencies.length
        ? `Built from ${uniqueDependencies.map(getMetricDependencyLabel).join(", ")}.`
        : "Expression is ready to use.",
    };
  } catch (error) {
    return {
      error: error.message || "Expression could not be parsed.",
      dependencies: [],
      feedback: "",
      compiled: null,
    };
  }
}

function evaluateCustomMetric(stock, metric) {
  if (!metric?.compiled) {
    return NaN;
  }

  try {
    return metric.compiled(
      key => {
        const meta = getBaseFieldMeta(key);
        const value = meta?.getter ? meta.getter(stock) : stock[key];
        const numeric = Number(value);
        return Number.isFinite(numeric) ? numeric : 0;
      },
      Math.abs,
      Math.min,
      Math.max,
    );
  } catch (error) {
    return NaN;
  }
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

function sanitizeFormulaRules(rules, customMetrics = null) {
  const firstField = getExecutableFieldCatalog(customMetrics)[0]?.key || "relativeVolume";
  return (Array.isArray(rules) ? rules : [])
    .map(rule => ({
      id: rule.id || createRuleId(),
      field: getFormulaFieldMeta(rule.field, customMetrics)?.key || firstField,
      operator: rule.operator || ">=",
      value: String(rule.value ?? ""),
      valueSecondary: String(rule.valueSecondary ?? ""),
      negate: Boolean(rule.negate),
    }));
}

function getCatalogFieldMeta(fieldKey) {
  return getFullFieldCatalog().find(field => field.key === fieldKey) || null;
}

function getFormulaFieldMeta(fieldKey, customMetrics = null) {
  return getExecutableFieldCatalog(customMetrics).find(field => field.key === fieldKey) || null;
}

function getOperatorsForRule(rule) {
  return getFormulaFieldMeta(rule.field)?.type === "text"
    ? ["is", "contains", "is not"]
    : [">=", ">", "<=", "<", "=", "!=", "between", "not between"];
}

function isRangeOperator(operator) {
  return operator === "between" || operator === "not between";
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
    rule.valueSecondary = "";
  }
  if (prop === "operator" && !isRangeOperator(value)) {
    rule.valueSecondary = "";
  }
  applyClassicFilters();
}

function matchesFormulaRules(stock, rules, groupMode = "AND") {
  const activeRules = sanitizeFormulaRules(rules).filter(rule =>
    isRangeOperator(rule.operator)
      ? String(rule.value).trim() !== "" && String(rule.valueSecondary).trim() !== ""
      : String(rule.value).trim() !== "",
  );
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

function getFormulaFieldValue(stock, fieldKey) {
  const meta = getFormulaFieldMeta(fieldKey);
  if (!meta) {
    return undefined;
  }
  if (meta.customMetric) {
    return evaluateCustomMetric(stock, meta.customMetric);
  }
  return typeof meta.getter === "function" ? meta.getter(stock) : stock[fieldKey];
}

function evaluateFormulaRule(stock, rule) {
  const meta = getFormulaFieldMeta(rule.field);
  if (!meta) {
    return true;
  }

  const stockValue = getFormulaFieldValue(stock, rule.field);
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
  const rightSecondary = Number(rule.valueSecondary);
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
    case "between": {
      if (!Number.isFinite(rightSecondary)) {
        return true;
      }
      const lower = Math.min(right, rightSecondary);
      const upper = Math.max(right, rightSecondary);
      result = left >= lower && left <= upper;
      break;
    }
    case "not between": {
      if (!Number.isFinite(rightSecondary)) {
        return true;
      }
      const lower = Math.min(right, rightSecondary);
      const upper = Math.max(right, rightSecondary);
      result = left < lower || left > upper;
      break;
    }
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
      await syncWorkspaceStateFromAccount();
      state.authMessage = state.currentUser.email_confirmed_at
        ? "Account active. Watchlist and saved state now follow your profile."
        : "Check your inbox to confirm this email address.";
      state.authModalOpen = false;
    } else {
      state.watchlist = loadWatchlist();
      const workspaceState = loadWorkspaceState();
      state.classicFilters = hydrateClassicFilters(workspaceState.classicFilters);
      state.customMetrics = hydrateCustomMetrics(workspaceState.customMetrics);
    }
  } catch (error) {
    state.currentUser = null;
    state.watchlist = loadWatchlist();
    const workspaceState = loadWorkspaceState();
    state.classicFilters = hydrateClassicFilters(workspaceState.classicFilters);
    state.customMetrics = hydrateCustomMetrics(workspaceState.customMetrics);
  } finally {
    syncClassicControls();
    renderAuthState();
  }
}

function setAuthMode(mode) {
  state.authMode = mode;
  renderAuthState();
}

function getAuthRedirectUrl() {
  return `${window.location.origin}/`;
}

function normalizeAuthErrorMessage(message) {
  const text = String(message || "").trim();
  const lower = text.toLowerCase();
  if (!text) {
    return "";
  }

  if (
    lower.includes("redirect") &&
    (lower.includes("not allowed") || lower.includes("invalid") || lower.includes("mismatch"))
  ) {
    return `This deploy URL is not whitelisted for auth yet. Add ${getAuthRedirectUrl()}** in Supabase Authentication > URL Configuration > Redirect URLs.`;
  }

  if (lower.includes("email not confirmed")) {
    return "This account exists, but the email address has not been confirmed yet. Check your inbox and open the confirmation link.";
  }

  if (lower.includes("invalid login credentials")) {
    return "Email or password was not accepted. If this account was just created, confirm the email first and try again.";
  }

  if (lower.includes("provider is not enabled")) {
    return "Google sign-in is not enabled correctly in Supabase yet. Recheck the provider settings and redirect URLs.";
  }

  return text;
}

function consumeUrlAuthError() {
  const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : window.location.hash;
  const combined = [hash, window.location.search.startsWith("?") ? window.location.search.slice(1) : window.location.search]
    .filter(Boolean)
    .join("&");
  if (!combined) {
    return;
  }

  const params = new URLSearchParams(combined);
  const error = params.get("error");
  const errorDescription = params.get("error_description");
  if (!error && !errorDescription) {
    return;
  }

  state.authMode = "login";
  state.authModalOpen = true;
  state.authMessage = normalizeAuthErrorMessage(errorDescription || error);

  if (window.history?.replaceState) {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

function bindSupabaseAuthListener() {
  supabaseClient.auth.onAuthStateChange(async (_event, session) => {
    state.currentUser = session?.user || null;
    if (state.currentUser) {
      await syncWatchlistFromAccount();
      await syncWorkspaceStateFromAccount();
    } else {
      state.watchlist = loadWatchlist();
      const workspaceState = loadWorkspaceState();
      state.classicFilters = hydrateClassicFilters(workspaceState.classicFilters);
      state.customMetrics = hydrateCustomMetrics(workspaceState.customMetrics);
    }
    syncClassicControls();
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
          emailRedirectTo: getAuthRedirectUrl(),
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
      await syncWorkspaceStateFromAccount();
      state.authModalOpen = false;
      state.accountMenuOpen = false;
    }
    syncClassicControls();
    render();
  } catch (error) {
    state.authMessage = normalizeAuthErrorMessage(error.message);
    renderAuthState();
  }
}

async function handleGoogleAuth() {
  state.authMessage = "Redirecting to Google sign-in...";
  renderAuthState();

  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: getAuthRedirectUrl(),
    },
  });

  if (error) {
    state.authMessage = normalizeAuthErrorMessage(error.message);
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
  const workspaceState = loadWorkspaceState();
  state.classicFilters = hydrateClassicFilters(workspaceState.classicFilters);
  state.customMetrics = hydrateCustomMetrics(workspaceState.customMetrics);
  state.authMessage = "Signed out. Guest mode stores watchlists only in this browser.";
  state.accountMenuOpen = false;
  state.authModalOpen = false;
  syncClassicControls();
  render();
}

async function fetchConfig() {
  try {
    const response = await fetch("/api/config");
    if (!response.ok) {
      throw new Error("Unable to load API config.");
    }
    state.apiConfig = await response.json();
    syncAiRuntimeFromConfig();
  } catch (error) {
    state.loadError = error.message;
  } finally {
    renderConnectionState();
  }
}

function syncAiRuntimeFromConfig() {
  const parser = state.apiConfig.aiParser || {};
  if (parser.hasServerKey) {
    state.aiRuntime = {
      source: "standby",
      provider: parser.provider || "OpenAI Responses",
      model: parser.model || "",
      note: `${parser.provider || "OpenAI Responses"} ready${parser.model ? ` (${parser.model})` : ""}. If the live parse fails, SignalDeck falls back to local scan rules.`,
    };
    return;
  }

  state.aiRuntime = {
    source: "heuristic",
    provider: "Heuristic parser",
    model: "",
    note: "Heuristic parser active until a server-side OpenAI key is configured.",
  };
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

function setCurrentScreen(screen) {
  if (!SCREEN_DEFINITIONS.some(definition => definition.key === screen)) {
    return;
  }
  state.currentScreen = screen;
  state.paletteOpen = false;
  render();
}

function normalizeSearchText(value) {
  return String(value || "").trim().toLowerCase();
}

function formatPriceCell(value) {
  return value == null ? "--" : `$${Number(value).toFixed(2)}`;
}

function formatPercentCell(value) {
  return value == null ? "--" : `${formatSigned(value)}%`;
}

function formatRelativeVolumeCell(value) {
  return value == null ? "--" : `${Number(value).toFixed(1)}x`;
}

function formatScoreCell(value) {
  return value == null ? "--" : String(value);
}

function getSourceTagLabel(source) {
  if (source === "sp500") {
    return "S&P 500";
  }
  if (source === "nasdaq100") {
    return "Nasdaq 100";
  }
  return "All large caps";
}

function matchesSourceTag(stock, source) {
  if (source === "all") {
    return true;
  }
  return Array.isArray(stock.sourceTags) && stock.sourceTags.includes(source);
}

function getCompactConnectionCopy(message) {
  const text = String(message || "").trim();
  if (!text) {
    return "SignalDeck is ready to connect to market data.";
  }

  const normalized = text.toLowerCase();
  if (normalized.includes("current minute") || normalized.includes("api credits") || normalized.includes("limit being")) {
    return "Free-tier market data is rate-limited right now. Review Settings for the full runtime note.";
  }
  if (normalized.includes("current day") || normalized.includes("per day") || normalized.includes("daily")) {
    return "Daily market-data quota is exhausted. Review Settings for the full runtime note.";
  }
  if (normalized.includes("api key") || normalized.includes("incorrect or not specified")) {
    return "Market-data key needs attention. Open Settings to review the connection details.";
  }
  if (normalized.includes("quota") || normalized.includes("billing")) {
    return "AI or data quota needs attention. Open Settings for the full provider response.";
  }
  return "Market data needs attention. Open Settings for the full provider response.";
}

function getCompactBriefMetric(label, value) {
  const text = String(value || "");
  if (!text) {
    return "--";
  }

  if (label === "Hold bias") {
    return text
      .replace("Same-day follow-through", "Same-day continuation")
      .replace("Intraday to overnight", "Flexible intraday")
      .replace("Overnight to multi-day", "1 to 5 sessions");
  }

  if (label === "Monitor") {
    if (/trap protection/i.test(text)) {
      return "Trap protection active";
    }
    if (/relative volume/i.test(text)) {
      return "Volume-sensitive scan";
    }
    if (/balancing conviction/i.test(text)) {
      return "Balanced conviction";
    }
    const ruleMatch = text.match(/(AND|OR|NAND|NOR) logic with (\d+) custom rule/i);
    if (ruleMatch) {
      return `${ruleMatch[1].toUpperCase()} logic, ${ruleMatch[2]} rules`;
    }
  }

  return text;
}

function getCommandPaletteItems(query = "") {
  const needle = normalizeSearchText(query);
  const liveUniverse = getLiveUniverse();
  const symbolSource = trackedUniverse.map(meta => {
    const live = liveUniverse.find(stock => stock.symbol === meta.symbol);
    return live ? { ...meta, ...live } : meta;
  });

  const items = [];
  SCREEN_DEFINITIONS.forEach(screen => {
    items.push({
      id: `screen-${screen.key}`,
      type: "screen",
      value: screen.key,
      label: screen.label,
      description: screen.description,
      keywords: [screen.label, screen.description, ...(screen.aliases || [])].join(" ").toLowerCase(),
    });
  });

  Object.entries(CLASSIC_PRESETS).forEach(([key, preset]) => {
    items.push({
      id: `preset-${key}`,
      type: "preset",
      value: key,
      label: preset.label,
      description: preset.summary,
      keywords: [preset.label, preset.summary, key, ...Object.keys(SEARCH_ALIASES).filter(alias => SEARCH_ALIASES[alias] === key)].join(" ").toLowerCase(),
    });
  });

  [
    { value: "sp500", label: "S&P 500", description: "Browse the S&P 500 catalog" },
    { value: "nasdaq100", label: "Nasdaq 100", description: "Browse the Nasdaq 100 catalog" },
  ].forEach(source => {
    items.push({
      id: `source-${source.value}`,
      type: "source",
      value: source.value,
      label: source.label,
      description: source.description,
      keywords: [source.label, source.value, ...Object.keys(SEARCH_ALIASES).filter(alias => SEARCH_ALIASES[alias] === source.value)].join(" ").toLowerCase(),
    });
  });

  symbolSource.forEach(stock => {
    items.push({
      id: `symbol-${stock.symbol}`,
      type: "symbol",
      value: stock.symbol,
      label: stock.symbol,
      description: `${stock.name} - ${stock.sector} - ${stock.theme}`,
      keywords: [stock.symbol, stock.name, stock.sector, stock.theme, stock.session, stock.marketCap].join(" ").toLowerCase(),
    });
  });

  [...new Set(symbolSource.map(stock => stock.sector))].forEach(sector => {
    items.push({
      id: `sector-${sector}`,
      type: "sector",
      value: sector,
      label: sector,
      description: "Filter the universe by sector",
      keywords: [sector, ...Object.keys(SEARCH_ALIASES).filter(alias => SEARCH_ALIASES[alias] === sector)].join(" ").toLowerCase(),
    });
  });

  [...new Set(symbolSource.map(stock => stock.theme))].forEach(theme => {
    items.push({
      id: `theme-${theme}`,
      type: "theme",
      value: theme,
      label: theme,
      description: "Filter the universe by theme",
      keywords: [theme, ...Object.keys(SEARCH_ALIASES).filter(alias => SEARCH_ALIASES[alias] === theme)].join(" ").toLowerCase(),
    });
  });

  if (!needle) {
    return items.slice(0, 12);
  }

  const aliasValue = SEARCH_ALIASES[needle] || LOCAL_SEARCH_ALIASES[needle];
  return items
    .filter(item => {
      if ((needle.includes("sector") || needle.includes("板块")) && item.type === "sector") {
        return true;
      }
      if ((needle.includes("theme") || needle.includes("主题")) && item.type === "theme") {
        return true;
      }
      if ((needle.includes("preset") || needle.includes("模板") || needle.includes("预设")) && item.type === "preset") {
        return true;
      }
      if ((needle.includes("screen") || needle.includes("页面") || needle.includes("界面")) && item.type === "screen") {
        return true;
      }
      if (item.keywords.includes(needle)) {
        return true;
      }
      if (!aliasValue) {
        return false;
      }
      return item.value === aliasValue || item.label.toLowerCase() === aliasValue.toLowerCase();
    })
    .slice(0, 12);
}

function applyPaletteAction(item) {
  state.paletteOpen = false;
  elements.topbarSearch.value = "";
  state.paletteQuery = "";

  if (item.type === "screen") {
    setCurrentScreen(item.value);
    return;
  }

  if (item.type === "preset") {
    setCurrentScreen("scanner");
    applyClassicPreset(item.value);
    return;
  }

  if (item.type === "symbol") {
    state.universeFilterTerm = item.value.toLowerCase();
    elements.universeSearch.value = item.value;
    focusSymbol(item.value, "universe");
    return;
  }

  if (item.type === "sector" || item.type === "theme") {
    if (item.type === "sector") {
      state.universeSectorFilter = item.value;
      elements.universeSectorFilter.value = item.value;
      state.universeFilterTerm = "";
      elements.universeSearch.value = "";
    } else {
      state.universeFilterTerm = item.value.toLowerCase();
      elements.universeSearch.value = item.value;
    }
    setCurrentScreen("universe");
    return;
  }

  if (item.type === "source") {
    state.universeSourceFilter = item.value;
    setCurrentScreen("universe");
  }
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

  scheduleWorkspacePersist();
  render();
}

function runAiQuery(query, options = {}) {
  const normalized = query.toLowerCase();
  const wantsLowRisk =
    /low risk|safer|controlled downside|avoid|stable|blue[- ]?chip|defensive/.test(normalized);
  const wantsOvernight = /overnight|carry|next day|hold|multi-day/.test(normalized);
  const wantsIntraday = /intraday|open|opening|session|day trade|daylong/.test(normalized);
  const wantsSwing = /swing|3 day|one week|trend continuation/.test(normalized);
  const wantsVolume = /volume|expanding volume|rel volume|participation/.test(normalized);
  const wantsTrapProtection = /trap|fade|avoid|not gap-and-fade|controlled downside/.test(normalized);

  let label = "Multi-session quality";
  let description = "15-minute structure scan tuned for overnight and multi-day continuation.";
  let scoreConfig = { momentum: 0.92, safety: 1.16, carry: 1.08, sessionBoost: "swing" };
  let filter = stock => stock.session !== "intraday" || stock.carry >= 74;
  let title = "Top overnight and swing setups";
  let intentChips = ["15-minute mode", "Overnight bias", "Quality first"];
  let classicFilters = getDefaultClassicFilters();
  const rationale = [
    "SignalDeck starts from a slower 15-minute horizon so the scanner can stay useful without pretending to be high-frequency tape.",
    "Risk posture is then adjusted to penalize unstable spikes and reward cleaner carry into the close and next session.",
    "Participation remains a core input so fragile moves on weak volume still lose rank quickly.",
  ];
  classicFilters.session = "overnight";
  classicFilters.sortBy = "score";
  classicFilters.maxRisk = 36;
  classicFilters.minRelativeVolume = 1.2;
  classicFilters.minQuality = 76;
  classicFilters.marketCap = "Mega cap";
  classicFilters.minPrice = 20;
  classicFilters.formulaRules = [
    { id: createRuleId(), field: "carry", operator: ">=", value: "74", negate: false },
    { id: createRuleId(), field: "quality", operator: ">=", value: "76", negate: false },
  ];

  if (wantsLowRisk) {
    label = "Safety-biased";
    description = "Prioritizing stable liquidity, cleaner continuation, and lower trap risk.";
    scoreConfig = { momentum: 0.82, safety: 1.35, carry: 0.9, sessionBoost: null };
    intentChips = ["Safer setups", "Liquidity-first", "Downside control"];
    classicFilters.maxRisk = 36;
    classicFilters.minQuality = 74;
    classicFilters.marketCap = "Mega cap";
  }

  if (wantsIntraday) {
    label = wantsLowRisk ? "Intraday quality" : "Intraday momentum";
    description = wantsLowRisk
      ? "Intraday scan tuned for continuation without extreme gap risk."
      : "Intraday scan favoring price expansion, participation, and clean trend quality.";
    scoreConfig = { momentum: 1.25, safety: wantsTrapProtection ? 1.2 : 0.9, carry: 0.45, sessionBoost: "intraday" };
    filter = stock => stock.session === "intraday" || stock.quality >= 82;
    title = "Intraday opportunities";
    classicFilters.session = "intraday";
    classicFilters.sortBy = "momentum";
    classicFilters.minMomentum = wantsLowRisk ? 72 : 76;
    classicFilters.maxRisk = wantsLowRisk ? 40 : 48;
    classicFilters.minRelativeVolume = wantsLowRisk ? 1.5 : 1.8;
    classicFilters.minQuality = wantsLowRisk ? 72 : 68;
    classicFilters.maxPrice = wantsLowRisk ? 160 : 90;
    classicFilters.formulaRules = [
      { id: createRuleId(), field: "drivePct", operator: ">=", value: wantsLowRisk ? "0.2" : "0.45", negate: false },
      { id: createRuleId(), field: "gap", operator: ">=", value: "0.5", negate: false },
    ];
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
    classicFilters.session = "overnight";
    classicFilters.sortBy = "score";
    classicFilters.maxRisk = 34;
    classicFilters.minRelativeVolume = 1.2;
    classicFilters.minQuality = 74;
    classicFilters.marketCap = "Mega cap";
    classicFilters.minPrice = 20;
    classicFilters.formulaRules = [
      { id: createRuleId(), field: "carry", operator: ">=", value: "74", negate: false },
      { id: createRuleId(), field: "vwapDrift", operator: ">=", value: "-0.3", negate: false },
    ];
  }

  if (wantsSwing) {
    label = "Swing continuation";
    description = "Biasing toward cleaner multi-session trends over explosive but fragile names.";
    scoreConfig = { momentum: 0.9, safety: 1.18, carry: 1.15, sessionBoost: "swing" };
    filter = stock => stock.session === "swing" || stock.carry >= 76;
    title = "Swing candidates";
    intentChips = ["Swing horizon", "Trend continuity", "Quality over noise"];
    classicFilters.session = "swing";
    classicFilters.sortBy = "quality";
    classicFilters.maxRisk = 38;
    classicFilters.minRelativeVolume = 1.2;
    classicFilters.minQuality = 76;
    classicFilters.marketCap = "Mega cap";
    classicFilters.minPrice = 20;
    classicFilters.formulaRules = [
      { id: createRuleId(), field: "carry", operator: ">=", value: "76", negate: false },
      { id: createRuleId(), field: "quality", operator: ">=", value: "78", negate: false },
    ];
  }

  if (wantsVolume) {
    scoreConfig.momentum += 0.08;
    description = `${description} Relative volume is weighted more heavily.`;
    intentChips = [...intentChips, "Volume confirmation"];
    rationale[2] = "Relative volume got an extra boost, so names without real participation should drop behind cleaner tape.";
    classicFilters.minRelativeVolume = Math.max(classicFilters.minRelativeVolume, 1.8);
    classicFilters.formulaRules = [
      ...classicFilters.formulaRules,
      { id: createRuleId(), field: "turnover", operator: ">=", value: "8000000", negate: false },
    ];
  }

  if (wantsTrapProtection) {
    scoreConfig.safety += 0.14;
    intentChips = [...intentChips, "Trap penalty"];
    rationale[1] = "Trap protection is active, so wide-opening spikes and poor hold behavior get penalized more aggressively.";
    classicFilters.maxRisk = Math.min(classicFilters.maxRisk, 42);
    classicFilters.formulaRules = [
      ...classicFilters.formulaRules,
      { id: createRuleId(), field: "closePosition", operator: ">=", value: "0.55", negate: false },
    ];
  }

  const window =
    title === "Intraday opportunities"
      ? "Open to midday"
      : title === "Overnight candidates"
        ? "Power hour to next open"
        : title === "Swing candidates"
          ? "3 to 5 sessions"
          : "15-minute delayed · 1 to 5 sessions";
  const holdBias =
    title === "Intraday opportunities"
      ? "Same-day follow-through"
      : title === "Overnight candidates"
        ? "1 to 2 sessions"
        : title === "Swing candidates"
          ? "3 to 5 sessions"
          : "Overnight to multi-day";
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

  state.aiRuntime = {
    source: "heuristic",
    provider: "Heuristic parser",
    model: "",
    note: options.fallbackReason
      ? `OpenAI parser was unavailable, so SignalDeck fell back to heuristic parsing. ${options.fallbackReason}`
      : state.apiConfig.aiParser?.hasServerKey
        ? "Local heuristic fallback is active for this scan."
        : "Heuristic parser active until a server-side OpenAI key is configured.",
  };
  setClassicFiltersFromAi(classicFilters);
  elements.aiSummary.textContent = `${label} profile active. ${description}`;
  render();
}

function applyStructuredAiProfile(profile, payload = {}) {
  const sessionBias = pickEnum(profile?.sessionBias, ["all", "intraday", "overnight", "swing"], "all");
  const sessionBoost = pickEnum(profile?.sessionBoost, ["none", "intraday", "overnight", "swing"], "none");
  const minQuality = clamp(Number(profile?.minQuality) || 66, 50, 92);
  const minRelativeVolume = clamp(Number(profile?.minRelativeVolume) || 1.25, 0.5, 4);
  const priceMin = clamp(Number(profile?.priceMin) || 0, 0, 1000);
  const rawPriceMax = Number(profile?.priceMax);
  const priceMax = Number.isFinite(rawPriceMax) ? clamp(rawPriceMax, priceMin + 1, 2000) : 9999;
  const scoreWeights = profile?.scoreWeights || {};
  const intentChips = cleanAiList(profile?.intentChips, 4, ["AI parsed", "Structured intent"]);
  const rationale = cleanAiList(profile?.rationale, 3, [
    "A real model parsed the prompt into horizon, risk posture, and participation requirements.",
    "SignalDeck then applies those instructions through its local ranking engine.",
    "This keeps the workflow explainable while still letting the AI steer the scan.",
  ]);

  state.profile = createProfile({
    label: cleanAiText(profile?.label, "AI scan"),
    description: cleanAiText(profile?.description, "Structured scan profile generated from your prompt."),
    title: cleanAiText(profile?.title, "AI-ranked setups"),
    filter: stock => {
      const matchesSession = sessionBias === "all" || stock.session === sessionBias;
      return (
        matchesSession &&
        stock.quality >= minQuality &&
        stock.relativeVolume >= minRelativeVolume &&
        stock.price >= priceMin &&
        stock.price <= priceMax
      );
    },
    scoreConfig: {
      momentum: clamp(Number(scoreWeights.momentum) || 1, 0.55, 1.65),
      safety: clamp(Number(scoreWeights.safety) || 1, 0.55, 1.65),
      carry: clamp(Number(scoreWeights.carry) || 0.75, 0.4, 1.5),
      sessionBoost: sessionBoost === "none" ? null : sessionBoost,
    },
    meta: {
      window: cleanAiText(profile?.window, sessionBias === "all" ? "Flexible" : "Open to midday"),
      holdBias: cleanAiText(profile?.holdBias, "Adaptive"),
      riskBias: cleanAiText(profile?.riskBias, "Balanced"),
      executionNote: cleanAiText(
        profile?.executionNote,
        "The AI parser set the posture, and SignalDeck is ranking names that best fit that posture.",
      ),
      monitorFocus: cleanAiText(
        profile?.monitorFocus,
        `Watch ${minQuality}+ quality, ${minRelativeVolume.toFixed(1)}x relative volume, and ${sessionBias === "all" ? "cross-session strength" : `${sessionBias} structure`}.`,
      ),
      intentChips,
      rationale,
    },
  });

  state.aiRuntime = {
    source: "openai",
    provider: payload.provider || state.apiConfig.aiParser?.provider || "OpenAI Responses",
    model: payload.model || state.apiConfig.aiParser?.model || "",
    note: `${payload.provider || "OpenAI Responses"} structured parsing drove this profile${payload.model ? ` using ${payload.model}` : ""}. SignalDeck still applies its own transparent ranking engine on top.`,
  };
  setClassicFiltersFromAi({
    session: sessionBias,
    minMomentum: sessionBias === "intraday" ? 74 : sessionBias === "swing" ? 66 : 62,
    maxRisk:
      cleanAiText(profile?.riskBias, "Balanced").toLowerCase() === "conservative"
        ? 34
        : cleanAiText(profile?.riskBias, "Balanced").toLowerCase() === "aggressive"
          ? 54
          : 44,
    minRelativeVolume,
    sector: "all",
    marketCap: "all",
    minQuality,
    sortBy: sessionBias === "intraday" ? "momentum" : sessionBias === "swing" ? "quality" : "score",
    minPrice: priceMin,
    maxPrice,
    theme: "all",
    groupMode: "AND",
    formulaRules: [
      ...(sessionBias === "intraday"
        ? [{ id: createRuleId(), field: "drivePct", operator: ">=", value: "0.25", negate: false }]
        : sessionBias === "overnight" || sessionBias === "swing"
          ? [{ id: createRuleId(), field: "carry", operator: ">=", value: "72", negate: false }]
          : []),
      ...(minRelativeVolume >= 1.6
        ? [{ id: createRuleId(), field: "turnover", operator: ">=", value: "8000000", negate: false }]
        : []),
    ],
  });
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
    const symbols = [...new Set([...LIVE_BATCH_SYMBOLS, ...CONTEXT_BATCH_SYMBOLS])].join(",");
    const payload = await fetchJson(`/api/market/quotes?symbols=${encodeURIComponent(symbols)}`);
    state.quoteMap = normalizeQuotes(payload.data);
    state.lastUpdatedAt = payload.fetchedAt || new Date().toISOString();
    state.marketTransport = payload.stale ? "stale" : payload.shared ? "shared" : payload.cached ? "cached" : "fresh";
    state.loadError = "";

    if (state.selectedSymbol && !state.quoteMap[state.selectedSymbol]) {
      await loadQuote(state.selectedSymbol, { quiet: true });
    }

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

async function loadQuote(symbol, options = {}) {
  if (!symbol || state.quoteMap[symbol]?.status !== "error" && state.quoteMap[symbol]) {
    return;
  }

  if (!state.apiConfig.hasServerKey && !state.apiKey) {
    return;
  }

  if (!options.quiet) {
    state.loadError = "";
    renderConnectionState();
  }

  try {
    const payload = await fetchJson(`/api/market/quotes?symbols=${encodeURIComponent(symbol)}`);
    state.quoteMap = {
      ...state.quoteMap,
      ...normalizeQuotes(payload.data),
    };
    state.lastUpdatedAt = payload.fetchedAt || state.lastUpdatedAt || new Date().toISOString();
    state.marketTransport = payload.stale ? "stale" : payload.shared ? "shared" : payload.cached ? "cached" : "fresh";
    state.loadError = "";
  } catch (error) {
    state.marketTransport = "error";
    state.loadError = error.message;
  } finally {
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

function getMarketContextUniverse() {
  return MARKET_CONTEXT_UNIVERSE
    .map(meta => buildMarketContext(meta, state.quoteMap[meta.symbol]))
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

function buildMarketContext(meta, quote) {
  if (!quote || quote.status === "error") {
    return null;
  }

  const price = numberOrNull(quote.close) ?? numberOrNull(quote.price);
  const previousClose = numberOrNull(quote.previous_close);
  const open = numberOrNull(quote.open);
  const high = numberOrNull(quote.high);
  const low = numberOrNull(quote.low);
  const changePct =
    numberOrNull(quote.percent_change) ??
    (price && previousClose ? ((price - previousClose) / previousClose) * 100 : 0);
  const rangePct =
    open && high && low ? ((high - low) / Math.max(open, 0.01)) * 100 : Math.abs(changePct) * 1.2;

  return {
    ...meta,
    price: price ?? null,
    changePct: round(changePct || 0, 2),
    rangePct: round(rangePct || 0, 2),
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
    return `${meta.symbol} has a wider session range, so the setup needs cleaner confirmation before sizing up.`;
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
      if (!state.boardFilterTerm) {
        return true;
      }

      const haystack = `${stock.symbol} ${stock.name} ${stock.theme} ${stock.sector}`.toLowerCase();
      return haystack.includes(state.boardFilterTerm);
    })
    .sort(compareRankedStocks);
}

function getUniverseResults() {
  const liveUniverse = getLiveUniverse();
  return trackedUniverse
    .map(meta => {
      const live = liveUniverse.find(stock => stock.symbol === meta.symbol);
      return live
        ? { ...live, score: state.profile.score(live) }
        : {
            ...meta,
            price: null,
            changePct: null,
            relativeVolume: null,
            score: null,
          };
    })
    .filter(stock => matchesSourceTag(stock, state.universeSourceFilter))
    .filter(stock => state.universeSectorFilter === "all" || stock.sector === state.universeSectorFilter)
    .filter(stock => {
      if (!state.universeFilterTerm) {
        return true;
      }

      const haystack = `${stock.symbol} ${stock.name} ${stock.theme} ${stock.sector} ${stock.session} ${(stock.sourceTags || []).join(" ")}`.toLowerCase();
      return haystack.includes(state.universeFilterTerm);
    })
    .sort((left, right) => left.symbol.localeCompare(right.symbol));
}

function getMarketContextSummary(items) {
  const broad = items.filter(item => item.kind === "broad");
  const sectors = items.filter(item => item.kind === "sector");
  const vol = items.find(item => item.kind === "volatility");
  const spy = broad.find(item => item.symbol === "SPY");
  const qqq = broad.find(item => item.symbol === "QQQ");
  const leader = [...sectors].sort((left, right) => (right.changePct ?? -999) - (left.changePct ?? -999))[0];

  let tone = "Mixed";
  let toneClass = "neutral";
  if ((spy?.changePct ?? 0) >= 0.35 && (qqq?.changePct ?? 0) >= 0.45 && (vol?.changePct ?? 0) <= 0) {
    tone = "Risk-on";
    toneClass = "positive";
  } else if ((spy?.changePct ?? 0) <= -0.35 && (qqq?.changePct ?? 0) <= -0.45 && (vol?.changePct ?? 0) >= 0) {
    tone = "Risk-off";
    toneClass = "negative";
  }

  const note = leader
    ? `${leader.label} leads at ${formatSigned(leader.changePct)}%, ${vol ? `${vol.symbol} ${vol.changePct >= 0 ? "firm" : "soft"}` : "volatility proxy waiting"}.`
    : "Context feed is still building.";

  return {
    tone,
    toneClass,
    note,
    count: items.length,
  };
}

async function focusSymbol(symbol, nextScreen = null) {
  if (!symbol) {
    return;
  }

  state.selectedSymbol = symbol;

  if (nextScreen) {
    state.currentScreen = nextScreen;
  }

  if (!state.quoteMap[symbol]) {
    await loadQuote(symbol, { quiet: true });
  }

  if (!state.historyMap[symbol]) {
    await loadHistory(symbol);
    return;
  }

  render();
}

function getWatchlistResults() {
  const universe = getUniverseResults();
  return state.watchlist
    .map(symbol => universe.find(stock => stock.symbol === symbol))
    .filter(Boolean);
}

function render() {
  const ranked = getRankedUniverse();
  const universe = getUniverseResults();
  const watchlistResults = getWatchlistResults();
  const selectable =
    state.currentScreen === "universe"
      ? universe
      : state.currentScreen === "watchlist"
        ? watchlistResults
        : ranked;

  if (selectable.length && !selectable.some(stock => stock.symbol === state.selectedSymbol)) {
    state.selectedSymbol = selectable[0].symbol;
  }

  renderAuthState();
  renderScreenState();
  renderPalette();
  renderFormulaPanelState();
  renderFormulaRules();
  renderCustomMetricState();
  renderFieldLibrary();
  renderSurfaceState();
  renderPulseStrip(ranked);
  renderMarketContext();
  renderScanDigest(ranked);
  renderFilterChips();
  renderWatchlist();
  renderUniverseScreen(universe);
  renderWatchlistScreen(watchlistResults);
  renderBrief(ranked);
  renderOpportunityList(ranked);
  renderSpotlight(ranked);
  renderInspector(state.currentScreen === "universe" ? universe : ranked);
  renderExecutionMap(state.currentScreen === "universe" ? universe : ranked);
  renderConnectionState();
  elements.resultsSurface.dataset.view = state.resultsView;
  elements.symbolSearch.value = state.boardFilterTerm;
  elements.universeSearch.value = state.universeFilterTerm;
  elements.universeSectorFilter.value = state.universeSectorFilter;
  elements.universeSourceFilters.forEach(button => {
    button.classList.toggle("active", button.dataset.universeSource === state.universeSourceFilter);
  });
  elements.viewTable.classList.toggle("active", state.resultsView === "table");
  elements.viewCards.classList.toggle("active", state.resultsView === "cards");
  elements.lastUpdated.textContent = state.lastUpdatedAt
    ? `Updated ${new Date(state.lastUpdatedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })}`
    : "Waiting for first data pull";
  elements.settingsLastUpdated.textContent = elements.lastUpdated.textContent;
  elements.settingsAiStatus.textContent = `${state.aiRuntime.provider}${state.aiRuntime.model ? ` / ${state.aiRuntime.model}` : ""}`;
}

function renderAuthState() {
  elements.authTabs.forEach(button => {
    button.classList.toggle("active", button.dataset.authMode === state.authMode);
  });

  elements.authModal.hidden = !state.authModalOpen;
  elements.accountDrawer.hidden = !state.accountMenuOpen || !state.currentUser;
  elements.accountTrigger.setAttribute("aria-expanded", String(state.accountMenuOpen));
  elements.accountAvatar.textContent = getAccountInitials(state.currentUser);
  elements.accountDrawerAvatar.textContent = getAccountInitials(state.currentUser);

  if (state.currentUser) {
    elements.accountBadge.textContent = getAccountLabel(state.currentUser);
    elements.topbarAccount.textContent = getAccountLabel(state.currentUser);
    elements.settingsAccountLabel.textContent = getAccountLabel(state.currentUser);
    elements.accountCopy.textContent = state.currentUser.email_confirmed_at
      ? "Signed in. Watchlists and saved state now follow your profile."
      : "Account created. Confirm your email to fully activate cross-device access.";
    elements.settingsAccountCopy.textContent = state.currentUser.email_confirmed_at
      ? "Signed in. Watchlists and saved state now follow your profile."
      : "Account created. Confirm your email to fully activate cross-device access.";
    elements.watchlistNote.textContent =
      "Signed-in mode syncs this watchlist to your account, so it follows you after login.";
    elements.topbarSignIn.hidden = true;
    elements.topbarRegister.hidden = true;
    elements.settingsSignIn.hidden = true;
    elements.settingsRegister.hidden = true;
    elements.settingsSignOut.hidden = false;
    elements.authLogout.hidden = false;
    elements.authEmail.disabled = true;
    elements.authPassword.disabled = true;
    elements.authTabs.forEach(button => {
      button.disabled = true;
    });
    elements.authMessage.textContent = state.currentUser.email_confirmed_at
      ? "Account active. Watchlist and saved state now follow your profile."
      : state.authMessage;
  } else {
    elements.accountBadge.textContent = "Guest mode";
    elements.topbarAccount.textContent = "Guest mode";
    elements.settingsAccountLabel.textContent = "Guest mode";
    elements.accountCopy.textContent =
      "Create an account to keep watchlists and saved state tied to your profile.";
    elements.settingsAccountCopy.textContent =
      "Create an account to sync your watchlist and saved screen state across sessions.";
    elements.watchlistNote.textContent =
      "Guest mode keeps this list in this browser. Sign in to sync it to your account.";
    elements.topbarSignIn.hidden = false;
    elements.topbarRegister.hidden = false;
    elements.settingsSignIn.hidden = false;
    elements.settingsRegister.hidden = false;
    elements.settingsSignOut.hidden = true;
    elements.authLogout.hidden = true;
    elements.authEmail.disabled = false;
    elements.authPassword.disabled = false;
    elements.authTabs.forEach(button => {
      button.disabled = false;
    });
    elements.authSubmit.textContent = state.authMode === "register" ? "Create account" : "Sign in";
    elements.authMessage.textContent = state.authMessage;
  }

  elements.authToggle.hidden = false;
  elements.authEmailWrap.hidden = false;
  elements.authPasswordWrap.hidden = false;
  elements.authSubmit.hidden = false;
  elements.authGoogle.hidden = false;
}

function renderScreenState() {
  elements.navLinks.forEach(button => {
    button.classList.toggle("active", button.dataset.navScreen === state.currentScreen);
  });
  elements.screens.forEach(screen => {
    const active = screen.dataset.screen === state.currentScreen;
    screen.hidden = !active;
    screen.classList.toggle("active", active);
  });

  const inspectorEnabled = state.currentScreen === "scanner" || state.currentScreen === "universe";
  elements.inspectorColumn.hidden = !inspectorEnabled;
  elements.terminalGrid.classList.toggle("no-inspector", !inspectorEnabled);
}

function renderPalette() {
  const query = normalizeSearchText(state.paletteQuery);
  elements.palettePopover.hidden = !state.paletteOpen;
  if (!state.paletteOpen) {
    return;
  }

  const items = getCommandPaletteItems(query);
  elements.paletteMeta.textContent = query
    ? `${items.length} match${items.length === 1 ? "" : "es"} for "${query}"`
    : "Type to search symbols, sectors, themes, presets, and screens.";

  elements.paletteResults.innerHTML = items.length
    ? items
        .map(
          item => `
            <button class="palette-result" type="button" data-palette-id="${item.id}">
              <div>
                <span class="palette-type">${item.type}</span>
                <strong>${item.label}</strong>
              </div>
              <span>${item.description}</span>
            </button>
          `,
        )
        .join("")
    : `<div class="palette-empty"><p class="muted">No matches yet.</p><p class="muted small-note">Try a symbol, theme, preset, or screen name.</p></div>`;

  [...elements.paletteResults.querySelectorAll("[data-palette-id]")].forEach(button => {
    button.addEventListener("click", () => {
      const item = items.find(entry => entry.id === button.dataset.paletteId);
      if (item) {
        applyPaletteAction(item);
      }
    });
  });
}

function renderSurfaceState() {
  elements.runAi.disabled = state.aiWorking;
  elements.runAi.textContent = state.aiWorking ? "Parsing intent..." : "Run AI scan";
  elements.aiSummary.textContent = state.aiWorking
    ? "Breaking your prompt into horizon, risk posture, and participation signals."
    : `${state.profile.label} profile active. ${state.profile.description}`;
  elements.aiProviderNote.textContent = state.aiWorking
    ? "Trying the server-side OpenAI parser when available, then falling back safely if needed."
    : state.aiRuntime.note;
}

function renderFormulaRulesLegacy() {
  const rules = sanitizeFormulaRules(state.classicFilters.formulaRules);
  state.classicFilters.formulaRules = rules;

  const mode = String(state.classicFilters.groupMode || "AND").toUpperCase();
  elements.formulaSummary.textContent = rules.length
    ? `${rules.length} rule${rules.length === 1 ? "" : "s"} active. Group logic is ${mode}, and each rule can be inverted with NOT.`
    : "No formula rules yet. Add a rule, choose AND/OR/NAND/NOR, and invert any block with NOT.";

  if (!rules.length) {
    elements.formulaRuleList.innerHTML = `
      <div class="formula-empty">
        <p class="muted">No custom rules yet.</p>
        <p class="muted small-note">Add a rule to stack supported fields like gap, turnover, VWAP proxy, or range.</p>
      </div>
    `;
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
            x
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
    button.textContent = "x";
    button.addEventListener("click", () => {
      state.classicFilters.formulaRules = state.classicFilters.formulaRules.filter(
        rule => rule.id !== button.dataset.removeRule,
      );
      applyClassicFilters();
    });
  });
  [...elements.formulaRuleList.querySelectorAll("[data-remove-rule]")].forEach(button => {
    button.textContent = "x";
  });
}

function renderFormulaPanelState() {
  elements.formulaTabs.forEach(button => {
    button.classList.toggle("active", button.dataset.formulaPanel === state.formulaPanelMode);
  });
  elements.formulaPanels.forEach(panel => {
    panel.classList.toggle("active", panel.dataset.formulaView === state.formulaPanelMode);
  });
}

function renderFieldLibrary() {
  elements.fieldLibraryModal.hidden = !state.fieldLibraryOpen;
  if (!state.fieldLibraryOpen) {
    return;
  }

  elements.fieldLibrarySearch.value = state.fieldLibrarySearch;
  elements.fieldLibraryNotice.textContent =
    state.fieldLibraryNotice ||
    "Live and derived fields can be added now. Locked fields stay visible so the directory remains honest.";

  const groups = getFieldCatalogGroups(state.fieldLibrarySearch);
  elements.fieldLibraryGroups.innerHTML = groups.length
    ? groups
        .map(
          group => `
            <section class="field-group">
              <div class="field-group-head">
                <p class="section-label">${group.category}</p>
                <span class="mono">${group.fields.length} fields</span>
              </div>
              <div class="field-list">
                ${group.fields
                  .map(
                    field => `
                      <button class="field-row ${field.availability}" type="button" data-field-key="${field.key}" ${field.availability === "locked" ? 'data-field-locked="true"' : ""}>
                        <div class="field-copy">
                          <div class="field-title-row">
                            <strong>${field.label}</strong>
                            <span class="availability-badge ${field.availability}">${getFieldAvailabilityLabel(field.availability)}</span>
                          </div>
                          <p>${field.description || field.lockedReason || ""}</p>
                          <span>${field.subcategory || ""}${field.source ? ` - ${field.source}` : ""}</span>
                        </div>
                      </button>
                    `,
                  )
                  .join("")}
              </div>
            </section>
          `,
        )
        .join("")
    : `<div class="formula-empty"><p class="muted">No fields matched your search.</p><p class="muted small-note">Try searching by field name, category, or concept.</p></div>`;

  [...elements.fieldLibraryGroups.querySelectorAll("[data-field-key]")].forEach(button => {
    button.addEventListener("click", () => {
      const field = getCatalogFieldMeta(button.dataset.fieldKey);
      if (!field) {
        return;
      }
      if (field.availability === "locked") {
        state.fieldLibraryNotice = field.lockedReason || "This field is visible but not yet executable.";
        renderFieldLibrary();
        return;
      }

      state.classicFilters.formulaRules.push({
        ...createFormulaRule(),
        field: field.key,
        operator: field.type === "text" ? "is" : ">=",
        value: field.type === "text" ? "" : "0",
      });
      state.formulaPanelMode = "rules";
      state.fieldLibraryOpen = false;
      state.fieldLibraryNotice = "";
      applyClassicFilters();
    });
  });
}

function renderCustomMetricState() {
  elements.customMetricName.value = state.customMetricDraft.name;
  elements.customMetricExpression.value = state.customMetricDraft.expression;
  elements.customMetricFeedback.textContent =
    state.customMetricDraft.error ||
    state.customMetricDraft.feedback ||
    "Expressions support numbers, field names, parentheses, + - * /, and abs(), min(), max().";
  elements.customMetricFeedback.classList.toggle("negative", Boolean(state.customMetricDraft.error));
  elements.customMetricDeps.innerHTML = state.customMetricDraft.dependencies.length
    ? state.customMetricDraft.dependencies.map(dep => `<span class="intent-chip">${getMetricDependencyLabel(dep)}</span>`).join("")
    : `<span class="muted small-note">No field dependencies detected yet.</span>`;

  elements.customMetricList.innerHTML = state.customMetrics.length
    ? state.customMetrics
        .map(
          metric => `
            <article class="metric-item" data-metric-id="${metric.id}">
              <div>
                <strong>${metric.name}</strong>
                <p>${metric.expression}</p>
                <span>${metric.feedback || "Synthetic metric ready."}</span>
              </div>
              <div class="metric-item-actions">
                <button class="ghost-button compact-button" type="button" data-metric-rule="${metric.id}">Use in rule</button>
                <button class="ghost-button compact-button" type="button" data-metric-remove="${metric.id}">Delete</button>
              </div>
            </article>
          `,
        )
        .join("")
    : `<div class="formula-empty"><p class="muted">No custom metrics yet.</p><p class="muted small-note">Build your own field from the live or derived data that already exists in SignalDeck.</p></div>`;

  [...elements.customMetricList.querySelectorAll("[data-metric-rule]")].forEach(button => {
    button.addEventListener("click", () => {
      state.classicFilters.formulaRules.push({
        ...createFormulaRule(),
        field: button.dataset.metricRule,
        operator: ">=",
        value: "0",
      });
      state.formulaPanelMode = "rules";
      applyClassicFilters();
    });
  });

  [...elements.customMetricList.querySelectorAll("[data-metric-remove]")].forEach(button => {
    button.addEventListener("click", () => {
      state.customMetrics = state.customMetrics.filter(metric => metric.id !== button.dataset.metricRemove);
      state.classicFilters.formulaRules = state.classicFilters.formulaRules.filter(
        rule => rule.field !== button.dataset.metricRemove,
      );
      scheduleWorkspacePersist();
      applyClassicFilters();
    });
  });
}

function renderFormulaRules() {
  const rules = sanitizeFormulaRules(state.classicFilters.formulaRules);
  state.classicFilters.formulaRules = rules;

  const mode = String(state.classicFilters.groupMode || "AND").toUpperCase();
  const syntheticRuleCount = rules.filter(rule => getFormulaFieldMeta(rule.field)?.category === "Custom Metrics").length;
  elements.formulaSummary.textContent = rules.length
    ? `${rules.length} rule${rules.length === 1 ? "" : "s"} active. Group logic is ${mode}, with ${syntheticRuleCount} synthetic metric rule${syntheticRuleCount === 1 ? "" : "s"} and full range support.`
    : "No formula rules yet. Add a rule, choose AND/OR/NAND/NOR, and use ranges or synthetic fields when one raw field is not enough.";

  if (!rules.length) {
    elements.formulaRuleList.innerHTML = `
      <div class="formula-empty">
        <p class="muted">No custom rules yet.</p>
        <p class="muted small-note">Add a rule to stack supported fields like dollar volume estimate, VWAP drift, range, or other derived fields.</p>
      </div>
    `;
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
              ${getRuleFieldSelectOptions(rule.field)}
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
            <div class="rule-value-stack ${isRangeOperator(rule.operator) ? "range" : ""}">
              <input data-rule-prop="value" type="${getFormulaFieldMeta(rule.field)?.type === "text" ? "text" : "number"}" step="any" value="${rule.value}" placeholder="${isRangeOperator(rule.operator) ? "Min" : "Value"}" />
              ${
                isRangeOperator(rule.operator)
                  ? `<input data-rule-prop="valueSecondary" type="number" step="any" value="${rule.valueSecondary}" placeholder="Max" />`
                  : ""
              }
            </div>
          </label>
          <button class="formula-remove" data-remove-rule="${rule.id}" type="button" aria-label="Remove rule">x</button>
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
    button.addEventListener("click", () => {
      state.classicFilters.formulaRules = state.classicFilters.formulaRules.filter(
        rule => rule.id !== button.dataset.removeRule,
      );
      applyClassicFilters();
    });
  });
}

function renderConnectionState() {
  const managedByServer = state.apiConfig.hasServerKey;
  elements.apiKeyInput.disabled = managedByServer;
  elements.saveApiKey.disabled = managedByServer;

  if (state.isRefreshing) {
    elements.feedStatus.textContent = "Refreshing market quotes";
    elements.connectionState.textContent = "Refreshing the shared market snapshot.";
  } else if (state.isLoadingHistory) {
    elements.feedStatus.textContent = "Loading chart history";
    elements.connectionState.textContent = "Loading history for the selected symbol.";
  } else if (state.loadError) {
    elements.feedStatus.textContent = "Market data unavailable";
    elements.connectionState.textContent = getCompactConnectionCopy(state.loadError);
  } else if (Object.keys(state.quoteMap).length) {
    if (state.marketTransport === "shared" || state.marketTransport === "cached") {
      elements.feedStatus.textContent = "15-minute delayed market feed connected";
      elements.connectionState.textContent =
        "Shared delayed market snapshot is active for this public build.";
    } else if (state.marketTransport === "stale") {
      elements.feedStatus.textContent = "Cached delayed market snapshot";
      elements.connectionState.textContent =
        "Serving the latest safe cached snapshot while the upstream feed is constrained.";
    } else {
      elements.feedStatus.textContent = "15-minute delayed market data connected";
      elements.connectionState.textContent = state.apiConfig.hasServerKey
        ? "Server-side delayed market data is active for this deployment."
        : "Browser-stored API key detected for local testing.";
    }
  } else {
    elements.feedStatus.textContent = "Waiting for market data connection";
    elements.connectionState.textContent =
      "Connect a market-data key in Settings or wait for the shared feed to recover.";
  }

  elements.dataSourceNote.textContent =
    managedByServer
      ? "Server-managed delayed market data is active. Public visitors do not need to supply their own key, and server-side caching reduces duplicate upstream calls."
      : "Free-tier mode uses delayed 15-minute data, a curated live batch, and slower refresh cycles to stay within API-credit limits.";

  elements.settingsFeedStatus.textContent = elements.feedStatus.textContent;
  elements.settingsLastUpdated.textContent = elements.lastUpdated.textContent;
  elements.settingsAiStatus.textContent = `${state.aiRuntime.provider}${state.aiRuntime.model ? ` / ${state.aiRuntime.model}` : ""}`;
  elements.settingsRuntimeNote.textContent = state.loadError
    ? state.loadError
    : managedByServer
      ? "This deployment is using server-side delayed market data with shared caching to reduce duplicate requests."
      : "Free-tier mode is using delayed 15-minute data, shared caching, and slower refresh intervals.";
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
    { label: "Scanner profile", value: state.profile.label, note: "15-minute delayed ranking logic is active" },
    { label: "Live core pool", value: String(liveUniverse.length || "--"), note: `${positiveBreadth} names green on session` },
    { label: "Exact matches", value: String(ranked.length), note: ranked.length ? `${ranked[0].symbol} leads the current scan` : "No exact fit yet, widen the screen" },
    { label: "Best carry", value: topLive ? topLive.symbol : "--", note: topLive ? `${bestRelativeVolume} peak participation, risk avg ${averageRisk}` : "Waiting for live quotes" },
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

function renderMarketContext() {
  const context = getMarketContextUniverse();
  const summary = getMarketContextSummary(context);

  if (!context.length) {
    elements.marketContextMeta.textContent = "Waiting for context feed";
    elements.universeContextMeta.textContent = "Waiting for context feed";
    elements.marketContextGrid.innerHTML = `<p class="muted context-empty">Market context will appear once the 15-minute quote batch returns broad-market and sector proxies.</p>`;
    elements.universeContextGrid.innerHTML = `<p class="muted context-empty">Broad-market, sector, and volatility proxies will appear here once the feed returns context quotes.</p>`;
    return;
  }

  const leadSector = [...context]
    .filter(item => item.kind === "sector")
    .sort((left, right) => (right.changePct ?? -999) - (left.changePct ?? -999))[0];
  const scannerSymbols = ["SPY", "QQQ", leadSector?.symbol, "VXX"].filter(Boolean);
  const scannerCards = scannerSymbols
    .map(symbol => context.find(item => item.symbol === symbol))
    .filter(Boolean);

  const buildTile = item => `
    <article class="context-tile">
      <div class="context-tile-header">
        <span class="context-tile-label">${item.label}</span>
        <span class="context-tile-symbol">${item.symbol}</span>
      </div>
      <div class="context-tile-foot">
        <strong class="${item.changePct >= 0 ? "positive" : "negative"}">${formatSigned(item.changePct)}%</strong>
        <span class="context-tone ${item.changePct >= 0.4 ? "positive" : item.changePct <= -0.4 ? "negative" : "neutral"}">${item.changePct >= 0.4 ? "Leading" : item.changePct <= -0.4 ? "Weak" : "Mixed"}</span>
      </div>
      <p>${item.note}</p>
    </article>
  `;

  elements.marketContextMeta.textContent = `${summary.tone} · ${summary.note}`;
  elements.universeContextMeta.textContent = `${summary.count} context symbols · ${summary.tone}`;
  elements.marketContextGrid.innerHTML = scannerCards.map(buildTile).join("");
  elements.universeContextGrid.innerHTML = context.map(buildTile).join("");
}

function renderWatchlist() {
  elements.watchlistCount.textContent = `${state.watchlist.length} saved`;
  if (!state.watchlist.length) {
    elements.watchlistList.innerHTML =
      `<p class="muted">Save symbols from the opportunity board to build a quick watchlist.</p>`;
    return;
  }

  const universe = getUniverseResults();
  const savedStocks = state.watchlist
    .map(symbol => universe.find(stock => stock.symbol === symbol))
    .filter(Boolean)
    .slice(0, 4);

  if (!savedStocks.length) {
    elements.watchlistList.innerHTML =
      `<p class="muted">Saved symbols are ready, but the current feed has not returned matching rows yet.</p>`;
    return;
  }

  elements.watchlistList.innerHTML = savedStocks
    .map(
      stock => `
        <button class="watchlist-item" data-watch-symbol="${stock.symbol}">
          <div>
            <strong>${stock.symbol}</strong>
            <span>${stock.theme}</span>
          </div>
          <span class="${stock.changePct == null ? "" : stock.changePct >= 0 ? "positive" : "negative"}">${formatPercentCell(stock.changePct)}</span>
        </button>
      `,
    )
    .join("");

  [...elements.watchlistList.querySelectorAll("[data-watch-symbol]")].forEach(button => {
    button.addEventListener("click", async () => {
      await focusSymbol(button.dataset.watchSymbol, "watchlist");
    });
  });
}

function renderUniverseScreen(universe) {
  const sourceLabel = getSourceTagLabel(state.universeSourceFilter);
  const sectorLabel = state.universeSectorFilter === "all" ? "All sectors" : state.universeSectorFilter;
  elements.universeMeta.textContent = `${universe.length} name${universe.length === 1 ? "" : "s"} · ${sourceLabel} · ${sectorLabel}`;

  if (!universe.length) {
    elements.universeList.innerHTML = `
      <div class="opportunity-empty compact-empty">
        <div class="ticker-meta">
          <strong>No universe matches</strong>
          <span>Clear the universe filter or wait for the next quote refresh.</span>
        </div>
      </div>
    `;
    return;
  }

  elements.universeList.innerHTML = universe
    .map(
      stock => `
        <button class="universe-row ${stock.symbol === state.selectedSymbol ? "active" : ""}" data-universe-symbol="${stock.symbol}" type="button">
          <span class="symbol-cell"><strong>${stock.symbol}</strong></span>
          <span>${stock.name}</span>
          <span>${stock.sector}</span>
          <span>${stock.theme}<small class="row-tag">${(stock.sourceTags || []).map(getSourceTagLabel).join(" · ")}</small></span>
          <span>${formatPriceCell(stock.price)}</span>
          <span class="${stock.changePct == null ? "" : stock.changePct >= 0 ? "positive" : "negative"}">${formatPercentCell(stock.changePct)}</span>
          <span>${formatRelativeVolumeCell(stock.relativeVolume)}</span>
          <span>${formatScoreCell(stock.score)}</span>
        </button>
      `,
    )
    .join("");

  [...elements.universeList.querySelectorAll("[data-universe-symbol]")].forEach(button => {
    button.addEventListener("click", async () => {
      await focusSymbol(button.dataset.universeSymbol, "universe");
    });
  });
}

function renderWatchlistScreen(watchlistResults) {
  elements.watchlistScreenMeta.textContent = `${watchlistResults.length} saved`;
  if (!watchlistResults.length) {
    elements.watchlistScreenList.innerHTML = `
      <div class="opportunity-empty compact-empty">
        <div class="ticker-meta">
          <strong>${state.watchlist.length ? "Saved symbols are waiting on live quotes" : "No saved symbols yet"}</strong>
          <span>${
            state.watchlist.length
              ? "Watchlist symbols are stored, but the current feed has not loaded matching live quotes yet."
              : "Save a symbol from the scanner or universe to turn this into a working watchlist."
          }</span>
        </div>
      </div>
    `;
    return;
  }

  elements.watchlistScreenList.innerHTML = watchlistResults
    .map(
      stock => `
        <button class="universe-row ${stock.symbol === state.selectedSymbol ? "active" : ""}" data-watchlist-symbol="${stock.symbol}" type="button">
          <span class="symbol-cell"><strong>${stock.symbol}</strong></span>
          <span>${stock.theme}</span>
          <span>${toTitleCase(stock.session)}</span>
          <span>${formatPriceCell(stock.price)}</span>
          <span class="${stock.changePct == null ? "" : stock.changePct >= 0 ? "positive" : "negative"}">${formatPercentCell(stock.changePct)}</span>
          <span>${formatRelativeVolumeCell(stock.relativeVolume)}</span>
          <span>${formatScoreCell(stock.score)}</span>
        </button>
      `,
    )
    .join("");

  [...elements.watchlistScreenList.querySelectorAll("[data-watchlist-symbol]")].forEach(button => {
    button.addEventListener("click", async () => {
      await focusSymbol(button.dataset.watchlistSymbol, "watchlist");
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

async function syncWorkspaceStateFromAccount() {
  if (!state.currentUser) {
    return;
  }

  const workspaceState = state.currentUser.user_metadata?.screenState;
  if (!workspaceState) {
    const localState = loadWorkspaceState();
    state.classicFilters = hydrateClassicFilters(localState.classicFilters);
    state.customMetrics = hydrateCustomMetrics(localState.customMetrics);
    return;
  }

  state.classicFilters = hydrateClassicFilters(workspaceState.classicFilters);
  state.customMetrics = hydrateCustomMetrics(workspaceState.customMetrics);
  saveWorkspaceState(getWorkspaceSnapshot());
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

function renderFilterChips() {
  const defaults = getDefaultClassicFilters();
  const chips = [
    { key: "profile", label: `Profile: ${state.profile.label}`, removable: false },
    { key: "session", label: state.classicFilters.session === "all" ? "Any session" : toTitleCase(state.classicFilters.session), removable: state.classicFilters.session !== defaults.session },
    { key: "minMomentum", label: `Momentum >= ${state.classicFilters.minMomentum}`, removable: state.classicFilters.minMomentum !== defaults.minMomentum },
    { key: "maxRisk", label: `Risk <= ${state.classicFilters.maxRisk}`, removable: state.classicFilters.maxRisk !== defaults.maxRisk },
    { key: "minRelativeVolume", label: `Rel vol >= ${state.classicFilters.minRelativeVolume.toFixed(1)}x`, removable: state.classicFilters.minRelativeVolume !== defaults.minRelativeVolume },
    { key: "minQuality", label: `Quality >= ${state.classicFilters.minQuality}`, removable: state.classicFilters.minQuality !== defaults.minQuality },
  ];

  if (state.classicFilters.minPrice !== defaults.minPrice || state.classicFilters.maxPrice !== defaults.maxPrice) {
    chips.push({
      key: "priceRange",
      label: `Price ${state.classicFilters.minPrice}-${state.classicFilters.maxPrice}`,
      removable: true,
    });
  }
  if (state.classicFilters.sector !== "all") {
    chips.push({ key: "sector", label: state.classicFilters.sector, removable: true });
  }
  if (state.classicFilters.marketCap !== "all") {
    chips.push({ key: "marketCap", label: state.classicFilters.marketCap, removable: true });
  }
  if (state.classicFilters.theme !== "all") {
    chips.push({ key: "theme", label: state.classicFilters.theme, removable: true });
  }
  if (state.customMetrics.length) {
    state.customMetrics.forEach(metric => {
      chips.push({
        key: `metric:${metric.id}`,
        label: `Metric: ${metric.name}`,
        removable: true,
      });
    });
  }
  if (state.classicFilters.formulaRules.length) {
    state.classicFilters.formulaRules.forEach(rule => {
      const field = getFormulaFieldMeta(rule.field);
      const valueLabel = isRangeOperator(rule.operator)
        ? `${rule.value} to ${rule.valueSecondary}`
        : rule.value;
      chips.push({
        key: `rule:${rule.id}`,
        label: `${rule.negate ? "NOT " : ""}${field?.label || rule.field} ${rule.operator} ${valueLabel}`,
        removable: true,
      });
    });
  }

  elements.filterChipBar.innerHTML = chips
    .map(
      chip => `
        <div class="filter-chip">
          <button class="chip-main" type="button" data-chip-key="${chip.key}">${chip.label}</button>
          ${chip.removable ? `<button type="button" data-chip-clear="${chip.key}" aria-label="Clear ${chip.label}">x</button>` : ""}
        </div>
      `,
    )
    .join("");

  elements.filterChipMeta.textContent = `${
    state.aiRuntime.source === "openai" ? "Server AI" : "Local parser"
  } translated the current prompt into a ${state.profile.meta.riskBias.toLowerCase()} screen with ${state.classicFilters.groupMode} logic, ${state.classicFilters.formulaRules.length} active rule${state.classicFilters.formulaRules.length === 1 ? "" : "s"}, and ${state.customMetrics.length} synthetic metric${state.customMetrics.length === 1 ? "" : "s"}.`;

  [...elements.filterChipBar.querySelectorAll("[data-chip-key]")].forEach(button => {
    button.addEventListener("click", () => {
      if (button.dataset.chipKey !== "profile" && state.surfaceMode !== "classic") {
        setSurfaceMode("classic");
      }
    });
  });

  [...elements.filterChipBar.querySelectorAll("[data-chip-clear]")].forEach(button => {
    button.addEventListener("click", event => {
      event.stopPropagation();
      resetFilterChip(button.dataset.chipClear);
    });
  });
}

function resetFilterChip(key) {
  const defaults = getDefaultClassicFilters();
  if (key.startsWith("metric:")) {
    const metricId = key.split(":")[1];
    state.customMetrics = state.customMetrics.filter(metric => metric.id !== metricId);
    state.classicFilters.formulaRules = state.classicFilters.formulaRules.filter(rule => rule.field !== metricId);
    applyClassicFilters();
    return;
  }
  if (key.startsWith("rule:")) {
    const ruleId = key.split(":")[1];
    state.classicFilters.formulaRules = state.classicFilters.formulaRules.filter(rule => rule.id !== ruleId);
    applyClassicFilters();
    return;
  }
  switch (key) {
    case "session":
      state.classicFilters.session = defaults.session;
      break;
    case "minMomentum":
      state.classicFilters.minMomentum = defaults.minMomentum;
      break;
    case "maxRisk":
      state.classicFilters.maxRisk = defaults.maxRisk;
      break;
    case "minRelativeVolume":
      state.classicFilters.minRelativeVolume = defaults.minRelativeVolume;
      break;
    case "minQuality":
      state.classicFilters.minQuality = defaults.minQuality;
      break;
    case "priceRange":
      state.classicFilters.minPrice = defaults.minPrice;
      state.classicFilters.maxPrice = defaults.maxPrice;
      break;
    case "sector":
      state.classicFilters.sector = defaults.sector;
      break;
    case "marketCap":
      state.classicFilters.marketCap = defaults.marketCap;
      break;
    case "theme":
      state.classicFilters.theme = defaults.theme;
      break;
    case "formulaRules":
      state.classicFilters.formulaRules = [];
      state.classicFilters.groupMode = defaults.groupMode;
      break;
    default:
      break;
  }

  syncClassicControls();
  renderFormulaRules();
  render();
}

function renderBrief(ranked) {
  const liveUniverse = getLiveUniverse().map(stock => ({ ...stock, score: state.profile.score(stock) }));
  const contextSummary = getMarketContextSummary(getMarketContextUniverse());
  const top = ranked[0] || [...liveUniverse].sort(compareRankedStocks)[0];
  elements.briefHeadline.textContent = top
    ? `${state.profile.label} is highlighting ${top.symbol} and other clean setups.`
    : "SignalDeck is waiting for real market data before ranking setups.";
  elements.briefWindow.textContent = state.profile.meta.window;
  elements.briefBody.textContent = `${state.profile.meta.executionNote} Current backdrop: ${contextSummary.tone.toLowerCase()} tape. ${contextSummary.note}`;

  const metrics = [
    ["Hold bias", state.profile.meta.holdBias],
    ["Risk posture", state.profile.meta.riskBias],
    ["Market regime", contextSummary.tone],
    ["Monitor", state.profile.meta.monitorFocus],
  ];

  elements.briefMetrics.innerHTML = metrics
    .map(
      ([label, value]) => `
        <div>
          <dt>${label}</dt>
          <dd>${getCompactBriefMetric(label, value)}</dd>
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

function renderOpportunityListLegacy(ranked) {
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
                      <span>${stock.score} score - ${stock.relativeVolume.toFixed(1)}x rel vol</span>
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
            <span class="save-button ${state.watchlist.includes(stock.symbol) ? "saved" : ""}" data-save-symbol="${stock.symbol}" role="button" aria-label="Save ${stock.symbol}">${state.watchlist.includes(stock.symbol) ? "saved" : "save"}</span>
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

function renderOpportunityList(ranked) {
  elements.resultsTitle.textContent = state.profile.title;
  elements.resultsMeta.textContent = `${ranked.length} exact matches - ${
    state.resultsView === "table" ? "Table view" : "Card view"
  }`;

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
                      <span>${stock.score} score - ${stock.relativeVolume.toFixed(1)}x rel vol</span>
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

  if (state.resultsView === "cards") {
    elements.opportunityList.innerHTML = ranked
      .map(
        stock => `
          <article class="trade-card ${stock.symbol === state.selectedSymbol ? "active" : ""}" data-symbol="${stock.symbol}" role="button" tabindex="0">
            <div class="trade-card-head">
              <div class="ticker-meta">
                <strong>${stock.symbol}</strong>
                <span>${stock.name}</span>
              </div>
              <button class="save-button ${state.watchlist.includes(stock.symbol) ? "saved" : ""}" data-save-symbol="${stock.symbol}" type="button">
                ${state.watchlist.includes(stock.symbol) ? "saved" : "save"}
              </button>
            </div>
            <div class="trade-card-metrics">
              <strong>$${stock.price.toFixed(2)}</strong>
              <span class="${stock.changePct >= 0 ? "positive" : "negative"}">${formatSigned(stock.changePct)}%</span>
            </div>
            <div class="trade-card-grid">
              <div>
                <span>Relative volume</span>
                <strong>${stock.relativeVolume.toFixed(1)}x</strong>
              </div>
              <div>
                <span>Momentum</span>
                <strong>${stock.momentum}</strong>
              </div>
              <div>
                <span>Risk</span>
                <strong>${stock.risk}</strong>
              </div>
              <div>
                <span>Score</span>
                <strong>${stock.score}</strong>
              </div>
            </div>
          </article>
        `,
      )
      .join("");
  } else {
    elements.opportunityList.innerHTML = ranked
      .map(
        stock => `
          <div class="trade-row ${stock.symbol === state.selectedSymbol ? "active" : ""}" data-symbol="${stock.symbol}" role="button" tabindex="0">
            <span class="save-cell">
              <button class="save-button ${state.watchlist.includes(stock.symbol) ? "saved" : ""}" data-save-symbol="${stock.symbol}" type="button">
                ${state.watchlist.includes(stock.symbol) ? "saved" : "save"}
              </button>
            </span>
            <div class="ticker-meta">
              <strong>${stock.symbol}</strong>
              <span>${stock.name}</span>
            </div>
            <div>$${stock.price.toFixed(2)}</div>
            <div class="${stock.changePct >= 0 ? "positive" : "negative"}">${formatSigned(stock.changePct)}%</div>
            <div>${stock.relativeVolume.toFixed(1)}x</div>
            <div>${stock.momentum}</div>
            <div>${stock.risk}</div>
            <div><span class="score-pill">${stock.score}</span></div>
          </div>
        `,
      )
      .join("");
  }

  const handleRowSelect = async symbol => {
    state.selectedSymbol = symbol;
    if (!state.historyMap[state.selectedSymbol]) {
      await loadHistory(state.selectedSymbol);
    } else {
      render();
    }
  };

  [...elements.opportunityList.querySelectorAll("[data-symbol]")].forEach(row => {
    row.addEventListener("click", async event => {
      if (event.target.closest("[data-save-symbol]")) {
        return;
      }
      await handleRowSelect(row.dataset.symbol);
    });
    row.addEventListener("keydown", async event => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }
      event.preventDefault();
      await handleRowSelect(row.dataset.symbol);
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

  if (selected.price == null) {
    elements.inspectorSymbol.textContent = selected.symbol;
    elements.inspectorTag.textContent = selected.trend || "Tracked universe";
    elements.inspectorPrice.textContent = "--";
    elements.inspectorScore.textContent = "--";
    elements.signalList.innerHTML = [
      `${selected.symbol} is available in the tracked universe, but SignalDeck is still waiting on a fresh quote snapshot.`,
      `${selected.sector} and ${selected.theme} metadata are ready, so you can still route here from command search and the universe browser.`,
      "Refresh the market feed or wait for the next shared snapshot to unlock live price, risk, and microstructure detail.",
    ]
      .map(text => `<li>${text}</li>`)
      .join("");
    elements.riskFill.style.width = "0%";
    elements.riskScoreLabel.textContent = "Awaiting quote";
    elements.riskNote.textContent = "Risk context appears once a live quote arrives for the selected symbol.";
    elements.contextGrid.innerHTML = [
      ["Sector", selected.sector],
      ["Theme", selected.theme],
      ["Market cap", selected.marketCap],
      ["Session bias", toTitleCase(selected.session)],
      ["Feed state", "Waiting for quote"],
      ["History", history.length ? "Cached bars loaded" : "No recent bars yet"],
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
    renderSparkline([]);
    return;
  }

  elements.inspectorSymbol.textContent = selected.symbol;
  elements.inspectorTag.textContent = selected.trend;
  elements.inspectorPrice.textContent = formatPriceCell(selected.price);
  elements.inspectorScore.textContent = formatScoreCell(score);

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

  if (selected.price == null) {
    elements.executionHeadline.textContent = `${selected.symbol} is routed into the workspace, but execution notes need a fresh quote snapshot.`;
    elements.executionChip.textContent = `${toTitleCase(selected.session)} setup`;
    elements.executionBody.textContent =
      "Metadata routing is active, so you can still review sector, theme, and session context while the live feed catches up.";
    elements.executionGridList.innerHTML = [
      ["Theme", selected.theme],
      ["Sector", selected.sector],
      ["Session bias", toTitleCase(selected.session)],
      ["Feed state", "Waiting for quote"],
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
    elements.monitorList.innerHTML = [
      "Refresh the market feed to unlock live execution metrics.",
      "Use Universe search or Watchlist to keep routing symbols without blocking on the feed.",
      "SignalDeck will restore confirmation and invalidation notes after the next successful quote pull.",
    ]
      .map(item => `<li>${item}</li>`)
      .join("");
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
  elements.executionBody.textContent = `${selected.name} is being surfaced for ${selected.theme.toLowerCase()}, but the higher-quality path is to let 15-minute structure and carry behavior confirm before sizing up.`;

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
    `Watch whether ${selected.symbol} keeps its 15-minute structure instead of giving back the move into the close or next session.`,
    `Relative volume should stay near or above ${Math.max(1.1, selected.relativeVolume - 0.1).toFixed(1)}x to maintain conviction.`,
    `${selected.risk <= 30 ? "Trap risk is relatively low, so focus on persistence into the next 1 to 5 sessions." : "Risk is elevated, so failed continuation should be treated as a warning."}`,
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
      await persistUserMetadata({
        watchlist: state.watchlist,
        screenState: getWorkspaceSnapshot(),
      });
      await syncWatchlistFromAccount();
    } else {
      saveWatchlist(state.watchlist);
      saveWorkspaceState(getWorkspaceSnapshot());
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

function pickEnum(value, allowed, fallback) {
  return allowed.includes(value) ? value : fallback;
}

function cleanAiText(value, fallback) {
  const text = String(value || "").trim();
  return text || fallback;
}

function cleanAiList(values, limit, fallback) {
  if (!Array.isArray(values)) {
    return fallback;
  }

  const cleaned = values
    .map(item => String(item || "").trim())
    .filter(Boolean)
    .slice(0, limit);

  return cleaned.length ? cleaned : fallback;
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


