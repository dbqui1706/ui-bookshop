// components/coupon-modal.js
import { CouponPopover } from './coupon-popover.js';

export class CouponModal {
    constructor() {
        this.modalElement = null;
        this.backdropElement = null;
        this.onCouponSelected = null;
        this.selectedCoupons = {
            discount: null,
            shipping: null
        };
    }

    /**
     * Tạo và hiển thị modal mã giảm giá
     * @param {Function} onCouponSelected - Callback khi người dùng chọn mã giảm giá
     */
    show(onCouponSelected) {
        this.onCouponSelected = onCouponSelected;
        document.head.appendChild(this.createModalCSS());
        this.createModal();
        this.setupEventListeners();
    }

    createModal() {
        // Tạo modal backdrop
        this.backdropElement = document.createElement('div');
        this.backdropElement.className = 'modal-backdrop';
        document.body.appendChild(this.backdropElement);

        // Tạo modal container
        this.modalElement = document.createElement('div');
        this.modalElement.className = 'coupon-modal';
        this.modalElement.innerHTML = `
            <div class="modal-header">
                <h4>BookStore Khuyến Mãi</h4>
                <button class="close-modal"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <div class="coupon-search">
                    <input type="text" placeholder="Nhập mã giảm giá" class="coupon-input">
                    <button class="btn-apply-coupon">Áp dụng</button>
                </div>
                
                <div class="coupon-section">
                    <div class="section-header">
                        <h5>Mã Giảm Giá</h5>
                        <span class="section-badge">Áp dụng tối đa: 1</span>
                    </div>
                    
                    <div class="coupon-list">
                        <div class="coupon-card" data-coupon-code="BOOK15" data-coupon-value="15%" data-coupon-min="399000">
                            <div class="coupon-card-left">
                                <img src="/asset/images/tiki-logo.png" alt="BookStore Logo">
                            </div>
                            <div class="coupon-card-right">
                                <div class="coupon-info">
                                    <div class="coupon-title">Giảm 15% tối đa 50K</div>
                                    <div class="coupon-desc">Cho đơn hàng từ 399K</div>
                                    <div class="coupon-date">HSD: 31/03/25</div>
                                </div>
                                <div class="coupon-status">
                                    <button class="btn-select-coupon" data-coupon-type="discount">Chọn</button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="coupon-card" data-coupon-code="BOOK3" data-coupon-value="3%" data-coupon-min="300000">
                            <div class="coupon-card-left">
                                <img src="/asset/images/tiki-logo.png" alt="BookStore Logo">
                            </div>
                            <div class="coupon-card-right">
                                <div class="coupon-info">
                                    <div class="coupon-title">Giảm 3%</div>
                                    <div class="coupon-desc">Cho đơn hàng từ 300K</div>
                                    <div class="coupon-date">HSD: 31/03/25</div>
                                </div>
                                <div class="coupon-status">
                                    <button class="btn-select-coupon" data-coupon-type="discount">Chọn</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="coupon-section mt-4">
                    <div class="section-header">
                        <h5>Mã Vận Chuyển</h5>
                        <span class="section-badge">Áp dụng tối đa: 1</span>
                    </div>
                    
                    <div class="coupon-list">
                        <div class="coupon-card selected" data-coupon-code="FREESHIP70" data-coupon-type="shipping" data-coupon-value="70000" data-coupon-min="100000">
                            <div class="coupon-card-left freeship-xtra">
                                <div class="xtra-logo">FREESHIP<br>XTRA</div>
                                <div class="xtra-free">Miễn phí<br>vận chuyển</div>
                            </div>
                            <div class="coupon-card-right">
                                <div class="coupon-info">
                                    <div class="coupon-title">Giảm 70K</div>
                                    <div class="coupon-desc">Cho đơn hàng từ 100K</div>
                                    <div class="coupon-date">HSD: 30/08/36</div>
                                </div>
                                <div class="coupon-status">
                                    <button class="btn-select-coupon selected" data-coupon-type="shipping">Bỏ Chọn</button>
                                    <i class="fas fa-info-circle coupon-info-trigger" data-code="FREESHIP70" data-expiry="30/08/36"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(this.modalElement);
    }

    createModalCSS() {
        const style = document.createElement('style');
        style.textContent = `
            /* 2. Styling cho Modal Backdrop */
            .modal-backdrop {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 1050;
            }

            /* 3. Styling cho Modal Coupon */
            .coupon-modal {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 90%;
                max-width: 600px;
                background-color: white;
                border-radius: 8px;
                z-index: 1100;
                max-height: 90vh;
                overflow-y: auto;
            }

            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                border-bottom: 1px solid #f1f1f1;
            }

            .modal-header h4 {
                font-size: 18px;
                font-weight: 500;
                margin: 0;
            }

            .close-modal {
                background: none;
                border: none;
                font-size: 16px;
                color: #757575;
                cursor: pointer;
            }

            .modal-body {
                padding: 20px;
            }

            .coupon-search {
                display: flex;
                margin-bottom: 20px;
                gap: 10px;
            }

            .coupon-input {
                flex: 1;
                padding: 10px 15px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
            }

            .btn-apply-coupon {
                background-color: #f1f1f1;
                border: 1px solid #ddd;
                padding: 10px 20px;
                border-radius: 4px;
                font-weight: 500;
                cursor: pointer;
            }

            .section-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
            }

            .section-header h5 {
                font-size: 16px;
                font-weight: 500;
                margin: 0;
            }

            .section-badge {
                color: #757575;
                font-size: 13px;
            }

            .coupon-list {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .coupon-card {
                display: flex;
                border: 1px solid #e0e0e0;
                border-radius: 4px;
                overflow: hidden;
            }

            .coupon-card.selected {
                border-color: #1a94ff;
            }

            .coupon-card-left {
                width: 100px;
                background-color: #f5f5f5;
                padding: 15px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
            }

            .coupon-card-left img {
                width: 70px;
                height: 70px;
                object-fit: contain;
            }

            .coupon-card-right {
                flex: 1;
                display: flex;
                padding: 15px;
                justify-content: space-between;
                align-items: center;
            }

            .coupon-info {
                flex: 1;
            }

            .coupon-title {
                font-weight: 500;
                margin-bottom: 4px;
                position: relative;
            }

            .coupon-code {
                font-size: 12px;
                color: #1a94ff;
                margin-left: 8px;
                display: inline-flex;
                align-items: center;
                gap: 5px;
                position: relative;
            }

            .coupon-desc {
                color: #757575;
                font-size: 13px;
                margin-bottom: 4px;
            }

            .coupon-date {
                color: #757575;
                font-size: 12px;
            }

            .coupon-status {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .status-badge {
                font-size: 12px;
                color: #757575;
                padding: 4px 8px;
                background-color: #f5f5f5;
                border-radius: 4px;
                white-space: nowrap;
            }

            .btn-select-coupon {
                background-color: #1a94ff;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 4px;
                font-size: 14px;
                cursor: pointer;
            }

            .btn-select-coupon.selected {
                background-color: #f1f1f1;
                color: #333;
            }

            .coupon-info-trigger {
                color: #999;
                cursor: pointer;
            }

            .freeship-xtra {
                background-color: #00AB56;
                color: white;
                padding: 15px 10px;
            }

            .xtra-logo {
                font-weight: 700;
                font-size: 15px;
                margin-bottom: 5px;
                line-height: 1.2;
            }

            .xtra-free {
                font-size: 12px;
                line-height: 1.2;
            }

            .mt-4 {
                margin-top: 20px;
            }

            @keyframes modalFadeIn {
                from {
                    opacity: 0;
                    transform: translate(-50%, -60%);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%);
                }
            }

            @media (max-width: 600px) {
                .form-row {
                    flex-direction: column;
                    align-items: flex-start;
                }
                
                .form-label {
                    width: 100%;
                    margin-bottom: 5px;
                }
                
                .form-input {
                    width: 100%;
                }
                
                .address-note, .default-address {
                    padding-left: 0;
                }
                
                .address-types {
                    flex-direction: column;
                    gap: 10px;
                }
                
                .form-actions {
                    flex-direction: column;
                }
                
                .btn-cancel, .btn-update {
                    width: 100%;
                }
            }

            /* Animation for modals */
            .coupon-modal, .address-modal {
                animation: modalFadeIn 0.3s ease-out;
            }

            @keyframes modalFadeIn {
                from {
                    opacity: 0;
                    transform: translate(-50%, -60%);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%);
                }
            }

            /* Responsive adjustments */
            @media (max-width: 767.98px) {
                .coupon-modal, .address-modal {
                    width: 95%;
                    max-width: none;
                }
                
                .coupon-card-right {
                    flex-direction: column;
                    align-items: flex-start;
                }
                
                .coupon-status {
                    margin-top: 10px;
                    width: 100%;
                    justify-content: flex-end;
                }
            }
        `;
        
        return style;
    }

    setupEventListeners() {
        // Xử lý đóng modal
        const closeBtn = this.modalElement.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => this.close());
        this.backdropElement.addEventListener('click', () => this.close());

        // Xử lý các nút chọn/bỏ chọn khuyến mãi
        const selectButtons = this.modalElement.querySelectorAll('.btn-select-coupon');
        selectButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const couponCard = button.closest('.coupon-card');
                const couponType = button.getAttribute('data-coupon-type');
                const isSelected = button.classList.contains('selected');
                
                // Nếu đang chọn, thì bỏ chọn
                if (isSelected) {
                    this.unselectCoupon(couponCard, button);
                } 
                // Nếu chưa chọn, thì chọn (và bỏ chọn coupon cùng loại nếu có)
                else {
                    // Bỏ chọn coupon cùng loại đã chọn trước đó (nếu có)
                    this.modalElement.querySelectorAll(`.coupon-card[data-coupon-type="${couponType}"] .btn-select-coupon.selected`).forEach(btn => {
                        this.unselectCoupon(btn.closest('.coupon-card'), btn);
                    });
                    
                    // Chọn coupon mới
                    this.selectCoupon(couponCard, button);
                }
            });
        });

        // Xử lý các icon thông tin
        const infoTriggers = this.modalElement.querySelectorAll('.coupon-info-trigger');
        infoTriggers.forEach(trigger => {
            const couponCode = trigger.getAttribute('data-code');
            const expiryDate = trigger.getAttribute('data-expiry');
            const conditions = [
                "Giảm phí vận chuyển cho đơn hàng từ 100K.",
                "Chỉ áp dụng cho các sản phẩm có gắn nhãn Freeship Xtra"
            ];
            
            // Tạo và thiết lập popover
            const popover = new CouponPopover(couponCode, expiryDate, conditions);
            popover.setupTrigger(trigger);
        });

        // Xử lý nút áp dụng mã giảm giá nhập thủ công
        const applyButton = this.modalElement.querySelector('.btn-apply-coupon');
        const couponInput = this.modalElement.querySelector('.coupon-input');
        
        applyButton.addEventListener('click', () => {
            const couponCode = couponInput.value.trim();
            if (couponCode) {
                this.applyCouponCode(couponCode);
            }
        });
        
        // Xử lý khi nhấn Enter trong input mã giảm giá
        couponInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyButton.click();
            }
        });
    }

    selectCoupon(couponCard, button) {
        const couponType = button.getAttribute('data-coupon-type');
        const couponCode = couponCard.getAttribute('data-coupon-code');
        const couponValue = couponCard.getAttribute('data-coupon-value');
        const couponMin = couponCard.getAttribute('data-coupon-min');
        
        // Cập nhật giao diện
        button.classList.add('selected');
        button.textContent = 'Bỏ Chọn';
        couponCard.classList.add('selected');
        
        // Lưu thông tin coupon đã chọn
        this.selectedCoupons[couponType] = {
            code: couponCode,
            value: couponValue,
            minOrderValue: couponMin
        };
    }

    unselectCoupon(couponCard, button) {
        const couponType = button.getAttribute('data-coupon-type');
        
        // Cập nhật giao diện
        button.classList.remove('selected');
        button.textContent = 'Chọn';
        couponCard.classList.remove('selected');
        
        // Xóa thông tin coupon đã bỏ chọn
        this.selectedCoupons[couponType] = null;
    }

    applyCouponCode(couponCode) {
        // Giả lập kiểm tra mã giảm giá
        // Trong thực tế, bạn sẽ gọi API để kiểm tra mã giảm giá
        setTimeout(() => {
            alert(`Mã giảm giá ${couponCode} đã được áp dụng thành công.`);
            
            // Đóng modal
            this.close();
            
            // Gọi callback nếu có
            if (this.onCouponSelected) {
                this.onCouponSelected({
                    code: couponCode,
                    type: 'manual',
                    value: '10%',
                    minOrderValue: 0
                });
            }
        }, 500);
    }

    close() {
        // Gọi callback với thông tin các mã giảm giá đã chọn
        if (this.onCouponSelected) {
            this.onCouponSelected(this.selectedCoupons);
        }
        
        // Xóa modal khỏi DOM
        document.body.removeChild(this.backdropElement);
        document.body.removeChild(this.modalElement);
    }
}

/**
 * Hiển thị modal mã giảm giá
 * @param {Function} onCouponSelected - Callback khi người dùng chọn mã giảm giá
 */
export function openCouponModal(onCouponSelected) {
    const modal = new CouponModal();
    modal.show(onCouponSelected);
}