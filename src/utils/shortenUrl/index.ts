import { generateShortCode } from '@app/utils/generateShortCode';
import { getFullDomain } from '@app/utils/getFullDomain';
import { Request } from 'express';
import validator from 'validator';

/**
 * Shortens a given URL by generating a unique 6-character code.
 * @param originalUrl The full URL to be shortened
 * @param baseDomain The base domain of the shortener (default: "http://localhost")
 * @returns The shortened URL in the format "baseDomain/code"
 */
export const shortenUrl = (request: Request, originalUrl: string): string => {
  if (!validator.isURL(originalUrl)) {
    throw new Error('Invalid URL.');
  }

  const shortCode = generateShortCode(originalUrl);

  const fullDomain = getFullDomain(request);

  return `${fullDomain}/${shortCode}`;
};
