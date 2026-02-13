import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Thư viện giúp chuyển trang
import { accountData, userProfile } from '../data/mockData'; // Lấy tài khoản mẫu
import { message } from 'antd'; // Dùng message của Antd cho đẹp
import axios from 'axios'; // Import axios
import '../App.css';

const API_URL = 'https://64a77763096b3f0fcc8153b7.mockapi.io/users'; 

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Thêm async để chờ API phản hồi
  const handleLogin = async (e) => {
    e.preventDefault();
    
    // --- 1. CHECK ADMIN CỨNG (Không cần gọi API) ---
    if (username === accountData.username && password === accountData.password) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify({
            fullName: userProfile.fullName,
            avatar: userProfile.avatar,
            role: 'admin' // Vai trò là admin
        }));
        message.success('Xin chào Admin!');
        navigate('/admin'); // <--- CHUYỂN HƯỚNG SANG TRANG ADMIN
        return;
    }

    // --- 2. CHECK USER TỪ MOCKAPI ---
    try {
        // Gọi API tìm user có username nhập vào
        const res = await axios.get(`${API_URL}?username=${username}`);
        
        // MockAPI trả về 1 mảng các user tìm thấy
        if (res.data.length > 0) {
            const user = res.data[0]; // Lấy người đầu tiên tìm thấy
            
            // Kiểm tra mật khẩu (So sánh password nhập với password trên server)
            if (user.password === password) {
                // Đăng nhập thành công
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify({
                    id: user.id,
                    fullName: user.fullname,
                    avatar: user.avatar,
                    role: user.role,                    
                }));

                message.success(`Xin chào, ${user.fullname}!`);
                
                if (user.role === 'admin') {
                    navigate('/admin'); // Nếu là admin -> Sang trang quản trị
                } else if (user.role === 'owner'){
                    navigate('/owner');      // Nếu là user -> Sang trang chủ mua hàng
                } else {
                  navigate('/'); // User thường về trang chủ
                }  
            } else {
                message.error('Mật khẩu không đúng!');
            }
        } else {
            message.error('Tài khoản không tồn tại!');
        }

    } catch (error) {
        message.error('Lỗi kết nối Server!');
        console.error(error);
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

          <div style={{ marginTop: '15px', textAlign: 'center' }}>
            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Login;