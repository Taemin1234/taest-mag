// backend/models/User.ts

import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// TypeScript 인터페이스 정의
export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  role: 'superman' | 'ironman' | 'human';
  isLoggedIn: boolean;
  isActive: boolean;
  failedLoginAttempts: number;
  lastLoginAttempt?: Date;
  ipAddress?: string;
  loginAt: Date;
  createdAt: Date;
  updatedAt: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  comparePassword: (plainPassword: string) => Promise<boolean>;
  generatePasswordResetToken: () => Promise<string>;
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
    role: {
      type: String,
      enum: ['superman', 'ironman', 'human'],
      default: 'human',
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
    loginAt: {
      type: Date,
      default: Date.now
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

UserSchema.index({ isLoggedIn: 1, loginAt: 1 });

// 비밀번호 해시 처리 전처리
UserSchema.pre<IUser>('save', async function (next) {
  // 비밀번호 필드가 새로 설정되었는지 확인
  if (!this.isModified('password')) return next();
  // 변경되었을 때 salt생성
  const salt = await bcrypt.genSalt(10);
  // 비밀번호를 해시하고 덮어쓰기
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 비밀번호 비교 메서드 추가
UserSchema.methods.comparePassword = async function (plainPassword: string): Promise<boolean> {
  // 입력한 비밀번호와 저장된 해시 비번을 비교
  return await bcrypt.compare(plainPassword, this.password);
};

// 비밀번호 재설정 토큰 생성 메서드
UserSchema.methods.generatePasswordResetToken = async function (): Promise<string> {
  // 랜덤 토큰 생성 (32자리)
  const resetToken = require('crypto').randomBytes(32).toString('hex');

  // 토큰을 해시하여 저장 (보안상 원본 토큰은 저장하지 않음)
  this.resetPasswordToken = require('crypto').createHash('sha256').update(resetToken).digest('hex');

  // 토큰 만료 시간 설정 (1시간 후)
  this.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);

  // 변경사항 저장
  await this.save();

  // 원본 토큰 반환 (이메일로 전송됨)
  return resetToken;
};

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;