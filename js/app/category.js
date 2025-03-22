import {
    getCategories
} from "../service/category.js";

import {
    loadCategories,
    loadStatistics,
    setupFilterEvents,
    setDefaultItemsPerPage
} from "../container/category.js";


import {
    initializeTooltip,
    initializeLoadingOverlay,
    initializeSelect2
} from "../utils/index.js";


document.addEventListener("DOMContentLoaded", async function () {

    // Tạo loading overlay nếu chưa có
    initializeLoadingOverlay('.table-responsive');

    // Khởi tạo tất cả tooltip trong trang
    const selector = '[data-bs-toggle="tooltip"]';
    initializeTooltip(selector);

    // Khởi tạo Select2 cho các dropdown
    initializeSelect2();

    // Khởi tạo dữ liệu cho Stats Row
    loadStatistics();

    // Thiết lập sự kiện cho các filter
    setupFilterEvents();

    // Thiết lập giá trị mặc định cho items per page
    setDefaultItemsPerPage();

    // Load Categories
    loadCategories();
});