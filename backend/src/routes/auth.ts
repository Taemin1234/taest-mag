//관리·회원가입·로그인·비밀번호 찾기·재설정·로그아웃 엔드포인트를 모두 포함

import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken'; // 사용자 검증
import User, { IUser } from '../models/User';
import { authenticate } from '../middleware/authenticate'; //쿠키에 있는 토큰이 유효한지 검사
import crypto from 'crypto';
// 이메일 전송 유틸 - 실제 구현 필요
import sendEmail from '../utils/sendEmail';

const router = express.Router();

// 회원가입
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;
    // 이메일 중복검사
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: '이미 가입된 이메일입니다.' });

    //새 User 인스턴스 생성 및 저장 (mongoDB저장)
    const user = new User({ email, username, password });
    await user.save();  // pre-save 훅에서 패스워드 해시

    res.status(201).json({ message: '회원가입 완료' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 로그인
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ message: '이메일 또는 비밀번호가 일치하지 않습니다.' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: '이메일 또는 비밀번호가 일치하지 않습니다.' });

    // JWT 발급
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    // httpOnly 쿠키에 저장
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600 * 1000,
    });

    res.json({ message: '로그인 성공' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 비밀번호 찾기 요청
router.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: '등록된 이메일이 없습니다.' });

    // 토큰 생성 + 해시 저장 (generatePasswordResetToken 메서드 사용)
    const resetToken = await (user as IUser).generatePasswordResetToken();
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // 이메일 전송
    await sendEmail({
      to: user.email,
      subject: '비밀번호 재설정 링크',
      text: `이 링크를 클릭해 비밀번호를 재설정하세요: ${resetUrl}`,
    });

    res.json({ message: '비밀번호 재설정 이메일을 보냈습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 비밀번호 재설정
router.post('/reset-password/:token', async (req: Request, res: Response) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select('+password');

    if (!user) return res.status(400).json({ message: '토큰이 유효하지 않거나 만료되었습니다.' });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();  // pre-save 훅에서 해시 처리

    res.json({ message: '비밀번호가 성공적으로 변경되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 로그아웃
router.post('/logout', authenticate, (_req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ message: '로그아웃되었습니다.' });
});

export default router;
