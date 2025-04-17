// backend/models/User.ts

import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// TypeScript 인터페이스 정의
export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  isLoggedIn: boolean;
  isActive: boolean;
  failedLoginAttempts: number;
  lastLoginAttempt?: Date;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  comparePassword: (plainPassword: string) => Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+@.+\..+/, 'Invalid email format'],
    },
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 30,
      unique: true, //중복방지
    },
    password: {
      type: String,
      required: true,
      select: false, // 쿼리 시 기본적으로 제외됨
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lastLoginAttempt: {
      type: Date,
    },
    ipAddress: {
      type: String,
    },
    resetPasswordToken: { // 재설정 링크의 고유 인증 키
      type: String,
      select: false, // 보안상 기본 조회 제외
    },
    resetPasswordExpires: { // 토큰 유효 기간 (만료 시간)
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt 자동 생성
  }
);

// 비밀번호 해시 처리 전처리
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 비밀번호 비교 메서드 추가
UserSchema.methods.comparePassword = async function (plainPassword: string): Promise<boolean> {
  return await bcrypt.compare(plainPassword, this.password);
};

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;