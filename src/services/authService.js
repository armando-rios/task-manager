import { apiRequest } from './api.js';
import { ENDPOINTS } from '../utils/constants.js';

let cachedUser = null;
let authVerified = false;

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User data
 */
export async function login(email, password) {
  const data = await apiRequest(ENDPOINTS.AUTH.LOGIN, {
    method: 'POST',
    credentials: 'include', // Important: send cookies
    body: JSON.stringify({ email, password }),
  });

  cachedUser = data.user;
  authVerified = true;

  return data;
}

/**
 * Register new user
 * @param {string} name - User name
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User data
 */
export async function register(name, email, password) {
  const data = await apiRequest(ENDPOINTS.AUTH.REGISTER, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({ name, email, password }),
  });

  return data;
}

/**
 * Logout user
 */
export async function logout() {
  cachedUser = null;
  authVerified = false;
  await apiRequest(ENDPOINTS.AUTH.LOGOUT, {
    method: 'POST',
    credentials: 'include',
  });
}

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>} True if user is authenticated
 */
export async function checkAuth() {
  if (authVerified && cachedUser === null) {
    return false;
  }

  try {
    const data = await apiRequest(ENDPOINTS.AUTH.ME, {
      credentials: 'include',
    });
    cachedUser = data.user || null;
    authVerified = true;
    return !!cachedUser;
  } catch {
    cachedUser = null;
    authVerified = true;
    return false;
  }
}

/**
 * Get current authenticated user
 * @returns {Promise<Object|null>} User data or null
 */
export async function getCurrentUser() {
  if (cachedUser !== null) {
    return cachedUser;
  }

  try {
    const data = await apiRequest(ENDPOINTS.AUTH.ME, {
      credentials: 'include',
    });
    cachedUser = data.user;
    return cachedUser;
  } catch {
    cachedUser = null;
    return null;
  }
}

/**
 * Verify email with token
 * @param {string} token - Verification token from email
 * @returns {Promise<Object>} Verification result
 */
export async function verifyEmail(token) {
  const data = await apiRequest(`${ENDPOINTS.AUTH.VERIFY_EMAIL}?token=${token}`, {
    method: 'GET',
  });

  return data;
}

/**
 * Resend verification email
 * @param {string} email - User email
 * @returns {Promise<Object>} Resend result
 */
export async function resendVerificationEmail(email) {
  const data = await apiRequest(ENDPOINTS.AUTH.RESEND_VERIFICATION, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });

  return data;
}
