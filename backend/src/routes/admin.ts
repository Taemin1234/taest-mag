import express from 'express';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';

const router = express.Router();

// `/admin/*` 아래 모든 엔드포인트에 이 미들웨어를 적용
router.use(authenticate, authorize(['ironman','superman']));


export default router;
