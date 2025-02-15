import { generateHash } from '@app/utils/generateHash';
import * as bcrypt from 'bcrypt';

describe('generateHash', () => {
  it('should return a hashed password when a password is provided', () => {
    const password = 'testPassword';
    const hash = generateHash(password);
    expect(hash).not.toBeNull();
    expect(bcrypt.compareSync(password, hash!)).toBe(true);
  });

  it('should return null when no password is provided', () => {
    const hash = generateHash();
    expect(hash).toBeNull();
  });

  it('should generate different hashes for different passwords', () => {
    const password1 = 'password1';
    const password2 = 'password2';
    const hash1 = generateHash(password1);
    const hash2 = generateHash(password2);
    expect(hash1).not.toEqual(hash2);
  });

  it('should generate different hashes for the same password with different salts', () => {
    const password = 'samePassword';
    const hash1 = generateHash(password);
    const hash2 = generateHash(password);
    expect(hash1).not.toEqual(hash2);
  });
});
