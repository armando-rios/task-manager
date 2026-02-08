import cD from '../../utils/createDocument.js';
import { Input } from '../common/Input.js';
import { Button } from '../common/Button.js';

/**
 * Creates a register form component
 * @param {Function} onSubmit - Callback function when form is submitted
 * @returns {HTMLFormElement} Register form element
 */
export function RegisterForm(onSubmit) {
  const form = cD({
    tagName: 'form',
    styles: 'flex flex-col gap-4',
  });

  // Name input
  const nameInput = Input({
    label: 'Name',
    type: 'text',
    placeholder: 'John Doe',
    required: true,
    name: 'name',
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

  // Submit button
  const submitButton = Button({
    text: 'Register',
    type: 'submit',
    variant: 'primary',
  });

  // Handle form submission
  form.addEventListener('submit', async e => {
    e.preventDefault();

    if (isLoading) return;

    isLoading = true;
    submitButton.disabled = true;
    submitButton.textContent = 'Registering...';
    submitButton.style.opacity = '0.5';
    submitButton.style.cursor = 'not-allowed';

    // ✅ Usar FormData
    const formData = new FormData(form);
    const userData = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
    };

    try {
      if (onSubmit) {
        await onSubmit(userData);
      }
    } finally {
      isLoading = false;
      submitButton.disabled = false;
      submitButton.textContent = 'Register';
      submitButton.style.opacity = '1';
      submitButton.style.cursor = 'pointer';
    }
  });

  form.append(nameInput, emailInput, passwordInput, submitButton);

  return form;
}
