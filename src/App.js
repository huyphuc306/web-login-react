import './App.css';
// import { useState } from 'react';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';
import OwnerDashboard from './pages/OwnerDashboard';
import UserProfile from './pages/UserProfile';
import AdminProducts from './pages/AdminProducts';
import Cart from './pages/Cart';
import Chat from './pages/Chat';
import TawkChat from './components/TawkChat';

const rolePaths = {
  admin: '/admin',
  owner: '/owner',
};

function AuthRedirect() {

  console.log('1. AuthRedirect bắt đầu chạy mamamamamaam');

  let user = null;

  try {
    const storedUser = localStorage.getItem('currentUser');
    console.log('2. Dữ liệu trong localStorage:', storedUser);

    if (storedUser) {
      user = JSON.parse(storedUser);
      console.log('3. Parse thành công:', user);
    }
  } catch (error) {
    console.error('LỖI PARSE:', error);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
  }

  if (!user) {
    console.log('4. Chưa đăng nhập → Hiện Home');
    return <Home />;
  }

  const redirectPath = rolePaths[user.role];
  console.log('5. Role:', user.role, '→ Redirect:', redirectPath);

  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

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

        <Route path="/profile" element={
          // Nếu chưa đăng nhập -> ProtectedRoute sẽ đá về Login
          // Tham số requiredRole không truyền -> Ai cũng vào được miễn là đã login
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
        />

        <Route path="/chat" element={<Chat />} />

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

        <Route
          path="/admin/products"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminProducts />
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

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        {/* --- ROUTE BẮT LỖI 404 --- */}
        {/* path="*" nghĩa là bất cứ link nào không khớp với các link trên */}
        <Route path="*" element={<NotFound />} />

      </Routes>
      <TawkChat />
    </Router>
  );
}

export default App;
