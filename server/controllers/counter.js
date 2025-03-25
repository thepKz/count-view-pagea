const Counter = require('../models/counter');
const crypto = require('crypto');

// Tạo ID ngẫu nhiên
const generateSiteId = () => {
  return crypto.randomBytes(4).toString('hex');
};

// Đăng ký website mới
exports.registerSite = async (req, res) => {
  try {
    const { url, name } = req.body;

    if (!url || !name) {
      return res.status(400).json({ message: 'URL và tên website là bắt buộc' });
    }

    // Tạo ID ngẫu nhiên
    const siteId = generateSiteId();

    // Tạo counter mới
    const counter = new Counter({
      siteId,
      url,
      name,
      views: 0,
      dailyViews: [],
    });

    await counter.save();

    res.status(201).json({
      success: true,
      data: counter,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy thông tin counter
exports.getCounter = async (req, res) => {
  try {
    const { siteId } = req.params;

    const counter = await Counter.findOne({ siteId });

    if (!counter) {
      return res.status(404).json({ message: 'Không tìm thấy counter' });
    }

    res.status(200).json({
      success: true,
      data: {
        siteId: counter.siteId,
        views: counter.views,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Tăng lượt xem
exports.incrementView = async (req, res) => {
  try {
    const { siteId } = req.params;

    // Tìm counter theo siteId
    const counter = await Counter.findOne({ siteId });

    if (!counter) {
      return res.status(404).json({ message: 'Không tìm thấy counter' });
    }

    // Tăng lượt xem
    counter.views += 1;

    // Cập nhật dailyViews
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Kiểm tra xem đã có bản ghi cho ngày hôm nay chưa
    const dailyViewIndex = counter.dailyViews.findIndex(
      (dv) => new Date(dv.date).toDateString() === today.toDateString()
    );

    if (dailyViewIndex !== -1) {
      // Nếu đã có, tăng count lên 1
      counter.dailyViews[dailyViewIndex].count += 1;
    } else {
      // Nếu chưa có, tạo mới
      counter.dailyViews.push({
        date: today,
        count: 1,
      });
    }

    await counter.save();

    res.status(200).json({
      success: true,
      data: {
        siteId: counter.siteId,
        views: counter.views,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy tất cả counters
exports.getAllCounters = async (req, res) => {
  try {
    const counters = await Counter.find({});

    res.status(200).json({
      success: true,
      count: counters.length,
      data: counters,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Xóa counter
exports.deleteCounter = async (req, res) => {
  try {
    const { siteId } = req.params;

    // Tìm và xóa counter
    const counter = await Counter.findOneAndDelete({ siteId });

    if (!counter) {
      return res.status(404).json({ message: 'Không tìm thấy counter' });
    }

    res.status(200).json({
      success: true,
      message: 'Counter đã được xóa thành công',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
}; 