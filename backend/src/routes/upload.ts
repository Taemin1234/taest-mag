import express, { Request, Response } from 'express';
import multer from 'multer';
import cloudinary from '../utils/cloudinary';

const router = express.Router();
// 메모리 스토리지: 파일을 메모리(버퍼 buffer)로 다룹니다
const storage = multer.memoryStorage();

// 썸네일 전용: 최대 1MB
const thumbnailUpload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }  // 1MB
}).single('thumbnail');

// 프로필 사진 전용: 최대 5MB
const profileUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }  // 5MB
}).single('profile');

// interface Files {
//   thumbnail?: Express.Multer.File[];
//   profile?: Express.Multer.File[];
// }

// interface RequestWithFiles extends Request {
//   file?: any;
//   files?: {
//     [fieldname: string]: Express.Multer.File[];
//   };
// }

// 스트림 업로드 헬퍼: folder 이름을 인자로 받도록 변경
const streamUpload = (fileBuffer: Buffer, folder: string) =>
  new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder }, // 동적으로 폴더 지정
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });

// POST /api/upload
router.post(
  '/',
  // thumbnail, profile 이라는 이름의 파일 필드 두 개를 동시에 처리
  thumbnailUpload,
  profileUpload,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (!files) {
        res.status(400).json({ message: 'No files uploaded' });
        return
      }

      let thumbnailUrl: string | undefined;
      let profileUrl: string | undefined;

      // 썸네일 업로드
      const thumbFile = files.thumbnail?.[0];
      if (thumbFile) {
        const thumbResult = await streamUpload(
          thumbFile.buffer,
          'posts/thumbnails'
        );
        thumbnailUrl = thumbResult.secure_url;
      }

      // 프로필 사진 업로드
      const profileFile = files.profile?.[0];
      if (profileFile) {
        const profileResult = await streamUpload(
          profileFile.buffer,
          'users/profiles'
        );
        profileUrl = profileResult.secure_url;
      }

      // 업로드된 URL들 응답
      res.json({ thumbnailUrl, profileUrl });
    } catch (err) {
      console.error('Upload error:', err);
      res.status(500).json({ message: 'Upload failed' });
    }
  }
);

export default router;
