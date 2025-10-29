import app from './app';

const PORT = Number(process.env.PORT || 3001);

// 로컬 개발 전용 진입점: 서버리스 환경에선 사용되지 않음
app.listen(PORT,'0.0.0.0',  () => {
    // eslint-disable-next-line no-console
    console.log(`🔵 Local server listening on http://localhost:${PORT}`);
});
