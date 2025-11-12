import { login, register, logout } from '../services/authService.js'

/**
 * Handles login logic
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise<void>}
 */
export async function handleLogin({ email, password }) {
  try {
    const data = await login(email, password)
    console.log('Login successful:', data)

    // Navigate to dashboard using router
    window.router.navigate('/')
  } catch (error) {
    console.error('Login failed:', error)
    alert(`Login failed: ${error.message}`)
  }
}

/**
 * Handles register logic
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User name
 * @param {string} userData.email - User email
 * @param {string} userData.password - User password
 * @returns {Promise<void>}
 */
export async function handleRegister({ name, email, password }) {
  try {
    const data = await register(name, email, password)
    console.log('Registration successful:', data)

    // Show success message and stay on auth page
    // User needs to verify email before logging in
    alert(
      'Registration successful! Please check your email to verify your account.',
    )
  } catch (error) {
    console.error('Registration failed:', error)
    alert(`Registration failed: ${error.message}`)
  }
}

/**
 * Handles logout logic
 * @returns {Promise<void>}
 */
export async function handleLogout() {
  try {
    await logout()
    console.log('Logout successful')

    // Navigate to auth page
    window.router.navigate('/auth')
  } catch (error) {
    console.error('Logout failed:', error)
    alert(`Logout failed: ${error.message}`)
  }
}
