# SignalDeck

SignalDeck is an AI-guided stock opportunity scanner prototype with a real market-data path.

## What it does

- accepts natural-language scan prompts in AI Mode
- exposes transparent filters in Classic Mode
- ranks a curated stock universe by conviction and downside control
- explains why a symbol passed and what to monitor next
- stores a local watchlist in the browser
- optionally routes AI Mode through a server-side OpenAI parser before falling back to local heuristic rules

## Real data

This build is designed to use [Twelve Data](https://twelvedata.com/docs) for free-tier quote snapshots and recent price bars.

- `GET /api/config` reports whether a server-side API key is configured
- `POST /api/ai/scan-profile` uses OpenAI Responses + Structured Outputs when `OPENAI_API_KEY` is present
- `GET /api/market/quotes` proxies quote data for the tracked universe
- `GET /api/market/history` proxies recent time-series bars for the selected symbol

The free-tier sample intentionally tracks a small universe and refreshes once per minute so the demo stays within budget.

## Run locally

1. Start the local server:

```powershell
npm start
```

2. Open:

```text
http://localhost:4173
```

3. Either:
- set `TWELVE_DATA_API_KEY` in your environment before starting the server, or
- paste a free Twelve Data key into the UI for local-only testing

To enable real AI prompt parsing on the server, also set:

```text
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-4.1-mini
```

You can also copy `.env.example` to `.env` and place your key there.

## Why localhost stops working

When you close the terminal that started `npm start`, the local Node server stops running, so `http://localhost:4173` no longer exists.

## Public deployment

For a public URL, deploy the project to a host and set `TWELVE_DATA_API_KEY` as a server environment variable. Do not rely on a browser-stored key for public demos.

This repo now includes:

- `render.yaml` for a simple Render deployment
- `.env.example` for local key setup
- `GET /api/health` for a lightweight health check
