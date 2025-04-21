require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const app = express();
const port = 3001; // Next.js랑 충돌 방지 위해 포트 다르게

import editorRoutes from './routes/editors';

app.use(express.json()); // JSON 파싱 미들웨어
app.use('/api/editors', editorRoutes);

app.get("/", (req, res) => {
  res.send("🟢 Express 서버가 잘 작동 중입니다!");
});

app.listen(port, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${port}`);
});

mongoose
.connect(process.env.MONGO_URI)
.then(() => console.log('Successfully connected to MongoDB'))
.catch((error) => console.log('Failed to connect to MongoDB', error));