import { Document, Schema, model } from 'mongoose';
import LogType from '../types/logType.type';

export interface ILog extends Document {
  requestUserId: string;
  action: LogType;
  description: string;
  payload: string;
}

const logSchema = new Schema<ILog>({
  requestUserId: { type: String, required: true },
  action: { type: String, enum: LogType, required: true },
  description: { type: String, required: true },
  payload: { type: String, required: true, default: '' },
});

export default model('Log', logSchema);
