# 🔓 CORS Misconfiguration - Security Demo Project

## 📌 Overview

Đây là một dự án **Phát Triển Phần Mềm Web An Toàn** (Secure Web Software Development) demo lỗ hổng **CORS Misconfiguration** trong ứng dụng web hiện đại.

**Chủ đề**: `Access-Control-Allow-Origin: *` dẫn đến data exfiltration, và fix bằng whitelist

---

## 🎯 Mục Tiêu Học Tập

1. **Hiểu** lỗ hổng CORS misconfiguration
2. **Thực hành** kỹ thuật tấn công CORS
3. **Triển khai** fix bảo mật thực tế
4. **Deploy** và monitor trên production (Render)

---

## 🏗️ Cấu Trúc Dự Án

```
webnc/
├── security-demo/
│   ├── cors/
│   │   ├── vulnerable-site/
│   │   │   └── index.html              # 🎮 Interactive Demo UI
│   │   └── docs/
│   │       ├── CORS_VULNERABILITY.md   # 📖 Chi tiết lỗ hổng
│   │       ├── IMPLEMENTATION.md       # 🔧 Hướng dẫn fix
│   │       ├── TEST_CASES.md           # 🧪 Test scenarios
│   │       ├── DEPLOY_GUIDE.md         # 🚀 Deploy to Render
│   │       └── README.md               # 📚 This file
│   
├── controllers/client/
│   └── cors.controller.js              # Endpoints (vulnerable + secure)
│
├── routers/client/
│   └── cors.route.js                   # CORS routes
│
├── middlewares/client/
│   └── cors.middleware.js              # CORS security middleware
```

---

## 🚀 Quick Start (Local)

### 1. Setup Environment

```bash
cd f:\webnc

# Copy .env.example to .env
cp .env.example .env

# Update .env with CORS whitelist
echo "CORS_WHITELIST=http://localhost:3000" >> .env
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Server

```bash
npm start
# Server running on http://localhost:3000
```

### 4. Access Demo

**Interactive Demo** (recommended):
```
http://localhost:3000/cors-demo/
```

**Endpoints**:
- `GET /cors/insecure-data` - Vulnerable endpoint
- `GET /cors/secure-data` - Secure endpoint  
- `GET /cors/config` - View CORS config

---

## 📊 Demo Flow

### Attack Scenario (Vulnerable Endpoint)

```
┌──────────────────┐
│  attacker.com    │  (Malicious website)
│   (Your page)    │
└────────┬─────────┘
         │ fetch('https://target.com/cors/insecure-data')
         │
         ▼
┌──────────────────────────────────┐
│     target.com (Our Server)      │
│  /cors/insecure-data             │
│                                  │
│ Response:                        │
│ Access-Control-Allow-Origin: *   │ ❌ VULNERABLE!
│ { apiKey: '...', data: {...} }  │
└────────┬─────────────────────────┘
         │ Browser allows request (CORS check passes)
         │
         ▼
┌──────────────────┐
│  attacker.com    │
│  (Data received) │ 🎯 ATTACK SUCCESS!
│  Send to server  │
└──────────────────┘
```

### Protection (Secure Endpoint)

```
┌──────────────────┐
│  attacker.com    │  (Malicious website)
│   (Your page)    │
└────────┬─────────┘
         │ fetch('https://target.com/cors/secure-data')
         │ Origin: attacker.com
         │
         ▼
┌──────────────────────────────────┐
│     target.com (Our Server)      │
│  /cors/secure-data               │
│                                  │
│ Check: attacker.com in whitelist?│
│ ❌ NO → Return 403 Forbidden    │
│ + CORS header rejection          │
└────────┬─────────────────────────┘
         │ Browser blocks request
         │ CORS policy violation
         │
         ▼
┌──────────────────┐
│  attacker.com    │
│  ❌ REJECTED      │ 🛡️ ATTACK BLOCKED!
└──────────────────┘
```

---

## 🎮 Interactive Demo Features

### 1. Attack Vulnerable Endpoint
- Click `🚀 Thực Hiện Attack`
- See real-time CORS headers
- View stolen data
- Simulate sending to attacker server

### 2. Test Secure Endpoint
- Click `🔍 Test Secure Endpoint`
- Show rejection logs
- Demonstrate whitelist protection
- View allowed origins

### 3. View Configuration
- See current CORS whitelist
- Check allowed origins
- Display environment variables

---

## 🔍 Code Comparison

### ❌ Vulnerable Code

```javascript
exports.insecureData = (req, res) => {
  // VULNERABLE - Allows any origin!
  res.setHeader('Access-Control-Allow-Origin', '*')
  
  res.json({
    apiKey: 'secret-key-123',
    userData: { email: 'user@example.com' }
  })
}
```

**Impact**: Any domain can steal sensitive data!

---

### ✅ Secure Code

```javascript
const whitelist = (process.env.CORS_WHITELIST || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean)

exports.secureData = (req, res) => {
  const origin = req.headers.origin
  
  // Validate origin against whitelist
  if (!whitelist.includes(origin)) {
    return res.status(403).json({ error: 'CORS policy violation' })
  }
  
  // Return specific origin, NEVER wildcard
  res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Vary', 'Origin')
  
  res.json({
    apiKey: 'secret-key-123',
    userData: { email: 'user@example.com' }
  })
}
```

**Benefits**: Only trusted domains can access!

---

## 🧪 Testing

### Manual Testing

```bash
# Test 1: Vulnerable endpoint (allows any origin)
curl -H "Origin: https://attacker.com" \
     http://localhost:3000/cors/insecure-data

# Test 2: Secure endpoint (rejects non-whitelisted)
curl -H "Origin: https://attacker.com" \
     http://localhost:3000/cors/secure-data
# Response: 403 Forbidden ✓

# Test 3: Secure endpoint (allows whitelisted)
curl -H "Origin: http://localhost:3000" \
     http://localhost:3000/cors/secure-data
# Response: 200 OK ✓
```

### Browser Testing

Open DevTools (F12) and run:

```javascript
// Test vulnerable endpoint
fetch('http://localhost:3000/cors/insecure-data')
  .then(r => r.json())
  .then(d => console.log('Stolen:', d))

// Test secure endpoint (will be blocked)
fetch('http://localhost:3000/cors/secure-data')
  .then(r => r.json())
  .catch(e => console.log('Blocked:', e))
```

---

## 🚀 Deployment to Render

### 1. Prepare Repository

```bash
git add .
git commit -m "feat: Add CORS security demo"
git push origin main
```

### 2. Create Render Service

1. Go to [render.com](https://render.com)
2. Connect GitHub repository
3. Set environment variables:
   ```
   CORS_WHITELIST=https://yourdomain.com,https://app.yourdomain.com
   ```
4. Deploy!

### 3. Verify Deployment

```bash
# Test on production
curl -H "Origin: https://yourdomain.com" \
     https://your-app.render.com/cors/secure-data
```

See [DEPLOY_GUIDE.md](./docs/DEPLOY_GUIDE.md) for detailed steps.

---

## 📚 Learning Resources

| Document | Content |
|----------|---------|
| [CORS_VULNERABILITY.md](./docs/CORS_VULNERABILITY.md) | Lỗ hổng chi tiết, attack flow, impact |
| [IMPLEMENTATION.md](./docs/IMPLEMENTATION.md) | Fix implementation, best practices |
| [TEST_CASES.md](./docs/TEST_CASES.md) | Comprehensive test scenarios |
| [DEPLOY_GUIDE.md](./docs/DEPLOY_GUIDE.md) | Production deployment guide |

---

## 🎓 Key Learnings

### What is CORS?

CORS (Cross-Origin Resource Sharing) cho phép các domain khác nhau giao tiếp thông qua HTTP.

**Headers**:
- `Access-Control-Allow-Origin`: Specifies which origins can access
- `Vary: Origin`: Indicates response varies by origin
- `Access-Control-Allow-Methods`: Allowed HTTP methods
- `Access-Control-Allow-Headers`: Allowed request headers

### The Vulnerability

```javascript
// ❌ WRONG: Wildcard allows EVERYONE
res.setHeader('Access-Control-Allow-Origin', '*')

// ✅ RIGHT: Specific origin only
res.setHeader('Access-Control-Allow-Origin', 'https://trusted-site.com')
```

### The Fix

1. **Define whitelist**: List all trusted origins in `.env`
2. **Validate origin**: Check if request origin is in whitelist
3. **Return specific origin**: Never return wildcard `*`
4. **Set Vary header**: For proper caching
5. **Monitor**: Log CORS violations

---

## 🔒 Security Best Practices

| Practice | Why | Example |
|----------|-----|---------|
| **No Wildcard** | Prevents data theft | ✅ `https://domain.com` ❌ `*` |
| **Whitelist** | Only allow known origins | `CORS_WHITELIST=domain1.com,domain2.com` |
| **HTTPS Only** | Prevent man-in-the-middle | Use HTTPS in production |
| **Environment Config** | Easy to manage | `.env` file per environment |
| **Monitor & Log** | Detect attacks | Log all CORS rejections |
| **Validate Input** | Defense in depth | Check origin header format |

---

## 📊 Metrics & Monitoring

### What to Monitor

```javascript
// Log all CORS interactions
[CORS ALLOWED] Origin: https://trusted.com
[CORS REJECTED] Origin: https://attacker.com
[CORS VIOLATION] Many rejections from attacker.com
```

### Alerts

Set up alerts if:
- New unknown origins attempting access
- Spike in CORS rejections
- Repeated violations from specific origin

---

## 🐛 Troubleshooting

### Q: CORS headers not showing?
**A**: Check if endpoint is being called. Use DevTools Network tab.

### Q: Getting 403 on whitelisted domain?
**A**: Check whitelist matches EXACTLY (protocol, port, domain must match)

### Q: Demo page not loading?
**A**: Ensure server running on port 3000 and CORS_WHITELIST set in .env

### Q: Still seeing `Access-Control-Allow-Origin: *`?
**A**: That's the vulnerable endpoint! Use `/cors/secure-data` for fix demo.

---

## 📝 Submission Checklist

For course submission, ensure:

- [ ] ✅ Code well-commented
- [ ] ✅ Vulnerable endpoint demonstrates issue
- [ ] ✅ Secure endpoint demonstrates fix
- [ ] ✅ Interactive demo works
- [ ] ✅ Tests pass (manual or automated)
- [ ] ✅ Documentation complete
- [ ] ✅ Deployed to Render
- [ ] ✅ Monitoring configured

---

## 👨‍💻 Code Examples

### Example 1: Express + CORS Fix

```javascript
// ✅ Correct way to implement CORS
const cors = (req, res, next) => {
  const origin = req.headers.origin
  const whitelist = process.env.CORS_WHITELIST.split(',')
  
  if (whitelist.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
  }
  
  next()
}

app.use(cors)
```

### Example 2: Middleware Pattern

```javascript
// middlewares/cors.middleware.js
module.exports = (req, res, next) => {
  // ... CORS logic
}

// index.js
app.use(require('./middlewares/cors.middleware'))
```

### Example 3: Per-Route CORS

```javascript
router.get('/api/secure', corsMiddleware, (req, res) => {
  res.json({ data: 'secure' })
})
```

---

## 🔗 References

- [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [OWASP: CORS](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Origin_Resource_Sharing_Cheat_Sheet.html)
- [PortSwigger: CORS](https://portswigger.net/web-security/cors)

---

## 📄 License & Attribution

- Project: `webnc` - Tour Booking Web Application
- Security Demo: CORS Misconfiguration
- Created: December 2024
- For: Secure Web Software Development Course

---

## ✨ Features Summary

| Feature | Status | Details |
|---------|--------|---------|
| Vulnerable endpoint demo | ✅ | Shows data exfiltration |
| Secure endpoint demo | ✅ | Demonstrates fix |
| Interactive UI | ✅ | Real-time attack/test |
| Documentation | ✅ | 4 detailed guides |
| Tests | ✅ | Comprehensive test cases |
| Deployment | ✅ | Render-ready |
| Monitoring | ✅ | CORS violation logging |
| Best practices | ✅ | Security checklist |

---

## 🎯 Next Steps

1. **Run locally**: Follow Quick Start
2. **Explore code**: Read implementation
3. **Run tests**: Execute test cases
4. **Deploy**: Follow deployment guide
5. **Monitor**: Set up logging on Render
6. **Present**: Demonstrate to class!

---

**Status**: ✅ **COMPLETE AND PRODUCTION READY**

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Made with ❤️ for Secure Web Development**

---

Need help? Check the docs or contact instructor!
