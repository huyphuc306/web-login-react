const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
const server = http.createServer(app);

// Cấu hình Socket Server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Cho phép React (cổng 3000) kết nối
    methods: ["GET", "POST"]
  }
});

// Link MockApi.io của bạn
const MOCK_API_URL = 'https://69ecd2ecaf4ff533142b6c82.mockapi.io/messages';

// Lắng nghe kết nối
io.on('connection', (socket) => {
  console.log('✅ Một người dùng đã kết nối:', socket.id);

  // Lắng nghe sự kiện gửi tin nhắn từ React
  socket.on('send_message', async (data) => {
    console.log('📩 Nhận được tin:', data.text);

    try {
      // 1. LƯU TIN NHẮN LÊN MOCKAPI.IO
      await axios.post(MOCK_API_URL, data);
      console.log('💾 Đã lưu lên MockApi!');
    } catch (error) {
      console.error('❌ Lỗi lưu MockApi:', error.message);
    }

    // 2. PHÁT TIN NHẮN ĐI CHO MỌI NGƯỜI (Real-time)
    io.emit('receive_message', {
      ...data,
      senderId: 'other' // Đổi thành 'other' để người nhận hiện bong bóng trắng
    });
  });

  socket.on('disconnect', () => {
    console.log('❌ Người dùng ngắt kết nối');
  });
});

// Chạy máy chủ ở cổng 3001
server.listen(3001, () => {
  console.log('🚀 SOCKET SERVER ĐANG CHẠY ỔN ĐỊNH TẠI CỔNG 3001');
});