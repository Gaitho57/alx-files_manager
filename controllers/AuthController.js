import { v4 as uuidv4 } from 'uuid'; // Import UUID generation function
import redisClient from '../utils/redis'; // Import the Redis client instance

/**
 * AuthController class for handling authentication-related requests.
 */
export default class AuthController {
  /**
   * Generates and issues an authentication token for a logged-in user.
   *
   * @param {express.Request} req - The incoming request object.
   * @param {express.Response} res - The outgoing response object.
   * @returns {Promise<void>} - Sends a JSON response with the generated token.
   */
  static async getConnect(req, res) {
    const { user } = req; // Assuming user data is available in the request object

    const token = uuidv4(); // Generate a unique token using UUID v4

    await redisClient.set(`auth_${token}`, user._id.toString(), 24 * 60 * 60); // Store user ID in Redis with prefixed key, set expiry to 24 hours

    res.status(200).json({ token });
  }

  /**
   * Deletes an authentication token associated with a request header.
   *
   * @param {express.Request} req - The incoming request object.
   * @param {express.Response} res - The outgoing response object.
   * @returns {Promise<void>} - Sends an empty response (204 No Content) on successful deletion.
   */
  static async getDisconnect(req, res) {
    const token = req.headers['x-token']; // Retrieve token from the "x-token" header

    await redisClient.del(`auth_${token}`); // Delete token key from Redis

    res.status(204).send(); // Send an empty response to indicate successful deletion
  }
}
