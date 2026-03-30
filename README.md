# SLT-X Dashboard Backend

This is a full-stack application with an Express backend and a React frontend.

## Backend Structure

- `server.ts`: The main entry point for the Express server. It handles API routing and integrates Vite for development.
- `server/roblox.service.ts`: A dedicated service class that encapsulates all the logic for interacting with Roblox APIs and external bypass/refresh services.
- `.env.example`: Template for environment variables.

## API Endpoints

- `GET /api/health`: Health check endpoint.
- `POST /api/check`: Scans a Roblox account using a `.ROBLOSECURITY` cookie.
- `POST /api/bypass`: Bypasses a Roblox cookie using an external service.
- `POST /api/refresh`: Refreshes a Roblox session cookie.

## Development

Run `npm run dev` to start the development server. The backend runs on port 3000 and proxies frontend requests through Vite middleware.

## Production

Run `npm run build` to compile the frontend, then `npm start` to run the Express server which serves the static files from the `dist/` directory.
