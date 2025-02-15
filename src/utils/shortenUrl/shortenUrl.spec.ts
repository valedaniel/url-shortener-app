import { generateShortCode } from '@app/utils/generateShortCode';
import { getFullDomain } from '@app/utils/getFullDomain';
import { Request } from 'express';
import validator from 'validator';
import { shortenUrl } from './index';

jest.mock('@app/utils/generateShortCode');
jest.mock('@app/utils/getFullDomain');
jest.mock('validator');

describe('shortenUrl', () => {
  let request: Request;

  beforeEach(() => {
    request = {} as Request;
  });

  it('should throw an error if the URL is invalid', () => {
    (validator.isURL as jest.Mock).mockReturnValue(false);

    expect(() => shortenUrl(request, 'invalid-url')).toThrow('Invalid URL.');
  });

  it('should return the shortened URL if the URL is valid', () => {
    const originalUrl = 'http://example.com';
    const shortCode = 'abc123';
    const fullDomain = 'http://localhost';

    (validator.isURL as jest.Mock).mockReturnValue(true);
    (generateShortCode as jest.Mock).mockReturnValue(shortCode);
    (getFullDomain as jest.Mock).mockReturnValue(fullDomain);

    const result = shortenUrl(request, originalUrl);

    expect(result).toBe(`${fullDomain}/${shortCode}`);
    expect(validator.isURL).toHaveBeenCalledWith(originalUrl);
    expect(generateShortCode).toHaveBeenCalledWith(originalUrl);
    expect(getFullDomain).toHaveBeenCalledWith(request);
  });
});
