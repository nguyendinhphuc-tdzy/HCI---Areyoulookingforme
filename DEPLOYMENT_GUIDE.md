# Hướng Dẫn Triển Khai (Deployment) - Dự án BookMap AR

Tài liệu này cung cấp hướng dẫn từng bước để triển khai (deploy) toàn bộ hệ thống dự án lên các môi trường trực tuyến. 
Dự án được cấu trúc theo dạng Monorepo bao gồm hai phần chính:
- **`bookmap-api`** (Backend - NodeJS/Express)
- **`bookmap-ar`** (Frontend - Vite/ReactJS/Zustand)

## Các nền tảng sử dụng (Tech Stack)
1. **Supabase**: Cung cấp cơ sở dữ liệu (PostgreSQL) và các dịch vụ BaaS.
2. **Render**: Nền tảng hosting cho Backend API (NodeJS).
3. **Vercel**: Nền tảng hosting tối ưu cho Frontend (Vite/React).

---

## Bước 0: Chuẩn bị mã nguồn (Tạo Repo & Đẩy Code Lên GitHub Bằng GitHub Desktop)
Để có thể deploy lên Render và Vercel, mã nguồn của bạn bắt buộc phải nằm trên GitHub. Dưới đây là các bước dùng thư mục gốc hiện tại của bạn đẩy lên bằng phần mềm GitHub Desktop:

1. **Khởi tạo local repository**:
   - Mở **GitHub Desktop**.
   - Trên thanh menu, chọn **File** > **Add Local Repository...** (hoặc phím tắt `Ctrl+O`).
   - Nhấn **Choose...** và chọn đường dẫn đến thư mục dự án của bạn: `d:\HCI - Areyoulookingforme`.
   - Vì thư mục này chưa được khởi tạo Git, GitHub Desktop sẽ hiện cảnh báo: *"This directory does not appear to be a Git repository"*. 
   - ➔ Hãy click vào đoạn chữ màu xanh **"create a repository"** hoặc **"create a repository here"** ngay bên dưới thông báo đó.
   - Xác nhận thông tin và (nếu tuỳ chọn) ở mục `Git Ignore` chọn "Node". Nhấn **Create Repository**.

2. **Commit mã nguồn**:
   - Ở cột bên trái, bạn sẽ thấy danh sách toàn bộ các file code của dự án.
   - Dưới cùng góc trái, ở ô **Summary (required)**, hãy nhập tóm tắt: `Khởi tạo dự án BookMap`.
   - Nhấn nút màu xanh **Commit to main**.

3. **Đẩy lên GitHub trực tuyến (Publish)**:
   - Ở thanh trên cùng (hoặc giữa màn hình nếu là repo mới), bấm vào nút xanh có biểu tượng mây **Publish repository**.
   - Ở popup hiện ra, đặt tên repo (chẳng hạn `bookmap-hci-areyoulookingforme`).
   - **Lưu ý nhỏ:** Khuyến nghị **Bỏ chọn (Uncheck)** ô *"Keep this code private"* để repository ở dạng Public. (Các dịch vụ free đôi khi tích hợp suôn sẻ hơn với Public Repo, mặc dù Private vẫn ok).
   - Nhấn nút **Publish repository** và chờ tiến trình upload hoàn thành.

Khi hoàn tất, dự án của bạn đã có trên tài khoản GitHub của bạn. Lúc này bạn đã hoàn toàn sẵn sàng cho các Bước tiếp theo.

---

## Bước 1: Thiết lập Database trên Supabase

1. Truy cập và đăng nhập vào [Supabase](https://supabase.com/).
2. Nhấn chọn **"New Project"** và đặt tên cho dự án (ví dụ: `bookmap`). 
   - *Lưu ý: Mật khẩu Database (Database Password) cần được lưu lại cẩn thận.*
3. Chờ hệ thống khởi tạo hoàn tất.
4. Lấy các thông số API:
   - Truy cập **Project Settings > API**.
   - Copy hai giá trị quan trọng:
     - **Project URL** (Sẽ dùng cho biến môi trường `SUPABASE_URL` và `VITE_SUPABASE_URL`).
     - **Project API Keys (anon public)** (Sẽ dùng cho biến môi trường `SUPABASE_ANON_KEY` và `VITE_SUPABASE_ANON_KEY`).
5. Lấy chuỗi kết nối trực tiếp (nếu cần cho backend truy vấn Prisma hoặc Sequelize):
   - Vào **Project Settings > Database**, kéo xuống mục **Connection string**. Copy chuỗi URI.
6. (Tuỳ chọn) Tạo các bảng (tables) dữ liệu cần thiết (ví dụ: bảng `booths`) tại mục **Table Editor** hoặc **SQL Editor** của Supabase.

---

## Bước 2: Triển khai Backend (`bookmap-api`) lên Render

1. Đăng nhập [Render](https://render.com/) bằng tài khoản GitHub của bạn.
2. Tại màn hình Dashboard, nhấn **New +** và chọn **Web Service**.
3. Chọn tùy chọn kết nối Repository và trỏ đến kho chứa mã nguồn dự án của bạn (trên GitHub).
4. Cấu hình Web Service:
   - **Name**: `bookmap-api` (Hoặc tên tuỳ chọn)
   - **Language**: `Node`
   - **Branch**: `main` (Hoặc nhánh bạn lưu trữ code chính)
   - **Root Directory**: `bookmap-api` 
     > ⚠️ *Đây là phần quan trọng nhất, cấu hình này giúp báo hiệu cho Render biết mã nguồn của Backend nằm hoàn toàn ở thư mục con `bookmap-api`.*
   - **Build Command**: `npm install`
   - **Start Command**: `npm start` (hoặc `node server.js`)
   - **Instance Type**: `Free` (Gói miễn phí)
5. Thiết lập **Environment Variables** (Biến môi trường) bằng cách cuộn xuống trên cùng trang cài đặt:
   - Bấm **Add Environment Variable** để thêm các giá trị (Lấy từ kết quả ở Bước 1):
     - `SUPABASE_URL`: `<Project URL của Supabase>`
     - `SUPABASE_ANON_KEY`: `<Anon API Key của Supabase>`
     - `PORT`: `5000`
6. Nhấn nút **Create Web Service** và chờ Render cài đặt, build dự án.
7. Sau khi tiến trình thành công, sao chép đường dẫn API mà Render cung cấp trên thanh thông tin tổng quan.
   - *Ví dụ:* `https://bookmap-api-xxxx.onrender.com`

---

## Bước 3: Triển khai Frontend (`bookmap-ar`) lên Vercel

1. Đăng nhập [Vercel](https://vercel.com/) bằng tài khoản GitHub của bạn.
2. Từ Dashboard, nhấn nút **Add New...** và chọn **Project**.
3. Tại phần "Import Git Repository", chọn kho lưu trữ chứa mã nguồn giống như ở phần Render.
4. Cấu hình Project trên giao diện Vercel:
   - **Project Name**: `bookmap-ar`
   - **Framework Preset**: Chọn `Vite` (mặc định Vercel sẽ tự rà soát và gợi ý thư viện Vite).
   - **Root Directory**: Nhấn nút **Edit** cạnh Root Directory và chọn thư mục `bookmap-ar`.
     > ⚠️ *Tương tự như backend, bước này giúp Vercel cô lập quá trình build và chạy code Frontend đúng ở vị trí tương ứng.*
5. Cấu hình **Environment Variables**:
   - Ở thẻ cấu hình biến môi trường của Vercel (mở rộng mục Environment Variables), thêm 3 biến sau:
     - Tên biến: `VITE_SUPABASE_URL` | Giá trị: Tương tự như backend, copy từ Supabase (Project URL).
     - Tên biến: `VITE_SUPABASE_ANON_KEY` | Giá trị: Tương tự như backend, copy từ Supabase (Anon Key).
     - Tên biến: `VITE_API_BASE_URL` | Giá trị: Lưu ý **dán chính xác đường dẫn HTTPS của Render Backend bạn đã copy ở cuối Bước 2** (Ví dụ: `https://bookmap-api-xxxx.onrender.com` - Tuyệt đối không thêm dấu `/` ở cuối URL).
6. Nhấn **Deploy** và chờ Vercel thực hiện quá trình Build (chạy lệnh `vite build`).
7. Khi Deploy thành công, bạn sẽ được tự động điều hướng sang màn hình có pháo giấy chúc mừng. Nhấn vào Visit / Domain (sẽ có dạng `https://bookmap-ar-ten-ban.vercel.app`) để trải nghiệm Web App trực tuyến trên trình duyệt.

---

## Bước 4: Hậu kỳ (Thay mã Dummy bằng dữ liệu Supabase thực)

Khi bạn code và test cục bộ, API đang trả về dữ liệu mẫu (dummy) trong file `server.js`.
Sau khi bạn đã thiết lập cấu trúc Table `booths` (có các cột Id, Name, Category...) trên Supabase và nhập dữ liệu vào, bạn hãy thực hiện chuyển sang dữ liệu thật:

1. Mở file mã nguồn `d:\HCI - Areyoulookingforme\bookmap-api\server.js`.
2. Tìm đến hàm GET `/api/booths`.
3. Bỏ comment (chú thích) đoạn code kết nối lấy từ Supabase:
   ```javascript
   const { data: booths, error } = await supabase.from('booths').select('*');
   if (error) throw error;
   res.json(booths);
   ```
4. Xoá hoặc comment lại vùng chứa danh sách Dummy (biến `dummyBooths`).
5. Lưu file và commit, sau đó `git push` mã nguồn lên GitHub.
6. Ngay lập tức, Render và Vercel sẽ kích hoạt tiến trình **tự động deploy lại** (CI/CD Auto Deploy). Bạn chỉ cần đợi khoảng vài phút, F5 Web App là sẽ cập nhật dữ liệu hoàn chỉnh.

Chúc bạn có một dự án thành công và ứng dụng mạnh mẽ bằng công nghệ AR/Web!
