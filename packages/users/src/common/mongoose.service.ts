import * as mongoose from 'mongoose';
import debug from 'debug';

const log = debug('app:mongodb');
const mongooseURL = process.env.MONGODB_URL || '';

class MongooseService {
  async connect() {
    mongoose.set('strictQuery', true);
    await mongoose.connect(mongooseURL);
    log('Connected');
  }

  async disconnect() {
    await mongoose.disconnect();
  }

  status() {
    mongoose.connection.on('connected', () => {
      log(
        `[Database] MongoDB Connected Successfully @Port: ${process.env.PORT}`
      );
    });

    mongoose.connection.on('error', (err) => {
      log(`[Database] MongoDB Error Occured. Error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      log(`[Database] MongoDB Disconnected`);
    });
  }

  getMongoose() {
    return mongoose;
  }
}

export default new MongooseService();
