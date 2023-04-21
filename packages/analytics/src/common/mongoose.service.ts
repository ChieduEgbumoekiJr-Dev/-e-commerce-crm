import * as mongoose from 'mongoose';

const mongooseURL = process.env.MONGODB_URL || '';

class MongooseService {
  async connect() {
    mongoose.set('strictQuery', true);
    await mongoose.connect(mongooseURL);
    console.log('Connected');
  }

  async disconnect() {
    await mongoose.disconnect();
  }

  status() {
    mongoose.connection.on('connected', () => {
      console.log(
        `[Database] MongoDB Connected Successfully @Port: ${process.env.PORT}`
      );
    });

    mongoose.connection.on('error', (err) => {
      console.log(`[Database] MongoDB Error Occured. Error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log(`[Database] MongoDB Disconnected`);
    });
  }

  getMongoose() {
    return mongoose;
  }
}

export default new MongooseService();
