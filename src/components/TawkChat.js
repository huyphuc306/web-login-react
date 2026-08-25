import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

function TawkChat() {
  const { currentUser } = useAuth(); // Lấy thông tin user từ Context

  useEffect(() => {
    // 1. Tạo thẻ script nhúng Tawk.to (Chỉ chạy 1 lần khi web mở)
    const script = document.createElement('script');
    script.id = 'tawk-script';
    script.async = true;
    script.src = 'https://embed.tawk.to/69edd666bd68fb1c32a8258d/1jn4gr081'; // ⚠️ THAY LINK CỦA BẠN VÀO ĐÂY
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    document.body.appendChild(script);

    // 2. Hàm kiểm tra và ẩn/hiện Tawk.to
    const checkAndToggle = () => {
      // Nếu Tawk.to chưa tải xong (chưa có hàm showWidget) thì đợi 500ms rồi kiểm tra lại
      if (!window.Tawk_API || typeof window.Tawk_API.showWidget !== 'function') {
        setTimeout(checkAndToggle, 500);
        return;
      }

      // Nếu Tawk.to đã tải xong -> Kiểm tra role để ẩn/hiện
      if (currentUser && currentUser.role === 'admin') {
        window.Tawk_API.hideWidget();
      } else {
        window.Tawk_API.showWidget();
      }
    };

    // 3. Bắt đầu kiểm tra
    checkAndToggle();

    // 4. Dọn dẹp khi component bị xóa (tránh tạo 2 cái chat)
    return () => {
      const existingScript = document.getElementById('tawk-script');
      if (existingScript) existingScript.remove();
    };
  }, [currentUser]); // Chạy lại MỖI KHI currentUser thay đổi (Đăng nhập / Đăng xuất)

  return null; // Không vẽ gì ra màn hình
}

export default TawkChat;