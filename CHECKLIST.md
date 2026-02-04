# ✅ Deployment Checklist

## Frontend - SWD392-FrontEnd

### Code Changes
- [x] Update API base URL in `src/config/api.config.js`
- [x] Create `.env.production` with production API URL
- [x] Create `.env.local` for local development
- [x] Create `.env.example` as template
- [x] Update README.md
- [x] Create DEPLOYMENT.md documentation
- [x] Increase API timeout to 30s

### Git Actions
- [ ] Review changes: `git status`
- [ ] Commit changes: `git commit -m "feat: Integrate production API"`
- [ ] Push to GitHub: `git push origin main`

### Vercel Setup
- [ ] Login to Vercel
- [ ] Import GitHub repository
- [ ] Configure build settings (auto-detected for Vite)
- [ ] Add environment variable: `VITE_API_BASE_URL`
- [ ] Deploy to production
- [ ] Get production URL
- [ ] Test deployment

---

## Backend - BE

### Code Changes
- [x] Update CORS config in `src/app.js`
- [x] Add Vercel URL support
- [x] Add regex for preview deployments

### Git Actions
- [ ] Review changes: `git status`
- [ ] Commit changes: `git commit -m "feat: Update CORS for Vercel"`
- [ ] Push to GitHub: `git push origin main`

### Render Setup
- [ ] Add `FRONTEND_URL` environment variable
- [ ] Set value to actual Vercel production URL
- [ ] Trigger redeploy (automatic or manual)
- [ ] Verify deployment

---

## Testing

### Basic Tests
- [ ] Frontend loads without errors
- [ ] No CORS errors in console
- [ ] API calls use correct base URL
- [ ] Swagger docs accessible

### Functionality Tests
- [ ] User registration works
- [ ] User login works
- [ ] JWT token stored correctly
- [ ] Protected routes work
- [ ] API CRUD operations work

### Integration Tests
- [ ] Frontend → Backend communication
- [ ] Authentication flow end-to-end
- [ ] Error handling displays correctly
- [ ] Loading states work properly

---

## 🎯 Current Status

### Completed ✅
1. API configuration updated to production
2. Environment variables created
3. CORS updated in backend
4. Documentation created
5. Timeout increased for cold starts

### Pending 📋
1. Commit and push Frontend code
2. Deploy to Vercel
3. Configure Vercel environment variables
4. Commit and push Backend code
5. Update Render environment variables
6. Test complete integration

---

## 📝 Important URLs

### Frontend
- Local Dev: http://localhost:5173
- Production: [Add after Vercel deployment]

### Backend
- Production API: https://swd392-swagger-pages.onrender.com/api
- Swagger Docs: https://swd392-swagger-pages.onrender.com/api-docs/

### Resources
- [DEPLOYMENT.md](DEPLOYMENT.md) - Detailed deployment guide
- [NEXT_STEPS.md](NEXT_STEPS.md) - Step-by-step instructions
- [README.md](README.md) - Project overview

---

**Last Updated**: 2026-02-04
