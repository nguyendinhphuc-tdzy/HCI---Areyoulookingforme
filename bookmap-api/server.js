const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { supabase } = require('./supabase');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Kiểm tra Health Check của server
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'BookMap API is running normally.' });
});

// Lấy danh sách gian hàng (Booths)
app.get('/api/booths', async (req, res) => {
  try {
    // Để tích hợp sau khi bạn đã có cấu trúc Table `booths` trong Supabase
    // const { data: booths, error } = await supabase.from('booths').select('*');
    // if (error) throw error;
    // res.json(booths);

    // Dữ liệu tạm mô phỏng Supabase trong khi chờ DB thực sự
    const dummyBooths = [
      { id: 'B1', name: 'Kim Đồng', category: 'Truyện Tranh', location: { x: 10, y: 0, z: 15 }, description: 'Nhà xuất bản Kim Đồng' },
      { id: 'B2', name: 'Nhã Nam', category: 'Văn học', location: { x: -5, y: 0, z: 20 }, description: 'Sách văn học nước ngoài' },
    ];
    res.json(dummyBooths);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
