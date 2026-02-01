/**
 * Mock Authentication Service for Development
 * This simulates authentication without a real backend
 */

const MOCK_USERS = [
  {
    id: '1',
    name: 'Demo User',
    email: 'demo@example.com',
    password: 'demo123', // In production, never store passwords like this!
  },
  {
    id: '2',
    name: 'Test User',
    email: 'test@example.com',
    password: 'test123',
  },
];

const AUTH_KEY = 'mock_auth_user';

/**
 * Simulate API delay
 */
function delay(ms = 300) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get current authenticated user from localStorage
 */
function getStoredUser() {
  const stored = localStorage.getItem(AUTH_KEY);
  return stored ? JSON.parse(stored) : null;
}

/**
 * Store authenticated user in localStorage
 */
function storeUser(user) {
  const { password, ...userWithoutPassword } = user;
  localStorage.setItem(AUTH_KEY, JSON.stringify(userWithoutPassword));
}

/**
 * Remove authenticated user from localStorage
 */
function clearUser() {
  localStorage.removeItem(AUTH_KEY);
}

/**
 * Mock login function
 */
export async function mockLogin(email, password) {
  await delay(); // Simulate network delay

  const user = MOCK_USERS.find(u => u.email === email && u.password === password);

  if (!user) {
    throw new Error('Invalid email or password');
  }

  storeUser(user);

  const { password: _, ...userWithoutPassword } = user;
  return {
    user: userWithoutPassword,
    message: 'Login successful',
  };
}

/**
 * Mock register function
 */
export async function mockRegister(name, email, password) {
  await delay();

  // Check if user already exists
  const exists = MOCK_USERS.find(u => u.email === email);
  if (exists) {
    throw new Error('Email already registered');
  }

  // Create new user
  const newUser = {
    id: String(MOCK_USERS.length + 1),
    name,
    email,
    password,
  };

  MOCK_USERS.push(newUser);
  storeUser(newUser);

  const { password: _, ...userWithoutPassword } = newUser;
  return {
    user: userWithoutPassword,
    message: 'Registration successful',
  };
}

/**
 * Mock logout function
 */
export async function mockLogout() {
  await delay(100);
  clearUser();
  return { message: 'Logout successful' };
}

/**
 * Mock check auth function
 */
export async function mockCheckAuth() {
  await delay(100);
  const user = getStoredUser();
  return !!user;
}

/**
 * Mock get current user function
 */
export async function mockGetCurrentUser() {
  await delay(100);
  return getStoredUser();
}

/**
 * Helper to check if mock mode is enabled
 */
export function isMockMode() {
  return localStorage.getItem('USE_MOCK_AUTH') === 'true';
}

/**
 * Enable mock mode
 */
export function enableMockMode() {
  localStorage.setItem('USE_MOCK_AUTH', 'true');
  console.log('🎭 Mock authentication enabled');
  console.log('📧 Available demo accounts:');
  console.log('   - demo@example.com / demo123');
  console.log('   - test@example.com / test123');
}

/**
 * Disable mock mode
 */
export function disableMockMode() {
  localStorage.removeItem('USE_MOCK_AUTH');
  clearUser();
  console.log('🔌 Mock authentication disabled');
}
