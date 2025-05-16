import { Router, Request, Response } from 'express';
import Editor from '../models/Editors';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';

const router = Router();

// 전체 에디터 조회
router.get('/', async (req: Request, res: Response) => {
  const editors = await Editor.find();
  res.json(editors);
});

// 에디터 생성
router.post('/', authenticate, async (req: Request, res: Response) => {
  const editor = await Editor.create(req.body);
  res.status(201).json(editor);
});

// 에디터 수정
router.put('/:id', authenticate, authorize(['ironman', 'superman']), async (req: Request, res: Response) => {
  const editor = await Editor.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(editor);
});

// 에디터 삭제
router.delete('/:id', authenticate, authorize(['superman']), async (req: Request, res: Response) => {
  await Editor.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

export default router;