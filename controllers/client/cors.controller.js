const sensitiveData = {
  apiKey: 'demo-api-key-123',
  userEmail: 'security@class.demo',
  plan: 'premium',
  timestamp: new Date().toISOString(),
  userId: '65a1b2c3d4e5f6g7h8i9j',
}

const getWhitelist = () => {
  const whitelist = (process.env.CORS_WHITELIST || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
  return whitelist
}

// ❌ VULNERABLE ENDPOINT - Demonstrates CORS misconfiguration
// Access-Control-Allow-Origin: * allows ANY domain to access this data
exports.insecureData = (req, res) => {
  // Log the attack for monitoring
  console.log(`[CORS VULNERABILITY] Insecure endpoint accessed from origin: ${req.headers.origin || 'no-origin'}`)

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Max-Age', '3600')

  res.json({
    source: 'insecure',
    message: '⚠️ CORS is wide open here, so any site can read this data!',
    warning: 'This is a vulnerable endpoint for demonstration only.',
    vulnerability: 'Access-Control-Allow-Origin: * allows all domains',
    impact: 'Data Exfiltration - Sensitive data can be stolen by malicious websites',
    data: sensitiveData,
  })
}

// ✅ SECURE ENDPOINT - Uses CORS whitelist for protection
// Only whitelisted origins can access this data
exports.secureData = (req, res) => {
  const requestOrigin = req.headers.origin
  const whitelist = getWhitelist()
  const isAllowed = whitelist.includes(requestOrigin)

  // Log for security monitoring
  console.log(`[CORS POLICY] Secure endpoint - Origin: ${requestOrigin || 'no-origin'} - Allowed: ${isAllowed}`)

  // Always set Vary header to indicate response varies by Origin
  res.setHeader('Vary', 'Origin')

  if (!isAllowed) {
    console.warn(`[CORS REJECTION] Origin ${requestOrigin} not in whitelist`)
    return res.status(403).json({
      source: 'secure',
      message: '🔒 Origin is not allowed by the CORS whitelist.',
      error: 'CORS policy violation',
      requestedOrigin: requestOrigin || 'no-origin',
      allowedOrigins: whitelist.length > 0 ? whitelist : ['none configured'],
    })
  }

  // Only set the specific allowed origin, not wildcard
  res.setHeader('Access-Control-Allow-Origin', requestOrigin)
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Max-Age', '86400')

  console.log(`[CORS ALLOWED] Secure endpoint accessed successfully from: ${requestOrigin}`)

  res.json({
    source: 'secure',
    message: '✅ Only whitelisted origins can read this payload.',
    security: 'CORS properly configured with whitelist',
    yourOrigin: requestOrigin,
    allowedOrigins: whitelist,
    data: sensitiveData,
  })
}

// Get current CORS configuration (for demo purposes)
exports.getConfig = (req, res) => {
  const whitelist = getWhitelist()
  res.json({
    whitelist: whitelist,
    currentOrigin: req.headers.origin,
    isAllowed: whitelist.includes(req.headers.origin),
  })
}
