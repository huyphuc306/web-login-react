// Dữ liệu tài khoản đúng để đăng nhập
export const accountData = {
    username: "admin",
    password: "123"
};

// Dữ liệu thông tin người dùng sẽ hiển thị ở trang mới
export const userProfile = {
        fullName: "Nguyễn Văn A",
        position: "Giám đốc công nghệ",
        email: "nguyenvana@example.com",
        avatar: "https://via.placeholder.com/150", // Ảnh đại diện mẫu
        description: "Xin chào, đây là dữ liệu được lấy từ file mockData.",
        role: 'admin'
};

// Dữ liệu danh sách 6 sản phẩm
export const productList = [
    { 
        id: 1, 
        name: "iPhone 15 Pro Max", 
        price: "34.000.000 VNĐ", 
        img: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png", // Ảnh đại diện dùng ở Home
        // Danh sách nhiều ảnh để chạy Carousel
        images: [
            "https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/iphone_15_pro.png",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0awFuOL5U0JzhdOAcos7q2Kz-cJn4vbRhqQ&s",
            "https://img.freepik.com/free-vector/realistic-display-smartphone-with-different-apps_52683-30241.jpg"
        ],
        description: "iPhone 15 Pro Max thiết kế từ Titan chuẩn hàng không vũ trụ, bền bỉ và nhẹ nhất từ trước đến nay. Chip A17 Pro mang lại hiệu năng đồ họa đỉnh cao. Hệ thống Camera chuyên nghiệp với khả năng zoom quang học 5x sắc nét."
    },
    { 
        id: 2, 
        name: "MacBook Air M2", 
        price: "28.500.000 VNĐ", 
        img: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
        images: [
            "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
            "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
            "https://img.freepik.com/free-photo/laptop-with-blank-black-screen-white-table_53876-97915.jpg"
        ],
        description: "MacBook Air M2 được thiết kế lại hoàn toàn mới siêu mỏng nhẹ. Sức mạnh từ chip M2 thế hệ mới giúp xử lý mượt mà mọi tác vụ văn phòng và đồ họa cơ bản. Thời lượng pin ấn tượng lên đến 18 giờ liên tục."
    },
    { 
        id: 3, 
        name: "Sony WH-1000XM5", 
        price: "8.500.000 VNĐ", 
        img: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
        images: [
            "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
            "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
        ],
        description: "Tai nghe chống ồn tốt nhất thị trường với 8 micro và bộ xử lý V1 tích hợp. Thiết kế over-ear êm ái, phù hợp đeo cả ngày dài. Chất âm Hi-Res Audio chuẩn phòng thu."
    },
    { 
        id: 4, 
        name: "Samsung Galaxy S24", 
        price: "22.000.000 VNĐ", 
        img: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
        images: [
            "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
            "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
        ],
        description: "Galaxy S24 mở ra kỷ nguyên quyền năng với Galaxy AI. Tính năng phiên dịch trực tiếp cuộc gọi, khoanh vùng tìm kiếm thông minh. Màn hình Dynamic AMOLED 2X rực rỡ dưới mọi điều kiện ánh sáng."
    },
    { 
        id: 5, 
        name: "iPad Pro 11 inch", 
        price: "19.000.000 VNĐ", 
        img: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
        images: [
            "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
            "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
        ],
        description: "Chiếc máy tính bảng mạnh mẽ nhất với chip M2. Màn hình Liquid Retina ProMotion 120Hz mượt mà. Hỗ trợ Apple Pencil 2 giúp biến ý tưởng thành hiện thực ngay lập tức."
    },
    { 
        id: 6, 
        name: "Apple Watch Ultra", 
        price: "18.500.000 VNĐ", 
        img: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
        images: [
            "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
            "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
        ],
        description: "Đồng hồ thể thao chuyên nghiệp với vỏ Titan siêu bền. Khả năng chống nước độ sâu 100m, GPS tần số kép chính xác tuyệt đối. Thời lượng pin lên đến 36 giờ cho những chuyến thám hiểm dài ngày."
    },
    { id: 7, name: "Apple Watch Ultra b", price: "12.800.000 VNĐ", img: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" },
    { id: 8, name: "Apple Watch Ultra c", price: "11.900.000 VNĐ", img: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" },
    { id: 9, name: "Apple Watch Ultra d", price: "14.300.000 VNĐ", img: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" },
    { id: 10, name: "Apple Watch Ultra r", price: "13.200.000 VNĐ", img: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" },
];
