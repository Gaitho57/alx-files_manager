import { Router } from 'express'; // Import Router class for defining API routes
import AuthController from '../controllers/AuthController'; // Import the AuthController class
import authenticateToken from '../middleware/auth'; // Import the middleware for token authentication

const authRouter = Router(); // Create a new Express router instance

// Apply authentication middleware to all requests except '/connect'
authRouter.use('/disconnect', authenticateToken); // Exclude '/connect' from authentication

/**
 * @apiDefine XTokenHeader
 * @apiHeader {String} X-Token User's authentication token.
 * @apiHeaderExample Header-Example:
 *   "X-Token": "a57826f0-c383-4013-b29e-d18c2e68900d"
 */

/**
 * @apiDefine UnauthorizedError
 * @apiError Unauthorized Access Invalid or missing token.
 */

/**
 * API endpoint definition for GET /connect route.
 * Uses the `getConnect` method from the AuthController class to handle login requests.
 * This endpoint expects email and password in the request body.
 *
 * @typedef {import("express").Request} Request
 * @typedef {import("express").Response} Response
 *
 * @api {get} /connect User login
 * @apiName GetConnect
 * @apiGroup Authentication
 * @apiDescription Login to the system through this endpoint. Providing the correct credentials
 * generates a user token that can be used to access restricted endpoints.
 * The token is valid for a limited duration (details not specified here).
 * @apiBody {String} email User's email address.
 * @apiBody {String} password User's password.
 * @apiSuccess {String} token User authentication token upon successful login.
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "token": "a57826f0-c383-4013-b29e-d18c2e68900d"
 *   }
 */
authRouter.get('/connect', AuthController.getConnect);

/**
 * API endpoint definition for GET /disconnect route.
 * Uses the `getDisconnect` method from the AuthController class to handle logout requests.
 * This endpoint requires a valid user token in the `X-Token` header.
 *
 * @typedef {import("express").Request} Request
 * @typedef {import("express").Response} Response
 *
 * @api {get} /disconnect User logout
 * @apiName GetDisconnect
 * @apiGroup Authentication
 * @apiDescription Log out from the system through this endpoint. Your user token will be
 * invalidated after a successful logout, preventing further access to restricted endpoints.
 * @apiUse XTokenHeader
 * @apiUse UnauthorizedError
 */
authRouter.get('/disconnect', AuthController.getDisconnect);

export default authRouter;
