# Docker Setup Guide - Development

## 📦 Development Environment

### Chạy môi trường development với hot reload:

```bash
# Build và chạy container dev
docker-compose -f docker-compose.dev.yml up

# Hoặc chạy ở background
docker-compose -f docker-compose.dev.yml up -d

# Xem logs
docker-compose -f docker-compose.dev.yml logs -f

# Dừng container
docker-compose -f docker-compose.dev.yml down
```

App sẽ chạy tại: `http://localhost:5173`

**Tính năng dev mode:**

- ✅ Hot reload khi code thay đổi
- ✅ Source code được mount vào container
- ✅ Fast refresh với Vite
- ✅ Debug mode enabled

---

## 🔧 Environment Variables

File `.env` đã được tạo với cấu hình mặc định từ `.env.example`. Bạn có thể chỉnh sửa file này theo nhu cầu:

```env
VITE_API_URL=http://localhost:3000/api
VITE_ENV=development
VITE_APP_NAME=SmashHub
VITE_APP_VERSION=1.0.0
VITE_DEBUG=false
```

**Lưu ý:** Với Docker dev mode, environment variables được định nghĩa trong `docker-compose.dev.yml`.

---

## 🛠️ Useful Commands

```bash
# Rebuild container khi thay đổi dependencies
docker-compose -f docker-compose.dev.yml up --build

# Vào shell của container
docker-compose -f docker-compose.dev.yml exec smashhub-fe-dev sh

# Xóa tất cả (bao gồm volumes)
docker-compose -f docker-compose.dev.yml down -v

# Xem danh sách containers đang chạy
docker ps
```

---

## 📝 File Structure

- `Dockerfile.dev` - Development build với Vite dev server
- `docker-compose.dev.yml` - Development compose với hot reload
- `.dockerignore` - Files to exclude from Docker build
- `.env` - Environment variables cho development
