import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}`;

    this.isConnected = false; // Flag to track connection status

    (async () => {
      try {
        const client = await MongoClient.connect(url, { useUnifiedTopology: true });
        this.db = client.db(database);
        this.isConnected = true;
      } catch (error) {
        console.error('Error connecting to MongoDB:', error);
      }
    })();
  }

  isAlive() {
    return this.isConnected;
  }

  async nbUsers() {
    if (!this.isConnected) {
      throw new Error('Not connected to MongoDB');
    }
    return this.db.collection('users').countDocuments();
  }

  async nbFiles() {
    if (!this.isConnected) {
      throw  new Error('Not connected to MongoDB');
    }
    return this.db.collection('files').countDocuments();
  }
}

export default new DBClient();
