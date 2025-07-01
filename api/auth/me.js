import { verifyTokenFromCookie } from '../_lib/authMiddleware.js'
import { connectDB } from '../_lib/db.js'
import User from '../_lib/userModel.js'
import { handleCors } from '../_lib/corsMiddleware.js'

/**
 * Get current authenticated user
 */
export default async function handler(req, res) {
  // CORS para desarrollo - REMOVER cuando frontend y backend estén en mismo dominio
  handleCors(req, res)

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'GET') {
    try {
      // Verify token from cookie
      const verification = verifyTokenFromCookie(req)

      if (!verification.valid) {
        return res.status(401).json({
          status: 'ERROR',
          message: verification.error || 'Not authenticated',
        })
      }

      // Get user from database
      await connectDB()
      const user = await User.findById(verification.userId).select('-password')

      if (!user) {
        return res.status(404).json({
          status: 'ERROR',
          message: 'User not found',
        })
      }

      return res.status(200).json({
        status: 'OK',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
        },
      })
    } catch (error) {
      console.error('Auth check error:', error)
      return res.status(500).json({
        status: 'ERROR',
        message: 'Error checking authentication',
        error: error.message,
      })
    }
  }

  return res.status(405).json({
    status: 'ERROR',
    message: 'Method not allowed',
  })
}
