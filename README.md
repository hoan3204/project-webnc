trang admin : /admin123
tài khoản demo
Hoan12345@gmail.com
Hoan12345@

## CORS demo

Ứng dụng có sẵn 2 endpoint minh họa cấu hình CORS không an toàn và bản vá bằng whitelist:

- `GET /cors-demo/insecure`: phản hồi với `Access-Control-Allow-Origin: *` để mô phỏng việc mọi origin đều đọc được dữ liệu nhạy cảm.
- `GET /cors-demo/secure`: chỉ cho phép origin nằm trong whitelist, trả về 403 cho origin không hợp lệ.

Thiết lập whitelist bằng biến môi trường `CORS_WHITELIST` (phân tách bằng dấu phẩy), ví dụ:

```
CORS_WHITELIST=https://example.com,https://trusted.app
```
