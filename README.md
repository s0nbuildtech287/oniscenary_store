# 🎬 ONISCENARY STORE — Kho Lưu Trữ Phim & Anime Cá Nhân

Oniscenary Store là một ứng dụng web hiện đại (SPA) được xây dựng bằng React 19 + TypeScript + Vite + TailwindCSS, hỗ trợ quản lý, sưu tầm và xem trực tiếp các tác phẩm Điện ảnh, Anime, Manga & TV Shows yêu thích với giao diện Glassmorphism cao cấp.

---

## 🚀 Tính năng nổi bật

- 🎬 Trình phát Video Player HD: Hỗ trợ nhúng phát trực tiếp Trailer & Tập phim từ YouTube (youtube-nocookie) hoặc các liên kết MP4/HLS chất lượng cao ngay trên ứng dụng mà không cần chuyển trang.
- 🤖 Trợ lý AI Gemini thông minh: Tích hợp AI Chatbot Gemini giúp tìm kiếm, phân tích và gợi ý bộ phim phù hợp với tâm trạng hoặc sở thích của người dùng.
- 💾 Tự động lưu file ổ cứng (data.json): Mọi thao tác Thêm / Sửa / Xóa phim trên giao diện local (npm run dev) đều được tự động ghi đè ngay lập tức vào file data.json trên ổ cứng máy tính, đảm bảo dữ liệu sẵn sàng khi deploy.
- 🔐 Bảo mật & Tự động lưu phiên (Session Persistence):
  - Tài khoản đăng nhập mặc định: xu4ns0n / Sondeptrai123@k
  - Tự động lưu phiên vào localStorage, không bắt người dùng đăng nhập lại khi tắt/mở lại trình duyệt.
- 🏆 Phân loại & Xếp hạng khoa học:
  - Lọc theo thể loại: Movie, Anime, Live Action, Manga/Truyện Tranh...
  - Lọc theo trạng thái: Hoàn thành, Đang xem, Dự định xem.
  - Sắp xếp theo Bảng xếp hạng điểm số (Rating 1-10) hoặc Thứ tự ưu tiên Top Order.
- 📱 Giao diện Glassmorphism Responsive: Tương thích hoàn hảo từ màn hình máy tính cho tới thiết bị di động.

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

- Frontend: React 19, TypeScript, Vite, TailwindCSS (CDN), FontAwesome Icons.
- AI Integration: Google GenAI SDK (@google/genai).
- Data Persistence: Local JSON storage (data.json), LocalStorage API, Custom Vite Server Middleware.
- Environment: Node.js (Vite Dev Server + Express fallback).

---

## 🔑 Tài khoản truy cập mặc định

- Tên đăng nhập: xu4ns0n
- Mật khẩu: Sondeptrai123@k

---

## 🚀 Hướng dẫn khởi động (Run Locally)

Yêu cầu tiên quyết:
- Đã cài đặt Node.js (phiên bản 18 trở lên).

Các bước thực hiện:

1. Cài đặt thư viện:
   npm install

2. Cấu hình API Key (Tùy chọn cho tính năng AI ChatBot):
   Tạo file .env hoặc .env.local tại thư mục gốc và thêm:
   GEMINI_API_KEY=your_gemini_api_key_here

3. Khởi chạy ứng dụng:
   npm run dev

   Mở trình duyệt và truy cập: http://localhost:5173

---

## 📦 Biên dịch & Đóng gói (Build & Deploy)

- Biên dịch sản phẩm:
  npm run build

Thư mục dist/ sau khi build sẽ chứa toàn bộ sản phẩm hoàn chỉnh cùng bộ dữ liệu mới nhất từ data.json, sẵn sàng deploy lên Vercel, Netlify, Render hoặc GitHub Pages.

---

## 📄 Giấy phép & Tác quyền

Được phát triển và duy trì bởi xu4ns0n. Bản quyền © 2026 Oniscenary.
