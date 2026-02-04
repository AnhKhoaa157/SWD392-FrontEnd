# 🚀 Các Bước Tiếp Theo

## ✅ Đã Hoàn Thành

1. ✅ Cấu hình API base URL trỏ đến backend Render
2. ✅ Tạo environment variables files (.env.production, .env.local, .env.example)
3. ✅ Cập nhật CORS trong backend để cho phép Vercel
4. ✅ Cập nhật README với hướng dẫn đầy đủ
5. ✅ Tạo DEPLOYMENT.md với hướng dẫn chi tiết
6. ✅ Tăng timeout lên 30s để xử lý cold start của Render

## 📋 Bước Tiếp Theo - Frontend

### 1. Commit và Push Frontend Changes

```bash
# Di chuyển vào thư mục Frontend
cd d:\GitHub\SWD392-FrontEnd

# Kiểm tra thay đổi
git status

# Add tất cả files
git add .

# Commit
git commit -m "feat: Integrate production API and configure Vercel deployment

- Update API base URL to use Render deployment
- Add environment variables configuration
- Increase timeout to 30s for Render cold starts
- Add deployment documentation
- Update README with deployment instructions"

# Push lên GitHub
git push origin main
```

### 2. Deploy lên Vercel

#### Tùy Chọn A: Tự Động (Khuyến Nghị)
- Nếu đã kết nối GitHub với Vercel, việc push code sẽ tự động trigger deployment
- Truy cập Vercel dashboard để theo dõi build

#### Tùy Chọn B: Thủ Công
```bash
# Cài Vercel CLI nếu chưa có
npm install -g vercel

# Login
vercel login

# Deploy production
vercel --prod
```

### 3. Cấu Hình Environment Variables trên Vercel

Vào Vercel Dashboard → Project Settings → Environment Variables

Thêm:
```
Name: VITE_API_BASE_URL
Value: https://swd392-swagger-pages.onrender.com/api
Environments: Production, Preview, Development
```

### 4. Test Deployment

Sau khi deploy xong:
1. Mở URL Vercel của bạn (ví dụ: https://swd392-front-end.vercel.app)
2. Mở Developer Console (F12) → Network tab
3. Thử login hoặc gọi API
4. Verify requests đi tới: `https://swd392-swagger-pages.onrender.com/api`

---

## 📋 Bước Tiếp Theo - Backend

### 1. Cập Nhật Environment Variable trên Render

**QUAN TRỌNG**: Cần thêm URL frontend vào environment variables

Truy cập Render Dashboard:
1. Chọn service backend của bạn
2. Environment → Add Environment Variable
3. Thêm:
   ```
   FRONTEND_URL=https://your-actual-vercel-url.vercel.app
   ```
4. Thay `your-actual-vercel-url` bằng URL thực tế từ Vercel

### 2. Commit và Push Backend Changes

```bash
# Di chuyển vào thư mục Backend
cd d:\GitHub\SWD392\BE

# Kiểm tra thay đổi
git status

# Add files
git add src/app.js

# Commit
git commit -m "feat: Update CORS to allow Vercel deployment

- Add Vercel URLs to CORS whitelist
- Support preview deployments with regex pattern
- Add FRONTEND_URL environment variable support"

# Push lên GitHub
git push origin main
```

### 3. Redeploy Backend (nếu cần)

Render sẽ tự động redeploy khi detect commit mới, hoặc:
- Vào Render Dashboard
- Click "Manual Deploy" → "Deploy latest commit"

---

## 🧪 Testing Checklist

Sau khi cả Frontend và Backend đã deploy:

### Frontend Testing
- [ ] Trang chủ load được
- [ ] Không có CORS errors trong Console
- [ ] API calls có base URL đúng
- [ ] Login/Register hoạt động
- [ ] Protected routes hoạt động
- [ ] Responsive trên mobile

### Backend Testing
- [ ] Swagger docs access được: https://swd392-swagger-pages.onrender.com/api-docs/
- [ ] CORS headers có trong response
- [ ] API endpoints trả về đúng data
- [ ] Authentication hoạt động

### Integration Testing
- [ ] Login từ Frontend → Backend
- [ ] JWT token được lưu và gửi đúng
- [ ] Protected API calls hoạt động
- [ ] Error handling hiển thị đúng

---

## 🔍 URLs Cần Lưu Ý

Sau khi deploy, bạn sẽ có các URLs sau:

### Frontend (Vercel)
- Production: `https://your-project.vercel.app`
- Preview: `https://your-project-xxx.vercel.app` (cho mỗi PR)

### Backend (Render)
- API: `https://swd392-swagger-pages.onrender.com/api`
- Swagger: `https://swd392-swagger-pages.onrender.com/api-docs/`

**Cập nhật FRONTEND_URL trong Render với URL production thực tế của bạn!**

---

## 🆘 Nếu Gặp Lỗi

### CORS Error
1. Kiểm tra backend đã push code CORS mới chưa
2. Verify FRONTEND_URL trong Render environment variables
3. Check browser console cho chi tiết

### API Timeout
1. First request có thể mất 30s-1 phút (Render cold start)
2. Đợi và retry
3. Nâng cấp Render plan nếu cần

### 404 Errors trên Frontend
1. Check `vercel.json` rewrites config
2. Verify routing trong React app

---

## 📞 Cần Trợ Giúp?

- Đọc DEPLOYMENT.md cho hướng dẫn chi tiết
- Check Vercel logs: Dashboard → Deployments → Click deployment → View Function Logs
- Check Render logs: Dashboard → Service → Logs tab

---

**Chúc bạn deploy thành công! 🎉**
