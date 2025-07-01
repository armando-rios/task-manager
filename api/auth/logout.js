/**
 * Logout endpoint - clears the auth cookie
 */
export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'POST') {
    try {
      // Clear the auth cookie
      res.setHeader(
        'Set-Cookie',
        'authToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0',
      )

      return res.status(200).json({
        status: 'OK',
        message: 'Logout successful',
      })
    } catch (error) {
      console.error('Logout error:', error)
      return res.status(500).json({
        status: 'ERROR',
        message: 'Error during logout',
        error: error.message,
      })
    }
  }

  return res.status(405).json({
    status: 'ERROR',
    message: 'Method not allowed',
  })
}
