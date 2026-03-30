import { RobloxService } from '../server/roblox.service.js';

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    return res.json({ status: "ready", note: "Use POST with 'cook' and 'password'" });
  }

  if (req.method === 'POST') {
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
      return res.status(status).json(data.result ? data : { result: data });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || "Failed to execute bypass" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
