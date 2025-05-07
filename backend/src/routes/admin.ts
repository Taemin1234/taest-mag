import express from 'express';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';

const router = express.Router();

// `/admin/*` 아래 모든 엔드포인트에 이 미들웨어를 적용
router.use(authenticate, authorize(['ironman','superman']));

router.get('/dashboard-data', /* ... */);
router.post('/users', /* ... */);
// … 그 외 admin 전용 CRUD

export default router;
