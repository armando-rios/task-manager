import { apiRequest } from './api.js'
import { ENDPOINTS } from '../utils/constants.js'

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
  })

  return data
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
  })

  return data
}

/**
 * Logout user
 */
export async function logout() {
  await apiRequest(ENDPOINTS.AUTH.LOGOUT, {
    method: 'POST',
    credentials: 'include',
  })
}

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>} True if user is authenticated
 */
export async function checkAuth() {
  try {
    const data = await apiRequest(ENDPOINTS.AUTH.ME, {
      credentials: 'include',
    })
    return !!data.user
  } catch (error) {
    return false
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
    })
    return data.user
  } catch (error) {
    return null
  }
}
