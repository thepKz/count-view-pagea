const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const setupCors = require('./middleware/cors');
const counterRoutes = require('./routes/counter');

// Đọc biến môi trường từ file .env
dotenv.config();

// Kết nối đến MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(setupCors());

// Cấu hình EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/counter', counterRoutes);

// Route cho trang chủ
app.get('/', (req, res) => {
  res.render('dashboard');
});

// Route để đăng ký website mới
app.get('/register', (req, res) => {
  res.render('register');
});

// Route cho widget
app.get('/counter-widget/:siteId', (req, res) => {
  const { siteId } = req.params;
  res.render('widget', { siteId });
});

// Route cho trang test
app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/counter-test.html'));
});

// Cấu hình port
const PORT = process.env.PORT || 5000;

// Khởi chạy server
app.listen(PORT, () => {
  console.log(`Server đang chạy ở chế độ ${process.env.NODE_ENV} trên port ${PORT}`);
}); 