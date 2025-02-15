import { generateShortCode } from './';

describe('generateShortCode', () => {
  it('should generate a 6-character short code for a valid URL', () => {
    const url = 'https://example.com';
    const shortCode = generateShortCode(url);
    expect(shortCode).toHaveLength(6);
  });

  it('should throw an error if the URL is empty', () => {
    expect(() => generateShortCode('')).toThrow('Invalid URL.');
  });

  it('should generate consistent short codes for the same URL', () => {
    const url = 'https://example.com';
    const shortCode1 = generateShortCode(url);
    const shortCode2 = generateShortCode(url);
    expect(shortCode1).toBe(shortCode2);
  });

  it('should generate different short codes for different URLs', () => {
    const url1 = 'https://example.com';
    const url2 = 'https://example.org';
    const shortCode1 = generateShortCode(url1);
    const shortCode2 = generateShortCode(url2);
    expect(shortCode1).not.toBe(shortCode2);
  });
});
