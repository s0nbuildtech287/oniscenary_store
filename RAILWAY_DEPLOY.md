# 🚀 Deploy Oniscenary lên Railway

## Bước 1: Chuẩn bị GitHub Repository

### 1.1. Khởi tạo Git (nếu chưa có)

```bash
git init
git add .
git commit -m "Initial commit - Oniscenary Store"
```

### 1.2. Tạo Repository trên GitHub

1. Vào [github.com](https://github.com)
2. Click **"New repository"** (nút + góc trên bên phải)
3. Repository name: `oniscenary-store` (hoặc tên bạn muốn)
4. Để **Public** hoặc **Private** (Railway hỗ trợ cả 2)
5. **KHÔNG** chọn "Add README" hoặc ".gitignore"
6. Click **"Create repository"**

### 1.3. Push code lên GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/oniscenary-store.git
git branch -M main
git push -u origin main
```

**Thay `YOUR_USERNAME` bằng username GitHub của bạn!**

---

## Bước 2: Deploy lên Railway

### 2.1. Đăng ký/Đăng nhập Railway

1. Vào [railway.app](https://railway.app)
2. Click **"Login"**
3. Chọn **"Login with GitHub"**
4. Authorize Railway truy cập GitHub của bạn

### 2.2. Tạo Project mới

1. Tại Dashboard, click **"New Project"**
2. Chọn **"Deploy from GitHub repo"**
3. Tìm và chọn repository `oniscenary-store`
4. Railway bắt đầu deploy tự động! 🎉

### 2.3. Theo dõi Deploy

- Railway sẽ hiển thị logs realtime
- Đợi cho đến khi thấy:
  ```
  ✓ Build successful
  ✓ Deployment live
  🚀 Server running at http://localhost:3000
  ```

---

## Bước 3: Enable Persistent Storage ⚠️ QUAN TRỌNG

**Nếu bỏ qua bước này, dữ liệu sẽ bị mất khi redeploy!**

### 3.1. Tạo Volume

1. Trong project Railway, click tab **"Settings"**
2. Scroll xuống phần **"Volumes"**
3. Click **"+ New Volume"**
4. Cấu hình:
   - **Mount Path**: `/app/data.json` hoặc `/app`
   - Click **"Add"**

### 3.2. Restart Service

- Click **"Deployments"** tab
- Click **"Redeploy"** để áp dụng volume

---

## Bước 4: Lấy URL Public

### 4.1. Generate Domain

1. Click tab **"Settings"**
2. Scroll xuống **"Networking"** → **"Public Networking"**
3. Click **"Generate Domain"**
4. Railway tạo domain dạng: `your-app-name.up.railway.app`

### 4.2. Copy URL

- Copy URL này (ví dụ: `https://oniscenary-store-production.up.railway.app`)
- Đây là URL duy nhất để truy cập từ mọi thiết bị!

---

## Bước 5: Truy cập và Sử dụng 🎬

### 5.1. Truy cập từ Máy tính

1. Mở trình duyệt
2. Paste URL Railway: `https://your-app.railway.app`
3. Đăng nhập với tài khoản: `xu4ns0n` / `123456`
4. Thêm phim bình thường

### 5.2. Truy cập từ Điện thoại

1. Mở trình duyệt trên điện thoại
2. Nhập cùng URL: `https://your-app.railway.app`
3. Đăng nhập
4. **Thấy ngay phim vừa thêm từ máy tính!** ✅

### 5.3. Đồng bộ Real-time

- Thêm/sửa/xóa phim trên máy tính → Reload điện thoại → Thấy ngay
- Thêm/sửa/xóa phim trên điện thoại → Reload máy tính → Thấy ngay
- Dữ liệu lưu trong `data.json` trên server Railway

---

## 🔄 Cập nhật Code Sau khi Deploy

Khi bạn sửa code và muốn deploy lại:

```bash
git add .
git commit -m "Update features"
git push
```

**Railway tự động detect và redeploy!** Không cần làm gì thêm.

---

## 🐛 Troubleshooting

### Lỗi: "Application failed to respond"

**Nguyên nhân:** Port không đúng

**Giải pháp:**
1. Vào Railway → Settings → Environment Variables
2. Thêm: `PORT=3000`
3. Redeploy

### Lỗi: Dữ liệu bị mất sau redeploy

**Nguyên nhân:** Chưa enable Persistent Storage

**Giải pháp:** Xem lại Bước 3

### Lỗi: Cannot find module 'express'

**Nguyên nhân:** Dependencies chưa install

**Giải pháp:** Đã tự động fix, nhưng nếu vẫn lỗi:
1. Railway → Settings → Build Command
2. Đảm bảo là: `npm install && npm run build`

### Xem Logs

1. Railway Dashboard → Deployments
2. Click vào deployment mới nhất
3. Xem logs để debug

---

## 💰 Chi phí

**Railway Free Tier:**
- ✅ $5 credit/tháng
- ✅ 500 giờ execution/tháng
- ✅ Đủ cho app cá nhân

**Ước tính:** App này chạy 24/7 vẫn nằm trong free tier!

---

## 📱 Chia sẻ với bạn bè

URL Railway của bạn có thể chia sẻ cho bất kỳ ai:
- Mọi người dùng chung 1 kho phim
- Tất cả đều thấy dữ liệu đồng bộ
- Chỉ người có password mới đăng nhập được

---

## ✅ Checklist

- [ ] Push code lên GitHub
- [ ] Deploy lên Railway
- [ ] Enable Persistent Storage
- [ ] Generate Domain
- [ ] Test truy cập từ máy tính
- [ ] Test truy cập từ điện thoại
- [ ] Thêm phim và kiểm tra đồng bộ

**Chúc deploy thành công! 🎉**

---

## 🔗 Links hữu ích

- [Railway Dashboard](https://railway.app/dashboard)
- [Railway Docs](https://docs.railway.app)
- [GitHub Repository](https://github.com)
