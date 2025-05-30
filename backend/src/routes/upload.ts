import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import multer from 'multer';
import { cloudinary, UploadApiOptions, UploadApiResponse } from '../utils/cloudinary';
import streamifier from 'streamifier';

const router = express.Router();
// 메모리 스토리지: 파일을 메모리(버퍼 buffer)로 다룹니다
const storage = multer.memoryStorage();

const imageOnly = (req: any, file: Express.Multer.File, cb:any) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('이미지 파일만 업로드 가능합니다.'));
  }
  cb(null, true);
};

// 파일 크기 제한
const KB = 1024;
const MB = 1024 * KB;

const createUploader = (maxSize: number) =>
  multer({ storage, limits: { fileSize: maxSize }, fileFilter: imageOnly });

// 프로필 업로드 전용 Multer
const profileUpload = createUploader(1 * MB);

// 썸네일 업로드 전용 Multer
const thumbnailUpload = createUploader(5 * MB);

// quill 업로드 전용 Multer
const quillUpload  = createUploader(5 * MB);

const streamUpload = (buffer: Buffer, options: UploadApiOptions = {}) =>
  new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options, // 동적으로 폴더 지정
      (error, result) => {
        if (error) {
          return reject(error);
        }
        if (!result) {
          return reject(new Error('Cloudinary did not return a result'));
        }
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });


// --- 프로필 라우트 ---
router.post(
  '/profile',
  profileUpload.single('profile'),
  (async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ message: '파일 없음' });
        return;
      }
      const result = await streamUpload(req.file.buffer, { folder: 'profiles' });
      res.json({ url: result.secure_url });
    } catch (err) {
      next(err);
    }
  }) as RequestHandler
);

// --- 썸네일 라우트 ---
router.post(
  '/thumbnail',
  thumbnailUpload.single('thumbnail'),
  (async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ message: '파일 없음' });
        return;
      }
      const result = await streamUpload(req.file.buffer, { folder: 'thumbnails' });
      res.json({ url: result.secure_url });
    } catch (err) {
      next(err);
    }
  }) as RequestHandler
);

router.post(
  '/quill',
  quillUpload.single('quill'),
  (async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ message: '파일 없음' });
        return;
      }
      const result = await streamUpload(req.file.buffer, { folder: 'quill' });
      res.json({ url: result.secure_url });
    } catch (err) {
      next(err);
    }
  }) as RequestHandler
);

export default router;
