// src/components/ImageUpload.js
import React, { useState } from 'react';
import { Upload, Button, message, Image } from 'antd';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import { uploadService } from '../services/uploadService';

function ImageUpload({ value, onChange }) {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(value || '');

    // Xử lý khi người dùng chọn ảnh
    const handleUpload = async (info) => {
        const file = info.file;
        
        // Kiểm tra định dạng file
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('Chỉ được upload file ảnh!');
            return;
        }

        // Kiểm tra dung lượng (< 5MB)
        const isSmall = file.size / 1024 / 1024 < 5;
        if (!isSmall) {
            message.error('Ảnh phải nhỏ hơn 5MB!');
            return;
        }

        try {
            setLoading(true);
            
            // Gọi service upload lên Cloudinary
            const url = await uploadService.uploadImage(file);
            
            setImageUrl(url);
            
            // Trả link ảnh về cho Form cha (thông qua onChange)
            if (onChange) {
                onChange(url);
            }
            
            message.success('Upload ảnh thành công!');
        } catch (error) {
            console.error(error);
            message.error('Upload ảnh thất bại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Upload
                showUploadList={false}
                beforeUpload={() => false}  // Không tự động upload, mình tự xử lý
                onChange={handleUpload}
                accept="image/*"            // Chỉ cho chọn file ảnh
            >
                <Button icon={loading ? <LoadingOutlined /> : <UploadOutlined />} loading={loading}>
                    {loading ? 'Đang tải lên...' : 'Chọn ảnh từ máy'}
                </Button>
            </Upload>

            {/* Hiển thị ảnh xem trước sau khi upload */}
            {imageUrl && (
                <div style={{ marginTop: 10 }}>
                    <Image
                        src={imageUrl}
                        alt="preview"
                        width={150}
                        style={{ borderRadius: 8, border: '1px solid #d9d9d9' }}
                    />
                </div>
            )}
        </div>
    );
}

export default ImageUpload;