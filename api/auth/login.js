import { generateToken } from '../_lib/authMiddleware.js'
import { connectDB } from '../_lib/db.js'
import User from '../_lib/userModel.js'

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'POST') {
    try {
      await connectDB()
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({
          status: 'ERROR',
          message: 'Email and password are required',
        })
      }

      const user = await User.findOne({ email: email.toLowerCase() })

      if (!user) {
        return res.status(401).json({
          status: 'ERROR',
          message: 'Invalid email or password',
        })
      }

      const isPasswordValid = await user.comparePassword(password)

      if (!isPasswordValid) {
        return res.status(401).json({
          status: 'ERROR',
          message: 'Invalid email or password',
        })
      }

      if (!user.emailVerified) {
        return res.status(403).json({
          status: 'ERROR',
          message:
            'Email not verified. Please verify your email before logging in.',
        })
      }

      const token = generateToken(user._id.toString(), user.email)

      // Set httpOnly cookie
      const isProduction = process.env.NODE_ENV === 'production'
      res.setHeader(
        'Set-Cookie',
        `authToken=${token}; HttpOnly; ${isProduction ? 'Secure;' : ''} SameSite=Strict; Path=/; Max-Age=604800`,
      )

      return res.status(200).json({
        status: 'OK',
        message: 'Login successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
        },
      })
    } catch (error) {
      console.error('Login Error:', error)
      return res.status(500).json({
        status: 'ERROR',
        message: 'Error during login',
        error: error.message,
      })
    }
  }

  return res.status(405).json({
    status: 'ERROR',
    message: 'Method not allowed',
  })
}
