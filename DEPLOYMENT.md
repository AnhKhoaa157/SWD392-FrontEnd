# 📋 Hướng Dẫn Deploy Frontend lên Vercel

## 🎯 Tổng Quan

Hướng dẫn này sẽ giúp bạn deploy ứng dụng React Frontend lên Vercel và tích hợp với Backend API đã deploy trên Render.

### Thông Tin API
- **Backend URL**: https://swd392-swagger-pages.onrender.com
- **API Base URL**: https://swd392-swagger-pages.onrender.com/api
- **Swagger Docs**: https://swd392-swagger-pages.onrender.com/api-docs/

---

## 🚀 Bước 1: Chuẩn Bị Code

### 1.1 Kiểm tra cấu hình API đã được cập nhật

File `src/config/api.config.js` đã được cấu hình để sử dụng environment variables:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://swd392-swagger-pages.onrender.com/api';
```

### 1.2 Đảm bảo các file environment đã có

- ✅ `.env.production` - Dùng cho production build
- ✅ `.env.example` - Template cho các developer
- ✅ `.env.local` - Dùng cho local development (không commit)

---

## 🌐 Bước 2: Deploy lên Vercel

### Phương Án 1: Deploy qua Vercel Dashboard (Khuyến Nghị)

#### 2.1 Đăng nhập Vercel
1. Truy cập: https://vercel.com
2. Đăng nhập bằng GitHub account

#### 2.2 Import Project
1. Click **"Add New Project"** hoặc **"Import Project"**
2. Chọn GitHub repository của bạn: `SWD392-FrontEnd`
3. Click **"Import"**

#### 2.3 Cấu hình Project
**Framework Preset**: Vite được tự động detect

**Build & Development Settings**:
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`
- Development Command: `npm run dev`

#### 2.4 Thêm Environment Variables
Trong phần **Environment Variables**, thêm:

```
VITE_API_BASE_URL = https://swd392-swagger-pages.onrender.com/api
```

- Áp dụng cho: **Production**, **Preview**, và **Development**

#### 2.5 Deploy
1. Click **"Deploy"**
2. Đợi build hoàn tất (khoảng 1-2 phút)
3. Lấy URL production: `https://your-project.vercel.app`

---

### Phương Án 2: Deploy qua Vercel CLI

#### 2.1 Cài đặt Vercel CLI
```bash
npm install -g vercel
```

#### 2.2 Login
```bash
vercel login
```

#### 2.3 Deploy lần đầu
```bash
# Di chuyển vào thư mục project
cd d:\GitHub\SWD392-FrontEnd

# Deploy
vercel
```

Trả lời các câu hỏi:
- Set up and deploy? **Yes**
- Which scope? **Chọn account của bạn**
- Link to existing project? **No**
- Project name? **swd392-frontend** (hoặc tên bạn muốn)
- Directory? **./
- Override settings? **No**

#### 2.4 Deploy Production
```bash
vercel --prod
```

#### 2.5 Set Environment Variables
```bash
vercel env add VITE_API_BASE_URL production
# Nhập: https://swd392-swagger-pages.onrender.com/api
```

---

## 🔧 Bước 3: Cấu Hình Backend CORS

Backend cần cho phép requests từ Vercel domain. Cập nhật CORS trong backend:

```javascript
// BE/src/app.js hoặc config file
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://your-project.vercel.app',
    'https://*.vercel.app' // Cho phép tất cả preview deployments
  ],
  credentials: true
};

app.use(cors(corsOptions));
```

**Lưu ý**: Thay `your-project.vercel.app` bằng URL thực của bạn.

---

## ✅ Bước 4: Kiểm Tra Deployment

### 4.1 Test API Connection
1. Mở Developer Console (F12)
2. Chuyển tab **Network**
3. Thử login hoặc gọi API
4. Kiểm tra requests có gọi đến `https://swd392-swagger-pages.onrender.com/api`

### 4.2 Test chức năng
- ✅ Login/Register
- ✅ Load danh sách users
- ✅ CRUD operations
- ✅ Real-time features (nếu có)

---

## 🔄 Bước 5: Cập Nhật & Re-deploy

### Tự động (Khuyến Nghị)
1. Push code lên GitHub:
```bash
git add .
git commit -m "Update: Integrate production API"
git push origin main
```

2. Vercel sẽ tự động build và deploy

### Thủ công (qua CLI)
```bash
vercel --prod
```

---

## 🛠️ Xử Lý Lỗi Thường Gặp

### Lỗi 1: API calls bị CORS
**Triệu chứng**: Console hiển thị CORS error

**Giải pháp**: 
- Kiểm tra backend CORS config
- Thêm Vercel URL vào whitelist

### Lỗi 2: Environment variables không hoạt động
**Triệu chứng**: API vẫn gọi localhost

**Giải pháp**:
- Kiểm tra tên variable phải có prefix `VITE_`
- Re-deploy sau khi thêm env vars
- Clear cache: `vercel --force`

### Lỗi 3: Build fails
**Triệu chứng**: Build error trên Vercel

**Giải pháp**:
- Check logs trong Vercel Dashboard
- Test local build: `npm run build`
- Kiểm tra `package.json` dependencies

### Lỗi 4: Blank page sau deploy
**Triệu chứng**: Website trắng xóa

**Giải pháp**:
- Kiểm tra Console errors (F12)
- Verify routing config trong `vercel.json`
- Check base path trong `vite.config.js`

### Lỗ 5: Cold Start chậm (Render)
**Triệu chứng**: First request mất 30s-1 phút

**Giải pháp**:
- Đã tăng timeout lên 30s trong `api.config.js`
- Cân nhắc upgrade Render plan
- Thêm loading state trong UI

---

## 📊 Monitoring & Analytics

### Vercel Analytics (Khuyến Nghị)
1. Vào Project Settings → **Analytics**
2. Enable **Web Analytics**
3. Thêm vào code (optional):
```bash
npm install @vercel/analytics
```

```javascript
// src/main.jsx
import { Analytics } from '@vercel/analytics/react';

<>
  <App />
  <Analytics />
</>
```

---

## 🔐 Bảo Mật

### Environment Variables
- ❌ Không commit `.env.local` vào git
- ✅ Chỉ commit `.env.example` làm template
- ✅ Giữ secrets trong Vercel dashboard

### API Keys
- Không hardcode API keys trong code
- Sử dụng environment variables
- Rotate keys định kỳ

---

## 📞 Liên Hệ & Hỗ Trợ

- **GitHub Issues**: Report bugs trong repo
- **Vercel Support**: https://vercel.com/support
- **Team Contact**: [Email team của bạn]

---

## 📝 Checklist Deploy

Trước khi deploy, đảm bảo:

- [ ] Code đã được test local
- [ ] `.env.production` đã được tạo
- [ ] Backend CORS đã config đúng
- [ ] Vercel project đã được setup
- [ ] Environment variables đã được add
- [ ] First deployment thành công
- [ ] API integration đã test
- [ ] Error handling đã implement
- [ ] Loading states đã có
- [ ] Mobile responsive đã check

---

**Chúc bạn deploy thành công! 🎉**
