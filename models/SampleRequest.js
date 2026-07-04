const mongoose = require('mongoose');

const SampleRequestSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  leatherType: {
    type: String,
    required: true
  },
  colorInterest: {
    type: String,
    default: "Tự chọn"
  },
  notes: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    enum: ['Chờ duyệt', 'Đã duyệt', 'Đã gửi mẫu', 'Từ chối'],
    default: 'Chờ duyệt'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SampleRequest', SampleRequestSchema);
