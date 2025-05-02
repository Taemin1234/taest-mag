import express from 'express';
import connectDB from './db';
import editorRoutes from './routes/editors';
import uploadRouter from './routes/upload';
import authRouter from './routes/auth';
import postRouter from './routes/posts'
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB 연결
connectDB();

// CORS 설정
app.use(cors({ 
  origin: 'http://localhost:3000',
  credentials: true, 
}));

app.use(express.json());
app.use(cookieParser());
app.use('/api/editors', editorRoutes);
app.use('/api/upload', uploadRouter);
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);


app.get('/', (_req, res) => {
  res.send('🟢 Express 서버가 잘 작동 중입니다!');
});

// 404 처리
app.use((_req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});
