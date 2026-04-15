import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Button, theme, Row, Col, Breadcrumb, Typography, Carousel, Spin, Avatar, Card, message, Rate, Modal } from 'antd';
import { HomeOutlined, ShoppingCartOutlined, UserOutlined, ShopOutlined, EditOutlined } from '@ant-design/icons';

import AppHeader from '../components/AppHeader';
import StarRating from '../components/StarRating';
import { productService } from '../services/productService';
import { userService } from '../services/userService';
import { reviewService } from '../services/reviewService';
import { formatCurrencyVN } from '../utils/formatHelper';
import { cartService } from '../services/cartService';
import { cartHelper } from '../utils/cartHelper';

const { Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

  // Lấy thông tin người đang đăng nhập
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  // --- STATE ---
  const [product, setProduct] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);

  // State cho đánh giá
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [rateLoading, setRateLoading] = useState(false);
  const [existingReview, setExistingReview] = useState(null); // Lưu đánh giá cũ (nếu có)

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Lấy thông tin sản phẩm
        const productData = await productService.getById(id);
        setProduct(productData);

        // Tìm thông tin người bán
        if (productData.ownerId && productData.ownerId !== 'unknown') {
          try {
            const ownerData = await userService.getById(productData.ownerId);
            setOwner(ownerData);
          } catch (error) {
            setOwner({ fullname: 'Người bán ẩn danh' });
          }
        } else {
          setOwner({ fullname: 'Hệ thống My Shop', role: 'admin' });
        }

        // Kiểm tra xem người dùng hiện tại đã đánh giá sản phẩm này chưa
        if (currentUser && currentUser.id) {
          try {
            const allReviews = await reviewService.getAll();
            const myReview = allReviews.find(
              (r) => r.productId === id && r.userId === currentUser.id
            );
            if (myReview) {
              setExistingReview(myReview); // Lưu lại đánh giá cũ
            }
          } catch (error) {
            console.log('Lỗi kiểm tra review:', error);
          }
        }

      } catch (error) {
        message.error('Không tìm thấy sản phẩm!');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, navigate]);

  // --- MỞ MODAL ĐÁNH GIÁ ---
  const handleOpenRateModal = () => {
    // Kiểm tra đăng nhập
    if (!currentUser) {
      message.warning('Vui lòng đăng nhập để đánh giá!');
      navigate('/login');
      return;
    }

    // Nếu đã đánh giá trước đó → Điền sao cũ vào modal
    if (existingReview) {
      setUserRating(existingReview.rating);
    } else {
      setUserRating(0);
    }

    setIsRateModalOpen(true);
  };

  // --- GỬI / CẬP NHẬT ĐÁNH GIÁ ---
  const handleSubmitRating = async () => {
    if (userRating === 0) {
      message.warning('Vui lòng chọn số sao!');
      return;
    }

    setRateLoading(true);

    try {
      if (existingReview) {
        // === TRƯỜNG HỢP: ĐÃ ĐÁNH GIÁ RỒI → CẬP NHẬT ===
        const oldRating = existingReview.rating;

        // Cập nhật review trong bảng reviews
        await reviewService.update(existingReview.id, {
          ...existingReview,
          rating: userRating
        });

        // Tính lại rating trung bình cho sản phẩm
        // Công thức: (tổng cũ - sao cũ + sao mới) / số lượt
        const currentRating = product.rating || 0;
        const currentCount = product.reviewCount || 0;
        const totalOld = currentRating * currentCount;
        const newAvg = Math.round(((totalOld - oldRating + userRating) / currentCount) * 10) / 10;

        // Cập nhật rating sản phẩm
        await productService.update(product.id, {
          rating: newAvg
        });

        // Cập nhật state
        setExistingReview({ ...existingReview, rating: userRating });
        message.success('Đã cập nhật đánh giá của bạn!');

      } else {
        // === TRƯỜNG HỢP: CHƯA ĐÁNH GIÁ → TẠO MỚI ===

        // Tạo review mới
        const newReview = await reviewService.create({
          productId: id,
          userId: currentUser.id,
          rating: userRating
        });

        // Tính rating trung bình mới
        const currentRating = product.rating || 0;
        const currentCount = product.reviewCount || 0;
        const newCount = currentCount + 1;
        const newAvg = Math.round(((currentRating * currentCount + userRating) / newCount) * 10) / 10;

        // Cập nhật rating sản phẩm
        await productService.update(product.id, {
          rating: newAvg,
          reviewCount: newCount
        });

        // Cập nhật state
        setExistingReview(newReview);
        message.success('Cảm ơn bạn đã đánh giá!');
      }

      setIsRateModalOpen(false);

      // Tải lại dữ liệu sản phẩm
      const updatedProduct = await productService.getById(product.id);
      setProduct(updatedProduct);

    } catch (error) {
      console.error(error);
      message.error('Có lỗi xảy ra khi gửi đánh giá!');
    } finally {
      setRateLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!currentUser) {
      message.warning('Vui lòng đăng nhập để thêm vào giỏ hàng!');
      navigate('/login');
      return;
    }

    cartHelper.addItem(product);
    message.success(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  // --- CSS CAROUSEL ---
  const contentStyle = {
    height: '400px',
    textAlign: 'center',
    background: '#f0f2f5',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10px',
    overflow: 'hidden'
  };

  // --- LOADING ---
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Đang tải sản phẩm..." />
      </div>
    );
  }

  if (!product) return null;

  // Danh sách ảnh
  const imageList = (product.images && product.images.length > 0)
    ? product.images
    : (product.img ? [product.img] : ['https://via.placeholder.com/400']);

  // Trạng thái sản phẩm
  const getStatusInfo = (status) => {
    switch (status) {
      case 'new': return { text: 'Mới 100%', color: '#52c41a' };
      case 'like_new': return { text: 'Like New 99%', color: '#13c2c2' };
      case 'used_good': return { text: 'Đã qua sử dụng (Tốt)', color: '#1890ff' };
      case 'used_bad': return { text: 'Cũ / Xước', color: '#ff4d4f' };
      default: return { text: 'Đang bán', color: '#888' };
    }
  };

  const statusInfo = getStatusInfo(product.status);

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
            {/* CỘT TRÁI: ẢNH */}
            <Col span={10}>
              <div style={{ padding: '0 20px' }}>
                <Carousel autoplay effect="fade">
                  {imageList.map((imgUrl, index) => (
                    <div key={index}>
                      <div style={contentStyle}>
                        <img
                          src={imgUrl}
                          alt={`Ảnh ${index + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }}
                          onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/400"; }}
                        />
                      </div>
                    </div>
                  ))}
                </Carousel>
              </div>
              {imageList.length > 1 && (
                <div style={{ textAlign: 'center', marginTop: '10px', color: '#888', fontStyle: 'italic' }}>
                  ({imageList.length} ảnh - Tự động chuyển)
                </div>
              )}
            </Col>

            {/* CỘT PHẢI: THÔNG TIN */}
            <Col span={14}>
              <Title level={2}>{product.name}</Title>

              {/* ĐÁNH GIÁ SAO */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                <StarRating rating={product.rating} reviewCount={product.reviewCount} size={18} />

                {/* Nút thay đổi tùy theo đã đánh giá hay chưa */}
                {existingReview ? (
                  <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={handleOpenRateModal}
                    style={{ padding: 0 }}
                  >
                    Sửa đánh giá (Bạn đã chọn {existingReview.rating} ⭐)
                  </Button>
                ) : (
                  <Button
                    type="link"
                    onClick={handleOpenRateModal}
                    style={{ padding: 0, fontWeight: 'bold' }}
                  >
                    Đánh giá ngay
                  </Button>
                )}
              </div>

              <Title level={3} type="danger">{formatCurrencyVN(product.price)}</Title>

              <div style={{ marginBottom: 20 }}>
                <Text strong>Tình trạng: </Text>
                <Text style={{ color: statusInfo.color, fontWeight: 'bold' }}>{statusInfo.text}</Text>
              </div>

              {/* THÔNG TIN NGƯỜI BÁN */}
              {owner && (
                <Card size="small" style={{ marginBottom: 20, background: '#f9f9f9', borderColor: '#e6f7ff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                    <Avatar size={50} icon={<UserOutlined />} src={owner.avatar} style={{ backgroundColor: '#87d068' }} />
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

              <div style={{ margin: '20px 0', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
                <p><Text strong>Mã sản phẩm:</Text> SP-{product.id}</p>
                <p><Text strong>Tình trạng:</Text> <Text style={{ color: statusInfo.color }}>{statusInfo.text}</Text></p>
                <p><Text strong>Bảo hành:</Text> 12 Tháng chính hãng</p>
                <p><Text strong>Kho hàng:</Text> <Text type="success">Sẵn hàng</Text></p>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  style={{ height: '50px', width: '200px' }}
                  onClick={handleAddToCart}
                  loading={cartLoading}
                >
                  Thêm vào giỏ
                </Button>
                <Button size="large" type="default" style={{ height: '50px' }}
                  onClick={() => navigate('/cart')}
                >
                  🛒 Xem giỏ hàng
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </Content>

      <Footer style={{ textAlign: 'center' }}>My Shop ©2024</Footer>

      {/* MODAL ĐÁNH GIÁ */}
      <Modal
        title={existingReview ? "Chỉnh sửa đánh giá" : "Đánh giá sản phẩm"}
        open={isRateModalOpen}
        onCancel={() => { setIsRateModalOpen(false); setUserRating(0); }}
        onOk={handleSubmitRating}
        okText={existingReview ? "Cập nhật" : "Gửi đánh giá"}
        cancelText="Hủy"
        confirmLoading={rateLoading}
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <p style={{ fontSize: '16px', marginBottom: '15px' }}>
            {existingReview
              ? <>Bạn đã đánh giá <strong>{product.name}</strong> là {existingReview.rating} ⭐. Bạn muốn đổi?</>
              : <>Bạn đánh giá <strong>{product.name}</strong> thế nào?</>
            }
          </p>
          <Rate
            value={userRating}
            onChange={setUserRating}
            style={{ fontSize: 40 }}
          />
          <p style={{ marginTop: '15px', color: '#888', fontSize: '14px' }}>
            {userRating === 0 && 'Chạm vào sao để đánh giá'}
            {userRating === 1 && '⭐ Rất tệ'}
            {userRating === 2 && '⭐⭐ Tệ'}
            {userRating === 3 && '⭐⭐⭐ Bình thường'}
            {userRating === 4 && '⭐⭐⭐⭐ Tốt'}
            {userRating === 5 && '⭐⭐⭐⭐⭐ Tuyệt vời!'}
          </p>
        </div>
      </Modal>
    </Layout>
  );
}

export default ProductDetail;