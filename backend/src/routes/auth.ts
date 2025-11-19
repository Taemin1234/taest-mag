//관리·회원가입·로그인·비밀번호 찾기·재설정·로그아웃 엔드포인트를 모두 포함

import express, { Request, Response, RequestHandler } from 'express';
import jwt from 'jsonwebtoken'; // 사용자 검증
import User, { IUser } from '../models/User';
import { authenticate } from '../middleware/authenticate'; //쿠키에 있는 토큰이 유효한지 검사
import crypto from 'crypto';

// 이메일 전송 유틸 - 실제 구현 필요
import sendEmail from '../utils/sendEmail';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

const router = express.Router();

// 회원가입
router.post('/signup', (async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;

     // 1) 이메일 또는 아이디 중복검사
     const existing = await User.findOne({
      $or: [
        { email },
        { username },
      ],
    });

    if (existing) {
      if (existing.email === email) {
        return res
          .status(400)
          .json({ field: 'email', message: '이미 가입된 이메일입니다.' });
      }
      if (existing.username === username) {
        return res
          .status(400)
          .json({ field: 'username', message: '이미 사용 중인 아이디입니다.' });
      }
    }

    //새 User 인스턴스 생성 및 저장 (mongoDB저장)
    const user = new User({ email, username, password });
    await user.save();  // pre-save 훅에서 패스워드 해시

    res.status(201).json({ message: '회원가입 완료' });
  } catch (err:any) {
    if (err.code === 11000) {
      const dupField = Object.keys(err.keyValue)[0];
      return res
        .status(400)
        .json({ field: dupField, message: `${dupField}이(가) 중복됩니다.` });
    }
    res.status(500).json({ message: '서버 오류' });
  }
}) as RequestHandler);

// 로그인
router.post('/login', (async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).select('+password');
    if (!user) return res.status(401).json({ message: '아이디 또는 비밀번호가 일치하지 않습니다.' });

    // 비활성화 검증
    if (!user.isActive) {
        return res
            .status(401)
            .json({ message: "비활성화된 계정입니다. 관리자에게 문의하세요." });
    }

    // 중복 로그인 검증
    // if (user.isLoggedIn) {
    //     return res
    //         .status(401)
    //         .json({ message: "이미 다른 기기에서 로그인되어 있습니다." });
    // }

    // Users 스키마에서 비밀번호 검증
    const isMatch = await user.comparePassword(password);

    // 검증실패 5번의 기회제공
    if (!isMatch) {
        user.failedLoginAttempts += 1;
        user.lastLoginAttempt = new Date();

        //5번 이상 실패했을 때
        if (user.failedLoginAttempts >= 5) {
            //계정 비활성화
            user.isActive = false;
            // 비활성화를 업데이트
            await user.save();
            return res.status(401).json({
                message: "비밀번호를 5회 이상 틀려 계정이 비활성화되었습니다.",
            });
        }

        // 5번 이하 실패 사항 서버에 저장
        await user.save();
        return res.status(401).json({
            message: "비밀번호가 일치하지 않습니다.",
            remainingAttempts: 5 - user.failedLoginAttempts,
        });
    }

    // 비밀번호 입력에 성공했을 시
    // 시도 횟수, 마지막 로그인 시도는 초기화
    // 중복 로그인 방지를 위해 isLoggedIn을 true로 변경
    user.failedLoginAttempts = 0;
    user.lastLoginAttempt = new Date();
    user.isLoggedIn = true;
    user.loginAt = new Date();

    // 로그인을 시도하는 ip 주소의 계정 저장
    try {
        // 아래 주소는 json 형식으로 공인 ip 추출
        const res = await fetch("https://api.ipify.org?format=json");
        if (!res.ok) {
          throw new Error(`IP API 요청 실패 (status: ${res.status})`);
        }
      
        // JSON 파싱
        const data: { ip: string } = await res.json();
        const ipAddress = data.ip;
      
        // ip 업데이트
        user.ipAddress = ipAddress;
    } catch (ipError: any) {
        console.error("IP 주소를 가져오는 중 오류 발생:", ipError.message);
    }

    // 위 값을 서버에 저장
    await user.save();

    // JWT 발급
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '12h' }
    );

    // httpOnly 쿠키에 저장
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production'     // dev: 'lax', prod: 'none'
    ? 'none'
    : 'lax',
      path: '/',
      maxAge: 12 * 60 * 60 * 1000,
    });

    // 티어 저장
    const role = user.role

    res.cookie('user-tier', role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production'     // dev: 'lax', prod: 'none'
    ? 'none'
    : 'lax',
      path: '/',
      maxAge: 12 * 60 * 60 * 1000,
    });

    res.json({ message: '로그인 성공' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
}) as RequestHandler);

// 로그아웃
router.post('/logout', authenticate, (async (req: AuthRequest, res: Response) => {
  try {
    // 1) 쿠키삭제
    res.clearCookie('token');
    res.clearCookie('user-tier');

    // 2) DB 업데이트: isLoggedIn = false
    const userId = req.user!.id;
    await User.findByIdAndUpdate(userId, { isLoggedIn: false });

    // 3) 성공 응답
    res.json({ message: '로그아웃되었습니다.' });
  } catch (err) {
    console.error('로그아웃 오류:', err);
    res.status(500).json({ message: '로그아웃 중 서버 오류가 발생했습니다.' });
  }
}) as RequestHandler);

// 비밀번호 찾기 요청
router.post('/forgot-password', (async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: '비밀번호 재설정 이메일을 보냈습니다.' });

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
}) as RequestHandler);

// 비밀번호 재설정
router.post('/reset-password/:token', (async (req: Request, res: Response) => {
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
}) as RequestHandler);

export default router;