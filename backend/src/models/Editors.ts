import mongoose, { Document, Schema, Model } from 'mongoose';

// 서브문서용 인터페이스 (소셜 링크)
export interface ISocialLink {
  platform: string;
  url: string;
}

// Editor 도큐먼트 인터페이스
export interface IEditor extends Document {
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
    name: { type: String, required: true, trim: true },
    tagline: { type: String, required: true, trim: true },
    des: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    socialLinks: { type: [SocialLinkSchema], default: [] },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    },
    toObject: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);

// 모델 생성
const Editor: Model<IEditor> = mongoose.models.Editor || mongoose.model<IEditor>('Editor', EditorSchema);
export default Editor;
