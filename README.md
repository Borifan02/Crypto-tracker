# Crypto Tracker (Simple Implementation)

This project is a minimal cryptocurrency tracker with a lightweight Express backend that proxies CoinGecko API requests
and a vanilla JavaScript frontend using Chart.js for charts.

## Features
- Fetches live market data (price, 24h change, market cap, volume) from CoinGecko.
- Search and filter coins.
- Click a coin to view historical price chart (7/14/30/90/... days).
- Sparkline previews in the table.

## How to run locally

1. Install Node.js (>=16) and npm.
2. Start the backend:
   ```bash
   cd backend
   npm install
   npm start
   ```
   The backend listens on port 3000 by default.

3. Serve frontend:
   - Option A: Serve statically from backend. (Copy frontend files into a public folder and serve with express)
   - Option B: Open `frontend/index.html` directly in your browser while backend runs on http://localhost:3000.
     If opening directly from file:// you may need to set `BASE_API` in `frontend/app.js` to 'http://localhost:3000'.

## Notes
- This project uses the public CoinGecko API (no API key required). Respect their rate limits.
- For production use, consider adding caching, rate-limiting, better error handling and env configuration.

Enjoy! 🚀
