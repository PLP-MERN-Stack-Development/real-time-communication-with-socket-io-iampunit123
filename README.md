# ChitChat — Fullstack Local Development

This workspace contains a small real-time chat application split into two parts:

- `Clientel/` — React + Vite front-end (ChitChat client)
- `server/` — Node/Express backend with Socket.IO

Quick start (PowerShell):

1. Server

```powershell
cd server
pnpm install
pnpm dev
```

2. Client

```powershell
cd Clientel
pnpm install
pnpm dev
```

Environment variables

- `REACT_APP_API_URL` — URL for API calls (default: http://localhost:5000/api)
- `REACT_APP_SOCKET_URL` — Socket server URL (default: http://localhost:5000)

If you prefer npm/yarn, run `npm install` / `npm run dev` instead of `pnpm`.
