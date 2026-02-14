# Student Score Management (THCS)

Dự án quản lý điểm học sinh THCS gồm 2 phần:

- **Frontend**: React + TypeScript (Vite)
- **Backend**: Spring Boot (Java)

Mục tiêu của hệ thống là hỗ trợ quản lý danh sách học sinh, điểm số và hiển thị giao diện cho giáo viên / nhà trường.

---

## Cấu trúc thư mục

```
.
├── backend/        # Spring Boot backend
└── frontend/       # React + TypeScript frontend
```

---

## Yêu cầu môi trường

### Frontend
- Node.js (khuyến nghị Node 18+)
- npm

### Backend
- Java 17+ (khuyến nghị)
- Maven

---

## Chạy Frontend (React)

### Bước 1: Di chuyển vào thư mục frontend
```bash
cd frontend
```

### Bước 2: Cài dependencies
```bash
npm install
```

### Bước 3: Chạy project (cổng 3000)
```bash
npm run dev -- --port 3000
```

Sau khi chạy xong, mở trình duyệt:

```
http://localhost:3000
```

---

## Chạy Backend (Spring Boot)

### Bước 1: Di chuyển vào thư mục backend
```bash
cd backend
```

### Bước 2: Chạy Spring Boot (cổng 8080)
```bash
mvn spring-boot:run
```

Backend mặc định chạy tại:

```
http://localhost:8080
```

---

## Kết nối Frontend với Backend

- Frontend chạy ở cổng: **3000**
- Backend chạy ở cổng: **8080**

Frontend sẽ gọi API từ backend thông qua địa chỉ:

```
http://localhost:8080
```

---

## Lưu ý quan trọng

- Không push các file nhạy cảm như `.env.local`
- Không push `node_modules` lên GitHub
- Không push thư mục `.idea` (cấu hình IDE)

---

## Tác giả

- **haribawngg**
- **vuminhthu**
