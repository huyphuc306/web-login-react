import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Thêm useLocation để biết đang ở trang nào
import { Layout, Menu, Avatar, Dropdown, message, Space, Button } from 'antd';
import { 
    UserOutlined, 
    LogoutOutlined, 
    ProfileOutlined, 
    DownOutlined,
    LoginOutlined,
    ShoppingCartOutlined,
    AppstoreOutlined,
    DashboardOutlined,
    HistoryOutlined
} from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';

const { Header } = Layout;

function AppHeader() {
  const { logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation(); // Lấy đường dẫn hiện tại để tô sáng Menu
  
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userStored = localStorage.getItem('currentUser');
    if (userStored) {
        setCurrentUser(JSON.parse(userStored));
    }
  }, []);

  // --- 1. XỬ LÝ ĐĂNG XUẤT ---
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    message.success('Đã đăng xuất!');
    navigate('/login');
  };

  // --- 2. CẤU HÌNH MENU DROPDOWN (USER) ---
  // Mẹo: Đặt key là đường dẫn (URL) muốn đến
  const userItems = [
    // Nếu là Admin thì hiện thêm dòng này
    ...(currentUser?.role === 'admin' ? [{
        key: '/admin', // Link đến trang quản trị
        label: 'Trang quản trị',
        icon: <DashboardOutlined />,
    }] : []),

    // Nếu là Owner
    ...(currentUser?.role === 'owner' ? [{
        key: '/owner', 
        label: 'Kênh người bán',
        icon: <AppstoreOutlined />,
    }] : []),
    
    // Các mục chung cho mọi user
    {
      key: '/profile', // (Ví dụ) Link đến trang hồ sơ
      label: 'Hồ sơ cá nhân',
      icon: <ProfileOutlined />,
    },
    {
      key: '/my-orders', // (Ví dụ) Link đến đơn hàng
      label: 'Đơn mua',
      icon: <HistoryOutlined />,
    },
    {
      type: 'divider', // Gạch ngang
    },
    {
      key: 'logout', // Key đặc biệt để xử lý đăng xuất
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  // Hàm xử lý khi bấm vào Dropdown
  const handleUserMenuClick = (e) => {
    if (e.key === 'logout') {
        logout();
    } else {
        // Các trường hợp còn lại: Điều hướng theo key
        // Ví dụ: key là '/profile' -> navigate('/profile')
        navigate(e.key);
    }
  };

  // --- 3. CẤU HÌNH MENU CHÍNH (HEADER) ---
  const menuItems = [
    { 
        key: '/', 
        label: 'Trang chủ',
        icon: <AppstoreOutlined />
    },
    { 
        key: '/products', // (Ví dụ) Trang danh sách sản phẩm
        label: 'Sản phẩm',
        icon: <AppstoreOutlined />
    },
    { 
        key: '/cart', // (Ví dụ) Trang giỏ hàng
        label: 'Giỏ hàng',
        icon: <ShoppingCartOutlined />
    },
    { 
        key: '/contact', // (Ví dụ) Trang liên hệ
        label: 'Liên hệ',
    },
  ];

  return (
    <Header style={{ display: 'flex', alignItems: 'center', background: '#001529', padding: '0 20px' }}>
      
      {/* Logo */}
      <div 
        style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', marginRight: '30px', cursor: 'pointer' }}
        onClick={() => navigate('/')}
      >
        MY-SHOP
      </div>

      {/* Menu Chính */}
      <Menu
        theme="dark"
        mode="horizontal"
        // selectedKeys: Tự động tô sáng mục menu trùng với đường dẫn hiện tại
        selectedKeys={[location.pathname]} 
        items={menuItems}
        // Khi bấm vào menu, lấy key (là đường dẫn) và navigate tới đó
        onClick={(e) => 
          navigate(e.key)}
        style={{ flex: 1, minWidth: 0 }}
      />

      {/* Khu vực User */}
      <div>
        {currentUser ? (
            <Dropdown menu={{ items: userItems, onClick: handleUserMenuClick }} trigger={['click']}>
                <div style={{ cursor: 'pointer' }} onClick={(e) => e.preventDefault()}>
                    <Space>
                        <span style={{ color: 'white', fontWeight: 'bold' }}>
                            {currentUser.fullName}
                        </span>
                        
                        {currentUser.avatar ? (
                            <Avatar size="large" src={currentUser.avatar} />
                        ) : (
                            <Avatar size="large" style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                        )}
                        
                        <DownOutlined style={{ color: 'white', fontSize: '12px' }} />
                    </Space>
                </div>
            </Dropdown>
        ) : (
            <Space>
                <Button 
                    type="text" 
                    style={{ color: 'white' }}
                    onClick={() => navigate('/register')}
                >
                    Đăng ký
                </Button>
                
                <Button type="primary" icon={<LoginOutlined />} onClick={() => navigate('/login')}>
                    Đăng nhập
                </Button>
            </Space>
        )}
      </div>

    </Header>
  );
}

export default AppHeader;