import { Router } from 'express';
import Editor from '../models/Editors';

const router = Router();

// 목록 조회
router.get('/', async (req, res) => {
  const list = await Editor.find();
  res.json(list);
});

// 생성
router.post('/', async (req, res) => {
  const editor = new Editor(req.body);
  await editor.save();
  res.status(201).json(editor);
});

// 수정
router.put('/:id', async (req, res) => {
  const updated = await Editor.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// 삭제
router.delete('/:id', async (req, res) => {
  await Editor.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export default router;
