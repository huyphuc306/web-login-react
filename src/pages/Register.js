import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, message, Card, Modal } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';
import axios from 'axios';

// Link gốc (Đã được bạn xác nhận là chạy được)
const API_URL = 'https://64a77763096b3f0fcc8153b7.mockapi.io/users'; 

function Register() {
  const navigate = useNavigate();

  // State quản lý trạng thái Loading (đang xoay vòng tròn)
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);

    try {
        console.log("1. Đang lấy danh sách user từ:", API_URL);

        // --- CHIẾN THUẬT MỚI: LẤY HẾT VỀ RỒI TỰ SOI ---
        // Bước 1: Lấy toàn bộ danh sách user về
        const res = await axios.get(API_URL);
        
        // Danh sách user hiện có (nếu chưa có ai thì là mảng rỗng [])
        const allUsers = res.data;

        // Bước 2: Dùng hàm JS để tìm xem có ai trùng Email không
        const duplicateEmail = allUsers.find(user => user.email === values.email);
        const duplicateUser = allUsers.find(user => user.username === values.username);

        // Nếu phát hiện trùng lặp
        if (duplicateEmail || duplicateUser) {
            setLoading(false); // Tắt loading ngay
            
            // Hiện Modal Lỗi
            Modal.error({
                title: 'Đăng ký thất bại',
                content: duplicateEmail 
                    ? 'Email này đã được sử dụng. Vui lòng chọn email khác!' 
                    : 'Tên đăng nhập này đã có người dùng!',
            });
            return; // Dừng lại
        }

        // --- BƯỚC 3: NẾU SẠCH SẼ THÌ TẠO MỚI ---
        console.log("2. Không trùng, đang tạo tài khoản...");
        
        const newUser = {
            fullname: values.fullname,
            email: values.email,
            username: values.username,
            password: values.password,
            avatar: null,
            role: 'user'
        };

        await axios.post(API_URL, newUser);

        // Tắt Loading
        setLoading(false);

        // Hiện Modal Thành công
        Modal.success({
            title: 'Chúc mừng!',
            content: 'Tài khoản của bạn đã được tạo thành công.',
            okText: 'Đăng nhập ngay',
            onOk: () => {
                // Khi người dùng bấm nút OK trong Modal thì mới chuyển trang
                navigate('/login');
            }
        });

    } catch (error) {
        console.error("Lỗi:", error);
        message.error('Có lỗi kết nối! Vui lòng kiểm tra lại mạng hoặc link API.');
    }
  };

  return (
    <div className="container">
      <Card 
        title={<h2 style={{textAlign: 'center', color: '#1890ff'}}>Đăng Ký Tài Khoản</h2>} 
        bordered={false} 
        style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
      >
        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
          scrollToFirstError
        >
          {/* HỌ TÊN */}
          <Form.Item
            name="fullname"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
          >
            <Input prefix={<IdcardOutlined />} placeholder="Ví dụ: Nguyễn Văn B" />
          </Form.Item>

          {/* EMAIL */}
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { type: 'email', message: 'Email không hợp lệ!' },
              { required: true, message: 'Vui lòng nhập Email!' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="nguyenb@example.com" />
          </Form.Item>

          {/* USERNAME */}
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Tên dùng để đăng nhập" />
          </Form.Item>

          {/* PASSWORD */}
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            hasFeedback
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" />
          </Form.Item>

          {/* CONFIRM PASSWORD */}
          <Form.Item
            name="confirm"
            label="Xác nhận mật khẩu"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Vui lòng nhập lại mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Hai mật khẩu không khớp nhau!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu" />
          </Form.Item>

          <Form.Item>
              {/* //Nút bấm cũng có trạng thái loading */}
                <Button type="primary" htmlType="submit" className="login-btn" loading={loading}>
                {loading ? 'Đang tạo...' : 'Đăng Ký'}
                </Button>
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
                </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Register;