import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

export const verifyToken = (req) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { valid: false, error: 'No token provided' }
    }
    const token = authHeader.substring(7)

    const decoded = jwt.verify(token, JWT_SECRET)

    return {
      valid: true,
      userId: decoded.userId,
      email: decoded.email,
    }
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return { valid: false, error: 'Token expired' }
    }
    if (error.name === 'JsonWebTokenError') {
      return { valid: false, error: 'Invalid token' }
    }
    return { valid: false, error: 'Authentication failed' }
  }
}

/**
 * Verify token from cookie
 * @param {Request} req - Request object
 * @returns {Object} Verification result
 */
export const verifyTokenFromCookie = (req) => {
  try {
    // Get cookie from request
    const cookies = parseCookies(req.headers.cookie || '')
    const token = cookies.authToken

    if (!token) {
      return { valid: false, error: 'No token provided' }
    }

    const decoded = jwt.verify(token, JWT_SECRET)

    return {
      valid: true,
      userId: decoded.userId,
      email: decoded.email,
    }
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return { valid: false, error: 'Token expired' }
    }
    if (error.name === 'JsonWebTokenError') {
      return { valid: false, error: 'Invalid token' }
    }
    return { valid: false, error: 'Authentication failed' }
  }
}

/**
 * Parse cookies from cookie header
 * @param {string} cookieHeader - Cookie header string
 * @returns {Object} Parsed cookies
 */
function parseCookies(cookieHeader) {
  const cookies = {}
  if (!cookieHeader) return cookies

  cookieHeader.split(';').forEach((cookie) => {
    const [name, value] = cookie.trim().split('=')
    if (name && value) {
      cookies[name] = decodeURIComponent(value)
    }
  })

  return cookies
}

export const generateToken = (userId, email) => {
  return jwt.sign({ userId, email }, JWT_SECRET, {
    expiresIn: '7d',
  })
}

export const generateVerificationToken = () => {
  return jwt.sign(
    { type: 'email-verification', random: Math.random() },
    JWT_SECRET,
    { expiresIn: '24h' },
  )
}
