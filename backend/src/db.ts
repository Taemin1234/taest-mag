import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * MongoDB 연결 함수
 */
const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGO_URL;
  if (!uri) {
    console.error('❌ MONGO_URI 환경 변수가 설정되지 않았습니다.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
    } as mongoose.ConnectOptions);
    console.log('✅ MongoDB 연결 성공');
  } catch (error) {
    console.error('❌ MongoDB 연결 실패:', error);
    process.exit(1);
  }
};

export default connectDB;