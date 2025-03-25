import { ProductService } from '../service/product-service.js';
import { Filter } from '../models/filter.js';

export class ProductContainer {
    constructor() {
        this.productService = new ProductService();
        this.filter = new Filter();
        this.products = [];
        this.totalProducts = 0;
        
        this.initializeElements();
        this.bindEvents();
        this.loadInitialData();
    }

    initializeElements() {
        // Tìm kiếm
        this.searchInput = document.getElementById('mainSearchInput');
        this.searchButton = document.getElementById('mainSearchBtn');
        
        // Container chính
        this.productGrid = document.getElementById('productGrid');
        this.paginationList = document.getElementById('paginationList');
        this.loadMoreBtn = document.getElementById('loadMoreBtn');
        
        // Sắp xếp
        this.sortSelect = document.getElementById('sortSelect');
        
        // Form lọc
        this.filterForm = document.getElementById('filterForm');
        
        // Các nhóm lọc
        this.categoryOptions = document.getElementById('categoryOptions');
        this.publisherOptions = document.getElementById('publisherOptions');
        this.priceRangeOptions = document.getElementById('priceRangeOptions');
        this.ratingOptions = document.getElementById('ratingOptions');
        this.serviceOptions = document.getElementById('serviceOptions');
        
        // Input khoảng giá
        this.priceFromInput = document.getElementById('priceFromInput');
        this.priceToInput = document.getElementById('priceToInput');
        this.priceApplyBtn = document.getElementById('priceApplyBtn');
        
        // Nút điều khiển bộ lọc
        this.clearFilterBtn = document.getElementById('clearFilterBtn');
        this.applyFilterBtn = document.getElementById('applyFilterBtn');
        
        // Templates
        this.productCardTemplate = document.getElementById('productCardTemplate');
        this.paginationItemTemplate = document.getElementById('paginationItemTemplate');
    }

    bindEvents() {
        // Sự kiện cho các checkbox category

        // Sự kiện cho các checkbox publisher
        

        // Sự kiện cho price range
       

        // Sự kiện cho input giá tùy chỉnh
       

        // Sự kiện cho rating
       

        // Sự kiện cho services
        

        // Sự kiện cho nút load more
       
    }

    async loadInitialData() {
        await this.loadProducts();
    }

    async handleFilterChange() {
        this.updateFilterFromInputs();
        this.filter.setPage(1);
        await this.loadProducts();
    }

    updateFilterFromInputs() {
        // Cập nhật categories
        const selectedCategories = Array.from(this.categoryCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        this.filter.setCategories(selectedCategories);

        // Cập nhật publishers
        const selectedPublishers = Array.from(this.publisherCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        this.filter.setPublishers(selectedPublishers);

        // Cập nhật rating
        const selectedRating = Array.from(this.ratingInputs)
            .find(radio => radio.checked)?.value;
        this.filter.setRating(selectedRating);

        // Cập nhật services
        const selectedServices = Array.from(this.serviceCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        this.filter.setServices(selectedServices);
    }

    handlePriceRangeChange() {
        const selectedRange = document.querySelector('input[name="price-range"]:checked').value;
        const [from, to] = selectedRange.split('-');
        this.filter.setPriceRange(
            from === '0' ? null : parseInt(from),
            to === 'max' ? null : parseInt(to)
        );
    }

    handleCustomPriceRange() {
        const from = this.priceFromInput.value ? parseInt(this.priceFromInput.value.replace(/\D/g, '')) : null;
        const to = this.priceToInput.value ? parseInt(this.priceToInput.value.replace(/\D/g, '')) : null;
        this.filter.setPriceRange(from, to);
    }

    async loadMore() {
        this.filter.setPage(this.filter.page + 1);
        await this.loadProducts(true);
    }

    async loadProducts(append = false) {
        try {
            const data = await this.productService.getProducts(this.filter.toQueryParams());
            this.products = append ? [...this.products, ...data.products] : data.products;
            this.totalProducts = data.total;
            this.renderProducts(append);
            this.updatePagination();
            this.updateLoadMoreButton();
        } catch (error) {
            console.error('Lỗi khi tải sản phẩm:', error);
        }
    }

    renderProducts(append = false) {
        const productsHTML = this.products.map(product => this.createProductCard(product)).join('');
        
        if (append) {
            this.productGrid.innerHTML += productsHTML;
        } else {
            this.productGrid.innerHTML = productsHTML;
        }
    }

    createProductCard(product) {
        return `
           
        `;
    }


    updateLoadMoreButton() {
        const hasMoreProducts = this.products.length < this.totalProducts;
        if (this.loadMoreBtn) {
            this.loadMoreBtn.style.display = hasMoreProducts ? 'block' : 'none';
        }
    }
}
