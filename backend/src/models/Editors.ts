import mongoose, { Schema, Document } from 'mongoose';

export interface IEditor extends Document {
  name: string;
  tagline: string;
  des: string;
  imageUrl: string;
  socialLinks: string[];
}

const EditorSchema = new Schema<IEditor>({
  name: { type: String, required: true },
  tagline: { type: String, required: true },
  des: { type: String },
  imageUrl: { type: String },
  socialLinks: [{ type: String }],
});

export default mongoose.model<IEditor>('Editor', EditorSchema);
