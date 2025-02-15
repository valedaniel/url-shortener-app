import { Request } from 'express';
import { getFullDomain } from './';

describe('getFullDomain', () => {
  it('should return the full domain URL', () => {
    const mockRequest = {
      protocol: 'http',
      get: (header: string) => {
        if (header === 'host') {
          return 'localhost:3000';
        }
        return '';
      },
    } as Request;

    const result = getFullDomain(mockRequest);
    expect(result).toBe('http://localhost:3000');
  });

  it('should handle https protocol', () => {
    const mockRequest = {
      protocol: 'https',
      get: (header: string) => {
        if (header === 'host') {
          return 'example.com';
        }
        return '';
      },
    } as Request;

    const result = getFullDomain(mockRequest);
    expect(result).toBe('https://example.com');
  });

  it('should handle different hosts', () => {
    const mockRequest = {
      protocol: 'http',
      get: (header: string) => {
        if (header === 'host') {
          return 'mydomain.com';
        }
        return '';
      },
    } as Request;

    const result = getFullDomain(mockRequest);
    expect(result).toBe('http://mydomain.com');
  });
});
