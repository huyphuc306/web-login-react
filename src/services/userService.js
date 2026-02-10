import api from './api';

export const userService = {
  // 1. Lấy toàn bộ danh sách users
  getAll: () => api.get('/users'),

  // 2. Lấy chi tiết 1 user theo ID
  getById: (id) => api.get(`/users/${id}`),

  // 3. Tìm user theo Username (Dùng cho Login hoặc Check trùng khi Đăng ký)
  // MockAPI hỗ trợ filter dạng: /users?username=abc
  findByUsername: (username) => api.get(`/users?username=${username}`),

  // 4. Tạo user mới (Dùng cho Admin hoặc trang Register)
  create: (data) => api.post('/users', data),

  // 5. Cập nhật thông tin user (Dùng cho Admin sửa hoặc User tự sửa Profile)
  update: (id, data) => api.put(`/users/${id}`, data),

  // 6. Xóa user
  delete: (id) => api.delete(`/users/${id}`),
};