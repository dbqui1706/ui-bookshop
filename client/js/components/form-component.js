/**
 * Component xử lý form
 */
export class FormComponent {
    /**
     * Khởi tạo form component
     * @param {string} formId ID của form
     */
    constructor(formId) {
        this.formElement = document.getElementById(formId);
        this.fields = {};
        this.validators = {};
        this.submitHandler = null;
        
        // Nếu tìm thấy form thì thiết lập sự kiện
        if (this.formElement) {
            this.formElement.addEventListener('submit', this.handleSubmit.bind(this));
        } else {
            console.error(`Form với ID "${formId}" không tồn tại`);
        }
    }
    
    /**
     * Thêm field vào form
     * @param {string} fieldId ID của field
     * @param {Object} options Tùy chọn cho field
     * @param {Function} options.validator Hàm xác thực
     * @param {boolean} options.required Field bắt buộc
     * @param {string} options.errorMessage Thông báo lỗi mặc định
     */
    addField(fieldId, options = {}) {
        const field = document.getElementById(fieldId);
        
        if (field) {
            this.fields[fieldId] = field;
            
            // Thiết lập validator
            if (options.validator) {
                this.validators[fieldId] = options.validator;
            }
            
            // Thêm các thuộc tính
            if (options.required) {
                field.setAttribute('required', 'required');
            }
            
            // Thiết lập sự kiện blur để xác thực
            field.addEventListener('blur', () => {
                this.validateField(fieldId);
            });
            
            // Thiết lập sự kiện input để xóa lỗi khi người dùng nhập
            field.addEventListener('input', () => {
                this.clearFieldError(fieldId);
            });
        } else {
            console.warn(`Field với ID "${fieldId}" không tồn tại`);
        }
        
        return this;
    }
    
    /**
     * Xác thực một field
     * @param {string} fieldId ID của field
     * @returns {boolean} Kết quả xác thực
     */
    validateField(fieldId) {
        const field = this.fields[fieldId];
        
        if (!field) {
            console.warn(`Field với ID "${fieldId}" không tồn tại`);
            return false;
        }
        
        // Lấy giá trị field
        const value = field.value;
        
        // Kiểm tra required
        if (field.hasAttribute('required') && !value.trim()) {
            this.setFieldError(fieldId, 'Trường này là bắt buộc');
            return false;
        }
        
        // Kiểm tra bằng validator (nếu có)
        if (this.validators[fieldId]) {
            const result = this.validators[fieldId](value);
            
            if (result !== true) {
                const errorMessage = typeof result === 'string' ? result : 'Giá trị không hợp lệ';
                this.setFieldError(fieldId, errorMessage);
                return false;
            }
        }
        
        // Xóa lỗi nếu hợp lệ
        this.clearFieldError(fieldId);
        return true;
    }
    
    /**
     * Xác thực tất cả các field
     * @returns {boolean} Kết quả xác thực
     */
    validateAll() {
        let isValid = true;
        
        // Xác thực tất cả các field
        for (const fieldId in this.fields) {
            if (!this.validateField(fieldId)) {
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    /**
     * Đặt lỗi cho field
     * @param {string} fieldId ID của field
     * @param {string} message Thông báo lỗi
     */
    setFieldError(fieldId, message) {
        const field = this.fields[fieldId];
        
        if (!field) return;
        
        // Thêm class lỗi
        field.classList.add('is-invalid');
        
        // Tạo hoặc cập nhật thông báo lỗi
        let errorDiv = field.nextElementSibling;
        
        if (!errorDiv || !errorDiv.classList.contains('invalid-feedback')) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            field.parentNode.insertBefore(errorDiv, field.nextSibling);
        }
        
        errorDiv.textContent = message;
    }
    
    /**
     * Xóa lỗi cho field
     * @param {string} fieldId ID của field
     */
    clearFieldError(fieldId) {
        const field = this.fields[fieldId];
        
        if (!field) return;
        
        // Xóa class lỗi
        field.classList.remove('is-invalid');
        
        // Xóa thông báo lỗi nếu có
        const errorDiv = field.nextElementSibling;
        
        if (errorDiv && errorDiv.classList.contains('invalid-feedback')) {
            errorDiv.textContent = '';
        }
    }
    
    /**
     * Xóa tất cả lỗi
     */
    clearAllErrors() {
        for (const fieldId in this.fields) {
            this.clearFieldError(fieldId);
        }
    }
    
    /**
     * Đặt giá trị cho field
     * @param {string} fieldId ID của field
     * @param {string} value Giá trị
     */
    setFieldValue(fieldId, value) {
        const field = this.fields[fieldId];
        
        if (!field) return;
        
        // Đặt giá trị
        field.value = value;
        
        // Xóa lỗi
        this.clearFieldError(fieldId);
    }
    
    /**
     * Lấy giá trị từ field
     * @param {string} fieldId ID của field
     * @returns {string} Giá trị của field
     */
    getFieldValue(fieldId) {
        const field = this.fields[fieldId];
        
        return field ? field.value : null;
    }
    
    /**
     * Lấy tất cả giá trị từ form
     * @returns {Object} Đối tượng chứa tất cả giá trị
     */
    getValues() {
        const values = {};
        
        for (const fieldId in this.fields) {
            values[fieldId] = this.getFieldValue(fieldId);
        }
        
        return values;
    }
    
    /**
     * Thiết lập tất cả giá trị cho form
     * @param {Object} values Đối tượng chứa giá trị
     */
    setValues(values) {
        for (const fieldId in values) {
            this.setFieldValue(fieldId, values[fieldId]);
        }
    }
    
    /**
     * Reset form về trạng thái ban đầu
     */
    reset() {
        if (this.formElement) {
            this.formElement.reset();
        }
        
        this.clearAllErrors();
    }
    
    /**
     * Thiết lập xử lý khi submit form
     * @param {Function} handler Hàm xử lý
     */
    onSubmit(handler) {
        this.submitHandler = handler;
    }
    
    /**
     * Xử lý sự kiện submit
     * @param {Event} event Sự kiện submit
     */
    handleSubmit(event) {
        event.preventDefault();
        
        // Xác thực tất cả các field
        const isValid = this.validateAll();
        
        // Nếu hợp lệ và có xử lý thì gọi
        if (isValid && this.submitHandler) {
            this.submitHandler(this.getValues());
        }
    }
    
    /**
     * Hiển thị phản hồi lỗi từ API
     * @param {Object} errors Đối tượng chứa lỗi
     */
    showApiErrors(errors) {
        if (!errors) return;
        
        // Xóa tất cả lỗi hiện tại
        this.clearAllErrors();
        
        // Hiển thị lỗi mới
        for (const fieldId in errors) {
            if (this.fields[fieldId]) {
                this.setFieldError(fieldId, errors[fieldId]);
            }
        }
    }
}