const API_URL = {
    CART: 'http://localhost:8080/api/cart'
}

const headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
}

export class CartService {
    async getCart() {
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

    async addToCart(productId, quantity) {
        try {
            const response = await fetch(API_URL.CART, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ productId, quantity })
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
