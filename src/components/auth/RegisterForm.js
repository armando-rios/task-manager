import cD from '../../utils/createDocument.js'
import { Input } from '../common/Input.js'
import { Button } from '../common/Button.js'

/**
 * Creates a register form component
 * @param {Function} onSubmit - Callback function when form is submitted
 * @returns {HTMLFormElement} Register form element
 */
export function RegisterForm(onSubmit) {
  const form = cD({
    tagName: 'form',
    styles: 'flex flex-col gap-4',
  })

  // Name input
  const nameInput = Input({
    label: 'Name',
    type: 'text',
    placeholder: 'John Doe',
    required: true,
    name: 'name',
  })

  // Email input
  const emailInput = Input({
    label: 'Email',
    type: 'email',
    placeholder: 'your@email.com',
    required: true,
    name: 'email',
  })

  // Password input
  const passwordInput = Input({
    label: 'Password',
    type: 'password',
    placeholder: '••••••••',
    required: true,
    name: 'password',
  })

  // Submit button
  const submitButton = Button({
    text: 'Register',
    type: 'submit',
    variant: 'primary',
  })

  // Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const userData = {
      name: nameInput.input.value,
      email: emailInput.input.value,
      password: passwordInput.input.value,
    }

    if (onSubmit) {
      await onSubmit(userData)
    }
  })

  form.append(
    nameInput.container,
    emailInput.container,
    passwordInput.container,
    submitButton
  )

  return form
}
