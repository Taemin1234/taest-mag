import mongoose, { Schema, Document } from 'mongoose';

export interface IEditor extends Document {
  name: string;
  shortDesc: string;
  longDesc: string;
  imageUrl: string;
  socialLinks: string[];
}

const EditorSchema = new Schema<IEditor>({
  name: { type: String, required: true },
  shortDesc: { type: String, required: true },
  longDesc: { type: String },
  imageUrl: { type: String },
  socialLinks: [{ type: String }],
});

export default mongoose.model<IEditor>('Editor', EditorSchema);
