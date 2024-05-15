import UsersCollection from '../utils/users'; // Imports functionality for interacting with the user collection
import AuthTokenHandler from '../utils/tokens'; // Handles generation and validation of authentication tokens
import PasswordHandler from '../utils/passwords'; // Provides secure password hashing and comparison

class AuthController {
  /**
   * Controller for the `/connect` endpoint (GET request).
   * Handles user authorization using Basic Authentication scheme.
   *
   * @param {import("express").Request} req - The incoming Express request object.
   * @param {import("express").Response} res - The Express response object to send the response.
   */
  static async getConnect(req, res) {
    // 1. Check for Authorization Header:
    // - If the request doesn't contain the 'Authorization' header, it means the user didn't provide any credentials.
    // - Return a 401 Unauthorized response with an error message.
    const authParams = req.get('Authorization');
    if (!authParams) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // 2. Extract User Credentials:
    // - Extract the base64 encoded credentials from the 'Authorization' header (removing the 'Basic' prefix).
    // - Decode the base64 string into an ASCII string using Buffer.
    // - Split the decoded string on the colon (':') to separate username and password.
    // - Store the extracted username and password in variables (handling potential missing values).
    const credentials = Buffer.from(authParams.replace('Basic ', ''), 'base64').toString('ascii').split(':');
    const email = credentials[0] || ''; // Email address (empty string if not provided)
    const password = credentials[1] || ''; // Password (empty string if not provided)

    // 3. Validate User Existence:
    // - Use the UsersCollection utility to search for a user with the provided email address.
    // - If no user is found, return a 401 Unauthorized response with an error message.
    const user = await UsersCollection.getUser({ email });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // 4. Verify Password:
    // - Use the PasswordHandler utility to compare the provided password with the hashed password stored in the user object.
    // - If the passwords don't match, return a 401 Unauthorized response with an error message.
    if (!PasswordHandler.isPasswordValid(password, user.password)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // 5. Generate and Return Authentication Token:
    // - Use the AuthTokenHandler utility to create an authentication token for the validated user.
    // - On successful token creation, send a 200 OK response with the generated token in the response body.
    const token = await AuthTokenHandler.createAuthToken(user);
    return res.status(200).json({ token });
  }

  /**
   * Controller for the `/disconnect` endpoint (GET request).
   * Handles user logout by deleting the associated authentication token.
   *
   * @param {import("express").Request} req - The incoming Express request object.
   * @param {import("express").Response} res - The Express response object to send the response.
   */
  static async getDisconnect(req, res) {
    // 1. Extract Authentication Token:
    // - Get the authentication token from the 'X-Token' header of the request.
    const token = req.get('X-Token');

    // 2. Validate Token:
    // - Use the AuthTokenHandler utility to verify if a valid user is associated with the provided token.
    // - If the token is invalid or not found, return a 401 Unauthorized response with an error message.
    if (!await AuthTokenHandler.getUserByToken(token)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // 3. Delete Authentication Token:
    // - Use the AuthTokenHandler utility to delete the validated token.
    await AuthTokenHandler.deleteAuthToken(token);

    // 4. Send Logout Response:
    // - Send a 204 No Content response to indicate successful logout (no response body needed).
    res.status(204).json();
