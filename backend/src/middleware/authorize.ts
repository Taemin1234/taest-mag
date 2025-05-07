import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/User';

export const authorize =
  (allowedRoles: IUser['role'][]) => // 허용할 역할 목록 받아오기
  (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as IUser; // authenticate 미들웨어로부터 주입
    if (!user || !allowedRoles.includes(user.role)) {
      res.status(403).json({ message: '권한이 없습니다.' });
      return
    }
    next();
  };
