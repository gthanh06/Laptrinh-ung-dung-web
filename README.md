# Dự Án Lập Trình Web Cuối Kỳ: Hệ Thống Giới Thiệu & Quản Lý Da Simili Thắng Thành Lợi

Dự án này là một ứng dụng Web Full-stack (Client-Server) hoàn chỉnh, được thiết kế để giới thiệu sản phẩm vải giả da cao cấp (Simili, PU, PVC, Microfiber) cho công ty Thắng Thành Lợi. Dự án bao gồm trang giới thiệu sản phẩm tương tác cao cho khách hàng và trang quản trị hệ thống (Admin Dashboard) được vận hành bằng Backend Node.js/Express và Cơ sở dữ liệu đám mây (Cloud Database) MongoDB Atlas.

---

## 🌟 Tính Năng Nổi Bật

### 1. Giao diện Khách hàng (Frontend)
- **Thiết kế sang trọng, hiện đại:** Phong cách **Modern Dark & Gold** kết hợp hiệu ứng kính mờ (Glassmorphism) thời thượng, tạo cảm giác cao cấp.
- **Trình trực quan hóa màu da (Interactive Visualizer):** Người dùng có thể chọn loại vân da và đổi màu swatch trực tiếp trên mô phỏng ghế Sofa, Ghế ô tô hoặc Giày tây Oxford.
- **Catalogue & Lọc sản phẩm:** Lọc nhanh các mẫu da theo chủng loại (PU, PVC, Simili, Microfiber) theo thời gian thực mà không cần tải lại trang.
- **Đăng ký nhận mẫu thử miễn phí:** Form gửi thông tin liên hệ và mẫu da mong muốn trực tiếp tới hệ thống quản trị của admin.

### 2. Giao diện Quản trị viên (Admin Dashboard)
- **Đăng nhập bảo mật:** Xác thực tài khoản Admin bằng JSON Web Token (JWT) lưu tại LocalStorage phía Client.
- **Bảng Quản lý yêu cầu mẫu thử:** Xem danh sách khách hàng đăng ký nhận mẫu da và cập nhật trạng thái đơn hàng (`Chờ duyệt`, `Đã duyệt`, `Đã gửi mẫu`, `Từ chối`) trực tiếp qua API.
- **Quản lý Danh mục Mẫu da (CRUD):** Thêm mới, chỉnh sửa thông tin hoặc xóa bỏ các mẫu da khỏi cơ sở dữ liệu.
- **Đèn báo trạng thái cơ sở dữ liệu:** Hiển thị thời gian thực hệ thống đang đồng bộ dữ liệu đám mây MongoDB Atlas hay đang chạy chế độ dự phòng.

### 3. Backend & Cấu hình cơ sở dữ liệu thông minh
- **Backend Node.js & Express:** Viết các RESTful API sạch sẽ, xử lý xác thực và quản lý tài nguyên.
- **Chế độ dự phòng tự động (Auto Local Fallback):** Nếu không cấu hình hoặc không kết nối được MongoDB đám mây, server sẽ tự động chuyển sang chế độ lưu trữ dữ liệu tại các tệp tin JSON cục bộ (`data/products.json`, `data/requests.json`), giúp ứng dụng hoạt động 100% bình thường mà không gây lỗi crash.

---

## 🛠️ Công Nghệ Sử Dụng
- **Frontend:** HTML5, CSS3 hiện đại, Vanilla JavaScript (Không dùng thư viện bên ngoài để tối ưu hiệu năng).
- **Backend:** Node.js, Express.js.
- **Cơ sở dữ liệu:** MongoDB (sử dụng thư viện Mongoose).
- **Xác thực:** JWT (JSON Web Tokens).

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### Bước 1: Yêu cầu hệ thống
Hãy đảm bảo máy tính của bạn đã cài đặt **Node.js** (Khuyên dùng phiên bản 18 trở lên).

### Bước 2: Tải dự án và cài đặt thư viện
Mở Terminal/CMD tại thư mục dự án và chạy lệnh sau để cài đặt các gói thư viện cần thiết:
```bash
npm install
```

### Bước 3: Chạy ứng dụng chế độ Offline (Mặc định)
Bạn có thể khởi động ngay dự án bằng cách chạy lệnh:
```bash
node server.js
```
Hệ thống sẽ chạy tại địa chỉ: **[http://localhost:4000](http://localhost:4000)**

*Lúc này, vì chưa cấu hình liên kết MongoDB Atlas, Server sẽ hiển thị cảnh báo kết nối và tự động khởi tạo dữ liệu mẫu cục bộ trong thư mục `./data`. Bạn hoàn toàn có thể thêm, sửa, xóa sản phẩm hoặc đăng ký mẫu thử bình thường.*

---

## ☁️ Hướng Dẫn Kết Nối Cơ Sở Dữ Liệu Đám Mây MongoDB Atlas

Để đưa dữ liệu dự án lên đám mây theo yêu cầu bài tập lớn, hãy làm theo các bước sau:

1. **Đăng nhập/Đăng ký:** Truy cập **[mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)** và đăng ký một tài khoản miễn phí (Shared Cluster - Free Tier).
2. **Tạo Database:** Tạo một Database Cluster mới, chọn gói miễn phí và vị trí máy chủ gần Việt Nam (ví dụ Singapore).
3. **Tạo tài khoản Database Access:**
   - Vào mục **Database Access** -> Click **Add New Database User**.
   - Tạo User với tên đăng nhập và mật khẩu (Hãy nhớ thông tin này để điền vào cấu hình).
4. **Cấu hình Network Access:**
   - Vào mục **Network Access** -> Click **Add IP Address**.
   - Chọn **Allow Access From Anywhere** (IP `0.0.0.0/0`) để cho phép kết nối từ máy tính của bạn hoặc bất cứ đâu khi mang bài lên trường nộp.
5. **Lấy chuỗi kết nối (Connection String):**
   - Click nút **Connect** tại Cluster -> Chọn **Drivers** (Node.js).
   - Copy chuỗi kết nối có dạng: `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority`
6. **Cập nhật File Cấu hình:**
   - Mở file `.env` ở thư mục gốc dự án.
   - Thay thế giá trị của `MONGO_URI` bằng chuỗi kết nối bạn vừa copy. Hãy thay thế `<username>` và `<password>` bằng tài khoản bạn đã tạo ở bước 3.
   - Khởi động lại Server: `node server.js`. Giao diện Console sẽ báo: `✅ Kết nối MongoDB Atlas thành công!` và ứng dụng sẽ chuyển dữ liệu hoạt động hoàn toàn lên đám mây.

---

## 🔑 Thông Tin Tài Khoản Đăng Nhập Quản Trị (Admin)
- **Địa chỉ trang quản trị:** **[http://localhost:4000/admin.html](http://localhost:4000/admin.html)**
- **Tên đăng nhập:** `admin`
- **Mật khẩu:** `admin123`

---

## 📂 Sơ Đồ Thư Mục Dự Án
```
├── models/
│   ├── Product.js          # Định nghĩa cấu trúc Sản phẩm Mẫu Da
│   └── SampleRequest.js    # Định nghĩa cấu trúc Đơn Yêu Cầu Mẫu Da
├── data/                   # Thư mục lưu trữ dữ liệu dự phòng cục bộ (JSON)
├── public/                 # Chứa giao diện tĩnh phục vụ Client
│   ├── assets/             # Hình ảnh texture, banner, sofa mockup
│   ├── css/
│   │   └── styles.css      # Toàn bộ CSS giao diện sang trọng
│   ├── js/
│   │   ├── app.js          # Xử lý logic và tương tác của khách hàng
│   │   └── admin.js        # Xử lý đăng nhập, quản trị CRUD của Admin
│   ├── index.html          # Trang chủ chính của khách hàng
│   └── admin.html          # Trang quản trị chính của Admin
├── .env                    # Lưu trữ biến môi trường (PORT, URL Database đám mây, Khóa bảo mật)
├── package.json            # Quản lý danh sách thư viện đã cài đặt
└── server.js               # Khởi chạy server Express.js chính của dự án
```
