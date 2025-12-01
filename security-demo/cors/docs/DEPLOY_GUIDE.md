# CORS Security Demo - Deployment Guide

## 🚀 Deployment to Render

### Prerequisites

- [x] Render account created
- [x] Git repository pushed to GitHub
- [x] Project forked/cloned locally

### Step 1: Prepare for Deployment

#### 1.1 Update .env.example

**File: `.env.example`**
```env
# CORS Configuration - List all allowed origins separated by comma
CORS_WHITELIST=https://yourdomain.com,https://app.yourdomain.com,http://localhost:3000

# Other existing configs...
MONGODB_URI=...
CLOUDINARY_NAME=...
# etc.
```

#### 1.2 Commit Changes

```bash
cd f:\webnc
git add .
git commit -m "feat: Add CORS security demo with whitelist protection"
git push origin main
```

### Step 2: Configure Render Service

#### 2.1 Create New Web Service on Render

1. Go to [https://dashboard.render.com](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the branch (main)
5. Configure:
   - **Name**: `webnc-cors-demo` (or your preferred name)
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start` or `node index.js`

#### 2.2 Set Environment Variables

In Render Dashboard → Your Service → Environment:

```
CORS_WHITELIST=https://your-app.render.com,https://yourdomain.com,https://app.yourdomain.com
MONGODB_URI=your_mongo_uri
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
```

**Important**: Only include YOUR legitimate domains, not any random domains

#### 2.3 Deploy

Click "Create Web Service" and wait for deployment to complete.

### Step 3: Verify Deployment

#### 3.1 Get Your Render URL

```
https://your-app.render.com
```

#### 3.2 Test Endpoints

**Test 1: Vulnerable Endpoint (demonstrates risk)**
```bash
curl -X GET https://your-app.render.com/cors/insecure-data \
  -H "Origin: https://attacker.com" \
  -v
```

Should return: ✅ 200 OK + Sensitive Data + `Access-Control-Allow-Origin: *`

**Test 2: Secure Endpoint (protected)**
```bash
curl -X GET https://your-app.render.com/cors/secure-data \
  -H "Origin: https://attacker.com" \
  -v
```

Should return: ❌ 403 Forbidden

**Test 3: Secure Endpoint (whitelisted)**
```bash
curl -X GET https://your-app.render.com/cors/secure-data \
  -H "Origin: https://your-app.render.com" \
  -v
```

Should return: ✅ 200 OK + CORS headers with specific origin

#### 3.3 Interactive Demo

Open in browser:
```
https://your-app.render.com/cors-demo/
```

Click buttons to see attack/test scenarios.

### Step 4: Production Checklist

- [ ] **CORS Whitelist Set**: Verify `CORS_WHITELIST` env var contains your domain
- [ ] **HTTPS Only**: Ensure all URLs use HTTPS (Render provides free SSL)
- [ ] **Domain Configured**: Set your custom domain if using one
- [ ] **Logging Enabled**: Check Render logs for CORS violations
- [ ] **Not Using Wildcard**: Verify no `*` in production CORS headers
- [ ] **Database Connected**: Ensure MongoDB connection working
- [ ] **Other Services**: Verify all dependent services are running

---

## 📊 Monitoring & Logs

### View Logs on Render

1. Dashboard → Your Service → Logs
2. Filter for CORS violations:
   ```
   CORS VIOLATION
   CORS ALLOWED
   CORS policy
   ```

### Monitor CORS Attacks

**Look for patterns like:**
```
[CORS REJECTION] Origin https://unknown-domain.com not in whitelist
[CORS REJECTION] Origin https://attacker-site.com not in whitelist
```

### Add Monitoring Alert

If you notice repeated CORS violations:

```javascript
// Add to cors.controller.js
const corsViolationCount = {}

if (!isAllowed) {
  corsViolationCount[origin] = (corsViolationCount[origin] || 0) + 1
  
  // Alert if many violations from same origin
  if (corsViolationCount[origin] > 10) {
    console.error(`[ALERT] Many CORS violations from ${origin}!`)
    // Could send notification/alert
  }
}
```

---

## 🔐 Security Recommendations for Production

### 1. Update Whitelist Regularly

```env
# DO THIS
CORS_WHITELIST=https://yourdomain.com,https://app.yourdomain.com

# DON'T DO THIS
CORS_WHITELIST=*
CORS_WHITELIST=https://any-domain.com,https://another-domain.com
```

### 2. Use HTTPS Only

All whitelisted origins should use HTTPS:
```env
# ✅ GOOD
CORS_WHITELIST=https://secure-domain.com,https://app.yourdomain.com

# ❌ BAD
CORS_WHITELIST=http://insecure.com,https://domain.com
```

### 3. Separate Staging & Production Whitelist

**Staging** (for testing):
```
CORS_WHITELIST=http://localhost:3000,https://staging.yourdomain.com
```

**Production** (restricted):
```
CORS_WHITELIST=https://yourdomain.com,https://app.yourdomain.com
```

### 4. Monitor CORS Violations

Create alerts if:
- New unknown origins trying to access
- Spike in CORS rejections
- Specific attacker patterns

### 5. Rotate Credentials

If attack suspected:
1. Regenerate API keys
2. Update `.env` whitelist
3. Rotate database credentials
4. Review access logs

---

## 🧪 Test on Render

### Create Test Script

**File: `test-deployment.sh`**

```bash
#!/bin/bash

BASE_URL="https://your-app.render.com"

echo "Testing CORS deployment on Render..."
echo "Base URL: $BASE_URL"

echo -e "\n1. Testing vulnerable endpoint..."
curl -X GET "$BASE_URL/cors/insecure-data" \
  -H "Origin: https://attacker.com" \
  -H "Content-Type: application/json" \
  | jq '.'

echo -e "\n2. Testing secure endpoint (rejected)..."
curl -X GET "$BASE_URL/cors/secure-data" \
  -H "Origin: https://attacker.com" \
  -H "Content-Type: application/json" \
  | jq '.'

echo -e "\n3. Testing secure endpoint (allowed)..."
curl -X GET "$BASE_URL/cors/secure-data" \
  -H "Origin: $BASE_URL" \
  -H "Content-Type: application/json" \
  | jq '.'

echo -e "\n4. Checking config..."
curl -X GET "$BASE_URL/cors/config" \
  -H "Content-Type: application/json" \
  | jq '.whitelist'
```

**Run tests:**
```bash
bash test-deployment.sh
```

---

## 🚨 Troubleshooting

### Issue: CORS headers not present in production

**Cause**: Environment variable not set
**Fix**: 
```bash
# Verify in Render dashboard
# Settings → Environment → CORS_WHITELIST should be set
```

### Issue: Getting 403 for legitimate requests

**Cause**: Domain not in whitelist or protocol/port mismatch
**Fix**:
```env
# Check whitelist includes EXACT origin:
# Must match: https://domain.com:443 (HTTPS standard port)
# NOT: http://domain.com (different protocol)
# NOT: https://domain.com:3000 (different port)
```

### Issue: Wildcard still appearing in headers

**Cause**: Vulnerable endpoint being used
**Fix**: This is intentional for demo! Secure endpoint uses specific origin.

### Issue: No logs appearing

**Cause**: Logs not flushed or service not running
**Fix**:
```bash
# Check service status on Render dashboard
# Redeploy if needed: Dashboard → Redeploy
```

---

## 📝 Deployment Checklist

### Before Deploying
- [ ] Code committed and pushed
- [ ] .env.example updated with proper documentation
- [ ] No hardcoded secrets in code
- [ ] CORS_WHITELIST configured for your domain
- [ ] Tests passing locally

### After Deploying
- [ ] Service is "Live" on Render
- [ ] All endpoints responding
- [ ] Vulnerable endpoint returns data
- [ ] Secure endpoint returns 403 for non-whitelisted origins
- [ ] Secure endpoint returns data for whitelisted origins
- [ ] CORS headers correct
- [ ] Logs visible in Render dashboard
- [ ] Custom domain configured (if applicable)

### Production Maintenance
- [ ] Monitor logs for CORS violations
- [ ] Check whitelist is still relevant
- [ ] Update domains when needed
- [ ] Review and update credentials periodically
- [ ] Keep dependencies updated

---

## 🎓 Educational Material for Deployment

### For Your Professor/Instructor

**Demonstrate:**
1. **Vulnerability**: Show how vulnerable endpoint accepts `*`
2. **Attack**: Click "Attack" in demo to show data exfiltration
3. **Protection**: Show how secure endpoint rejects non-whitelisted origins
4. **Configuration**: Show environment variables and how they control security

**Deployment Details**:
- Show Render dashboard configuration
- Show environment variables setup
- Demonstrate logs showing CORS violations
- Show monitoring of attacks

**Code Quality**:
- Well-commented code
- Proper error handling
- Security best practices
- Comprehensive documentation

---

## 📚 Reference Material

- [Render Docs: Environment Variables](https://render.com/docs/environment-variables)
- [Render Docs: Deployment](https://render.com/docs/deploy)
- [CORS Security Guide](./CORS_VULNERABILITY.md)
- [Implementation Details](./IMPLEMENTATION.md)
- [Test Cases](./TEST_CASES.md)

---

**Status**: ✅ Ready for Production Deployment  
**Last Updated**: December 2024
**Next Steps**: Deploy to Render and monitor!
