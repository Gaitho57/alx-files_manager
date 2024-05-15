/**
 * Formats a document from the 'files' collection into a response object.
 *
 * @param {Object} document - The document object retrieved from the database.
 * @returns {Object} - The formatted response object with desired properties.
 */
export default function formatFileDocument(document) {
  // Destructure desired properties from the document
  const { _id, name, type, isPublic, userId, parentId } = document;

  // Convert the ObjectId to a string for consistency with the response format
  const id = _id.toString();

  // Handle potential ObjectId type for parentId
  parentId = parentId instanceof ObjectId ? parentId.toString() : parentId;

  // Create the formatted response document
  const formattedResponseDocument = {
    id,
    userId,
    name,
    type,
    isPublic,
    parentId,
  };

  return formattedResponseDocument;
}
