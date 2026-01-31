# Railway Deployment Guide

## Bước 1: Chuẩn bị

1. Tạo tài khoản tại [railway.app](https://railway.app)
2. Cài GitHub và push code lên repo

## Bước 2: Deploy

1. Vào Railway Dashboard → New Project → Deploy from GitHub
2. Chọn repository `oniscenary_store`
3. Railway tự động detect và deploy

**Cấu hình (Railway tự động detect):**
- Build Command: `npm run build`
- Start Command: `npm run server`
- Port: 3000

## Bước 3: Truy cập

Sau khi deploy xong, Railway cung cấp URL:
- `https://your-app.railway.app`

Truy cập từ máy tính hoặc điện thoại đều dùng cùng URL này!

## Ưu điểm Railway:
✅ Miễn phí (500 giờ/tháng)
✅ Hỗ trợ file system → data.json lưu được
✅ Tự động HTTPS
✅ Deploy đơn giản, không cần config
✅ Persistent storage (dữ liệu không mất khi redeploy)

## Lưu ý:
- Dữ liệu lưu trong file `data.json` trên server
- Persistent storage cần enable trong Railway settings
