import { DEFAULT_BASE_DOMAIN } from '@app/utils/constants';
import { generateShortCode } from '@app/utils/generateShortCode';
import validator from 'validator';
import { shortenUrl } from './index';

jest.mock('@app/utils/generateShortCode');
jest.mock('validator');

describe('shortenUrl', () => {
  const mockGenerateShortCode = generateShortCode as jest.Mock;
  const mockIsURL = validator.isURL as jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should shorten a valid URL with the default base domain', () => {
    const originalUrl = 'http://example.com';
    const shortCode = 'mln542';
    mockGenerateShortCode.mockReturnValue(shortCode);
    mockIsURL.mockReturnValue(true);

    const result = shortenUrl(originalUrl);

    expect(result).toBe(`${DEFAULT_BASE_DOMAIN}/${shortCode}`);
    expect(mockGenerateShortCode).toHaveBeenCalledWith(originalUrl);
    expect(mockIsURL).toHaveBeenCalledWith(originalUrl);
  });

  it('should shorten a valid URL with a custom base domain', () => {
    const originalUrl = 'http://example.com';
    const customBaseDomain = 'http://short.com';
    const shortCode = 'mln542';
    mockGenerateShortCode.mockReturnValue(shortCode);
    mockIsURL.mockReturnValue(true);

    const result = shortenUrl(originalUrl, customBaseDomain);

    expect(result).toBe(`${customBaseDomain}/${shortCode}`);
    expect(mockGenerateShortCode).toHaveBeenCalledWith(originalUrl);
    expect(mockIsURL).toHaveBeenCalledWith(originalUrl);
  });

  it('should throw an error for an invalid URL', () => {
    const invalidUrl = 'invalid-url';
    mockIsURL.mockReturnValue(false);

    expect(() => shortenUrl(invalidUrl)).toThrow('Invalid URL.');
    expect(mockIsURL).toHaveBeenCalledWith(invalidUrl);
  });
});
