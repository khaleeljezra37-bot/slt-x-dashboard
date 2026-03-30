import { RobloxService } from '../server/roblox.service.js';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    return res.json({ status: "ready", note: "Use POST with 'cookie'" });
  }

  if (req.method === 'POST') {
    const { cookie } = req.body;
    
    if (!RobloxService.isValidCookie(cookie)) {
      return res.status(400).json({ 
        error: "Invalid Cookie", 
        message: "The cookie must start with the standard Roblox warning message and be of a valid length." 
      });
    }
    
    try {
      const { status, ok, content } = await RobloxService.refresh(cookie);
      return res.status(status).json({ 
        result: {
          success: ok,
          message: ok ? "Success! The request went through." : `Failed with status code: ${status}`,
          content: content
        }
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || "An error occurred during the refresh process" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
