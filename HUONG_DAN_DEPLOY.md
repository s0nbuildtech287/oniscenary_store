# 🚀 Hướng dẫn Deploy Oniscenary - Đồng bộ dữ liệu giữa máy tính và điện thoại

## ✅ KHUYẾN NGHỊ: Deploy lên Railway (Miễn phí, đơn giản nhất)

### Tại sao chọn Railway?
- ✅ **Miễn phí**: 500 giờ/tháng (đủ dùng)
- ✅ **Hỗ trợ file system**: Code hiện tại chạy ngay, không cần sửa
- ✅ **Persistent storage**: Dữ liệu không mất khi redeploy
- ✅ **Tự động HTTPS**: Bảo mật sẵn
- ✅ **Deploy 1 click**: Không cần config phức tạp

---

## 📋 CÁCH 1: Deploy lên Railway (Khuyến nghị)

### Bước 1: Tạo GitHub Repository

```bash
# Khởi tạo git (nếu chưa có)
git init
git add .
git commit -m "Initial commit"

# Tạo repo trên GitHub và push
git remote add origin https://github.com/your-username/oniscenary.git
git branch -M main
git push -u origin main
```

### Bước 2: Deploy lên Railway

1. Truy cập [railway.app](https://railway.app)
2. Đăng nhập bằng GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Chọn repository `oniscenary`
5. Railway tự động detect và deploy!

**Railway sẽ tự động:**
- Chạy `npm install`
- Chạy `npm run build`
- Chạy `npm run server`

### Bước 3: Enable Persistent Storage (Quan trọng!)

1. Vào project trên Railway
2. Click tab **"Settings"**
3. Scroll xuống **"Volumes"** → **"Add Volume"**
4. Mount Path: `/app` (hoặc để mặc định)
5. Save

**Lưu ý:** Bước này đảm bảo `data.json` không bị mất khi redeploy!

### Bước 4: Lấy URL và truy cập

1. Vào tab **"Settings"** → **"Generate Domain"**
2. Railway tạo URL dạng: `https://your-app.up.railway.app`
3. Copy URL này

### Bước 5: Truy cập từ mọi thiết bị

- **Máy tính**: Mở `https://your-app.up.railway.app`
- **Điện thoại**: Mở cùng URL trên
- **Dữ liệu đồng bộ ngay lập tức!** ✅

---

## 📋 CÁCH 2: Deploy lên Render (Thay thế Railway)

### Tương tự Railway, hoàn toàn miễn phí:

1. Truy cập [render.com](https://render.com)
2. New → Web Service → Connect GitHub
3. Chọn repository
4. Cấu hình:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run server`
   - **Environment**: Node
5. Create Web Service

---

## ⚠️ CÁCH 3: Deploy lên Vercel (Không khuyến nghị cho project này)

**Vấn đề:** Vercel là serverless, không hỗ trợ ghi file. Cần:
- Chuyển sang database (MongoDB, Vercel KV, etc.)
- Sửa lại code backend
- Phức tạp và có thể tốn phí

**→ Không phù hợp với cấu trúc hiện tại!**

---

## 🎯 TÓM TẮT: Chọn Railway

### Ưu điểm:
1. **Code hiện tại chạy ngay**, không cần sửa gì
2. **Miễn phí** 500 giờ/tháng
3. **Đồng bộ hoàn hảo** giữa máy tính và điện thoại
4. **Dữ liệu an toàn** với persistent storage
5. **Deploy trong 5 phút**

### Sau khi deploy:
- URL duy nhất: `https://your-app.railway.app`
- Truy cập từ **mọi thiết bị**: Máy tính, điện thoại, tablet
- Thêm phim ở máy tính → Thấy ngay trên điện thoại
- Dữ liệu lưu trong `data.json` trên server Railway

---

## 🔧 Troubleshooting

### Nếu gặp lỗi trên Railway:

1. **Check logs**: Railway Dashboard → Deployments → View logs
2. **Kiểm tra environment**: Đảm bảo `NODE_ENV=production`
3. **Volume**: Đảm bảo đã enable Persistent Storage

### Nếu dữ liệu bị mất sau redeploy:

→ Chưa enable **Persistent Storage** (xem Bước 3)

---

## 📞 Support

Nếu cần hỗ trợ thêm, check:
- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)

**Chúc deploy thành công! 🎉**
