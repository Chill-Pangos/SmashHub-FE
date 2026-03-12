# Hướng Dẫn Sitemap & Google Search Console

## Files đã tạo

### 1. sitemap.xml

Tệp sitemap chứa các URL công khai của SmashHub để giúp Google và các công cụ tìm kiếm khác crawl trang web hiệu quả hơn.

**Vị trí:** `public/sitemap.xml`

**Các URLs công khai:**

- `/` - Trang chủ (priority: 1.0, changefreq: daily)
- `/tournaments` - Danh sách giải đấu công khai (priority: 0.9, changefreq: daily)
- `/scoreboard` - Bảng điểm trực tiếp (priority: 0.8, changefreq: hourly)

### 2. robots.txt

Tệp robots.txt hướng dẫn các search engine bots về những phần nào của trang web có thể crawl.

**Vị trí:** `public/robots.txt`

**Cấu hình:**

- Allow tất cả search engines crawl trang web
- Disallow các trang authentication và các trang yêu cầu đăng nhập
- Link đến sitemap.xml

## Cách sử dụng

### Bước 1: Domain đã được cấu hình

Domain đã được cấu hình là `https://smashhub.io.vn`

```xml
<!-- sitemap.xml -->
<loc>https://smashhub.io.vn/</loc>
```

```txt
# robots.txt
Sitemap: https://smashhub.io.vn/sitemap.xml
```

### Bước 2: Deploy

Sau khi deploy ứng dụng, các file này sẽ tự động có sẵn tại:

- `https://smashhub.io.vn/sitemap.xml`
- `https://smashhub.io.vn/robots.txt`

### Bước 3: Verify với Google Search Console

1. **Truy cập Google Search Console**
   - Đi đến: https://search.google.com/search-console
   - Đăng nhập bằng tài khoản Google

2. **Thêm Property**
   - Click "Add Property"
   - Chọn "URL prefix"
   - Nhập: `https://smashhub.io.vn`
   - Click "Continue"

3. **Verify Ownership**
   Chọn một trong các phương thức verify:

   **Phương thức 1: HTML file upload**
   - Tải file HTML verification từ Google
   - Copy file vào thư mục `public/`
   - Deploy lại
   - Click "Verify" trong Google Search Console

   **Phương thức 2: HTML tag**
   - Copy meta tag từ Google
   - Thêm vào `index.html` trong thư mục root
   - Deploy lại
   - Click "Verify"

   **Phương thức 3: DNS record**
   - Thêm TXT record vào DNS của domain
   - Chờ DNS propagate
   - Click "Verify"

4. **Submit Sitemap**
   - Sau khi verify thành công
   - Vào menu "Sitemaps" trong Google Search Console
   - Nhập: `sitemap.xml`
   - Click "Submit"

5. **Kiểm tra Status**
   - Google sẽ crawl sitemap trong vài giờ/ngày
   - Kiểm tra status trong tab "Sitemaps"
   - Xem báo cáo coverage để đảm bảo tất cả URLs được index

## Maintenance

### Cập nhật changefreq và priority

- Điều chỉnh `changefreq` dựa trên tần suất cập nhật nội dung
- Điều chỉnh `priority` để phản ánh tầm quan trọng tương đối của các trang

### Thêm URLs mới

Khi thêm trang công khai mới, cập nhật sitemap.xml:

```xml
<url>
    <loc>https://smashhub.io.vn/new-page</loc>
    <lastmod>2026-03-13</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
</url>
```

### Cập nhật lastmod

Cập nhật `lastmod` khi có thay đổi quan trọng:

- Sau khi deploy phiên bản mới
- Khi thay đổi nội dung chính
- Format: YYYY-MM-DD

## Lưu ý quan trọng

1. **URL Structure**: SmashHub là SPA (Single Page Application), đảm bảo server configuration hỗ trợ HTML5 History API để các URLs hoạt động đúng.

2. **Dynamic Content**: Các trang như `/tournaments` và `/scoreboard` có nội dung động. Google có thể crawl React apps nhưng:
   - Đảm bảo SSR (Server-Side Rendering) nếu cần SEO tốt hơn
   - Hoặc sử dụng pre-rendering cho các trang quan trọng

3. **HTTPS**: Google ưu tiên các trang HTTPS. Đảm bảo deploy với SSL certificate.

4. **Mobile-Friendly**: Sử dụng Google's Mobile-Friendly Test để kiểm tra responsive design.

## Testing

### Kiểm tra local

```bash
# Sau khi build
npm run build
npm run preview

# Truy cập
http://localhost:4173/sitemap.xml
http://localhost:4173/robots.txt
```

### Kiểm tra production

```bash
curl https://smashhub.io.vn/sitemap.xml
curl https://smashhub.io.vn/robots.txt
```

### Validate sitemap

- Sử dụng: https://www.xml-sitemaps.com/validate-xml-sitemap.html
- Hoặc Google Search Console's Sitemap report

## Tài nguyên bổ sung

- [Google Search Console Help](https://support.google.com/webmasters)
- [Sitemap Protocol](https://www.sitemaps.org/protocol.html)
- [Robots.txt Specification](https://www.robotstxt.org/)
