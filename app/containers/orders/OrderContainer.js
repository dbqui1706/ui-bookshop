import {  OrderComponent } from '../../components/orders/OrderComponent.js';
import { showNotification } from '../../core/utils.js';

/**
 * Class OrderContainer - Container điều phối cho phần quản lý đơn hàng
 */
export class OrderContainer {
    /**
     * Khởi tạo container
     * @param {HTMLElement} containerElement - Element container chứa tất cả các components
     */
    constructor(containerElement) {
        this.containerElement = containerElement;
        this.orderComponent = null;

        // Khởi tạo container
        this.initialize();
    }

    /**
     * Khởi tạo container và các components con
     */
    async initialize() {
        try {
            // Tải template HTML
            await this.loadTemplate();

            // Khởi tạo component con
            this.initComponents();

        } catch (error) {
            console.error('Error initializing OrderContainer:', error);
            showNotification('error', 'Lỗi', 'Không thể khởi tạo trang quản lý đơn hàng.');
        }
    }

    /**
     * Tải template HTML
     */
    async loadTemplate() {
        try {
           
        } catch (error) {
            console.error('Error loading order template:', error);
            throw error;
        }
    }

    /**
     * Khởi tạo các components con
     */
    initComponents() {
        // Khởi tạo component quản lý đơn hàng
        this.orderComponent = new OrderComponent(this.containerElement);
    }

    /**
     * Hủy container và giải phóng tài nguyên
     */
    destroy() {
        // Hủy các components con
        if (this.orderComponent) {
            // Có thể thêm phương thức destroy nếu cần
        }

        // Xóa nội dung container
        this.containerElement.innerHTML = '';

        // Hủy các tham chiếu
        this.containerElement = null;
        this.orderComponent = null;
    }

    /**
     * Lấy HTML template cho trang quản lý đơn hàng
     * @returns {string} - HTML template
     */
    getTemplateHTML() {
        return `
        <div class="row mb-4">
            <div class="col-12">
                <div class="bg-primary text-white rounded p-3">
                    <div class="row align-items-center">
                        <div class="col-md-6">
                            <h2>Quản Lý Đơn Hàng</h2>
                        </div>
                        <div class="col-md-6 text-md-end">
                            <button class="btn btn-light me-2" id="btnCreateOrder">
                                <i class="bi bi-plus-lg"></i> Tạo đơn hàng mới
                            </button>
                            <button class="btn btn-light" data-action="export-excel">
                                <i class="bi bi-file-earmark-excel"></i> Xuất Excel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Stats Row -->
        <div class="row mb-4">
            <div class="col-md-3 mb-3 mb-md-0">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body">
                        <div class="d-flex align-items-center">
                            <div class="flex-shrink-0">
                                <div class="stat-icon bg-primary bg-opacity-10 p-3 rounded text-primary">
                                    <i class="bi bi-cart-check fs-3"></i>
                                </div>
                            </div>
                            <div class="flex-grow-1 ms-3">
                                <h6 class="mb-1">Tổng đơn hàng</h6>
                                <h3 class="mb-0" id="totalOrders">0</h3>
                                <span class="text-success"><i class="bi bi-arrow-up"></i> 12.5%</span>
                                <small class="text-muted">so với tháng trước</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-3 mb-md-0">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body">
                        <div class="d-flex align-items-center">
                            <div class="flex-shrink-0">
                                <div class="stat-icon bg-danger bg-opacity-10 p-3 rounded text-danger">
                                    <i class="bi bi-hourglass-split fs-3"></i>
                                </div>
                            </div>
                            <div class="flex-grow-1 ms-3">
                                <h6 class="mb-1">Đơn chờ xử lý</h6>
                                <h3 class="mb-0" id="pendingOrders">0</h3>
                                <span class="text-danger"><i class="bi bi-arrow-up"></i> 5.2%</span>
                                <small class="text-muted">so với tháng trước</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-3 mb-md-0">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body">
                        <div class="d-flex align-items-center">
                            <div class="flex-shrink-0">
                                <div class="stat-icon bg-success bg-opacity-10 p-3 rounded text-success">
                                    <i class="bi bi-truck fs-3"></i>
                                </div>
                            </div>
                            <div class="flex-grow-1 ms-3">
                                <h6 class="mb-1">Đơn đang giao</h6>
                                <h3 class="mb-0" id="shippingOrders">0</h3>
                                <span class="text-success"><i class="bi bi-arrow-up"></i> 8.7%</span>
                                <small class="text-muted">so với tháng trước</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-3 mb-md-0">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body">
                        <div class="d-flex align-items-center">
                            <div class="flex-shrink-0">
                                <div class="stat-icon bg-info bg-opacity-10 p-3 rounded text-info">
                                    <i class="bi bi-cash-stack fs-3"></i>
                                </div>
                            </div>
                            <div class="flex-grow-1 ms-3">
                                <h6 class="mb-1">Doanh thu tháng</h6>
                                <h3 class="mb-0" id="monthlyRevenue">0</h3>
                                <span class="text-success"><i class="bi bi-arrow-up"></i> 15.3%</span>
                                <small class="text-muted">so với tháng trước</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filter Section -->
        <div class="row mb-4">
            <div class="col-12">
                <div class="card border-0 shadow-sm">
                    <div class="card-body">
                        <form class="row g-3" id="orderFilterForm">
                            <div class="col-md-2">
                                <label class="form-label">Tìm kiếm</label>
                                <input type="text" class="form-control" id="searchOrder" placeholder="Mã đơn, khách hàng...">
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">Trạng thái</label>
                                <select class="form-select" id="orderStatus">
                                    <option value="" selected>Tất cả</option>
                                    <option value="pending">Chờ xử lý</option>
                                    <option value="waiting_payment">Chờ thanh toán</option>
                                    <option value="processing">Đang xử lý</option>
                                    <option value="shipping">Đang giao</option>
                                    <option value="delivered">Đã giao</option>
                                    <option value="cancelled">Đã hủy</option>
                                    <option value="refunded">Hoàn tiền</option>
                                </select>
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">Từ ngày</label>
                                <input type="date" class="form-control" id="fromDate">
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">Đến ngày</label>
                                <input type="date" class="form-control" id="toDate">
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">Phương thức TT</label>
                                <select class="form-select" id="paymentMethod">
                                    <option value="" selected>Tất cả</option>
                                    <option value="1">COD</option>
                                    <option value="2">Chuyển khoản</option>
                                    <option value="3">Thẻ tín dụng</option>
                                    <option value="4">Ví MoMo</option>
                                    <option value="5">Khác</option>
                                </select>
                            </div>
                            <div class="col-md-2 d-flex align-items-end">
                                <button type="button" class="btn btn-primary w-100" id="btnFilter">
                                    <i class="bi bi-search me-1"></i> Tìm kiếm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Orders Table -->
        <div class="row mb-4">
            <div class="col-12">
                <div class="card border-0 shadow-sm">
                    <div class="card-header bg-white d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">Danh sách đơn hàng</h5>
                        <div class="btn-group">
                            <button type="button" class="btn btn-sm btn-outline-secondary" id="btnRefreshOrders">
                                <i class="bi bi-arrow-clockwise"></i> Làm mới
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-secondary" id="btnBulkActions" data-bs-toggle="dropdown">
                                <i class="bi bi-three-dots"></i> Hành động
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li><a class="dropdown-item" href="#" id="btnBulkPrint">In đơn hàng đã chọn</a></li>
                                <li><a class="dropdown-item" href="#" id="btnBulkExport">Xuất Excel đơn đã chọn</a></li>
                                <li>
                                    <hr class="dropdown-divider">
                                </li>
                                <li><a class="dropdown-item text-danger" href="#" id="btnBulkCancel">Hủy đơn hàng đã chọn</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="card-body p-3">
                        <div class="table-responsive">
                            <table class="table table-hover align-middle mb-1" id="ordersTable">
                                <thead class="table-light">
                                    <tr>
                                        <th width="20">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="checkAll">
                                            </div>
                                        </th>
                                        <th width="130">Mã đơn hàng</th>
                                        <th>Khách hàng</th>
                                        <th width="150">Sản phẩm</th>
                                        <th class="text-end">Tổng tiền</th>
                                        <th width="130">Thanh toán</th>
                                        <th>Trạng thái</th>
                                        <th>Ngày đặt</th>
                                        <th class="text-end">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colspan="9" class="text-center">Đang tải dữ liệu...</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Xem Chi tiết Đơn hàng -->
        <div class="modal fade" id="viewOrderModal" tabindex="-1" aria-labelledby="viewOrderModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="viewOrderModalLabel">Chi tiết đơn hàng</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <!-- Order Info -->
                        <div class="row g-4 mb-4">
                            <div class="col-md-6">
                                <div class="card border-0 bg-light h-100">
                                    <div class="card-body">
                                        <h6 class="card-title d-flex align-items-center mb-3">
                                            <i class="bi bi-person me-2"></i> Thông tin khách hàng
                                        </h6>
                                        <p class="mb-1"><strong>Khách hàng:</strong> <span id="customerName"></span></p>
                                        <p class="mb-1"><strong>Số điện thoại:</strong> <span id="customerPhone"></span></p>
                                        <p class="mb-1"><strong>Email:</strong> <span id="customerEmail"></span></p>
                                        <p class="mb-0"><strong>Địa chỉ giao hàng:</strong> <span id="customerAddress"></span></p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card border-0 bg-light h-100">
                                    <div class="card-body">
                                        <h6 class="card-title d-flex align-items-center mb-3">
                                            <i class="bi bi-receipt me-2"></i> Thông tin đơn hàng
                                        </h6>
                                        <p class="mb-1"><strong>Mã đơn hàng:</strong> <span id="orderCode"></span></p>
                                        <p class="mb-1"><strong>Ngày đặt:</strong> <span id="orderDate"></span></p>
                                        <p class="mb-1"><strong>Trạng thái:</strong> <span id="orderStatus"></span></p>
                                        <p class="mb-1">
                                            <strong>Thanh toán:</strong>
                                            <span id="paymentStatus"></span>
                                            <small id="paymentMethod"></small>
                                        </p>
                                        <p class="mb-0"><strong>Ghi chú:</strong> <span id="orderNote"></span></p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Order Items -->
                        <h6 class="d-flex align-items-center mb-3">
                            <i class="bi bi-box me-2"></i> Sản phẩm
                        </h6>
                        <!-- Items will be inserted here by JavaScript -->

                        <!-- Order Summary -->
                        <div class="row">
                            <div class="col-md-6 offset-md-6">
                                <div class="card">
                                    <div class="card-body">
                                        <h6 class="card-title mb-3">Thông tin thanh toán</h6>
                                        <div class="order-summary">
                                            <div class="d-flex justify-content-between mb-2">
                                                <span>Tạm tính:</span>
                                                <span id="orderSubtotal">0đ</span>
                                            </div>
                                            <div class="d-flex justify-content-between mb-2">
                                                <span>Giảm giá:</span>
                                                <span id="orderDiscount">0đ</span>
                                            </div>
                                            <div class="d-flex justify-content-between mb-2">
                                                <span>Phí vận chuyển:</span>
                                                <span id="orderShipping">0đ</span>
                                            </div>
                                            <hr>
                                            <div class="d-flex justify-content-between fw-bold">
                                                <span>Tổng cộng:</span>
                                                <span class="text-primary" id="orderTotal">0đ</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Order Timeline -->
                        <h6 class="d-flex align-items-center mt-4 mb-3">
                            <i class="bi bi-clock-history me-2"></i> Lịch sử đơn hàng
                        </h6>
                        <div class="timeline">
                            <!-- Timeline items will be inserted here by JavaScript -->
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                        <button type="button" class="btn btn-success" id="btnNextStatus">
                            <i class="bi bi-arrow-right"></i> Chuyển trạng thái
                        </button>
                        <button type="button" class="btn btn-primary" id="btnPrintOrder">
                            <i class="bi bi-printer"></i> In đơn hàng
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Cập nhật trạng thái -->
        <div class="modal fade" id="updateStatusModal" tabindex="-1" aria-labelledby="updateStatusModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="updateStatusModalLabel">Cập nhật trạng thái đơn hàng</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="updateStatusForm">
                            <input type="hidden" id="updateOrderId" value="">
                            <div class="mb-3">
                                <label for="currentStatus" class="form-label">Trạng thái hiện tại</label>
                                <input type="text" class="form-control" id="currentStatus" disabled>
                            </div>
                            <div class="mb-3">
                                <label for="newStatus" class="form-label">Trạng thái mới</label>
                                <select class="form-select" id="newStatus">
                                    <!-- Options will be populated by JavaScript -->
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="statusNote" class="form-label">Ghi chú</label>
                                <textarea class="form-control" id="statusNote" rows="3" placeholder="Nhập ghi chú về việc thay đổi trạng thái"></textarea>
                            </div>
                            <div class="mb-3">
                                <label for="notifyCustomer" class="form-check-label">
                                    <input type="checkbox" class="form-check-input" id="notifyCustomer" checked>
                                    Thông báo cho khách hàng
                                </label>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                        <button type="button" class="btn btn-primary" id="confirmUpdateStatus">
                            <i class="bi bi-check2"></i> Cập nhật
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Tạo đơn hàng mới -->
        <div class="modal fade" id="createOrderModal" tabindex="-1" aria-labelledby="createOrderModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="createOrderModalLabel">Tạo đơn hàng mới</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="createOrderForm">
                            <div class="row g-4">
                                <!-- Thông tin khách hàng -->
                                <div class="col-md-6">
                                    <div class="card h-100">
                                        <div class="card-header bg-light">
                                            <h6 class="mb-0">Thông tin khách hàng</h6>
                                        </div>
                                        <div class="card-body">
                                            <div class="mb-3">
                                                <label for="customerSearch" class="form-label">Tìm kiếm khách hàng</label>
                                                <div class="input-group">
                                                    <input type="text" class="form-control" id="customerSearch" placeholder="Nhập tên, số điện thoại, email...">
                                                    <button class="btn btn-outline-secondary" type="button" id="searchCustomerBtn">
                                                        <i class="bi bi-search"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="row mb-3">
                                                <div class="col-md-6 mb-3 mb-md-0">
                                                    <label for="customerName" class="form-label">Họ tên <span class="text-danger">*</span></label>
                                                    <input type="text" class="form-control" id="customerName" required>
                                                </div>
                                                <div class="col-md-6">
                                                    <label for="customerPhone" class="form-label">Số điện thoại <span class="text-danger">*</span></label>
                                                    <input type="tel" class="form-control" id="customerPhone" required>
                                                </div>
                                            </div>
                                            <div class="mb-3">
                                                <label for="customerEmail" class="form-label">Email</label>
                                                <input type="email" class="form-control" id="customerEmail">
                                            </div>
                                            <div class="mb-3">
                                                <label for="customerAddress" class="form-label">Địa chỉ giao hàng <span class="text-danger">*</span></label>
                                                <textarea class="form-control" id="customerAddress" rows="3" required></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Thông tin đơn hàng -->
                                <div class="col-md-6">
                                    <div class="card h-100">
                                        <div class="card-header bg-light">
                                            <h6 class="mb-0">Thông tin đơn hàng</h6>
                                        </div>
                                        <div class="card-body">
                                            <div class="row mb-3">
                                                <div class="col-md-6 mb-3 mb-md-0">
                                                    <label for="orderDate" class="form-label">Ngày đặt hàng</label>
                                                    <input type="date" class="form-control" id="orderDate">
                                                </div>
                                                <div class="col-md-6">
                                                    <label for="orderPaymentMethod" class="form-label">Phương thức thanh toán</label>
                                                    <select class="form-select" id="orderPaymentMethod">
                                                        <option value="cod">COD (Thanh toán khi nhận hàng)</option>
                                                        <option value="bank_transfer">Chuyển khoản ngân hàng</option>
                                                        <option value="credit_card">Thẻ tín dụng</option>
                                                        <option value="momo">Ví MoMo</option>
                                                        <option value="other">Khác</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="mb-3">
                                                <label for="orderShipping" class="form-label">Phương thức vận chuyển</label>
                                                <select class="form-select" id="orderShipping">
                                                    <option value="standard">Giao hàng tiêu chuẩn (1-3 ngày)</option>
                                                    <option value="express">Giao hàng nhanh (24h)</option>
                                                    <option value="same_day">Giao trong ngày</option>
                                                </select>
                                            </div>
                                            <div class="mb-3">
                                                <label for="orderNote" class="form-label">Ghi chú đơn hàng</label>
                                                <textarea class="form-control" id="orderNote" rows="3" placeholder="Nhập ghi chú đơn hàng nếu có"></textarea>
                                            </div>
                                            <div class="mb-3">
                                                <label for="orderStatus" class="form-label">Trạng thái đơn hàng</label>
                                                <select class="form-select" id="orderStatus">
                                                    <option value="pending">Chờ xử lý</option>
                                                    <option value="processing">Đang xử lý</option>
                                                    <option value="shipping">Đang giao hàng</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Danh sách sản phẩm -->
                                <div class="col-12">
                                    <div class="card">
                                        <div class="card-header bg-light d-flex justify-content-between align-items-center">
                                            <h6 class="mb-0">Danh sách sản phẩm</h6>
                                            <button type="button" class="btn btn-primary btn-sm" id="addProduct">
                                                <i class="bi bi-plus-lg"></i> Thêm sản phẩm
                                            </button>
                                        </div>
                                        <div class="card-body p-0">
                                            <div class="table-responsive">
                                                <table class="table mb-0" id="productTable">
                                                    <thead class="table-light">
                                                        <tr>
                                                            <th width="5%">#</th>
                                                            <th width="40%">Sản phẩm</th>
                                                            <th width="15%" class="text-end">Đơn giá</th>
                                                            <th width="15%" class="text-center">Số lượng</th>
                                                            <th width="15%" class="text-end">Thành tiền</th>
                                                            <th width="10%" class="text-center">Thao tác</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr class="text-center">
                                                            <td colspan="6">Chưa có sản phẩm nào</td>
                                                        </tr>
                                                    </tbody>
                                                    <tfoot class="table-light">
                                                        <tr>
                                                            <td colspan="4" class="text-end fw-bold">Tạm tính:</td>
                                                            <td class="text-end fw-bold" id="subtotal">0đ</td>
                                                            <td></td>
                                                        </tr>
                                                        <tr>
                                                            <td colspan="4" class="text-end">Giảm giá:</td>
                                                            <td class="text-end" id="discount">0đ</td>
                                                            <td></td>
                                                        </tr>
                                                        <tr>
                                                            <td colspan="4" class="text-end">Phí vận chuyển:</td>
                                                            <td class="text-end" id="shipping">0đ</td>
                                                            <td></td>
                                                        </tr>
                                                        <tr>
                                                            <td colspan="4" class="text-end fw-bold">Tổng cộng:</td>
                                                            <td class="text-end fw-bold text-primary" id="total">0đ</td>
                                                            <td></td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                        <button type="button" class="btn btn-primary" id="saveOrder">
                            <i class="bi bi-save"></i> Lưu đơn hàng
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Thêm sản phẩm vào đơn hàng -->
        <div class="modal fade" id="addProductModal" tabindex="-1" aria-labelledby="addProductModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addProductModalLabel">Thêm sản phẩm</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <div class="input-group">
                                <input type="text" class="form-control" id="productSearch" placeholder="Tìm kiếm sản phẩm theo tên, mã...">
                                <button class="btn btn-outline-secondary" type="button" id="searchProductBtn">
                                    <i class="bi bi-search"></i>
                                </button>
                            </div>
                        </div>
                        <div class="table-responsive">
                            <table class="table" id="productSearchTable">
                                <thead>
                                    <tr>
                                        <th width="10%">Ảnh</th>
                                        <th width="35%">Tên sản phẩm</th>
                                        <th width="15%">SKU</th>
                                        <th width="15%" class="text-end">Giá</th>
                                        <th width="15%" class="text-center">Kho</th>
                                        <th width="10%" class="text-center">Thêm</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colspan="6" class="text-center">Đang tải sản phẩm...</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
}

export default OrderContainer;