/**
 * Utility functions - Các hàm tiện ích sử dụng trong ứng dụng
 */

/**
 * Định dạng ngày tháng theo định dạng Việt Nam
 * @param {string} dateString - Chuỗi ngày tháng
 * @returns {string} - Chuỗi ngày tháng đã được định dạng
 */
export function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Tạo ID duy nhất cho các element
 * @returns {string} - ID duy nhất
 */
export function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Chuyển đổi chuỗi thành slug (dùng cho URL, code, etc.)
 * @param {string} text - Chuỗi cần chuyển đổi
 * @returns {string} - Chuỗi đã được chuyển đổi
 */
export function slugify(text) {
    return text.toLowerCase()
        .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a")
        .replace(/[èéẹẻẽêềếệểễ]/g, "e")
        .replace(/[ìíịỉĩ]/g, "i")
        .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o")
        .replace(/[ùúụủũưừứựửữ]/g, "u")
        .replace(/[ỳýỵỷỹ]/g, "y")
        .replace(/đ/g, "d")
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '');
}

/**
 * Hiển thị thông báo bằng SweetAlert2
 * @param {string} icon - Icon của thông báo (success, error, warning, info, question)
 * @param {string} title - Tiêu đề thông báo
 * @param {string} text - Nội dung thông báo
 * @param {Object} options - Tùy chọn thêm
 */
export function showNotification(icon, title, text, options = {}) {
    const defaultOptions = {
        icon,
        title,
        text,
        timer: 3000,
        showConfirmButton: false
    };

    Swal.fire({
        ...defaultOptions,
        ...options
    });
}

/**
 * Hiển thị hộp thoại xác nhận
 * @param {string} title - Tiêu đề
 * @param {string} text - Nội dung
 * @param {string} confirmButtonText - Nội dung nút xác nhận
 * @param {Function} onConfirm - Hàm xử lý khi người dùng xác nhận
 */
export function showConfirmDialog(title, text, confirmButtonText, onConfirm) {
    Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: confirmButtonText || 'Xác nhận',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed && onConfirm) {
            onConfirm();
        }
    });
}

/**
 * Viết hoa chữ cái đầu của chuỗi
 * @param {string} text - Chuỗi cần viết hoa
 * @returns {string} - Chuỗi đã được viết hoa chữ cái đầu
 */
export function capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Debounce function - Hạn chế số lần gọi hàm
 * @param {Function} func - Hàm cần debounce
 * @param {number} wait - Thời gian chờ (milliseconds)
 * @returns {Function} - Hàm đã được debounce
 */
export function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}