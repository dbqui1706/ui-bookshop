import { generateUniqueId } from '../../core/utils.js';

/**
 * Class ModalComponent - Component quản lý modal/dialog
 */
export class ModalComponent {
    /**
     * Khởi tạo modal
     * @param {Object} options - Các tùy chọn của modal
     * @param {string} options.id - ID của modal (nếu không cung cấp sẽ được tạo tự động)
     * @param {string} options.title - Tiêu đề của modal
     * @param {string} options.content - Nội dung HTML của modal
     * @param {string} options.size - Kích thước modal (sm, md, lg, xl)
     * @param {boolean} options.closeButton - Hiển thị nút đóng trong header
     * @param {boolean} options.backdrop - Cho phép đóng modal khi click ra ngoài
     * @param {boolean} options.keyboard - Cho phép đóng modal bằng phím Esc
     * @param {Object} options.buttons - Các nút trong footer modal
     */
    constructor(options = {}) {
        this.id = options.id || `modal-${generateUniqueId()}`;
        this.title = options.title || '';
        this.content = options.content || '';
        this.size = options.size || 'md';
        this.closeButton = options.closeButton !== undefined ? options.closeButton : true;
        this.backdrop = options.backdrop !== undefined ? options.backdrop : true;
        this.keyboard = options.keyboard !== undefined ? options.keyboard : true;
        this.buttons = options.buttons || {};
        
        this.modalElement = null;
        this.bsModal = null;
        
        // Khởi tạo modal
        this.initialize();
    }

    /**
     * Khởi tạo modal
     */
    initialize() {
        // Tạo element modal
        this.createModalElement();
        
        // Thêm modal vào DOM
        document.body.appendChild(this.modalElement);
        
        // Khởi tạo modal Bootstrap
        this.bsModal = new bootstrap.Modal(this.modalElement, {
            backdrop: this.backdrop ? true : 'static',
            keyboard: this.keyboard
        });
        
        // Đăng ký sự kiện
        this.registerEventListeners();
    }

    /**
     * Tạo element modal
     */
    createModalElement() {
        // Tạo container cho modal
        this.modalElement = document.createElement('div');
        this.modalElement.className = 'modal fade';
        this.modalElement.id = this.id;
        this.modalElement.tabIndex = -1;
        this.modalElement.setAttribute('aria-labelledby', `${this.id}-label`);
        this.modalElement.setAttribute('aria-hidden', 'true');
        
        // Xác định class cho kích thước modal
        let modalDialogClass = 'modal-dialog';
        if (this.size) {
            modalDialogClass += ` modal-${this.size}`;
        }
        
        // Tạo HTML cho modal
        this.modalElement.innerHTML = `
            <div class="${modalDialogClass}">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="${this.id}-label">${this.title}</h5>
                        ${this.closeButton ? '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' : ''}
                    </div>
                    <div class="modal-body">
                        ${this.content}
                    </div>
                    <div class="modal-footer">
                        ${this.renderButtons()}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render các nút trong footer modal
     * @returns {string} - HTML string các nút
     */
    renderButtons() {
        let buttonsHtml = '';
        
        // Nút Hủy mặc định
        if (this.buttons.cancel !== false) {
            const cancelText = this.buttons.cancelText || 'Hủy';
            buttonsHtml += `
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${cancelText}</button>
            `;
        }
        
        // Các nút tùy chỉnh
        if (this.buttons.custom) {
            this.buttons.custom.forEach(button => {
                buttonsHtml += `
                    <button type="button" class="btn ${button.class || 'btn-primary'}" id="${button.id || `${this.id}-${button.text}`}">${button.text}</button>
                `;
            });
        }
        
        // Nút OK/Lưu mặc định
        if (this.buttons.ok !== false) {
            const okText = this.buttons.okText || 'Lưu';
            buttonsHtml += `
                <button type="button" class="btn btn-primary" id="${this.id}-ok">${okText}</button>
            `;
        }
        
        return buttonsHtml;
    }

    /**
     * Đăng ký các event listeners
     */
    registerEventListeners() {
        // Xử lý sự kiện khi nút OK được click
        const okButton = this.modalElement.querySelector(`#${this.id}-ok`);
        if (okButton && this.buttons.onOk) {
            okButton.addEventListener('click', () => {
                this.buttons.onOk();
            });
        }
        
        // Xử lý sự kiện cho các nút tùy chỉnh
        if (this.buttons.custom) {
            this.buttons.custom.forEach(button => {
                if (button.onClick) {
                    const buttonElement = this.modalElement.querySelector(`#${button.id || `${this.id}-${button.text}`}`);
                    if (buttonElement) {
                        buttonElement.addEventListener('click', () => {
                            button.onClick();
                        });
                    }
                }
            });
        }
        
        // Xử lý sự kiện khi modal được hiển thị
        this.modalElement.addEventListener('shown.bs.modal', () => {
            if (this.buttons.onShown) {
                this.buttons.onShown();
            }
        });
        
        // Xử lý sự kiện khi modal bị ẩn
        this.modalElement.addEventListener('hidden.bs.modal', () => {
            if (this.buttons.onHidden) {
                this.buttons.onHidden();
            }
        });
    }

    /**
     * Hiển thị modal
     */
    show() {
        this.bsModal.show();
    }

    /**
     * Ẩn modal
     */
    hide() {
        this.bsModal.hide();
    }

    /**
     * Cập nhật tiêu đề modal
     * @param {string} title - Tiêu đề mới
     */
    setTitle(title) {
        this.title = title;
        const titleElement = this.modalElement.querySelector('.modal-title');
        if (titleElement) {
            titleElement.textContent = title;
        }
    }

    /**
     * Cập nhật nội dung modal
     * @param {string} content - Nội dung HTML mới
     */
    setContent(content) {
        this.content = content;
        const bodyElement = this.modalElement.querySelector('.modal-body');
        if (bodyElement) {
            bodyElement.innerHTML = content;
        }
    }

    /**
     * Xóa modal khỏi DOM
     */
    destroy() {
        if (this.bsModal) {
            this.bsModal.dispose();
        }
        
        if (this.modalElement && this.modalElement.parentNode) {
            this.modalElement.parentNode.removeChild(this.modalElement);
        }
    }
}