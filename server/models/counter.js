const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema(
  {
    siteId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    dailyViews: [
      {
        date: {
          type: Date,
          required: true,
        },
        count: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Counter', counterSchema); 