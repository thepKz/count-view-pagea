# View Counter - Hệ thống đếm lượt xem trang web

Hệ thống đơn giản giúp theo dõi và hiển thị số lượt xem của bất kỳ trang web nào.

## Tính năng

- Đếm lượt xem trang web
- Theo dõi lượt xem theo ngày
- Chống đếm trùng lặp (trong 24h)
- Widget hiển thị lượt xem
- Dashboard quản lý

## Yêu cầu hệ thống

- Node.js (v14+ đề xuất)
- MongoDB

## Cài đặt

1. Clone repository

```bash
git clone https://github.com/your-username/view-counter.git
cd view-counter
```

2. Cài đặt dependencies

```bash
npm install
```

3. Cấu hình môi trường

Tạo file `.env` với nội dung:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/view-counter
NODE_ENV=development
```

4. Khởi chạy ứng dụng

```bash
# Phát triển
npm run dev

# Production
npm start
```

## Cách sử dụng

1. Mở trình duyệt và truy cập `http://localhost:5000`
2. Đăng ký website mới
3. Sao chép đoạn mã và nhúng vào website của bạn:

```html
<script src="http://localhost:5000/counter.js" data-site-id="YOUR_SITE_ID"></script>
```

4. Để hiển thị số lượt xem, thêm thẻ HTML với class "view-counter":

```html
<span class="view-counter"></span>
```

5. Hoặc sử dụng widget:

```html
<iframe src="http://localhost:5000/counter-widget/YOUR_SITE_ID" frameborder="0" style="height:30px;"></iframe>
```

## Triển khai thực tế

Khi triển khai hệ thống trên server thực tế:

1. Cấu hình MongoDB (local hoặc cloud như MongoDB Atlas)
2. Cấu hình biến môi trường (NODE_ENV=production)
3. Đảm bảo domain và CORS được cấu hình đúng

## API Endpoints

- `POST /api/counter/register`: Đăng ký website mới
- `GET /api/counter/:siteId`: Lấy thông tin counter
- `POST /api/counter/:siteId/view`: Tăng lượt xem
- `GET /api/counter`: Lấy tất cả counters

## License

MIT #   c o u n t - v i e w - p a g e a  
 