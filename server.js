import express from 'express';
import router from './routes/index'; // Import the main route handler
import unmatchedRouteHandler from './middleware/unmatched'; // Import middleware for handling unmatched routes
import errorHandler from './middleware/error'; // Import middleware for error handling
import shutdown from './utils/shutdown'; // Import utility function for graceful shutdown

// Create an Express application instance
const app = express();

// Set the port number from environment variable or default to 5000
const port = process.env.PORT || 5000;

// Parse JSON and urlencoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount the main route handler
app.use(router);

// Middleware for handling unmatched routes (404 Not Found)
app.use(unmatchedRouteHandler);

// Global error handling middleware
app.use(errorHandler);

// Start the server and log a message
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Graceful shutdown functionality
const handleSignal = () => shutdown(server);
process.on('SIGINT', handleSignal); // Handle SIGINT (Ctrl+C)
process.on('SIGTERM', handleSignal); // Handle SIGTERM (termination signal)
process.on('SIGQUIT', handleSignal); // Handle SIGQUIT (quit signal)

export default app;

