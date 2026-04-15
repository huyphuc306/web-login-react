import api2 from "./api2";

export const reviewService = {
    // Lấy tất cả reviews
    getAll: () => api2.get('/reviews'),

    // Tạo review mới
    create: (data) => api2.post('/reviews', data),

    // Cập nhật review (khi sửa đánh giá)
    update: (id, data) => api2.put(`/reviews/${id}`, data),
};