import mongooseService from '../common/mongoose.service';
import LogModel, { ILog } from '../models/log.model';
import { CreateLogInput } from '../schemas/analytics.schema';
import { HydratedDocument } from 'mongoose';
import debug from 'debug';

const debugLog = debug('app:analytics:service');
class AnalyticsService {
  async getLogs(): Promise<ILog[]> {
    const session = await mongooseService.getMongoose().startSession();
    debugLog('Starting transaction');
    session.startTransaction();
    const logs = await LogModel.find({}).sort({ createdAt: -1 });
    await session.commitTransaction();
    debugLog('finishing session');
    await session.endSession();
    return logs;
  }

  async addLog(createLogInput: CreateLogInput): Promise<void> {
    debugLog('Creating Log');
    const session = await mongooseService.getMongoose().startSession();
    debugLog('Starting transaction');
    session.startTransaction();
    const log: HydratedDocument<ILog> = new LogModel({
      requestUserId: createLogInput.requestUserId,
      action: createLogInput.action,
      description: createLogInput.description,
      payload: createLogInput.payload,
    });
    debugLog('Saving log');
    await log.save();
    debugLog('Committing transaction');
    await session.commitTransaction();
    debugLog('Finishing session');
    await session.endSession();
    return;
  }
}

export default new AnalyticsService();
