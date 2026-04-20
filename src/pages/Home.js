import React, { useEffect, useState } from 'react';
// Đã xóa: import { userProfile, productList } from '../data/mockData';
import '../App.css'; // Dùng chung CSS cho đẹp
// Đã xóa: Avatar, Menu, Spin
import { Button, Card, Col, Layout, Row, theme, Breadcrumb, Space, Input, Select, Empty, message, Spin } from 'antd';
// Đã xóa: UserOutlined
import { HomeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import StarRating from '../components/StarRating';

// 1. Import Service và Helper
import { productService } from '../services/productService';
import { formatCurrencyVN } from '../utils/formatHelper';

// Đã xóa: Header (vì đang dùng component AppHeader)
const { Content, Footer } = Layout;
const { Meta } = Card;
const { Option } = Select; // Sửa lại: Lấy Option trực tiếp từ Select thay vì antd/es/mentions

function Home() {
    const navigate = useNavigate(); // Khởi tạo hàm chuyển trang
    // Cấu hình màu sắc mặc định của Ant Design cho đẹp
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    // --- 1. KHAI BÁO STATE (TRẠNG THÁI) ---
    const [products, setProducts] = useState([]); // Danh sách sản phẩm từ API
    const [loading, setLoading] = useState(true); // Trạng thái loading
    const [searchText, setSearchText] = useState(''); // Lưu từ khóa tìm kiếm
    const [sortType, setSortType] = useState('default'); // Lưu kiểu sắp xếp (mặc định, A-Z, giá tăng, giá giảm)

    // --- 2. GỌI API LẤY SẢN PHẨM ---
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await productService.getAll();
                setProducts(data);
            } catch (error) {
                console.error(error);
                message.error('Không thể tải danh sách sản phẩm!');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Logic lọc và sắp xếp sản phẩm
    const getProcessedProducts = () => {
        // B1: Copy dữ liệu gốc ra một mảng mới để xử lý
        let tempProducts = [...products];

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
            tempProducts.sort((a, b) => Number(a.price) - Number(b.price));
        } else if (sortType === 'priceHighLow') {
            // Giá cao đến thấp
            tempProducts.sort((a, b) => Number(b.price) - Number(a.price));
        }

        return tempProducts;
    };

    // Gọi hàm để lấy danh sách cuối cùng sẽ hiển thị
    const displayProducts = getProcessedProducts();

    return (
        <Layout className="layout" style={{ minHeight: '100vh' }}>

            {/* --- THANH ĐIỀU HƯỚNG (HEADER) --- */}
            <AppHeader />

            {/* --- NỘI DUNG CHÍNH --- */}
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
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '50px 0' }}>
                            <Spin size="large" tip="Đang tải sản phẩm..." />
                        </div>
                    ) : (
                            displayProducts.length === 0 ? (
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
                                                    title={
                                                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={product.name}>
                                                            {product.name}
                                                        </div>
                                                    }
                                                    description={
                                                        <div>
                                                            <span style={{ color: '#d4380d', fontWeight: 'bold' }}>
                                                                {formatCurrencyVN(product.price)}
                                                            </span>
                                                            <div style={{ marginTop: '8px' }}>
                                                                <StarRating
                                                                    rating={product.rating}
                                                                    reviewCount={product.reviewCount}
                                                                    size={12}
                                                                />
                                                            </div>
                                                        </div>
                                                    }
                                                />
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            )
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