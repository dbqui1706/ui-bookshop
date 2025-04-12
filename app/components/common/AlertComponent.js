import { generateUniqueId } from '../../core/utils.js';

/**
 * Class AlertComponent - Component hiển thị thông báo
 */
export class AlertComponent {
    /**
     * Khởi tạo component Alert
     * @param {Object} options - Các tùy chọn
     * @param {string} options.container - CSS selector của container
     * @param {string} options.type - Loại alert (success, danger, warning, info)
     * @param {string} options.message - Nội dung thông báo
     * @param {boolean} options.dismissible - Cho phép đóng alert
     * @param {boolean} options.autoDismiss - Tự động đóng alert sau một khoảng thời gian
     * @param {number} options.autoDismissDelay - Thời gian tự động đóng (ms)
     */
    constructor(options = {}) {
        this.id = options.id || `alert-${generateUniqueId()}`;
        this.container = options.container || document.body;
        this.type = options.type || 'info';
        this.message = options.message || '';
        this.dismissible = options.dismissible !== undefined ? options.dismissible : true;
        this.autoDismiss = options.autoDismiss !== undefined ? options.autoDismiss : false;
        this.autoDismissDelay = options.autoDismissDelay || 5000;
        
        this.element = null;
        this.dismissTimer = null;
        
        // Kiểm tra container
        if (typeof this.container === 'string') {
            this.container = document.querySelector(this.container);
        }
        
        if (!this.container) {
            console.error('Alert container not found');
            return;
        }
        
        // Khởi tạo alert
        this.initialize();
    }

    /**
     * Khởi tạo alert
     */
    initialize() {
        // Tạo element alert
        this.createAlertElement();
        
        // Thêm alert vào container
        this.container.appendChild(this.element);
        
        // Đăng ký sự kiện đóng
        if (this.dismissible) {
            const closeButton = this.element.querySelector('.btn-close');
            if (closeButton) {
                closeButton.addEventListener('click', () => this.dismiss());
            }
        }
        
        // Tự động đóng nếu cần
        if (this.autoDismiss) {
            this.dismissTimer = setTimeout(() => {
                this.dismiss();
            }, this.autoDismissDelay);
        }
    }

    /**
     * Tạo element alert
     */
    createAlertElement() {
        // Tạo container cho alert
        this.element = document.createElement('div');
        this.element.className = `alert alert-${this.type} ${this.dismissible ? 'alert-dismissible' : ''} fade show`;
        this.element.id = this.id;
        this.element.role = 'alert';
        
        // Tạo nội dung cho alert
        this.element.innerHTML = `
            ${this.message}
            ${this.dismissible ? '<button type="button" class="btn-close" aria-label="Close"></button>' : ''}
        `;
    }

    /**
     * Ẩn và xóa alert
     */
    dismiss() {
        // Xóa timer nếu có
        if (this.dismissTimer) {
            clearTimeout(this.dismissTimer);
            this.dismissTimer = null;
        }
        
        // Thêm event listener cho sự kiện 'hidden.bs.alert'
        this.element.addEventListener('hidden.bs.alert', () => {
            // Xóa alert khỏi DOM sau khi animation kết thúc
            if (this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
        });
        
        // Trigger bootstrap alert hide
        bootstrap.Alert.getOrCreateInstance(this.element).close();
    }

    /**
     * Cập nhật nội dung alert
     * @param {string} message - Nội dung mới
     */
    updateMessage(message) {
        this.message = message;
        
        // Cập nhật nội dung alert
        if (this.element) {
            const content = this.element.querySelector(':not(.btn-close)');
            if (content) {
                content.textContent = message;
            } else {
                // Nếu không tìm thấy nội dung, thay thế toàn bộ
                this.element.innerHTML = `
                    ${message}
                    ${this.dismissible ? '<button type="button" class="btn-close" aria-label="Close"></button>' : ''}
                `;
                
                // Đăng ký lại sự kiện đóng
                if (this.dismissible) {
                    const closeButton = this.element.querySelector('.btn-close');
                    if (closeButton) {
                        closeButton.addEventListener('click', () => this.dismiss());
                    }
                }
            }
        }
    }

    /**
     * Thay đổi kiểu alert
     * @param {string} type - Kiểu mới (success, danger, warning, info)
     */
    updateType(type) {
        if (this.element) {
            // Xóa class kiểu cũ
            this.element.classList.remove(`alert-${this.type}`);
            
            // Cập nhật kiểu
            this.type = type;
            
            // Thêm class kiểu mới
            this.element.classList.add(`alert-${this.type}`);
        }
    }

    /**
     * Hiển thị alert thành công
     * @param {string} container - CSS selector của container
     * @param {string} message - Nội dung thông báo
     * @param {Object} options - Các tùy chọn khác
     * @returns {AlertComponent} - Instance của AlertComponent
     */
    static success(container, message, options = {}) {
        return new AlertComponent({
            container,
            type: 'success',
            message,
            ...options
        });
    }

    /**
     * Hiển thị alert lỗi
     * @param {string} container - CSS selector của container
     * @param {string} message - Nội dung thông báo
     * @param {Object} options - Các tùy chọn khác
     * @returns {AlertComponent} - Instance của AlertComponent
     */
    static danger(container, message, options = {}) {
        return new AlertComponent({
            container,
            type: 'danger',
            message,
            ...options
        });
    }

    /**
     * Hiển thị alert cảnh báo
     * @param {string} container - CSS selector của container
     * @param {string} message - Nội dung thông báo
     * @param {Object} options - Các tùy chọn khác
     * @returns {AlertComponent} - Instance của AlertComponent
     */
    static warning(container, message, options = {}) {
        return new AlertComponent({
            container,
            type: 'warning',
            message,
            ...options
        });
    }

    /**
     * Hiển thị alert thông tin
     * @param {string} container - CSS selector của container
     * @param {string} message - Nội dung thông báo
     * @param {Object} options - Các tùy chọn khác
     * @returns {AlertComponent} - Instance của AlertComponent
     */
    static info(container, message, options = {}) {
        return new AlertComponent({
            container,
            type: 'info',
            message,
            ...options
        });
    }
}