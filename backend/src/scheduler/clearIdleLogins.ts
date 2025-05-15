import cron from 'node-cron';
import connectDB from '../db';
import User from '../models/User';

async function startScheduler() {
  // DB 연결 
  await connectDB();

  // 매시 정각에 실행 (원하시면 cron 표현식 조정)
  // '0 * * * *' : 매시 정각에
  // '/30 * * * *' : 매시 30분마다
  cron.schedule('/30 * * * *', async () => {
    // 기준시각(cutoff) - 현재시간에서 12시간을 뺀 값(cutoff 이후 로그인한 사용자는 활동중)
    const cutoff = new Date(Date.now() - 12 * 60 * 60 * 1000);

    try {
        // isLoggedIn: true인 사용자들 중 로그인 시간이 cutoff 이전인 유저를 찾아서 false로 바꾼다.
      const result = await User.updateMany(
        { isLoggedIn: true, loginAt: { $lt: cutoff } },
        { isLoggedIn: false }
      );
      console.log(
        `[${new Date().toISOString()}] isLoggedIn 초기화:`,
        result.modifiedCount,
        '건'
      );
    } catch (err) {
      console.error('Scheduler error:', err);
    }
  },
  { timezone: 'Asia/Seoul' }
);

  console.log('🕒 clearIdleLogins 스케줄러가 시작되었습니다.');
}

// startScheduler() 를 즉시 호출해 스케줄러를 기동
startScheduler().catch(err => {
    //connectDB() 단계나 스케줄 등록 단계에서 예외가 발생하면, catch 블록이 잡아내 콘솔에 에러를 출력하고 프로세스를 종료(exit(1))
  console.error('스케줄러 시작 중 오류 발생:', err);
  process.exit(1);
});
