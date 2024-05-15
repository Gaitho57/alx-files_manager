import { v4 } from 'uuid'; // Import UUID generation library
import redisClient from './redis'; // Import the Redis client instance

// Auth token handler class
class AuthTokenHandler {
  /**
   * Creates a new authentication token for a given user.
   *
   * @param {Object} user - User object containing relevant user data.
   * @param {number} duration (optional) - Duration of the token in seconds. Defaults to 24 hours.
   * @returns {Promise<string>} - A promise that resolves to the generated token string.
   */
  static async createAuthToken(user, duration = 60 * 60 * 24) {
    const token = v4(); // Generate a unique token using UUID
    await redisClient.set(`auth_${token}`, user._id.toString(), duration); // Store user ID in Redis with key prefixed by "auth_"
    return token;
  }

  /**
   * Retrieves the user object associated with a given authentication token.
   *
   * @param {string} token - The authentication token to look up.
   * @returns {Promise<string | null>} - A promise that resolves to the user ID string if found, or null if not found.
   */
  static async getUserByToken(token) {
    const userId = await redisClient.get(`auth_${token}`); // Retrieve user ID from Redis using prefixed key
    return userId;
  }

  /**
   * Deletes an authentication token from the Redis store.
   *
   * @param {string} token - The authentication token to delete.
   * @returns {Promise<number>} - A promise that resolves to the number of keys deleted (usually 1).
   */
  static async deleteAuthToken(token) {
    const deletedCount = await redisClient.del(`auth_${token}`); // Delete token key from Redis
    return deletedCount;
  }
}

export default AuthTokenHandler;
