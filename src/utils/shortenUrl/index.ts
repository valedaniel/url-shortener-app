import { DEFAULT_BASE_DOMAIN } from '@app/utils/constants';
import { generateShortCode } from '@app/utils/generateShortCode';
import validator from 'validator';

/**
 * Shortens a given URL by generating a unique 6-character code.
 * @param originalUrl The full URL to be shortened
 * @param baseDomain The base domain of the shortener (default: "http://localhost")
 * @returns The shortened URL in the format "baseDomain/code"
 */
export const shortenUrl = (
  originalUrl: string,
  baseDomain: string = DEFAULT_BASE_DOMAIN,
): string => {
  if (!validator.isURL(originalUrl)) {
    throw new Error('Invalid URL.');
  }

  const shortCode = generateShortCode(originalUrl);

  return `${baseDomain}/${shortCode}`;
};
