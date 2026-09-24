# BÀI THỰC HÀNH LAB 2: BACKEND VỚI NODEJS & EXPRESS
## RESTful API Quản lý Đơn hàng Cửa hàng Sách (Bookstore Order Management)

---

### THÔNG TIN SINH VIÊN
- **Họ và tên:** Nguyễn Thái Tuấn
- **Mã sinh viên (MSV):** N23DCPT054
- **Lớp / Môn học:** D23CQPTUD01-N

---

### 1. MÔ TẢ NGẮN VỀ BÀI LÀM
Dự án được xây dựng theo yêu cầu của **Lab 2 - Nhóm 2**, triển khai một hệ thống **RESTful API** hoàn chỉnh phục vụ cho việc quản lý đơn hàng của **Cửa hàng bán sách (Bookstore)**:
- **Cấu trúc mã nguồn:** Tổ chức theo mô hình MVC đơn giản, phân tách rõ ràng giữa Model, Route và Server.
- **Cơ sở dữ liệu:** Kết nối và thao tác với **MongoDB Atlas** thông qua thư viện **Mongoose**.
- **Chức năng chính (CRUD):**
  - Tạo mới đơn hàng sách (`POST /api/orders`)
  - Lấy danh sách toàn bộ đơn hàng (`GET /api/orders`)
  - Lấy thông tin chi tiết một đơn hàng theo ID (`GET /api/orders/:id`)
  - Cập nhật thông tin / trạng thái đơn hàng (`PUT /api/orders/:id`)
  - Xóa đơn hàng theo ID (`DELETE /api/orders/:id`)
- **Chức năng mở rộng (Challenge):**
  - Lọc đơn hàng theo trạng thái: `GET /api/orders?status=pending`
  - Tìm kiếm đơn hàng theo tên khách hàng: `GET /api/orders/search?name=...`
  - Sắp xếp đơn hàng theo tổng tiền: `GET /api/orders?sort=asc` hoặc `desc`
- **Bảo mật & Biến môi trường:**
  - Áp dụng file `.gitignore` để loại bỏ `node_modules` và file cấu hình `.env` khỏi Git repository, ngăn ngừa lộ mật khẩu database và API keys khi đẩy lên GitHub hoặc deploy lên các nền tảng đám mây (Render, Railway).
  - Cung cấp file `.env.example` làm mẫu cấu hình.

---

### 2. CẤU TRÚC THƯ MỤC DỰ ÁN
```text
order-management-api/
├── models/
│   └── Order.js          # Khai báo Schema và Model Order với Mongoose
├── routes/
│   └── orderRoutes.js    # Các router xử lý CRUD và tìm kiếm/lọc đơn hàng
├── .env                  # Biến môi trường (PORT, MONGO_URI - bảo mật qua gitignore)
├── .env.example          # File mẫu cấu hình biến môi trường
├── .gitignore            # Chặn commit các file nhạy cảm và node_modules
├── package.json          # Quản lý dependencies và scripts chạy dự án
└── server.js             # Khởi tạo Express app, kết nối MongoDB và lắng nghe cổng
```

---

### 3. HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY DỰ ÁN

#### Bước 1: Di chuyển vào thư mục dự án
```bash
cd order-management-api
```

#### Bước 2: Cài đặt các thư viện cần thiết
```bash
npm install
```

#### Bước 3: Cấu hình biến môi trường
Tạo file `.env` (dựa trên mẫu `.env.example`):
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/BookstoreDB?retryWrites=true&w=majority
```
> **Lưu ý:** 
> - Thay thế `<password>` bằng mật khẩu thực tế của Database User trên MongoDB Atlas.
> - Đảm bảo cấu hình IP Whitelist trên MongoDB Atlas (**Network Access** -> **Allow Access from Anywhere: `0.0.0.0/0`**).

#### Bước 4: Chạy server
- Chế độ phát triển (tự reload khi đổi code):
  ```bash
  npm run dev
  ```
- Chế độ thông thường:
  ```bash
  npm start
  ```

---

### 4. TÀI LIỆU KIỂM THỬ API VỚI POSTMAN / THUNDER CLIENT

| Phương thức | Endpoint | Chức năng | Query Params / Param |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | Kiểm tra server hoạt động | Không |
| **POST** | `/api/orders` | Tạo đơn hàng sách mới | Body JSON |
| **GET** | `/api/orders` | Lấy danh sách đơn hàng | Hỗ trợ `?status=...` & `?sort=asc\|desc` |
| **GET** | `/api/orders/search` | Tìm kiếm đơn hàng theo tên KH | `?name=...` |
| **GET** | `/api/orders/:id` | Lấy chi tiết đơn hàng theo ID | `:id` của đơn hàng |
| **PUT** | `/api/orders/:id` | Cập nhật thông tin / trạng thái | `:id` của đơn hàng + Body JSON |
| **DELETE**| `/api/orders/:id` | Xóa đơn hàng | `:id` của đơn hàng |

#### Ví dụ Body JSON cho POST `/api/orders` (Tạo đơn hàng sách):
```json
{
  "customerName": "Nguyen Van A",
  "customerEmail": "vana@email.com",
  "items": [
    {
      "productName": "Sách Nhà Giả Kim",
      "quantity": 2,
      "unitPrice": 79000
    },
    {
      "productName": "Sách Đắc Nhân Tâm",
      "quantity": 1,
      "unitPrice": 86000
    }
  ],
  "totalAmount": 244000
}
```

#### Ví dụ Body JSON cho PUT `/api/orders/:id` (Cập nhật trạng thái):
```json
{
  "status": "confirmed"
}
```
*(Các trạng thái hợp lệ: `pending`, `confirmed`, `shipped`, `delivered`, `cancelled`)*
