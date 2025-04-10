import { OrderService } from "../service/order-service.js";
import { formatDate } from "../utils/formatter.js";

// OrderDetail.js
export class OrderDetailContainer {
    constructor() {
        this.orderService = new OrderService();
        this.orderCode = this.getOrderCodeFromUrl();
        this.orderData = null;

        // DOM Elements
        this.orderLoadingIndicator = document.getElementById('orderLoadingIndicator');
        this.orderLoadError = document.getElementById('orderLoadError');
        this.errorMessage = document.getElementById('errorMessage');
        this.orderContent = document.getElementById('orderContent');

        // Initialize
        this.init();
    }

    /**
     * Get order code from URL query parameter
     * @returns {string|null} the order code or null if not found
     */
    getOrderCodeFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('code');
    }

    /**
     * Initialize the order detail page
     */
    async init() {
        if (!this.orderCode) {
            this.showError('Mã đơn hàng không hợp lệ');
            return;
        }

        await this.loadOrderDetail();
        this.setupEventListeners();
    }

    /**
     * Load order detail from the server
     */
    async loadOrderDetail() {
        try {
            // Show loading indicator
            this.orderLoadingIndicator.classList.remove('d-none');
            this.orderLoadError.classList.add('d-none');
            this.orderContent.classList.add('d-none');

            // Fetch order data
            const result = await this.orderService.getOrderDetail(this.orderCode);

            // Hide loading indicator
            this.orderLoadingIndicator.classList.add('d-none');

            if (result.success) {
                this.orderData = result.data;
                this.renderOrderDetail();
                this.orderContent.classList.remove('d-none');
            } else {
                this.showError(result.message);
            }
        } catch (error) {
            console.error('Error loading order detail:', error);
            this.showError('Đã xảy ra lỗi khi tải thông tin đơn hàng');
        }
    }

    /**
     * Show error message
     * @param {string} message Error message to display
     */
    showError(message) {
        this.orderLoadingIndicator.classList.add('d-none');
        this.orderContent.classList.add('d-none');
        this.orderLoadError.classList.remove('d-none');
        this.errorMessage.textContent = message;
    }

    /**
     * Format currency to VND
     * @param {number} amount Amount to format
     * @returns {string} Formatted currency string
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).format(amount).replace('₫', 'đ');
    }

    /**
     * Format date to readable format
     * @param {string} dateString Date string to format
     * @returns {string} Formatted date string
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }

    /**
     * Get status class based on order status
     * @param {string} status Order status
     * @returns {string} CSS class for the status
     */
    getStatusClass(status) {
        const statusMap = {
            'pending': 'status-pending',
            'processing': 'status-processing',
            'shipping': 'status-shipped',
            'delivered': 'status-delivered',
            'cancelled': 'status-cancelled'
        };
        return statusMap[status] || 'status-pending';
    }

    /**
     * Render the order detail
     */
    renderOrderDetail() {
        const order = this.orderData.order;

        // Basic order info
        document.getElementById('displayOrderCode').textContent = order.orderCode;
        document.getElementById('displayOrderDate').textContent = this.formatDate(order.orderDate);

        // Order status
        const statusEl = document.getElementById('displayOrderStatus');
        statusEl.textContent = order.statusText;
        statusEl.className = `order-status ${this.getStatusClass(order.status)}`;

        // Cancel button visibility
        const btnCancelOrder = document.getElementById('btnCancelOrder');
        if (order.canCancel) {
            btnCancelOrder.classList.remove('d-none');
        } else {
            btnCancelOrder.classList.add('d-none');
        }

        // Timeline
        this.renderTimeline();

        // Shipping info
        document.getElementById('shippingName').textContent = this.orderData.shipping.receiverName;
        document.getElementById('shippingPhone').textContent = this.orderData.shipping.receiverPhone;
        document.getElementById('shippingEmail').textContent = this.orderData.shipping.receiverEmail;
        document.getElementById('shippingAddress').textContent = this.orderData.shipping.fullAddress;
        document.getElementById('shippingMethod').textContent =
            `${this.orderData.delivery.name} (${this.orderData.delivery.estimatedDays})`;

        // Payment info
        document.getElementById('paymentMethod').textContent = this.orderData.payment.name;
        document.getElementById('paymentStatus').textContent = this.orderData.paymentTransaction.statusText;

        // Discount info
        const discountAmount = this.orderData.order.discountAmount;
        if (discountAmount > 0) {
            document.getElementById('discountInfo').textContent = `-${this.formatCurrency(discountAmount)}`;
        } else {
            document.getElementById('discountInfo').textContent = 'Không có';
        }

        // Order items
        this.renderOrderItems();

        // Order summary
        const summary = this.orderData.summary;
        document.getElementById('summarySubtotal').textContent = this.formatCurrency(summary.subtotal);
        document.getElementById('summaryDiscount').textContent =
            summary.discount > 0 ? `-${this.formatCurrency(summary.discount)}` : '0đ';
        document.getElementById('summaryShipping').textContent =
            summary.shipping > 0 ? `+${this.formatCurrency(summary.shipping)}` : 'Miễn phí';
        document.getElementById('summaryTotal').textContent = this.formatCurrency(summary.total);
    }

    /**
     * Render the order timeline
     */
    renderTimeline() {
        const timelineContainer = document.getElementById('orderTimeline');
        timelineContainer.innerHTML = '';

        const timeline = this.orderData.timeline;

        timeline.forEach(item => {
            // Create timeline item
            const timelineItem = document.createElement('div');
            timelineItem.className = `timeline-item ${item.active ? 'active' : ''} ${item.completed ? 'completed' : ''}`;

            // Create dot
            const dot = document.createElement('div');
            dot.className = 'timeline-dot';

            // Create icon
            const icon = document.createElement('i');
            icon.className = item.icon;
            dot.appendChild(icon);

            // Create label
            const label = document.createElement('div');
            label.className = 'timeline-label';
            label.textContent = item.label;

            // Create date
            const date = document.createElement('div');
            date.className = 'timeline-date';
            date.textContent = item.timestamp ? this.formatDate(item.timestamp) : '';

            // Append elements
            timelineItem.appendChild(dot);
            timelineItem.appendChild(label);
            timelineItem.appendChild(date);

            // Add to container
            timelineContainer.appendChild(timelineItem);
        });
    }

    /**
     * Render order items
     */
    renderOrderItems() {
        const orderItemsContainer = document.getElementById('orderItemsContainer');
        orderItemsContainer.innerHTML = '';

        const items = this.orderData.items;

        items.forEach(item => {
            const row = document.createElement('tr');

            // Product cell
            const productCell = document.createElement('td');
            productCell.innerHTML = `
                <div class="product-cell">
                    <img src="/asset/images/${item.productImage}" alt="${item.productName}" class="product-image">
                    <div>
                        <div class="product-title">                                            
                            <a href="/client/product.html?id=${item.id}" target="_blank" class="text-decoration-none">
                                ${item.productName}
                            </a>
                        </div>
                        <div class="product-author">${item.author}</div>
                        <button class="btn-review" data-product-id="${item.productId}" data-product-name="${item.productName}" data-product-author="${item.author}" data-product-image="${item.productImage}">Đánh giá</button>
                    </div>
                </div>
            `;

            // Price cell
            const priceCell = document.createElement('td');
            priceCell.className = 'price-cell';

            // Show original price if discounted
            if (item.discountPercent > 0) {
                priceCell.innerHTML = `
                    <div class="price-discount">
                        <span class="discount-price">${this.formatCurrency(item.price)}</span>
                        <span class="original-price" style="color: #999;text-decoration: line-through;">
                            ${this.formatCurrency(item.basePrice)}
                        </span>
                    </div>
                `;
            } else {
                priceCell.textContent = this.formatCurrency(item.price);
            }

            // Quantity cell
            const quantityCell = document.createElement('td');
            quantityCell.className = 'quantity-cell';
            quantityCell.textContent = item.quantity;

            // Subtotal cell
            const subtotalCell = document.createElement('td');
            subtotalCell.className = 'subtotal-cell';
            subtotalCell.textContent = this.formatCurrency(item.subtotal);

            // Append cells to row
            row.appendChild(productCell);
            row.appendChild(priceCell);
            row.appendChild(quantityCell);
            row.appendChild(subtotalCell);

            // Append row to container
            orderItemsContainer.appendChild(row);
        });
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Cancel order button
        const btnCancelOrder = document.getElementById('btnCancelOrder');
        if (btnCancelOrder) {
            btnCancelOrder.addEventListener('click', () => this.handleCancelOrder());
        }

        // Order again button
        const btnOrderAgain = document.getElementById('btnOrderAgain');
        if (btnOrderAgain) {
            btnOrderAgain.addEventListener('click', () => this.handleOrderAgain());
        }

        // Review buttons (delegation)
        document.addEventListener('click', (event) => {
            if (event.target && event.target.classList.contains('btn-review')) {
                this.handleReviewButtonClick(event.target);
            }
        });

        // Review modal events
        const closeReviewModal = document.getElementById('closeReviewModal');
        const cancelReview = document.getElementById('cancelReview');
        const reviewForm = document.getElementById('reviewForm');
        const photoUpload = document.getElementById('photoUpload');

        if (closeReviewModal) {
            closeReviewModal.addEventListener('click', () => this.closeReviewModal());
        }

        if (cancelReview) {
            cancelReview.addEventListener('click', () => this.closeReviewModal());
        }

        if (reviewForm) {
            reviewForm.addEventListener('submit', (event) => this.handleReviewSubmit(event));
        }

        if (photoUpload) {
            photoUpload.addEventListener('change', (event) => this.handlePhotoUpload(event));
        }
    }

    /**
     * Handle cancel order
     */
    handleCancelOrder() {
        if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
            return;
        }

        // TODO: Implement cancel order API call
        console.log('Cancel order:', this.orderCode);

        // For demo, just show an alert
        alert('Chức năng đang được phát triển');
    }

    /**
     * Handle order again
     */
    handleOrderAgain() {
        // TODO: Implement order again functionality
        console.log('Order again:', this.orderCode);

        // For demo, just redirect to cart
        window.location.href = '/cart';
    }

    /**
     * Handle review button click
     * @param {HTMLElement} button The clicked button
     */
    handleReviewButtonClick(button) {
        const productId = button.dataset.productId;
        const productName = button.dataset.productName;
        const productAuthor = button.dataset.productAuthor;
        const productImage = button.dataset.productImage;

        // Set review modal data
        document.getElementById('reviewProductId').value = productId;
        document.getElementById('reviewOrderId').value = this.orderData.order.id;
        document.getElementById('reviewProductTitle').textContent = productName;
        document.getElementById('reviewProductAuthor').textContent = productAuthor;
        document.getElementById('reviewProductImage').src = `/uploads/${productImage}`;

        // Clear previous inputs
        document.getElementById('reviewForm').reset();
        document.getElementById('photoPreviewContainer').innerHTML = '';

        // Open modal
        document.getElementById('reviewModalOverlay').classList.add('visible');
    }

    /**
     * Close review modal
     */
    closeReviewModal() {
        document.getElementById('reviewModalOverlay').classList.remove('visible');
    }

    /**
     * Handle review submit
     * @param {Event} event Form submit event
     */
    handleReviewSubmit(event) {
        event.preventDefault();

        const productId = document.getElementById('reviewProductId').value;
        const orderId = document.getElementById('reviewOrderId').value;
        const rating = document.querySelector('input[name="rating"]:checked')?.value || 0;
        const title = document.getElementById('reviewTitle').value;
        const content = document.getElementById('reviewContent').value;

        // Get selected tags
        const tags = Array.from(document.querySelectorAll('input[name="tags"]:checked'))
            .map(input => input.value);

        // Get photo files
        const photoFiles = document.getElementById('photoUpload').files;

        // Validate
        if (!rating) {
            alert('Vui lòng chọn số sao đánh giá');
            return;
        }

        if (!content.trim()) {
            alert('Vui lòng nhập nội dung đánh giá');
            return;
        }

        // TODO: Implement review submission API call
        console.log('Submit review:', {
            productId,
            orderId,
            rating,
            title,
            content,
            tags,
            photoCount: photoFiles.length
        });

        // Close modal
        this.closeReviewModal();

        // Show success message
        alert('Cảm ơn bạn đã gửi đánh giá!');
    }

    /**
     * Handle photo upload for review
     * @param {Event} event Input change event
     */
    handlePhotoUpload(event) {
        const files = event.target.files;
        const previewContainer = document.getElementById('photoPreviewContainer');

        // Clear previous previews
        previewContainer.innerHTML = '';

        // Limit to 5 files
        const maxFiles = 5;
        const filesToPreview = Array.from(files).slice(0, maxFiles);

        filesToPreview.forEach(file => {
            // Create preview element
            const preview = document.createElement('div');
            preview.className = 'photo-preview';

            // Create image
            const img = document.createElement('img');
            img.className = 'preview-image';

            // Create reader
            const reader = new FileReader();
            reader.onload = (e) => {
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);

            // Create remove button
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-photo';
            removeBtn.innerHTML = '&times;';
            removeBtn.addEventListener('click', () => {
                preview.remove();
                // TODO: Handle file removal from the input
            });

            // Append elements
            preview.appendChild(img);
            preview.appendChild(removeBtn);
            previewContainer.appendChild(preview);
        });

        // Show message if too many files
        if (files.length > maxFiles) {
            const message = document.createElement('div');
            message.className = 'photo-limit-message';
            message.textContent = `Chỉ hiển thị ${maxFiles}/${files.length} ảnh. Tối đa ${maxFiles} ảnh.`;
            previewContainer.appendChild(message);
        }
    }
}