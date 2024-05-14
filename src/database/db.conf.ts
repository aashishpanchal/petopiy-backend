import mongoose from 'mongoose';
import { config } from '@/config';
import { format } from './plugins';

class Database {
  constructor() {
    // global plugins
    this.plugins();
  }

  private plugins() {
    mongoose.plugin(format); // remove  database
  }

  public async connect() {
    try {
      const instance = await mongoose.connect(config.DB_URL, {
        autoIndex: true,
      });
      // Close MongoDB server on exit
      process.on('SIGTERM', () => {
        instance.connection.close();
        process.exit(1);
      });
    } catch (error) {
      // Handle error
      console.error(error);
      process.exit(1);
    }
  }
}

export const db = new Database();
