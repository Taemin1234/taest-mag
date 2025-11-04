// backend/src/app.ts
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import connectDB from './db';
import editorRoutes from './routes/editors';
import uploadRouter from './routes/upload';
import authRouter from './routes/auth';
import postRouter from './routes/posts';
import userRouter from './routes/user';
import adminRouter from './routes/admin';

const app = express();

// ===== [필수] 서버리스: listen() 절대 호출 금지 =====
const NODE_ENV = process.env.NODE_ENV || 'development';

// MongoDB 연결 (서버리스에선 재사용되도록 db.ts에서 커넥션 캐시 권장)
connectDB();

// 프록시 인지(쿠키/SSL)
app.set('trust proxy', 1);

// ===== CORS (허용 목록 기반) =====
/**
 * 로컬 개발 허용하려면 CORS_ALLOW_LOCALHOST=true
 * CORS_ORIGINS: 쉼표로 구분된 도메인 목록
 */
const allowList = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

// 개발 편의: origin 없으면 허용(서버-서버 호출)
const corsOptions: cors.CorsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    if (allowList.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
};
app.use(cors(corsOptions));


// ===== 보안/성능 공통 =====
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // 외부로 이미지 제공 시 편의
}));
app.use(compression());
app.use(cookieParser());
app.use(express.json());

// ===== 라우트 =====
app.use('/api/editors', editorRoutes);
app.use('/api/upload', uploadRouter);
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);

// 헬스체크 체크
app.get('/api/health', (_req, res) => {
    res.json({ ok: true, time: new Date().toISOString() })
});

// 루트
app.get('/', (_req, res) => {
    res.send(`🟢 Express up (env: ${NODE_ENV}) 서버가 잘 작동 중입니다.`);
});

// 404 핸들러 (마지막)
app.use((_req, res) => {
    res.status(404).json({ message: 'Not Found' });
});

export default app;
