import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Thư viện giúp chuyển trang
// ĐÃ XÓA: import { accountData, userProfile } from '../data/mockData';
import { message, Button, Divider } from 'antd'; // Dùng message của Antd cho đẹp
import { GoogleOutlined } from '@ant-design/icons';
// ĐÃ XÓA: import axios from 'axios';
import { userService } from '../services/userService';
import '../App.css';

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Thêm async để chờ API phản hồi
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        // ... (Giữ nguyên logic cũ của bạn ở đây) ...
        // Logic tìm user trong database và check pass
        // Mình viết tắt đoạn này để tập trung vào phần Google nhé
        const res = await userService.getAll();
        const user = res.find(u => u.username === username && u.password === password);
        
        if (user) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify(user));
            message.success(`Xin chào, ${user.fullname}!`);
            
            if (user.role === 'admin') navigate('/admin');
            else if (user.role === 'owner') navigate('/owner');
            else navigate('/');
        } else {
            message.error('Tài khoản hoặc mật khẩu không đúng!');
        }
    } catch (error) {
        message.error('Lỗi kết nối Server!');
    }
  };  

  // --- 2. XỬ LÝ ĐĂNG NHẬP GOOGLE (MỚI) ---
  const handleGoogleLogin = async () => {
    try {
        // 1. Đăng nhập Google
        const result = await signInWithPopup(auth, googleProvider);
        const googleUser = result.user;
        console.log("Email từ Google:", googleUser.email);

        // 2. Tìm kiếm User qua Service (Đã sửa)
        // Lưu ý: Kết quả trả về là Mảng (Array) giống như đoạn test vừa rồi
        const existingUsers = await userService.findByEmail(googleUser.email);
        
        console.log("Tìm thấy user:", existingUsers); // Log để kiểm tra

        let userToLogin = null;

        if (existingUsers.length > 0) {
            // A. ĐÃ CÓ TÀI KHOẢN
            userToLogin = existingUsers[0];
            message.success(`Chào mừng trở lại, ${userToLogin.fullname}!`);
        } else {
            // B. CHƯA CÓ -> TẠO MỚI
            const newUser = {
                fullname: googleUser.displayName,
                email: googleUser.email,
                username: googleUser.email, // Lấy email làm username
                password: 'google_login',   // Mật khẩu giả
                avatar: googleUser.photoURL,
                role: 'user', // Mặc định là khách
            };
            
            // Gọi API tạo mới
            userToLogin = await userService.create(newUser);
            message.success('Đăng ký thành công bằng Google!');
        }

        // 3. Lưu vào LocalStorage và Chuyển trang
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(userToLogin));

        if (userToLogin.role === 'admin') navigate('/admin');
        else if (userToLogin.role === 'owner') navigate('/owner');
        else navigate('/');

    } catch (error) {
        console.error(error);
        message.error('Đăng nhập Google thất bại!');
        console.error("LỖI CHI TIẾT:", error.code, error.message); // In rõ mã lỗi
        message.error(`Lỗi: ${error.message}`);
    }
  };  

  return (
    <div className="container">
      <div className="login-box">
        <h2>Đăng Nhập</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Tên đăng nhập</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          <div className="input-group">
            <label>Mật khẩu</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-btn">Đăng Nhập</button>

          <Divider>Hoặc</Divider>
        
          <Button 
              icon={<GoogleOutlined />} 
              size="large" 
              block 
              onClick={handleGoogleLogin}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderColor: '#d9d9d9' }}
          >
              Đăng nhập bằng Google
          </Button>

          <div style={{ marginTop: '15px', textAlign: 'center' }}>
            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Login;