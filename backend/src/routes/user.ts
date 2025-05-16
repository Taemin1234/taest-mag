import { Router, Request, Response } from 'express';
import User, { IUser } from '../models/User';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';

const router = Router();

// 이 라우터 아래 모든 경로에 로그인 + ironman·superman 권한 검사 적용
router.use(authenticate, authorize(['ironman','superman','human']));

/**
 * 1) 전체 사용자 조회 (ironman, superman)
 */
router.get('/', async (req: Request, res: Response) => {
  const users = await User.find().select('-password -resetPasswordToken -resetPasswordExpires');
  res.json(users);
});

/**
 * 2) 로그인한 사용자 조회
 */
router.get('/user', authenticate, async (req: Request, res: Response) => {
  const currentUser = (req as any).user as IUser;
  const user = await User.findById(currentUser.id)
      .select('-password -resetPasswordToken -resetPasswordExpires');
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
  }
  res.json(user);
});

/**
 * 3) 특정 사용자 조회 (ironman, superman)
 */
router.get('/:id', async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id)
    .select('-password -resetPasswordToken -resetPasswordExpires');
  if (!user) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
  res.json(user);
});

/**
 * 4) 사용자 역할 수정
 */
router.patch('/role', authenticate, authorize(['superman']), 
  async (req: Request, res: Response) => {
  const { email, role } = req.body
    try {
      // 이메일로 사용자 찾아서 role만 업데이트
      const user = await User.findOneAndUpdate(
        { email },
        { role },
        { new: true }
      )
      if (!user) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' })
      return res.json({ message: '티어 변경 완료', user })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ message: '서버 오류' })
    }
});

/**
 * 5) 사용자 삭제 (superman만)
 */
router.delete(
  '/:id',
  authorize(['superman']),   // superman만 덮어쓰기
  async (req: Request, res: Response) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    res.sendStatus(204);
  }
);

export default router;