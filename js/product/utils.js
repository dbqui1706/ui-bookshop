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