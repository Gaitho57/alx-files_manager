// Import necessary modules
import dbClient from '../utils/db'; // Database client
import redisClient from '../utils/redis'; // Redis client

class AppController {
  /**
   * Controller for the `/status` endpoint.
   * Retrieves and responds with the connection status of the MongoDB and Redis clients.
   *
   * @param {import("express").Request} _req - The incoming Express request object (unused).
   * @param {import("express").Response} res - The Express response object to send the response.
   */
  static async getStatus(_req, res) {
    // Check if both database and cache clients are alive (connected)
    if (dbClient.isAlive() && redisClient.isAlive()) {
      // Send a successful response (status code 200) with connection status information
      res.status(200).json({ redis: true, db: true });
    } else {
      // If either client is not alive, handle the error appropriately
      // (consider logging the error or returning a more informative response)
      console.error('Error: Database or Redis client is not alive!');
      res.status(500).json({ error: 'Internal server error' }); // Example error response
    }
  }

  /**
   * Controller for the `/stats` endpoint.
   * Retrieves and responds with the count of users and files from the database.
   *
   * @param {import("express").Request} _req - The incoming Express request object (unused).
   * @param {import("express").Response} res - The Express response object to send the response.
   * @param {import("express").NextFunction} next - Express next function for error handling.
   */
  static async getStats(_req, res, next) {
    try {
      // Retrieve the number of users from the database
      const users = await dbClient.nbUsers();

      // Retrieve the number of files from the database
      const files = await dbClient.nbFiles();

      // Send a successful response (status code 200) with user and file counts
      res.status(200).json({ users, files });
    } catch (err) {
      // Handle potential errors during data retrieval
      console.error('Error retrieving stats:', err);
      next(err); // Pass the error to the Express error handler
    }
  }
}

export default AppController;
