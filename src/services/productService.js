// src/services/productService.js
import api from './api';

export const productService = {
  // Lấy danh sách
  getAll: () => api.get('/products'),

  // Lấy chi tiết 1 cái (nếu cần)
  getById: (id) => api.get(`/products/${id}`),

  // Tạo mới
  create: (data) => api.post('/products', data),

  // Cập nhật (Cần ID và Dữ liệu mới)
  update: (id, data) => api.put(`/products/${id}`, data),

  // Xóa
  delete: (id) => api.delete(`/products/${id}`),
};