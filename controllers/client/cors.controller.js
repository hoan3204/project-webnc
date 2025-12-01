const sensitiveData = {
  apiKey: 'demo-api-key-123',
  userEmail: 'security@class.demo',
  plan: 'premium',
}

const whitelist = (process.env.CORS_WHITELIST || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

exports.insecureData = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.json({
    source: 'insecure',
    message: 'CORS is wide open here, so any site can read this.',
    data: sensitiveData,
  })
}

exports.secureData = (req, res) => {
  const requestOrigin = req.headers.origin
  const isAllowed = whitelist.includes(requestOrigin)

  res.setHeader('Vary', 'Origin')

  if (!isAllowed) {
    return res.status(403).json({
      source: 'secure',
      message: 'Origin is not allowed by the CORS whitelist.',
    })
  }

  res.setHeader('Access-Control-Allow-Origin', requestOrigin)
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  res.json({
    source: 'secure',
    message: 'Only whitelisted origins can read this payload.',
    data: sensitiveData,
  })
}
