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
 * 4) 사용자 정보 수정
 *    - 일반 정보(예: isActive) 변경: ironman, superman
 *    - 역할(role) 변경: superman만
 */
router.put('/:id', async (req: Request, res: Response) => {
  const updates: Partial<IUser> = {};
  if (req.body.isActive !== undefined) updates.isActive = req.body.isActive;

  // role 변경 요청이 있을 때는 superman만 허용
  if (req.body.role) {
    const currentUser = (req as any).user as IUser;
    if (currentUser.role !== 'superman') {
      return res.status(403).json({ message: '권한이 없습니다. role 변경은 superman만 가능합니다.' });
    }
    updates.role = req.body.role;
  }

  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true })
    .select('-password -resetPasswordToken -resetPasswordExpires');
  if (!user) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
  res.json(user);
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