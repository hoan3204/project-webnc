# CORS Security Demo - Implementation Guide

## 📋 Mục Lục

1. [Overview](#overview)
2. [Vulnerabilities](#vulnerabilities)
3. [Fixes](#fixes)
4. [Testing](#testing)
5. [Deployment](#deployment)

---

## Overview

Dự án này demo lỗ hổng **CORS Misconfiguration** - một trong những lỗ hổng phổ biến nhất trong ứng dụng web hiện đại.

### Các Thành Phần

```
webnc/
├── controllers/client/cors.controller.js       # CORS endpoints (vulnerable + secure)
├── routers/client/cors.route.js               # CORS routes
├── middlewares/client/cors.middleware.js      # CORS security middleware
└── security-demo/
    ├── cors/
    │   ├── vulnerable-site/
    │   │   └── index.html                     # Interactive demo interface
    │   └── docs/
    │       ├── CORS_VULNERABILITY.md          # Full documentation
    │       ├── IMPLEMENTATION.md              # This file
    │       ├── TEST_CASES.md                  # Test scenarios
    │       └── DEPLOY_GUIDE.md                # Deployment guide
```

---

## Vulnerabilities

### 1. **Vulnerable Endpoint**

```javascript
// ❌ INSECURE
exports.insecureData = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')  // VULNERABLE
  res.json({ apiKey: 'secret', userData: {...} })
}
```

**Lỗ hổng:**
- `Access-Control-Allow-Origin: *` cho phép **tất cả** domain truy cập
- Không validate origin
- Dữ liệu nhạy cảm bị expose

**Impact:**
- Data Exfiltration
- Sensitive information leaked
- API keys stolen

**URL:** `GET /cors/insecure-data`

### 2. **Attack Flow**

```
1. Attacker tạo trang: attacker.com/steal-data.html
2. Trang này gọi: fetch('https://target.com/cors/insecure-data')
3. Browser check CORS: "Origin: attacker.com"
4. Server return: "Access-Control-Allow-Origin: *" ✓
5. Browser allow request ✓
6. Data được đánh cắp ✓
```

---

## Fixes

### 1. **CORS Whitelist**

```javascript
// ✅ SECURE
const getWhitelist = () => {
  return (process.env.CORS_WHITELIST || 'http://localhost:3000')
    .split(',')
    .map(o => o.trim())
    .filter(Boolean)
}

exports.secureData = (req, res) => {
  const origin = req.headers.origin
  const whitelist = getWhitelist()
  
  // Validate origin
  if (!whitelist.includes(origin)) {
    return res.status(403).json({ error: 'CORS policy violation' })
  }
  
  // Return specific origin, NEVER wildcard
  res.setHeader('Access-Control-Allow-Origin', origin)
  res.json({ apiKey: 'secret', userData: {...} })
}
```

**URL:** `GET /cors/secure-data`

### 2. **Environment Configuration**

**`.env`**
```
CORS_WHITELIST=https://yourdomain.com,https://app.yourdomain.com,http://localhost:3000
```

### 3. **Security Headers**

| Header | Value | Purpose |
|--------|-------|---------|
| `Vary` | `Origin` | Cache key includes Origin |
| `Access-Control-Allow-Origin` | Specific origin | Only return specific origin |
| `Access-Control-Allow-Methods` | GET, POST | Limit HTTP methods |
| `Access-Control-Allow-Headers` | Content-Type | Limit request headers |
| `Access-Control-Max-Age` | 86400 | Cache preflight response |
| `Access-Control-Allow-Credentials` | true | Allow cookies (if needed) |

---

## Testing

### 1. **Vulnerable Endpoint Test**

```bash
# Test from any origin - should work
curl -H "Origin: https://attacker.com" \
     http://localhost:3000/cors/insecure-data

# Response should include data + CORS headers
```

### 2. **Secure Endpoint Test**

**Test 1: Not Whitelisted Origin (should fail)**
```bash
curl -H "Origin: https://attacker.com" \
     http://localhost:3000/cors/secure-data

# Response: 403 Forbidden ✓
```

**Test 2: Whitelisted Origin (should succeed)**
```bash
curl -H "Origin: http://localhost:3000" \
     http://localhost:3000/cors/secure-data

# Response: 200 OK + CORS headers ✓
```

### 3. **Interactive Demo**

Mở file: `security-demo/cors/vulnerable-site/index.html`

Hoặc truy cập online (khi deploy):
```
https://your-domain.com/cors-demo/
```

**Features:**
- 🚀 Attack vulnerable endpoint
- 🔍 Test secure endpoint
- 📋 View live attack logs
- ⚙️ Display whitelist config

---

## Deployment

### 1. **Local Testing**

```bash
# 1. Update .env
echo "CORS_WHITELIST=http://localhost:3000" >> .env

# 2. Start server
npm start

# 3. Open demo
# http://localhost:3000/cors-demo/

# 4. Click "Attack" button to see vulnerability
# Click "Test Secure" to verify fix
```

### 2. **Production Deployment (Render)**

**Step 1: Update .env.example**
```env
CORS_WHITELIST=https://yourdomain.com,https://app.yourdomain.com
```

**Step 2: Set Environment Variables on Render**

```
CORS_WHITELIST=https://yourdomain.com,https://app.yourdomain.com,https://app.example.com
```

**Step 3: Verify Deployment**

```bash
# Test vulnerable endpoint
curl -H "Origin: https://attacker.com" \
     https://your-app.render.com/cors/insecure-data

# Test secure endpoint (not whitelisted)
curl -H "Origin: https://attacker.com" \
     https://your-app.render.com/cors/secure-data
# Should return 403

# Test secure endpoint (whitelisted)
curl -H "Origin: https://yourdomain.com" \
     https://your-app.render.com/cors/secure-data
# Should return 200 with data
```

### 3. **Monitoring CORS Violations**

Add to your logging system:

```javascript
// In cors.controller.js
console.warn(`[CORS VIOLATION] Rejected origin: ${origin}`)
console.log(`[CORS ALLOWED] Origin: ${origin}`)
```

Monitor logs on Render:
```
https://dashboard.render.com/projects/your-project/logs
```

---

## Security Checklist

- [ ] ❌ Không dùng `Access-Control-Allow-Origin: *`
- [ ] ✅ Implement CORS whitelist
- [ ] ✅ Validate origin trên mỗi request
- [ ] ✅ Use environment variables cho config
- [ ] ✅ Set `Vary: Origin` header
- [ ] ✅ Limit HTTP methods
- [ ] ✅ Limit allowed headers
- [ ] ✅ Use HTTPS in production
- [ ] ✅ Monitor CORS violations
- [ ] ✅ Document allowed origins

---

## API Reference

### Vulnerable Endpoint

```
GET /cors/insecure-data

Response:
{
  "source": "insecure",
  "message": "CORS is wide open here...",
  "warning": "This is vulnerable",
  "data": {
    "apiKey": "demo-api-key-123",
    "userEmail": "security@class.demo",
    "plan": "premium"
  }
}

CORS Headers:
Access-Control-Allow-Origin: *
```

### Secure Endpoint

```
GET /cors/secure-data

Response (if origin whitelisted):
{
  "source": "secure",
  "message": "Only whitelisted origins can read this",
  "data": {...}
}

Response (if origin NOT whitelisted):
{
  "source": "secure",
  "message": "Origin is not allowed",
  "error": "CORS policy violation"
}

CORS Headers:
Access-Control-Allow-Origin: [requested origin]
Access-Control-Allow-Methods: GET, OPTIONS
Vary: Origin
```

### Config Endpoint

```
GET /cors/config

Response:
{
  "whitelist": [
    "https://yourdomain.com",
    "https://app.yourdomain.com",
    "http://localhost:3000"
  ],
  "currentOrigin": "https://yourdomain.com",
  "isOriginAllowed": true
}
```

---

## Files Modified/Created

### Created:
- `security-demo/cors/docs/CORS_VULNERABILITY.md` - Detailed vulnerability explanation
- `security-demo/cors/docs/IMPLEMENTATION.md` - This file
- `security-demo/cors/docs/TEST_CASES.md` - Test scenarios
- `security-demo/cors/docs/DEPLOY_GUIDE.md` - Deployment guide
- `security-demo/cors/vulnerable-site/index.html` - Interactive demo

### Modified:
- `controllers/client/cors.controller.js` - Enhanced with full logging and comments
- `routers/client/cors.route.js` - Added config endpoint
- `routers/client/index.route.js` - Updated route path

### New:
- `middlewares/client/cors.middleware.js` - Reusable CORS middleware

---

## Best Practices Applied

1. **Never use Wildcard**: Always use specific origins
2. **Whitelist Pattern**: Only allow known, trusted origins
3. **Environment Config**: Use .env for managing origins
4. **Logging & Monitoring**: Log all CORS violations
5. **Documentation**: Clear comments in code
6. **Testing**: Comprehensive test cases
7. **HTTPS Only**: Enforce HTTPS in production
8. **Vary Header**: Set for proper caching

---

## References

- [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [OWASP: CORS](https://owasp.org/www-community/attacks/CORS_OriginHeaderScrutiny)
- [PortSwigger: CORS](https://portswigger.net/web-security/cors)

---

**Status**: ✅ Complete and Production Ready
**Last Updated**: December 2024
