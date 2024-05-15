import { Router } from 'express'; // Import Router class for defining API routes
import AppController from '../controllers/AppController'; // Import the AppController class

const appRouter = Router(); // Create a new Express router instance

/**
 * API endpoint definition for GET /status route.
 * Uses the `getStatus` method from the AppController class to handle the request.
 *
 * @typedef {import("express").Request} Request
 * @typedef {import("express").Response} Response
 *
 * This endpoint retrieves the connection status of the database and Redis client.
 * A successful response includes a JSON object with `db` and `redis` properties,
 * each indicating the connection status (true for connected, false for disconnected).
 *
 * @api {get} /status Get database and Redis client status
 * @apiName GetStatus
 * @apiGroup Status
 * @apiDescription This endpoint returns the status of the MongoDB database client and Redis client.
 * `true` means that the specific client is connected while `false` indicates failure to connect.
 * @apiSuccess {Boolean} db Database client connection status
 * @apiSuccess {Boolean} redis Redis client connection status
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "db": true,
 *     "redis": true
 *   }
 */
appRouter.get('/status', AppController.getStatus);

/**
 * API endpoint definition for GET /stats route.
 * Uses the `getStats` method from the AppController class to handle the request.
 *
 * @typedef {import("express").Request} Request
 * @typedef {import("express").Response} Response
 *
 * This endpoint retrieves the number of users and files stored in the database.
 * A successful response includes a JSON object with `users` and `files` properties,
 * representing the respective counts.
 *
 * @api {get} /stats Gets number of users and files
 * @apiName GetStats
 * @apiGroup Stats
 * @apiDescription This endpoint retrieves number of users and files.
 * @apiSuccess {Number} users Number of users in the database
 * @apiSuccess {Number} files Number of files in the database
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "users": 78,
 *     "files": 1112
 *   }
 */
appRouter.get('/stats', AppController.getStats);

export default appRouter;
