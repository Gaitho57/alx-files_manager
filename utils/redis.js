import redis from 'redis';

class RedisClient {
  constructor(options = {}) {
    // Handle configuration options for flexibility
    this.client = redis.createClient(options);

    this.client.on('error', (error) => {
      console.error('Redis error:', error);
    });
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    try {
      const reply = await this.client.get(key);
      return reply;
    } catch (error) {
      console.error('Error getting key:', key, error);
      throw error; // Re-throw for potential handling in calling code
    }
  }

  async set(key, value, duration) {
    try {
      await this.client.setex(key, duration, value);
    } catch (error) {
      console.error('Error setting key:', key, error);
      throw error; // Re-throw for potential handling in calling code
    }
  }

  async del(key) {
    try {
      const deletedCount = await this.client.del(key);
      return deletedCount === 1; // Return true only if 1 key was deleted
    } catch (error) {
      console.error('Error deleting key:', key, error);
      throw error; // Re-throw for potential handling in calling code
    }
  }
}

const redisClient = new RedisClient();
export default redisClient;
