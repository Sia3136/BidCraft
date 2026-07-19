const sizeOf = require('image-size');

const MAX_WIDTH = 4096;
const MAX_HEIGHT = 4096;

/**
 * Validates an image buffer for magic bytes, decodability, and dimensions.
 * @param {Buffer} buffer - The file buffer to validate
 * @returns {{ valid: boolean, reason?: string }}
 */
function validateImageFile(buffer) {
  try {
    if (!buffer || !Buffer.isBuffer(buffer)) {
      return { valid: false, reason: 'Empty or invalid buffer' };
    }

    // 1. Check magic bytes and basic decodability (header parsing)
    const dimensions = sizeOf(buffer);
    
    // 2. Reject unsupported animated formats to prevent GIF bombs
    if (dimensions.type === 'gif') {
      return { valid: false, reason: 'GIF images are not supported' };
    }
    
    // 3. Enforce maximum dimensions
    if (!dimensions.width || !dimensions.height) {
      return { valid: false, reason: 'Unable to determine image dimensions' };
    }
    
    if (dimensions.width > MAX_WIDTH || dimensions.height > MAX_HEIGHT) {
      return { valid: false, reason: `Image exceeds maximum dimensions of ${MAX_WIDTH}x${MAX_HEIGHT}` };
    }
    
    return { valid: true };
  } catch (err) {
    // 4. Fail closed on malformed, unknown, or corrupted files
    return { valid: false, reason: 'File is malformed or not a valid image format' };
  }
}

module.exports = { validateImageFile };
