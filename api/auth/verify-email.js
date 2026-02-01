import { connectDB } from '../_lib/db.js';
import User from '../_lib/userModel.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      await connectDB();
      const { token } = req.query;

      if (!token) {
        return res.status(400).json({
          status: 'ERROR',
          message: 'Verification token is required',
        });
      }

      const user = await User.findOne({
        verificationToken: token,
        verificationTokenExpiry: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({
          status: 'ERROR',
          message: 'Invalid or expired verification token',
        });
      }

      // Mark email as verified
      user.emailVerified = true;
      user.verificationToken = null;
      user.verificationTokenExpiry = null;
      await user.save();

      return res.status(200).json({
        status: 'OK',
        message: 'Email verified successfully. You can now log in.',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
        },
      });
    } catch (error) {
      console.error('Email verification error:', error);
      return res.status(500).json({
        status: 'ERROR',
        message: 'Error verifying email',
        error: error.message,
      });
    }
  }

  return res.status(405).json({
    status: 'ERROR',
    message: 'Method not allowed',
  });
}
