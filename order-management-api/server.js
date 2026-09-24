const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Cho phep server doc JSON tu request body

// Nhúng route vào server.js (thêm sau phần Middlewares)
const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

// Ket noi MongoDB (ho tro ca MONGO_URI va MONGODB_URI)
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected!'))
  .catch(err => {
    console.error('❌ Connection error:', err.message);
    if (MONGO_URI && MONGO_URI.includes('<db_password>')) {
      console.error('👉 Luu y: Ban can thay the <db_password> trong file .env bang mat khau that cua user database tren MongoDB Atlas.');
    }
  });

// Route kiem tra server
app.get('/', (req, res) => {
  res.send('API Quan ly Don hang dang hoat dong...');
});

// Khoi chay server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});