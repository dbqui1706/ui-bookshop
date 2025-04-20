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
export function showConfirmDialog(title, text, confirmButtonText, onConfirm, html) {
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

/**
 * Định dạng số dạng tiền tệ
 * @param {number} amount - Số tiền
 * @param {string} currency - Loại tiền tệ (mặc định: VND)
 * @param {boolean} showSymbol - Hiển thị ký hiệu tiền tệ
 * @returns {string} - Chuỗi đã định dạng
 */
export const formatCurrency = (amount, currency = 'VND', showSymbol = true) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
        return '0 ₫';
    }
    
    let formattedAmount;
    
    if (currency === 'VND') {
        // Định dạng tiền Việt
        formattedAmount = new Intl.NumberFormat('vi-VN').format(Math.round(amount));
        return showSymbol ? `${formattedAmount} ₫` : formattedAmount;
    } else {
        // Định dạng tiền khác
        formattedAmount = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2
        }).format(amount);
        return showSymbol ? formattedAmount : formattedAmount.replace(/[^\d.,]/g, '');
    }
};



/**
 * Format số lượng
 * @param {number} quantity - Số lượng
 * @returns {string} - Số lượng đã định dạng
 */
export const formatQuantity = (quantity) => {
    if (quantity === null || quantity === undefined || isNaN(quantity)) {
        return '0';
    }
    
    return new Intl.NumberFormat('vi-VN').format(quantity);
};

/**
 * Format phần trăm
 * @param {number} percent - Giá trị phần trăm
 * @param {number} decimal - Số chữ số thập phân
 * @returns {string} - Chuỗi phần trăm đã định dạng
 */
export const formatPercent = (percent, decimal = 1) => {
    if (percent === null || percent === undefined || isNaN(percent)) {
        return '0%';
    }
    
    return `${percent.toFixed(decimal)}%`;
};

/**
 * Trích xuất tham số từ URL
 * @param {string} name - Tên tham số
 * @returns {string|null} - Giá trị tham số hoặc null nếu không tồn tại
 */
export const getUrlParameter = (name) => {
    const url = window.location.search;
    const searchParams = new URLSearchParams(url);
    return searchParams.get(name);
};

/**
 * Tạo ID duy nhất
 * @returns {string} - ID duy nhất
 */
export const generateUniqueId = () => {
    return `id_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Tạo dữ liệu mẫu
 * @param {number} count - Số lượng dữ liệu cần tạo
 * @param {Function} generator - Hàm tạo dữ liệu mẫu
 * @returns {Array} - Mảng dữ liệu mẫu
 */
export const generateSampleData = (count, generator) => {
    const result = [];
    for (let i = 0; i < count; i++) {
        result.push(generator(i));
    }
    return result;
};

/**
 * Chuyển đổi màu từ hex sang rgba
 * @param {string} hex - Mã màu hex (ví dụ: #ffffff)
 * @param {number} alpha - Độ trong suốt (0-1)
 * @returns {string} - Chuỗi màu rgba
 */
export const hexToRgba = (hex, alpha = 1) => {
    if (!hex) return 'rgba(0, 0, 0, ' + alpha + ')';
    
    // Loại bỏ ký tự # nếu có
    hex = hex.replace('#', '');
    
    // Kiểm tra độ dài của hex
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    
    // Chuyển đổi sang RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * Trả về URL của ảnh sản phẩm
 * @param {string} imageName - Tên file ảnh
 * @returns {string} - URL đầy đủ của ảnh
 */
export const getProductImageUrl = (imageName) => {
    if (!imageName) {
        return '/assets/images/image.png';
    }
    
    return `/assets/images/${imageName}`;
};

/**
 * Format tên file, giới hạn độ dài
 * @param {string} filename - Tên file
 * @param {number} maxLength - Độ dài tối đa
 * @returns {string} - Tên file đã được cắt ngắn nếu cần
 */
export const formatFilename = (filename, maxLength = 20) => {
    if (!filename) return '';
    
    if (filename.length <= maxLength) {
        return filename;
    }
    
    // Tách tên file và phần mở rộng
    const lastDot = filename.lastIndexOf('.');
    const extension = filename.substring(lastDot);
    const name = filename.substring(0, lastDot);
    
    // Cắt tên file để đảm bảo tổng độ dài không vượt quá maxLength
    const truncatedName = name.substring(0, maxLength - 3 - extension.length);
    
    return `${truncatedName}...${extension}`;
};

// Tạo màu động dựa trên tên danh mục để đảm bảo tính nhất quán
export const generateColorFromString = (str) => {
    // Tạo mã màu dựa trên chuỗi đầu vào
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Chuyển số hash thành màu hex dạng #RRGGBB
    let color = '#';
    for (let i = 0; i < 3; i++) {
        // Lấy giá trị từ 0-255 cho RGB
        const value = (hash >> (i * 8)) & 0xFF;
        // Điều chỉnh độ sáng để tránh màu quá tối hoặc quá sáng
        const adjustedValue = Math.max(Math.min(value, 220), 50);
        // Chuyển thành hex
        color += ('00' + adjustedValue.toString(16)).substr(-2);
    }

    return color;
};