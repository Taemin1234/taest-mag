import mongoose, { Document, Schema, Model } from 'mongoose';

// Counter 인터페이스 및 스키마 (auto-increment용)
// 자동 숫자 증가를 관리
interface ICounter extends Document {
  _id: string;
  seq: number;
}
const CounterSchema = new Schema<ICounter>(
  {
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
  },
  { collection: 'counters' }
);
const Counter: Model<ICounter> = mongoose.models.Counter || mongoose.model<ICounter>('Counter', CounterSchema);

// 서브문서용 인터페이스 (소셜 링크)
export interface ISocialLink {
  platform: string;
  url: string;
}

// Editor 도큐먼트 인터페이스
export interface IEditor extends Document {
  slug: number;
  name: string;
  tagline: string;
  des?: string;
  imageUrl?: string;
  socialLinks: ISocialLink[];
  createdAt: Date;
  updatedAt: Date;
}

// 소셜 링크 스키마
const SocialLinkSchema = new Schema<ISocialLink>(
  {
    platform: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

// 에디터 스키마
const EditorSchema = new Schema<IEditor>(
  {
    slug: { type: Number, unique: true, required: true },
    name: { type: String, required: true, trim: true },
    tagline: { type: String, required: true, trim: true },
    des: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    socialLinks: { type: [SocialLinkSchema], default: [] },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(doc, ret: any) {
        ret.id = ret._id;
        ret._id = undefined;
        return ret;
      }
    },
    toObject: {
      virtuals: true,
      transform(_doc, ret: any) {
        ret.id = ret._id;
        ret._id = undefined;
        return ret;
      },
    }
  }
);

// Auto-increment slug 생성 훅
EditorSchema.pre<IEditor>('validate', async function (next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'editorSlug' }, //레코드 찾고
      { $inc: { seq: 1 } }, // seq를 1증가
      { new: true, upsert: true } //upsert: true 없으면 새로 생성
    );
    this.slug = counter.seq; // 업데이트
  }
  next();
});

// 모델 생성
const Editor: Model<IEditor> = mongoose.models.Editor || mongoose.model<IEditor>('Editor', EditorSchema);
export default Editor;
