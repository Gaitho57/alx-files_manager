import fs from 'fs'; // File system module for file operations
import mime from 'mime-types'; // Module for determining file mime types
import Queue from 'bull'; // Job queue library for asynchronous tasks (thumbnail generation)
import { ObjectId } from 'mongodb'; // MongoDB object ID type

// Import utilities for interacting with database and other components
import dbClient from '../utils/db';
import FilesCollection from '../utils/files';
import AuthTokenHandler from '../utils/tokens';
import UsersCollection from '../utils/users';
import formatFileDocument from '../utils/format';

// Dedicated queue for thumbnail generation tasks
const fileQueue = Queue('thumbnail generation', { /* queue configuration options */ });

class FilesController {
  /**
   * Controller for handling file uploads (POST /files).
   * Creates a new file document in the database and stores the file data locally.
   *
   * @param {import("express").Request} req - The incoming Express request object.
   * @param {import("express").Response} res - The Express response object to send the response.
   */
  static async postUpload(req, res) {
    const userId = req.user._id; // Get user ID from the authenticated user

    // Create a new file document with user ID and other relevant information from the request body
    let fileDocument;
    try {
      fileDocument = await FilesCollection.createFile({ ...req.body, userId });
    } catch (err) {
      // Handle errors during file creation
      res.status(400).json({ error: err.message });
      return;
    }

    // Handle non-folder file types:
    if (fileDocument.type !== 'folder') {
      // Store file data in the local storage path specified in the file document
      FilesCollection.storeFileData(fileDocument.localPath, req.body.data);

      // Add a job to the queue for generating a thumbnail for the uploaded file
      const jobData = { fileId: fileDocument._id, userId };
      fileQueue.add(jobData); // Add the job to the queue asynchronously
    }

    // Send a successful response with the formatted file document information
    res.status(201).json(formatFileDocument(fileDocument));
  }

  /**
   * Controller for retrieving file information by ID (GET /files/:id).
   *
   * @param {import("express").Request} req - The incoming Express request object.
   * @param {import("express").Response} res - The Express response object to send the response.
   */
  static async getShow(req, res) {
    const userId = req.user._id; // Get user ID from the authenticated user
    const { id } = req.params;

    // Convert request parameter ID to a valid MongoDB Object ID
    const _id = ObjectId.isValid(id) ? new ObjectId(id) : id;

    // Retrieve the file document from the database based on ID and user ID
    const fileDocument = await FilesCollection.getFile({ _id, userId });

    // Handle file not found case
    if (!fileDocument) {
      return res.status(404).json({ error: 'Not found' });
    }

    // Format the file document for the response
    const formattedResponse = formatFileDocument(fileDocument);

    // Send a successful response with the formatted file information
    return res.status(200).json(formattedResponse);
  }

  /**
   * Controller for retrieving a list of a user's files (GET /files).
   * Uses aggregation pipeline to efficiently retrieve files with pagination.
   *
   * @param {import("express").Request} req - The incoming Express request object.
   * @param {import("express").Response} res - The Express response object to send the response.
   */
  static async getIndex(req, res) {
    const MAX_PAGE_SIZE = 20; // Maximum number of files per page

    // Access the files collection from the database client
    const FilesCollection = dbClient.getCollection('files');

    const userId = req.user._id; // Get user ID from the authenticated user

    // Extract query parameters for parent ID and page number
    const { parentId = '0', page = 0 } = req.query;

    // Convert parent ID to a valid MongoDB Object ID (if provided)
    const _parentId = parentId && ObjectId.isValid(parentId) ? new ObjectId(parentId) : parentId;
