// 쿠키의 토큰이 유효한지 검사
import { Request, Response, NextFunction } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const token = req.cookies['token'];       // cookie-parser 필요
  if (!token) {
    res.status(401).json({ message: '토큰이 없습니다.' });
    return;
  } 
  try {
     // 1) 토큰 검증
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch(err:any) {
    // 2) 토큰 만료 처리
    if (err instanceof TokenExpiredError) {
      // 2-1) 쿠키 삭제
      res.clearCookie('token', { path: '/' });
      
      // 2-2) DB isLoggedIn 초기화
      const decoded = jwt.decode(token) as { id?: string };
      if (decoded?.id) {
        await User.findByIdAndUpdate(decoded.id, { isLoggedIn: false });
      }
      res.status(401).send('토큰이 만료되었습니다. 다시 로그인해주세요.');
    } else {
      res.status(401).send('유효하지 않은 토큰입니다.');
    }
  }
};
