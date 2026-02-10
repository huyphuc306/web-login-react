import React, { useState, useRef } from 'react';
import { Input, Space, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

// Đây là Custom Hook
export const useTableSearch = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  // Hàm này trả về cấu hình cho cột
  const getColumnSearchProps = (dataIndex, columnTitle) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Tìm ${columnTitle}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Tìm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Xóa
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Đóng
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  // Trả về hàm này để bên kia sử dụng
  return { getColumnSearchProps };
};

// --- HÀM HỖ TRỢ SORT SỐ (DÙNG CHO CỘT GIÁ) ---
export const getNumberSorter = (dataIndex) => ({
    // Chỉ cho phép sắp xếp Tăng hoặc Giảm (bỏ chế độ Hủy chọn mặc định của Antd)
    sortDirections: ['ascend', 'descend'],
    
    // Logic so sánh 2 số
    sorter: (a, b) => {
        const valA = a[dataIndex] || 0;
        const valB = b[dataIndex] || 0;
        return valA - valB;
    },
});

// 3. [MỚI] Helper sort Chữ (String) - Dùng cho Tên, Email...
export const getStringSorter = (dataIndex) => ({
    sortDirections: ['ascend', 'descend'],
    sorter: (a, b) => {
        const strA = a[dataIndex] ? a[dataIndex].toString() : '';
        const strB = b[dataIndex] ? b[dataIndex].toString() : '';
        // localeCompare giúp so sánh chính xác cả tiếng Việt có dấu
        return strA.localeCompare(strB);
    },
});