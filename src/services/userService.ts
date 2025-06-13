// Simulating API calls with types and placeholders for actual implementation

interface User {
  uid: string;
  displayName: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  photoURL?: string;
}

// Simulated users database
const USERS_DB: Record<string, User> = {
  'admin123': {
    uid: 'admin123',
    displayName: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: '2023-01-01T00:00:00Z'
  },
  'user456': {
    uid: 'user456',
    displayName: 'Regular User',
    email: 'user@example.com',
    role: 'user',
    createdAt: '2023-01-02T00:00:00Z'
  }
};

/**
 * Create a new user in the database
 */
export const createUser = async (userData: User): Promise<User> => {
  // In real implementation, this would call the backend API
  console.log('Creating user:', userData);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Add to simulated database
  USERS_DB[userData.uid] = userData;
  
  return userData;
};

/**
 * Get user by ID
 */
export const getUserById = async (uid: string): Promise<User | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return USERS_DB[uid] || null;
};

/**
 * Get user role
 */
export const getUserRole = async (uid: string): Promise<'admin' | 'user'> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return USERS_DB[uid]?.role || 'user';
};

/**
 * Update user profile
 */
export const updateUserProfile = async (uid: string, data: Partial<User>): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  if (!USERS_DB[uid]) {
    throw new Error('User not found');
  }
  
  USERS_DB[uid] = { ...USERS_DB[uid], ...data };
  return USERS_DB[uid];
};

/**
 * Get all users (admin only)
 */
export const getAllUsers = async (): Promise<User[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return Object.values(USERS_DB);
};