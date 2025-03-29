/**
 * Hiển thị thông báo
 * @param {string} message Nội dung thông báo
 * @param {string} type Loại thông báo ('success', 'error', 'warning', 'info')
 * @param {number} duration Thời gian hiển thị (ms)
 */
export function showToast(message, type = 'info', duration = 3000) {
    // Kiểm tra xem đã có container cho toast chưa
    let toastContainer = document.querySelector('.toast-container');
    
    // Nếu chưa có, tạo mới
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        toastContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
        `;
        document.body.appendChild(toastContainer);
    }
    
    // Tạo toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
        min-width: 250px;
        margin-bottom: 10px;
        padding: 15px;
        border-radius: 4px;
        color: white;
        animation: fadeIn 0.5s, fadeOut 0.5s ${duration/1000 - 0.5}s;
        opacity: 0;
    `;
    
    // Set màu nền dựa vào loại thông báo
    switch(type) {
        case 'success':
            toast.style.backgroundColor = '#28a745';
            break;
        case 'error':
            toast.style.backgroundColor = '#dc3545';
            break;
        case 'warning':
            toast.style.backgroundColor = '#ffc107';
            toast.style.color = '#212529';
            break;
        default: // info
            toast.style.backgroundColor = '#17a2b8';
    }
    
    // Nội dung thông báo
    toast.textContent = message;
    
    // Thêm vào container
    toastContainer.appendChild(toast);
    
    // Hiệu ứng hiển thị
    setTimeout(() => {
        toast.style.opacity = '1';
    }, 10);
    
    // Tự động xóa sau khoảng thời gian
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            toastContainer.removeChild(toast);
            // Nếu không còn toast nào, xóa container
            if (toastContainer.children.length === 0) {
                document.body.removeChild(toastContainer);
            }
        }, 500);
    }, duration);
}

/**
 * Kiểm tra và xác thực các trường form
 * @param {Object} data Đối tượng chứa dữ liệu cần xác thực
 * @param {Object} rules Đối tượng chứa luật xác thực
 * @returns {Object} Kết quả xác thực {isValid, errors}
 */
export function validateForm(data, rules) {
    const errors = {};
    let isValid = true;
    
    // Duyệt qua từng luật
    for (const field in rules) {
        if (rules.hasOwnProperty(field)) {
            const fieldRules = rules[field];
            const value = data[field];
            
            // Kiểm tra từng luật cho trường hiện tại
            for (const rule of fieldRules) {
                // Kiểm tra trường bắt buộc
                if (rule.type === 'required' && (!value || value.trim() === '')) {
                    errors[field] = rule.message;
                    isValid = false;
                    break;
                }
                
                // Kiểm tra độ dài tối thiểu
                if (rule.type === 'minLength' && value && value.length < rule.value) {
                    errors[field] = rule.message;
                    isValid = false;
                    break;
                }
                
                // Kiểm tra độ dài tối đa
                if (rule.type === 'maxLength' && value && value.length > rule.value) {
                    errors[field] = rule.message;
                    isValid = false;
                    break;
                }
                
                // Kiểm tra theo regex
                if (rule.type === 'pattern' && value && !rule.pattern.test(value)) {
                    errors[field] = rule.message;
                    isValid = false;
                    break;
                }
                
                // Kiểm tra giá trị bằng nhau (ví dụ: mật khẩu và xác nhận mật khẩu)
                if (rule.type === 'match' && value !== data[rule.field]) {
                    errors[field] = rule.message;
                    isValid = false;
                    break;
                }
            }
        }
    }
    
    return { isValid, errors };
}

/**
 * Thêm CSS động vào trang
 * @param {string} id ID của stylesheet
 * @param {string} css Nội dung CSS
 */
export function addCss(id, css) {
    // Kiểm tra xem đã có stylesheet này chưa
    let style = document.getElementById(id);
    
    if (!style) {
        // Nếu chưa có, tạo mới
        style = document.createElement('style');
        style.id = id;
        style.type = 'text/css';
        document.head.appendChild(style);
    }
    
    // Thêm nội dung CSS
    if (style.styleSheet) {
        // IE
        style.styleSheet.cssText = css;
    } else {
        // Các trình duyệt khác
        style.innerHTML = css;
    }
}

/**
 * Lấy dữ liệu từ localStorage với hạn chế thời gian
 * @param {string} key Khóa lưu trữ
 * @returns {any} Dữ liệu đã lưu hoặc null nếu hết hạn
 */
export function getStorageItem(key) {
    const item = localStorage.getItem(key);
    if (!item) return null;
    
    try {
        const parsedItem = JSON.parse(item);
        
        // Kiểm tra thời gian hết hạn nếu có
        if (parsedItem.expiry && parsedItem.expiry < new Date().getTime()) {
            localStorage.removeItem(key);
            return null;
        }
        
        return parsedItem.value;
    } catch (error) {
        return item; // Trả về nguyên gốc nếu không phải JSON
    }
}

/**
 * Lưu dữ liệu vào localStorage với thời gian hết hạn
 * @param {string} key Khóa lưu trữ
 * @param {any} value Giá trị cần lưu
 * @param {number} expiryHours Số giờ tồn tại (không có = không hết hạn)
 */
export function setStorageItem(key, value, expiryHours = null) {
    const item = {
        value: value
    };
    
    // Thêm thời gian hết hạn nếu có
    if (expiryHours) {
        item.expiry = new Date().getTime() + expiryHours * 60 * 60 * 1000;
    }
    
    localStorage.setItem(key, JSON.stringify(item));
}

/**
 * Format ngày tháng theo định dạng Việt Nam
 * @param {Date|string} date Ngày cần format
 * @param {boolean} includeTime Có hiển thị giờ không
 * @returns {string} Chuỗi ngày đã format
 */
export function formatDate(date, includeTime = false) {
    if (!date) return '';
    
    const d = new Date(date);
    
    // Kiểm tra ngày hợp lệ
    if (isNaN(d.getTime())) {
        return '';
    }
    
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    let result = `${day}/${month}/${year}`;
    
    if (includeTime) {
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        result += ` ${hours}:${minutes}`;
    }
    
    return result;
}

/**
 * Format số tiền theo định dạng tiền Việt Nam
 * @param {number} amount Số tiền
 * @param {boolean} includeCurrency Có hiển thị đơn vị tiền tệ không
 * @returns {string} Chuỗi tiền đã format
 */
export function formatCurrency(amount, includeCurrency = true) {
    if (amount === null || amount === undefined) return '';
    
    const formatter = new Intl.NumberFormat('vi-VN');
    const formatted = formatter.format(amount);
    
    return includeCurrency ? `${formatted} ₫` : formatted;
}

/**
 * Tạo ID ngẫu nhiên
 * @param {number} length Độ dài ID (mặc định: 10)
 * @returns {string} ID ngẫu nhiên
 */
export function generateId(length = 10) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        result += charset.charAt(randomIndex);
    }
    
    return result;
}

/**
 * Chèn CSS cho toast và các hiệu ứng
 */
(function initToastStyles() {
    const toastCss = `
        @keyframes fadeIn {
            from {opacity: 0;}
            to {opacity: 1;}
        }
        
        @keyframes fadeOut {
            from {opacity: 1;}
            to {opacity: 0;}
        }
        
        .toast-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
        }
        
        .toast {
            min-width: 250px;
            margin-bottom: 10px;
            padding: 15px;
            border-radius: 4px;
            color: white;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
    `;
    
    addCss('toast-styles', toastCss);
})();