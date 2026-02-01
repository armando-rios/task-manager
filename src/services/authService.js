import { apiRequest } from './api.js';
import { ENDPOINTS } from '../utils/constants.js';

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
  try {
    const data = await apiRequest(ENDPOINTS.AUTH.ME, {
      credentials: 'include',
    });
    return !!data.user;
  } catch {
    return false;
  }
}

/**
 * Get current authenticated user
 * @returns {Promise<Object|null>} User data or null
 */
export async function getCurrentUser() {
  try {
    const data = await apiRequest(ENDPOINTS.AUTH.ME, {
      credentials: 'include',
    });
    return data.user;
  } catch {
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
