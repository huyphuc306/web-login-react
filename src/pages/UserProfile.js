import React, { useState, useEffect } from 'react';
import { Layout, Card, Form, Input, Button, Avatar, message, Spin } from 'antd';
import { UserOutlined, UploadOutlined, SaveOutlined, LockOutlined, MailOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';
import AppHeader from '../components/AppHeader';

const { Content } = Layout;

function UserProfile() {
  const { logout } = useAuth(); 
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const storedUser = JSON.parse(localStorage.getItem('currentUser'));
        if (storedUser && storedUser.id) {
            const data = await userService.getById(storedUser.id);
            setCurrentUser(data);
            
            // Đổ dữ liệu vào form
            form.setFieldsValue({
                ...data,
                // Giữ mật khẩu hiện tại vào ô input (nếu muốn hiển thị chấm tròn)
                password: data.password 
            });
        }
      } catch (error) {
        message.error('Lỗi tải thông tin cá nhân');
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [form]);

  const handleUpdate = async (values) => {
    try {
        setLoading(true);

        // Gộp thông tin cũ và thông tin mới
        const updateData = {
            ...currentUser, 
            fullname: values.fullname,
            avatar: values.avatar,
            password: values.password, 
        };

        // Gọi API cập nhật
        await userService.update(currentUser.id, updateData);
        
        // Cập nhật lại localStorage để Header hiển thị đúng
        localStorage.setItem('currentUser', JSON.stringify(updateData));
        
        setCurrentUser(updateData);
        message.success('Cập nhật hồ sơ thành công!');
        
        // Reload trang
        window.location.reload(); 

    } catch (error) {
        message.error('Có lỗi xảy ra khi lưu!');
    } finally {
        setLoading(false);
    }
  };

  if (!currentUser) return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }} />;

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <AppHeader />
      
      <Content style={{ padding: '40px', display: 'flex', justifyContent: 'center' }}>
        <Card 
            title="Cập nhật thông tin tài khoản" 
            style={{ width: 600, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '8px' }}
        >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 30 }}>
                <Avatar 
                    size={100} 
                    src={currentUser.avatar} 
                    icon={<UserOutlined />} 
                    style={{ border: '2px solid #1890ff' }}
                />
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleUpdate}
                initialValues={currentUser}
            >
                {/* --- PHẦN HIỂN THỊ (KHÔNG SỬA ĐƯỢC) --- */}
                <div style={{ display: 'flex', gap: '20px' }}>
                    <Form.Item label="Tên đăng nhập" name="username" style={{ flex: 1 }}>
                        <Input 
                            prefix={<UserOutlined style={{ color: '#999' }} />} 
                            disabled 
                            style={{ backgroundColor: '#f5f5f5', color: '#555', cursor: 'default' }} 
                        />
                    </Form.Item>

                    <Form.Item label="Email" name="email" style={{ flex: 1 }}>
                        <Input 
                            prefix={<MailOutlined style={{ color: '#999' }} />} 
                            disabled 
                            style={{ backgroundColor: '#f5f5f5', color: '#555', cursor: 'default' }} 
                        />
                    </Form.Item>
                </div>

                {/* --- PHẦN CHỈNH SỬA --- */}
                <Form.Item 
                    label="Họ và tên hiển thị" 
                    name="fullname" 
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                >
                    <Input placeholder="Nhập họ tên của bạn" />
                </Form.Item>

                <Form.Item label="Link Ảnh đại diện (URL)" name="avatar">
                    <Input prefix={<UploadOutlined />} placeholder="https://..." />
                </Form.Item>

                <Form.Item 
                    label="Mật khẩu" 
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                    hasFeedback
                >
                    <Input.Password 
                        prefix={<LockOutlined />} 
                        placeholder="Nhập mật khẩu mới" 
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                </Form.Item>

                <Form.Item style={{ marginTop: 30 }}>
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        icon={<SaveOutlined />} 
                        block 
                        loading={loading} 
                        size="large"
                        style={{ height: '45px', borderRadius: '6px' }}
                    >
                        Lưu thay đổi
                    </Button>
                </Form.Item>
            </Form>
        </Card>
      </Content>
    </Layout>
  );
}

export default UserProfile;