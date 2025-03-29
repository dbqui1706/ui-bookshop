import { copyToClipboard } from '../utils/dom-utils.js';

export class CouponPopover {
    constructor(couponCode, expiryDate, conditions) {
        this.couponCode = couponCode;
        this.expiryDate = expiryDate;
        this.conditions = conditions;
        this.popoverElement = null;
        this.createPopover();
        document.head.appendChild(this.createPopoverCSS());
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
        // Sao chép mã vào clipboard
        navigator.clipboard.writeText(this.couponCode).then(() => {
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
            console.error('Không thể sao chép văn bản: ', err);
            // Phương pháp thay thế
            this.fallbackCopyTextToClipboard();
        });
    }

    fallbackCopyTextToClipboard() {
        const textArea = document.createElement('textarea');
        textArea.value = this.couponCode;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);

        // Hiển thị tooltip
        const tooltip = this.popoverElement.querySelector('.copy-tooltip');
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = '1';

        setTimeout(() => {
            tooltip.style.visibility = 'hidden';
            tooltip.style.opacity = '0';
        }, 2000);
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
            // Hiển thị popover ở phía trên biểu tượng
            this.show(rect.left + window.scrollX - 220, rect.top + window.scrollY - this.popoverElement.offsetHeight - 10);
            this.updateVisibility();
        });

        // Khi không hover vào trigger nữa
        triggerElement.addEventListener('mouseleave', () => {
            isHoveringTrigger = false;
            setTimeout(() => this.updateVisibility(), 100);
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
        this.updateVisibility = () => {
            if (isHoveringTrigger || isHoveringPopover) {
                this.popoverElement.style.display = 'block';
            } else {
                this.popoverElement.style.display = 'none';
            }
        };
    }


    createPopoverCSS() {
        const style = document.createElement('style');
        style.textContent = `
            /* 1. Styling cho Coupon Popover */
            .coupon-popover {
                position: absolute;
                width: 300px;
                background-color: #fff;
                border-radius: 4px;
                box-shadow: 0 2px 20px rgba(0, 0, 0, 0.15);
                z-index: 1100;
                display: none;
                font-size: 14px;
            }

            /* Tạo mũi tên ở dưới popover (với CSS tương thích nhiều trình duyệt) */
            .coupon-popover:after {
                content: '';
                position: absolute;
                bottom: -10px;
                left: 50%;
                margin-left: -10px;
                border-width: 10px 10px 0;
                border-style: solid;
                border-color: #fff transparent transparent;
            }

            .popover-header {
                background-color: #f5f5fa;
                padding: 12px 15px;
                border-radius: 4px 4px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #eee;
            }

            .popover-code {
                font-weight: 600;
                color: #1a94ff;
                display: flex;
                align-items: center;
                gap: 5px;
                position: relative;
            }

            .popover-code i {
                cursor: pointer;
                color: #999;
                font-size: 12px;
                transition: color 0.2s;
            }

            .popover-code i:hover {
                color: #1a94ff;
            }

            /* Tooltip khi copy thành công */
            .copy-tooltip {
                position: absolute;
                right: -20px;
                top: -30px;
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 11px;
                visibility: hidden;
                opacity: 0;
                transition: opacity 0.3s;
                white-space: nowrap;
            }

            .copy-tooltip:after {
                content: '';
                position: absolute;
                bottom: -5px;
                left: 50%;
                margin-left: -5px;
                border-width: 5px 5px 0;
                border-style: solid;
                border-color: rgba(0, 0, 0, 0.7) transparent transparent;
            }

            .popover-content {
                padding: 15px;
            }

            .popover-detail {
                font-size: 13px;
            }

            .detail-row {
                margin-bottom: 12px;
            }

            .detail-label {
                color: #666;
                display: block;
                margin-bottom: 5px;
                font-weight: 500;
            }

            .detail-value {
                color: #333;
            }

            .detail-conditions {
                list-style-type: disc;
                margin: 0;
                padding-left: 18px;
                color: #333;
            }

            .detail-conditions li {
                margin-bottom: 6px;
                line-height: 1.3;
            }
        `
        return style;
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
        const expiryDate = icon.dataset.expiry || "30/08/2025";
        const conditions = [
            "Giảm 70K phí vận chuyển cho đơn hàng từ 100K.",
            "Chỉ áp dụng cho các sản phẩm có gắn nhãn Freeship Xtra"
        ];

        // Tạo và thiết lập popover
        const popover = new CouponPopover(couponCode, expiryDate, conditions);
        popover.setupTrigger(icon);
    });
}