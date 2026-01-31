import cD from '../utils/createDocument.js'
import { handleResendVerification } from '../controllers/authController.js'
import { showToast } from '../utils/toastConfig.js'

/**
 * Creates the waiting verification page
 * Shows after successful registration, waiting for email verification
 * @returns {HTMLElement} Waiting verification page element
 */
export default function waitingVerification() {
  // Get email from sessionStorage (set during registration)
  const email = sessionStorage.getItem('pending_verification_email')

  const container = cD({
    tagName: 'div',
    styles: 'min-h-screen flex items-center justify-center bg-theme-surface-0 px-4',
  })

  const card = cD({
    tagName: 'div',
    styles:
      'bg-theme-surface-1 rounded-lg shadow-xl p-8 max-w-md w-full text-center border border-theme-surface-3',
  })

  // Icon container with animation
  const iconContainer = cD({
    tagName: 'div',
    styles: 'mb-6 flex justify-center',
  })

  const icon = cD({
    tagName: 'div',
    styles: 'relative',
  })

  // Email icon (SVG)
  icon.innerHTML = `
    <svg class="w-20 h-20 text-theme-primary mx-auto animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
    </svg>
  `

  iconContainer.append(icon)

  // Title
  const title = cD({
    tagName: 'h1',
    styles: 'text-3xl font-bold text-theme-text-0 mb-4',
    textContent: 'Check Your Email',
  })

  // Description
  const description = cD({
    tagName: 'p',
    styles: 'text-theme-text-1 mb-2 text-lg',
    textContent: 'We sent a verification link to:',
  })

  // Email display
  const emailDisplay = cD({
    tagName: 'p',
    styles: 'text-theme-primary font-semibold mb-6 text-lg',
    textContent: email || 'your email',
  })

  // Instructions
  const instructions = cD({
    tagName: 'p',
    styles: 'text-theme-text-2 mb-8 text-sm',
    textContent:
      'Click the link in the email to verify your account. The link will expire in 24 hours.',
  })

  // Divider
  const divider = cD({
    tagName: 'div',
    styles: 'border-t border-theme-surface-3 my-6',
  })

  // Resend section
  const resendSection = cD({
    tagName: 'div',
    styles: 'mb-6',
  })

  const resendText = cD({
    tagName: 'p',
    styles: 'text-theme-text-2 text-sm mb-3',
    textContent: "Didn't receive the email?",
  })

  const resendButton = cD({
    tagName: 'button',
    styles:
      'bg-theme-surface-2 hover:bg-theme-surface-3 text-theme-text-0 font-semibold py-2 px-6 rounded-lg transition-colors border border-theme-surface-3',
    textContent: 'Resend Verification Email',
  })

  // Resend button click handler
  resendButton.addEventListener('click', async () => {
    if (!email) {
      showToast.error('Email not found. Please register again.')
      window.router.navigate('/auth')
      return
    }

    resendButton.disabled = true
    resendButton.textContent = 'Sending...'

    try {
      await handleResendVerification(email)
      resendButton.textContent = '✓ Email Sent!'
      setTimeout(() => {
        resendButton.textContent = 'Resend Verification Email'
        resendButton.disabled = false
      }, 3000)
    } catch (error) {
      resendButton.textContent = 'Resend Verification Email'
      resendButton.disabled = false
    }
  })

  resendSection.append(resendText, resendButton)

  // Back to login button
  const backButton = cD({
    tagName: 'button',
    styles:
      'bg-theme-primary hover:bg-theme-primary/90 text-white font-semibold py-2 px-6 rounded-lg transition-colors w-full',
    textContent: 'Back to Login',
  })

  backButton.addEventListener('click', () => {
    sessionStorage.removeItem('pending_verification_email')
    window.router.navigate('/auth')
  })

  // Assemble card
  card.append(
    iconContainer,
    title,
    description,
    emailDisplay,
    instructions,
    divider,
    resendSection,
    backButton,
  )

  container.append(card)

  return container
}
