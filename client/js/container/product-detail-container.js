import { ProductDetailService } from '../service/product-detail-service.js';

export class ProductDetailContainer {
    constructor() {
        this.service = new ProductDetailService();
        this.productId = this.getProductIdFromUrl();
        this.product = null;
        this.quantity = 1;

        this.initializeElements();
        this.bindEvents();
        this.loadInitialData();
    }

    getProductIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    initializeElements() {
        // Hình ảnh sản phẩm
        this.mainImage = document.querySelector('.product-image img');
        this.thumbnails = document.querySelectorAll('.thumbnail');

        // Thông tin chi tiết
        this.authorElement = document.getElementById('author');
        this.publisherElement = document.getElementById('publisher');
        this.yearElement = document.getElementById('year');
        this.pageElement = document.getElementById('page');
        this.skuElement = document.getElementById('sku');

        // Thông tin sản phẩm
        this.titleElement = document.getElementById('product-title');
        this.productPriceElement = document.getElementById('product-price');
        this.priceElement = document.getElementById('product-price');
        this.originalPriceElement = document.getElementById('original-price');
        this.discountElement = document.getElementById('discount-percent');
        this.ratingElement = document.getElementById('rating-stars');
        this.ratingAverageElement = document.getElementById('rating-average');
        this.ratingCountElement = document.getElementById('rating-count');
        this.soldCountElement = document.getElementById('sold-count');

        // Số lượng
        this.quantityInput = document.querySelector('.quantity-input');
        this.minusBtn = document.getElementById('minus-btn');
        this.plusBtn = document.getElementById('plus-btn');

        // Tổng tiền
        this.totalPriceElement = document.getElementById('total-price');

        // Nút hành động
        this.buyNowBtn = document.getElementById('btn-buy-now');
        this.addToCartBtn = document.getElementById('btn-add-cart');
        this.wishlistBtn = document.getElementById('btn-wishlist');

        // Đánh giá
        this.reviewContainer = document.querySelector('.review-list');
        this.reviewFilters = document.querySelectorAll('.filter-btn-simple');
        this.loadMoreReviewBtn = document.querySelector('.load-more-btn');

        // Sản phẩm liên quan
        this.relatedProductsContainer = document.querySelector('.publisher-section .row');

        // Sản phẩm đã xem
        this.recentlyViewedContainer = document.querySelector('#recentlyViewedProducts');
    }

    bindEvents() {
        // Sự kiện cho thumbnails
        this.thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => this.handleThumbnailClick(thumb));
        });

        // Sự kiện cho số lượng
        this.minusBtn.addEventListener('click', () => {
            console.log("Minus btn clicked")
            this.handleQuantityChange('decrease')
        });
        this.plusBtn.addEventListener('click', () => {
            console.log("Plus btn clicked")
            this.handleQuantityChange('increase')
        });
        this.quantityInput.addEventListener('change', () => this.handleQuantityInputChange());

        // Sự kiện cho các nút hành động
        this.buyNowBtn.addEventListener('click', () => this.handleBuyNow());
        this.addToCartBtn.addEventListener('click', () => this.handleAddToCart());
        this.wishlistBtn.addEventListener('click', () => this.handleAddToWishlist());

        // Sự kiện cho filter đánh giá
        this.reviewFilters.forEach(filter => {
            filter.addEventListener('click', () => this.handleReviewFilterChange(filter));
        });

        // Sự kiện load thêm đánh giá
        if (this.loadMoreReviewBtn) {
            this.loadMoreReviewBtn.addEventListener('click', () => this.loadMoreReviews());
        }
    }

    async loadInitialData() {
        if (!this.productId) {
            this.showError('Không tìm thấy sản phẩm');
            return;
        }

        try {
            // Tải song song các dữ liệu
            const [product, reviews, relatedProducts] = await Promise.all([
                this.service.getProductDetail(this.productId),
                // this.service.getProductReviews(this.productId),
                // this.service.getRelatedProducts(this.productId)
            ]);

            // Lưu thông tin sản phẩm
            this.product = product;

            // Render các phần của trang
            this.renderProductInfo();
            // this.renderReviews(reviews);
            // this.renderRelatedProducts(relatedProducts);

            // Thêm vào danh sách đã xem
            // await this.service.addToRecentlyViewed(this.productId);
            // this.loadRecentlyViewed();

        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
            this.showError('Có lỗi xảy ra khi tải thông tin sản phẩm');
        }
    }

    renderProductInfo() {
        if (!this.product) return;

        // Cập nhật tiêu đề
        document.title = this.product.name;
        this.titleElement.textContent = this.product.name;

        // Cập nhật hình ảnh
        // this.mainImage.src = this.product.images[0];
        // this.renderThumbnails(this.product.images);

        // Cập nhập thông tin chi tiết 
        this.authorElement.textContent = this.product.author;
        this.publisherElement.textContent = this.product.publisher;
        this.yearElement.textContent = this.product.yearPublishing;
        this.pageElement.textContent = this.product.pages + " trang";
        this.skuElement.textContent = `#${this.product.id}`;

        // Cập nhật giá
        const price = this.product.price
        const discount = this.product.discount

        this.productPriceElement.innerHTML = discount > 0 ? `
            <span class="current-price">${this.formatPrice(price * (1 - discount / 100))}</span>
            <span class="original-price">${this.formatPrice(price)}</span>
            <span class="discount-percent">-${discount}%</span>
        ` : `
            <span class="current-price">${this.formatPrice(price)}</span>
        `

        // Cập nhật đánh giá
        this.ratingElement.innerHTML = this.createRatingStars(this.product.averageRatingScore);
        this.ratingCountElement.textContent = `(${this.product.totalProductReviews})`;
        this.soldCountElement.textContent = `| Đã bán ${this.formatNumber(this.product.totalBuy)}`;

        // Cập nhật tổng tiền
        this.updateTotalPrice();
    }

    renderThumbnails(images) {
        const thumbnailContainer = document.querySelector('.thumbnail-container');
        thumbnailContainer.innerHTML = images.map((image, index) => `
            <div class="thumbnail ${index === 0 ? 'active' : ''}">
                <img src="${image}" alt="Thumbnail ${index + 1}">
            </div>
        `).join('');

        // Bind sự kiện cho thumbnails mới
        this.thumbnails = document.querySelectorAll('.thumbnail');
        this.bindEvents();
    }

    handleThumbnailClick(thumb) {
        // Xóa active class từ tất cả thumbnails
        this.thumbnails.forEach(t => t.classList.remove('active'));

        // Thêm active class cho thumbnail được click
        thumb.classList.add('active');

        // Cập nhật hình ảnh chính
        const thumbImage = thumb.querySelector('img');
        if (thumbImage && this.mainImage) {
            this.mainImage.src = thumbImage.src;
        }
    }

    handleQuantityChange(action) {
        let value = parseInt(this.quantityInput.value);
        if (action === 'decrease' && value > 1) {
            value = value - 1;
        } else if (action === 'increase') {
            value = value + 1;
        }
        this.quantityInput.value = value;
        this.quantity = value;
        this.updateTotalPrice();
    }

    handleQuantityInputChange() {
        let value = parseInt(this.quantityInput.value);
        if (isNaN(value) || value < 1) {
            value = 1;
        }
        this.quantityInput.value = value;
        this.quantity = value;
        this.updateTotalPrice();
    }

    updateTotalPrice() {
        if (!this.product) return;
        const currentPrice = (1 - this.product.discount / 100) * this.product.price
        const total = currentPrice * this.quantity;
        this.totalPriceElement.innerHTML = this.formatPrice(total);
    }

    async handleBuyNow() {
        if (!this.product) return;

        try {
            // Thêm vào giỏ hàng
            await this.handleAddToCart();
            // Chuyển đến trang thanh toán
            window.location.href = '/checkout';
        } catch (error) {
            console.error('Lỗi khi mua ngay:', error);
            this.showToast('Có lỗi xảy ra khi thực hiện mua hàng', 'error');
        }
    }

    async handleAddToCart() {
        if (!this.product) return;

        try {
            // Gọi API thêm vào giỏ hàng
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: this.product.id,
                    quantity: this.quantity
                })
            });

            if (response.ok) {
                this.showToast('Đã thêm vào giỏ hàng thành công', 'success');
                // Cập nhật số lượng trong giỏ hàng
                this.updateCartCount();
            } else {
                throw new Error('Lỗi khi thêm vào giỏ hàng');
            }
        } catch (error) {
            console.error('Lỗi khi thêm vào giỏ hàng:', error);
            this.showToast('Có lỗi xảy ra khi thêm vào giỏ hàng', 'error');
        }
    }

    async handleAddToWishlist() {
        if (!this.product) return;

        try {
            const response = await fetch('/api/wishlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: this.product.id
                })
            });

            if (response.ok) {
                this.showToast('Đã thêm vào danh sách yêu thích', 'success');
                this.wishlistBtn.classList.add('active');
            } else {
                throw new Error('Lỗi khi thêm vào danh sách yêu thích');
            }
        } catch (error) {
            console.error('Lỗi khi thêm vào wishlist:', error);
            this.showToast('Có lỗi xảy ra khi thêm vào danh sách yêu thích', 'error');
        }
    }

    async handleReviewFilterChange(filter) {
        // Xóa active class từ tất cả filters
        this.reviewFilters.forEach(f => f.classList.remove('active'));

        // Thêm active class cho filter được chọn
        filter.classList.add('active');

        // Lấy giá trị filter
        const filterValue = filter.dataset.value;

        // Tải lại đánh giá với filter mới
        const reviews = await this.service.getProductReviews(this.productId, {
            filter: filterValue
        });

        // Render lại đánh giá
        this.renderReviews(reviews);
    }

    async loadMoreReviews() {
        // Lấy trang hiện tại
        const currentPage = parseInt(this.loadMoreReviewBtn.dataset.page) || 1;

        // Lấy filter hiện tại
        const activeFilter = document.querySelector('.filter-btn-simple.active');
        const filterValue = activeFilter ? activeFilter.dataset.value : null;

        // Tải thêm đánh giá
        const reviews = await this.service.getProductReviews(this.productId, {
            page: currentPage + 1,
            filter: filterValue
        });

        // Thêm đánh giá mới vào danh sách
        this.appendReviews(reviews);

        // Cập nhật trang hiện tại
        this.loadMoreReviewBtn.dataset.page = currentPage + 1;

        // Ẩn nút nếu không còn đánh giá
        if (reviews.reviews.length === 0) {
            this.loadMoreReviewBtn.style.display = 'none';
        }
    }

    renderReviews(reviewData) {
        if (!this.reviewContainer) return;

        const { reviews, summary } = reviewData;

        // Render tổng quan đánh giá
        this.renderReviewSummary(summary);

        // Render danh sách đánh giá
        this.reviewContainer.innerHTML = reviews.map(review => this.createReviewHTML(review)).join('');

        // Hiển thị/ẩn nút load more
        if (this.loadMoreReviewBtn) {
            this.loadMoreReviewBtn.style.display = reviews.length < summary.total ? 'block' : 'none';
            this.loadMoreReviewBtn.dataset.page = 1;
        }
    }

    appendReviews(reviewData) {
        const { reviews } = reviewData;

        // Thêm HTML của đánh giá mới
        const reviewsHTML = reviews.map(review => this.createReviewHTML(review)).join('');

        // Chèn vào trước nút load more
        if (this.loadMoreReviewBtn) {
            this.loadMoreReviewBtn.insertAdjacentHTML('beforebegin', reviewsHTML);
        } else {
            this.reviewContainer.insertAdjacentHTML('beforeend', reviewsHTML);
        }
    }

    renderReviewSummary(summary) {
        // Render số sao trung bình
        document.querySelector('.rating-average').textContent = summary.average.toFixed(1);

        // Render tổng số đánh giá
        document.querySelector('.total-ratings').textContent = `${summary.total} đánh giá`;

        // Render phân phối số sao
        Object.entries(summary.distribution).forEach(([star, count]) => {
            const percent = (count / summary.total * 100).toFixed(0);
            const barElement = document.querySelector(`.rating-bar-item:nth-child(${6 - star}) .rating-bar-fill`);
            if (barElement) {
                barElement.style.width = `${percent}%`;
            }
        });
    }

    createReviewHTML(review) {
        return `
            <div class="review-item">
                <div class="reviewer-info">
                    <div class="reviewer-avatar">
                        ${review.avatar
                ? `<img src="${review.avatar}" alt="${review.name}">`
                : `<span class="avatar-placeholder">${this.getInitials(review.name)}</span>`
            }
                    </div>
                    <div class="reviewer-details">
                        <div class="reviewer-name">${review.name}</div>
                        <div class="reviewer-joined">Đã tham gia ${review.joinedTime}</div>
                    </div>
                </div>
                <div class="review-content">
                    <div class="review-rating">
                        <div class="rating-stars">
                            ${this.createRatingStars(review.rating)}
                        </div>
                        <span class="review-label">${this.getRatingLabel(review.rating)}</span>
                    </div>
                    ${review.verified ? `
                        <div class="review-purchase-info">
                            <i class="fas fa-check-circle verified-badge"></i> Đã mua hàng
                        </div>
                    ` : ''}
                    <div class="review-text">${review.content}</div>
                    ${review.images ? `
                        <div class="review-images">
                            ${review.images.map(img => `
                                <img src="${img}" alt="Review Image">
                            `).join('')}
                        </div>
                    ` : ''}
                    <div class="review-metadata">
                        <span class="review-date">
                            Đánh giá vào ${review.reviewTime}
                            ${review.usageTime ? ` · Đã dùng ${review.usageTime}` : ''}
                        </span>
                    </div>
                    <div class="review-actions">
                        <button class="action-btn like-btn">
                            <i class="far fa-thumbs-up"></i> 
                            ${review.likes ? review.likes : 'Hữu ích'}
                        </button>
                        <button class="action-btn comment-btn">
                            <i class="far fa-comment"></i> 
                            ${review.comments ? review.comments : 'Bình luận'}
                        </button>
                        <button class="action-btn share-btn">
                            <i class="fas fa-share"></i> Chia sẻ
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderRelatedProducts(products) {
        if (!this.relatedProductsContainer || !products.length) return;

        this.relatedProductsContainer.innerHTML = products.map(product => `
            <div class="col">
                <div class="book-card">
                    <img src="${product.image}" alt="${product.title}">
                    <div class="book-info">
                        ${product.sponsored ? '<span class="sponsored-tag">Tài trợ</span>' : ''}
                        ${product.freeShipping ? '<div class="shipping-badge fast-shipping">Freeship</div>' : ''}
                        <div class="shipping-badge authentic-badge">Chính hãng</div>
                        <h5 class="book-title">${product.title}</h5>
                        <div class="book-author">${product.author}</div>
                        <div class="book-price">
                            ${this.formatPrice(product.price)}
                            ${product.discount ? `<span class="discount-tag">-${product.discount}%</span>` : ''}
                        </div>
                        <div class="rating">${this.createRatingStars(product.rating)}</div>
                        <div class="sold-count">Đã bán ${this.formatNumber(product.soldCount)}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async loadRecentlyViewed() {
        const products = await this.service.getRecentlyViewed();
        if (!this.recentlyViewedContainer || !products.length) return;

        this.recentlyViewedContainer.innerHTML = products.map(product => `
            <div class="col">
                <div class="book-card">
                    <img src="${product.image}" alt="${product.title}">
                    <div class="book-info">
                        <h5 class="book-title">${product.title}</h5>
                        <div class="book-price">
                            ${this.formatPrice(product.price)}
                            ${product.discount ? `<span class="discount-tag">-${product.discount}%</span>` : ''}
                        </div>
                        <div class="rating">${this.createRatingStars(product.rating)}</div>
                        <div class="sold-count">Đã bán ${this.formatNumber(product.soldCount)}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Utility methods
    formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    }

    formatNumber(number) {
        if (number >= 1000) {
            return (number / 1000).toFixed(1) + 'k';
        }
        return number.toString();
    }

    createRatingStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return `
            ${'<i class="fas fa-star"></i>'.repeat(fullStars)}
            ${hasHalfStar ? '<i class="fas fa-star-half-alt"></i>' : ''}
            ${'<i class="far fa-star"></i>'.repeat(emptyStars)}
        `;
    }

    getInitials(name) {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    getRatingLabel(rating) {
        const labels = {
            5: 'Cực kì hài lòng',
            4: 'Hài lòng',
            3: 'Bình thường',
            2: 'Không hài lòng',
            1: 'Rất không hài lòng'
        };
        return labels[rating] || '';
    }

    showLoading(isLoading) {
        // Implement loading UI
    }

    showError(message) {
        // Implement error UI
    }

    showToast(message, type = 'info') {
        // Implement toast notification
    }

    async updateCartCount() {
        // Implement cart count update
    }
}

