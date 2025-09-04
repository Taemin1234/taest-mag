import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from '../src/db';
import editorRoutes from '../src/routes/editors';
import uploadRouter from '../src/routes/upload';
import authRouter from '../src/routes/auth';
import postRouter from '../src/routes/posts'
import userRouter from '../src/routes/user'
import adminRouter from '../src/routes/admin'

import cors from 'cors';
//Express 앱에 보안 관련 HTTP 헤더를 자동으로 추가해줌.
import helmet from 'helmet'
//서버에서 응답을 gzip/deflate로 압축해서 네트워크 전송량을 줄여줌.
import compression from 'compression'
import cookieParser from 'cookie-parser';
import serverless from 'serverless-http';

const app = express();

// ========= [필수] 기본 환경 =========
const NODE_ENV = process.env.NODE_ENV || 'development'
const PORT = Number(process.env.PORT) || 3001

// MongoDB 연결
connectDB();

// ========= [필수] 프록시 인지 (HTTPS/리버스 프록시 뒤에 둘 경우) =========
app.set('trust proxy', 1)

// ========= [필수] CORS 설정 (환경변수 기반) =========
/**
 * 로컬 개발을 허용하고 싶으면 CORS_ALLOW_LOCALHOST=true
 */
const allowList = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)

const allowLocalhost = process.env.CORS_ALLOW_LOCALHOST === 'true'

const corsOrigin = (origin: string | undefined, cb: (err: Error | null, allowed?: boolean) => void) => {
  if (!origin) return cb(null, true) // 서버-서버 호출 등 Origin 없는 경우 허용
  if (allowList.includes(origin)) return cb(null, true)
  if (allowLocalhost && /^http:\/\/localhost:\d+$/.test(origin)) return cb(null, true)
  cb(new Error('Not allowed by CORS'))
}

app.use(cors({
  origin: corsOrigin,
  credentials: true,
}))

// ========= [필수] 보안/성능 공통 =========
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // 외부로 이미지 제공 시 편의
}))
app.use(compression())

app.use(cookieParser());

// ========= [필수] 미들웨어 =========
app.use(express.json());

app.use('/api/editors', editorRoutes);
app.use('/api/upload', uploadRouter);
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);
app.use('/api/user', userRouter);

app.use('/admin', adminRouter)

// 헬스체크 (로드밸런서/모니터링용)
// eslint-disable-next-line spellcheck/spell-checker
app.get('/healthz', (_req, res) => {
  res.status(200).send('ok')
})

// 루트
app.get('/', (_req, res) => {
  res.send('🟢 Express 서버가 잘 작동 중입니다!')
})

// ========= [필수] 404 & 에러 핸들러 =========
app.use((_req, res) => {
  res.status(404).json({ message: 'Not Found' })
})

// ========= [필수] 기동 & 우아한 종료 =========
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 서버 실행 중: http://0.0.0.0:${PORT} (env: ${NODE_ENV})`)
})

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...')
  server.close(() => {
    // TODO: DB 연결 종료 등 정리
    process.exit(0)
  })
})

// Vercel이 인식하는 CommonJS export 형식
export = serverless(app);