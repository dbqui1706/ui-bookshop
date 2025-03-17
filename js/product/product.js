// ==========================================================
// products.js - Module quản lý sản phẩm
// ==========================================================

import {getProducts} from './api.js';
import {showLoading, hideLoading, formatCurrency} from './utils.js';
import {
    productDetailModal,
    addProductModal,
    editProductModal
} from './modals.js';

// Filter state
export const filterInitialize = {
    category: "",
    stock: "DEFAULT",
    sortOption: "DEFAULT",
    search: "",
    page: 1,
    totalPages: 1,
    limit: 10,
    data: []
};

export const renderProductTable = (products) => {
    const tableBody = document.getElementById('productTable').querySelector('tbody');
    tableBody.innerHTML = '';

    products.forEach(product => {
        // Tạo trạng thái tồn kho và màu sắc
        let stockStatus, stockBadgeClass, stockIndicatorClass;
        if (product.stockStatus === 'OUT_OF_STOCK') {
            stockStatus = 'Hết hàng';
            stockBadgeClass = 'bg-danger';
            stockIndicatorClass = 'stock-low';
        } else if (product.stockStatus === 'ALMOST_OUT_OF_STOCK') {
            stockStatus = 'Sắp hết';
            stockBadgeClass = 'bg-warning text-dark';
            stockIndicatorClass = 'stock-medium';
        } else {
            stockStatus = 'Còn hàng';
            stockBadgeClass = 'bg-success';
            stockIndicatorClass = 'stock-high';
        }

        // Tạo hàng mới trong bảng
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>#${product.id}</td>
        <td>
            <img src="${product.imageName ? product.imageName : 'https://via.placeholder.com/300x300'}" 
                 alt="${product.name}" width="50" height="50" class="rounded"/>
        </td>
        <td>${product.name}</td>
        <td>${product.categoryName}</td>
        <td class="fw-bold">${formatCurrency(product.discountedPrice)}</td>
        <td class="${product.discountedPrice === product.price ? '' : 'text-decoration-line-through'}">
            ${formatCurrency(product.price)}
        </td>
        <td>
            <div class="d-flex align-items-center">
                <div class="stock-indicator ${stockIndicatorClass} me-2"></div>
                <span>${product.quantity}</span>
            </div>
        </td>
        <td><span class="badge ${stockBadgeClass}">${stockStatus}</span></td>
        <td>${product.totalBuy}</td>
        <td>
            <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-secondary" data-product-id="${product.id}" data-action="view">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-outline-primary" data-product-id="${product.id}" data-action="edit">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-outline-danger" data-product-id="${product.id}" data-action="delete">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </td>`;
        tableBody.appendChild(row);
    });

    // Thêm sự kiện cho các nút
    addButtonEventListeners();
};

export const updatePagination = (currentPage, totalPages) => {
    const pagination = document.querySelector('.pagination');
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
                filterInitialize.page = page;
                loadProducts();
            }
        });
    });
};

export const addButtonEventListeners = () => {
    // Nút xem chi tiết
    document.querySelectorAll('[data-action="view"]').forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.getAttribute('data-product-id');
            viewProduct(productId);
        });
    });

    // Nút thêm sản phẩm
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function () {
            addProductModal();
        });
    }

    // Các nút khác có thể thêm sau
};

export const viewProduct = (productId) => {
    console.log('View product:', productId);
    const productDetails = filterInitialize.data.find(product => product.id == productId);
    if (productDetails) {
        productDetailModal(productDetails);
    }
};


export const loadProducts = async () => {
    try {
        showLoading();
        const data = await getProducts(filterInitialize);
        filterInitialize.data = data.products;
        renderProductTable(data.products);
        updatePagination(data.currentPage, data.totalPages);

        // Cập nhật tổng số sản phẩm hiển thị
        const countElement = document.querySelector('.col-md-6.mb-3 span.ms-2');
        if (countElement) {
            countElement.textContent = `sản phẩm (Tổng số: ${data.totalProducts})`;
        }
    } catch (error) {
        console.error('Error loading products:', error);
    } finally {
        hideLoading();
    }
};

export const setupFilterEvents = () => {
    // Sự kiện cho bộ lọc danh mục
    $('#categoryFilter').on('select2:select', function (e) {
        filterInitialize.category = e.params.data.id;
        filterInitialize.page = 1;
        loadProducts();
    });

    // Sự kiện cho bộ lọc trạng thái kho
    $('#stockFilter').on('select2:select', function (e) {
        filterInitialize.stock = e.params.data.id;
        filterInitialize.page = 1;
        loadProducts();
    });

    // Sự kiện cho bộ lọc sắp xếp
    $('#sortOption').on('select2:select', function (e) {
        filterInitialize.sortOption = e.params.data.id;
        filterInitialize.page = 1;
        loadProducts();
    });

    // Sự kiện cho ô tìm kiếm
    const searchInput = document.getElementById('searchProduct');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                filterInitialize.search = this.value;
                filterInitialize.page = 1;
                loadProducts();
            }, 300);
        });
    }

    // Thêm sự kiện cho select box items per page
    const itemsPerPageSelect = document.getElementById('itemsPerPage');
    if (itemsPerPageSelect) {
        itemsPerPageSelect.addEventListener('change', function () {
            console.log('Items per page changed:', this.value);
            filterInitialize.limit = parseInt(this.value);
            filterInitialize.page = 1;
            loadProducts();
        });
    }
};

export const setDefaultItemsPerPage = () => {
    const itemsPerPageSelect = document.getElementById('itemsPerPage');
    if (itemsPerPageSelect) {
        itemsPerPageSelect.value = filterInitialize.limit.toString();
    }
};

export const setValueForFilter = (stockFilterMap, sortOptionMap) => {
    const stockFilter = document.getElementById('stockFilter');
    if (stockFilter) {
        Object.entries(stockFilterMap).forEach(([key, value]) => {
            const option = document.createElement("option");
            option.value = key;
            option.textContent = value;
            stockFilter.appendChild(option);
        });
    }

    const sortOption = document.getElementById('sortOption');
    if (sortOption) {
        Object.entries(sortOptionMap).forEach(([key, value]) => {
            const option = document.createElement("option");
            option.value = key;
            option.textContent = value;
            sortOption.appendChild(option);
        });
    }
};