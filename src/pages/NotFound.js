import React from 'react';
import { Button, Result } from 'antd'; // Component hiển thị thông báo kết quả
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh', 
        backgroundColor: '#fff' 
    }}>
      <Result
        status="404" // Mã lỗi 404 sẽ tự động hiện hình ảnh minh họa phù hợp
        title="404"
        subTitle="Xin lỗi, trang bạn truy cập không tồn tại."
        extra={
          <Button type="primary" onClick={() => navigate('/')}>
            Quay về Trang chủ
          </Button>
        }
      />
    </div>
  );
};

export default NotFound;