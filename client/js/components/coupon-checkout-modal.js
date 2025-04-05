// components/coupon-modal.js
import { CouponService } from '../service/coupon-service.js';
import { formatPrice } from '../utils/formatter.js';

export class CouponModal {
    constructor() {
        this.modalElement = null;
        this.couponService = new CouponService();
        this.onCouponSelected = null;
        this.availableCoupons = [];
        this.selectedCoupon = null;
        this.orderValue = 0;
        this.userId = JSON.parse(localStorage.getItem('user'))?.id || null;
        this.bootstrapModal = null;
    }

    /**
     * Hiển thị modal mã giảm giá
     * @param {Number} orderValue - Giá trị đơn hàng
     * @param {Object} currentCoupon - Mã giảm giá hiện tại (nếu có)
     * @param {Function} onCouponSelected - Callback khi chọn mã giảm giá
     */
    async show(orderValue, currentCoupon = null, onCouponSelected = null) {
        this.orderValue = orderValue;
        this.selectedCoupon = currentCoupon;
        this.onCouponSelected = onCouponSelected;

        // Tạo và hiển thị modal
        this.createModal();
        document.head.appendChild(this.createModalCSS());
        this.setupEventListeners();

        // Hiển thị modal bằng Bootstrap
        this.bootstrapModal = new bootstrap.Modal(this.modalElement);
        this.bootstrapModal.show();

        // Tải danh sách mã giảm giá
        await this.loadCoupons();
    }

    async loadCoupons() {
        try {
            // Hiển thị loading
            this.setLoading(true);

            // Lấy danh sách mã giảm giá
            const response = await this.couponService.getAvailableCoupons(
                this.userId,
                this.orderValue
            );

            if (response.success) {
                this.availableCoupons = response.data;
                this.renderCoupons();
            } else {
                this.showError(response.message || 'Không thể tải danh sách mã giảm giá');
            }
        } catch (error) {
            console.error('Lỗi khi tải mã giảm giá:', error);
            this.showError('Có lỗi xảy ra khi tải mã giảm giá');
        } finally {
            this.setLoading(false);
        }
    }

    createModal() {
        // Tạo modal container
        this.modalElement = document.createElement('div');
        this.modalElement.className = 'modal fade';
        this.modalElement.id = 'couponModal';
        this.modalElement.tabIndex = '-1';
        this.modalElement.setAttribute('aria-labelledby', 'couponModalLabel');
        this.modalElement.setAttribute('aria-hidden', 'true');

        // Tạo HTML cho modal
        this.modalElement.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title fw-bold" id="couponModalLabel">Mã giảm giá</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-0">
                        <div class="modal-top-section px-4 py-3">
                            <div class="coupon-search mb-3">
                                <div class="input-group coupon-input-group">
                                    <input type="text" id="coupon-code" class="form-control" placeholder="Nhập mã giảm giá">
                                    <button id="apply-coupon" class="btn btn-apply">Áp dụng</button>
                                </div>
                            </div>
                            
                            <div class="coupon-list-header ">
                                <h6 class="coupon-section-title">Mã giảm giá hiện có</h6>
                            </div>
                            <div id="coupon-error" class="alert-danger rounded-2 d-none mt-2 px-3 py-2"></div>

                        </div>
                        
                        <div class="coupon-list-wrapper">
                            <div id="coupon-loading" class="text-center py-3 d-none">
                                <div class="spinner-border spinner-color" role="status">
                                    <span class="visually-hidden">Đang tải...</span>
                                </div>
                                <p class="mt-2">Đang tải mã giảm giá...</p>
                            </div>
                            <div id="coupon-list" class="coupon-list p-4 pt-2"></div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" id="submit-apply-coupon">Áp dụng</button>
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Đóng</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(this.modalElement);
    }

    renderCoupons() {
        const couponList = this.modalElement.querySelector('#coupon-list');

        if (!couponList) return;

        if (this.availableCoupons.length === 0) {
            couponList.innerHTML = `
                <div class="text-center empty-coupon py-4">
                    <i class="fas fa-ticket-alt fa-3x text-muted mb-3"></i>
                    <p class="text-muted">Không có mã giảm giá nào khả dụng</p>
                </div>
            `;
            return;
        }

        // Tạo HTML cho danh sách mã giảm giá
        const couponHTML = this.availableCoupons.map(coupon => {
            const isSelected = this.selectedCoupon && this.selectedCoupon.code === coupon.code;
            const isPercentage = coupon.discountType === 'percentage';

            const discountText = isPercentage
                ? `${coupon.discountValue}%`
                : `${formatPrice(coupon.discountValue)}`;

            const maxText = coupon.maxDiscount
                ? `Giảm tối đa ${formatPrice(coupon.maxDiscount)}`
                : '';

            const minText = coupon.minOrderValue > 0
                ? `Đơn tối thiểu ${formatPrice(coupon.minOrderValue)}`
                : '';

            // Format expiration date
            const expDate = new Date(coupon.endDate);
            const formattedDate = expDate.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });

            return `
                <div class="coupon-item ${isSelected ? 'selected' : ''}" data-code="${coupon.code}">
                    <div class="coupon-radio">
                        <input class="form-check-input" type="radio" name="coupon" id="coupon-${coupon.code}" 
                            ${isSelected ? 'checked' : ''}>
                    </div>
                    <div class="coupon-content">
                        <div class="coupon-left">
                            <div class="coupon-title">
                                <span class="coupon-label">Giảm ${discountText}</span>
                            </div>
                            <div class="coupon-info">
                                ${minText ? `<div class="coupon-condition">${minText}</div>` : ''}
                                ${maxText ? `<div class="coupon-condition">${maxText}</div>` : ''}
                                <div class="coupon-date">HSD: ${formattedDate}</div>
                            </div>
                            ${coupon.description ? `<div class="coupon-desc">${coupon.description}</div>` : ''}
                        </div>
                        <div class="coupon-right">
                            <div class="coupon-code-display text-nowrap">${coupon.code}</div>
                            <div class="coupon-note">${isPercentage ? 'Cho đơn hàng đầu tiên' : ''}</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        couponList.innerHTML = couponHTML;

        // Thêm sự kiện click cho các coupon
        const couponItems = couponList.querySelectorAll('.coupon-item');
        couponItems.forEach(item => {
            item.addEventListener('click', () => {
                const code = item.getAttribute('data-code');
                this.selectCoupon(code);
            });
        });
    }

    async selectCoupon(code) {
        try {
            // Hiển thị loading
            this.setLoading(true);

            // Lấy coupon từ danh sách đã được call từ API
            const coupon = this.availableCoupons.find(c => c.code === code);
            if (!coupon) {
                this.showError('Mã giảm giá không hợp lệ');
                return;
            }
            // Cập nhật UI
            const couponItems = this.modalElement.querySelectorAll('.coupon-item');
            couponItems.forEach(item => {
                const itemCode = item.getAttribute('data-code');
                const isSelected = itemCode === code;

                // Toggle border-danger class
                item.classList.toggle('border-danger', isSelected);
                item.classList.toggle('selected', isSelected);

                // Toggle radio button
                const radio = item.querySelector('input[type="radio"]');
                if (radio) radio.checked = isSelected;
            });

            // Lưu mã đã chọn
            this.selectedCoupon = coupon;

        } catch (error) {
            console.error('Lỗi khi chọn mã giảm giá:', error);
            this.showError('Có lỗi xảy ra khi áp dụng mã giảm giá');
        } finally {
            this.setLoading(false);
        }
    }

    async applyCouponCode() {
        const codeInput = this.modalElement.querySelector('#coupon-code');
        const code = codeInput.value.trim();

        if (!code) {
            this.showError('Vui lòng nhập mã giảm giá');
            return;
        }

        try {
            // Hiển thị loading
            this.setLoading(true);

            // Kiểm tra mã giảm giá
            const response = await this.couponService.applyCoupon(
                code,
                this.orderValue,
                this.userId
            );

            if (response.success) {
                // Lưu mã đã chọn
                this.selectedCoupon = {
                    code: response.code,
                    discountType: response.discountType,
                    discountValue: response.discountValue,
                    discount: response.discount
                };

                // Gọi callback nếu có
                if (this.onCouponSelected) {
                    this.onCouponSelected({
                        success: true,
                        discount: this.selectedCoupon
                    });
                }

                // Đóng modal
                this.close();
            } else {
                this.showError(response.message || 'Mã giảm giá không hợp lệ');
            }
        } catch (error) {
            console.error('Lỗi khi áp dụng mã giảm giá:', error);
            this.showError('Có lỗi xảy ra khi áp dụng mã giảm giá');
        } finally {
            this.setLoading(false);
        }
    }

    showError(message) {
        const errorEl = this.modalElement.querySelector('#coupon-error');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.remove('d-none');
        }
    }

    setLoading(isLoading) {
        const loadingEl = this.modalElement.querySelector('#coupon-loading');
        if (loadingEl) {
            if (isLoading) {
                loadingEl.classList.remove('d-none');
            } else {
                loadingEl.classList.add('d-none');
            }
        }
    }

    createModalCSS() {
        const style = document.createElement('style');
        style.textContent = `
            /* Modal styling */
            .modal-content {
                border: none;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            }
            
            .modal-header {
                border-bottom: 1px solid rgba(0, 0, 0, 0.05);
                padding: 15px 20px;
            }
            
            .modal-footer {
                border-top: 1px solid rgba(0, 0, 0, 0.05);
                padding: 15px 20px;
            }
            
            /* Coupon input styling */
            .coupon-input-group {
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
                border-radius: 8px;
                overflow: hidden;
            }
            
            .coupon-input-group input {
                border: 1px solid #e0e0e0;
                padding: 12px 15px;
                font-size: 14px;
                border-right: none;
            }
            
            .coupon-input-group input:focus {
                box-shadow: none;
                border-color: #e8506c;
            }
            
            .btn-apply {
                background-color: #e8506c;
                color: white;
                border: none;
                padding: 0 20px;
                font-weight: 500;
                min-width: 100px;
            }
            
            .btn-apply:hover, .btn-apply:focus {
                background-color: #d1405a;
                color: white;
            }
            
            /* Section title styling */
            .coupon-section-title {
                position: relative;
                padding-left: 12px;
                font-weight: 600;
                margin-bottom: 0;
                color: #333;
                font-size: 15px;
            }
            
            .coupon-section-title::before {
                content: '';
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                width: 4px;
                height: 16px;
                background-color: #e8506c;
                border-radius: 2px;
            }
            
            /* Spinner color */
            .spinner-color {
                color: #e8506c;
            }
            
            /* Coupon item styling */
            .coupon-item {
                position: relative;
                cursor: pointer;
                margin-bottom: 5px;
                border-radius: 10px;
                background-color: #fff;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.04);
                display: flex;
                border: 1px solid #f0f0f0;
                transition: all 0.3s ease;
                overflow: hidden;
            }
            
            .coupon-item:hover {
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
                transform: translateY(-2px);
            }
            
            .coupon-item.selected {
                border: 1px solid #e8506c;
                background-color: #fff9fa;
            }
            
            .coupon-radio {
                padding: 15px 0 15px 15px;
                display: flex;
                align-items: center;
            }
            
            .coupon-radio .form-check-input {
                margin: 0;
                cursor: pointer;
            }
            
            .coupon-radio .form-check-input:checked {
                background-color: #e8506c;
                border-color: #e8506c;
            }
            
            .coupon-content {
                display: flex;
                flex: 1;
                align-items: stretch;
            }
            
            .coupon-left {
                flex: 1;
                padding: 15px;
                border-right: 1px dashed #eaeaea;
                position: relative;
            }
            
            .coupon-right {
                width: 120px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 15px 10px;
                background-color: #f9f9f9;
            }
            
            .coupon-title {
                margin-bottom: 10px;
            }
            
            .coupon-label {
                font-weight: 600;
                font-size: 15px;
                color: #e8506c;
            }
            
            .coupon-info {
                font-size: 13px;
                color: #666;
            }
            
            .coupon-condition {
                margin-bottom: 4px;
            }
            
            .coupon-date {
                color: #888;
                font-size: 12px;
                margin-top: 8px;
            }
            
            .coupon-desc {
                font-size: 12px;
                color: #888;
                margin-top: 10px;
                padding-top: 10px;
                border-top: 1px dotted #eee;
                font-style: italic;
            }
            
            .coupon-code-display {
                font-weight: 600;
                color: #333;
                font-size: 16px;
                text-align: center;
                background-color: white;
                padding: 5px 10px;
                border-radius: 5px;
                border: 1px dashed #e0e0e0;
                margin-bottom: 8px;
                width: 100%;
            }
            
            .coupon-note {
                font-size: 11px;
                color: #888;
                text-align: center;
            }
            
            /* Selected badge */
            .coupon-item.selected::after {
                content: '✓';
                position: absolute;
                top: 0;
                right: 0;
                width: 28px;
                height: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #e8506c;
                color: white;
                font-weight: bold;
                font-size: 14px;
                border-bottom-left-radius: 8px;
            }
            
            /* Alert styling */
            .alert-danger {
                background-color: #ffeaec;
                color: #e8506c;
                border-color: #ffd0d6;
                font-size: 12px;
            }
            
            /* Empty coupon styling */
            .empty-coupon i {
                color: #e0e0e0;
            }
            
            /* Scrollable coupon list */
            .coupon-list-wrapper {
                max-height: 350px;
                overflow-y: auto;
                overflow-x: hidden;
                scrollbar-width: thin;
                scrollbar-color: #e0e0e0 #f8f8f8;
            }
            
            .coupon-list-wrapper::-webkit-scrollbar {
                width: 6px;
            }
            
            .coupon-list-wrapper::-webkit-scrollbar-track {
                background: #f8f8f8;
            }
            
            .coupon-list-wrapper::-webkit-scrollbar-thumb {
                background-color: #e0e0e0;
                border-radius: 6px;
            }
            
            .modal-top-section {
                position: sticky;
                top: 0;
                background-color: white;
                z-index: 5;
                border-bottom: 1px solid rgba(0, 0, 0, 0.05);
            }
            
            /* Fix for coupon code overflow */
            .coupon-right {
                min-width: 120px;
                width: auto;
            }
            
            .coupon-code-display {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 100%;
                font-family: monospace;
                letter-spacing: 0.5px;
            }
            
            /* Responsive styling */
            @media (max-width: 576px) {
                .modal-dialog {
                    margin: 10px;
                    max-width: calc(100% - 20px);
                }
                
                .coupon-right {
                    min-width: 100px;
                }
                
                .coupon-code-display {
                    font-size: 14px;
                }
                
                .coupon-list-wrapper {
                    max-height: 300px;
                }
            }
        `;
        return style;
    }

    setupEventListeners() {
        // Xử lý nút Áp dụng
        const applyBtn = this.modalElement.querySelector('#apply-coupon');
        applyBtn.addEventListener('click', () => this.applyCouponCode());

        // Xử lý nhấn Enter trong input
        const codeInput = this.modalElement.querySelector('#coupon-code');
        codeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.applyCouponCode();
            }
        });

        // Xử lý nút submit-apply-coupon
        const submitBtn = this.modalElement.querySelector('#submit-apply-coupon');
        submitBtn.addEventListener('click', () => {
            if (this.selectedCoupon) {
                // Gọi callback
                if (this.onCouponSelected) {
                    this.onCouponSelected({
                        success: true,
                        discount: this.selectedCoupon
                    });
                }
                this.close();
            } else {
                this.showError('Vui lòng chọn mã giảm giá');
            }
        });
    }

    close() {
        if (this.bootstrapModal) {
            this.modalElement.remove();
            this.bootstrapModal.hide();
        }
    }
}

/**
 * Hiển thị modal mã giảm giá
 * @param {Number} orderValue - Giá trị đơn hàng
 * @param {Object} currentCoupon - Mã giảm giá hiện tại (nếu có)
 * @param {Function} onCouponSelected - Callback khi chọn mã giảm giá
 */
export function openCouponModal(orderValue, currentCoupon = null, onCouponSelected = null) {
    const modal = new CouponModal();
    modal.show(orderValue, currentCoupon, onCouponSelected);
}