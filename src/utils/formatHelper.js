// src/utils/formatHelper.js

/**
 * Hàm 1: Biến số thành chuỗi có dấu chấm
 * Ví dụ: 1000000 -> "1.000.000"
 * Dùng cho prop `formatter` của InputNumber
 */
export const formatNumber = (value) => {
  if (!value) return '';
  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

/**
 * Hàm 2: Biến chuỗi có dấu chấm ngược lại thành số để tính toán
 * Ví dụ: "1.000.000" -> 1000000
 * Dùng cho prop `parser` của InputNumber
 */
export const parseNumber = (value) => {
  if (!value) return '';
  return value.replace(/\./g, '');
};

/**
 * Hàm 3: Tạo chuỗi giá tiền đầy đủ để lưu vào Database hoặc hiển thị
 * Ví dụ: 20000000 -> "20.000.000 VNĐ"
 */
export const formatCurrencyVN = (value) => {
    if (!value) return '';
    return formatNumber(value) + ' VNĐ';
};

/**
 * Hàm 4: Chuyển chuỗi giá tiền đầy đủ về lại số nguyên để đưa vào Form sửa
 * Ví dụ: "20.000.000 VNĐ" -> 20000000
 */
export const parseCurrencyVN = (valueString) => {
    if (!valueString) return 0;
    // Xóa dấu chấm và chữ VNĐ đi
    return parseInt(valueString.toString().replace(/\./g, '').replace(' VNĐ', ''));
};