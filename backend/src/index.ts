import express from 'express';
import connectDB from './db';
import editorRoutes from './routes/editors';
import uploadRouter from './routes/upload';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB 연결
connectDB();

app.use(cors({ 
  origin: 'http://localhost:3000',
  credentials: true, 
}));

app.use(express.json());
app.use('/api/editors', editorRoutes);
app.use('/api/upload', uploadRouter);


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
