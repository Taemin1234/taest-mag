import express, { Request, Response, Router, RequestHandler } from 'express';
import Post, { IPost } from '../models/Post';
import { authenticate } from '../middleware/authenticate';

const router: Router = express.Router();

/**
 * GET /api/post
 * 전체 게시물 리스트 조회 (최신 순)
 */
router.get('/', (async (req: Request, res: Response) => {
  try {
    const post = await Post.find().sort({ createdAt: -1 });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '게시물 조회 중 서버 오류' });
  }
}) as RequestHandler);

/**
 * GET /api/post/recommend
 * 같은 카테고리의 추천 게시물 4개 조회
 */
router.get('/recommend', (async (req: Request, res: Response) => {
  try {
    const { category, exclude } = req.query;

    if (!category) {
      return res.status(400).json({ message: 'category 쿼리 파라미터가 필요합니다.' });
    }

    const posts = await Post.find({
      category,
      slug: { $ne: exclude }, // 현재 게시물 제외
    })
      .sort({ createdAt: -1 }) // 최신순
      .limit(4);

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '추천 게시물 조회 중 서버 오류' });
  }
}) as RequestHandler);

/**
 * GET /api/post/featured
 * 메인에 게제될 게시물 조회
 */
router.get('/featured',(async (req: Request, res: Response) => {
    try {
      const featuredPosts = await Post.find({ isFeatured: true }).sort({ createdAt: -1 }).limit(5);
      res.json(featuredPosts)
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: '특집 게시물 조회 중 서버 오류' })
    }
  }) as RequestHandler
)

/**
 * GET /api/post/editor/:editorName
 * 특정 에디터가 작성한 게시물 조회
 */
router.get('/editor/:editorName', (async (req: Request, res: Response) => {
  try {
    const editorName = decodeURIComponent(req.params.editorName); // 한글 처리

    const posts = await Post.find({ editor: editorName }).sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '에디터 게시물 조회 중 서버 오류' });
  }
}) as RequestHandler);

/**
 * GET /api/post/:slug
 * 단일 게시물 조회
 */
router.get('/:slug', (async (req: Request, res: Response) => {
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
}) as RequestHandler);

/**
 * POST /api/post/:slug/view
 * · 해당 슬러그 게시물 조회수 +1 (한 브라우저 당 12시간에 1회만)
 */
router.post('/:slug/views', (async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params
    const cookieKey = `viewed_${slug}`

    // 1) 이미 쿠키가 있으면 (12시간 이내 재호출) → 아무 동작 없이 204 리턴
    if (req.cookies[cookieKey]) {
      res.status(204).end()
      return
    }

    try {
      // 2) 조회수 +1 (원자적 증가)
      await Post.findOneAndUpdate(
        { slug },
        { $inc: { views: 1 } }
      )

      // 3) 다시 12시간 동안 중복 방지용 쿠키 설정
      //    maxAge는 밀리초 단위: 12h = 12 * 60 * 60 * 1000
      res.cookie(cookieKey, '1', {
        maxAge: 12 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'lax',
      })

      res.status(204).end()
    } catch (err) {
      console.error('조회수 업데이트 실패', err)
      res
        .status(500)
        .json({ message: '조회수 업데이트 중 서버 오류' })
    }
  }) as RequestHandler
)

/**
 * POST /api/post
 * 새 게시물 생성 (인증 필요)
 */
router.post('/', authenticate, (async (req: Request, res: Response) => {
  try {
    const { title, subtitle, editor, category, subCategory, thumbnailUrl, content } = req.body;
    const post = new Post({ title, subtitle, editor, category, subCategory, thumbnailUrl, content } as IPost);
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '게시물 생성 중 서버 오류' });
  }
}) as RequestHandler);

/**
 * PUT /api/post/:slug
 * 게시물 수정 (인증 필요)
 */
router.put('/:slug', authenticate, (async (req: Request, res: Response) => {
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
}) as RequestHandler);

/**
 * DELETE /api/post/:slug
 * 게시물 삭제 (인증 필요)
 */
router.delete('/:slug', authenticate, (async (req: Request, res: Response) => {
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
}) as RequestHandler);

export default router;
