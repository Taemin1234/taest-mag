// backend/src/models/Post.ts

import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface IPost extends Document {
  title: string;                  // 제목
  subtitle?: string;              // 소제목 (선택)
  editor: string;         // 작성자(에디터) 참조
  category:string;
  subCategory:string;
  thumbnailUrl: string;
  content: string;                // React-Quill에서 생성된 HTML 문자열
  slug: string;                  // URL 슬러그 (선택)
  postNum:number;
  createdAt: Date;                // 자동 생성
  updatedAt: Date;                // 자동 갱신
} 

const PostSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    editor: {
      type: String,
      ref: 'Editor',
      required: true,
    },
    category: {
        type: String, 
        required: true, 
        trim: true
    },
    subCategory: {
        type: String, 
        required: true, 
        trim: true
    },
    thumbnailUrl: { 
      type: String, 
      required: true 
    },
    content: {
      type: String,
      required: true,
      // React-Quill 에디터가 만들어낸 HTML을 그대로 저장
    },
    slug: {
      type: String,
      unique: true,
      // auto-increment나 UUID 등으로 별도 생성
    },
    postNum: {
        type:Number,
        unique:true,
    },
  },
  {
    timestamps: true,  // createdAt, updatedAt 자동 관리
  }
);

// 6자리 난수 기반 슬러그 자동 생성 훅
PostSchema.pre<IPost>('validate', async function (next) {
    if (this.isNew) {
      let randNum: number;
      let candidateSlug: string;
      let exists: IPost | null;
      do {
        randNum = Math.floor(Math.random() * 1_000_000);
        const rand = randNum.toString().padStart(6, '0');
        candidateSlug = `${this.category}-${this.subCategory}-${rand}`;
        exists = await mongoose.models.Post.findOne({ slug: candidateSlug }) as IPost;
      } while (exists);
      this.slug = candidateSlug;
      this.postNum = randNum;
    }
    next();
});

const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post;
