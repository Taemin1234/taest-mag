import express, { Request, Response } from 'express';
import Post, { IPost } from '../models/Post';
import { authenticate } from '../middleware/authenticate';

const router = express.Router();

/**
 * GET /api/post
 * 전체 게시물 리스트 조회 (최신 순)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const post = await Post.find().sort({ createdAt: -1 });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '게시물 조회 중 서버 오류' });
  }
});

/**
 * GET /api/post/:slug
 * 단일 게시물 조회
 */
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) {
      return res.status(404).json({ message: '게시물을 찾을 수 없습니다.' });
    }
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '게시물 조회 중 서버 오류' });
  }
});

/**
 * POST /api/post
 * 새 게시물 생성 (인증 필요)
 */
router.post('/', authenticate, async (req: Request, res: Response) => {
  try {
    const { title, subtitle, editor, category, subCategory, content } = req.body;
    const post = new Post({ title, subtitle, editor, category, subCategory, content } as IPost);
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '게시물 생성 중 서버 오류' });
  }
});

/**
 * PUT /api/post/:slug
 * 게시물 수정 (인증 필요)
 */
router.put('/:slug', authenticate, async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    const post = await Post.findOneAndUpdate(
      { slug: req.params.slug },
      updates,
      { new: true }
    );
    if (!post) {
      return res.status(404).json({ message: '게시물을 찾을 수 없습니다.' });
    }
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '게시물 수정 중 서버 오류' });
  }
});

/**
 * DELETE /api/post/:slug
 * 게시물 삭제 (인증 필요)
 */
router.delete('/:slug', authenticate, async (req: Request, res: Response) => {
  try {
    const result = await Post.findOneAndDelete({ slug: req.params.slug });
    if (!result) {
      return res.status(404).json({ message: '게시물을 찾을 수 없습니다.' });
    }
    res.json({ message: '게시물이 삭제되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '게시물 삭제 중 서버 오류' });
  }
});

export default router;
