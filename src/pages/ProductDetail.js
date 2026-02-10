import React from 'react';
import { useParams } from 'react-router-dom';
import { productList } from '../data/mockData';
import AppHeader from '../components/AppHeader';
import { Layout, Button, theme, Row, Col, Breadcrumb, Typography, Carousel } from 'antd'; // Thêm Carousel
import { HomeOutlined, ShoppingCartOutlined } from '@ant-design/icons';

const { Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

function ProductDetail() {
  const { id } = useParams();
  const product = productList.find(p => p.id === parseInt(id));
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  if (!product) return <div style={{textAlign: 'center', marginTop: '50px'}}>Không tìm thấy sản phẩm!</div>;

  // CSS tùy chỉnh cho ảnh trong Carousel để đảm bảo nó nằm gọn đẹp
  const contentStyle = {
    height: '400px',
    color: '#fff',
    lineHeight: '400px',
    textAlign: 'center',
    background: '#364d79',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10px',
    overflow: 'hidden' // Cắt phần ảnh thừa nếu có
  };

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      
      <AppHeader />

      <Content style={{ padding: '0 48px', marginTop: '20px' }}>
        <Breadcrumb
            style={{ margin: '16px 0' }}
            items={[
                { title: <a href="/home"><HomeOutlined /> Trang chủ</a> },
                { title: 'Chi tiết sản phẩm' },
                { title: product.name },
            ]}
        />

        <div style={{ background: colorBgContainer, padding: 24, borderRadius: borderRadiusLG }}>
            <Row gutter={[48, 16]}>
                
                {/* --- CỘT TRÁI: CAROUSEL ẢNH --- */}
                <Col span={10}>
                    <div style={{ padding: '0 20px' }}> {/* Thêm padding để nút chuyển ảnh không bị sát lề */}
                        <Carousel autoplay effect="fade"> 
                            {/* Chạy vòng lặp qua danh sách images */}
                            {product.images && product.images.length > 0 ? (
                                product.images.map((imgUrl, index) => (
                                    <div key={index}>
                                        <div style={contentStyle}>
                                            <img 
                                                src={imgUrl} 
                                                alt={`Slide ${index}`} 
                                                style={{ 
                                                    width: '100%', 
                                                    height: '100%', 
                                                    objectFit: 'contain', // Giữ nguyên tỉ lệ ảnh
                                                    background: '#fff' // Nền trắng cho ảnh png trong suốt
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                // Trường hợp dự phòng nếu không có danh sách images thì lấy img gốc
                                <div>
                                     <div style={contentStyle}>
                                        <img src={product.img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }}/>
                                     </div>
                                </div>
                            )}
                        </Carousel>
                    </div>
                    
                    <div style={{textAlign: 'center', marginTop: '10px', color: '#888', fontStyle: 'italic'}}>
                        (Hình ảnh tự động chuyển sau mỗi 3 giây)
                    </div>
                </Col>

                {/* CỘT PHẢI: THÔNG TIN (Giữ nguyên) */}
                <Col span={14}>
                    <Title level={2}>{product.name}</Title>
                    <Title level={3} type="danger">{product.price}</Title>
                    
                    {/* Hiển thị mô tả lấy từ dữ liệu mockData */}
                    <Paragraph style={{ fontSize: '16px', color: '#555', lineHeight: '1.8' }}>
                        {product.description}
                    </Paragraph>

                    <div style={{ margin: '20px 0', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
                        <p><Text strong>Màn hình:</Text> Super Retina XDR</p>
                        <p><Text strong>Chip:</Text> Apple A17 Pro / M2 (Tùy phiên bản)</p>
                        <p><Text strong>Bảo hành:</Text> 12 Tháng chính hãng</p>
                        <p><Text strong>Tình trạng:</Text> <Text type="success">Sẵn hàng tại kho</Text></p>
                    </div>

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