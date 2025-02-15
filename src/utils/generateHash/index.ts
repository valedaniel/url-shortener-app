import * as bcrypt from 'bcrypt';

/**
 * Generates a hashed version of the provided password using bcrypt.
 *
 * @param password - The password to be hashed. If no password is provided, the function returns null.
 * @returns The hashed password if a password is provided, otherwise null.
 */
export const generateHash = (password?: string) => {
  if (password) {
    const salt = bcrypt.genSaltSync(15);
    return bcrypt.hashSync(password, salt);
  }
  return null;
};
