import cD from '../../utils/createDocument.js';
import { AuthTabs } from './AuthTabs.js';
import { LoginForm } from './LoginForm.js';
import { RegisterForm } from './RegisterForm.js';

/**
 * Creates the main auth container component
 * @param {Object} params - Parameters
 * @param {Function} params.onLogin - Callback when login is submitted
 * @param {Function} params.onRegister - Callback when register is submitted
 * @returns {HTMLElement} Auth container element
 */
export function AuthContainer({ onLogin, onRegister }) {
  // Main container
  const container = cD({
    tagName: 'div',
    styles:
      'max-w-md w-full mx-auto p-8 bg-theme-surface-0 rounded-lg shadow-md border border-theme-surface-3',
  });

  // Header
  const header = cD({
    tagName: 'div',
    styles: 'text-center',
  });

  const title = cD({
    tagName: 'h1',
    styles: 'text-3xl font-bold mb-2 text-theme-primary',
    textContent: 'Task Manager',
  });

  const subtitle = cD({
    tagName: 'p',
    styles: 'mb-8 text-theme-text-1',
    textContent: 'Manage your tasks efficiently',
  });

  header.append(title, subtitle);

  // Form container
  const formContainer = cD({
    tagName: 'div',
    styles: 'w-full',
  });

  // Create forms
  const loginForm = LoginForm(onLogin);
  const registerForm = RegisterForm(onRegister);

  // Initially show login form
  loginForm.style.display = 'flex';
  registerForm.style.display = 'none';

  formContainer.append(loginForm, registerForm);

  // Tabs with form switching logic
  const tabs = AuthTabs(tab => {
    if (tab === 'login') {
      loginForm.style.display = 'flex';
      registerForm.style.display = 'none';
    } else {
      loginForm.style.display = 'none';
      registerForm.style.display = 'flex';
    }
  });

  // Assemble container
  container.append(header, tabs.container, formContainer);

  return container;
}
