import * as crypto from 'crypto';

/**
 * Generates a short code from a given URL.
 *
 * This function takes a URL as input, creates a SHA-256 hash of the URL,
 * encodes the hash in base64url format, and then slices the first 6 characters
 * of the encoded string to produce a short code.
 *
 * @param url - The URL to generate a short code for.
 * @returns A 6-character short code derived from the input URL.
 */
export const generateShortCode = (url: string): string => {
  if (!url) {
    throw new Error('Invalid URL.');
  }

  const hash = crypto.createHash('sha256').update(url).digest();
  return BigInt('0x' + hash.toString('hex'))
    .toString(36)
    .slice(0, 6);
};
