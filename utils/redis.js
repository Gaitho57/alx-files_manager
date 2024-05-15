import { createClient } from 'redis';

/**
 * RedisClient class for managing connections and interactions with a Redis server.
 */
class RedisClient {
  constructor() {
    this.client = createClient();
    this.isConnected = false; // Initially disconnected

    // Handle connection errors and successful connections
    this.client.on('error', (error) => {
      console.error('Redis connection error:', error.message || error.toString());
      this.isConnected = false;
    });

    this.client.on('connect', () => {
      console.log('Connected to Redis server');
      this.isConnected = true;
    });
  }

  /**
   * Checks if the connection to the Redis server is active.
   * @returns {boolean} - True if connected, false otherwise.
   */
  isAlive() {
    return this.isConnected;
  }

  /**
   * Retrieves the value associated with a given key from Redis.
   *
   * @param {string} key - The key of the item to retrieve.
   * @returns {Promise<string | Object | null>} - A promise that resolves to the 
   * retrieved value (string, object, or null if not found).
   */
  async get(key) {
    const getAsync = promisify(this.client.GET).bind(this.client);
    const value = await getAsync(key);
    return value === null ? null : value; // Handle potential null responses
  }

  /**
   * Stores a key-value pair in Redis with an optional expiration time.
   *
   * @param {string} key - The key of the item to store.
   * @param {string | number | boolean} value - The item to store.
   * @param {number} duration (optional) - The expiration time in seconds.
   * @returns {Promise<void>} - A promise that resolves after the operation is complete.
   */
  async set(key, value, duration) {
    if (duration) {
      await promisify(this.client.SETEX).bind(this.client)(key, duration, value);
    } else {
      await promisify(this.client.SET).bind(this.client)(key, value);
    }
  }

  /**
   * Removes the key-value pair associated with a given key from Redis.
   *
   * @param {string} key - The key of the item to remove.
   * @returns {Promise<number>} - A promise that resolves to the number of keys deleted (usually 1).
   */
  async del(key) {
    const deletedCount = await promisify(this.client.DEL).bind(this.client)(key);
    return deletedCount;
  }
}

export const redisClient = new RedisClient();
export default redisClient;
