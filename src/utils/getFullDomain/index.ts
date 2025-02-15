import { Request } from 'express';

/**
 * Constructs the full domain URL from the given request object.
 *
 * @param {Request} request - The request object containing protocol and host information.
 * @returns {string} The full domain URL in the format `protocol://host`.
 */
export const getFullDomain = (request: Request) => {
  return `${request.protocol}://${request.get('host')}`;
};
