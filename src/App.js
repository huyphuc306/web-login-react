import './App.css';
import { useState } from 'react';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';
import OwnerDashboard from './pages/OwnerDashboard';

function AuthRedirect() {
  // Lấy thông tin user từ bộ nhớ
  const user = JSON.parse(localStorage.getItem('currentUser'));

  // Nếu chưa đăng nhập -> Cho vào trang chủ xem hàng bình thường
  if (!user) {
    return <Home />;
  }

  // Nếu đã đăng nhập, kiểm tra chức vụ (Role)
  if (user.role === 'admin') {
    return <Navigate to="/admin" replace />; // replace giúp không lưu lịch sử (để bấm Back không bị lỗi)
  }

  if (user.role === 'owner') {
    return <Navigate to="/owner" replace />;
  }

  // Nếu là user thường -> Vẫn cho vào Home mua hàng
  return <Home />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Mặc định vào trang chủ luôn, không cần đăng nhập */}
        <Route path="/" element={<AuthRedirect />} />
        
        {/* Đường dẫn riêng cho trang đăng nhập */}
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* ÁP DỤNG BẢO VỆ CHO ROUTE ADMIN */}
        <Route 
          path="/admin" 
          element={
            // Bọc AdminDashboard bên trong ProtectedRoute
            // Yêu cầu bắt buộc: role phải là 'admin'
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Đường dẫn chi tiết sản phẩm */}
        <Route path="/product/:id" element={<ProductDetail />} />

        <Route 
          path="/owner" 
          element={
            <ProtectedRoute requiredRole="owner">
              <OwnerDashboard />
            </ProtectedRoute>
          } 
        />

        {/* --- ROUTE BẮT LỖI 404 --- */}
        {/* path="*" nghĩa là bất cứ link nào không khớp với các link trên */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}

export default App;
