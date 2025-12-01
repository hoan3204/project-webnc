# 📋 CORS Demo - Quick Reference Guide

## 🎯 Project Overview

**Title**: CORS Misconfiguration - Data Exfiltration & Fix with Whitelist  
**Course**: Secure Web Software Development  
**Created**: December 2024  
**Status**: ✅ Production Ready

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `controllers/client/cors.controller.js` | Vulnerable & Secure endpoints |
| `routers/client/cors.route.js` | CORS routes configuration |
| `middlewares/client/cors.middleware.js` | Reusable CORS middleware |
| `security-demo/cors/vulnerable-site/index.html` | Interactive demo UI |
| `security-demo/cors/docs/CORS_VULNERABILITY.md` | Technical documentation |
| `.env` | Contains `CORS_WHITELIST` config |

---

## 🚀 Getting Started (5 minutes)

```bash
# 1. Navigate to project
cd f:\webnc

# 2. Ensure .env has CORS_WHITELIST
# CORS_WHITELIST=http://localhost:3000

# 3. Start server
npm start

# 4. Open browser
# http://localhost:3000/cors-demo/

# 5. Click buttons to see attack/test
```

---

## 🎮 Demo Interface Features

### Attack Vulnerable Endpoint
```
Button: 🚀 Thực Hiện Attack
Result: Shows real-time CORS headers and stolen data
Purpose: Demonstrate vulnerability
```

### Test Secure Endpoint
```
Button: 🔍 Test Secure Endpoint
Result: Shows rejection for non-whitelisted origins
Purpose: Demonstrate fix
```

### View Configuration
```
Display: Current CORS whitelist
Purpose: Show allowed origins
```

---

## 🔍 Endpoints

### 1. Vulnerable Endpoint ❌
```
GET /cors/insecure-data

CORS Header: Access-Control-Allow-Origin: *
Response: { apiKey: '...', userData: {...} }
Purpose: Demo - shows vulnerability
```

### 2. Secure Endpoint ✅
```
GET /cors/secure-data

CORS Header: Access-Control-Allow-Origin: [specific origin]
Response: Data only if origin in whitelist, 403 if not
Purpose: Demo - shows fix
```

### 3. Config Endpoint ⚙️
```
GET /cors/config

Response: { whitelist: [...], currentOrigin: '...', isAllowed: true/false }
Purpose: Debug - show CORS configuration
```

---

## 📊 Attack Flow

```
Attacker Site (attacker.com)
    ↓
JavaScript: fetch('/cors/insecure-data')
    ↓
Browser CORS Check
    ↓
Server Response: "Access-Control-Allow-Origin: *" ✓
    ↓
Browser Allows Request ✓
    ↓
Sensitive Data Stolen! 🎯
```

---

## 🛡️ Protection Flow

```
Attacker Site (attacker.com)
    ↓
JavaScript: fetch('/cors/secure-data')
    ↓
Browser CORS Check: Origin: attacker.com
    ↓
Server Validates: "attacker.com in whitelist?"
    ↓
Not Found! → Return 403 Forbidden ❌
    ↓
Browser Blocks Request (CORS Error)
    ↓
Attack Blocked! 🛡️
```

---

## 🧪 Testing Commands

### Test 1: Vulnerable (should work)
```bash
curl -H "Origin: https://attacker.com" \
     http://localhost:3000/cors/insecure-data | jq
```

### Test 2: Secure - Rejected (should fail)
```bash
curl -H "Origin: https://attacker.com" \
     http://localhost:3000/cors/secure-data | jq
# Response: 403 Forbidden
```

### Test 3: Secure - Allowed (should work)
```bash
curl -H "Origin: http://localhost:3000" \
     http://localhost:3000/cors/secure-data | jq
# Response: 200 OK + data
```

---

## ⚙️ Configuration

### .env Setup
```env
# Whitelist of allowed origins (comma-separated)
CORS_WHITELIST=http://localhost:3000,https://yourdomain.com
```

### For Production (Render)
```env
CORS_WHITELIST=https://yourdomain.com,https://app.yourdomain.com
```

---

## 📚 Documentation Files

| Document | Content | When to Read |
|----------|---------|--------------|
| **CORS_VULNERABILITY.md** | Detailed vulnerability explanation | Learning the issue |
| **IMPLEMENTATION.md** | How to fix CORS issues | Learning the fix |
| **TEST_CASES.md** | Comprehensive test scenarios | Running tests |
| **DEPLOY_GUIDE.md** | Deploy to Render | Going to production |
| **README.md** | Overview & quick start | Getting started |

---

## 🎓 Key Concepts

### What is CORS?
Cross-Origin Resource Sharing - allows different domains to communicate

### The Vulnerability
```javascript
// ❌ WRONG: Wildcard
res.setHeader('Access-Control-Allow-Origin', '*')

// ✅ RIGHT: Whitelist
if (whitelist.includes(origin)) {
  res.setHeader('Access-Control-Allow-Origin', origin)
}
```

### Why It Matters
Without proper CORS config:
- ❌ Any website can steal your API keys
- ❌ User data can be exfiltrated
- ❌ Authentication tokens leaked

### The Fix
1. **Don't use `*`** in production
2. **Define whitelist** of trusted origins
3. **Validate each request** against whitelist
4. **Return specific origin** in response header

---

## 🔒 Security Best Practices

✅ **DO**:
- Use whitelist for allowed origins
- Return specific origin (never `*`)
- Set `Vary: Origin` header
- Use HTTPS in production
- Log CORS violations
- Validate origin on every request

❌ **DON'T**:
- Use `Access-Control-Allow-Origin: *`
- Hardcode origins in code
- Allow `*` for credentials
- Skip validation in production
- Ignore CORS errors

---

## 📊 CORS Headers Reference

| Header | Purpose | Example |
|--------|---------|---------|
| **Access-Control-Allow-Origin** | Which origins allowed | `https://domain.com` or `*` |
| **Vary** | Cache key includes Origin | `Origin` |
| **Access-Control-Allow-Methods** | Allowed HTTP methods | `GET, POST` |
| **Access-Control-Allow-Headers** | Allowed request headers | `Content-Type` |
| **Access-Control-Max-Age** | Preflight cache time | `86400` |

---

## 🚀 Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "CORS security demo"
   git push
   ```

2. **Create on Render**
   - Connect GitHub repo
   - Set environment variables
   - Deploy!

3. **Test Production**
   ```bash
   curl -H "Origin: yourdomain.com" \
        https://your-app.render.com/cors/secure-data
   ```

---

## 🐛 Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| Demo page not loading | Server not running | `npm start` |
| Getting 403 on own domain | Domain not in whitelist | Update `.env` CORS_WHITELIST |
| CORS headers missing | Wrong endpoint | Use `/cors/secure-data` not `/cors/insecure-data` |
| Still seeing `*` | Using vulnerable endpoint | This is intentional for demo! |

---

## 📝 Checklist Before Submission

- [ ] Code runs locally
- [ ] Demo interface works
- [ ] Both endpoints work correctly
- [ ] Documentation complete
- [ ] Tests pass
- [ ] Deployed to Render
- [ ] Environment variables set
- [ ] CORS whitelist configured

---

## 🎯 Learning Outcomes

After completing this project, you should be able to:

1. **Identify** CORS misconfiguration vulnerabilities
2. **Explain** how CORS attacks work (data exfiltration)
3. **Implement** CORS whitelist protection
4. **Test** CORS security
5. **Deploy** securely to production
6. **Monitor** CORS violations

---

## 📞 Quick Help

### Q: How do I run the demo?
**A**: 
1. `cd f:\webnc`
2. `npm start`
3. Open `http://localhost:3000/cors-demo/`
4. Click buttons!

### Q: What's the vulnerability?
**A**: `Access-Control-Allow-Origin: *` lets ANY domain steal data

### Q: How is it fixed?
**A**: Only allow specific domains via whitelist

### Q: How do I deploy?
**A**: See `DEPLOY_GUIDE.md` for Render deployment

---

## 🔗 Resources

- [CORS_VULNERABILITY.md](./docs/CORS_VULNERABILITY.md) - Detailed explanation
- [IMPLEMENTATION.md](./docs/IMPLEMENTATION.md) - How to fix
- [TEST_CASES.md](./docs/TEST_CASES.md) - Test scenarios
- [DEPLOY_GUIDE.md](./docs/DEPLOY_GUIDE.md) - Production deployment
- [MDN CORS Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

## 🎓 For Your Professor

**Key Demonstration Points:**

1. **Vulnerability**: Show `/cors/insecure-data` accepts `*` header
2. **Attack**: Click "Attack" button to simulate data theft
3. **Fix**: Show `/cors/secure-data` with whitelist validation
4. **Protection**: Show rejection logs for non-whitelisted origins
5. **Production**: Show deployment on Render with monitoring

**Code Quality:**
- Well-commented code
- Security best practices applied
- Comprehensive documentation
- Production-ready implementation
- Proper error handling

---

**Status**: ✅ READY TO PRESENT  
**Last Updated**: December 2024  
**Version**: 1.0.0

---

**Made with ❤️ for Secure Web Development**

Start by running the demo: `npm start` → Open `/cors-demo/`
