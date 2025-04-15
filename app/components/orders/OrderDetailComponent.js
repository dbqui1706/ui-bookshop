import { Order } from '../../models/order.js';
import { orderService } from '../../services/orderService.js';
import { EventBus } from '../../core/eventBus.js';
import { formatDate, showNotification, showConfirmDialog } from '../../core/utils.js';
import { getToken } from '../../core/storage.js';

/**
 * Class OrderDetailComponent - Component hiển thị chi tiết đơn hàng
 */
export class OrderDetailComponent {
    /**
     * Khởi tạo component
     * @param {HTMLElement} container - Element container chứa component
     */
    constructor(container) {
        this.container = container;
        this.currentOrderCode = null;
        this.orderData = null;

        // Lấy service
        this.orderService = orderService.getInstance();
        this.eventBus = EventBus.getInstance();

        // Tham chiếu các elements
        this.elements = {
            orderDetailTitle: null,
            customerName: null,
            customerPhone: null,
            customerEmail: null,
            customerAddress: null,
            shippingMethod: null,
            orderCode: null,
            orderDate: null,
            orderStatus: null,
            paymentStatus: null,
            paymentMethod: null,
            orderNote: null,
            orderItemsContainer: null,
            orderSubtotal: null,
            orderDiscount: null,
            orderShipping: null,
            orderTotal: null,
            orderTimeline: null,
            btnBackToOrders: null,
            btnBackToOrdersBottom: null,
            btnUpdateStatus: null,
            btnPrintOrder: null
        };

        // Khởi tạo component
        this.initialize();
    }

    /**
     * Khởi tạo component
     */
    async initialize() {
        // Lấy mã đơn hàng từ URL
        const urlParams = new URLSearchParams(window.location.search);
        this.currentOrderCode = urlParams.get('code');
        // Nếu không có mã đơn hàng thì quay về trang danh sách
        if (!this.currentOrderCode) {
            window.location.href = 'order-list.html';
            return;
        }

        // Khởi tạo tham chiếu các elements
        this.initializeElements();

        // Lấy thông tin đơn hàng
        await this.loadOrderDetail();

        // Đăng ký sự kiện
        this.registerEventListeners();
    }

    /**
     * Khởi tạo tham chiếu các elements
     */
    initializeElements() {
        this.elements.orderDetailTitle = document.getElementById('orderDetailTitle');
        this.elements.customerName = document.getElementById('customerName');
        this.elements.customerPhone = document.getElementById('customerPhone');
        this.elements.customerEmail = document.getElementById('customerEmail');
        this.elements.customerAddress = document.getElementById('customerAddress');
        this.elements.shippingMethod = document.getElementById('shippingMethod');
        this.elements.orderCode = document.getElementById('orderCode');
        this.elements.orderDate = document.getElementById('orderDate');
        this.elements.orderStatus = document.getElementById('orderStatus');
        this.elements.paymentStatus = document.getElementById('paymentStatus');
        this.elements.paymentMethod = document.getElementById('paymentMethod');
        this.elements.orderNote = document.getElementById('orderNote');
        this.elements.orderItemsContainer = document.getElementById('orderItemsContainer');
        this.elements.orderSubtotal = document.getElementById('orderSubtotal');
        this.elements.orderDiscount = document.getElementById('orderDiscount');
        this.elements.orderShipping = document.getElementById('orderShipping');
        this.elements.orderTotal = document.getElementById('orderTotal');
        this.elements.orderTimeline = document.getElementById('orderTimeline');
        this.elements.btnBackToOrders = document.getElementById('btnBackToOrders');
        this.elements.btnBackToOrdersBottom = document.getElementById('btnBackToOrdersBottom');
        this.elements.btnUpdateStatus = document.getElementById('btnUpdateStatus');
        this.elements.btnPrintOrder = document.getElementById('btnPrintOrder');
    }

    /**
     * Lấy thông tin đơn hàng
     */
    async loadOrderDetail() {
        try {
            // Hiển thị loading
            // this.showLoading(true);

            // Gọi API lấy chi tiết đơn hàng
            this.orderData = await this.orderService.getOrderByCode(this.currentOrderCode);

            // Nếu không tìm thấy đơn hàng
            if (!this.orderData) {
                showNotification('Không tìm thấy thông tin đơn hàng', 'error');
                setTimeout(() => {
                    window.location.href = '/app/public/orders.html';
                }, 2000);
                return;
            }

            // Render dữ liệu
            this.renderOrderDetail();

            // Ẩn loading
            // this.showLoading(false);
        } catch (error) {
            console.error('Error loading order detail:', error);
        }
    }


    /**
     * Hiển thị thông tin đơn hàng
     */
    renderOrderDetail() {
        // Cập nhật tiêu đề trang
        this.elements.orderDetailTitle.innerHTML = `Chi tiết đơn hàng <strong>${this.orderData.order.orderCode}</strong>`;

        // Hiển thị thông tin khách hàng
        this.populateCustomerInfo();

        // Hiển thị thông tin đơn hàng
        this.populateOrderInfo();

        // Hiển thị danh sách sản phẩm
        this.populateOrderItems();

        // Hiển thị thông tin thanh toán
        this.populateOrderSummary();

        // Hiển thị lịch sử đơn hàng
        this.populateOrderTimeline();

        // Cập nhật trạng thái nút (Có thể hủy đơn hàng hay không)
        this.updateActionButtons();
    }

    /**
     * Hiển thị thông tin khách hàng
     */
    populateCustomerInfo() {
        const { order, shipping, delivery } = this.orderData;

        this.elements.customerName.textContent = shipping.receiverName;
        this.elements.customerPhone.textContent = shipping.receiverPhone;
        this.elements.customerEmail.textContent = shipping.receiverEmail;
        this.elements.customerAddress.textContent = shipping.fullAddress;
        this.elements.shippingMethod.textContent = `${delivery.name} (${delivery.estimatedDays})`;
    }

    /**
     * Hiển thị thông tin đơn hàng
     */
    populateOrderInfo() {
        const { order, payment, paymentTransaction } = this.orderData;

        this.elements.orderCode.textContent = order.orderCode;
        this.elements.orderDate.textContent = formatDate(order.createdAt);
        this.elements.orderStatus.innerHTML = this.renderOrderStatus(order.statusText);
        this.elements.paymentStatus.innerHTML = this.renderPaymentStatus(paymentTransaction.statusText);
        this.elements.paymentMethod.textContent = ` (${payment.name})`;
        this.elements.orderNote.textContent = order.note || "Không có ghi chú";
    }

    /**
     * Hiển thị danh sách sản phẩm
     */
    populateOrderItems() {
        const { items } = this.orderData;
        let html = `
            <div class="card border-0 shadow-sm mb-4 rounded">
                <div class="table-responsive rounded">
                    <table class="table product-table mb-0">
                        <thead>
                            <tr>
                                <th class="ps-4" style="width: 50px">STT</th>
                                <th style="width: 100px">Ảnh</th>
                                <th>Sản phẩm</th>
                                <th style="width: 250px">Mã SKU</th>
                                <th style="width: 130px">Đơn giá</th>
                                <th style="width: 100px" class="text-center">Số lượng</th>
                                <th style="width: 150px" class="text-end pe-4">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        items.forEach((item, index) => {
            html += `
                <tr class="product-row">
                    <td class="ps-4">${index + 1}</td>
                    <td>
                        <div class="product-image-container">
                            <img src="/asset/images/${item.productImage}" class="product-image" alt="${item.productName}">
                        </div>
                    </td>
                    <td>
                        <div class="product-info">
                            <div class="product-name">${item.productName}</div>
                            <div class="product-author text-muted small">Tác giả: ${item.author}</div>
                        </div>
                    </td>
                    <td><span class="sku-badge">SKU-${item.productId}</span></td>
                    <td>
                        <span class="product-price">${this.formatCurrency(item.price)}</span>
                        ${item.discountPercent > 0 ?
                    `<span class="product-base-price" style="color: #999;text-decoration: line-through;">${ this.formatCurrency(item.basePrice)}</span>` : ''}
                    </td>
                    <td class="text-center">
                        <span class="quantity-badge">${item.quantity}</span>
                    </td>
                    <td class="text-end pe-4 fw-bold text-primary">${this.formatCurrency(item.subtotal)}</td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
        </div>
        `;

        this.elements.orderItemsContainer.innerHTML = html;
    }

    /**
     * Hiển thị thông tin thanh toán
     */
    populateOrderSummary() {
        const { summary } = this.orderData;

        this.elements.orderSubtotal.textContent = this.formatCurrency(summary.subtotal);
        this.elements.orderDiscount.textContent = `-${this.formatCurrency(summary.discount)}`;
        this.elements.orderShipping.textContent = `+${this.formatCurrency(summary.shipping)}`;
        this.elements.orderTotal.textContent = this.formatCurrency(summary.total);
    }

    /**
     * Hiển thị lịch sử đơn hàng
     */
    populateOrderTimeline() {
        const { timeLine } = this.orderData;
        let html = "";

        timeLine.forEach((item, index) => {
            html += `
                <div class="timeline-item">
                    <div class="timeline-marker"></div>
                    <div class="timeline-content rounded">
                        <div class="d-flex justify-content-between">
                            <h6 class="mb-1">${item.statusText}</h6>
                            <small class="text-muted">${formatDate(item.createdAt)}</small>
                        </div>
                        <p class="text-muted mb-0">${item.note}</p>
                        ${item.changedByName ? `<small class="text-muted">Thay đổi: ${item.changedByName}</small>` : ''}
                    </div>
                </div>
            `;
        });

        this.elements.orderTimeline.innerHTML = html;
    }

    /**
     * Cập nhật trạng thái các nút
     */
    updateActionButtons() {
        // Kiểm tra có thể hủy đơn không
        if (this.orderData.canCancel) {
            // Thêm nút hủy đơn hàng nếu cần
        }
    }

    /**
     * Render trạng thái đơn hàng
     * @param {string} status - Trạng thái đơn hàng
     * @returns {string} HTML để hiển thị trạng thái
     */
    renderOrderStatus(status) {
        let badgeClass = "";
        let iconClass = "";
        console.log(status)
        switch (status.toLowerCase()) {
            case "chờ xác nhận":
                badgeClass = "bg-info";
                iconClass = "bi-hourglass-split";
                break;
            case "chờ thanh toán":
                badgeClass = "bg-warning";
                iconClass = "bi-wallet";
                break;
            case "đã xác nhận":
                badgeClass = "bg-info";
                iconClass = "bi-check-circle";
                break;
            case "đang xử lý":
                badgeClass = "bg-primary";
                iconClass = "bi-gear";
                break;
            case "đang đóng gói":
                badgeClass = "bg-primary";
                iconClass = "bi-box-seam";
                break;
            case "đang giao hàng":
                badgeClass = "bg-primary";
                iconClass = "bi-truck";
                break;
            case "đã giao hàng":
                badgeClass = "bg-delivered";
                iconClass = "bi-check2-all";
                break;
            case "đã hủy":
                badgeClass = "bg-cancelled";
                iconClass = "bi-x-circle";
                break;
            case "hoàn trả":
                badgeClass = "bg-returned";
                iconClass = "bi-arrow-return-left";
                break;
            default:
                badgeClass = "bg-secondary";
                iconClass = "bi-question-circle";
        }

        return `<span class="badge ${badgeClass} status-badge"><i class="bi ${iconClass} me-1"></i>${status}</span>`;
    }

    /**
     * Render trạng thái thanh toán
     * @param {string} status - Trạng thái thanh toán
     * @returns {string} HTML để hiển thị trạng thái
     */
    renderPaymentStatus(status) {
        let badgeClass = "";
        console.log(status)
        switch (status.toLowerCase()) {
            case "đã thanh toán":
                badgeClass = "bg-success";
                break;
            case "chờ thanh toán":
                badgeClass = "bg-warning";
                break;
            case "thất bại":
                badgeClass = "bg-danger";
                break;
            default:
                badgeClass = "bg-secondary";
        }

        return `<span class="badge ${badgeClass}">${status}</span>`;
    }

    /**
     * Đăng ký các sự kiện cho các elements
     */
    registerEventListeners() {
        // Nút quay lại
        this.elements.btnBackToOrders.addEventListener("click", () => this.handleBackToOrders());
        this.elements.btnBackToOrdersBottom.addEventListener("click", () => this.handleBackToOrders());

        // Nút cập nhật trạng thái
        this.elements.btnUpdateStatus.addEventListener("click", () => this.handleUpdateStatus());

        // Nút in đơn hàng
        this.elements.btnPrintOrder.addEventListener("click", () => this.handlePrintOrder());
    }

    /**
     * Xử lý sự kiện quay lại danh sách đơn hàng
     */
    handleBackToOrders() {
        showConfirmDialog(
            'Quay lại danh sách đơn hàng?',
            "Các thay đổi chưa lưu sẽ bị mất!",
            'Đồng ý',
            () => {window.location.href = '/app/public/orders.html';}
        );
    }

    /**
     * Xử lý sự kiện cập nhật trạng thái đơn hàng
     */
    async handleUpdateStatus() {
        const statusOptions = this.getAvailableStatusOptions();

        Swal.fire({
            title: 'Cập nhật trạng thái',
            html: `
                <select id="swal-status" class="form-select mb-3">
                    <option value="">-- Chọn trạng thái --</option>
                    <option value="processing">Đã xác nhận</option>
                    <option value="shipping">Đang giao hàng</option>
                    <option value="delivered">Đã giao hàng</option>
                    <option value="cancelled">Đã hủy</option>
                    <option value="refunded">Hoàn trả</option>
                </select>
                <textarea id="swal-note" class="form-control" placeholder="Ghi chú (nếu có)"></textarea>
            `,
            showCancelButton: true,
            confirmButtonText: 'Cập nhật',
            cancelButtonText: 'Hủy bỏ',
            preConfirm: () => {
                const status = document.getElementById('swal-status').value;
                const note = document.getElementById('swal-note').value;
                
                if (!status) {
                    Swal.showValidationMessage('Vui lòng chọn trạng thái');
                    return false;
                }
                
                return { status, note };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Gọi API cập nhật trạng thái
                    const success = await this.orderService.updateOrderStatus(
                        this.orderData.order.id,
                        result.value.status,
                        result.value.note
                    );

                    if (success) {
                        showNotification('success', 'Thành công', 'Cập nhật trạng thái đơn hàng thành công!');

                        // Tải lại dữ liệu đơn hàng
                        await this.loadOrderDetail();
                    } else {
                        showNotification('error', 'Lỗi', 'Không thể cập nhật trạng thái đơn hàng. ');
                    }
                } catch (error) {
                    console.error('Error updating order status:', error);
                    showNotification('error', 'Lỗi', 'Không thể cập nhật trạng thái đơn hàng. ' + error.message);
                } finally {
                }
            }
        });
    }

    /**
     * Lấy danh sách trạng thái có thể chuyển đổi
     * @returns {string} HTML options
     */
    getAvailableStatusOptions() {
        const currentStatus = this.orderData.order.status;
        let options = '';

        // Danh sách trạng thái có thể chuyển đổi tùy theo trạng thái hiện tại
        const availableStatuses = this.getNextPossibleStatuses(currentStatus);

        availableStatuses.forEach(status => {
            options += `<option value="${status.value}">${status.text}</option>`;
        });

        return options;
    }

    /**
     * Lấy danh sách trạng thái có thể chuyển đổi tiếp theo
     * @param {string} currentStatus - Trạng thái hiện tại
     * @returns {Array} Danh sách trạng thái có thể chuyển đổi
     */
    getNextPossibleStatuses(currentStatus) {
        // Định nghĩa luồng chuyển đổi trạng thái
        const statusFlow = {
            'pending': [
                { value: 'processing', text: 'Đang xử lý' },
                { value: 'cancelled', text: 'Đã hủy' }
            ],
            'waiting_payment': [
                { value: 'processing', text: 'Đang xử lý' },
                { value: 'payment_failed', text: 'Thanh toán thất bại' },
                { value: 'cancelled', text: 'Đã hủy' }
            ],
            'processing': [
                { value: 'shipping', text: 'Đang giao hàng' },
                { value: 'cancelled', text: 'Đã hủy' }
            ],
            'shipping': [
                { value: 'delivered', text: 'Đã giao hàng' },
                { value: 'cancelled', text: 'Đã hủy' }
            ],
            'delivered': [
                { value: 'refunded', text: 'Đã hoàn tiền' }
            ],
            'payment_failed': [
                { value: 'waiting_payment', text: 'Chờ thanh toán' },
                { value: 'cancelled', text: 'Đã hủy' }
            ],
            'cancelled': [
                { value: 'refunded', text: 'Đã hoàn tiền' }
            ],
            'refunded': []
        };

        return statusFlow[currentStatus] || [];
    }

    /**
     * Xử lý sự kiện in đơn hàng
     */
    handlePrintOrder() {
        showConfirmDialog({
            title: 'Đang chuẩn bị in...',
            text: 'Vui lòng đợi trong giây lát',
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
            }
        }).then(() => {
            window.print();
        });
    }

    /**
      * Định dạng tiền tệ
      * @param {number} amount - Số tiền cần định dạng
      * @returns {string} - Chuỗi đã được định dạng
      */
    formatCurrency(amount) {
        const number = parseFloat(amount).toFixed(0)
        return new Intl.NumberFormat('vi-VN', { style: 'decimal' }).format(number) + 'đ';
    }

}