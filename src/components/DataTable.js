import React from 'react';
import { Table, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

function DataTable({ dataSource, columns, loading, title, onCreate, rowKey = 'id' }) {
  return (
    <div style={{ background: '#fff', padding: 24, borderRadius: 8, minHeight: 360, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
      
      {/* Vùng Header của bảng: Chứa tiêu đề và nút Tạo mới */}
      {(title || onCreate) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          {/* Nếu có title thì hiện, không thì để trống */}
          <h3 style={{ margin: 0, fontWeight: 600 }}>{title}</h3>
          
          {/* Nếu truyền hàm onCreate thì mới hiện nút Thêm */}
          {onCreate && (
            <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={onCreate}
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            >
                Tạo mới
            </Button>
          )}
        </div>
      )}

      {/* Bảng Ant Design chuẩn */}
      <Table 
        dataSource={dataSource} 
        columns={columns} 
        rowKey={rowKey} 
        loading={loading}
        pagination={{ pageSize: 5 }} // Mặc định mỗi trang 5 dòng (có thể tùy chỉnh)
      />
    </div>
  );
}

export default DataTable;