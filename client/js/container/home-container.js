import { ProductService } from '../service/product-service.js';
import { CategoryService } from '../service/category-service.js';
import { Filter } from '../models/filter.js';
import { PRICE_RANGE, RATING } from '../constants/home-contants.js';

export class ProductContainer {
    constructor() {
        this.productService = new ProductService();
        this.categoryService = new CategoryService();
        this.filter = new Filter();
        this.products = [];
        this.categories = [];
        this.publishers = [];
        this.totalProducts = 0;

        this.initializeBaseElements(); // Khởi tạo các phần tử cơ bản trước
        this.loadInitialData().then(() => {
            this.initializeFilterElements(); // Khởi tạo các phần tử filter sau khi load xong
            this.bindEvents(); // Bind sự kiện sau khi đã có đủ các phần tử
        });
    }

    initializeBaseElements() {
        // Các phần tử cơ bản không phụ thuộc vào dữ liệu
        this.searchInput = document.querySelector('.search-input');
        this.searchButton = document.getElementById('searchBtn');
        this.productGrid = document.getElementById('productGrid');
        this.loadMoreBtn = document.getElementById('loadMoreBtn');
        this.filterForm = document.getElementById('filter-form');
        this.categoryContainer = document.getElementById('category-container-filter');
        this.publisherContainer = document.getElementById('publisher-container-filter');
        this.priceFromInput = document.getElementById('priceFrom');
        this.priceToInput = document.getElementById('priceTo');
        this.priceApplyBtn = document.querySelector('.price-apply-btn');
        this.clearFilterBtn = document.getElementById('clearFilterBtn');
        this.applyFilterBtn = document.getElementById('applyFilterBtn');

        // Các phần tử không phụ thuộc vào danh mục động
        this.priceRangeInputs = document.querySelectorAll('input[name="price-range"]');
        this.ratingInputs = document.querySelectorAll('input[name="rating"]');
        this.serviceCheckboxes = document.querySelectorAll('input[name="service"]');
    }

    initializeFilterElements() {
        // Cập nhật các phần tử checkboxes sau khi render
        this.categoryCheckboxes = document.querySelectorAll('input[name="category"]');
        this.publisherCheckboxes = document.querySelectorAll('input[name="publisher"]');
    }

    bindEvents() {
        // Sự kiện cho form lọc
        if (this.filterForm) {
            this.filterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFilterChange();
            });
        }

        // Sự kiện cho các checkbox category
        if (this.categoryCheckboxes) {
            this.categoryCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', () => {
                    this.updateFilterFromInputs();
                    this.handleFilterChange();
                });
            });
        }

        // Sự kiện cho các checkbox publisher
        this.publisherCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.handleFilterChange();
            });
        });

        // Sự kiện cho price range
        this.priceRangeInputs.forEach(radio => {
            radio.addEventListener('change', () => {
                this.handlePriceRangeChange();
                this.handleFilterChange();
            });
        });

        // Sự kiện cho input giá tùy chỉnh
        if (this.priceApplyBtn) {
            this.priceApplyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleCustomPriceRange();
                this.handleFilterChange();
            });
        }

        // Sự kiện cho rating
        this.ratingInputs.forEach(radio => {
            radio.addEventListener('change', () => {
                this.handleFilterChange();
            });
        });

        // Sự kiện cho services
        this.serviceCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.handleFilterChange();
            });
        });

        // Sự kiện cho nút load more
        if (this.loadMoreBtn) {
            this.loadMoreBtn.addEventListener('click', () => {
                this.loadMore();
            });
        }

        // Sự kiện cho nút tìm kiếm
        if (this.searchButton) {
            this.searchButton.addEventListener('click', () => {
                this.handleSearch();
            });
        }

        // Sự kiện cho nút clear filter
        if (this.clearFilterBtn) {
            this.clearFilterBtn.addEventListener('click', () => {
                this.resetFilters();
            });
        }

        // Sự kiện cho nút apply filter
        if (this.applyFilterBtn) {
            this.applyFilterBtn.addEventListener('click', () => {
                this.handleFilterChange();
            });
        }
    }

    async loadInitialData() {
        await this.loadDataForSidebar();
        await this.loadProducts();
    }

    async handleFilterChange() {
        this.updateFilterFromInputs();
        this.filter.setPage(1);
        await this.loadProducts();
    }

    updateFilterFromInputs() {
        // Lưu trạng thái cũ để kiểm tra xem có thay đổi không
        const oldState = JSON.stringify({
            categories: this.filter.categories,
            publishers: this.filter.publishers,
            rating: this.filter.rating,
            services: this.filter.services,
            priceRange: this.filter.priceRange
        });

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
        this.filter.setRating(selectedRating ? selectedRating : null);

        // Cập nhật services
        const selectedServices = Array.from(this.serviceCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        this.filter.setServices(selectedServices);
        // Kiểm tra nếu có thay đổi và log
        const newState = JSON.stringify({
            categories: this.filter.categories,
            publishers: this.filter.publishers,
            rating: this.filter.rating,
            services: this.filter.services,
            priceRange: this.filter.priceRange
        });

        if (oldState !== newState) {
            this.logFilterState('updateFilterFromInputs');
        }
    }

    handlePriceRangeChange() {
        const selectedRadio = document.querySelector('input[name="price-range"]:checked');
        if (!selectedRadio) return;

        const selectedRange = selectedRadio.value;
        const range = PRICE_RANGE[selectedRange];

        if (range) {
            this.filter.setPriceRange(range.from, range.to);

            // Cập nhật input fields để đồng bộ
            if (this.priceFromInput) this.priceFromInput.value = range.from || '';
            if (this.priceToInput) this.priceToInput.value = range.to || '';
        } else if (selectedRange === '300000-max') {
            this.filter.setPriceRange(300000, null);

            if (this.priceFromInput) this.priceFromInput.value = '300000';
            if (this.priceToInput) this.priceToInput.value = '';
        }
    }

    handleCustomPriceRange() {
        // Xóa định dạng và chỉ lấy số
        const fromValue = this.priceFromInput.value.replace(/\D/g, '');
        const toValue = this.priceToInput.value.replace(/\D/g, '');

        const from = fromValue ? parseInt(fromValue) : null;
        const to = toValue ? parseInt(toValue) : null;

        this.filter.setPriceRange(from, to);

        // Bỏ chọn các radio button khi nhập giá tùy chỉnh
        this.priceRangeInputs.forEach(radio => {
            radio.checked = false;
        });
    }

    handleSearch() {
        const searchTerm = this.searchInput.value.trim();
        if (searchTerm) {
            // Thêm logic tìm kiếm
            this.filter.setSearchTerm(searchTerm);
            this.filter.setPage(1);
            this.loadProducts();
        }
    }

    async loadMore() {
        this.filter.setPage(this.filter.page + 1);
        await this.loadProducts(true);
    }


    async loadDataForSidebar() {
        // render categories
        this.categories = await this.categoryService.getAllCategories();
        this.renderCategories();
        // render publishers
        this.publishers = await this.categoryService.getAllPublishers();
        this.renderPublishers();

    }

    async loadProducts(append = false) {
        try {
            console.log("Loading products with filters:", this.filter.toQueryParams());
            const data = await this.productService.getProducts(this.filter.toQueryParams());

            this.products = append ? [...this.products, ...data.products] : data.products;
            this.totalProducts = data.total;
            this.renderProducts(append);
            this.updateLoadMoreButton();
        } catch (error) {
            console.error('Lỗi khi tải sản phẩm:', error);
        }
    }

    renderCategories() {
        const categoriesHTML = this.categories.map(category => this.createCategoryCard(category)).join('');
        this.categoryContainer.innerHTML = categoriesHTML;

        // Cập nhật lại categoryCheckboxes ngay sau khi render
        this.categoryCheckboxes = document.querySelectorAll('input[name="category"]');
        console.log("Categories rendered, new checkboxes:", this.categoryCheckboxes);
    }

    renderPublishers() {
        const publishersHTML = this.publishers.map(publisher => this.createPublisherCard(publisher)).join('');
        this.publisherContainer.innerHTML = publishersHTML;

        // Cập nhật lại publisherCheckboxes ngay sau khi render
        this.publisherCheckboxes = document.querySelectorAll('input[name="publisher"]');
    }


    renderProducts(append = false) {
        if (!this.products || this.products.length === 0) {
            this.productGrid.innerHTML = `<div class="col-12 text-center py-5">
                <h3>Không tìm thấy sản phẩm nào</h3>
                <p>Vui lòng thử lại với bộ lọc khác</p>
            </div>`;
            return;
        }

        const productsHTML = this.products.map(product => this.createProductCard(product)).join('');

        if (append) {
            this.productGrid.innerHTML += productsHTML;
        } else {
            this.productGrid.innerHTML = productsHTML;
        }
    }

    createCategoryCard(category) {
        return `
            <label class="filter-option">
                <input type="checkbox" name="category" value="${category.name}" data-id="${category.id}"> ${category.name}
                <span class="category-count">(${category.count})</span>
            </label>
        `
    }

    createPublisherCard(publisher) {
        return `
            <label class="filter-option">
                <input type="checkbox" name="publisher" value="${publisher.name}" data-id="${publisher.id}"> ${publisher.name}
            </label>
        `
    }
    createProductCard(product) {
        // Định dạng giá tiền với dấu phân cách hàng nghìn
        const formatPrice = (price) => {
            return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        };

        // Tạo chuỗi sao đánh giá
        const renderStars = (rating) => {
            let stars = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= rating) {
                    stars += '★';
                } else {
                    stars += '☆';
                }
            }
            return stars;
        };

        // Tạo badge khuyến mãi
        const discountBadge = product.discount ? `<span class="discount-tag">-${product.discount}%</span>` : '';

        // Xử lý đường dẫn ảnh
        const imageUrl = product.imageUrl || '/asset/images/image.png';

        // Tạo các badge của sản phẩm
        const shippingBadge = product.freeShipping ?
            `<div class="shipping-badge fast-shipping">FREESHIP XTRA</div>` : '';

        const authenticBadge = `<div class="shipping-badge authentic-badge">CHÍNH HÃNG</div>`;

        // Định dạng số lượng đã bán
        const formatSoldCount = (count) => {
            return count > 1000 ? `${(count / 1000).toFixed(1)}k` : count;
        };

        return `
        <div class="col">
            <div class="book-card" onclick="window.location.href='/client/product.html?id=${product.id}'">
                <img src="${imageUrl}" alt="${product.name}" onerror="this.src='/asset/images/image.png'">
                <div class="book-info">
                    ${shippingBadge}
                    ${authenticBadge}
                    <h5 class="book-title">${product.name}</h5>
                    <div class="book-author">${product.author}</div>
                    <div class="book-price">${formatPrice(product.price - (product.price * product.discount / 100))}đ ${discountBadge}</div>
                    <div class="rating">${renderStars(product.rating)}</div>
                    <div class="sold-count">Đã bán ${formatSoldCount(product.totalBuy)}</div>
                </div>
            </div>
        </div>
        `;
    }

    updateLoadMoreButton() {
        const hasMoreProducts = this.products.length < this.totalProducts;
        if (this.loadMoreBtn) {
            this.loadMoreBtn.style.display = hasMoreProducts ? 'block' : 'none';
        }
    }

    resetFilters() {
        // Reset filter model
        this.filter.reset();

        // Reset UI
        this.categoryCheckboxes.forEach(cb => { cb.checked = false; });
        this.publisherCheckboxes.forEach(cb => { cb.checked = false; });
        this.priceRangeInputs.forEach(radio => { radio.checked = false; });
        this.ratingInputs.forEach(radio => { radio.checked = false; });
        this.serviceCheckboxes.forEach(cb => { cb.checked = false; });

        if (this.priceFromInput) this.priceFromInput.value = '';
        if (this.priceToInput) this.priceToInput.value = '';

        // Reload products
        this.loadProducts();
    }

    logFilterState(triggerSource = '') {
        console.log(`Filter state changed [${triggerSource}]:`, {
            categories: this.filter.categories,
            publishers: this.filter.publishers,
            priceRange: this.filter.priceRange,
            rating: this.filter.rating,
            services: this.filter.services,
            page: this.filter.page,
            sortBy: this.filter.sortBy,
            searchTerm: this.filter.searchTerm
        });
    }
}