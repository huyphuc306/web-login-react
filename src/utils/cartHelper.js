// src/utils/cartHelper.js

// Lấy giỏ hàng từ localStorage
const getCart = () => {
    try {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    } catch (error) {
        return [];
    }
};

// Lưu giỏ hàng vào localStorage
const saveCart = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

export const cartHelper = {
    // 1. Lấy toàn bộ giỏ hàng
    getAll: () => {
        return getCart();
    },

    // 2. Thêm sản phẩm vào giỏ
    addItem: (product) => {
        const cart = getCart();

        // Kiểm tra sản phẩm đã có trong giỏ chưa
        const existingIndex = cart.findIndex(item => item.productId === product.id.toString());

        if (existingIndex !== -1) {
            // ĐÃ CÓ → Tăng số lượng
            cart[existingIndex].quantity += 1;
        } else {
            // CHƯA CÓ → Thêm mới
            cart.push({
                productId: product.id.toString(),
                productName: product.name,
                productImg: product.img || (product.images && product.images[0]) || 'https://via.placeholder.com/100',
                price: product.price,
                quantity: 1
            });
        }

        saveCart(cart);
        return cart;
    },

    // 3. Cập nhật số lượng
    updateQuantity: (productId, quantity) => {
        const cart = getCart();
        const index = cart.findIndex(item => item.productId === productId);
        
        if (index !== -1) {
            if (quantity <= 0) {
                // Nếu số lượng = 0 → Xóa luôn
                cart.splice(index, 1);
            } else {
                cart[index].quantity = quantity;
            }
        }

        saveCart(cart);
        return cart;
    },

    // 4. Xóa 1 sản phẩm
    removeItem: (productId) => {
        const cart = getCart();
        const newCart = cart.filter(item => item.productId !== productId);
        saveCart(newCart);
        return newCart;
    },

    // 5. Xóa toàn bộ giỏ hàng
    clearAll: () => {
        localStorage.removeItem('cart');
        return [];
    },

    // 6. Đếm tổng số lượng (hiện số trên icon giỏ hàng)
    getTotalQuantity: () => {
        const cart = getCart();
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    },

    // 7. Tính tổng tiền
    getTotalPrice: () => {
        const cart = getCart();
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
};