export interface User {
  id: string;
  clientNumber: string;
  passwordHash: string; // For storing hashed passwords
  // Add other user-related fields here
}

export const MOCK_USERS: User[] = [
  { id: '1', clientNumber: '12345678', passwordHash: 'hashed_password_1' }, // Replace with actual hashing later
  { id: '2', clientNumber: '87654321', passwordHash: 'hashed_password_2' },
];
