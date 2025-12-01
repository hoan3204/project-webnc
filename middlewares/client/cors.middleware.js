/**
 * CORS Security Middleware
 * 
 * Implements proper CORS handling with whitelist validation
 * Prevents CORS misconfiguration vulnerabilities
 */

const getWhitelist = () => {
  const whitelist = (process.env.CORS_WHITELIST || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
  return whitelist
}

/**
 * Secure CORS Middleware
 * 
 * Features:
 * - Validates origin against whitelist
 * - Returns specific origin, never wildcard
 * - Sets Vary header for caching
 * - Logs policy violations
 * - Handles preflight (OPTIONS) requests
 */
const secureCors = (req, res, next) => {
  const origin = req.headers.origin
  const whitelist = getWhitelist()
  const isAllowed = whitelist.includes(origin)

  // Always set Vary header - critical for caching
  res.setHeader('Vary', 'Origin')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    if (!isAllowed) {
      return res.status(403).json({ error: 'CORS policy violation' })
    }

    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.setHeader('Access-Control-Max-Age', '86400')
    res.setHeader('Access-Control-Allow-Credentials', 'true')

    return res.sendStatus(200)
  }

  // Simple request handling
  if (!isAllowed) {
    console.warn(`[CORS VIOLATION] Rejected origin: ${origin}`)
    return res.status(403).json({
      error: 'CORS policy violation',
      message: 'Your origin is not allowed to access this resource',
    })
  }

  // Set specific origin (never wildcard)
  res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Max-Age', '86400')
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  console.log(`[CORS ALLOWED] Origin: ${origin}`)

  next()
}

/**
 * Vulnerable CORS Middleware (for demo only)
 * 
 * ❌ DO NOT USE IN PRODUCTION
 * This demonstrates the vulnerable pattern
 */
const vulnerableCors = (req, res, next) => {
  // ❌ VULNERABLE - Allows any origin
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  next()
}

/**
 * CORS Config endpoint handler
 * Returns current CORS configuration
 */
const getCorsConfig = (req, res) => {
  const whitelist = getWhitelist()
  res.json({
    whitelist: whitelist,
    currentOrigin: req.headers.origin || 'no-origin',
    isOriginAllowed: whitelist.includes(req.headers.origin),
  })
}

module.exports = {
  secureCors,
  vulnerableCors,
  getCorsConfig,
  getWhitelist,
}
