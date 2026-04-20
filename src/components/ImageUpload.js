import React, { useState } from 'react';
import { Upload, Button, message, Image } from 'antd';
// import Space from 'antd';
import { UploadOutlined, LoadingOutlined, DeleteOutlined } from '@ant-design/icons';
import { uploadService } from '../services/uploadService';

function ImageUpload({ value, onChange, maxCount = 5 }) {
    const [loading, setLoading] = useState(false);
    // value có thể là: string (1 ảnh) hoặc array (nhiều ảnh)
    const [imageList, setImageList] = useState(() => {
        if (!value) return [];
        if (Array.isArray(value)) return value;
        return [value]; // Nếu là string đơn lẻ, chuyển thành mảng
    });

    const handleUpload = async (info) => {
        const file = info.file;
        
        // Kiểm tra file ảnh
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('Chỉ được upload file ảnh!');
            return;
        }

        // Kiểm tra dung lượng < 5MB
        const isSmall = file.size / 1024 / 1024 < 5;
        if (!isSmall) {
            message.error('Ảnh phải nhỏ hơn 5MB!');
            return;
        }

        // Kiểm tra số lượng ảnh
        if (imageList.length >= maxCount) {
            message.warning(`Chỉ được upload tối đa ${maxCount} ảnh!`);
            return;
        }

        try {
            setLoading(true);
            
            const url = await uploadService.uploadImage(file);
            
            const newList = [...imageList, url];
            setImageList(newList);
            
            // Trả về cho Form
            if (onChange) {
                onChange(newList);
            }
            
            message.success('Upload ảnh thành công!');
        } catch (error) {
            message.error('Upload ảnh thất bại!');
        } finally {
            setLoading(false);
        }
    };

    // Xóa 1 ảnh khỏi danh sách
    const handleRemove = (indexToRemove) => {
        const newList = imageList.filter((_, index) => index !== indexToRemove);
        setImageList(newList);
        
        if (onChange) {
            onChange(newList);
        }
    };

    return (
        <div>
            {/* Nút Upload */}
            <Upload
                showUploadList={false}
                beforeUpload={() => false}
                onChange={handleUpload}
                accept="image/*"
                multiple // Cho phép chọn nhiều file cùng lúc
            >
                <Button 
                    icon={loading ? <LoadingOutlined /> : <UploadOutlined />} 
                    loading={loading}
                    disabled={imageList.length >= maxCount}
                >
                    {loading ? 'Đang tải...' : `Chọn ảnh (${imageList.length}/${maxCount})`}
                </Button>
            </Upload>

            {/* Hiển thị danh sách ảnh đã upload */}
            {imageList.length > 0 && (
                <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '10px', 
                    marginTop: '10px' 
                }}>
                    {imageList.map((url, index) => (
                        <div key={index} style={{ position: 'relative' }}>
                            <Image
                                src={url}
                                alt={`Ảnh ${index + 1}`}
                                width={100}
                                height={100}
                                style={{ 
                                    borderRadius: 8, 
                                    border: '1px solid #d9d9d9',
                                    objectFit: 'cover' 
                                }}
                            />
                            <Button
                                type="primary"
                                danger
                                size="small"
                                icon={<DeleteOutlined />}
                                onClick={() => handleRemove(index)}
                                style={{
                                    position: 'absolute',
                                    top: -8,
                                    right: -8,
                                    borderRadius: '50%',
                                    width: 24,
                                    height: 24,
                                    padding: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ImageUpload;