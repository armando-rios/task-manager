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

  // Submit button
  const submitButton = Button({
    text: 'Register',
    type: 'submit',
    variant: 'primary',
  });

  // Handle form submission
  form.addEventListener('submit', async e => {
    e.preventDefault();

    // ✅ Usar FormData
    const formData = new FormData(form);
    const userData = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
    };

    if (onSubmit) {
      await onSubmit(userData);
    }
  });

  form.append(nameInput, emailInput, passwordInput, submitButton);

  return form;
}
