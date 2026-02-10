import React, { useState, useEffect } from 'react';
import { Layout, Button, message, Space, Modal, Form, Input, Popconfirm, InputNumber } from 'antd';
import { LogoutOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
// import axios from 'axios'; <--- KHÔNG CẦN DÒNG NÀY NỮA
import { useAuth } from '../hooks/useAuth';
import { formatNumber, parseNumber, formatCurrencyVN } from '../utils/formatHelper';
import { getNumberSorter, getStringSorter } from '../utils/tableHelper';
import DataTable from '../components/DataTable';

// 1. IMPORT SERVICE VỪA TẠO
import { productService } from '../services/productService';

const { Header, Content } = Layout;
const { TextArea } = Input;

// const PRODUCT_API_URL = ...; <--- KHÔNG CẦN DÒNG NÀY NỮA

function OwnerDashboard() {
  const { logout } = useAuth();
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      if (editingProduct) {
        form.setFieldsValue(editingProduct);
      } else {
        form.resetFields();
      }
    }
  }, [isModalOpen, editingProduct, form]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // 2. GỌI API QUA SERVICE (Ngắn gọn hơn nhiều)
      // Lưu ý: data trả về là mảng luôn, không cần res.data
      const data = await productService.getAll(); 
      
      const myProducts = data.filter(p => p.ownerId === currentUser.id); 
      setProducts(myProducts);
    } catch (error) {
      message.error('Lỗi tải dữ liệu sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
        const productData = {
            ...values,
            ownerId: currentUser.id || 'unknown', 
            img: values.img || 'https://via.placeholder.com/200' 
        };

        if (editingProduct) {
            // 3. GỌI HÀM UPDATE
            await productService.update(editingProduct.id, productData);
            message.success('Cập nhật thành công!');
        } else {
            // 4. GỌI HÀM CREATE
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
        // 5. GỌI HÀM DELETE
        await productService.delete(id);
        message.success('Đã xóa sản phẩm');
        fetchProducts();
    } catch (error) {
        message.error('Xóa thất bại');
    }
  };

  // ... (Phần columns và return giữ nguyên không đổi) ...
  const columns = [
    { 
        title: 'Ảnh', dataIndex: 'img', key: 'img',
        render: (src) => <img src={src} alt="sp" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4, border: '1px solid #ddd' }} />
    },
    { 
        title: 'Tên sản phẩm', dataIndex: 'name', key: 'name', width: '25%',
        ...getStringSorter('name')
    },
    { 
        title: 'Giá', dataIndex: 'price', key: 'price',
        ...getNumberSorter('price'),
        render: (price) => (<span style={{ fontWeight: 'bold', color: '#d4380d' }}>{formatCurrencyVN(price)}</span>)
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
            title="Danh sách sản phẩm của tôi"
            dataSource={products}
            columns={columns}
            loading={loading}
            onCreate={() => { setEditingProduct(null); setIsModalOpen(true); }}
         />
      </Content>

      <Modal
        title={editingProduct ? "Sửa sản phẩm" : "Đăng sản phẩm mới"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}>
                <Input placeholder="Ví dụ: iPhone 15 Pro Max" />
            </Form.Item>
            
            <Form.Item name="price" label="Giá bán" rules={[{ required: true, message: 'Vui lòng nhập giá' }]}>
                <InputNumber style={{ width: '100%' }} placeholder="Nhập giá tiền" formatter={formatNumber} parser={parseNumber} addonAfter="VNĐ" />
            </Form.Item>

            <Form.Item name="img" label="Link ảnh (URL)">
                <Input placeholder="https://..." />
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