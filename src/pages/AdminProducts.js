import React, { useState, useEffect } from 'react';
import { Layout, Button, message, Space, Tag, Popconfirm } from 'antd';
import { LogoutOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { productService } from '../services/productService';
import { userService } from '../services/userService';
import { formatCurrencyVN } from '../utils/formatHelper';
import { getNumberSorter, getStringSorter, useTableSearch } from '../utils/tableHelper';
import DataTable from '../components/DataTable';
import AdminSider from '../components/AdminSider';
import { useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;

function AdminProducts() {
  const { logout } = useAuth();
  
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { getColumnSearchProps } = useTableSearch(); 

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Lấy cả 2 danh sách: Sản phẩm và Users
      const [productData, userData] = await Promise.all([
        productService.getAll(),
        userService.getAll()
      ]);
      
      // Gắn thêm trường ownerName vào mỗi sản phẩm để Search hoạt động
      const productsWithOwner = productData.map(product => {
        const owner = userData.find(u => u.id === product.ownerId);
        return {
          ...product,
          ownerName: owner ? owner.fullname : 'Không xác định'
        };
      });

      setProducts(productsWithOwner);
      setUsers(userData);
    } catch (error) {
      message.error('Lỗi tải dữ liệu!');
    } finally {
      setLoading(false);
    }
  };

  // Hàm tìm tên Owner dựa vào ownerId
  const getOwnerName = (ownerId) => {
    const owner = users.find(u => u.id === ownerId);
    return owner ? owner.fullname : 'Không xác định';
  };

  const handleDelete = async (id) => {
    try {
      await productService.delete(id);
      message.success('Đã xóa sản phẩm!');
      fetchData();
    } catch (error) {
      message.error('Xóa thất bại!');
    }
  };

  const columns = [
    { 
      title: 'Ảnh', 
      dataIndex: 'img', 
      key: 'img', 
      width: 80,
      render: (src) => (
        <img 
          src={src} 
          alt="sp" 
          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4, border: '1px solid #ddd' }} 
          onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/50"; }}
        />
      )
    },
    { 
      title: 'Tên sản phẩm', 
      dataIndex: 'name', 
      key: 'name', 
      width: '20%',
      ...getStringSorter('name'),
      render: (name, record) => (
        <a 
          onClick={() => navigate(`/product/${record.id}`)}
          style={{ color: '#1890ff', cursor: 'pointer', fontWeight: 500 }}
        >
          {name}
        </a>    
      )
    },
    { 
      title: 'Giá', 
      dataIndex: 'price', 
      key: 'price',
      ...getNumberSorter('price'),
      render: (price) => (
        <span style={{ fontWeight: 'bold', color: '#d4380d' }}>
          {formatCurrencyVN(price)}
        </span>
      )
    },
    // Cột hiển thị tên chủ sản phẩm
    {
      title: 'Người bán',
      dataIndex: 'ownerName',
      key: 'ownerName',
      ...getColumnSearchProps('ownerName', 'Họ tên') 
    },
    // Cột tình trạng
    {
      title: 'Độ mới',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Mới 100%', value: 'new' },
        { text: 'Like New', value: 'like_new' },
        { text: 'Đã dùng (Tốt)', value: 'used_good' },
        { text: 'Cũ / Xước', value: 'used_bad' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        let color = 'default';
        let text = 'Không xác định';
        switch (status) {
          case 'new':       color = 'green'; text = 'MỚI 100%'; break;
          case 'like_new':  color = 'cyan';  text = 'LIKE NEW'; break;
          case 'used_good': color = 'blue';  text = 'ĐÃ DÙNG (TỐT)'; break;
          case 'used_bad':  color = 'red';   text = 'CŨ / XƯỚC'; break;
          default: break;
        }
        return <Tag color={color}>{text}</Tag>;
      }
    },
    { 
      title: 'Mô tả', 
      dataIndex: 'description', 
      key: 'description', 
      ellipsis: true 
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Popconfirm 
            title="Xóa sản phẩm này?" 
            onConfirm={() => handleDelete(record.id)} 
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Truyền selectedKey="2" để tô sáng menu "Quản lý Sản phẩm" */}
      <AdminSider selectedKey="2" />

      <Layout className="site-layout">
        <Header style={{ padding: '0 20px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>Quản lý Sản phẩm</h2>
          <Button type="primary" danger icon={<LogoutOutlined />} onClick={logout}>
            Đăng xuất
          </Button>
        </Header>

        <Content style={{ margin: '16px' }}>
          <DataTable 
            title="Tất cả sản phẩm trên hệ thống"
            dataSource={products}
            columns={columns}
            loading={loading}
            // Không truyền onCreate vì Admin chỉ xem và xóa, không tạo sản phẩm
          />
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminProducts;