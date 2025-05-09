/**
 * Represents a user in the system.
 */
export interface User {
  /**
   * The unique identifier of the user.
   */
  id: string;
  /**
   * The email address of the user.
   */
  email: string;
  /**
   * The username of the user.
   */
  username: string;
}

/**
 * Asynchronously retrieves a user by their email address.
 *
 * @param email The email address of the user to retrieve.
 * @returns A promise that resolves to a User object if found, or null if not found.
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  // TODO: Implement this by calling an API.

  return {
    id: '123',
    email: email,
    username: 'testuser',
  };
}
