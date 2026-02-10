import React, { useState } from 'react';
import { userProfile, productList } from '../data/mockData'; // Lấy dữ liệu về
import '../App.css'; // Dùng chung CSS cho đẹp
import { Avatar, Button, Card, Col, Layout, Menu, Row, theme, Breadcrumb, Space, Input, Select } from 'antd';
import { HomeOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'; // Nhập biểu tượng hình người
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';

const { Header, Content, Footer } = Layout;
const { Meta } = Card; // Thành phần con để hiển thị tiêu đề và mô tả trong Card

function Home() {
  const navigate = useNavigate(); // Khởi tạo hàm chuyển trang
  // Cấu hình màu sắc mặc định của Ant Design cho đẹp
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // --- 1. KHAI BÁO STATE (TRẠNG THÁI) ---
  const [searchText, setSearchText] = useState(''); // Lưu từ khóa tìm kiếm
  const [sortType, setSortType] = useState('default'); // Lưu kiểu sắp xếp (mặc định, A-Z, giá tăng, giá giảm)

  // --- 2. HÀM XỬ LÝ DỮ LIỆU ---
  
  // Hàm phụ: Chuyển chuỗi "34.000.000 VNĐ" thành số 34000000 để tính toán
  const parsePrice = (priceString) => {
    return parseInt(priceString.replace(/\./g, '').replace(' VNĐ', ''));
  };

  // Logic lọc và sắp xếp sản phẩm
  const getProcessedProducts = () => {
    // B1: Copy dữ liệu gốc ra một mảng mới để xử lý
    let tempProducts = [...productList];

    // B2: Lọc theo tên (Search)
    if (searchText) {
        tempProducts = tempProducts.filter(p => 
            p.name.toLowerCase().includes(searchText.toLowerCase())
        );
    }

    // B3: Sắp xếp (Sort)
    if (sortType === 'az') {
        // Sắp xếp theo bảng chữ cái
        tempProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortType === 'priceLowHigh') {
        // Giá thấp đến cao
        tempProducts.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (sortType === 'priceHighLow') {
        // Giá cao đến thấp
        tempProducts.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    }

    return tempProducts;
  };

  // Gọi hàm để lấy danh sách cuối cùng sẽ hiển thị
  const displayProducts = getProcessedProducts();

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      
      {/* --- PHẦN THANH ĐIỀU HƯỚNG (HEADER) --- */}
      <AppHeader />

      {/* --- PHẦN NỘI DUNG CHÍNH --- */}
      <Content style={{ padding: '0 48px', marginTop: '20px' }}>

        {/* --- BREADCRUMB MỚI THÊM --- */}
        <Breadcrumb
            style={{ margin: '16px 0' }}
            items={[
                { title: <><HomeOutlined /> Trang chủ</> },
                { title: 'Danh sách sản phẩm' },
            ]}
        />

        {/* --- THANH CÔNG CỤ (FILTER & SEARCH) --- */}
        <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', // Đẩy 2 bên ra xa nhau
            alignItems: 'center', 
            marginBottom: '20px',
            background: colorBgContainer,
            padding: '15px',
            borderRadius: borderRadiusLG
        }}>
            
            {/* Bên trái: Bộ lọc sắp xếp */}
            <Space>
                <span style={{ fontWeight: 'bold' }}>Sắp xếp theo:</span>
                <Select 
                    defaultValue="default" 
                    style={{ width: 200 }} 
                    onChange={(value) => setSortType(value)} // Khi chọn thì cập nhật sortType
                >
                    <Option value="default">Mặc định</Option>
                    <Option value="az">Tên (A - Z)</Option>
                    <Option value="priceHighLow">Giá (Cao đến Thấp)</Option>
                    <Option value="priceLowHigh">Giá (Thấp đến Cao)</Option>
                </Select>
            </Space>

            {/* Bên phải: Ô tìm kiếm */}
            <Input.Search
                placeholder="Tìm kiếm sản phẩm..."
                allowClear
                enterButton="Tìm kiếm"
                size="middle"
                style={{ width: 300 }}
                // Khi gõ vào ô input, cập nhật ngay lập tức (hoặc dùng onSearch để bấm Enter mới tìm)
                onChange={(e) => setSearchText(e.target.value)} 
            />
        </div>

          {/* Danh sách hiển thị sản phẩm */}
        <div
            style={{
                background: colorBgContainer,
                padding: 24,
                borderRadius: borderRadiusLG,
            }}
        >
            <h2 style={{ marginBottom: '20px', borderLeft: '5px solid #1890ff', paddingLeft: '10px' }}>
                Sản phẩm nổi bật
            </h2>

            {/* Nếu tìm không thấy gì thì hiện thông báo Empty */}
            {displayProducts.length === 0 ? (
                <Empty description="Không tìm thấy sản phẩm nào khớp với từ khóa" />
            ) : (
                <Row gutter={[24, 24]}>
                    {/* Map qua displayProducts (danh sách đã lọc) chứ không phải productList gốc */}
                    {displayProducts.map((product) => (
                        <Col span={6} key={product.id}> 
                            <Card
                                hoverable
                                style={{ width: '100%' }}
                                cover={<img alt={product.name} src={product.img} style={{ height: '200px', objectFit: 'contain', padding: '10px' }} />}
                                actions={[
                                    <ShoppingCartOutlined key="cart" />,
                                    <Button type="link" onClick={() => navigate(`/product/${product.id}`)}>
                                        Chi tiết
                                    </Button>
                                ]}
                            >
                                <Meta 
                                    title={product.name} 
                                    description={<span style={{ color: '#d4380d', fontWeight: 'bold' }}>{product.price}</span>} 
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

        </div>

      </Content>

      {/* --- CHÂN TRANG (FOOTER) --- */}
      <Footer style={{ textAlign: 'center' }}>
        My Website ©2024 Created by You
      </Footer>

    </Layout>
  );
}

export default Home;