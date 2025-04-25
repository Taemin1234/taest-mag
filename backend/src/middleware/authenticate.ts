// 쿠키의 토큰이 유효한지 검사
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;       // cookie-parser 필요
  if (!token) return res.status(401).send('토큰이 없습니다.');
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch {
    res.status(401).send('유효하지 않은 토큰입니다.');
  }
};
