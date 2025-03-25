const cors = require('cors');

// Cấu hình CORS middleware
const setupCors = () => {
  return cors({
    origin: '*', // Cho phép tất cả các origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Content-Length', 'Content-Type'],
    credentials: true,
    optionsSuccessStatus: 200,
    preflightContinue: false,
    maxAge: 86400 // 24 giờ
  });
};

module.exports = setupCors; 