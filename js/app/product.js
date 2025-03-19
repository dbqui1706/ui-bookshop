// =======================================================================
// main.js - File chính kết nối tất cả module cho trang quản lý sản phẩm
// =======================================================================
import { getCategory } from '../service/product.js'
import {
    stockFilterMap,
    sortOptionMap,
} from '../constants/product.js';
import { initializeLoadingOverlay, initializeSelect2 } from '../utils/index.js';
import {
    filterInitialize,
    loadProducts,
    setupFilterEvents,
    setValueForFilter,
    setDefaultItemsPerPage,
    loadSatistic
} from '../container/product.js';

document.addEventListener("DOMContentLoaded", async function () {

    // Tạo loading overlay nếu chưa có
    initializeLoadingOverlay('.table-responsive');

    // Lấy và hiển thị danh mục
    const categories = await getCategory();
    if (categories) {
        const categoryFilter = document.getElementById("categoryFilter");
        if (categoryFilter) {
            Object.entries(categories).forEach(([id, name]) => {
                const option = document.createElement("option");
                option.value = id;
                option.textContent = name;
                categoryFilter.appendChild(option);
            });
        }
    }

    loadSatistic();

    // Thiết lập các giá trị và sự kiện cho filter
    setValueForFilter(stockFilterMap, sortOptionMap);

    // Khởi tạo Select2 cho các dropdown
    initializeSelect2();

    // Thiết lập sự kiện cho các filter
    setupFilterEvents();

    // Thiết lập giá trị mặc định cho items per page
    setDefaultItemsPerPage();

    // Tải sản phẩm
    loadProducts();
});