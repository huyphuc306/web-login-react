import React from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Sider } = Layout;

// Nhận prop 'selected' để biết đang ở trang nào (để tô sáng menu đó)
function AdminSider({ selectedKey }) {
  const navigate = useNavigate();

  return (
    <Sider collapsible>
      {/* Logo hoặc khoảng trắng mờ ở trên cùng */}
      <div 
        style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} 
      />
      
      <Menu 
        theme="dark" 
        defaultSelectedKeys={[selectedKey]} // Tô sáng mục menu đang chọn
        mode="inline"
        // Xử lý khi bấm vào menu
        onClick={(item) => {
            if (item.key === '1') navigate('/admin'); // Trang User
            if (item.key === '2') navigate('/admin/products'); // Trang Sản phẩm (Ví dụ sau này làm)
        }}
        items={[
            {
                key: '1',
                icon: <UserOutlined />,
                label: 'Quản lý Tài khoản',
            },
            {
                key: '2',
                icon: <AppstoreOutlined />,
                label: 'Quản lý Sản phẩm',
            },
        ]}
      />
    </Sider>
  );
}

export default AdminSider;