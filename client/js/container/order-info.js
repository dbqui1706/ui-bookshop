import { OrderService } from '../service/order-service.js';
import { DialogComponent } from '../components/dialog-component.js';
import { showToast } from '../utils/common-utils.js';
import { formatPrice } from '../utils/formatter.js';

export class OrderInfo {
    constructor() {
        this.orderService = new OrderService();
        this.currentStatus = 'all';
        this.currentPage = 1;
        this.limit = 5;
        this.keyword = '';
        this.sortBy = 'newest';
        this.totalPages = 1;
        this.orders = [];
        this.statusCounts = {};

        this.init();
    }

    /**
     * Khởi tạo các thành phần và sự kiện
     */
    async init() {
        this.setupEventListeners();
        await this.loadOrders();
    }

    /**
     * Thiết lập các sự kiện cho các element
     */
    setupEventListeners() {
        // Sự kiện cho các tab trạng thái
        const tabItems = document.querySelectorAll('.tab-item');
        tabItems.forEach(tab => {
            tab.addEventListener('click', (event) => {
                event.preventDefault();

                // Xóa active class khỏi tất cả các tab
                tabItems.forEach(t => t.classList.remove('active'));

                // Thêm active class cho tab được click
                tab.classList.add('active');

                // Lấy trạng thái từ id của tab
                const status = tab.id.replace('-orders', '');
                this.currentStatus = status;
                this.currentPage = 1;

                // Tải lại danh sách đơn hàng
                this.loadOrders();
            });
        });

        // Sự kiện cho thanh tìm kiếm
        const searchButton = document.getElementById('search-button');
        const searchInput = document.getElementById('search-input');

        if (searchButton && searchInput) {
            searchButton.addEventListener('click', () => {
                this.keyword = searchInput.value.trim();
                this.currentPage = 1;
                this.loadOrders();
            });

            // Thêm sự kiện Enter cho ô tìm kiếm
            searchInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    this.keyword = searchInput.value.trim();
                    this.currentPage = 1;
                    this.loadOrders();
                }
            });
        }

        // Sự kiện cho phân trang
        this.setupPagination();
    }

    /**
     * Thiết lập sự kiện cho phân trang
     */
    setupPagination() {
        const pagination = document.getElementById('pagination');

        if (pagination) {
            pagination.addEventListener('click', (event) => {
                event.preventDefault();

                const target = event.target;

                // Nếu là nút previous
                if (target.getAttribute('aria-label') === 'Previous' && !target.parentElement.classList.contains('disabled')) {
                    this.currentPage--;
                    this.loadOrders();
                    return;
                }

                // Nếu là nút next
                if (target.getAttribute('aria-label') === 'Next' && !target.parentElement.classList.contains('disabled')) {
                    this.currentPage++;
                    this.loadOrders();
                    return;
                }

                // Nếu là nút số trang
                if (target.classList.contains('page-link') && !isNaN(parseInt(target.textContent))) {
                    this.currentPage = parseInt(target.textContent);
                    this.loadOrders();
                    return;
                }
            });
        }
    }

    /**
     * Tải danh sách đơn hàng
     */
    async loadOrders() {
        try {
            // Hiển thị loading
            this.showLoading(true);

            // Gọi API để lấy danh sách đơn hàng
            const response = await this.orderService.getOrders(
                this.currentStatus,
                this.currentPage,
                this.limit,
                this.keyword,
                this.sortBy
            );

            // Ẩn loading
            this.showLoading(false);

            if (response.success) {
                this.orders = response.orders;
                this.totalPages = response.pagination.totalPages;
                this.statusCounts = response.orderStatusCounts;

                // Cập nhật số lượng đơn hàng trên các tab
                this.updateStatusCountBadges();

                // Render danh sách đơn hàng
                this.renderOrders(this.orders);

                // Render phân trang
                this.renderPagination(response.pagination);

                // Hiển thị tình trạng trống nếu không có đơn hàng
                this.toggleEmptyState(this.orders.length === 0);
            } else {
                // Hiển thị thông báo lỗi
                showToast(response.message, 'error');

                // Hiển thị tình trạng trống
                this.toggleEmptyState(true);
            }
        } catch (error) {
            console.error('Lỗi khi tải danh sách đơn hàng:', error);

            // Ẩn loading
            this.showLoading(false);

            // Hiển thị thông báo lỗi
            showToast('Có lỗi xảy ra khi tải danh sách đơn hàng', 'error');

            // Hiển thị tình trạng trống
            this.toggleEmptyState(true);
        }
    }

    /**
     * Cập nhật số lượng đơn hàng trên các tab
     */
    updateStatusCountBadges() {
        // Thêm badge với số lượng cho các tab
        const addBadge = (tabId, count) => {
            const tab = document.getElementById(tabId);
            if (tab) {
                const link = tab.querySelector('a');
                
                // Xóa badge cũ nếu có
                const oldBadge = link.querySelector('.badge');
                if (oldBadge) {
                    oldBadge.remove();
                }
                
                // Thêm badge mới nếu có số lượng > 0
                if (count && count > 0) {
                    const badge = document.createElement('span');
                    badge.className = 'badge';
                    badge.textContent = count;
                    link.appendChild(badge);
                }
            }
        };
        
        // Tổng số đơn hàng (tất cả trạng thái)
        let totalCount = 0;
        for (const status in this.statusCounts) {
            totalCount += this.statusCounts[status];
        }
        
        // Cập nhật badge cho tab "Tất cả đơn"
        addBadge('all-orders', totalCount);
        
        // Cập nhật badge cho các tab trạng thái cụ thể
        addBadge('pending-orders', this.statusCounts.pending || this.statusCounts.waiting_payment);
        addBadge('processing-orders', this.statusCounts.processing);
        addBadge('shipping-orders', this.statusCounts.shipping);
        addBadge('delivered-orders', this.statusCounts.delivered);
        addBadge('cancelled-orders', this.statusCounts.cancelled);
    }

    /**
     * Hiển thị/ẩn trạng thái loading
     * @param {boolean} show Hiển thị hay ẩn
     */
    showLoading(show) {
        const orderList = document.getElementById('order-list');

        if (orderList) {
            if (show) {
                orderList.innerHTML = '<div class="text-center my-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>';
            }
        }
    }

    /**
     * Hiển thị/ẩn trạng thái không có đơn hàng
     * @param {boolean} show Hiển thị hay ẩn
     */
    toggleEmptyState(show) {
        const emptyOrder = document.querySelector('.empty-order');
        const orderList = document.getElementById('order-list');
        const pagination = document.getElementById('pagination');

        if (emptyOrder && orderList && pagination) {
            emptyOrder.style.display = show ? 'block' : 'none';
            orderList.style.display = show ? 'none' : 'block';
            pagination.style.display = show ? 'none' : 'flex';
        }
    }

    /**
     * Render danh sách đơn hàng
     * @param {Array} orders Danh sách đơn hàng
     */
    renderOrders(orders) {
        const orderList = document.getElementById('order-list');

        if (!orderList) return;

        // Xóa các đơn hàng hiện tại
        orderList.innerHTML = '';

        // Thêm các đơn hàng mới
        orders.forEach((order, index) => {
            const orderElement = this.createOrderElement(order, index);
            orderList.appendChild(orderElement);
        });

        // Thêm sự kiện cho các nút
        this.attachOrderButtonEvents();
    }

    /**
     * Tạo element cho đơn hàng
     * @param {Object} order Đơn hàng
     * @param {number} index Chỉ số của đơn hàng
     * @returns {HTMLElement} Element của đơn hàng
     */
    createOrderElement(order, index) {
        console.log('Creating order element for order:', order);
        const orderElement = document.createElement('div');
        orderElement.className = 'order-item';
        orderElement.id = `order-item-${order.id}`;

        // Tạo header
        const orderHeader = document.createElement('div');
        orderHeader.className = 'order-header';
        orderHeader.innerHTML = `
            <div class="order-info">
                <span class="order-id">Đơn hàng: ${order.orderCode}</span>
                <span class="order-date">Ngày đặt: ${order.orderDate}</span>
            </div>
            <div class="order-status">
                <span class="status-badge ${order.status}">${order.statusText}</span>
            </div>
        `;

        orderElement.appendChild(orderHeader);

        // Hiển thị tối đa 2 sản phẩm
        const productsToShow = order.products.slice(0, 2);

        // Render từng sản phẩm
        productsToShow.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'order-body';
            productElement.innerHTML = `
                <div class="product-info">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.title}">
                    </div>
                    <div class="product-details">
                        <h4 class="product-title">${product.title}</h4>
                        <p class="product-variant">${product.variant}</p>
                        <p class="product-quantity">Số lượng: ${product.quantity}</p>
                    </div>
                </div>
                <div class="order-price">
                    <p class="price-label">Thành tiền:</p>
                    <p class="price-value">${formatPrice(product.price.toFixed(0))}</p>
                </div>
            `;

            orderElement.appendChild(productElement);
        });

        // Hiển thị số sản phẩm còn lại nếu có
        const remainingProducts = order.products.length - productsToShow.length;
        if (remainingProducts > 0) {
            const remainingElement = document.createElement('div');
            remainingElement.className = 'remaining-products';
            remainingElement.innerHTML = `<span>+${remainingProducts} sản phẩm khác</span>`;
            orderElement.appendChild(remainingElement);
        }

        // Tạo footer với các nút hành động
        const orderFooter = document.createElement('div');
        orderFooter.className = 'order-footer';

        // Luôn hiển thị nút Xem chi tiết
        orderFooter.innerHTML = `<button class="btn-detail" data-order-id="${order.id}">Xem chi tiết</button>`;

        // Thêm nút Mua lại nếu đơn hàng đã giao hoặc đã hủy
        if (order.status === 'delivered' || order.status === 'cancelled') {
            orderFooter.innerHTML += `<button class="btn-rebuy" data-order-id="${order.id}">Mua lại</button>`;
        }

        // Thêm nút Đánh giá nếu đơn hàng đã giao
        if (order.status === 'delivered') {
            orderFooter.innerHTML += `<button class="btn-review" data-order-id="${order.id}">Đánh giá</button>`;
        }

        // Thêm nút Theo dõi đơn nếu đơn hàng đang vận chuyển
        if (order.status === 'shipping') {
            orderFooter.innerHTML += `<button class="btn-track" data-order-id="${order.id}">Theo dõi đơn</button>`;
        }

        // Thêm nút Hủy đơn nếu đơn hàng đang xử lý hoặc chờ thanh toán
        if (order.status === 'processing' || order.status === 'pending' || order.status === 'waiting_payment') {
            orderFooter.innerHTML += `<button class="btn-cancel" data-order-id="${order.id}">Hủy đơn</button>`;
        }

        orderElement.appendChild(orderFooter);

        return orderElement;
    }

    /**
     * Render phân trang
     * @param {Object} pagination Thông tin phân trang
     */
    renderPagination(pagination) {
        const paginationElement = document.getElementById('pagination');

        if (!paginationElement) return;

        // remove d-none class
        paginationElement.classList.remove('d-none');

        // Hiển thị phân trang nếu có nhiều hơn 1 trang
        if (pagination.totalPages > 1) {
            paginationElement.style.display = 'flex';

            // Xóa nội dung hiện tại
            paginationElement.innerHTML = '';

            // Nút Previous
            const prevDisabled = pagination.currentPage <= 1 ? 'disabled' : '';
            paginationElement.innerHTML += `
                <li class="page-item ${prevDisabled}">
                    <a class="page-link" href="#" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                        <span class="sr-only">Previous</span>
                    </a>
                </li>
            `;

            // Các nút số trang
            for (let i = 1; i <= pagination.totalPages; i++) {
                const active = i === pagination.currentPage ? 'active' : '';
                paginationElement.innerHTML += `
                    <li class="page-item ${active}">
                        <a class="page-link" href="#">${i}</a>
                    </li>
                `;
            }

            // Nút Next
            const nextDisabled = pagination.currentPage >= pagination.totalPages ? 'disabled' : '';
            paginationElement.innerHTML += `
                <li class="page-item ${nextDisabled}">
                    <a class="page-link" href="#" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                        <span class="sr-only">Next</span>
                    </a>
                </li>
            `;
        } else {
            // Ẩn phân trang nếu chỉ có 1 trang
            paginationElement.classList.add('d-none');
        }
    }

    /**
     * Gắn sự kiện cho các nút trong đơn hàng
     */
    attachOrderButtonEvents() {
        // Sự kiện nút Xem chi tiết
        const detailButtons = document.querySelectorAll('.btn-detail');
        detailButtons.forEach(button => {
            button.addEventListener('click', () => {
                const orderId = button.getAttribute('data-order-id');
                this.showOrderDetail(orderId);
            });
        });

        // Sự kiện nút Mua lại
        const rebuyButtons = document.querySelectorAll('.btn-rebuy');
        rebuyButtons.forEach(button => {
            button.addEventListener('click', () => {
                const orderId = button.getAttribute('data-order-id');
                this.rebuyOrder(orderId);
            });
        });

        // Sự kiện nút Đánh giá
        const reviewButtons = document.querySelectorAll('.btn-review');
        reviewButtons.forEach(button => {
            button.addEventListener('click', () => {
                const orderId = button.getAttribute('data-order-id');
                // Chuyển đến trang đánh giá sản phẩm
                window.location.href = `/client/reviews.html?orderId=${orderId}`;
            });
        });

        // Sự kiện nút Theo dõi đơn
        const trackButtons = document.querySelectorAll('.btn-track');
        trackButtons.forEach(button => {
            button.addEventListener('click', () => {
                const orderId = button.getAttribute('data-order-id');
                this.trackOrder(orderId);
            });
        });
        
        // Sự kiện nút Hủy đơn
        const cancelButtons = document.querySelectorAll('.btn-cancel');
        cancelButtons.forEach(button => {
            button.addEventListener('click', () => {
                const orderId = button.getAttribute('data-order-id');
                this.showCancelOrderDialog(orderId);
            });
        });
    }

    /**
     * Hiển thị dialog chi tiết đơn hàng
     * @param {string} orderId ID của đơn hàng
     */
    async showOrderDetail(orderId) {
        try {
            // Hiển thị loading dialog
            const loadingDialog = new DialogComponent({
                title: 'Đang tải...',
                content: '<div class="text-center my-3"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>',
                closeButton: false,
                buttons: []
            });
            loadingDialog.show();

            // Gọi API để lấy chi tiết đơn hàng
            const response = await this.orderService.getOrderDetail(orderId);

            // Đóng loading dialog
            loadingDialog.hide();

            if (response.success) {
                const order = response.order;

                // Tạo nội dung chi tiết đơn hàng
                let content = `
                    <div class="order-detail">
                        <div class="order-detail-header mb-3">
                            <div class="d-flex justify-content-between align-items-center">
                                <h5 class="m-0">Thông tin đơn hàng #${order.orderCode}</h5>
                                <span class="status-badge ${order.status}">${order.statusText}</span>
                            </div>
                            <div class="text-muted mt-2">Ngày đặt: ${order.orderDate}</div>
                        </div>
                        
                        <div class="order-detail-section mb-3">
                            <h6 class="section-title">Thông tin người nhận</h6>
                            <div class="row">
                                <div class="col-md-6">
                                    <p><strong>Họ tên:</strong> ${order.shippingInfo.receiverName}</p>
                                    <p><strong>Số điện thoại:</strong> ${order.shippingInfo.receiverPhone}</p>
                                </div>
                                <div class="col-md-6">
                                    <p><strong>Địa chỉ:</strong> ${order.shippingInfo.address}</p>
                                    <p><strong>Khu vực:</strong> ${order.shippingInfo.district}, ${order.shippingInfo.city}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="order-detail-section mb-3">
                            <h6 class="section-title">Thông tin thanh toán & vận chuyển</h6>
                            <div class="row">
                                <div class="col-md-6">
                                    <p><strong>Phương thức thanh toán:</strong> ${order.paymentMethod}</p>
                                </div>
                                <div class="col-md-6">
                                    <p><strong>Phương thức vận chuyển:</strong> ${order.shippingCarrier || 'Giao hàng tiêu chuẩn'}</p>
                                    ${order.trackingNumber ? `<p><strong>Mã vận đơn:</strong> ${order.trackingNumber}</p>` : ''}
                                </div>
                            </div>
                        </div>
                        
                        <div class="order-detail-section mb-3">
                            <h6 class="section-title">Sản phẩm</h6>
                            <div class="table-responsive">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th style="width: 50%">Sản phẩm</th>
                                            <th class="text-center">Giá</th>
                                            <th class="text-center">Số lượng</th>
                                            <th class="text-end">Thành tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                `;

                // Thêm từng sản phẩm
                order.products.forEach(product => {
                    content += `
                        <tr>
                            <td>
                                <div class="d-flex align-items-center">
                                    <div class="product-image me-2" style="width: 60px; height: 60px;">
                                        <img src="${product.image}" alt="${product.title}" style="max-width: 100%; max-height: 100%;">
                                    </div>
                                    <div>
                                        <div class="product-title">${product.title}</div>
                                        <div class="text-muted small">Phiên bản: ${product.variant}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="text-center">${this.formatCurrency(product.unitPrice)}</td>
                            <td class="text-center">${product.quantity}</td>
                            <td class="text-end">${this.formatCurrency(product.price)}</td>
                        </tr>
                    `;
                });

                // Tổng tiền, phí vận chuyển, giảm giá và thành tiền
                content += `
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colspan="3" class="text-end">Tạm tính:</td>
                                            <td class="text-end">${this.formatCurrency(order.subtotal)}</td>
                                        </tr>
                                        <tr>
                                            <td colspan="3" class="text-end">Phí vận chuyển:</td>
                                            <td class="text-end">${this.formatCurrency(order.shippingFee)}</td>
                                        </tr>
                                        <tr>
                                            <td colspan="3" class="text-end">Giảm giá:</td>
                                            <td class="text-end">-${this.formatCurrency(order.discount)}</td>
                                        </tr>
                                        <tr>
                                            <td colspan="3" class="text-end"><strong>Tổng cộng:</strong></td>
                                            <td class="text-end"><strong>${this.formatCurrency(order.totalAmount)}</strong></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                `;

                // Hiển thị thông tin timeline nếu có
                if (order.timeline && order.timeline.length > 0) {
                    content += `
                        <div class="order-detail-section">
                            <h6 class="section-title">Lịch sử đơn hàng</h6>
                            <div class="timeline">
                    `;

                    // Thêm lịch sử trạng thái đơn hàng
                    order.timeline.forEach((item, index) => {
                        const formattedTime = new Date(item.time).toLocaleString('vi-VN');

                        content += `
                            <div class="timeline-item">
                                <div class="timeline-icon ${item.status}">
                                    <i class="fas ${this.getStatusIcon(item.status)}"></i>
                                </div>
                                <div class="timeline-content">
                                    <div class="timeline-time">${formattedTime}</div>
                                    <div class="timeline-title">${item.description}</div>
                                </div>
                            </div>
                        `;

                        // Thêm đường nối giữa các mốc thời gian, trừ mốc cuối cùng
                        if (index < order.timeline.length - 1) {
                            content += '<div class="timeline-line"></div>';
                        }
                    });

                    content += `
                            </div>
                        </div>
                    `;
                }

                // Nếu đơn đã hủy, hiển thị lý do hủy
                if (order.status === 'cancelled' && order.cancelReason) {
                    content += `
                        <div class="alert alert-danger mt-3">
                            <strong>Lý do hủy:</strong> ${order.cancelReason}
                        </div>
                    `;
                }

                content += `</div>`;

                // Tạo các nút hành động cho dialog
                const buttons = [];

                // Nút đóng luôn hiển thị
                buttons.push({
                    text: 'Đóng',
                    class: 'btn-secondary',
                    dismiss: true
                });

                // Nút mua lại nếu đơn đã giao hoặc đã hủy
                if (order.status === 'delivered' || order.status === 'cancelled') {
                    buttons.push({
                        text: 'Mua lại',
                        class: 'btn-primary',
                        id: 'btn-detail-rebuy',
                        onClick: () => this.rebuyOrder(orderId)
                    });
                }

                // Hiển thị dialog chi tiết đơn hàng
                const detailDialog = new DialogComponent({
                    title: 'Chi tiết đơn hàng',
                    content: content,
                    buttons: buttons,
                    size: 'modal-lg'
                });

                detailDialog.show();

                // Thêm CSS cho timeline
                this.addTimelineStyles();
            } else {
                showToast(response.message, 'error');
            }
        } catch (error) {
            console.error('Lỗi khi hiển thị chi tiết đơn hàng:', error);
            showToast('Có lỗi xảy ra khi tải chi tiết đơn hàng', 'error');
        }
    }

    /**
     * Thêm CSS cho timeline
     */
    // addTimelineStyles() {
    //     const styleId = 'timeline-styles';

    //     // Kiểm tra xem đã thêm style chưa
    //     if (!document.getElementById(styleId)) {
    //         const style = document.createElement('style');
    //         style.id = styleId;
    //         style.textContent = `
    //             .timeline {
    //                 position: relative;
    //                 padding: 20px 0;
    //             }
                
    //             .timeline-item {
    //                 display: flex;
    //                 align-items: flex-start;
    //                 position: relative;
    //                 margin-bottom: 15px;
    //             }
                
    //             .timeline-icon {
    //                 width: 32px;
    //                 height: 32px;
    //                 border-radius: 50%;
    //                 background-color: #e9ecef;
    //                 display: flex;
    //                 align-items: center;
    //                 justify-content: center;
    //                 z-index: 2;
    //                 margin-right: 15px;
    //             }
                
    //             .timeline-icon.pending, .timeline-icon.waiting_payment {
    //                 background-color: #ffc107;
    //                 color: #fff;
    //             }
                
    //             .timeline-icon.processing {
    //                 background-color: #0dcaf0;
    //                 color: #fff;
    //             }
                
    //             .timeline-icon.shipping {
    //                 background-color: #0d6efd;
    //                 color: #fff;
    //             }
                
    //             .timeline-icon.delivered {
    //                 background-color: #198754;
    //                 color: #fff;
    //             }
                
    //             .timeline-icon.cancelled, .timeline-icon.payment_failed {
    //                 background-color: #dc3545;
    //                 color: #fff;
    //             }
                
    //             .timeline-content {
    //                 flex: 1;
    //             }
                
    //             .timeline-time {
    //                 font-size: 12px;
    //                 color: #6c757d;
    //                 margin-bottom: 5px;
    //             }
                
    //             .timeline-title {
    //                 font-weight: 500;
    //             }
                
    //             .timeline-line {
    //                 position: absolute;
    //                 left: 16px;
    //                 height: 25px;
    //                 width: 2px;
    //                 background-color: #e9ecef;
    //                 z-index: 1;
    //             }
                
    //             .order-detail-section {
    //                 margin-bottom: 20px;
    //                 border-bottom: 1px solid #e9ecef;
    //                 padding-bottom: 20px;
    //             }
                
    //             .order-detail-section:last-child {
    //                 border-bottom: none;
    //                 margin-bottom: 0;
    //                 padding-bottom: 0;
    //             }
                
    //             .section-title {
    //                 margin-bottom: 15px;
    //                 font-weight: 600;
    //                 color: #495057;
    //             }
    //         `;

    //         document.head.appendChild(style);
    //     }
    // }

    /**
     * Lấy icon cho trạng thái đơn hàng
     * @param {string} status Trạng thái đơn hàng
     * @returns {string} Class của icon
     */
    getStatusIcon(status) {
        switch (status) {
            case 'pending':
            case 'waiting_payment':
                return 'fa-clock';
            case 'processing':
                return 'fa-cog';
            case 'shipping':
                return 'fa-truck';
            case 'delivered':
                return 'fa-check-circle';
            case 'cancelled':
            case 'payment_failed':
                return 'fa-times-circle';
            case 'refunded':
                return 'fa-undo';
            default:
                return 'fa-circle';
        }
    }

    /**
     * Mua lại đơn hàng
     * @param {string} orderId ID của đơn hàng
     */
    async rebuyOrder(orderId) {
        try {
            // Hiển thị loading
            const loadingDialog = new DialogComponent({
                title: 'Đang xử lý...',
                content: '<div class="text-center my-3"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>',
                closeButton: false,
                buttons: []
            });
            loadingDialog.show();

            // Gọi API để mua lại đơn hàng
            const response = await this.orderService.rebuyOrder(orderId);

            // Đóng loading dialog
            loadingDialog.hide();

            if (response.success) {
                showToast(response.message, 'success');

                // Redirect đến trang giỏ hàng nếu cần
                if (response.redirectToCart) {
                    setTimeout(() => {
                        window.location.href = '/client/cart.html';
                    }, 1500);
                }
            } else {
                showToast(response.message, 'error');
            }
        } catch (error) {
            console.error('Lỗi khi mua lại đơn hàng:', error);
            showToast('Có lỗi xảy ra khi mua lại đơn hàng', 'error');
        }
    }

    /**
     * Theo dõi đơn hàng
     * @param {string} orderId ID của đơn hàng
     */
    async trackOrder(orderId) {
        // Hiển thị dialog chi tiết đơn hàng với tab theo dõi được chọn
        await this.showOrderDetail(orderId);
    }

    /**
     * Hiển thị dialog xác nhận hủy đơn hàng
     * @param {string} orderId ID của đơn hàng
     */
    showCancelOrderDialog(orderId) {
        // Tạo dialog hủy đơn hàng
        const content = `
           <div class="cancel-order-form">
               <p>Bạn có chắc chắn muốn hủy đơn hàng này không?</p>
               <p class="text-danger">Lưu ý: Hành động này không thể hoàn tác.</p>
               
               <div class="form-group mt-3">
                   <label for="cancelReason" class="form-label">Lý do hủy đơn</label>
                   <select class="form-select" id="cancelReason">
                       <option value="Tôi muốn thay đổi địa chỉ giao hàng">Tôi muốn thay đổi địa chỉ giao hàng</option>
                       <option value="Tôi muốn thay đổi phương thức thanh toán">Tôi muốn thay đổi phương thức thanh toán</option>
                       <option value="Tôi muốn thay đổi sản phẩm">Tôi muốn thay đổi sản phẩm</option>
                       <option value="Tôi không muốn mua nữa">Tôi không muốn mua nữa</option>
                       <option value="Thời gian giao hàng quá lâu">Thời gian giao hàng quá lâu</option>
                       <option value="Khác">Khác</option>
                   </select>
               </div>
               
               <div id="otherReasonGroup" class="form-group mt-3" style="display: none;">
                   <label for="otherReason" class="form-label">Lý do khác</label>
                   <textarea class="form-control" id="otherReason" rows="3" placeholder="Nhập lý do hủy đơn..."></textarea>
               </div>
           </div>
       `;

        const dialog = new DialogComponent({
            title: 'Hủy đơn hàng',
            content: content,
            buttons: [
                {
                    text: 'Không',
                    class: 'btn-secondary',
                    dismiss: true
                },
                {
                    text: 'Hủy đơn',
                    class: 'btn-danger',
                    id: 'btn-confirm-cancel',
                    onClick: () => this.cancelOrder(orderId)
                }
            ]
        });

        dialog.show();

        // Thêm sự kiện cho select lý do
        const cancelReasonSelect = document.getElementById('cancelReason');
        const otherReasonGroup = document.getElementById('otherReasonGroup');

        if (cancelReasonSelect && otherReasonGroup) {
            cancelReasonSelect.addEventListener('change', () => {
                if (cancelReasonSelect.value === 'Khác') {
                    otherReasonGroup.style.display = 'block';
                } else {
                    otherReasonGroup.style.display = 'none';
                }
            });
        }
    }

    /**
     * Hủy đơn hàng
     * @param {string} orderId ID của đơn hàng
     */
    async cancelOrder(orderId) {
        // Lấy lý do hủy đơn
        const cancelReasonSelect = document.getElementById('cancelReason');
        const otherReasonTextarea = document.getElementById('otherReason');

        if (!cancelReasonSelect) {
            showToast('Vui lòng chọn lý do hủy đơn', 'error');
            return;
        }

        let reason = cancelReasonSelect.value;

        // Nếu chọn lý do khác, lấy giá trị từ textarea
        if (reason === 'Khác' && otherReasonTextarea) {
            const otherReason = otherReasonTextarea.value.trim();

            if (!otherReason) {
                showToast('Vui lòng nhập lý do hủy đơn', 'error');
                return;
            }

            reason = otherReason;
        }

        try {
            // Hiển thị loading
            const loadingDialog = new DialogComponent({
                title: 'Đang xử lý...',
                content: '<div class="text-center my-3"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>',
                closeButton: false,
                buttons: []
            });
            loadingDialog.show();

            // Gọi API để hủy đơn hàng
            const response = await this.orderService.cancelOrder(orderId, reason);

            // Đóng loading dialog
            loadingDialog.hide();

            if (response.success) {
                showToast(response.message, 'success');

                // Tải lại danh sách đơn hàng
                this.loadOrders();
            } else {
                showToast(response.message, 'error');
            }
        } catch (error) {
            console.error('Lỗi khi hủy đơn hàng:', error);
            showToast('Có lỗi xảy ra khi hủy đơn hàng', 'error');
        }
    }
}