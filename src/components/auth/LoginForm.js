import cD from '../../utils/createDocument.js';
import { Input } from '../common/Input.js';
import { Button } from '../common/Button.js';

/**
 * Creates a login form component
 * @param {Function} onSubmit - Callback function when form is submitted
 * @returns {HTMLFormElement} Login form element
 */
export function LoginForm(onSubmit) {
  const form = cD({
    tagName: 'form',
    styles: 'flex flex-col gap-4',
  });

  // Email input
  const emailInput = Input({
    label: 'Email',
    type: 'email',
    placeholder: 'your@email.com',
    required: true,
    name: 'email',
  });

  // Password input
  const passwordInput = Input({
    label: 'Password',
    type: 'password',
    placeholder: '••••••••',
    required: true,
    name: 'password',
  });

  let isLoading = false;

  const submitButton = Button({
    text: 'Login',
    type: 'submit',
    variant: 'primary',
  });

  // Handle form submission
  form.addEventListener('submit', async e => {
    e.preventDefault();

    if (isLoading) return;

    isLoading = true;
    submitButton.disabled = true;
    submitButton.textContent = 'Logging in...';
    submitButton.style.opacity = '0.5';
    submitButton.style.cursor = 'not-allowed';

    // ✅ Usar FormData para extraer valores por name
    const formData = new FormData(form);
    const credentials = {
      email: formData.get('email'),
      password: formData.get('password'),
    };

    try {
      if (onSubmit) {
        await onSubmit(credentials);
      }
    } finally {
      isLoading = false;
      submitButton.disabled = false;
      submitButton.textContent = 'Login';
      submitButton.style.opacity = '1';
      submitButton.style.cursor = 'pointer';
    }
  });

  form.append(emailInput, passwordInput, submitButton);

  return form;
}
