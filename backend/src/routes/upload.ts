import express, { Request, Response } from 'express';
import multer from 'multer';
import cloudinary from '../utils/cloudinary';

const router = express.Router();
// 메모리 스토리지: 파일을 메모리(버퍼 buffer)로 다룹니다
const upload = multer({ storage: multer.memoryStorage() });

interface RequestWithFile extends Request {
  file?: any;
}

// POST /api/upload
router.post('/', upload.single('image'), async (req: RequestWithFile, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    // Cloudinary에 스트림 방식으로 업로드
    const streamUpload = (fileBuffer: Buffer) => {
      return new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'editors' /* 저장 폴더 지정, 선택 사항 */ },
          (error, result) => {
            if (error) return reject(error);
            resolve(result!);
          }
        );
        stream.end(fileBuffer);
      });
    };

    const result = await streamUpload(req.file.buffer);
    // 업로드된 이미지의 URL을 응답
    res.json({ url: result.secure_url });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Upload failed' });
  }
});

export default router;
