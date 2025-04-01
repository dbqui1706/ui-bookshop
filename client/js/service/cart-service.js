import { STORAGE_KEYS } from '../constants/index.js';

const API_URL = {
    CART: 'http://localhost:8080/api/cart',
    ADD_TO_CART: 'http://localhost:8080/api/cart/add',
    SAVE_CART: 'http://localhost:8080/api/cart/save',
    UPDATE_CART_ITEM: 'http://localhost:8080/api/cart/update',
    REMOVE_CART_ITEM: 'http://localhost:8080/api/cart/remove'
}

const headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
}

export class CartService {
    async getCart() {
        try {
            const userId = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)).id;
            const response = await fetch(API_URL.CART + `?userId=${userId}`, {
                headers: headers
            });

            if (!response.ok) {
                return {
                    success: false,
                    message: 'Lấy giỏ hàng thất bại'
                }
            }

            const data = await response.json();
            return {
                success: true,
                data: data
            }
        } catch (error) {
            console.error('Lỗi khi tải giỏ hàng:', error);
            return {
                items: [],
                total: 0
            };
        }
    }

    async saveCart(userId, cart) {
        try {
            const response = await fetch(API_URL.SAVE_CART, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ 
                    userId: userId, 
                    cartItems: cart 
                 })
            });
            if (!response.ok) {
                return {
                    success: false,
                    message: 'Lưu giỏ hàng thất bại'
                }
            }
            return {
                success: true,
                message: 'Lưu giỏ hàng thành công'
            }
        } catch (error) {
            console.error('Lỗi khi lưu giỏ hàng:', error);
            return null;
        }
    }

    async addToCart(productId, quantity, userId) {
        try {
            const response = await fetch(API_URL.ADD_TO_CART, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ productId, quantity, userId })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
            return null;
        }
    }

    async updateCartItem(cartItemId, quantity) {
        try {
            const response = await fetch(API_URL.UPDATE_CART_ITEM, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ cartItemId, quantity })
            });
            
            if (!response.ok) {
                return {
                    success: false,
                    message: 'Cập nhật sản phẩm trong giỏ hàng thất bại'
                }
            }
            return {
                success: true,
                message: 'Cập nhật sản phẩm trong giỏ hàng thành công'
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật sản phẩm trong giỏ hàng:', error);
            return null;
        }
    }

    async removeCartItem(itemId) {
        try {
            const response = await fetch(API_URL.REMOVE_CART_ITEM, {
                method: 'POST',
                headers: headers,
                body: itemId
            });
            if (!response.ok) {
                return {
                    success: false,
                    message: 'Xóa sản phẩm khỏi giỏ hàng thất bại'
                }
            }
            return {
                success: true,
                message: 'Xóa sản phẩm khỏi giỏ hàng thành công'
            }
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error);
            return null;
        }
    }
}
