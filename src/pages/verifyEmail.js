import { verifyEmail } from '../services/authService.js';

export default async function verifyEmailPage() {
  const container = document.createElement('div');
  container.className = 'min-h-screen flex items-center justify-center bg-base px-4';

  // Extract token from URL
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  if (!token) {
    container.innerHTML = `
      <div class="bg-surface rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div class="mb-6">
          <svg class="w-16 h-16 mx-auto text-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-text mb-4">Invalid Link</h1>
        <p class="text-subtext0 mb-6">The verification link is invalid or missing.</p>
        <button id="go-to-login" class="bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-lg transition-colors w-full">
          Go to Login
        </button>
      </div>
    `;

    container.querySelector('#go-to-login').addEventListener('click', () => {
      window.router.navigate('/auth');
    });

    return container;
  }

  // Show loading state
  container.innerHTML = `
    <div class="bg-surface rounded-lg shadow-xl p-8 max-w-md w-full text-center">
      <div class="mb-6">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
      </div>
      <h1 class="text-2xl font-bold text-text mb-4">Verifying Email...</h1>
      <p class="text-subtext0">Please wait while we verify your email address.</p>
    </div>
  `;

  // Verify email
  try {
    const result = await verifyEmail(token);

    container.innerHTML = `
      <div class="bg-surface rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div class="mb-6">
          <svg class="w-16 h-16 mx-auto text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-text mb-4">Email Verified!</h1>
        <p class="text-subtext0 mb-6">${result.message || 'Your email has been verified successfully. You can now log in to your account.'}</p>
        <p class="text-subtext1 text-sm mb-6">Redirecting to login in 3 seconds...</p>
        <button id="go-to-login" class="bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-lg transition-colors w-full">
          Go to Login Now
        </button>
      </div>
    `;

    // Auto redirect after 3 seconds
    const redirectTimeout = setTimeout(() => {
      window.router.navigate('/auth');
    }, 3000);

    container.querySelector('#go-to-login').addEventListener('click', () => {
      clearTimeout(redirectTimeout);
      window.router.navigate('/auth');
    });
  } catch (error) {
    console.error('Verification error:', error);

    container.innerHTML = `
      <div class="bg-surface rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div class="mb-6">
          <svg class="w-16 h-16 mx-auto text-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-text mb-4">Verification Failed</h1>
        <p class="text-subtext0 mb-6">${error.message || 'The verification link is invalid or has expired. Please request a new verification email.'}</p>
        <div class="space-y-3">
          <button id="go-to-resend" class="bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-lg transition-colors w-full">
            Request New Verification Email
          </button>
          <button id="go-to-auth" class="bg-surface-1 hover:bg-surface-2 text-text font-semibold py-2 px-4 rounded-lg transition-colors w-full">
            Back to Login
          </button>
        </div>
      </div>
    `;

    container.querySelector('#go-to-resend').addEventListener('click', () => {
      window.router.navigate('/auth?tab=register');
    });

    container.querySelector('#go-to-auth').addEventListener('click', () => {
      window.router.navigate('/auth');
    });
  }

  return container;
}
