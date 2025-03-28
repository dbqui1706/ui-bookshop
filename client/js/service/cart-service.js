const API_URL = {
    CART: 'http://localhost:8080/api/cart',
    ADD_TO_CART: 'http://localhost:8080/api/cart/add'
}

const headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
}

export class CartService {
    async getCart(userId, productId) {
        try {
            const response = await fetch(API_URL.CART, {
                headers: headers
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Lỗi khi tải giỏ hàng:', error);
            return {
                items: [],
                total: 0
            };
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

    async updateCartItem(itemId, quantity) {
        try {
            const response = await fetch(`${API_URL.CART}/${itemId}`, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify({ quantity })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Lỗi khi cập nhật sản phẩm trong giỏ hàng:', error);
            return null;
        }
    }

    async removeCartItem(itemId) {
        try {
            const response = await fetch(`${API_URL.CART}/${itemId}`, {
                method: 'DELETE',
                headers: headers,
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error);
            return null;
        }
    }
}
