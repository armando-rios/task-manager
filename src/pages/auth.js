import { AuthContainer } from '../components/auth/AuthContainer.js'
import { handleLogin, handleRegister } from '../controllers/authController.js'

/**
 * Creates the authentication page
 * @returns {HTMLElement} Auth page element
 */
export default function auth() {
  return AuthContainer({
    onLogin: handleLogin,
    onRegister: handleRegister,
  })
}
