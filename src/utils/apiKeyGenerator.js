/**
 * Generates a unique API key with a prefix and random string
 * @param {string} prefix - The prefix to use for the API key (default: 'mbaye')
 * @returns {string} The generated API key
 */
export function generateApiKey(prefix = 'mbaye') {
  const randomString = Math.random().toString(36).substring(2);
  const timestamp = Date.now().toString(36);
  return `${prefix}-${randomString}${timestamp}`;
} 