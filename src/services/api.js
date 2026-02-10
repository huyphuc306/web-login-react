// src/services/api.js
import axios from 'axios';

const api = axios.create({
  // Thay cái link này bằng link gốc MockAPI của bạn
  // Lưu ý: Chỉ lấy phần gốc, không lấy /products hay /users
  baseURL: 'https://64a77763096b3f0fcc8153b7.mockapi.io',
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Interceptor (Bộ đón lõng dữ liệu) ---
// Giúp trả về thẳng data thay vì trả về cả cục response object
api.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Có thể xử lý lỗi chung ở đây (ví dụ: hết hạn token thì logout)
    return Promise.reject(error);
  }
);

export default api;