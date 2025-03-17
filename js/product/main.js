// =======================================================================
// main.js - File chính kết nối tất cả module cho trang quản lý sản phẩm
// =======================================================================
import { getCategory, getStatistic } from './api.js';
import {
    stockFilterMap,
    sortOptionMap,
    initializeSelect2
} from './utils.js';
import {
    filterInitialize,
    loadProducts,
    setupFilterEvents,
    setValueForFilter,
    setDefaultItemsPerPage
} from './product.js';

document.addEventListener("DOMContentLoaded", async function () {
    // Lấy tham chiếu đến các phần tử DOM
    const totalProducts = document.getElementById("totalProducts");
    const available = document.getElementById("available");
    const almostOutOfStock = document.getElementById("almostOutOfStock");
    const outOfStock = document.getElementById("outOfStock");

    // Tạo loading overlay nếu chưa có
    if (!document.getElementById('loadingOverlay')) {
        const loadingHTML = `
        <div id="loadingOverlay" class="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" 
             style="z-index: 1000; background-color: rgba(255, 255, 255, 0.8); display: none;">
            <div class="d-flex flex-column align-items-center">
                <div class="spinner-border text-primary mb-2" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <div>Đang tải dữ liệu...</div>
            </div>
        </div>`;

        const tableContainer = document.querySelector('.table-responsive');
        if (tableContainer) {
            tableContainer.style.position = 'relative';
            const loadingElement = document.createElement('div');
            loadingElement.innerHTML = loadingHTML;
            tableContainer.appendChild(loadingElement.firstElementChild);
        }
    }

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

    // Lấy và hiển thị thống kê
    const stats = await getStatistic();
    if (stats && totalProducts) {
        totalProducts.textContent = stats.total;
        available.textContent = stats.available;
        almostOutOfStock.textContent = stats.almostOutOfStock;
        outOfStock.textContent = stats.outOfStock;
    }

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