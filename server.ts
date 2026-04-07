import express from "express";
import path from "path";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { RobloxService } from "./server/roblox.service.js";

dotenv.config();

// In-memory stats tracker
const stats = {
  totalBypasses: 0,
  totalChecks: 0,
  totalRefreshes: 0,
  lastRefreshTime: null as string | null
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.json());

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API Stats
  app.get("/api/stats", (req, res) => {
    res.json(stats);
  });

  // --- Bypass Endpoint ---
  app.get("/api/bypass", (req, res) => {
    res.json({ status: "ready", note: "Use POST with 'cook' and 'password'" });
  });

  app.post("/api/bypass", async (req, res) => {
    const startTime = Date.now();
    const { cookie, cook, password } = req.body;
    const userCookie = cookie || cook;

    if (!RobloxService.isValidCookie(userCookie)) {
      return res.status(400).json({ 
        error: "Invalid Cookie", 
        message: "The cookie must start with the standard Roblox warning message and be of a valid length." 
      });
    }
    
    if (!password) {
      return res.status(400).json({ error: "You must send 'password'" });
    }

    try {
      const { status, data } = await RobloxService.bypass(userCookie, password);
      
      const isSuccess = data.success || (data.result && data.result.success);
      if (isSuccess) {
        stats.totalBypasses++;
        stats.lastRefreshTime = new Date().toISOString();
      }

      const executionTimeSeconds = ((Date.now() - startTime) / 1000).toFixed(2);
      const responseData = data.result ? data : { result: data };
      responseData.executionTimeSeconds = executionTimeSeconds;

      // Wrap in result for frontend compatibility if it's not already
      res.status(status).json(responseData);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to execute bypass" });
    }
  });

  // --- Refresh Endpoint ---
  app.get("/api/refresh", (req, res) => {
    res.json({ status: "ready", note: "Use POST with 'cookie'" });
  });

  app.post("/api/refresh", async (req, res) => {
    const startTime = Date.now();
    const { cookie } = req.body;
    
    if (!RobloxService.isValidCookie(cookie)) {
      return res.status(400).json({ 
        error: "Invalid Cookie", 
        message: "The cookie must start with the standard Roblox warning message and be of a valid length." 
      });
    }
    
    try {
      const { status, ok, content } = await RobloxService.refresh(cookie);
      if (ok) {
        stats.totalRefreshes++;
        stats.lastRefreshTime = new Date().toISOString();
      }
      
      const executionTimeSeconds = ((Date.now() - startTime) / 1000).toFixed(2);
      
      res.status(status).json({ 
        result: {
          success: ok,
          message: ok ? "Success! The request went through." : `Failed with status code: ${status}`,
          content: content
        },
        executionTimeSeconds
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "An error occurred during the refresh process" });
    }
  });

  // --- Check/Scrape Endpoint ---
  app.get("/api/check", (req, res) => {
    res.json({ status: "ready", note: "Use POST with 'cookie'" });
  });

  app.post(["/api/check", "/api/scrape"], async (req, res) => {
    const startTime = Date.now();
    const { cookie } = req.body;
    
    if (!RobloxService.isValidCookie(cookie)) {
      return res.status(400).json({ 
        error: "Invalid Cookie", 
        message: "The cookie must start with the standard Roblox warning message and be of a valid length." 
      });
    }

    try {
      const result = await RobloxService.checkAccount(cookie);
      if (result.result && result.result.status === 'success') {
        stats.totalChecks++;
      }
      
      const executionTimeSeconds = ((Date.now() - startTime) / 1000).toFixed(2);
      result.executionTimeSeconds = executionTimeSeconds;
      
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "An error occurred during the checker process" });
    }
  });

  // Vite middleware for development or fallback
  const distPath = path.join(process.cwd(), 'dist');
  
  if (process.env.VERCEL) {
    console.log("Running on Vercel, skipping Vite middleware...");
  } else {
    const fs = await import('fs');
    if (process.env.NODE_ENV !== "production" || !fs.existsSync(path.join(distPath, 'index.html'))) {
      console.log("Using Vite middleware...");
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      console.log("Serving static dist folder...");
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
  
  return app;
}

const appPromise = startServer();

export default async function handler(req: any, res: any) {
  const app = await appPromise;
  app(req, res);
}

