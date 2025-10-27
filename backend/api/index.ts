// backend/api/index.ts
// import serverless from 'serverless-http';
// import app from '../src/app';

// export default serverless(app);

export default function handler(req: any, res: any) {
    res.status(200).json({ ok: true, path: req.url })
}
