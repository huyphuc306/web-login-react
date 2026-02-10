// src/hooks/useAuth.js
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

export const useAuth = () => {
  const navigate = useNavigate();

  const logout = () => {
    // 1. Xóa dữ liệu trong LocalStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');

    // 2. Thông báo
    message.success('Đăng xuất thành công!');

    // 3. Chuyển hướng về trang đăng nhập
    navigate('/login');
  };

  // Trả về hàm logout để các component khác sử dụng
  return { logout };
};