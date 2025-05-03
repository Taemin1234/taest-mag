import mongoose from 'mongoose';

/**
 * MongoDB 연결 함수
 */
const connectDB = async (): Promise<void> => {
  const url = process.env.MONGO_URL;

  if (!url) {
    console.error('❌ MONGO_URL 환경 변수가 설정되지 않았습니다.');
    process.exit(1);
  }

  try {
    await mongoose.connect(url, {
    } as mongoose.ConnectOptions);
    console.log('✅ MongoDB 연결 성공');
  } catch (error) {
    console.error('❌ MongoDB 연결 실패:', error);
    process.exit(1);
  }
};

export default connectDB;