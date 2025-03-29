// ==========================================================
// category.js - Module quản lý các thể loại
// ==========================================================

import {
    getCategories,
    getCategoryStats,
} from '../service/category.js';
import {
    showLoading,
    hideLoading,
    showAlert,
    formatDateTime,
    initializeTooltip
} from '../utils/index.js';

import {
    addCategoryModal,
    categoryDetailModal,
    editCategoryModal,
    toggleCategoryStatusModal
} from '../components/category-modal/modal.js';

// Filter state
export const filterState = {
    search: "",
    status: "",
    page: 1,
    totalPages: 1,
    limit: 5,
    data: []
};

// Render bảng danh mục
export const renderCategoryTable = (categories) => {
    const tableBody = document.querySelector('#categoryTable tbody');
    tableBody.innerHTML = '';

    categories.forEach(category => {
        const row = document.createElement('tr');

        // Format ngày tháng
        const createdDate = formatDateTime(category.createdAt, { dateStyle: 'short' });
        const updatedDate = category.updatedAt ? formatDateTime(category.updatedAt, { dateStyle: 'short' }) : 'Chưa cập nhật';

        row.innerHTML = `
            <td>#${category.id}</td>
            <td>${category.name}</td>
            <td>${category.productCount || 0}</td>
            <td>${createdDate}</td>
            <td>${updatedDate}</td>
            <td><span class="badge ${category.isActive ? 'bg-success' : 'bg-danger'}">${category.isActive ? 'Hoạt động' : 'Tạm khóa'}</span></td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-secondary view-category" data-bs-toggle="tooltip" data-bs-placement="top" title="Chi tiết" data-category-id="${category.id}">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-outline-primary edit-category" data-bs-toggle="tooltip" data-bs-placement="top" title="Chỉnh sửa" data-category-id="${category.id}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-${category.isActive ? 'danger' : 'success'} toggle-status" data-bs-toggle="tooltip" data-bs-placement="top" 
                            title="${category.isActive ? 'Tạm khóa' : 'Kích hoạt'}" data-category-id="${category.id}" data-status="${category.isActive}">
                        <i class="bi bi-${category.isActive ? 'lock' : 'unlock'}"></i>
                    </button>
                </div>
            </td>`;
        tableBody.appendChild(row);
    });

    // Khởi tạo lại tooltip sau khi render
    initializeTooltip('[data-bs-toggle="tooltip"]');

    // Thêm sự kiện cho các nút
    addButtonEventListeners();
};

// Cập nhật phân trang
export const updatePagination = (currentPage, totalPages) => {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    // Nút Previous
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `
    <a class="page-link" href="#" aria-label="Previous" data-page="${currentPage - 1}">
        <span aria-hidden="true">&laquo;</span>
    </a>`;
    pagination.appendChild(prevLi);

    // Các nút trang
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageLi = document.createElement('li');
        pageLi.className = `page-item ${i === currentPage ? 'active' : ''}`;
        pageLi.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
        pagination.appendChild(pageLi);
    }

    // Nút Next
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `
    <a class="page-link" href="#" aria-label="Next" data-page="${currentPage + 1}">
        <span aria-hidden="true">&raquo;</span>
    </a>`;
    pagination.appendChild(nextLi);

    // Thêm sự kiện cho các nút phân trang
    document.querySelectorAll('.pagination .page-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const page = parseInt(this.getAttribute('data-page'));
            if (page > 0 && page <= totalPages) {
                filterState.page = page;
                loadCategories();
            }
        });
    });
};

// Thêm các sự kiện cho nút
export const addButtonEventListeners = () => {
    // Nút thêm danh mục mới
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    if (addCategoryBtn) {
        addCategoryBtn.addEventListener('click', function() {
            addCategoryModal();
        });
    }
    
    // Nút xem chi tiết
    document.querySelectorAll('.view-category').forEach(button => {
        button.addEventListener('click', function () {
            const categoryId = this.getAttribute('data-category-id');
            viewCategory(categoryId);
        });
    });

    // Nút chỉnh sửa
    document.querySelectorAll('.edit-category').forEach(button => {
        button.addEventListener('click', function() {
            const categoryId = this.getAttribute('data-category-id');
            editCategory(categoryId);
        });
    });

    // Nút toggle trạng thái (khóa/mở khóa)
    document.querySelectorAll('.toggle-status').forEach(button => {
        button.addEventListener('click', function() {
            const categoryId = this.getAttribute('data-category-id');
            const isActive = this.getAttribute('data-status') === 'true';
            toggleCategoryStatus(categoryId, isActive);
        });
    });
};

// Xem chi tiết danh mục
export const viewCategory = (categoryId) => {
    const category = filterState.data.find(cat => cat.id == categoryId);
    if (category) {
        // Hiển thị modal chi tiết
        categoryDetailModal(category);
    }
};

// Chỉnh sửa danh mục
export const editCategory = (categoryId) => {
    const category = filterState.data.find(cat => cat.id == categoryId);
    if (category) {
        // Hiển thị modal chỉnh sửa
        editCategoryModal(category);
    }
};

// Thay đổi trạng thái danh mục
export const toggleCategoryStatus = (categoryId, currentStatus) => {
    const category = filterState.data.find(cat => cat.id == categoryId);
    if (category) {
        // Hiển thị modal xác nhận thay đổi trạng thái
        toggleCategoryStatusModal(category);
    }
};

// Tải danh sách danh mục
export const loadCategories = async () => {
    try {
        showLoading();
        const data = await getCategories(filterState);
        filterState.data = data.categories;
        renderCategoryTable(data.categories);
        updatePagination(data.currentPage, data.totalPages);

        // Cập nhật tổng số danh mục hiển thị
        const countElement = document.getElementById('totalItemsLabel');
        if (countElement) {
            countElement.textContent = `thể loại trên mỗi trang (Tổng số: ${data.totalCategories})`;
        }
    } catch (error) {
        console.error('Error loading categories:', error);
        showAlert('error', 'Không thể tải danh sách thể loại!');
    } finally {
        hideLoading();
    }
};

// Tải thống kê
export const loadStatistics = async () => {
    // Lấy tham chiếu đến các phần tử DOM
    const totalCategories = document.getElementById("totalCategories");
    const activeCategories = document.getElementById("activeCategories");
    const inactiveCategories = document.getElementById("inactiveCategories");

    try {
        // Lấy và hiển thị thống kê
        const stats = await getCategoryStats();
        if (stats) {
            if (totalCategories) totalCategories.textContent = stats.total;
            if (activeCategories) activeCategories.textContent = stats.active;
            if (inactiveCategories) inactiveCategories.textContent = stats.inactive;
        }
    } catch (error) {
        console.error('Error loading category statistics:', error);
    }
};

// Thiết lập sự kiện cho các bộ lọc
export const setupFilterEvents = () => {
    // Sự kiện cho ô tìm kiếm
    const searchInput = document.getElementById('searchCategory');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                filterState.search = this.value;
                filterState.page = 1;
                loadCategories();
            }, 300);
        });
    }

    // Sự kiện cho bộ lọc trạng thái
    $('#statusFilter').on('select2:select', function (e) {
        filterState.status = e.params.data.id;
        filterState.page = 1;
        loadCategories();
    });

    // Thêm sự kiện cho select box items per page
    const itemsPerPageSelect = document.getElementById('itemsPerPage');
    if (itemsPerPageSelect) {
        itemsPerPageSelect.addEventListener('change', function () {
            filterState.limit = parseInt(this.value);
            filterState.page = 1;
            loadCategories();
        });
    }
};

// Thiết lập giá trị mặc định cho items per page
export const setDefaultItemsPerPage = () => {
    const itemsPerPageSelect = document.getElementById('itemsPerPage');
    if (itemsPerPageSelect) {
        itemsPerPageSelect.value = filterState.limit;
    }
};
