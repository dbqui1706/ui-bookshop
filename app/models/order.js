/**
 * Class Order - Model quản lý đơn hàng
 */
export class Order {
    /**
     * Khởi tạo đối tượng Order
     * @param {Object} data - Dữ liệu đơn hàng
     */
    constructor(data = {}) {
        this.id = data.id || null;
        this.orderCode = data.orderCode || '';
        this.userId = data.userId || null;
        this.userName = data.userName || '';
        this.userEmail = data.userEmail || '';
        this.userPhone = data.userPhone || '';
        this.status = data.status || 'pending';
        this.deliveryMethodId = data.deliveryMethodId || null;
        this.paymentMethodId = data.paymentMethodId || null;
        this.paymentMethodName = data.paymentMethodName || '';
        this.paymentStatus = data.paymentStatus || 'pending';
        this.subtotal = data.subtotal || 0;
        this.deliveryPrice = data.deliveryPrice || 0;
        this.discountAmount = data.discountAmount || 0;
        this.taxAmount = data.taxAmount || 0;
        this.totalAmount = data.totalAmount || 0;
        this.couponCode = data.couponCode || null;
        this.note = data.note || '';
        this.isVerified = data.isVerified || false;
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || null;
        this.items = data.items || [];
        this.shipping = data.shipping || {};
    }

    /**
     * Chuyển đổi đối tượng thành JSON
     * @returns {Object} - Đối tượng JSON
     */
    toJSON() {
        return {
            id: this.id,
            orderCode: this.orderCode,
            userId: this.userId,
            userName: this.userName,
            userEmail: this.userEmail,
            userPhone: this.userPhone,
            status: this.status,
            deliveryMethodId: this.deliveryMethodId,
            paymentMethodId: this.paymentMethodId,
            paymentMethodName: this.paymentMethodName,
            paymentStatus: this.paymentStatus,
            subtotal: this.subtotal,
            deliveryPrice: this.deliveryPrice,
            discountAmount: this.discountAmount,
            taxAmount: this.taxAmount,
            totalAmount: this.totalAmount,
            couponCode: this.couponCode,
            note: this.note,
            isVerified: this.isVerified,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            items: this.items,
            shipping: this.shipping
        };
    }

    /**
     * Lấy trạng thái đơn hàng dưới dạng text
     * @returns {string} - Tên trạng thái
     */
    getStatusText() {
        const statusMap = {
            'pending': 'Chờ xử lý',
            'waiting_payment': 'Chờ thanh toán',
            'payment_failed': 'Thanh toán thất bại',
            'processing': 'Đang xử lý',
            'shipping': 'Đang giao hàng',
            'delivered': 'Đã giao hàng',
            'cancelled': 'Đã hủy',
            'refunded': 'Đã hoàn tiền'
        };
        
        return statusMap[this.status] || 'Không xác định';
    }

    /**
     * Lấy trạng thái thanh toán dưới dạng text
     * @returns {string} - Tên trạng thái thanh toán
     */
    getPaymentStatusText() {
        const statusMap = {
            'pending': 'Chờ thanh toán',
            'completed': 'Đã thanh toán',
            'failed': 'Thanh toán thất bại',
            'refunded': 'Đã hoàn tiền'
        };
        
        return statusMap[this.paymentStatus] || 'Không xác định';
    }

    /**
     * Kiểm tra xem đơn hàng có thể cập nhật sang trạng thái mới không
     * @param {string} newStatus - Trạng thái mới
     * @returns {boolean} - Có thể cập nhật hay không
     */
    canUpdateStatus(newStatus) {
        // Các quy tắc chuyển đổi trạng thái
        const allowedTransitions = {
            'pending': ['processing', 'cancelled'],
            'waiting_payment': ['processing', 'payment_failed', 'cancelled'],
            'payment_failed': ['waiting_payment', 'processing', 'cancelled'],
            'processing': ['shipping', 'cancelled'],
            'shipping': ['delivered', 'cancelled'],
            'delivered': ['refunded'],
            'cancelled': [],
            'refunded': []
        };
        
        return allowedTransitions[this.status]?.includes(newStatus) || false;
    }

    /**
     * Tính tổng số lượng sản phẩm trong đơn hàng
     * @returns {number} - Tổng số lượng
     */
    getTotalQuantity() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }
}

export default Order;