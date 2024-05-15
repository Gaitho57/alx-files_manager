import redis from '../utils/redis'; // Import the Redis client (assuming renamed from redisClient)
import db from '../utils/db'; // Import the database client (assuming renamed from dbClient)

/**
 * AppController class for handling application-level requests.
 */
export default class AppController {
  /**
   * Retrieves the health status of the application.
   *
   * @param {express.Request} req - The incoming request object.
   * @param {express.Response} res - The outgoing response object.
   * @returns {void} - Sends a JSON response with the status of Redis and the database.
   */
  static async getStatus(req, res) {
    const redisStatus = await redis.isAlive(); // Check Redis health (assuming method exists)
    const dbStatus = await db.isAlive(); // Check database health (assuming method exists)

    res.status(200).json({
      redis: redisStatus,
      db: dbStatus,
    });
  }

  /**
   * Retrieves application statistics about users and files.
   *
   * @param {express.Request} req - The incoming request object.
   * @param {express.Response} res - The outgoing response object.
   * @returns {void} - Sends a JSON response with the number of users and files.
   */
  static async getStats(req, res) {
    try {
      const [usersCount, filesCount] = await Promise.all([db.nbUsers(), db.nbFiles()]);
      res.status(200).json({ users: usersCount, files: filesCount });
    } catch (error) {
      // Handle potential errors during data retrieval (implementation omitted here)
      console.error('Error fetching application stats:', error);
      res.status(500).json({ error: 'Failed to retrieve application statistics' });
    }
  }
}
