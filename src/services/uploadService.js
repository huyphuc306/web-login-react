// src/services/uploadService.js
import axios from 'axios';

// Thay 2 giá trị này bằng thông tin Cloudinary của bạn
const CLOUD_NAME = 'ddyhccmmf';       // Ví dụ: dxyz1234
const UPLOAD_PRESET = 'my_shop_upload';   // Ví dụ: my_shop_upload

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export const uploadService = {
    // Hàm upload ảnh lên Cloudinary
    uploadImage: async (file) => {
        // Tạo FormData (Cách gửi file lên server)
        const formData = new FormData();
        formData.append('file', file);               // File ảnh
        formData.append('upload_preset', UPLOAD_PRESET); // Preset đã tạo

        // Gọi API Cloudinary
        const res = await axios.post(CLOUDINARY_URL, formData);

        // Trả về link ảnh đã upload thành công
        return res.data.secure_url;  // Ví dụ: "https://res.cloudinary.com/.../image.jpg"
    }
};