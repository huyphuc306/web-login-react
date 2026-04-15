import React, { useState } from 'react';
import { Layout, Table, Button, InputNumber, message, Empty, Popconfirm, Typography } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import { cartHelper } from '../utils/cartHelper';
import { formatCurrencyVN } from '../utils/formatHelper';

const { Content, Footer } = Layout;
const { Title } = Typography;

function Cart() {
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Lấy giỏ hàng từ localStorage (SIÊU NHANH, không cần loading)
    const [cartItems, setCartItems] = useState(cartHelper.getAll());

    // Cập nhật số lượng
    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        const updatedCart = cartHelper.updateQuantity(productId, newQuantity);
        setCartItems([...updatedCart]);
    };

    // Xóa 1 sản phẩm
    const handleRemove = (productId) => {
        const updatedCart = cartHelper.removeItem(productId);
        setCartItems([...updatedCart]);
        message.success('Đã xóa khỏi giỏ hàng!');
    };

    // Xóa tất cả
    const handleClearAll = () => {
        const emptyCart = cartHelper.clearAll();
        setCartItems([...emptyCart]);
        message.success('Đã xóa toàn bộ giỏ hàng!');
    };

    // Tính tổng
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    // Cấu hình cột
    const columns = [
        {
            title: 'Sản phẩm',
            key: 'product',
            render: (_, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img 
                        src={record.productImg} 
                        alt={record.productName}
                        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid #eee' }}
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/60"; }}
                    />
                    <div>
                        <div 
                            style={{ fontWeight: 'bold', cursor: 'pointer', color: '#1890ff' }}
                            onClick={() => navigate(`/product/${record.productId}`)}
                        >
                            {record.productName}
                        </div>
                        <div style={{ color: '#888', fontSize: '12px' }}>
                            Đơn giá: {formatCurrencyVN(record.price)}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            width: 150,
            render: (price) => (
                <span style={{ color: '#d4380d', fontWeight: 'bold' }}>
                    {formatCurrencyVN(price)}
                </span>
            ),
        },
        {
            title: 'Số lượng',
            key: 'quantity',
            width: 150,
            render: (_, record) => (
                <InputNumber
                    min={1}
                    max={99}
                    value={record.quantity}
                    onChange={(value) => handleQuantityChange(record.productId, value)}
                    style={{ width: 80 }}
                />
            ),
        },
        {
            title: 'Thành tiền',
            key: 'total',
            width: 180,
            render: (_, record) => (
                <span style={{ color: '#d4380d', fontWeight: 'bold', fontSize: '16px' }}>
                    {formatCurrencyVN(record.price * record.quantity)}
                </span>
            ),
        },
        {
            title: '',
            key: 'action',
            width: 60,
            render: (_, record) => (
                <Popconfirm 
                    title="Xóa sản phẩm này?" 
                    onConfirm={() => handleRemove(record.productId)}
                    okButtonProps={{ danger: true }}
                >
                    <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>
            ),
        },
    ];

    // Chưa đăng nhập
    if (!currentUser) {
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <AppHeader />
                <Content style={{ padding: '50px', textAlign: 'center' }}>
                    <Empty description="Vui lòng đăng nhập để xem giỏ hàng">
                        <Button type="primary" onClick={() => navigate('/login')}>Đăng nhập ngay</Button>
                    </Empty>
                </Content>
            </Layout>
        );
    }

    return (
        <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
            <AppHeader />

            <Content style={{ padding: '20px 48px' }}>
                <Button 
                    type="link" icon={<ArrowLeftOutlined />} 
                    onClick={() => navigate('/')} 
                    style={{ padding: 0, marginBottom: 15 }}
                >
                    Tiếp tục mua sắm
                </Button>

                <Title level={3}>
                    <ShoppingCartOutlined /> Giỏ hàng ({totalQuantity} sản phẩm)
                </Title>

                {cartItems.length === 0 ? (
                    <div style={{ background: '#fff', padding: '50px', borderRadius: '8px', textAlign: 'center' }}>
                        <Empty description="Giỏ hàng trống">
                            <Button type="primary" onClick={() => navigate('/')}>Mua sắm ngay</Button>
                        </Empty>
                    </div>
                ) : (
                    <>
                        <div style={{ background: '#fff', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
                            <Table
                                dataSource={cartItems}
                                columns={columns}
                                rowKey="productId"
                                pagination={false}
                            />
                        </div>

                        {/* Thanh tổng kết */}
                        <div style={{ 
                            background: '#fff', borderRadius: '8px', padding: '20px 30px',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                            <Popconfirm
                                title="Xóa toàn bộ giỏ hàng?"
                                onConfirm={handleClearAll}
                                okButtonProps={{ danger: true }}
                            >
                                <Button danger icon={<DeleteOutlined />}>Xóa tất cả</Button>
                            </Popconfirm>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ color: '#888' }}>Tổng cộng ({totalQuantity} sản phẩm):</div>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d4380d' }}>
                                        {formatCurrencyVN(totalPrice)}
                                    </div>
                                </div>
                                <Button 
                                    type="primary" size="large"
                                    style={{ height: '50px', width: '200px', fontSize: '16px' }}
                                    onClick={() => message.info('Tính năng thanh toán đang phát triển!')}
                                >
                                    Thanh toán
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </Content>
            <Footer style={{ textAlign: 'center' }}>My Shop ©2024</Footer>
        </Layout>
    );
}

export default Cart;