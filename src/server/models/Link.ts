
import mongoose, { Schema, Document } from 'mongoose';
import shortid from 'shortid';

export interface ILink extends Document {
  originalUrl: string;
  shortUrl: string;
  customAlias?: string;
  userId: mongoose.Types.ObjectId;
  clicks: number;
  createdAt: Date;
  expirationDate?: Date;
  clickEvents: {
    timestamp: Date;
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
    location?: string;
  }[];
}

const LinkSchema: Schema = new Schema({
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true, default: shortid.generate },
  customAlias: { type: String, sparse: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  expirationDate: { type: Date },
  clickEvents: [{
    timestamp: { type: Date, default: Date.now },
    ipAddress: String,
    userAgent: String,
    referrer: String,
    location: String
  }]
});

export default mongoose.model<ILink>('Link', LinkSchema);
