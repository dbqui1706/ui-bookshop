/**
 * Class OrderDetail - Model quản lý chi tiết đơn hàng.
 */
export class OrderDetail {
    /**
     * Khởi tạo đối tượng OrderDetail
     * @param {Object} data - Dữ liệu đơn hàng
     */
    constructor(data = {}) {
        // Thông tin cơ bản của đơn hàng
        this.order = {
            id: data.order?.id || 0,
            orderCode: data.order?.orderCode || '',
            status: data.order?.status || 'pending',
            statusText: data.order?.statusText || 'Chờ xác nhận',
            createdAt: data.order?.createdAt || '',
            subtotal: data.order?.subtotal || 0,
            deliveryPrice: data.order?.deliveryPrice || 0,
            discountAmount: data.order?.discountAmount || 0,
            taxAmount: data.order?.taxAmount || 0,
            totalAmount: data.order?.totalAmount || 0,
            couponCode: data.order?.couponCode || '',
            note: data.order?.note || '',
            userId: data.order?.userId || 0,
            customerName: data.order?.customerName || '',
            customerPhone: data.order?.customerPhone || '',
            customerEmail: data.order?.customerEmail || '',
            customerAddressLine1: data.order?.customerAddressLine1 || '',
            customerFullAddress: data.order?.customerFullAddress || ''
        };

        // Thông tin phương thức giao hàng
        this.delivery = {
            id: data.delivery?.id || 0,
            name: data.delivery?.name || '',
            description: data.delivery?.description || '',
            estimatedDays: data.delivery?.estimatedDays || '',
            price: data.delivery?.price || 0
        };

        // Thông tin phương thức thanh toán
        this.payment = {
            id: data.payment?.id || 0,
            name: data.payment?.name || '',
            code: data.payment?.code || '',
            description: data.payment?.description || ''
        };

        // Thông tin giao hàng
        this.shipping = {
            receiverName: data.shipping?.receiverName || '',
            receiverEmail: data.shipping?.receiverEmail || '',
            receiverPhone: data.shipping?.receiverPhone || '',
            addressLine1: data.shipping?.addressLine1 || '',
            city: data.shipping?.city || '',
            district: data.shipping?.district || '',
            ward: data.shipping?.ward || '',
            fullAddress: data.shipping?.fullAddress || ''
        };

        // Thông tin giao dịch thanh toán
        this.paymentTransaction = data.paymentTransaction ? {
            id: data.paymentTransaction.id || 0,
            amount: data.paymentTransaction.amount || 0,
            transactionCode: data.paymentTransaction.transactionCode || '',
            paymentProviderRef: data.paymentTransaction.paymentProviderRef || '',
            status: data.paymentTransaction.status || '',
            statusText: data.paymentTransaction.statusText || '',
            paymentDate: data.paymentTransaction.paymentDate || '',
            note: data.paymentTransaction.note || ''
        } : null;

        // Danh sách sản phẩm trong đơn hàng
        this.items = Array.isArray(data.items) ? data.items.map(item => ({
            id: item.id || 0,
            productId: item.productId || 0,
            productName: item.productName || '',
            productImage: item.productImage || '',
            author: item.author || '',
            basePrice: item.basePrice || 0,
            discountPercent: item.discountPercent || 0,
            price: item.price || 0,
            quantity: item.quantity || 0,
            subtotal: item.subtotal || 0
        })) : [];

        // Lịch sử trạng thái đơn hàng
        this.timeLine = Array.isArray(data.timeLine) ? data.timeLine.map(timeline => ({
            id: timeline.id || 0,
            status: timeline.status || '',
            statusText: timeline.statusText || '',
            note: timeline.note || '',
            changedBy: timeline.changedBy || 0,
            changedByName: timeline.changedByName || '',
            createdAt: timeline.createdAt || ''
        })) : [];

        // Có thể hủy đơn hàng không
        this.canCancel = !!data.canCancel;

        // Thông tin tổng hợp đơn hàng
        this.summary = data.summary ? {
            subtotal: data.summary.subtotal || 0,
            discount: data.summary.discount || 0,
            shipping: data.summary.shipping || 0,
            tax: data.summary.tax || 0,
            total: data.summary.total || 0
        } : {
            subtotal: 0,
            discount: 0,
            shipping: 0,
            tax: 0,
            total: 0
        };
    }

    /**
     * Chuyển đổi đối tượng thành JSON
     * @returns {Object} - Đối tượng JSON
     */
    toJSON() {
        return {
            order: this.order,
            delivery: this.delivery,
            payment: this.payment,
            shipping: this.shipping,
            paymentTransaction: this.paymentTransaction,
            items: this.items,
            timeLine: this.timeLine,
            canCancel: this.canCancel,
            summary: this.summary
        };
    }

    /**
     * Lấy trạng thái hiện tại của đơn hàng
     * @returns {string} - Trạng thái đơn hàng
     */
    getCurrentStatus() {
        return this.order.status;
    }

    /**
     * Lấy trạng thái thanh toán hiện tại
     * @returns {string} - Trạng thái thanh toán
     */
    getPaymentStatus() {
        return this.paymentTransaction?.status || 'pending';
    }

    /**
     * Kiểm tra xem đơn hàng đã thanh toán chưa
     * @returns {boolean} - true nếu đã thanh toán
     */
    isPaid() {
        return this.paymentTransaction?.status === 'completed';
    }

    /**
     * Kiểm tra xem đơn hàng đã giao chưa
     * @returns {boolean} - true nếu đã giao hàng
     */
    isDelivered() {
        return this.order.status === 'delivered';
    }

    /**
     * Kiểm tra xem đơn hàng đã hủy chưa
     * @returns {boolean} - true nếu đã hủy
     */
    isCancelled() {
        return this.order.status === 'cancelled';
    }

    /**
     * Tính tổng số sản phẩm trong đơn hàng
     * @returns {number} - Tổng số sản phẩm
     */
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    /**
     * Tính tổng tiền sản phẩm
     * @returns {number} - Tổng tiền sản phẩm
     */
    getSubtotal() {
        return this.summary.subtotal;
    }

    /**
     * Tính tổng tiền giảm giá
     * @returns {number} - Tổng tiền giảm giá
     */
    getDiscount() {
        return this.summary.discount;
    }

    /**
     * Lấy giá trị phí ship
     * @returns {number} - Phí ship
     */
    getShippingFee() {
        return this.summary.shipping;
    }

    /**
     * Lấy tổng tiền đơn hàng
     * @returns {number} - Tổng tiền đơn hàng
     */
    getTotal() {
        return this.summary.total;
    }

    /**
     * Kiểm tra xem có thể cập nhật trạng thái không
     * @param {string} newStatus - Trạng thái mới
     * @returns {boolean} - true nếu có thể cập nhật
     */
    canUpdateStatus(newStatus) {
        // Đơn hàng đã hủy, đã hoàn tiền hoặc đã giao không thể cập nhật trạng thái
        if (['cancelled', 'refunded', 'delivered'].includes(this.order.status)) {
            return false;
        }

        // Kiểm tra luồng trạng thái hợp lệ
        const validFlows = {
            'pending': ['processing', 'cancelled'],
            'waiting_payment': ['processing', 'payment_failed', 'cancelled'],
            'processing': ['shipping', 'cancelled'],
            'shipping': ['delivered', 'cancelled'],
            'payment_failed': ['waiting_payment', 'cancelled'],
            'delivered': ['refunded'],
            'cancelled': ['refunded']
        };

        const allowedStatuses = validFlows[this.order.status] || [];
        return allowedStatuses.includes(newStatus);
    }
}

export default OrderDetail;