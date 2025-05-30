import { Injectable } from '@nestjs/common';
import { MOCK_USERS, User } from '../users/entities/user.entity'; // Adjust path as needed

@Injectable()
export class AuthService {
  // In a real app, you would inject a UsersService to find the user
  // and a hashing service (like bcrypt) to compare passwords.
  // For now, we'll do a direct lookup and plain text comparison (NOT FOR PRODUCTION).

  async validateUser(clientNumber: string, pass: string): Promise<Omit<User, 'passwordHash'> | null> {
    const user = MOCK_USERS.find(u => u.clientNumber === clientNumber);

    // IMPORTANT: This is a placeholder for password validation.
    // In a real application, NEVER store plain text passwords and always use a secure hashing algorithm (e.g., bcrypt).
    // For this mock, we'll simulate a check against a 'supposedly' hashed password.
    // Let's assume 'password_1' for user '12345678' and 'password_2' for '87654321' for simplicity.
    // And the mock passwordHash in user.entity.ts would be the hashed versions of these.
    // For this step, we'll just check if the user exists and if the provided password matches a predefined mock password.

    let isValidPassword = false;
    if (user && user.clientNumber === '12345678' && pass === 'password_1') { // Mock password for user 1
        isValidPassword = true;
    } else if (user && user.clientNumber === '87654321' && pass === 'password_2') { // Mock password for user 2
        isValidPassword = true;
    }


    if (user && isValidPassword) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }
}
