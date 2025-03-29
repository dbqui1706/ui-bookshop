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