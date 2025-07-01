import { connectDB } from '../_lib/db.js'
import User from '../_lib/userModel.js'
import { generateVerificationToken } from '../_lib/authMiddleware.js'
import { sendVerificationEmail } from '../_lib/emailService.js'
import { handleCors } from '../_lib/corsMiddleware.js'

export default async function handler(req, res) {
  // CORS para desarrollo - REMOVER cuando frontend y backend estén en mismo dominio
  handleCors(req, res)

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'POST') {
    try {
      await connectDB()
      const { name, email, password } = req.body

      if (!name || !email || !password) {
        return res.status(400).json({
          status: 'ERROR',
          message: 'Name, email, and password are required',
        })
      }

      if (password.length < 6) {
        return res.status(400).json({
          status: 'ERROR',
          message: 'Password must be at least 6 characters long',
        })
      }

      const existingUser = await User.findOne({ email: email.toLowerCase() })
      if (existingUser) {
        return res.status(400).json({
          status: 'ERROR',
          message: 'Email is already registered',
        })
      }

      const verificationToken = generateVerificationToken()
      const verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000 // 24 hours

      const newUser = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        emailVerified: false,
        verificationToken,
        verificationTokenExpiry,
      })

      try {
        await sendVerificationEmail(
          newUser.email,
          newUser.name,
          verificationToken
        )
      } catch (emailError) {
        console.error('Error sending verification email', emailError)
      }

      return res.status(201).json({
        status: 'OK',
        message: 'User registered successfully. Please verify your email.',
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          emailVerified: newUser.emailVerified,
        },
      })
    } catch (error) {
      console.error('Registration error', error)
      return res.status(500).json({
        status: 'ERROR',
        message: 'Error registering user',
        error: error.message,
      })
    }
  }

  return res.status(405).json({
    status: 'ERROR',
    message: 'Method not allowed',
  })
}
