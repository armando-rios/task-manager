import { connectDB } from '../_lib/db.js'
import User from '../_lib/userModel.js'
import { generateVerificationToken } from '../_lib/authMiddleware.js'
import { sendVerificationEmail } from '../_lib/emailService.js'

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'POST') {
    try {
      await connectDB()
      const { email } = req.body

      if (!email) {
        return res.status(400).json({
          status: 'ERROR',
          message: 'Email is required',
        })
      }

      const user = await User.findOne({ email: email.toLowerCase() })

      if (!user) {
        // Don't reveal if user exists or not for security
        return res.status(200).json({
          status: 'OK',
          message: 'If the email exists, a verification email has been sent.',
        })
      }

      if (user.emailVerified) {
        return res.status(400).json({
          status: 'ERROR',
          message: 'Email is already verified. You can log in.',
        })
      }

      // Generate new verification token
      const verificationToken = generateVerificationToken()
      const verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000 // 24 hours

      user.verificationToken = verificationToken
      user.verificationTokenExpiry = verificationTokenExpiry
      await user.save()

      // Send verification email
      try {
        await sendVerificationEmail(user.email, user.name, verificationToken)
      } catch (emailError) {
        console.error('Error sending verification email:', emailError)
        return res.status(500).json({
          status: 'ERROR',
          message: 'Error sending verification email',
        })
      }

      return res.status(200).json({
        status: 'OK',
        message: 'Verification email sent successfully. Please check your inbox.',
      })
    } catch (error) {
      console.error('Resend verification error:', error)
      return res.status(500).json({
        status: 'ERROR',
        message: 'Error resending verification email',
        error: error.message,
      })
    }
  }

  return res.status(405).json({
    status: 'ERROR',
    message: 'Method not allowed',
  })
}
