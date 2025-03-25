const express = require('express');
const router = express.Router();
const {
  registerSite,
  getCounter,
  incrementView,
  getAllCounters,
  deleteCounter,
} = require('../controllers/counter');

// Đăng ký website mới
router.post('/register', registerSite);

// Lấy thông tin counter
router.get('/:siteId', getCounter);

// Tăng lượt xem
router.post('/:siteId/view', incrementView);

// Xóa counter
router.delete('/:siteId', deleteCounter);

// Lấy tất cả counters (cho dashboard)
router.get('/', getAllCounters);

module.exports = router; 