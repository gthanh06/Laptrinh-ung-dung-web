const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Simili PVC', 'Da PU', 'Da PVC', 'Microfiber'],
    default: 'Simili PVC'
  },
  thickness: {
    type: String, // e.g., "0.8mm", "1.2mm"
    required: true
  },
  colors: {
    type: [String], // Array of hex colors or color names
    required: true
  },
  applications: {
    type: [String], // e.g. ["Giày dép", "Sofa", "Thời trang", "Ô tô"]
    required: true
  },
  price: {
    type: String, // e.g., "Liên hệ" or "120,000đ/m"
    default: "Liên hệ"
  },
  imageUrl: {
    type: String,
    default: ""
  },
  description: {
    type: String,
    default: ""
  },
  features: {
    type: [String], // e.g. ["Chống nước", "Chống cháy", "Độ bền cao"]
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', ProductSchema);
