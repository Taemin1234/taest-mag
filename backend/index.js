// index.js
const express = require("express");
const app = express();
const port = 3001; // Next.js랑 충돌 방지 위해 포트 다르게

app.use(express.json()); // JSON 파싱 미들웨어

app.get("/", (req, res) => {
  res.send("🟢 Express 서버가 잘 작동 중입니다!");
});

app.listen(port, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${port}`);
});
