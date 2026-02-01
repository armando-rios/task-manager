import { checkAuth } from '../services/authService.js';

/**
 * Guard for routes that require authentication
 * @returns {Promise<boolean>} True if user is authenticated
 */
export async function authGuard() {
  const isAuth = await checkAuth();
  return isAuth;
}

/**
 * Guard for routes that require user to be a guest (not authenticated)
 * If user is authenticated, redirect to dashboard
 * @returns {Promise<boolean>} True if user is NOT authenticated
 */
export async function guestGuard() {
  const isAuth = await checkAuth();
  if (isAuth) {
    // User is authenticated, redirect to dashboard
    window.router.navigate('/', true);
    return false;
  }
  return true;
}
