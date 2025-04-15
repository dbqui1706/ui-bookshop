import { Order } from '../../models/order.js';
import { orderService } from '../../services/orderService.js';
import { EventBus } from '../../core/eventBus.js';
import { formatDate, showNotification, showConfirmDialog } from '../../core/utils.js';
import { getToken } from '../../core/storage.js';

/**
 * Class OrderComponent - Component xử lý hiển thị và tương tác với danh sách đơn hàng
 */
export class OrderComponent {
    /**
     * Khởi tạo component
     * @param {HTMLElement} container - Element container chứa component
     */
    constructor(container) {
        this.container = container;
        this.dataTable = null;
        this.currentOrderId = null;

        // Lấy service
        this.orderService = orderService.getInstance();
        this.eventBus = EventBus.getInstance();

        // Khởi tạo các modal
        this.orderDetailModal = null;
        this.updateStatusModal = null;
        this.createOrderModal = null;
        this.addProductModal = null;

        // Tham chiếu đến các filter element
        this.filterForm = null;
        this.searchInput = null;
        this.statusFilter = null;
        this.fromDateFilter = null;
        this.toDateFilter = null;
        this.paymentMethodFilter = null;

        // Khởi tạo component
        this.initialize();
    }

    /**
     * Khởi tạo component
     */
    async initialize() {
        try {
            // Khởi tạo các tham chiếu đến elements
            this.initElements();

            // Khởi tạo DataTable
            this.initDataTable();

            // Khởi tạo modals
            this.initModals();

            // Đăng ký sự kiện
            this.registerEventListeners();

            // Tải thống kê đơn hàng
            await this.loadOrderStatistics();
        } catch (error) {
            console.error('Error initializing OrderComponent:', error);
            showNotification('error', 'Lỗi', 'Không thể khởi tạo dữ liệu đơn hàng.');
        }
    }

    /**
     * Khởi tạo tham chiếu đến các elements
     */
    initElements() {
        // Các element filter
        this.filterForm = document.getElementById('orderFilterForm');
        this.searchInput = document.getElementById('searchOrder');
        this.statusFilter = document.getElementById('orderStatus');
        this.fromDateFilter = document.getElementById('fromDate');
        this.toDateFilter = document.getElementById('toDate');
        this.paymentMethodFilter = document.getElementById('paymentMethod');

        // Các element thống kê
        this.totalOrdersElement = document.getElementById('totalOrders');
        this.pendingOrdersElement = document.getElementById('pendingOrders');
        this.shippingOrdersElement = document.getElementById('shippingOrders');
        this.monthlyRevenueElement = document.getElementById('monthlyRevenue');
    }

    /**
     * Hiển thị hoặc ẩn trạng thái loading
     * @param {boolean} show - Hiển thị hoặc ẩn
     */
    showLoading(show) {
        // Tìm hoặc tạo container loading
        let loadingElement = this.container.querySelector('.loading-overlay');

        if (show) {
            if (!loadingElement) {
                loadingElement = document.createElement('div');
                loadingElement.className = 'loading-overlay position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center';
                loadingElement.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
                loadingElement.style.zIndex = '1050'; // Cao hơn DataTable
                loadingElement.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Đang tải...</span></div>';
                this.container.style.position = 'relative';
                this.container.appendChild(loadingElement);
            }
        } else {
            if (loadingElement) {
                loadingElement.remove();
            }
        }
    }

    /**
     * Khởi tạo DataTable
     */
    initDataTable() {
        const self = this;

        // Hủy DataTable cũ nếu đã tồn tại
        if (this.dataTable) {
            this.dataTable.destroy();
        }

        // Khởi tạo DataTable
        this.dataTable = new DataTable('#ordersTable', {
            processing: true,
            serverSide: true,
            ajax: {
                url: 'http://localhost:8080/api/admin/orders',
                type: 'GET',
                data: function (d) {
                    // Thêm các tham số filter
                    d.search = self.searchInput.value;
                    d.status = self.statusFilter.value;
                    d.fromDate = self.fromDateFilter.value;
                    d.toDate = self.toDateFilter.value;
                    d.paymentMethod = self.paymentMethodFilter.value;
                    return d;
                },
                error: (xhr, error, thrown) => {
                    console.error('DataTable AJAX error:', error, thrown);
                    showNotification('error', 'Lỗi dữ liệu', 'Không thể tải dữ liệu từ server.');
                },
                beforeSend: (xhr) => {
                    const token = getToken();
                    if (!token) {
                        showNotification('error', 'Lỗi xác thực', 'Vui lòng đăng nhập lại!');
                        return;
                    }
                    xhr.setRequestHeader('Authorization', 'Bearer ' + getToken());
                },
            },
            columns: [
                {
                    data: null,
                    render: function (data) {
                        return `
                            <div class="form-check" style="max-width: 20px;">
                                <input class="form-check-input order-checkbox" type="checkbox" value="${data.id}">
                            </div>
                        `;
                    },
                    orderable: false,
                    className: 'select-checkbox'
                },
                {
                    data: 'orderCode',
                    render: function (data, type, row) {
                        return `<span class="fw-medium">#${data}</span>`;
                    }
                },
                {
                    data: null,
                    render: function (data) {
                        return `
                            <div class="d-flex align-items-center">
                                <div>
                                    <div class="fw-medium">${data.userName}</div>
                                    <div class="small text-muted">${data.userPhone}</div>
                                </div>
                            </div>
                        `;
                    }
                },
                {
                    data: null,
                    render: function (data) {
                        const itemCount = data.items.length;
                        const firstItem = data.items[0] ? data.items[0].productName : '';
                        return `
                            <span class="d-inline-block text-truncate" style="max-width: 100px;">
                                ${firstItem}${itemCount > 1 ? '...' : ''}
                            </span>
                            <span class="badge bg-secondary">${itemCount} sản phẩm</span>
                        `;
                    }
                },
                {
                    data: 'totalAmount',
                    className: 'text-end',
                    render: function (data) {
                        return `<span class="fw-medium">${self.formatCurrency(data)}</span>`;
                    }
                },
                {
                    data: null,
                    render: function (data) {
                        const statusClass = data.paymentStatus === 'completed' ? 'bg-success' :
                            data.paymentStatus === 'failed' ? 'bg-danger' : 'bg-warning text-dark';
                        const statusText = data.paymentStatus === 'completed' ? 'Đã thanh toán' :
                            data.paymentStatus === 'failed' ? 'Thanh toán lỗi' : 'Chưa thanh toán';
                        return `
                            <span class="badge ${statusClass}">${statusText}</span>
                            <div class="small text-muted">${data.paymentMethodName}</div>
                        `;
                    }
                },
                {
                    data: 'status',
                    render: function (data) {
                        const statusClasses = {
                            'pending': 'bg-pending',
                            'waiting_payment': 'bg-warning text-dark',
                            'payment_failed': 'bg-danger',
                            'processing': 'bg-processing',
                            'shipping': 'bg-shipped',
                            'delivered': 'bg-delivered',
                            'cancelled': 'bg-cancelled',
                            'refunded': 'bg-returned'
                        };

                        const statusTexts = {
                            'pending': 'Chờ xử lý',
                            'waiting_payment': 'Chờ thanh toán',
                            'payment_failed': 'Thanh toán lỗi',
                            'processing': 'Đang xử lý',
                            'shipping': 'Đang giao',
                            'delivered': 'Đã giao',
                            'cancelled': 'Đã hủy',
                            'refunded': 'Đã hoàn tiền'
                        };

                        return `<span class="badge ${statusClasses[data] || 'bg-secondary'}">${statusTexts[data] || data}</span>`;
                    }
                },
                {
                    data: 'createdAt',
                    render: function (data) {
                        const date = new Date(data);
                        return `
                            <div>${formatDate(date)}</div>
                        `;
                    }
                },
                {
                    data: null,
                    orderable: false,
                    className: 'text-end',
                    render: function (data) {
                        console.log(data)
                        // Nếu đơn hàng đã hoàn tất hoặc đã hủy, không hiển thị nút cập nhật
                        const updateButton = ['delivered', 'cancelled', 'refunded'].includes(data.status) ?
                            '' :
                            `<button type="button" class="btn btn-sm btn-outline-success btn-action update-status" data-id="${data.orderCode}" data-bs-toggle="tooltip" title="Cập nhật trạng thái">
                                <i class="bi bi-arrow-right"></i>
                            </button>`;

                        return `
                            <div class="btn-group">
                                <button type="button" class="btn btn-sm btn-outline-primary btn-action view-order" data-id="${data.orderCode}" data-bs-toggle="tooltip" title="Xem chi tiết">
                                    <i class="bi bi-eye"></i>
                                </button>
                                ${updateButton}
                                <button type="button" class="btn btn-sm btn-outline-info btn-action print-order" data-id="${data.orderCode}" data-bs-toggle="tooltip" title="In đơn hàng">
                                    <i class="bi bi-printer"></i>
                                </button>
                            </div>
                        `;
                    }
                }
            ],
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/vi.json',
            },
            // Cấu hình thêm cho DataTable
            order: [[7, 'desc']], // Sắp xếp mặc định theo ngày tạo giảm dần
            pageLength: 10,
            lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "Tất cả"]],
            select: {
                style: 'multi',
                selector: 'td:first-child .order-checkbox'
            },
            responsive: true,
            autoWidth: false,
            drawCallback: function () {
                // Khởi tạo tooltips
                const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
                tooltipTriggerList.map(function (tooltipTriggerEl) {
                    return new bootstrap.Tooltip(tooltipTriggerEl);
                });
            }
        });
    }

    /**
     * Xử lý dữ liệu cho DataTable (giả lập server-side processing)
     * @param {Array} data - Dữ liệu gốc
     * @returns {Array} - Dữ liệu đã xử lý
     */
    processDataTableData(data) {
        return data;
    }

    /**
     * Khởi tạo các modal
     */
    initModals() {
        // Modal chi tiết đơn hàng
        const orderDetailModalElement = document.getElementById('viewOrderModal');
        if (orderDetailModalElement) {
            this.orderDetailModal = new bootstrap.Modal(orderDetailModalElement);
        }

        // Modal cập nhật trạng thái
        const updateStatusModalElement = document.getElementById('updateStatusModal');
        if (updateStatusModalElement) {
            this.updateStatusModal = new bootstrap.Modal(updateStatusModalElement);
        }

        // Modal tạo đơn hàng mới
        const createOrderModalElement = document.getElementById('createOrderModal');
        if (createOrderModalElement) {
            this.createOrderModal = new bootstrap.Modal(createOrderModalElement);
        }

        // Modal thêm sản phẩm
        const addProductModalElement = document.getElementById('addProductModal');
        if (addProductModalElement) {
            this.addProductModal = new bootstrap.Modal(addProductModalElement);
        }
    }
    /**
     * Đăng ký các event listeners 
     */
    registerEventListeners() {
        // Xử lý sự kiện filter
        const btnFilter = document.getElementById('btnFilter'); 
        if (btnFilter) {
            btnFilter.addEventListener('click', () => this.applyFilter());
        }

        // Xử lý sự kiện làm mới
        const btnRefreshOrders = document.getElementById('btnRefreshOrders');
        if (btnRefreshOrders) {
            btnRefreshOrders.addEventListener('click', () => this.refreshOrders());
        }

        // Xử lý sự kiện checkbox "Chọn tất cả"
        const checkAll = document.getElementById('checkAll');
        if (checkAll) {
            checkAll.addEventListener('change', (e) => this.toggleSelectAll(e.target.checked));
        }

        // Xử lý sự kiện xem chi tiết đơn hàng
        document.querySelector('#ordersTable tbody').addEventListener('click', (e) => {
            const viewButton = e.target.closest('.view-order');
            if (viewButton) {
                const orderId = viewButton.getAttribute('data-id');
                window.location.href = `/app/public/order-detail.html?code=${orderId}`
            }

            const updateButton = e.target.closest('.update-status');
            if (updateButton) {
                const orderId = updateButton.getAttribute('data-id');
                this.openUpdateStatusModal(orderId);
            }

            const printButton = e.target.closest('.print-order');
            if (printButton) {
                const orderId = printButton.getAttribute('data-id');
                this.printOrder(orderId);
            }
        });

        // Xử lý sự kiện xác nhận cập nhật trạng thái
        const btnConfirmUpdateStatus = document.getElementById('confirmUpdateStatus');
        if (btnConfirmUpdateStatus) {
            btnConfirmUpdateStatus.addEventListener('click', () => this.updateOrderStatus());
        }

        // Xử lý sự kiện tạo đơn hàng mới
        const btnCreateOrder = document.getElementById('btnCreateOrder');
        if (btnCreateOrder) {
            btnCreateOrder.addEventListener('click', () => this.openCreateOrderModal());
        }

        // Xử lý sự kiện thêm sản phẩm trong modal tạo đơn hàng
        const btnAddProduct = document.getElementById('addProduct');
        if (btnAddProduct) {
            btnAddProduct.addEventListener('click', () => this.openAddProductModal());
        }

        // Xử lý sự kiện lưu đơn hàng
        const btnSaveOrder = document.getElementById('saveOrder');
        if (btnSaveOrder) {
            btnSaveOrder.addEventListener('click', () => this.saveOrder());
        }

        // Xử lý sự kiện tìm kiếm khách hàng
        const btnSearchCustomer = document.getElementById('searchCustomerBtn');
        if (btnSearchCustomer) {
            btnSearchCustomer.addEventListener('click', () => this.searchCustomer());
        }

        // Xử lý sự kiện tìm kiếm sản phẩm
        const btnSearchProduct = document.getElementById('searchProductBtn');
        if (btnSearchProduct) {
            btnSearchProduct.addEventListener('click', () => this.searchProduct());
        }

        // Xử lý sự kiện xuất Excel
        const btnExportExcel = document.querySelector('button[data-action="export-excel"]');
        if (btnExportExcel) {
            btnExportExcel.addEventListener('click', () => this.exportToExcel());
        }

        // Xử lý sự kiện in hàng loạt
        const btnBulkPrint = document.getElementById('btnBulkPrint');
        if (btnBulkPrint) {
            btnBulkPrint.addEventListener('click', () => this.bulkPrintOrders());
        }

        // Xử lý sự kiện xuất Excel hàng loạt
        const btnBulkExport = document.getElementById('btnBulkExport');
        if (btnBulkExport) {
            btnBulkExport.addEventListener('click', () => this.bulkExportOrders());
        }

        // Xử lý sự kiện hủy đơn hàng hàng loạt
        const btnBulkCancel = document.getElementById('btnBulkCancel');
        if (btnBulkCancel) {
            btnBulkCancel.addEventListener('click', () => this.bulkCancelOrders());
        }

        // Xử lý sự kiện nút chuyển trạng thái trong modal chi tiết
        const btnNextStatus = document.getElementById('btnNextStatus');
        if (btnNextStatus) {
            btnNextStatus.addEventListener('click', () => {
                const orderId = btnNextStatus.getAttribute('data-id');
                this.openUpdateStatusModal(orderId);
            });
        }

        // Xử lý sự kiện nút in trong modal chi tiết
        const btnPrintOrder = document.getElementById('btnPrintOrder');
        if (btnPrintOrder) {
            btnPrintOrder.addEventListener('click', () => {
                const orderId = btnPrintOrder.getAttribute('data-id');
                this.printOrder(orderId);
            });
        }

        // Đăng ký theo dõi các sự kiện từ EventBus
        this.eventBus.subscribe('order:created', () => this.refreshOrders());
        this.eventBus.subscribe('order:updated', () => this.refreshOrders());
        this.eventBus.subscribe('order:statusUpdated', () => this.refreshOrders());
        this.eventBus.subscribe('order:deleted', () => this.refreshOrders());
    }

    /**
     * Tải thống kê đơn hàng
     */
    async loadOrderStatistics() {
        try {
            this.showLoading(true);

            const statistics = await this.orderService.getOrderStatistics();

            this.showLoading(false);

            // Cập nhật UI
            if (this.totalOrdersElement) {
                this.totalOrdersElement.textContent = statistics.total;
            }

            if (this.pendingOrdersElement) {
                this.pendingOrdersElement.textContent = statistics.pending;
            }

            if (this.shippingOrdersElement) {
                this.shippingOrdersElement.textContent = statistics.shipping;
            }

            if (this.monthlyRevenueElement) {
                this.monthlyRevenueElement.textContent = `${(statistics.monthlyRevenue / 1000000).toFixed(1)} Tr`;
            }
        } catch (error) {
            this.showLoading(false);
            console.error('Error loading order statistics:', error);
            showNotification('error', 'Lỗi', 'Không thể tải thống kê đơn hàng.');
        }
    }

    /**
     * Áp dụng bộ lọc
     */
    applyFilter() {
        // Refresh DataTable để áp dụng bộ lọc mới
        if (this.dataTable) {
            this.dataTable.ajax.reload();
        }
    }

    /**
     * Làm mới danh sách đơn hàng
     */
    refreshOrders() {
        // Refresh DataTable
        if (this.dataTable) {
            this.dataTable.ajax.reload();
        }

        // Refresh thống kê
        this.loadOrderStatistics();
    }

    /**
     * Chọn/bỏ chọn tất cả đơn hàng
     * @param {boolean} checked - Trạng thái checked
     */
    toggleSelectAll(checked) {
        const checkboxes = document.querySelectorAll('.order-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = checked;
        });
    }

    /**
     * Mở modal chi tiết đơn hàng
     * @param {number} orderId - ID của đơn hàng
     */
    async openOrderDetailModal(orderId) {
        try {
            this.showLoading(true);

            const order = await this.orderService.getOrderById(orderId);

            this.showLoading(false);

            if (order) {
                this.currentOrderId = order.id;

                // Cập nhật tiêu đề modal
                const modalLabel = document.getElementById('viewOrderModalLabel');
                if (modalLabel) {
                    modalLabel.textContent = `Chi tiết đơn hàng #${order.orderCode}`;
                }

                // Cập nhật thông tin khách hàng
                const customerInfo = document.querySelector('#viewOrderModal .card-body:nth-of-type(1)');
                if (customerInfo) {
                    customerInfo.innerHTML = `
                    <h6 class="card-title d-flex align-items-center mb-3">
                        <i class="bi bi-person me-2"></i> Thông tin khách hàng
                    </h6>
                    <p class="mb-1"><strong>Khách hàng:</strong> ${order.userName}</p>
                    <p class="mb-1"><strong>Số điện thoại:</strong> ${order.userPhone}</p>
                    <p class="mb-1"><strong>Email:</strong> ${order.userEmail}</p>
                    <p class="mb-0"><strong>Địa chỉ giao hàng:</strong> ${order.shipping.address || 'Không có'}</p>
                `;
                }

                // Cập nhật thông tin đơn hàng
                const orderInfo = document.querySelector('#viewOrderModal .card-body:nth-of-type(2)');
                if (orderInfo) {
                    orderInfo.innerHTML = `
                    <h6 class="card-title d-flex align-items-center mb-3">
                        <i class="bi bi-receipt me-2"></i> Thông tin đơn hàng
                    </h6>
                    <p class="mb-1"><strong>Mã đơn hàng:</strong> #${order.orderCode}</p>
                    <p class="mb-1"><strong>Ngày đặt:</strong> ${formatDate(order.createdAt)}</p>
                    <p class="mb-1"><strong>Trạng thái:</strong> <span class="badge ${this.getStatusClass(order.status)}">${order.getStatusText()}</span></p>
                    <p class="mb-1">
                        <strong>Thanh toán:</strong>
                        <span class="badge ${this.getPaymentStatusClass(order.paymentStatus)}">${order.getPaymentStatusText()}</span>
                        <small>(${order.paymentMethodName})</small>
                    </p>
                    <p class="mb-0"><strong>Ghi chú:</strong> ${order.note || 'Không có'}</p>
                `;
                }

                // Cập nhật danh sách sản phẩm
                const orderItemsContainer = document.querySelector('#viewOrderModal .modal-body');
                if (orderItemsContainer) {
                    // Tìm và xóa các card cũ (nếu có)
                    const oldItemCards = orderItemsContainer.querySelectorAll('.order-item-card');
                    oldItemCards.forEach(card => card.remove());

                    // Thêm các card sản phẩm mới
                    const itemsTitle = orderItemsContainer.querySelector('h6');
                    let itemsHtml = '';

                    order.items.forEach(item => {
                        itemsHtml += `
                        <div class="card order-item-card mb-3">
                            <div class="card-body">
                                <div class="row align-items-center">
                                    <div class="col-md-2 col-4 mb-2 mb-md-0">
                                        <img src="${item.productImage}" class="img-fluid rounded" alt="${item.productName}">
                                    </div>
                                    <div class="col-md-6 col-8 mb-2 mb-md-0">
                                        <h6 class="mb-0">${item.productName}</h6>
                                        <small class="text-muted">SKU: ${item.productId}</small>
                                    </div>
                                    <div class="col-md-2 col-6 text-md-center">
                                        <div class="text-muted">Số lượng</div>
                                        <div class="fw-medium">${item.quantity}</div>
                                    </div>
                                    <div class="col-md-2 col-6 text-end">
                                        <div class="text-muted">Thành tiền</div>
                                        <div class="fw-medium">${this.formatCurrency(item.subtotal)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    });

                    // Chèn HTML vào sau tiêu đề
                    if (itemsTitle) {
                        itemsTitle.insertAdjacentHTML('afterend', itemsHtml);
                    }
                }

                // Cập nhật thông tin thanh toán
                const paymentSummary = document.querySelector('#viewOrderModal .order-summary');
                if (paymentSummary) {
                    paymentSummary.innerHTML = `
                    <div class="d-flex justify-content-between mb-2">
                        <span>Tạm tính:</span>
                        <span>${this.formatCurrency(order.subtotal)}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span>Giảm giá:</span>
                        <span>-${this.formatCurrency(order.discountAmount)}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span>Phí vận chuyển:</span>
                        <span>${this.formatCurrency(order.deliveryPrice)}</span>
                    </div>
                    <hr>
                    <div class="d-flex justify-content-between fw-bold">
                        <span>Tổng cộng:</span>
                        <span class="text-primary">${this.formatCurrency(order.totalAmount)}</span>
                    </div>
                `;
                }

                // Cập nhật lịch sử đơn hàng
                // Đây chỉ là dữ liệu mẫu, trong thực tế sẽ lấy từ API
                const timeline = document.querySelector('#viewOrderModal .timeline');
                if (timeline) {
                    let timelineHtml = '';
                    const now = new Date();

                    if (order.status === 'shipping') {
                        timelineHtml += this.createTimelineItem('Đơn hàng đang giao',
                            new Date(now.setDate(now.getDate() - 1)),
                            'Đơn hàng đã được giao cho đơn vị vận chuyển');
                    }

                    if (['processing', 'shipping', 'delivered'].includes(order.status)) {
                        timelineHtml += this.createTimelineItem('Đơn hàng đang được xử lý',
                            new Date(now.setDate(now.getDate() - 1)),
                            'Đơn hàng đang được chuẩn bị để giao cho đơn vị vận chuyển');
                    }

                    // Luôn có các trạng thái cơ bản
                    timelineHtml += this.createTimelineItem('Đã xác nhận đơn hàng',
                        new Date(now.setDate(now.getDate() - 1)),
                        'Đơn hàng đã được xác nhận và đang được xử lý');

                    timelineHtml += this.createTimelineItem('Đơn hàng mới',
                        order.createdAt,
                        'Đơn hàng được tạo thành công');

                    timeline.innerHTML = timelineHtml;
                }

                // Cập nhật trạng thái các nút
                const btnNextStatus = document.getElementById('btnNextStatus');
                if (btnNextStatus) {
                    btnNextStatus.setAttribute('data-id', order.id);

                    // Ẩn nút chuyển trạng thái nếu đơn hàng đã hoàn tất hoặc đã hủy
                    btnNextStatus.style.display = ['delivered', 'cancelled', 'refunded'].includes(order.status) ? 'none' : '';
                }

                const btnPrintOrder = document.getElementById('btnPrintOrder');
                if (btnPrintOrder) {
                    btnPrintOrder.setAttribute('data-id', order.id);
                }

                // Hiển thị modal
                this.orderDetailModal.show();
            } else {
                showNotification('error', 'Lỗi', 'Không tìm thấy đơn hàng!');
            }
        } catch (error) {
            this.showLoading(false);
            console.error('Error loading order details:', error);
            showNotification('error', 'Lỗi', 'Không thể tải thông tin đơn hàng. ' + error.message);
        }
    }

    /**
     * Tạo một item cho timeline
     * @param {string} title - Tiêu đề
     * @param {Date} date - Ngày tháng
     * @param {string} content - Nội dung
     * @returns {string} - HTML của timeline item
     */
    createTimelineItem(title, date, content) {
        return `
        <div class="timeline-item">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
                <h6 class="mb-0">${title}</h6>
                <small class="text-muted">${formatDate(date)} - Nhân viên: Admin</small>
                <p class="small mt-1 mb-0">${content}</p>
            </div>
        </div>
    `;
    }

    /**
     * Mở modal cập nhật trạng thái đơn hàng
     * @param {number} orderId - ID của đơn hàng
     */
    async openUpdateStatusModal(orderId) {
        try {
            this.showLoading(true);

            const order = await this.orderService.getOrderById(orderId);

            this.showLoading(false);

            if (order) {
                this.currentOrderId = order.id;

                // Cập nhật modal
                document.getElementById('updateOrderId').value = order.id;
                document.getElementById('currentStatus').value = order.getStatusText();

                // Cập nhật các tùy chọn trạng thái mới
                const newStatusSelect = document.getElementById('newStatus');
                if (newStatusSelect) {
                    // Xóa các option cũ
                    newStatusSelect.innerHTML = '';

                    // Thêm các option mới dựa vào trạng thái hiện tại
                    const allowedTransitions = {
                        'pending': [
                            { value: 'processing', text: 'Đang xử lý' },
                            { value: 'cancelled', text: 'Hủy đơn hàng' }
                        ],
                        'waiting_payment': [
                            { value: 'processing', text: 'Đang xử lý' },
                            { value: 'payment_failed', text: 'Thanh toán thất bại' },
                            { value: 'cancelled', text: 'Hủy đơn hàng' }
                        ],
                        'payment_failed': [
                            { value: 'waiting_payment', text: 'Chờ thanh toán' },
                            { value: 'processing', text: 'Đang xử lý' },
                            { value: 'cancelled', text: 'Hủy đơn hàng' }
                        ],
                        'processing': [
                            { value: 'shipping', text: 'Đang giao hàng' },
                            { value: 'cancelled', text: 'Hủy đơn hàng' }
                        ],
                        'shipping': [
                            { value: 'delivered', text: 'Đã giao hàng' },
                            { value: 'cancelled', text: 'Hủy đơn hàng' }
                        ],
                        'delivered': [
                            { value: 'refunded', text: 'Hoàn tiền' }
                        ],
                        'cancelled': [],
                        'refunded': []
                    };

                    const options = allowedTransitions[order.status] || [];
                    options.forEach(option => {
                        const optionElement = document.createElement('option');
                        optionElement.value = option.value;
                        optionElement.textContent = option.text;
                        newStatusSelect.appendChild(optionElement);
                    });

                    // Nếu không có trạng thái nào có thể chuyển đổi
                    if (options.length === 0) {
                        newStatusSelect.innerHTML = '<option value="">Không thể chuyển trạng thái</option>';
                        document.getElementById('confirmUpdateStatus').disabled = true;
                    } else {
                        document.getElementById('confirmUpdateStatus').disabled = false;
                    }
                }

                // Reset form
                document.getElementById('statusNote').value = '';
                document.getElementById('notifyCustomer').checked = true;

                // Hiển thị modal
                this.updateStatusModal.show();
            } else {
                showNotification('error', 'Lỗi', 'Không tìm thấy đơn hàng!');
            }
        } catch (error) {
            this.showLoading(false);
            console.error('Error loading order for status update:', error);
            showNotification('error', 'Lỗi', 'Không thể tải thông tin đơn hàng. ' + error.message);
        }
    }

    /**
     * Cập nhật trạng thái đơn hàng
     */
    async updateOrderStatus() {
        try {
            const orderId = document.getElementById('updateOrderId').value;
            const newStatus = document.getElementById('newStatus').value;
            const statusNote = document.getElementById('statusNote').value;
            const notifyCustomer = document.getElementById('notifyCustomer').checked;

            if (!newStatus) {
                showNotification('warning', 'Thiếu thông tin', 'Vui lòng chọn trạng thái mới!');
                return;
            }

            this.showLoading(true);

            await this.orderService.updateOrderStatus(orderId, newStatus, statusNote);

            this.showLoading(false);

            // Đóng modal
            this.updateStatusModal.hide();

            // Hiển thị thông báo
            showNotification('success', 'Thành công', 'Cập nhật trạng thái đơn hàng thành công!');

            // Refresh danh sách đơn hàng
            this.refreshOrders();

            // Nếu đang xem chi tiết đơn hàng, cũng refresh
            if (this.orderDetailModal._isShown) {
                this.openOrderDetailModal(orderId);
            }
        } catch (error) {
            this.showLoading(false);
            console.error('Error updating order status:', error);
            showNotification('error', 'Lỗi', 'Không thể cập nhật trạng thái đơn hàng. ' + error.message);
        }
    }

    /**
     * Mở modal tạo đơn hàng mới
     */
    openCreateOrderModal() {
        try {
            // Reset form
            document.getElementById('createOrderForm').reset();

            // Xóa sản phẩm trong bảng
            const productTable = document.getElementById('productTable');
            if (productTable) {
                const tbody = productTable.querySelector('tbody');
                tbody.innerHTML = '<tr class="text-center"><td colspan="6">Chưa có sản phẩm nào</td></tr>';

                // Reset tổng tiền
                document.getElementById('subtotal').textContent = '0đ';
                document.getElementById('discount').textContent = '0đ';
                document.getElementById('shipping').textContent = '0đ';
                document.getElementById('total').textContent = '0đ';
            }

            // Đặt ngày đơn hàng là ngày hiện tại
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            document.getElementById('orderDate').value = `${year}-${month}-${day}`;

            // Hiển thị modal
            this.createOrderModal.show();
        } catch (error) {
            console.error('Error opening create order modal:', error);
            showNotification('error', 'Lỗi', 'Không thể mở form tạo đơn hàng mới.');
        }
    }

    /**
     * Mở modal thêm sản phẩm
     */
    async openAddProductModal() {
        try {
            this.showLoading(true);

            // Tải danh sách sản phẩm
            const products = await this.orderService.searchProducts('');

            this.showLoading(false);

            // Hiển thị danh sách sản phẩm
            const productSearchTable = document.getElementById('productSearchTable');
            if (productSearchTable) {
                const tbody = productSearchTable.querySelector('tbody');

                if (products.length > 0) {
                    let productsHtml = '';

                    products.forEach(product => {
                        productsHtml += `
                        <tr>
                            <td><img src="${product.image}" class="img-thumbnail" alt="${product.name}"></td>
                            <td>${product.name}</td>
                            <td>${product.sku}</td>
                            <td class="text-end">${this.formatCurrency(product.price)}</td>
                            <td class="text-center">${product.stock}</td>
                            <td class="text-center">
                                <button type="button" class="btn btn-sm btn-primary select-product" 
                                    data-id="${product.id}" 
                                    data-name="${product.name}" 
                                    data-price="${product.price}"
                                    data-image="${product.image}">
                                    <i class="bi bi-plus"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                    });

                    tbody.innerHTML = productsHtml;
                } else {
                    tbody.innerHTML = '<tr><td colspan="6" class="text-center">Không tìm thấy sản phẩm</td></tr>';
                }

                // Đăng ký sự kiện cho nút chọn sản phẩm
                productSearchTable.querySelectorAll('.select-product').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const target = e.currentTarget;
                        const productId = target.getAttribute('data-id');
                        const productName = target.getAttribute('data-name');
                        const productPrice = parseInt(target.getAttribute('data-price'));
                        const productImage = target.getAttribute('data-image');

                        this.addProductToOrder(productId, productName, productPrice, productImage);

                        // Đóng modal thêm sản phẩm
                        this.addProductModal.hide();
                    });
                });
            }

            // Reset form tìm kiếm
            document.getElementById('productSearch').value = '';

            // Hiển thị modal
            this.addProductModal.show();
        } catch (error) {
            this.showLoading(false);
            console.error('Error opening add product modal:', error);
            showNotification('error', 'Lỗi', 'Không thể tải danh sách sản phẩm.');
        }
    }

    /**
         * Thêm sản phẩm vào đơn hàng (tiếp)
         */
    addProductToOrder(id, name, price, image) {
        const productTable = document.getElementById('productTable');
        const tbody = productTable.querySelector('tbody');

        // Xóa hàng "Chưa có sản phẩm" nếu có
        if (tbody.rows.length === 1 && tbody.rows[0].cells.length === 1) {
            tbody.innerHTML = '';
        }

        // Tạo hàng mới
        const row = tbody.insertRow();

        // Số thứ tự
        const cell1 = row.insertCell(0);
        cell1.textContent = tbody.rows.length;

        // Tên sản phẩm
        const cell2 = row.insertCell(1);
        cell2.innerHTML = `
        <div class="d-flex align-items-center">
            <img src="${image}" class="img-thumbnail me-2" style="width: 40px; height: 40px;" alt="${name}">
            <div>${name}</div>
        </div>
    `;
        cell2.setAttribute('data-id', id);
        cell2.setAttribute('data-name', name);

        // Đơn giá
        const cell3 = row.insertCell(2);
        cell3.className = 'text-end';
        cell3.textContent = this.formatCurrency(price);
        cell3.setAttribute('data-price', price);

        // Số lượng
        const cell4 = row.insertCell(3);
        cell4.className = 'text-center';
        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.className = 'form-control form-control-sm quantity-input';
        quantityInput.min = 1;
        quantityInput.value = 1;
        quantityInput.setAttribute('data-price', price);
        quantityInput.addEventListener('change', () => this.updateProductTotal(quantityInput));
        cell4.appendChild(quantityInput);

        // Thành tiền
        const cell5 = row.insertCell(4);
        cell5.className = 'text-end product-total';
        cell5.textContent = this.formatCurrency(price);
        cell5.setAttribute('data-total', price);

        // Thao tác
        const cell6 = row.insertCell(5);
        cell6.className = 'text-center';
        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.className = 'btn btn-sm btn-danger';
        removeButton.innerHTML = '<i class="bi bi-trash"></i>';
        removeButton.addEventListener('click', () => {
            row.remove();
            this.updateOrderTotals();

            // Kiểm tra nếu không còn sản phẩm nào
            if (tbody.rows.length === 0) {
                const emptyRow = tbody.insertRow();
                const emptyCell = emptyRow.insertCell(0);
                emptyCell.colSpan = 6;
                emptyCell.className = 'text-center';
                emptyCell.textContent = 'Chưa có sản phẩm nào';
            } else {
                // Cập nhật lại số thứ tự
                Array.from(tbody.rows).forEach((row, index) => {
                    row.cells[0].textContent = index + 1;
                });
            }
        });
        cell6.appendChild(removeButton);

        // Cập nhật tổng tiền
        this.updateOrderTotals();
    }

    /**
     * Cập nhật thành tiền khi thay đổi số lượng
     * @param {HTMLInputElement} input - Input số lượng
     */
    updateProductTotal(input) {
        const price = parseFloat(input.getAttribute('data-price'));
        const quantity = parseInt(input.value);
        const total = price * quantity;

        const totalCell = input.closest('tr').querySelector('.product-total');
        totalCell.textContent = this.formatCurrency(total);
        totalCell.setAttribute('data-total', total);

        this.updateOrderTotals();
    }

    /**
     * Cập nhật tổng tiền đơn hàng
     */
    updateOrderTotals() {
        let subtotal = 0;
        const productTotals = document.querySelectorAll('.product-total');

        productTotals.forEach(cell => {
            const totalValue = parseFloat(cell.getAttribute('data-total'));
            if (!isNaN(totalValue)) {
                subtotal += totalValue;
            }
        });

        // Phí vận chuyển (giả định)
        const shipping = subtotal > 0 ? 30000 : 0;

        // Giảm giá (giả định 5% nếu tổng đơn > 10 triệu)
        const discount = subtotal > 10000000 ? Math.round(subtotal * 0.05) : 0;

        // Tổng cộng
        const total = subtotal - discount + shipping;

        // Cập nhật hiển thị
        document.getElementById('subtotal').textContent = this.formatCurrency(subtotal);
        document.getElementById('shipping').textContent = this.formatCurrency(shipping);
        document.getElementById('discount').textContent = this.formatCurrency(discount);
        document.getElementById('total').textContent = this.formatCurrency(total);
    }

    /**
     * Tìm kiếm sản phẩm
     */
    async searchProduct() {
        try {
            this.showLoading(true);

            const keyword = document.getElementById('productSearch').value;
            const products = await this.orderService.searchProducts(keyword);

            this.showLoading(false);

            // Hiển thị danh sách sản phẩm
            const productSearchTable = document.getElementById('productSearchTable');
            if (productSearchTable) {
                const tbody = productSearchTable.querySelector('tbody');

                if (products.length > 0) {
                    let productsHtml = '';

                    products.forEach(product => {
                        productsHtml += `
                        <tr>
                            <td><img src="${product.image}" class="img-thumbnail" alt="${product.name}"></td>
                            <td>${product.name}</td>
                            <td>${product.sku}</td>
                            <td class="text-end">${this.formatCurrency(product.price)}</td>
                            <td class="text-center">${product.stock}</td>
                            <td class="text-center">
                                <button type="button" class="btn btn-sm btn-primary select-product" 
                                    data-id="${product.id}" 
                                    data-name="${product.name}" 
                                    data-price="${product.price}"
                                    data-image="${product.image}">
                                    <i class="bi bi-plus"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                    });

                    tbody.innerHTML = productsHtml;
                } else {
                    tbody.innerHTML = '<tr><td colspan="6" class="text-center">Không tìm thấy sản phẩm</td></tr>';
                }

                // Đăng ký sự kiện cho nút chọn sản phẩm
                productSearchTable.querySelectorAll('.select-product').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const target = e.currentTarget;
                        const productId = target.getAttribute('data-id');
                        const productName = target.getAttribute('data-name');
                        const productPrice = parseInt(target.getAttribute('data-price'));
                        const productImage = target.getAttribute('data-image');

                        this.addProductToOrder(productId, productName, productPrice, productImage);

                        // Đóng modal thêm sản phẩm
                        this.addProductModal.hide();
                    });
                });
            }
        } catch (error) {
            this.showLoading(false);
            console.error('Error searching products:', error);
            showNotification('error', 'Lỗi', 'Không thể tìm kiếm sản phẩm.');
        }
    }

    /**
     * Tìm kiếm khách hàng
     */
    async searchCustomer() {
        try {
            this.showLoading(true);

            const keyword = document.getElementById('customerSearch').value;
            const customers = await this.orderService.searchCustomers(keyword);

            this.showLoading(false);

            if (customers.length > 0) {
                // Lấy khách hàng đầu tiên
                const customer = customers[0];

                // Điền thông tin khách hàng vào form
                document.getElementById('customerName').value = customer.name;
                document.getElementById('customerPhone').value = customer.phone;
                document.getElementById('customerEmail').value = customer.email;

                // Lấy địa chỉ mặc định của khách hàng
                const defaultAddress = customer.addresses.find(addr => addr.isDefault) || customer.addresses[0];
                if (defaultAddress) {
                    document.getElementById('customerAddress').value = defaultAddress.address;
                }

                showNotification('success', 'Thành công', 'Đã tìm thấy thông tin khách hàng.');
            } else {
                showNotification('warning', 'Không tìm thấy', 'Không tìm thấy thông tin khách hàng.');
            }
        } catch (error) {
            this.showLoading(false);
            console.error('Error searching customers:', error);
            showNotification('error', 'Lỗi', 'Không thể tìm kiếm khách hàng.');
        }
    }

    /**
     * Lưu đơn hàng mới
     */
    async saveOrder() {
        try {
            // Kiểm tra form
            const customerName = document.getElementById('customerName').value;
            const customerPhone = document.getElementById('customerPhone').value;
            const customerAddress = document.getElementById('customerAddress').value;

            if (!customerName || !customerPhone || !customerAddress) {
                showNotification('error', 'Lỗi!', 'Vui lòng điền đầy đủ thông tin khách hàng.');
                return;
            }

            // Kiểm tra sản phẩm
            const productRows = document.querySelectorAll('#productTable tbody tr');
            if (productRows.length === 1 && productRows[0].cells.length === 1) {
                showNotification('error', 'Lỗi!', 'Vui lòng thêm ít nhất một sản phẩm vào đơn hàng.');
                return;
            }

            this.showLoading(true);

            // Thu thập thông tin đơn hàng
            const orderDate = document.getElementById('orderDate').value;
            const orderPaymentMethod = document.getElementById('orderPaymentMethod').value;
            const orderShipping = document.getElementById('orderShipping').value;
            const orderNote = document.getElementById('orderNote').value;
            const orderStatus = document.getElementById('orderStatus').value;

            // Thu thập thông tin sản phẩm
            const items = [];
            productRows.forEach(row => {
                // Bỏ qua hàng "Chưa có sản phẩm"
                if (row.cells.length === 1) return;

                const productCell = row.cells[1];
                const productId = productCell.getAttribute('data-id');
                const productName = productCell.getAttribute('data-name');
                const price = parseFloat(row.cells[2].getAttribute('data-price'));
                const quantity = parseInt(row.querySelector('.quantity-input').value);
                const subtotal = price * quantity;

                items.push({
                    productId,
                    productName,
                    productImage: 'https://via.placeholder.com/40',
                    basePrice: price,
                    discountPercent: 0,
                    price,
                    quantity,
                    subtotal
                });
            });

            // Tính toán tổng tiền
            const subtotal = items.reduce((total, item) => total + item.subtotal, 0);
            const discount = subtotal > 10000000 ? Math.round(subtotal * 0.05) : 0;
            const shipping = subtotal > 0 ? 30000 : 0;
            const total = subtotal - discount + shipping;

            // Xác định phương thức thanh toán
            let paymentMethodId, paymentMethodName;
            switch (orderPaymentMethod) {
                case 'cod':
                    paymentMethodId = 1;
                    paymentMethodName = 'COD';
                    break;
                case 'bank_transfer':
                    paymentMethodId = 2;
                    paymentMethodName = 'Chuyển khoản';
                    break;
                case 'credit_card':
                    paymentMethodId = 3;
                    paymentMethodName = 'Thẻ tín dụng';
                    break;
                case 'momo':
                    paymentMethodId = 4;
                    paymentMethodName = 'Ví MoMo';
                    break;
                default:
                    paymentMethodId = 5;
                    paymentMethodName = 'Khác';
            }

            // Xác định phương thức vận chuyển
            let deliveryMethodId;
            switch (orderShipping) {
                case 'standard':
                    deliveryMethodId = 1;
                    break;
                case 'express':
                    deliveryMethodId = 2;
                    break;
                case 'same_day':
                    deliveryMethodId = 3;
                    break;
                default:
                    deliveryMethodId = 1;
            }

            // Tạo đối tượng đơn hàng
            const order = new Order({
                userId: 1, // User ID mặc định
                userName: customerName,
                userEmail: document.getElementById('customerEmail').value,
                userPhone: customerPhone,
                status: orderStatus,
                deliveryMethodId,
                paymentMethodId,
                paymentMethodName,
                paymentStatus: orderPaymentMethod === 'cod' ? 'pending' : 'completed',
                subtotal,
                deliveryPrice: shipping,
                discountAmount: discount,
                taxAmount: 0,
                totalAmount: total,
                note: orderNote,
                items,
                shipping: {
                    receiverName: customerName,
                    receiverPhone: customerPhone,
                    receiverEmail: document.getElementById('customerEmail').value,
                    address: customerAddress
                }
            });

            // Lưu đơn hàng
            await this.orderService.createOrder(order);

            this.showLoading(false);

            // Đóng modal
            this.createOrderModal.hide();

            // Hiển thị thông báo
            showNotification('success', 'Thành công', 'Tạo đơn hàng mới thành công!');

            // Refresh danh sách đơn hàng
            this.refreshOrders();
        } catch (error) {
            this.showLoading(false);
            console.error('Error saving order:', error);
            showNotification('error', 'Lỗi', 'Không thể tạo đơn hàng mới. ' + error.message);
        }
    }

    /**
     * In đơn hàng
     * @param {number} orderId - ID của đơn hàng
     */
    async printOrder(orderId) {
        try {
            this.showLoading(true);

            const pdfUrl = await this.orderService.printOrder(orderId);

            this.showLoading(false);

            // Trong môi trường thực tế, sẽ mở file PDF trong cửa sổ mới
            // window.open(pdfUrl, '_blank');

            // Hiển thị thông báo
            showNotification('success', 'Thành công', 'Đơn hàng đã được gửi đến máy in!', {
                timer: 2000
            });
        } catch (error) {
            this.showLoading(false);
            console.error('Error printing order:', error);
            showNotification('error', 'Lỗi', 'Không thể in đơn hàng. ' + error.message);
        }
    }

    /**
     * Xuất danh sách đơn hàng ra Excel
     */
    async exportToExcel() {
        try {
            this.showLoading(true);

            const excelUrl = await this.orderService.exportOrdersToExcel();

            this.showLoading(false);

            // Trong môi trường thực tế, sẽ tải xuống file Excel
            // window.location.href = excelUrl;

            // Hiển thị thông báo
            showNotification('success', 'Thành công', 'Danh sách đơn hàng đã được xuất ra Excel!', {
                timer: 2000
            });
        } catch (error) {
            this.showLoading(false);
            console.error('Error exporting orders to Excel:', error);
            showNotification('error', 'Lỗi', 'Không thể xuất danh sách đơn hàng. ' + error.message);
        }
    }

    /**
     * In hàng loạt đơn hàng
     */
    async bulkPrintOrders() {
        try {
            // Lấy danh sách ID đơn hàng đã chọn
            const selectedIds = [];
            document.querySelectorAll('.order-checkbox:checked').forEach(checkbox => {
                selectedIds.push(checkbox.value);
            });

            if (selectedIds.length === 0) {
                showNotification('warning', 'Thông báo', 'Vui lòng chọn ít nhất một đơn hàng!');
                return;
            }

            this.showLoading(true);

            // Giả lập thời gian xử lý
            await new Promise(resolve => setTimeout(resolve, 2000));

            this.showLoading(false);

            // Hiển thị thông báo
            showNotification('success', 'Thành công', `Đã in ${selectedIds.length} đơn hàng!`, {
                timer: 2000
            });
        } catch (error) {
            this.showLoading(false);
            console.error('Error bulk printing orders:', error);
            showNotification('error', 'Lỗi', 'Không thể in đơn hàng hàng loạt. ' + error.message);
        }
    }

    /**
     * Xuất Excel hàng loạt đơn hàng
     */
    async bulkExportOrders() {
        try {
            // Lấy danh sách ID đơn hàng đã chọn
            const selectedIds = [];
            document.querySelectorAll('.order-checkbox:checked').forEach(checkbox => {
                selectedIds.push(checkbox.value);
            });

            if (selectedIds.length === 0) {
                showNotification('warning', 'Thông báo', 'Vui lòng chọn ít nhất một đơn hàng!');
                return;
            }

            this.showLoading(true);

            const excelUrl = await this.orderService.exportOrdersToExcel(selectedIds);

            this.showLoading(false);

            // Hiển thị thông báo
            showNotification('success', 'Thành công', `Đã xuất ${selectedIds.length} đơn hàng ra Excel!`, {
                timer: 2000
            });
        } catch (error) {
            this.showLoading(false);
            console.error('Error bulk exporting orders:', error);
            showNotification('error', 'Lỗi', 'Không thể xuất Excel hàng loạt. ' + error.message);
        }
    }

    /**
     * Hủy hàng loạt đơn hàng
     */
    async bulkCancelOrders() {
        try {
            // Lấy danh sách ID đơn hàng đã chọn
            const selectedIds = [];
            document.querySelectorAll('.order-checkbox:checked').forEach(checkbox => {
                selectedIds.push(checkbox.value);
            });

            if (selectedIds.length === 0) {
                showNotification('warning', 'Thông báo', 'Vui lòng chọn ít nhất một đơn hàng!');
                return;
            }

            // Hiển thị hộp thoại xác nhận
            showConfirmDialog(
                'Xác nhận hủy đơn hàng',
                `Bạn có chắc chắn muốn hủy ${selectedIds.length} đơn hàng đã chọn?`,
                'Xác nhận',
                async () => {
                    this.showLoading(true);

                    // Trong thực tế, sẽ gọi API để hủy đơn hàng
                    // await API.put('/api/admin/orders/bulk-cancel', { ids: selectedIds });

                    // Giả lập thời gian xử lý
                    await new Promise(resolve => setTimeout(resolve, 2000));

                    this.showLoading(false);

                    // Hiển thị thông báo
                    showNotification('success', 'Thành công', `Đã hủy ${selectedIds.length} đơn hàng!`, {
                        timer: 2000
                    });

                    // Refresh danh sách đơn hàng
                    this.refreshOrders();
                }
            );
        } catch (error) {
            this.showLoading(false);
            console.error('Error bulk cancelling orders:', error);
            showNotification('error', 'Lỗi', 'Không thể hủy đơn hàng hàng loạt. ' + error.message);
        }
    }

    /**
     * Định dạng tiền tệ
     * @param {number} amount - Số tiền cần định dạng
     * @returns {string} - Chuỗi đã được định dạng
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', { style: 'decimal' }).format(amount) + 'đ';
    }

    /**
     * Lấy class CSS cho trạng thái đơn hàng
     * @param {string} status - Trạng thái đơn hàng
     * @returns {string} - Class CSS
     */
    getStatusClass(status) {
        const statusClasses = {
            'pending': 'bg-pending',
            'waiting_payment': 'bg-warning text-dark',
            'payment_failed': 'bg-danger',
            'processing': 'bg-processing',
            'shipping': 'bg-shipped',
            'delivered': 'bg-delivered',
            'cancelled': 'bg-cancelled',
            'refunded': 'bg-returned'
        };

        return statusClasses[status] || 'bg-secondary';
    }

    /**
     * Lấy class CSS cho trạng thái thanh toán
     * @param {string} status - Trạng thái thanh toán
     * @returns {string} - Class CSS
     */
    getPaymentStatusClass(status) {
        const statusClasses = {
            'pending': 'bg-warning text-dark',
            'completed': 'bg-success',
            'failed': 'bg-danger',
            'refunded': 'bg-secondary'
        };

        return statusClasses[status] || 'bg-secondary';
    }
}