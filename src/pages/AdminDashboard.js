import React, { useState, useEffect, useRef } from 'react';
import { Layout, Table, Button, message, Tag, Space, Modal, Form, Input, Select, Popconfirm } from 'antd';
import { LogoutOutlined, EditOutlined, DeleteOutlined, PlusOutlined  } from '@ant-design/icons';
import axios from 'axios';
import AdminSider from '../components/AdminSider';
import { useTableSearch } from '../utils/tableHelper'; 
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';

const { Header, Content } = Layout;
const { Option } = Select;

//const API_URL = 'https://64a77763096b3f0fcc8153b7.mockapi.io/users';

function AdminDashboard() {
  const { logout } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- STATE MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  // --- STATE TÌM KIẾM ---
  const { getColumnSearchProps } = useTableSearch(); 

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (isModalOpen && editingUser) {
        form.resetFields();
        form.setFieldsValue({
            fullname: editingUser.fullname,
            email: editingUser.email,
            username: editingUser.username,
            role: editingUser.role
        });
    }
  }, [isModalOpen, editingUser, form]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
        const data = await userService.getAll();
        setUsers(data);
    } catch (error) {
        message.error('Không thể lấy dữ liệu người dùng!');
    } finally {
        setLoading(false);
    }
  };

  // --- MỞ MODAL ĐỂ TẠO MỚI ---
  const handleOpenCreate = () => {
    setEditingUser(null); // Đặt về null để biết là đang tạo mới
    setIsModalOpen(true);
  };

  // --- CHỨC NĂNG SỬA ---

  const handleEdit = (record) => {
    setEditingUser(record);
    setIsModalOpen(true);
  };

  // --- 3. XỬ LÝ LƯU (CHUNG CHO CẢ TẠO VÀ SỬA) ---
  const handleSubmit = async (values) => {
    try {
        if (editingUser) {
            // === LOGIC CẬP NHẬT (PUT) ===
            // Nếu không nhập pass mới thì xóa trường password khỏi dữ liệu gửi đi (giữ pass cũ)
            if (!values.password) {
                delete values.password;
            }
            
            await userService.update(editingUser.id, values);
            message.success('Cập nhật thành công!');
        } else {
            // === LOGIC TẠO MỚI (POST) ===
            // Kiểm tra trùng username/email sơ bộ (nếu cần)
            
            // 1. Lấy danh sách user mới nhất từ server về để đối chiếu
            const currentUsers = await userService.getAll();

            // 2. Kiểm tra trùng lặp
            const isEmailDuplicate = currentUsers.find(u => u.email === values.email);
            const isUsernameDuplicate = currentUsers.find(u => u.username === values.username);

            // 3. Xử lý lỗi nếu trùng
            if (isUsernameDuplicate) {
                message.error('Tên đăng nhập này đã tồn tại! Vui lòng chọn tên khác.');
                return; // Dừng lại
            }

            if (isEmailDuplicate) {
                message.error('Email này đã được sử dụng! Vui lòng chọn email khác.');
                return; // Dừng lại, không chạy tiếp code bên dưới
            }

            const newUser = {
                ...values,
                avatar: 'https://via.placeholder.com/150' // Ảnh mặc định
            };
            await userService.create(newUser);
            message.success('Tạo tài khoản mới thành công!');
        }

        // Làm mới bảng và đóng modal
        setIsModalOpen(false);
        fetchUsers();

    } catch (error) {
        console.error(error);
        message.error('Có lỗi xảy ra! Vui lòng thử lại.');
    }
  };

  // --- CHỨC NĂNG XÓA ---
  const handleDelete = async (id) => {
    try {
        await userService.delete(id);
        message.success('Xóa tài khoản thành công!');
        // Gọi lại hàm lấy dữ liệu để bảng cập nhật mới nhất
        fetchUsers(); 
    } catch (error) {
        message.error('Xóa thất bại! Có lỗi xảy ra.');
        console.error(error);
    }
  };

  // --- CẤU HÌNH CỘT ---
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
    
    { 
        title: 'Họ tên', 
        dataIndex: 'fullname', 
        key: 'fullname',
        ...getColumnSearchProps('fullname', 'Họ tên') 
    },
    
    { 
        title: 'Tên đăng nhập', 
        dataIndex: 'username', 
        key: 'username',
        ...getColumnSearchProps('username', 'Tên đăng nhập')
    },
    
    { title: 'Email', dataIndex: 'email', key: 'email' },

    // --- CẬP NHẬT CỘT VAI TRÒ ---
    { 
        title: 'Vai trò', 
        dataIndex: 'role', 
        key: 'role',
        // 1. Định nghĩa danh sách các lựa chọn để lọc
        filters: [
            { text: 'Admin', value: 'admin' },
            { text: 'Owner', value: 'owner' },
            { text: 'User', value: 'user' },
        ],
        // 2. Logic so sánh: Nếu role của dòng = giá trị đang chọn thì hiển thị
        onFilter: (value, record) => record.role === value,
        
        render: (role) => {
        let color = 'blue';
        if (role === 'admin') color = 'red';
        if (role === 'owner') color = 'gold'; 
        return (
            <Tag color={color}>
                {role ? role.toUpperCase() : 'USER'}
            </Tag>
        );
        }
    },

    {
        title: 'Hành động',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <Button 
                    type="primary" 
                    icon={<EditOutlined />} 
                    onClick={() => handleEdit(record)}
                >
                    Sửa
                </Button>

                <Popconfirm
                    title="Cảnh báo"
                    description={`Bạn có chắc muốn xóa tài khoản "${record.username}" không?`}
                    onConfirm={() => handleDelete(record.id)}
                    okText="Xóa luôn"
                    cancelText="Hủy"
                    okButtonProps={{ danger: true }} // Làm nút OK màu đỏ
                >
                    <Button 
                        type="primary" 
                        danger // Màu đỏ
                        icon={<DeleteOutlined />} 
                    >
                        Xóa
                    </Button>
                </Popconfirm>

            </Space>
        ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AdminSider selectedKey="1" />

      <Layout className="site-layout">
        <Header style={{ padding: '0 20px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0 }}>Quản lý Tài khoản</h2>

            <Button type="primary" danger icon={<LogoutOutlined />} onClick={logout}>
                Đăng xuất
            </Button>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                <Button 
                    type="primary" 
                    style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }} 
                    icon={<PlusOutlined />} 
                    onClick={handleOpenCreate}
                >
                    Tạo tài khoản mới
                </Button>
            </div>

            <Table 
                dataSource={users} 
                columns={columns} 
                rowKey="id" 
                loading={loading}
            />
          </div>
        </Content>

        <Modal
            title={editingUser ? "Chỉnh sửa thông tin" : "Tạo tài khoản mới"}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
            destroyOnClose 
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit} // Gọi hàm submit chung
            >
                <Form.Item
                    name="fullname"
                    label="Họ và tên"
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                >
                    <Input placeholder="Nhập họ tên đầy đủ" />
                </Form.Item>

                <Form.Item
                    name="username"
                    label="Tên đăng nhập"
                    rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                >
                    {/* Logic: Nếu đang sửa thì disable (không cho sửa username), nếu tạo mới thì cho nhập */}
                    <Input disabled={!!editingUser} placeholder="Nhập username" />
                </Form.Item>

                {/* Trường Password */}
                <Form.Item
                    name="password"
                    label={editingUser ? "Mật khẩu mới (Để trống nếu không đổi)" : "Mật khẩu"}
                    rules={[
                        // Nếu đang tạo mới (editingUser là null) thì bắt buộc nhập
                        { required: !editingUser, message: 'Vui lòng nhập mật khẩu!' }
                    ]}
                >
                    <Input.Password placeholder="Nhập mật khẩu..." />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { type: 'email', message: 'Email không hợp lệ!' },
                        { required: true, message: 'Vui lòng nhập email!' }
                    ]}
                >
                    <Input placeholder="example@mail.com" />
                </Form.Item>

                <Form.Item
                    name="role"
                    label="Vai trò"
                    rules={[{ required: true }]}
                >
                    <Select>
                        <Option value="user">User</Option>
                        <Option value="owner">Owner</Option>
                        <Option value="admin">Admin</Option>
                    </Select>
                </Form.Item>

                <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Space>
                        <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
                        <Button type="primary" htmlType="submit">
                            {editingUser ? "Cập nhật" : "Tạo mới"}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>

      </Layout>
    </Layout>
  );
}

export default AdminDashboard;