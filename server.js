require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'thangthanhloi_leather_secret_key_1994';

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configure Multer for File Uploads
const multer = require('multer');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận các định dạng tệp tin ảnh (JPG, PNG, GIF, WEBP).'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Database Connection & Fallback Setup
let dbConnected = false;
const DATA_DIR = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const REQUESTS_FILE = path.join(DATA_DIR, 'requests.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

// Initial seed products for local fallback
const defaultProducts = [
  {
    _id: "p1",
    name: "Simili PVC Tiêu Chuẩn",
    type: "Simili PVC",
    thickness: "0.7mm - 0.9mm",
    colors: ["#8B4513", "#CD853F", "#D2B48C", "#000000", "#FFFFFF", "#333333"],
    applications: ["Giày dép", "Thời trang", "Văn phòng phẩm"],
    price: "70,000đ - 95,000đ/m",
    imageUrl: "assets/images/simili-pvc.webp",
    description: "Vải giả da simili PVC phổ thông được làm từ lớp vải lót dệt kết hợp với nhựa PVC cao cấp. Bề mặt có vân da tự nhiên, chống trầy xước nhẹ, màu sắc đa dạng, giá thành cực kỳ kinh tế, phù hợp cho sản xuất giày dép đại trà, lót túi xách, bìa sổ văn phòng.",
    features: ["Giá thành tối ưu", "Đa dạng màu sắc", "Dễ gia công", "Chống thấm nước"]
  },
  {
    _id: "p2",
    name: "Da PU Cao Cấp Mềm Mại",
    type: "Da PU",
    thickness: "1.0mm - 1.2mm",
    colors: ["#c5a880", "#4A2E1B", "#8B5A2B", "#000000", "#EAEAEA", "#A0522D"],
    applications: ["Sofa", "Thời trang", "Giày dép"],
    price: "150,000đ - 190,000đ/m",
    imageUrl: "assets/images/pu-leather.webp",
    description: "Da PU cao cấp được phủ lớp nhựa Polyurethane mềm mại, mang lại cảm giác tiếp xúc gần như da thật. Sản phẩm có độ đàn hồi vượt trội, co giãn tốt, bề mặt sang trọng, thoáng khí và có tuổi thọ cao. Phù hợp cho may mặc áo khoác da, túi xách thời trang cao cấp và bọc ghế sofa phòng khách.",
    features: ["Đàn hồi vượt trội", "Mềm mịn như da thật", "Chống nổ bề mặt", "Thân thiện môi trường"]
  },
  {
    _id: "p3",
    name: "Da PVC Chuyên Dụng Ô Tô & Sofa",
    type: "Da PVC",
    thickness: "1.2mm - 1.4mm",
    colors: ["#2B2B2B", "#5C4033", "#D2B48C", "#800000", "#1A303A"],
    applications: ["Ô tô", "Sofa"],
    price: "120,000đ - 160,000đ/m",
    imageUrl: "assets/images/pvc-auto.webp",
    description: "Dòng da PVC chịu lực cao, thiết kế chuyên dụng cho nội thất xe hơi (ghế da, tapi cửa, trần xe) và các bộ sofa văn phòng chịu tần suất sử dụng lớn. Chất liệu da dày dặn, có khả năng kháng khuẩn, chống cháy lan cấp độ nhẹ và cực kỳ dễ dàng lau chùi vệ sinh bụi bẩn.",
    features: ["Chống cháy lan nhẹ", "Chống mài mòn cực tốt", "Kháng khuẩn, dễ vệ sinh", "Độ bền màu cao"]
  },
  {
    _id: "p4",
    name: "Da Nhân Tạo Cao Cấp Microfiber",
    type: "Microfiber",
    thickness: "1.4mm - 1.6mm",
    colors: ["#3E2723", "#4E342E", "#212121", "#BDBDBD", "#8D6E63"],
    applications: ["Sofa", "Ô tô", "Giày dép"],
    price: "220,000đ - 280,000đ/m",
    imageUrl: "assets/images/microfiber.webp",
    description: "Da nhân tạo Microfiber là dòng da công nghiệp cao cấp nhất hiện nay, sản xuất bằng công nghệ mô phỏng cấu trúc 3D của da thật. Sản phẩm có độ bền kéo đứt, độ chịu xé cao hơn cả da thật, chống mốc, chống ẩm mốc hoàn hảo và không mùi khó chịu. Lý tưởng cho bọc ghế xe hơi sang trọng, sofa hạng sang và giày bảo hộ lao động xuất khẩu.",
    features: ["Bền hơn da thật", "Kháng nấm mốc tự nhiên", "Không mùi hóa chất", "Không chứa chất độc hại"]
  }
];

// Helper functions for file-based fallback database
function readLocalData(file, defaultVal) {
  try {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify(defaultVal, null, 2), 'utf8');
      return defaultVal;
    }
    const data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Lỗi đọc tệp ${file}:`, error);
    return defaultVal;
  }
}

function writeLocalData(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`Lỗi ghi tệp ${file}:`, error);
  }
}

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;
console.log('Đang thử kết nối cơ sở dữ liệu đám mây...');

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ Kết nối MongoDB Atlas thành công!');
    dbConnected = true;

    // Seed products inside MongoDB if empty
    const Product = require('./models/Product');
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('Cơ sở dữ liệu rỗng. Đang nạp dữ liệu mẫu...');
      // Remove _id for MongoDB auto-generation
      const seedData = defaultProducts.map(({ _id, ...rest }) => rest);
      await Product.insertMany(seedData);
      console.log('✅ Nạp dữ liệu mẫu vào MongoDB thành công!');
    }
  })
  .catch(err => {
    console.log('⚠️ Không thể kết nối MongoDB Atlas (Có thể do chưa cấu hình URL thực tế hoặc lỗi mạng).');
    console.log('🚀 Chế độ Dự phòng: Ứng dụng sẽ hoạt động sử dụng Tệp tin dữ liệu cục bộ trong thư mục ./data');
    dbConnected = false;
  });

// Models for DB operations (dynamic check)
const Product = require('./models/Product');
const SampleRequest = require('./models/SampleRequest');

// --- API ROUTES ---

// 0. PUBLIC: Lấy trạng thái cơ sở dữ liệu
app.get('/api/db-status', (req, res) => {
  res.json({
    dbConnected,
    storageType: dbConnected ? "MongoDB Atlas (Cloud)" : "Local JSON Files (Dự phòng)"
  });
});

// 1. PUBLIC: Lấy danh sách sản phẩm
app.get('/api/products', async (req, res) => {
  try {
    if (dbConnected) {
      const products = await Product.find().sort({ createdAt: -1 });
      res.json(products);
    } else {
      const products = readLocalData(PRODUCTS_FILE, defaultProducts);
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy danh sách sản phẩm', error: error.message });
  }
});

// 2. PUBLIC: Khách hàng đăng ký nhận mẫu da thử
app.post('/api/requests', async (req, res) => {
  const { fullName, phone, email, address, leatherType, colorInterest, notes } = req.body;
  
  if (!fullName || !phone || !address || !leatherType) {
    return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin: Họ tên, Số điện thoại, Địa chỉ và Loại da quan tâm.' });
  }

  try {
    const newRequestData = {
      fullName,
      phone,
      email: email || '',
      address,
      leatherType,
      colorInterest: colorInterest || 'Tự chọn',
      notes: notes || '',
      status: 'Chờ duyệt'
    };

    if (dbConnected) {
      const newRequest = new SampleRequest(newRequestData);
      await newRequest.save();
      res.status(201).json({ message: 'Gửi yêu cầu mẫu thử thành công! Chúng tôi sẽ sớm liên hệ lại.', data: newRequest });
    } else {
      const requests = readLocalData(REQUESTS_FILE, []);
      const newRequest = {
        _id: 'req_' + Date.now(),
        ...newRequestData,
        createdAt: new Date().toISOString()
      };
      requests.push(newRequest);
      writeLocalData(REQUESTS_FILE, requests);
      res.status(201).json({ message: 'Gửi yêu cầu mẫu thử thành công (Dự phòng cục bộ)!', data: newRequest });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ khi lưu đơn yêu cầu', error: error.message });
  }
});

// 3. ADMIN: Đăng nhập quản trị viên
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  // Tài khoản Admin mặc định cho bài tập cuối kỳ
  if (username === 'admin' && password === 'admin123') {
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '2h' });
    return res.json({ success: true, token, message: 'Đăng nhập thành công!' });
  }
  res.status(401).json({ success: false, message: 'Tên đăng nhập hoặc mật khẩu không chính xác.' });
});

// Middleware xác thực JWT cho các route Admin
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Vui lòng đăng nhập quyền Admin.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Phiên làm việc hết hạn hoặc token không hợp lệ.' });
    }
    req.user = user;
    next();
  });
};

// 4. ADMIN API: Lấy danh sách yêu cầu mẫu da
app.get('/api/admin/requests', authenticateAdmin, async (req, res) => {
  try {
    if (dbConnected) {
      const requests = await SampleRequest.find().sort({ createdAt: -1 });
      res.json(requests);
    } else {
      const requests = readLocalData(REQUESTS_FILE, []);
      // Sort local by date descending
      requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      res.json(requests);
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy đơn yêu cầu mẫu', error: error.message });
  }
});

// 5. ADMIN API: Cập nhật trạng thái đơn yêu cầu
app.put('/api/admin/requests/:id', authenticateAdmin, async (req, res) => {
  const { status } = req.body;
  if (!['Chờ duyệt', 'Đã duyệt', 'Đã gửi mẫu', 'Từ chối'].includes(status)) {
    return res.status(400).json({ message: 'Trạng thái cập nhật không hợp lệ.' });
  }

  try {
    if (dbConnected) {
      const updatedRequest = await SampleRequest.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );
      if (!updatedRequest) return res.status(404).json({ message: 'Không tìm thấy đơn.' });
      res.json({ message: 'Cập nhật trạng thái thành công!', data: updatedRequest });
    } else {
      const requests = readLocalData(REQUESTS_FILE, []);
      const index = requests.findIndex(r => r._id === req.params.id);
      if (index === -1) return res.status(404).json({ message: 'Không tìm thấy đơn.' });
      requests[index].status = status;
      requests[index].updatedAt = new Date().toISOString();
      writeLocalData(REQUESTS_FILE, requests);
      res.json({ message: 'Cập nhật trạng thái thành công (Cục bộ)!', data: requests[index] });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái', error: error.message });
  }
});

// 6. ADMIN API: Thêm sản phẩm mới
app.post('/api/admin/products', authenticateAdmin, upload.single('image'), async (req, res) => {
  const { name, type, thickness, colors, applications, price, description, features } = req.body;
  
  if (!name || !type || !thickness || !colors || !applications) {
    return res.status(400).json({ message: 'Thông tin sản phẩm thiếu các trường bắt buộc.' });
  }

  // Parse arrays (if sent via FormData as comma-separated strings)
  let colorsArr = colors;
  if (typeof colorsArr === 'string') {
    colorsArr = colorsArr.split(',').map(s => s.trim()).filter(s => s.length > 0);
  }
  let applicationsArr = applications;
  if (typeof applicationsArr === 'string') {
    applicationsArr = applicationsArr.split(',').map(s => s.trim()).filter(s => s.length > 0);
  }
  let featuresArr = features || [];
  if (typeof featuresArr === 'string') {
    featuresArr = featuresArr.split(',').map(s => s.trim()).filter(s => s.length > 0);
  }

  // Determine Image URL
  let finalImageUrl = 'assets/images/default-leather.webp';
  if (req.file) {
    finalImageUrl = 'uploads/' + req.file.filename;
  }

  try {
    const newProductData = {
      name,
      type,
      thickness,
      colors: colorsArr,
      applications: applicationsArr,
      price: price || 'Liên hệ',
      description: description || '',
      features: featuresArr,
      imageUrl: finalImageUrl
    };

    if (dbConnected) {
      const newProd = new Product(newProductData);
      await newProd.save();
      res.status(201).json({ message: 'Thêm sản phẩm thành công!', data: newProd });
    } else {
      const products = readLocalData(PRODUCTS_FILE, defaultProducts);
      const newProd = {
        _id: 'p_' + Date.now(),
        ...newProductData,
        createdAt: new Date().toISOString()
      };
      products.push(newProd);
      writeLocalData(PRODUCTS_FILE, products);
      res.status(201).json({ message: 'Thêm sản phẩm thành công (Cục bộ)!', data: newProd });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi thêm sản phẩm', error: error.message });
  }
});

// 7. ADMIN API: Cập nhật sản phẩm
app.put('/api/admin/products/:id', authenticateAdmin, upload.single('image'), async (req, res) => {
  const { name, type, thickness, colors, applications, price, description, features } = req.body;

  // Parse arrays if sent via FormData
  let updateData = { ...req.body };
  
  if (colors) {
    updateData.colors = typeof colors === 'string' 
      ? colors.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : colors;
  }
  if (applications) {
    updateData.applications = typeof applications === 'string'
      ? applications.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : applications;
  }
  if (features) {
    updateData.features = typeof features === 'string'
      ? features.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : features;
  }

  if (req.file) {
    updateData.imageUrl = 'uploads/' + req.file.filename;
  }

  try {
    if (dbConnected) {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );
      if (!updatedProduct) return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
      res.json({ message: 'Cập nhật sản phẩm thành công!', data: updatedProduct });
    } else {
      const products = readLocalData(PRODUCTS_FILE, defaultProducts);
      const index = products.findIndex(p => p._id === req.params.id);
      if (index === -1) return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
      
      products[index] = {
        ...products[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      writeLocalData(PRODUCTS_FILE, products);
      res.json({ message: 'Cập nhật sản phẩm thành công (Cục bộ)!', data: products[index] });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật sản phẩm', error: error.message });
  }
});

// 8. ADMIN API: Xóa sản phẩm
app.delete('/api/admin/products/:id', authenticateAdmin, async (req, res) => {
  try {
    if (dbConnected) {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      if (!deletedProduct) return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
      res.json({ message: 'Xóa sản phẩm thành công!' });
    } else {
      const products = readLocalData(PRODUCTS_FILE, defaultProducts);
      const filtered = products.filter(p => p._id !== req.params.id);
      if (products.length === filtered.length) {
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
      }
      writeLocalData(PRODUCTS_FILE, filtered);
      res.json({ message: 'Xóa sản phẩm thành công (Cục bộ)!' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa sản phẩm', error: error.message });
  }
});

// Route dự phòng trả về trang index.html cho các đường dẫn khác
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
