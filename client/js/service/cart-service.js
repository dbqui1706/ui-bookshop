import { STORAGE_KEYS } from '../constants/index.js';

const API_URL = {
    CART: 'http://localhost:8080/api/cart',
    ADD_TO_CART: 'http://localhost:8080/api/cart/add',
    SAVE_CART: 'http://localhost:8080/api/cart/save',
    UPDATE_CART_ITEM: 'http://localhost:8080/api/cart/update',
    REMOVE_CART_ITEM: 'http://localhost:8080/api/cart/remove'
}

const HEADERS = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem(STORAGE_KEYS.TOKEN)}`,
}

export class CartService {
    async getCart() {
        try {
            const userId = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)).id;
            const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
            const response = await fetch(API_URL.CART + `?userId=${userId}`, {
                method: 'GET',
                credentials: 'include', 
                headers: HEADERS,
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                console.error('Error fetching cart:', response.status, response.statusText);
                const errorText = await response.text();
                console.error('Error response:', errorText);

                return {
                    success: false,
                    message: `Lấy giỏ hàng thất bại: ${response.status} ${response.statusText}`
                };
            }

            const data = await response.json();
            console.log('Cart data received:', data);

            return {
                success: true,
                data: data
            };
        } catch (error) {
            console.error('Lỗi khi tải giỏ hàng:', error);
            return {
                success: false,
                items: [],
                total: 0
            };
        }
    }

    async saveCart(userId, cart) {
        try {
            const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
            const response = await fetch(API_URL.SAVE_CART, {
                credentials: 'include',
                method: 'POST',
                headers: HEADERS,
                body: JSON.stringify({
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
                headers: HEADERS,
                body: JSON.stringify({ productId, quantity})
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
                headers: HEADERS,
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
                headers: HEADERS,
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
