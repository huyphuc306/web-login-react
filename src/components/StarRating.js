import React from 'react';
import { Rate } from 'antd';

// Component hiển thị sao + số lượt đánh giá
function StarRating({ rating = 0, reviewCount = 0, size = 14, showCount = true }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Rate 
                disabled            // Chỉ hiển thị, không cho bấm
                allowHalf           // Cho phép hiện nửa sao (4.5 sao)
                value={rating}      // Số sao
                style={{ fontSize: size }}
            />
            {showCount && (
                <span style={{ color: '#888', fontSize: '13px' }}>
                    {rating > 0 ? (
                        <>
                            {/* <span style={{ color: '#faad14', fontWeight: 'bold' }}>{rating}</span> */}
                            {' '}({reviewCount} đánh giá)
                        </>
                    ) : (
                        'Chưa có đánh giá'
                    )}
                </span>
            )}
        </div>
    );
}

export default StarRating;