import { login, register, logout, resendVerificationEmail } from '../services/authService.js'

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
    
    // Check if error is due to unverified email
    if (error.message && error.message.includes('Email not verified')) {
      const resend = confirm(
        'Your email is not verified. Would you like to resend the verification email?'
      )
      
      if (resend) {
        await handleResendVerification(email)
      }
    } else {
      alert(`Login failed: ${error.message}`)
    }
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

    // Store email for waiting verification page
    sessionStorage.setItem('pending_verification_email', email)

    // Redirect to waiting verification page
    window.router.navigate('/waiting-verification')
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

/**
 * Handles resend verification email
 * @param {string} email - User email
 * @returns {Promise<void>}
 */
export async function handleResendVerification(email) {
  try {
    const data = await resendVerificationEmail(email)
    console.log('Verification email sent:', data)
    alert(data.message || 'Verification email sent! Please check your inbox.')
  } catch (error) {
    console.error('Resend verification failed:', error)
    alert(`Failed to resend verification email: ${error.message}`)
  }
}
