import React from 'react';
import { Navigate } from 'react-router-dom';
import { message } from 'antd';

// Component này nhận vào:
// - children: Trang web muốn truy cập (Ví dụ: AdminDashboard)
// - requiredRole: Vai trò bắt buộc phải có (Ví dụ: 'admin')
function ProtectedRoute({ children, requiredRole }) {
  
  // 1. Lấy thông tin người dùng từ bộ nhớ
  const storedUser = localStorage.getItem('currentUser');
  let currentUser = null;

  if (storedUser) {
    currentUser = JSON.parse(storedUser);
  }

  // --- KIỂM TRA 1: AUTHENTICATION (Đã đăng nhập chưa?) ---
  if (!currentUser) {
    // Nếu chưa đăng nhập -> Đuổi về trang Login
    // replace dùng để xóa lịch sử, để user không bấm nút Back quay lại được

    // message.destroy() giúp xóa các thông báo cũ để tránh hiện chồng chéo
    message.destroy(); 
    message.warning('Vui lòng đăng nhập để tiếp tục!'); 
    return <Navigate to="/login" replace />;
  }

  // --- KIỂM TRA 2: AUTHORIZATION (Có đúng quyền không?) ---
  // Nếu trang này yêu cầu role (ví dụ 'admin') mà user hiện tại không phải 'admin'
  if (requiredRole && currentUser.role !== requiredRole) {
    message.error('Bạn không có quyền truy cập trang này!');
    
    message.destroy();
    // Đuổi về trang chủ
    return <Navigate to="/" replace />;
  }

  // --- HỢP LỆ ---
  // Nếu vượt qua 2 vòng kiểm tra trên, cho phép hiển thị nội dung bên trong
  return children;
}

export default ProtectedRoute;