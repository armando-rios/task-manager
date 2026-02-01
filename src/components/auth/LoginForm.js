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

  // Submit button
  const submitButton = Button({
    text: 'Login',
    type: 'submit',
    variant: 'primary',
  });

  // Handle form submission
  form.addEventListener('submit', async e => {
    e.preventDefault();

    // ✅ Usar FormData para extraer valores por name
    const formData = new FormData(form);
    const credentials = {
      email: formData.get('email'),
      password: formData.get('password'),
    };

    if (onSubmit) {
      await onSubmit(credentials);
    }
  });

  form.append(emailInput, passwordInput, submitButton);

  return form;
}
