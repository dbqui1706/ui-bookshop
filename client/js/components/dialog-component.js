/**
 * Tạo modal dialog
 */
export class DialogComponent {
    /**
     * Khởi tạo dialog
     * @param {Object} options Tùy chọn dialog
     * @param {string} options.id ID của dialog
     * @param {string} options.title Tiêu đề dialog
     * @param {string} options.content Nội dung dialog
     * @param {Array} options.buttons Các nút trong dialog
     * @param {boolean} options.closeButton Hiển thị nút đóng
     * @param {string} options.size Kích thước dialog ('sm', 'lg', 'xl')
     */
    constructor(options = {}) {
        this.options = {
            id: options.id || `dialog-${Date.now()}`,
            title: options.title || 'Thông báo',
            content: options.content || '',
            buttons: options.buttons || [],
            closeButton: options.closeButton !== undefined ? options.closeButton : true,
            size: options.size || '' // '', 'modal-sm', 'modal-lg', 'modal-xl'
        };
        
        this.element = null;
        this.createDialog();
    }
    
    /**
     * Tạo HTML cho dialog
     */
    createDialog() {
        // Kiểm tra xem đã có dialog này chưa
        let existingDialog = document.getElementById(this.options.id);
        if (existingDialog) {
            document.body.removeChild(existingDialog);
        }
        
        // Tạo container cho dialog
        this.element = document.createElement('div');
        this.element.className = 'modal fade';
        this.element.id = this.options.id;
        this.element.tabIndex = -1;
        this.element.setAttribute('aria-hidden', 'true');
        
        // Size class
        const sizeClass = this.options.size ? `modal-dialog ${this.options.size}` : 'modal-dialog';
        
        // Tạo nội dung dialog
        this.element.innerHTML = `
            <div class="${sizeClass}">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${this.options.title}</h5>
                        ${this.options.closeButton ? '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' : ''}
                    </div>
                    <div class="modal-body">
                        ${this.options.content}
                    </div>
                    ${this.options.buttons.length > 0 ? `
                        <div class="modal-footer">
                            ${this.options.buttons.map(button => `
                                <button type="button" 
                                    class="btn ${button.class || 'btn-secondary'}" 
                                    id="${button.id || ''}"
                                    ${button.dismiss ? 'data-bs-dismiss="modal"' : ''}>
                                    ${button.text}
                                </button>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        // Thêm vào body
        document.body.appendChild(this.element);
        
        // Khởi tạo Modal từ Bootstrap
        this.modal = new bootstrap.Modal(this.element);
        
        // Thiết lập các sự kiện cho nút
        this.setupButtonEvents();
    }
    
    /**
     * Thiết lập sự kiện cho các nút
     */
    setupButtonEvents() {
        this.options.buttons.forEach(button => {
            if (button.id && button.onClick) {
                const buttonElement = this.element.querySelector(`#${button.id}`);
                if (buttonElement) {
                    buttonElement.addEventListener('click', (event) => {
                        button.onClick(event);
                        if (button.dismiss) {
                            this.hide();
                        }
                    });
                }
            }
        });
    }
    
    /**
     * Hiển thị dialog
     */
    show() {
        this.modal.show();
    }
    
    /**
     * Ẩn dialog
     */
    hide() {
        this.modal.hide();
    }
    
    /**
     * Cập nhật nội dung dialog
     * @param {string} content Nội dung mới
     */
    updateContent(content) {
        const modalBody = this.element.querySelector('.modal-body');
        if (modalBody) {
            modalBody.innerHTML = content;
        }
    }
    
    /**
     * Cập nhật tiêu đề dialog
     * @param {string} title Tiêu đề mới
     */
    updateTitle(title) {
        const modalTitle = this.element.querySelector('.modal-title');
        if (modalTitle) {
            modalTitle.innerHTML = title;
        }
    }
    
    /**
     * Thêm lớp CSS cho dialog
     * @param {string} className Tên lớp CSS
     */
    addClass(className) {
        this.element.classList.add(className);
    }
    
    /**
     * Xóa lớp CSS khỏi dialog
     * @param {string} className Tên lớp CSS
     */
    removeClass(className) {
        this.element.classList.remove(className);
    }
    
    /**
     * Tạo và hiển thị dialog thông báo
     * @param {string} message Nội dung thông báo
     * @param {string} title Tiêu đề thông báo
     * @param {Function} callback Hàm gọi lại khi đóng
     * @returns {DialogComponent} Instance của dialog
     */
    static alert(message, title = 'Thông báo', callback = null) {
        const dialog = new DialogComponent({
            title: title,
            content: message,
            buttons: [
                {
                    text: 'Đóng',
                    class: 'btn-primary',
                    id: 'btn-alert-close',
                    dismiss: true,
                    onClick: callback
                }
            ]
        });
        
        dialog.show();
        return dialog;
    }
    
    /**
     * Tạo và hiển thị dialog xác nhận
     * @param {string} message Nội dung xác nhận
     * @param {string} title Tiêu đề xác nhận
     * @param {Function} onConfirm Hàm gọi lại khi xác nhận
     * @param {Function} onCancel Hàm gọi lại khi hủy
     * @returns {DialogComponent} Instance của dialog
     */
    static confirm(message, title = 'Xác nhận', onConfirm = null, onCancel = null) {
        const dialog = new DialogComponent({
            title: title,
            content: message,
            buttons: [
                {
                    text: 'Hủy',
                    class: 'btn-secondary',
                    id: 'btn-confirm-cancel',
                    dismiss: true,
                    onClick: onCancel
                },
                {
                    text: 'Đồng ý',
                    class: 'btn-primary',
                    id: 'btn-confirm-ok',
                    dismiss: true,
                    onClick: onConfirm
                }
            ]
        });
        
        dialog.show();
        return dialog;
    }
    
    /**
     * Tạo và hiển thị dialog nhập liệu
     * @param {string} message Nội dung prompt
     * @param {string} title Tiêu đề prompt
     * @param {string} defaultValue Giá trị mặc định
     * @param {Function} onConfirm Hàm gọi lại khi xác nhận
     * @param {Function} onCancel Hàm gọi lại khi hủy
     * @returns {DialogComponent} Instance của dialog
     */
    static prompt(message, title = 'Nhập thông tin', defaultValue = '', onConfirm = null, onCancel = null) {
        const inputId = `prompt-input-${Date.now()}`;
        const content = `
            <p>${message}</p>
            <div class="form-group">
                <input type="text" class="form-control" id="${inputId}" value="${defaultValue}">
            </div>
        `;
        
        const dialog = new DialogComponent({
            title: title,
            content: content,
            buttons: [
                {
                    text: 'Hủy',
                    class: 'btn-secondary',
                    id: 'btn-prompt-cancel',
                    dismiss: true,
                    onClick: onCancel
                },
                {
                    text: 'Đồng ý',
                    class: 'btn-primary',
                    id: 'btn-prompt-ok',
                    dismiss: true,
                    onClick: (event) => {
                        const input = document.getElementById(inputId);
                        if (input && onConfirm) {
                            onConfirm(input.value);
                        }
                    }
                }
            ]
        });
        
        dialog.show();
        
        // Focus vào input
        setTimeout(() => {
            const input = document.getElementById(inputId);
            if (input) {
                input.focus();
                input.select();
            }
        }, 300);
        
        return dialog;
    }
}