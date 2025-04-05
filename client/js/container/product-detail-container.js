import { ProductDetailService } from '../service/product-detail-service.js';
import { UserService } from '../service/user-service.js';
import { CartService } from '../service/cart-service.js';
import { Utils } from '../utils/index.js';
import { updateCartFromServer } from '../app/header.js';


export class ProductDetailContainer {
    constructor() {
        this.service = new ProductDetailService();
        this.userService = new UserService();
        this.cartService = new CartService();

        this.productId = this.getProductIdFromUrl();
        this.product = null;
        this.quantity = 1;

        // Đánh giá sản phẩm
        this.ratingsSummary = null;
        this.totalReviews = 0;
        this.currentPageReviews = 1;
        this.totalPagesReviews = 1;
        this.hasMoreReviews = false;
        this.reviews = [];
        this.filterReviews = {
            page: 1,
            limit: 2,
            filter: 'newest',
        }

        this.initializeElements();
        this.bindEvents();
        this.loadInitialData();
        this.updateCartCount();
    }

    getProductIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    initializeElements() {
        // Lấy thông tin người dùng từ local storage
        this.user = JSON.parse(localStorage.getItem('user'));
        this.token = localStorage.getItem('token');
        this.cart = JSON.parse(localStorage.getItem('cart'));

        this.breadcrumbs = document.getElementById('breadcrumb-item-active');

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

        // Nút lọc review
        this.reviewFilters = document.querySelectorAll('.filter-btn-simple');

        // Đánh giá sản phẩm
        this.ratingSummaryContainer = document.querySelector('.rating-summary');
        this.ratingBarsContainer = document.querySelector('.rating-bars');
        this.reviewContainer = document.querySelector('.review-list');
        this.loadMoreReviewBtn = document.getElementById('load-more-btn');

        // Sản phẩm liên quan
        this.relatedProductsContainer = document.getElementById('discover-swiper-wrapper');

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
        this.reviewFilters.forEach(filterBtn => {
            filterBtn.addEventListener('click', () => this.handleReviewFilterChange(filterBtn));
        });

        // Sư kiện scroll cho sidebar
        window.addEventListener('scroll', () => {
            const headerHeight = document.querySelector('header').offsetHeight + 10;
            document.querySelector('.product-sidebar').style.top = headerHeight + 'px';
        });


    }

    async loadInitialData() {
        if (!this.productId) {
            this.showError('Không tìm thấy sản phẩm');
            return;
        }

        try {
            // Tải song song các dữ liệu
            const [product, reviews] = await Promise.all([
                this.service.getProductDetail(this.productId),
                this.service.getProductReviews(this.productId, this.filterReviews),
            ]);

            // Lưu thông tin sản phẩm và đánh giá
            this.product = product;
            this.relatedProducts = await this.service.getRelatedProducts(this.product.categoryId)

            this.ratingsSummary = reviews.ratingsSummary;
            this.reviews = reviews.reviews;
            this.totalReviews = reviews.total;
            this.currentPageReviews = reviews.currentPage;
            this.totalPagesReviews = reviews.totalPages;
            this.hasMoreReviews = reviews.hasMore;


            // Render các phần của trang
            this.breadcrumbs.textContent = this.product.categoryBreadcrumb;
            this.renderProductInfo();
            this.renderRatingSummary(this.ratingsSummary);
            this.renderRatingBars(this.ratingsSummary);
            this.renderReviews(this.reviews);
            this.renderRelatedProducts();

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
            <span class="current-price">${Utils.formatPrice(price * (1 - discount / 100))}</span>
            <span class="original-price">${Utils.formatPrice(price)}</span>
            <span class="discount-percent">-${discount}%</span>
        ` : `
            <span class="current-price">${Utils.formatPrice(price)}</span>
        `

        // Cập nhật đánh giá
        this.ratingElement.innerHTML = Utils.createRatingStars(this.product.averageRatingScore);
        this.ratingAverageElement.textContent = this.product.averageRatingScore;
        this.ratingCountElement.textContent = `(${this.product.totalProductReviews})`;
        this.soldCountElement.textContent = `| Đã bán ${Utils.formatNumber(this.product.totalBuy)}`;

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

    // Thêm vào giỏ hàng
    async handleAddToCart() {
        // Tạo giỏ hàng nếu chưa có
        if (!this.cart) {
            localStorage.setItem('cart', JSON.stringify([]));
        }

        // Lấy thông tin sản phẩm và số lượng
        const productId = this.product.id;
        const quantity = this.quantity;

        // Nếu không có user thì lưu sản phẩm vào giỏ hàng trong local storage
        if (!this.user) {
            const cart = JSON.parse(localStorage.getItem('cart'));

            // kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
            const productIndex = cart.findIndex(item => item.productId === productId);
            if (productIndex !== -1) {
                cart[productIndex].quantity += quantity;
            } else {
                cart.push({
                    productId: productId,
                    productName: this.product.name,
                    productImage: this.product.image || "/asset/images/image.png",
                    productPrice: this.product.price,
                    productDiscount: this.product.discount || 0,
                    quantity: quantity
                });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            this.cart = cart;
            // Cập nhật số lượng sản phẩm trong giỏ hàng
            this.updateCartCount();
        } else {
            // Nếu có user thì gọi API thêm vào giỏ hàng
            const response = await this.cartService.saveCart(
                this.user.id,
                [{
                    productId: productId,
                    productName: this.product.name,
                    productImage: this.product.image || "/asset/images/image.png",
                    productPrice: this.product.price,
                    productDiscount: this.product.discount || 0,
                    quantity: quantity
                }]
            );
            if (!response.success) {
                this.showError(response.message);
                return;
            }
            // Cập nhật giỏ hàng
            updateCartFromServer(document.getElementById('cart-count'))
        }


        // Hiển thị thông báo thêm vào giỏ hàng thành công
        this.showAddToCartNotification();
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
        this.totalPriceElement.innerHTML = Utils.formatPrice(total);
    }

    async handleReviewFilterChange(filterBtn) {
        // Xóa active class từ tất cả filters
        this.reviewFilters.forEach(f => f.classList.remove('active'));

        // Thêm active class cho filter được chọn
        filterBtn.classList.add('active');

        // Lấy giá trị filter
        this.filterReviews.filter = filterBtn.value
        this.filterReviews.page = 1

        // Tải lại đánh giá với filter mới
        const reviews = await this.service.getProductReviews(this.productId, this.filterReviews);
        this.reviews = reviews.reviews
        this.totalReviews = reviews.total
        this.currentPageReviews = reviews.currentPage
        this.totalPagesReviews = reviews.totalPages
        this.hasMoreReviews = reviews.hasMore

        // Render lại đánh giá
        this.renderReviews(this.reviews);
    }

    async loadMoreReviews() {
        // Call API
        this.filterReviews.page = this.currentPageReviews + 1
        const reviews = await this.service.getProductReviews(this.productId, this.filterReviews);
        this.hasMoreReviews = reviews.hasMore
        this.currentPageReviews = reviews.currentPage
        this.totalPagesReviews = reviews.totalPages
        this.reviews = [...this.reviews, ...reviews.reviews]

        // Thêm đánh giá mới vào danh sách
        this.appendReviews(reviews.reviews);

        // Kiểm tra xem có hiển thị nút load more hay không
        if (this.hasMoreReviews) {
            this.loadMoreReviewBtn.style.display = 'block';
        } else {
            this.loadMoreReviewBtn.style.display = 'none';
        }

    }

    renderRatingSummary(ratingsSummary) {
        if (!this.ratingSummaryContainer) return;

        this.ratingSummaryContainer.innerHTML = `
            <div class="rating-average">${ratingsSummary.averageRating}</div>
            <div class="rating-stars">${Utils.createRatingStars(ratingsSummary.averageRating)}</div>
            <div class="total-ratings">${ratingsSummary.totalReviews} đánh giá</div>
        `;
    }

    renderRatingBars(ratingsSummary) {
        if (!this.ratingBarsContainer) return;
        const percent = ratingsSummary.percentages
        const distribution = Object.entries(ratingsSummary.distribution).reverse()

        this.ratingBarsContainer.innerHTML = `
            ${distribution.map(([star, count]) => `
                <div class="rating-bar-item">
                    <div class="rating-label">${star}</div>
                    <div class="rating-bar">
                        <div class="rating-bar-fill" style="width: ${percent[star]}%"></div>
                    </div>
                    <div class="rating-count">${count}</div>
                </div>
            `).join('')}
        `;
    }

    renderReviews(reviews) {
        if (!this.reviewContainer) return;

        // Render danh sách đánh giá
        this.reviewContainer.innerHTML = reviews.length > 0
            ? reviews.map(review => this.createReviewHTML(review)).join('')
            : `     
                <div class="no-reviews d-flex flex-column align-items-center justify-content-center mt-5">
                    <p>Không có đánh giá</p>
                </div>
            `;

        // Hiển thị/ẩn nút load more khi hasMoreReviews là true
        const loadMoreHTML = `
            <button class="load-more-btn" id="load-more-btn">
                <i class="fas fa-spinner"></i> Xem thêm đánh giá
            </button>
        `;
        this.reviewContainer.insertAdjacentHTML('beforeend', loadMoreHTML);
        const loadMoreBtn = document.getElementById('load-more-btn');
        loadMoreBtn.style.display = this.hasMoreReviews ? 'block' : 'none';

        this.loadMoreReviewBtn = document.getElementById('load-more-btn');
        this.loadMoreReviewBtn.addEventListener('click', () => this.loadMoreReviews());
    }

    appendReviews(reviewData) {

        // Thêm HTML của đánh giá mới
        const reviewsHTML = reviewData.map(review => this.createReviewHTML(review)).join('');

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

    // Thêm phương thức này vào class ProductDetailContainer
    initializeSwiper() {
        // Khởi tạo Swiper cho phần "Khám phá thêm"
        const discoverSwiper = new Swiper('.discover-swiper', {
            slidesPerView: 1,
            spaceBetween: 16,
            pagination: {
                el: '.discover-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.discover-next',
                prevEl: '.discover-prev',
            },
            breakpoints: {
                576: {
                    slidesPerView: 2,
                },
                768: {
                    slidesPerView: 3,
                },
                992: {
                    slidesPerView: 4,
                }
            }
        });
    }

    // Cập nhật phương thức renderRelatedProducts để sử dụng Swiper
    renderRelatedProducts() {
        if (!this.relatedProductsContainer) return;

        // Thay đổi HTML để sử dụng cấu trúc Swiper
        const relatedProducts = this.relatedProducts
        this.relatedProductsContainer.innerHTML = `
        <div class="swiper discover-swiper">
            <div class="swiper-wrapper">
                ${relatedProducts.map(product => `
                    <div class="swiper-slide">
                        <div class="book-card">
                            <img src="/asset/images/image.png" alt="${product.name}">
                            <div class="book-info">
                                <span class="shipping-badge sponsored-tag">Tài trợ</span>
                                <div class="shipping-badge authentic-badge">Chính hãng</div>
                                <h5 class="book-title">${product.name}</h5>
                                <div class="book-author">${product.author}</div>
                                <div class="book-price">
                                    ${Utils.formatPrice(product.price * (1 - product.discount / 100))}
                                    ${product.discount ? `<span class="discount-tag">-${product.discount}%</span>` : ''}
                                </div>
                                <div class="sold-count">Đã bán ${Utils.formatNumber(product.totalBuy)}</div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="swiper-pagination discover-pagination"></div>
        </div>
    `;

        // Khởi tạo Swiper
        this.initializeSwiper();
    }

    createReviewHTML(review) {
        return `
            <div class="review-item" data-id="${review.id}">
                <div class="reviewer-info">
                    <div class="reviewer-avatar">
                        ${review.avatar
                ? `<img src="https://avatar.iran.liara.run/public" alt="${review.userName}">`
                : `<span class="avatar-placeholder">${Utils.getInitials(review.userName)}</span>`
            }
                    </div>
                    <div class="reviewer-details">
                        <div class="reviewer-name">${review.userName}</div>
                    </div>
                </div>
                <div class="review-content">
                    <div class="review-rating">
                        <div class="rating-stars">
                            ${Utils.createRatingStars(review.rating)}
                        </div>
                        <span class="review-label">${Utils.getRatingLabel(review.rating)}</span>
                    </div>
                    <div class="review-purchase-info">
                        <i class="fas fa-check-circle verified-badge"></i> Đã mua hàng
                    </div>
                    <div class="review-text">${review.content}</div>
                    
                    <div class="review-metadata">
                        <span class="review-date">
                            Đánh giá vào ${review.reviewDate}
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
                            ${Utils.formatPrice(product.price)}
                            ${product.discount ? `<span class="discount-tag">-${product.discount}%</span>` : ''}
                        </div>
                        <div class="rating">${Utils.createRatingStars(product.rating)}</div>
                        <div class="sold-count">Đã bán ${Utils.formatNumber(product.soldCount)}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    showAddToCartNotification() {
        // Tìm phần tử giỏ hàng message
        const message = document.getElementById('cart-success-message');
        message.style.display = 'flex';

        // Tự động ẩn thông báo sau 2.5 giây
        setTimeout(() => {
            message.style.display = 'none';
        }, 2500);
    }
    async updateCartCount() {
        // Cập nhật số lượng sản phẩm trong giỏ hàng
        const cartCountElement = document.getElementById('cart-count');
        cartCountElement.textContent = this.cart.length;
    }
}

