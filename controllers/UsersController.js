import Queue from 'bull'; // Job queue library for asynchronous tasks (sending welcome emails)
import UsersCollection from '../utils/users'; // Utility for interacting with the user collection

// Dedicated queue for sending welcome emails to new users
const userQueue = Queue('send welcome email', { /* queue configuration options */ });

class UsersController {
  /**
   * Controller for creating new users (POST /users).
   * Handles user registration by creating a new user document in the database
   * and adding a job to the queue for sending a welcome email.
   *
   * @param {import("express").Request} req - The incoming Express request object.
   * @param {import("express").Response} res - The Express response object to send the response.
   */
  static async postNew(req, res) {
    const { email, password } = req.body; // Extract email and password from request body

    // Validate required fields: email and password
    if (email === undefined) {
      res.status(400).json({ error: 'Missing email' });
      return;
    } else if (password === undefined) {
      res.status(400).json({ error: 'Missing password' });
      return;
    }

    // Check for existing user with the same email address
    if (await UsersCollection.getUser({ email })) {
      res.status(400).json({ error: 'Already exists' });
      return;
    }

    // Create a new user document in the database
    const userId = await UsersCollection.createUser(email, password);

    // Add a job to the queue for sending a welcome email to the newly created user
    userQueue.add({ userId }); // Asynchronously add the job to the queue

    // Send a successful response with the user ID and email
    res.status(201).json({ id: userId, email });
  }
}

export default UsersController;
