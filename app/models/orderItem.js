/**
 * Class OrderItem - Model quản lý item trong đơn hàng
 */
export class OrderItem {
    /**
     * Khởi tạo đối tượng OrderItem
     * @param {Object} data - Dữ liệu item
     */
    constructor(data = {}) {
        this.id = data.id || null;
        this.orderId = data.orderId || null;
        this.productId = data.productId || null;
        this.productName = data.productName || '';
        this.productImage = data.productImage || '';
        this.basePrice = data.basePrice || 0;
        this.discountPercent = data.discountPercent || 0;
        this.price = data.price || 0;
        this.quantity = data.quantity || 1;
        this.subtotal = data.subtotal || 0;
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || null;
    }

    /**
     * Chuyển đổi đối tượng thành JSON
     * @returns {Object} - Đối tượng JSON
     */
    toJSON() {
        return {
            id: this.id,
            orderId: this.orderId,
            productId: this.productId,
            productName: this.productName,
            productImage: this.productImage,
            basePrice: this.basePrice,
            discountPercent: this.discountPercent,
            price: this.price,
            quantity: this.quantity,
            subtotal: this.subtotal,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    /**
     * Tính toán thành tiền
     * @returns {number} - Thành tiền
     */
    calculateSubtotal() {
        this.subtotal = this.price * this.quantity;
        return this.subtotal;
    }

    /**
     * Cập nhật số lượng và tính lại thành tiền
     * @param {number} quantity - Số lượng mới
     * @returns {number} - Thành tiền mới
     */
    updateQuantity(quantity) {
        this.quantity = Math.max(1, quantity);
        return this.calculateSubtotal();
    }
}

export default OrderItem;