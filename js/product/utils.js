export const stockFilterMap = {
    DEFAULT: "Tất cả",
    AVAILABLE: "Còn hàng",
    ALMOST_OUT_OF_STOCK: "Sắp hết",
    OUT_OF_STOCK: "Hết hàng"
};

export const badgeStockMap = {
    'AVAILABLE': `<span class="badge bg-success">Còn hàng</span>`,
    'ALMOST_OUT_OF_STOCK': `<span class="badge bg-warning text-dark">Sắp hết</span>`,
    'OUT_OF_STOCK': `<span class="badge bg-danger">Hết hàng</span>`
};

export const sortOptionMap = {
    DEFAULT: "Mặc định",
    PRICE_ASC: "Giá tăng dần",
    PRICE_DESC: "Giá giảm dần",
    NAME_ASC: "Tên A-Z",
    NAME_DESC: "Tên Z-A",
    POPULARITY_ASC: "Phổ biến nhất",
    CREATED_AT_ASC: "Cũ nhất",
    CREATED_AT_DESC: "Mới nhất"
};

export const formatCurrency = (price) => {
    if (typeof price !== 'number' || isNaN(price)) {
        console.error('Giá trị không hợp lệ:', price);
        return 'N/A';
    }

    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
    }).format(price);
};

export const formatDateTime = (date) => {
    return new Intl.DateTimeFormat('vi-VN', {
        dateStyle: 'full',
        timeStyle: 'long'
    }).format(new Date(date));
};

export const showLoading = () => {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
        setTimeout(() => loadingOverlay.classList.add('show'), 10);
    }
};

export const hideLoading = () => {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('show');
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 300);
    }
};

export const initializeSelect2 = () => {
    if (typeof jQuery !== 'undefined' && typeof jQuery.fn.select2 !== 'undefined') {
        $('.form-select').each(function () {
            $(this).select2({
                minimumResultsForSearch: Infinity,
                dropdownAutoWidth: true,
                width: '100%'
            });
        });

        $('.select2-results__options').css('max-height', '300px');
    } else {
        console.error("jQuery hoặc Select2 chưa được tải!");
    }
};

/**
 * Hiển thị thông báo
 * @param {string} message Nội dung thông báo
 * @param {string} type Loại thông báo (success, error, warning, info)
 */
export const showNotification = (message, type = 'info') => {
    // Kiểm tra xem đã có container thông báo chưa
    let notificationContainer = document.querySelector('.notification-container');

    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container position-fixed top-0 end-0 p-3';
        notificationContainer.style.zIndex = '9999';
        document.body.appendChild(notificationContainer);
    }

    // Tạo thông báo
    const notification = document.createElement('div');
    notification.className = `toast show bg-${type === 'error' ? 'danger' : type}`;
    notification.style.minWidth = '250px';
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'assertive');
    notification.setAttribute('aria-atomic', 'true');

    notification.innerHTML = `
        <div class="toast-header">
            <strong class="me-auto">${type === 'success' ? 'Thành công' : type === 'error' ? 'Lỗi' : 'Thông báo'}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body ${type === 'success' ? 'text-white' : ''}">
            ${message}
        </div>
    `;

    // Thêm vào container
    notificationContainer.appendChild(notification);

    // Tự động xóa sau 5 giây
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notificationContainer.removeChild(notification);
        }, 500);
    }, 5000);

    // Xử lý nút đóng
    notification.querySelector('.btn-close').addEventListener('click', function () {
        notification.classList.remove('show');
        setTimeout(() => {
            notificationContainer.removeChild(notification);
        }, 500);
    });
};


/**
 * Hàm thiết lập Froala Editor
 * @param {string} editorId - ID của phần tử editor
 * @param {function} contentChangedCallback - Callback khi nội dung thay đổi
 */
export const setupFroalaEditor = (editorId, contentChangedCallback = null) => {
    if (typeof FroalaEditor !== 'undefined') {
        const froalaEditor = new FroalaEditor(`#${editorId}`, {
            height: 200,
            placeholderText: 'Nhập mô tả sản phẩm...',
            charCounterCount: true,
            toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'fontFamily', 'fontSize', 'color', 'paragraphFormat',
                'align', 'formatOL', 'formatUL', 'indent', 'outdent', 'insertLink', 'insertImage', 'insertTable',
                'html', 'clearFormatting', 'undo', 'redo'],
            events: {
                'contentChanged': contentChangedCallback
            }
        });

        return froalaEditor;
    }
    return null;
};


/**
 * Chuyển đổi định dạng ngày tháng cho input datetime-local
 * @param {string} dateString Chuỗi ngày tháng
 * @returns {string} Chuỗi ngày tháng định dạng cho input datetime-local
 */
export const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
};

/**
 * Hàm thiết lập Select2 cho select box
 * @param {string} selectId - ID của select box
 * @param {string} parentSelector - Selector của phần tử cha cho dropdown
 */
export const setupSelect2 = (selectId, parentSelector) => {
    if (typeof jQuery !== 'undefined' && typeof jQuery.fn.select2 !== 'undefined') {
        $(`#${selectId}`).select2({
            dropdownParent: $(parentSelector),
            width: '100%'
        });
    }
};
