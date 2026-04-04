// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// Since this is a Vite + Express app, this file might not be used if server.ts handles it.
// But we'll add it just in case it's deployed to Vercel.

// We can't easily share in-memory state between serverless functions,
// so for serverless we'll return a mock or fetch from a DB if we had one.
// For now, we'll return a basic structure.
export default function handler(req: any, res: any) {
  res.status(200).json({
    lastRefreshTime: null
  });
}
