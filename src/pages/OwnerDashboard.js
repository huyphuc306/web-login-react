import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Button, message, Space, Modal, Form, Input, Popconfirm, InputNumber, Select, Tag } from 'antd';
import { LogoutOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { formatNumber, parseNumber, formatCurrencyVN } from '../utils/formatHelper';
import { getNumberSorter, getStringSorter, useTableSearch } from '../utils/tableHelper';
import DataTable from '../components/DataTable';
import { productService } from '../services/productService';
import ImageUpload from '../components/ImageUpload';
import StarRating from '../components/StarRating';

const { Header, Content } = Layout;
const { TextArea } = Input;
const { Option } = Select;

function OwnerDashboard() {
  const { logout } = useAuth();
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  const { getColumnSearchProps } = useTableSearch(); 

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      console.log("1. Bắt đầu gọi API");
      const data = await productService.getAll();
      const myProducts = data.filter(p => p.ownerId === currentUser.id);
      setProducts(myProducts);
    } catch (error) {
      message.error('Lỗi tải dữ liệu sản phẩm');
    } finally {
      setLoading(false);
    }
  }, [currentUser.id]);;

  // --- 3. Thêm fetchProducts vào mảng dependency của useEffect ---
  useEffect(() => {
    console.log("2. Effect đang chạy"); // <-- Thêm dòng này
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (isModalOpen) {
      if (editingProduct) {
        form.setFieldsValue(editingProduct);
      } else {
        form.resetFields();
        form.setFieldsValue({ status: 'new' });
      }
    }
  }, [isModalOpen, editingProduct, form]);

  const handleSubmit = async (values) => {
    try {
        // Xử lý ảnh: images là mảng, img là ảnh đầu tiên (ảnh đại diện)
        const images = values.images || [];
        
        const productData = {
            ...values,
            img: images.length > 0 ? images[0] : 'https://via.placeholder.com/200',
            images: images,
            ownerId: currentUser.id || 'unknown',
            status: values.status || 'new',
        };

        if (editingProduct) {
            // SỬA: Giữ nguyên rating và reviewCount cũ
            await productService.update(editingProduct.id, productData);
            message.success('Cập nhật thành công!');
        } else {
            // TẠO MỚI: Rating và ReviewCount bắt đầu từ 0
            productData.rating = 0;
            productData.reviewCount = 0;

            await productService.create(productData);
            message.success('Đăng mới thành công!');
        }
        setIsModalOpen(false);
        fetchProducts();
    } catch (error) {
        message.error('Có lỗi xảy ra!');
    }
  };

  const handleDelete = async (id) => {
    try {
        await productService.delete(id);
        message.success('Đã xóa sản phẩm');
        fetchProducts();
    } catch (error) {
        message.error('Xóa thất bại');
    }
  };

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'images',
      key: 'images',
      width: 80,
      render: (images, record) => {
        // Lấy ảnh đầu tiên trong mảng, nếu không có thì lấy img
        const src = (images && images.length > 0) ? images[0] : record.img;
        return (
          <img
            src={src}
            alt="sp"
            style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4, border: '1px solid #ddd' }}
            onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/50"; }}
          />
        );
      }
    },
    {
      title: 'Tên sản phẩm', dataIndex: 'name', key: 'name', width: '20%',
      ...getColumnSearchProps('name', 'Tên sản phẩm'), 
      ...getStringSorter('name')
    },
    {
      title: 'Giá', dataIndex: 'price', key: 'price',
      ...getNumberSorter('price'),
      render: (price) => (<span style={{ fontWeight: 'bold', color: '#d4380d' }}>{formatCurrencyVN(price)}</span>)
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      width: '20%',
      ...getNumberSorter('rating'),
      render: (rating, record) => (
        <StarRating
          rating={rating}
          reviewCount={record.reviewCount}
          size={12}
        />
      )
    },
    {
      title: 'Độ mới', dataIndex: 'status', key: 'status',
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
    { title: 'Mô tả', dataIndex: 'description', key: 'description', ellipsis: true },
    {
      title: 'Hành động', key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => { setEditingProduct(record); setIsModalOpen(true); }}>Sửa</Button>
          <Popconfirm title="Xóa sản phẩm này?" onConfirm={() => handleDelete(record.id)} okButtonProps={{ danger: true }}>
            <Button danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Header style={{ padding: '0 20px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,21,41,0.08)' }}>
        <h2 style={{ margin: 0, color: '#001529' }}>Kênh người bán - {currentUser.fullName}</h2>
        <Button type="primary" danger icon={<LogoutOutlined />} onClick={logout}>Đăng xuất</Button>
      </Header>

      <Content style={{ margin: '20px' }}>
        <DataTable
          title="Kho hàng của tôi"
          dataSource={products}
          columns={columns}
          loading={loading}
          onCreate={() => { setEditingProduct(null); setIsModalOpen(true); }}
        />
      </Content>

      <Modal
        title={editingProduct ? "Cập nhật sản phẩm" : "Đăng bán sản phẩm"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}>
            <Input placeholder="Ví dụ: iPhone 15 Pro Max" />
          </Form.Item>

          <Form.Item name="price" label="Giá bán" rules={[{ required: true, message: 'Vui lòng nhập giá' }]}>
            <InputNumber style={{ width: '100%' }} placeholder="Nhập giá tiền" formatter={formatNumber} parser={parseNumber} addonAfter="VNĐ" />
          </Form.Item>

          <Form.Item name="status" label="Tình trạng sản phẩm" rules={[{ required: true, message: 'Vui lòng chọn tình trạng' }]}>
            <Select placeholder="Chọn tình trạng">
              <Option value="new">🆕 Mới 100% (Fullbox/Chưa bóc seal)</Option>
              <Option value="like_new">✨ Like New (99% - Như mới)</Option>
              <Option value="used_good">👌 Đã qua sử dụng (Còn tốt)</Option>
              <Option value="used_bad">⚠️ Cũ / Trầy xước nhiều</Option>
            </Select>
          </Form.Item>

          {/* UPLOAD NHIỀU ẢNH */}
          <Form.Item name="images" label="Ảnh sản phẩm (Tối đa 5 ảnh)">
            <ImageUpload maxCount={5} />
          </Form.Item>

          <Form.Item name="description" label="Mô tả chi tiết">
            <TextArea rows={4} placeholder="Nhập mô tả sản phẩm..." />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
            <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit">
              {editingProduct ? "Lưu thay đổi" : "Đăng bán ngay"}
            </Button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
}

export default OwnerDashboard;