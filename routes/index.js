import { Router } from 'express'; // Import Router class for defining API routes

// Import individual route handlers
import appRouter from './app'; // Import routes for general application endpoints
import authRouter from './auth'; // Import routes for authentication
import usersRouter from './users'; // Import routes for user management
import filesRouter from './files'; // Import routes for file management

// Create the main router instance
const router = Router();

// Mount sub-routers at specific paths
router.use('/', appRouter); // Mount app routes at the root path (`/`)
router.use('/auth', authRouter); // Mount auth routes under the `/auth` path
router.use('/users', usersRouter); // Mount user routes under the `/users` path
router.use('/files', filesRouter); // Mount file routes under the `/files` path

export default router;
