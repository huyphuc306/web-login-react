import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Button, theme, Row, Col, Breadcrumb, Typography, Carousel, Spin, Avatar, Card, message } from 'antd';
import { HomeOutlined, ShoppingCartOutlined, UserOutlined, ShopOutlined } from '@ant-design/icons';

import AppHeader from '../components/AppHeader';
import { productService } from '../services/productService'; // 1. Import Service Sản phẩm
import { userService } from '../services/userService';       // 2. Import Service User
import { formatCurrencyVN } from '../utils/formatHelper';    // 3. Import Format tiền

const { Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

  // --- STATE ---
  const [product, setProduct] = useState(null);
  const [owner, setOwner] = useState(null); // Biến lưu thông tin chủ shop
  const [loading, setLoading] = useState(true);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Bước 1: Lấy thông tin sản phẩm
        const productData = await productService.getById(id);
        setProduct(productData);

        // Bước 2: Nếu sản phẩm có ownerId, đi tìm thông tin người bán
        if (productData.ownerId && productData.ownerId !== 'unknown') {
            try {
                // Gọi API lấy user theo ID
                const ownerData = await userService.getById(productData.ownerId);
                setOwner(ownerData);
            } catch (error) {
                console.log('Không tìm thấy thông tin người bán hoặc user đã bị xóa');
                setOwner({ fullname: 'Người bán ẩn danh' });
            }
        } else {
            // Trường hợp hàng của hệ thống hoặc admin cứng
            setOwner({ fullname: 'Hệ thống My Shop', role: 'admin' });
        }

      } catch (error) {
        message.error('Không tìm thấy sản phẩm!');
        navigate('/not-found');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, navigate]);

  // CSS cho Carousel
  const contentStyle = {
    height: '400px',
    color: '#fff',
    lineHeight: '400px',
    textAlign: 'center',
    background: '#f0f2f5',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10px',
    overflow: 'hidden'
  };

  // --- HIỂN THỊ LOADING ---
  if (loading) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Spin size="large" tip="Đang tải sản phẩm..." />
        </div>
    );
  }

  // --- HIỂN THỊ KHI KHÔNG CÓ DỮ LIỆU ---
  if (!product) return null;

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      
      <AppHeader />

      <Content style={{ padding: '0 48px', marginTop: '20px' }}>
        <Breadcrumb
            style={{ margin: '16px 0' }}
            items={[
                { title: <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}><HomeOutlined /> Trang chủ</span> },
                { title: 'Chi tiết sản phẩm' },
                { title: product.name },
            ]}
        />

        <div style={{ background: colorBgContainer, padding: 24, borderRadius: borderRadiusLG }}>
            <Row gutter={[48, 16]}>
                
                {/* --- CỘT TRÁI: ẢNH SẢN PHẨM --- */}
                <Col span={10}>
                    <div style={{ padding: '0 20px' }}>
                         {/* Nếu có img (link đơn) thì hiện, sau này nếu API có mảng images thì dùng Carousel */}
                         <div style={contentStyle}>
                            <img 
                                src={product.img} 
                                alt={product.name} 
                                style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }}
                                onError={(e) => {e.target.onerror = null; e.target.src="https://via.placeholder.com/400"}} 
                            />
                         </div>
                    </div>
                </Col>

                {/* --- CỘT PHẢI: THÔNG TIN --- */}
                <Col span={14}>
                    <Title level={2}>{product.name}</Title>
                    
                    {/* Giá tiền format đẹp */}
                    <Title level={3} type="danger">
                        {formatCurrencyVN(product.price)}
                    </Title>
                    
                    {/* Hiển thị Tình trạng (Status) */}
                    <div style={{ marginBottom: 20 }}>
                        <Text strong>Tình trạng: </Text>
                        {product.status === 'new' && <Text type="success">Mới 100%</Text>}
                        {product.status === 'like_new' && <Text style={{ color: '#13c2c2' }}>Like New 99%</Text>}
                        {product.status === 'used_good' && <Text style={{ color: '#1890ff' }}>Đã qua sử dụng (Tốt)</Text>}
                        {product.status === 'used_bad' && <Text type="warning">Cũ / Xước</Text>}
                        {/* Fallback cho dữ liệu cũ */}
                        {!['new', 'like_new', 'used_good', 'used_bad'].includes(product.status) && <Text type="secondary">Đang bán</Text>}
                    </div>

                    {/* --- [QUAN TRỌNG] THÔNG TIN NGƯỜI BÁN --- */}
                    {owner && (
                        <Card size="small" style={{ marginBottom: 20, background: '#f9f9f9', borderColor: '#e6f7ff' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                                <Avatar 
                                    size={50} 
                                    icon={<UserOutlined />} 
                                    src={owner.avatar} 
                                    style={{ backgroundColor: '#87d068' }}
                                />
                                <div>
                                    <div style={{ fontSize: '12px', color: '#888' }}>Được bán bởi:</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#001529' }}>
                                        {owner.role === 'admin' ? <ShopOutlined /> : <UserOutlined />} {owner.fullname}
                                    </div>
                                    {owner.email && <div style={{ fontSize: '12px', color: '#555' }}>LH: {owner.email}</div>}
                                </div>
                            </div>
                        </Card>
                    )}

                    <Paragraph style={{ fontSize: '16px', color: '#555', lineHeight: '1.8' }}>
                        {product.description || "Chưa có mô tả cho sản phẩm này."}
                    </Paragraph>

                    <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                        <Button type="primary" size="large" icon={<ShoppingCartOutlined />} style={{ height: '50px', width: '200px' }}>
                            Thêm vào giỏ
                        </Button>
                        <Button size="large" type="default" style={{ height: '50px' }}>
                            Mua trả góp 0%
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>My Shop ©2024</Footer>
    </Layout>
  );
}

export default ProductDetail;