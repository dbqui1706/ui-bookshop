// components/coupon-popover.js
import { copyToClipboard } from '../utils/dom-utils.js';

export class CouponPopover {
    constructor(couponCode, expiryDate, conditions) {
        this.couponCode = couponCode;
        this.expiryDate = expiryDate;
        this.conditions = conditions;
        this.popoverElement = null;
        this.createPopover();
    }

    createPopover() {
        // Tạo popover container
        this.popoverElement = document.createElement('div');
        this.popoverElement.className = 'coupon-popover';
        this.popoverElement.style.display = 'none';
        
        // Tạo nội dung popover
        this.popoverElement.innerHTML = `
            <div class="popover-header">
                <span>Mã</span>
                <span class="popover-code">${this.couponCode} <i class="fas fa-copy" title="Nhấn để sao chép"></i></span>
                <span class="copy-tooltip">Đã sao chép!</span>
            </div>
            <div class="popover-content">
                <div class="popover-detail">
                    <div class="detail-row">
                        <span class="detail-label">Hạn sử dụng: <b style="font-weight: bold; color: #000;">${this.expiryDate}</b></span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Điều kiện</span>
                        <ul class="detail-conditions">
                            ${this.conditions.map(condition => `<li>${condition}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
        
        // Thêm vào DOM
        document.body.appendChild(this.popoverElement);
        
        // Thêm event listener cho nút copy
        const copyIcon = this.popoverElement.querySelector('.fa-copy');
        copyIcon.addEventListener('click', () => this.handleCopyCode());
    }

    handleCopyCode() {
        copyToClipboard(this.couponCode).then(() => {
            // Hiển thị tooltip "Đã sao chép"
            const tooltip = this.popoverElement.querySelector('.copy-tooltip');
            tooltip.style.visibility = 'visible';
            tooltip.style.opacity = '1';

            // Ẩn tooltip sau 2 giây
            setTimeout(() => {
                tooltip.style.visibility = 'hidden';
                tooltip.style.opacity = '0';
            }, 2000);
        }).catch(err => {
            console.error('Không thể sao chép mã:', err);
        });
    }

    show(x, y) {
        this.popoverElement.style.top = `${y}px`;
        this.popoverElement.style.left = `${x}px`;
        this.popoverElement.style.display = 'block';
    }

    hide() {
        this.popoverElement.style.display = 'none';
    }

    /**
     * Thiết lập hành vi hover cho một element để hiển thị popover
     * @param {Element} triggerElement - Element kích hoạt popover
     */
    setupTrigger(triggerElement) {
        let isHoveringTrigger = false;
        let isHoveringPopover = false;

        // Khi hover vào trigger
        triggerElement.addEventListener('mouseenter', () => {
            isHoveringTrigger = true;
            const rect = triggerElement.getBoundingClientRect();
            this.show(rect.left + window.scrollX - 220, rect.top + window.scrollY - this.popoverElement.offsetHeight - 10);
            this.updateVisibility();
        });

        // Khi không hover vào trigger nữa
        triggerElement.addEventListener('mouseleave', () => {
            isHoveringTrigger = false;
            setTimeout(this.updateVisibility.bind(this), 100);
        });

        // Khi hover vào popover
        this.popoverElement.addEventListener('mouseenter', () => {
            isHoveringPopover = true;
            this.updateVisibility();
        });

        // Khi không hover vào popover nữa
        this.popoverElement.addEventListener('mouseleave', () => {
            isHoveringPopover = false;
            this.updateVisibility();
        });

        // Hàm cập nhật hiển thị popover dựa trên trạng thái hover
        const updateVisibility = () => {
            if (isHoveringTrigger || isHoveringPopover) {
                this.show(
                    parseInt(this.popoverElement.style.left), 
                    parseInt(this.popoverElement.style.top)
                );
            } else {
                this.hide();
            }
        };

        this.updateVisibility = updateVisibility;
    }
}

/**
 * Khởi tạo và gắn popover vào các icon thông tin mã giảm giá
 */
export function initCouponInfoPopovers() {
    const couponInfoIcons = document.querySelectorAll('.coupon-info-icon i');
    
    couponInfoIcons.forEach(icon => {
        // Lấy thông tin mã giảm giá từ data attribute hoặc dùng giá trị mặc định
        const couponCode = icon.dataset.code || "XTRA2470QCC0";
        const expiryDate = icon.dataset.expiry || "30/08/36";
        const conditions = [
            "Giảm 70K phí vận chuyển cho đơn hàng từ 100K.",
            "Chỉ áp dụng cho các sản phẩm có gắn nhãn Freeship Xtra"
        ];
        
        // Tạo và thiết lập popover
        const popover = new CouponPopover(couponCode, expiryDate, conditions);
        popover.setupTrigger(icon);
    });
}