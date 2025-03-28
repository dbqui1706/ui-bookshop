import { CartService } from '../service/cart-service.js';

export class CartContainer {
    constructor() {
        // Khởi tạo dịch vụ giỏ hàng
        this.cartService = new CartService();

        // Lấy giỏ hàng từ localStorage
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.user = JSON.parse(localStorage.getItem('user')) || null;
        console.log("Cart storage:", this.cart);

        // Các phần tử DOM
        this.cartItems = document.querySelectorAll('.cart-item');
        this.selectAllCheckbox = document.getElementById('select-all-checkbox');
        this.selectAllLabel = document.getElementById('select-all-label');
        this.minusButtons = document.querySelectorAll('.quantity-btn:first-child');
        this.plusButtons = document.querySelectorAll('.quantity-btn:last-child');
        this.quantityInputs = document.querySelectorAll('.quantity-input');
        this.removeButtons = document.querySelectorAll('.item-actions .fa-trash-alt');
        this.changeCouponsLink = document.getElementById('more-coupons');
        this.changeAddressLink = document.getElementById('change-address');
        this.checkoutButton = document.querySelector('.checkout-button');

        this.cartCount = document.getElementById('cart-count');
        this.b

        // Khởi tạo các event listeners
        this.initEventListeners();

        // Tải giỏ hàng từ server or local storage
        this.loadCart();

        // Khởi tạo các popover và modal
        this.initPopoversAndModals();
    }

    async loadCart() {
        try {
            // Kiểm tra xem user có tồn tại hay không
            if (this.user) {
                const userId = this.user.id;

                // Gọi API để lấy giỏ hàng
                const cartData = await this.cartService.getCart(userId);

                if (cartData && cartData.items) {
                    this.cart = cartData.items;
                    this.updateCartUI(true);
                    this.saveCartToLocalStorage();
                }
            } else {
                this.updateCartUI(true);
                this.saveCartToLocalStorage();
            }
        } catch (error) {
            console.error('Lỗi khi tải giỏ hàng:', error);
        }
    }

    updateCartUI(trigger = false) {
        // Hiển thị phần giỏ hàng trống nếu không có sản phẩm
        const emptyCart = document.querySelector('.cart-empty').parentElement;
        const cartMain = document.querySelector('.cart-main-container').parentElement;
        const checkoutSummary = document.querySelector('.checkout-summary').parentElement;

        if (this.cart.length === 0) {
            emptyCart.classList.remove('d-none');
            cartMain.classList.add('d-none');
            checkoutSummary.classList.add('d-none');
        } else {
            emptyCart.classList.add('d-none');
            cartMain.classList.remove('d-none');
            checkoutSummary.classList.remove('d-none');
        }

        // Cập nhật số lượng sản phẩm trong giỏ hàng
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = this.cart.length;
        }

        // Cập nhật label "Tất cả (X sản phẩm)"
        if (this.selectAllLabel) {
            this.selectAllLabel.textContent = `Tất cả (${this.cart.length} sản phẩm)`;
        }

        // render cart items
        this.renderCartItems(trigger);

        // Cập nhật nút Mua Hàng
        if (this.checkoutButton) {
            const selectedItemsCount = this.getSelectedItemsCount();
            this.checkoutButton.textContent = `Mua Hàng (${selectedItemsCount})`;
        }

        // Tính toán và cập nhật tổng tiền
        this.updateTotalPrice();
    }

    renderCartItems(trigger = false) {
        // render cart items
        this.sellerGroup = document.querySelector('#seller-group');
        const cartItemsHTML = this.cart.map(item => {
            if (trigger) {
                item.checked = true;
            }
            return this.createCartItem(item);
        }).join('');
        this.sellerGroup.innerHTML = cartItemsHTML;

        // add event listener to item checkboxes
        this.itemCheckboxesListener();
        // add event listener to quantity inputs
        this.quantityInputsListener();
    }

    // Sự kiện cho checkbox item
    itemCheckboxesListener() {
        this.itemCheckboxes = document.querySelectorAll('.item-checkbox input[type="checkbox"]');

        this.itemCheckboxes.forEach((checkbox, index) => {
            checkbox.addEventListener('change', () => {
                this.cart[index].checked = checkbox.checked;
                this.updateTotalPrice();
                this.selectAllCheckbox.checked = this.cart.every(item => item.checked);
                this.checkoutButton.textContent = `Mua Hàng (${this.getSelectedItemsCount()})`;
            });
        });
    }

    // Sự kiện cho input số lượng
    quantityInputsListener() {
        this.sellerGroup.addEventListener('click', (event) => {
            let productId = -1;
            // Xử lý nút tăng số lượng
            if (event.target.classList.contains('quantity-increase')) {
                productId = parseInt(event.target.getAttribute('data-item-id'));
                this.handleIncreaseQuantity(productId);
            }

            // Xử lý nút giảm số lượng
            if (event.target.classList.contains('quantity-decrease')) {
                productId = parseInt(event.target.getAttribute('data-item-id'));
                this.handleDecreaseQuantity(productId);
            }

            // Cập nhật giá trị trong input số lượng
            const product = this.cart.find(item => item.productId === productId);
            if (product) {
                event.target.parentElement.querySelector('.quantity-input').value = product.quantity;
                // Cập nhật giá trị trong cột đơn giá
                this.handleUpdatePriceColumn(productId);
            }

            // Xử lý nút xóa sản phẩm
            if (event.target.classList.contains('remove-item')) {
                const productId = parseInt(event.target.getAttribute('data-item-id'));
                this.handleRemoveItem(productId);
            }
        });
    }

    handleUpdatePriceColumn(productId) {
        const product = this.cart.find(item => item.productId === productId);
        if (product) {
            // Lấy ra card-item có productId tương ứng
            const cardItem = document.querySelector(`.cart-item[data-item-id="${productId}"]`);
            if (cardItem) {
                cardItem.querySelector('.price-current').innerHTML = this.formatPrice(
                    (product.productPrice * (1 - product.productDiscount / 100) * product.quantity).toFixed(0)
                );
                cardItem.querySelector('.price-original').innerHTML = this.formatPrice(product.productPrice * product.quantity);
            }
        }
    }

    createCartItem(item) {
        return `
            <div class="cart-item" data-item-id="${item.productId}">
                <div class="item-content-wrapper">
                    <div class="item-checkbox">
                        <input type="checkbox" checked>
                    </div>
                    <div class="item-content">
                        <div class="item-image">
                            <img src="${item.productImage}" alt="${item.productName}">
                        </div>
                        <div class="item-details">
                            <div class="item-title">
                                ${item.productName}
                            </div>
                            <div class="item-delivery">
                                <i class="fas fa-truck-fast"></i> Giao thứ 4, 02/04
                            </div>
                            <div class="no-bookcare">
                                Sách không hỗ trợ Bookcare
                            </div>
                        </div>
                    </div>
                </div>
                <div class="item-price">
                    <div class="price-current" data-item-id="${item.productId}">
                        ${this.formatPrice((item.productPrice * (1 - item.productDiscount / 100)).toFixed(0) * item.quantity)}
                    </div>
                    <div class="price-original" data-item-id="${item.productId}">
                        ${this.formatPrice(item.productPrice * item.quantity)}
                    </div>
                </div>
                <div class="item-quantity">
                    <div class="quantity-controls">
                        <button class="quantity-btn quantity-decrease" data-item-id="${item.productId}">−</button>
                        <input type="text" class="quantity-input" value="${item.quantity}" data-item-id="${item.productId}">
                        <button class="quantity-btn quantity-increase" data-item-id="${item.productId}">+</button>
                    </div>
                </div>
                <div class="item-actions">
                    <i class="fas fa-trash-alt remove-item" data-item-id="${item.productId}"></i>
                </div>
            </div>
        `;
    }

    getSelectedItemsCount() {
        return this.cart.filter(item => item.checked).length;
    }

    updateTotalPrice() {
        let totalOriginalPrice = 0;
        let totalDiscountPrice = 0;
        let totalPayment = 0;

        this.cart.forEach(item => {
            if (item.checked) {
                totalOriginalPrice += item.productPrice * item.quantity;
                totalPayment += (item.productPrice * (1 - item.productDiscount / 100)).toFixed(0) * item.quantity;
            }
        });

        totalDiscountPrice = totalOriginalPrice - totalPayment;

        // Cập nhật giá trị vào giao diện
        document.getElementById('total-price').innerHTML = this.formatPrice(totalOriginalPrice);
        document.getElementById('discount-price').innerHTML = this.formatPrice(-totalDiscountPrice);
        document.getElementById('total-payment').innerHTML = this.formatPrice(totalPayment);
    }


    formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + '<sup>đ</sup>';
    }

    saveCartToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    initEventListeners() {
        // Sự kiện cho checkbox "Chọn tất cả"
        if (this.selectAllCheckbox) {
            this.selectAllCheckbox.addEventListener('change', () => this.handleSelectAll());
        }

        // Sự kiện cho nút giảm số lượng
        this.minusButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => this.handleDecreaseQuantity(index));
        });

        // Sự kiện cho nút tăng số lượng
        this.plusButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => this.handleIncreaseQuantity(index));
        });

        // Sự kiện cho input số lượng
        this.quantityInputs.forEach((input, index) => {
            input.addEventListener('change', () => this.handleQuantityChange(index));
        });

        // Sự kiện cho liên kết "Xem thêm mã giảm giá"
        if (this.changeCouponsLink) {
            this.changeCouponsLink.addEventListener('click', () => this.openCouponModal());
        }

        // Sự kiện cho liên kết "Thay đổi địa chỉ"
        if (this.changeAddressLink) {
            this.changeAddressLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.openAddressModal();
            });
        }

        // Sự kiện cho nút thanh toán
        if (this.checkoutButton) {
            this.checkoutButton.addEventListener('click', () => this.handleCheckout());
        }
    }

    // Sự kiện cho checkbox "Chọn tất cả"
    handleSelectAll() {
        const isChecked = this.selectAllCheckbox.checked;
        this.cart.forEach(item => {
            item.checked = isChecked;
        });
        // Thay đổi các trang thái checkbox
        this.itemCheckboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
        });
        // Cập nhật số lượng sản phẩm trong button mua hàng
        this.checkoutButton.textContent = `Mua Hàng (${this.getSelectedItemsCount()})`;

        this.updateTotalPrice();
    }

    // Sự kiện cho nút giảm số lượng
    async handleDecreaseQuantity(productId) {
        this.cart.forEach((item) => {
            if (item.productId === productId) {
                item.quantity -= 1;
            }
        });
        this.updateTotalPrice();
        this.saveCartToLocalStorage();
    }

    // Sự kiện cho nút tăng số lượng
    async handleIncreaseQuantity(productId) {
        this.cart.forEach((item) => {
            if (item.productId === productId) {
                item.quantity += 1;
            }
        });

        this.updateTotalPrice();
        this.saveCartToLocalStorage();
    }

    // Sự kiện cho nút xóa sản phẩm
    async handleRemoveItem(productId) {
        this.cart = this.cart.filter(item => item.productId !== productId);
        this.saveCartToLocalStorage();
        this.updateCartUI();
        this.updateTotalPrice();
    }

    handleCheckout() {
        // Kiểm tra xem có sản phẩm nào được chọn không
        const hasSelectedItems = Array.from(this.itemCheckboxes).some(cb => cb.checked);

        if (!hasSelectedItems) {
            alert('Vui lòng chọn ít nhất một sản phẩm để mua hàng.');
            return;
        }

        // Chuyển đến trang thanh toán
        window.location.href = '/client/checkout.html';
    }

    initPopoversAndModals() {
        // Khởi tạo popover cho icon thông tin khuyến mãi
        this.initCouponInfoPopovers();
    }

    initCouponInfoPopovers() {
        const couponInfoIcons = document.querySelectorAll('.coupon-info-icon i');

        couponInfoIcons.forEach(icon => {
            // Tạo popover container
            const couponCode = "XTRA2470QCC0";
            const popover = document.createElement('div');
            popover.className = 'coupon-popover';
            popover.innerHTML = `
                <div class="popover-header">
                    <span>Mã</span>
                    <span class="popover-code">${couponCode} <i class="fas fa-copy" title="Nhấn để sao chép"></i></span>
                    <span class="copy-tooltip">Đã sao chép!</span>
                </div>
                <div class="popover-content">
                    <div class="popover-detail">
                        <div class="detail-row">
                            <span class="detail-label">Hạn sử dụng: <b style="font-weight: bold; color: #000;">30/08/36</b></span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Điều kiện</span>
                            <ul class="detail-conditions">
                                <li>Giảm 70K phí vận chuyển cho đơn hàng từ 100K.</li>
                                <li>Chỉ áp dụng cho các sản phẩm có gắn nhãn Freeship Xtra</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(popover);

            // Thêm chức năng copy khi click vào biểu tượng copy
            const copyIcon = popover.querySelector('.fa-copy');
            copyIcon.addEventListener('click', () => this.handleCopyCode(couponCode, popover));

            // Xử lý hiển thị/ẩn popover khi hover
            this.setupPopoverHoverBehavior(icon, popover);
        });
    }

    handleCopyCode(code, popover) {
        // Sao chép mã vào clipboard
        navigator.clipboard.writeText(code).then(() => {
            // Hiển thị tooltip "Đã sao chép"
            const tooltip = popover.querySelector('.copy-tooltip');
            tooltip.style.visibility = 'visible';
            tooltip.style.opacity = '1';

            // Ẩn tooltip sau 2 giây
            setTimeout(() => {
                tooltip.style.visibility = 'hidden';
                tooltip.style.opacity = '0';
            }, 2000);
        }).catch(err => {
            console.error('Không thể sao chép văn bản: ', err);
            // Phương pháp thay thế
            this.fallbackCopyTextToClipboard(code, popover);
        });
    }

    fallbackCopyTextToClipboard(text, popover) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);

        // Hiển thị tooltip
        const tooltip = popover.querySelector('.copy-tooltip');
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = '1';

        setTimeout(() => {
            tooltip.style.visibility = 'hidden';
            tooltip.style.opacity = '0';
        }, 2000);
    }

    setupPopoverHoverBehavior(icon, popover) {
        let isHoveringIcon = false;
        let isHoveringPopover = false;

        // Khi hover vào icon
        icon.addEventListener('mouseenter', () => {
            isHoveringIcon = true;
            const rect = icon.getBoundingClientRect();
            popover.style.top = (rect.top + window.scrollY - popover.offsetHeight - 10) + 'px';
            popover.style.left = (rect.left + window.scrollX - 220) + 'px';
            this.updatePopoverVisibility();
        });

        // Khi không hover vào icon nữa
        icon.addEventListener('mouseleave', () => {
            isHoveringIcon = false;
            setTimeout(this.updatePopoverVisibility, 100);
        });

        // Khi hover vào popover
        popover.addEventListener('mouseenter', () => {
            isHoveringPopover = true;
            this.updatePopoverVisibility();
        });

        // Khi không hover vào popover nữa
        popover.addEventListener('mouseleave', () => {
            isHoveringPopover = false;
            this.updatePopoverVisibility();
        });

        // Hàm cập nhật hiển thị popover dựa trên trạng thái hover
        const updatePopoverVisibility = () => {
            if (isHoveringIcon || isHoveringPopover) {
                popover.style.display = 'block';
            } else {
                popover.style.display = 'none';
            }
        };

        this.updatePopoverVisibility = updatePopoverVisibility;
    }

    openCouponModal() {
        // Tạo modal backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';
        document.body.appendChild(backdrop);

        // Tạo modal container
        const modal = document.createElement('div');
        modal.className = 'coupon-modal';
        modal.innerHTML = `
            <div class="modal-header">
                <h4>Tiki Khuyến Mãi</h4>
                <button class="close-modal"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <div class="coupon-search">
                    <input type="text" placeholder="Nhập mã giảm giá" class="coupon-input">
                    <button class="btn-apply-coupon">Áp dụng</button>
                </div>
                
                <div class="coupon-section">
                    <div class="section-header">
                        <h5>Mã Giảm Giá</h5>
                        <span class="section-badge">Áp dụng tối đa: 1</span>
                    </div>
                    
                    <div class="coupon-list">
                        <div class="coupon-card">
                            <div class="coupon-card-left">
                                <img src="/asset/images/tiki-logo.png" alt="Tiki Logo">
                            </div>
                            <div class="coupon-card-right">
                                <div class="coupon-info">
                                    <div class="coupon-title">Giảm 3%</div>
                                    <div class="coupon-desc">Cho đơn hàng từ 300K</div>
                                    <div class="coupon-date">HSD: 31/03/25</div>
                                </div>
                                <div class="coupon-status">
                                    <span class="status-badge">CHƯA THỎA ĐIỀU KIỆN</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="coupon-card">
                            <div class="coupon-card-left">
                                <img src="/asset/images/tiki-logo.png" alt="Tiki Logo">
                            </div>
                            <div class="coupon-card-right">
                                <div class="coupon-info">
                                    <div class="coupon-title">Giảm 15% tối đa 70K</div>
                                    <div class="coupon-desc">Cho đơn hàng từ 399K</div>
                                    <div class="coupon-date">HSD: 31/03/25</div>
                                </div>
                                <div class="coupon-status">
                                    <span class="status-badge">CHƯA THỎA ĐIỀU KIỆN</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="coupon-section mt-4">
                        <div class="section-header">
                            <h5>Mã Vận Chuyển</h5>
                            <span class="section-badge">Áp dụng tối đa: 1</span>
                        </div>
                        
                        <div class="coupon-list">
                            <div class="coupon-card selected">
                                <div class="coupon-card-left freeship-xtra">
                                    <div class="xtra-logo">FREESHIP<br>XTRA</div>
                                    <div class="xtra-free">Miễn phí<br>vận chuyển</div>
                                </div>
                                <div class="coupon-card-right">
                                    <div class="coupon-info">
                                        <div class="coupon-title">Giảm 70K</div>
                                        <div class="coupon-desc">Cho đơn hàng từ 100K</div>
                                        <div class="coupon-date">HSD: 30/08/36</div>
                                    </div>
                                    <div class="coupon-status">
                                        <button class="btn-select-coupon selected">Bỏ Chọn</button>
                                        <i class="fas fa-info-circle coupon-info-trigger"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Xử lý đóng modal
        const closeModal = () => {
            document.body.removeChild(backdrop);
            document.body.removeChild(modal);
        };

        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', closeModal);
        backdrop.addEventListener('click', closeModal);

        // Xử lý các nút chọn/bỏ chọn khuyến mãi
        const selectButtons = modal.querySelectorAll('.btn-select-coupon');
        selectButtons.forEach(button => {
            button.addEventListener('click', () => {
                const isSelected = button.classList.contains('selected');
                if (isSelected) {
                    button.classList.remove('selected');
                    button.textContent = 'Chọn';
                    button.closest('.coupon-card').classList.remove('selected');
                } else {
                    button.classList.add('selected');
                    button.textContent = 'Bỏ Chọn';
                    button.closest('.coupon-card').classList.add('selected');
                }
            });
        });

        // Xử lý các icon thông tin
        const infoTriggers = modal.querySelectorAll('.coupon-info-trigger');
        infoTriggers.forEach(trigger => {
            trigger.addEventListener('mouseenter', (e) => {
                const popover = document.querySelector('.coupon-popover');
                if (popover) {
                    const rect = trigger.getBoundingClientRect();
                    popover.style.display = 'block';
                    popover.style.top = (rect.top + window.scrollY - popover.offsetHeight - 10) + 'px';
                    popover.style.left = (rect.left + window.scrollX - 220) + 'px';
                }
            });

            trigger.addEventListener('mouseleave', () => {
                const popover = document.querySelector('.coupon-popover');
                if (popover) {
                    setTimeout(() => {
                        if (!popover.matches(':hover')) {
                            popover.style.display = 'none';
                        }
                    }, 100);
                }
            });
        });
    }

    openAddressModal() {
        // Tạo modal backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';
        document.body.appendChild(backdrop);

        // Tạo modal container
        const modal = document.createElement('div');
        modal.className = 'address-modal';
        modal.innerHTML = `
        <div class="modal-header">
            <h4>Thay đổi địa chỉ giao hàng</h4>
            <button class="close-modal"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
            <form class="address-form">
                <div class="form-row">
                    <label class="form-label">Họ tên</label>
                    <div class="form-input">
                        <input type="text" id="fullname" class="form-control" value="Quí Đặng">
                    </div>
                </div>
                
                <div class="form-row">
                    <label class="form-label">Điện thoại di động</label>
                    <div class="form-input">
                        <input type="text" id="phone" class="form-control" value="0975688272">
                    </div>
                </div>
                
                <div class="form-row">
                    <label class="form-label">Tỉnh/Thành phố</label>
                    <div class="form-input">
                        <select id="province" class="form-select">
                            <option value="">Chọn Tỉnh/Thành phố</option>
                        </select>
                        <div class="loading-spinner province-spinner" style="display: none;">
                            <i class="fas fa-spinner fa-spin"></i>
                        </div>
                    </div>
                </div>
                
                <div class="form-row">
                    <label class="form-label">Quận/Huyện</label>
                    <div class="form-input">
                        <select id="district" class="form-select" disabled>
                            <option value="">Chọn Quận/Huyện</option>
                        </select>
                        <div class="loading-spinner district-spinner" style="display: none;">
                            <i class="fas fa-spinner fa-spin"></i>
                        </div>
                    </div>
                </div>
                
                <div class="form-row">
                    <label class="form-label">Phường/Xã</label>
                    <div class="form-input">
                        <select id="ward" class="form-select" disabled>
                            <option value="">Chọn Phường/Xã</option>
                        </select>
                        <div class="loading-spinner ward-spinner" style="display: none;">
                            <i class="fas fa-spinner fa-spin"></i>
                        </div>
                    </div>
                </div>
                
                <div class="form-row">
                    <label class="form-label">Địa chỉ</label>
                    <div class="form-input">
                        <textarea id="address" class="form-control">22 N3, Phường Tân Bình</textarea>
                    </div>
                </div>
                <div class="address-note">
                    Để nhận hàng thuận tiện hơn, bạn vui lòng cho biết loại địa chỉ.
                </div>
                
                <div class="form-row">
                    <label class="form-label">Loại địa chỉ</label>
                    <div class="form-input">
                        <div class="address-types">
                            <div class="address-type">
                                <input type="radio" id="home" name="addressType" checked>
                                <label for="home">Nhà riêng / Chung cư</label>
                            </div>
                            <div class="address-type">
                                <input type="radio" id="company" name="addressType">
                                <label for="company">Cơ quan / Công ty</label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="default-address">
                    <input type="checkbox" id="defaultAddress" checked>
                    <label for="defaultAddress">Sử dụng địa chỉ này làm mặc định.</label>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn-cancel">Hủy bỏ</button>
                    <button type="button" class="btn-update">Cập nhật</button>
                </div>
            </form>
        </div>
        `;

        document.body.appendChild(modal);

        // Xử lý đóng modal
        const closeModal = () => {
            document.body.removeChild(backdrop);
            document.body.removeChild(modal);
        };

        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', closeModal);
        backdrop.addEventListener('click', closeModal);

        // Xử lý nút Hủy bỏ
        const cancelBtn = modal.querySelector('.btn-cancel');
        cancelBtn.addEventListener('click', closeModal);

        // Xử lý khi chọn tỉnh/thành phố
        const provinceSelect = modal.querySelector('#province');
        provinceSelect.addEventListener('change', () => {
            const provinceCode = provinceSelect.value;
            if (provinceCode) {
                this.loadDistricts(provinceCode);
                // Reset quận/huyện và phường/xã
                modal.querySelector('#district').innerHTML = '<option value="">Chọn Quận/Huyện</option>';
                modal.querySelector('#district').disabled = true;
                modal.querySelector('#ward').innerHTML = '<option value="">Chọn Phường/Xã</option>';
                modal.querySelector('#ward').disabled = true;
            }
        });

        // Xử lý khi chọn quận/huyện
        const districtSelect = modal.querySelector('#district');
        districtSelect.addEventListener('change', () => {
            const districtCode = districtSelect.value;
            if (districtCode) {
                this.loadWards(districtCode);
                // Reset phường/xã
                modal.querySelector('#ward').innerHTML = '<option value="">Chọn Phường/Xã</option>';
                modal.querySelector('#ward').disabled = true;
            }
        });


        // Xử lý nút Cập nhật
        const updateBtn = modal.querySelector('.btn-update');
        updateBtn.addEventListener('click', () => {
            // Lấy dữ liệu từ form
            const fullname = modal.querySelector('#fullname').value;
            const phone = modal.querySelector('#phone').value;
            const province = modal.querySelector('#province option:checked').text;
            const district = modal.querySelector('#district option:checked').text;
            const ward = modal.querySelector('#ward option:checked').text;
            const address = modal.querySelector('#address').value;
            const isDefault = modal.querySelector('#defaultAddress').checked;
            const addressType = modal.querySelector('input[name="addressType"]:checked').id === 'home' ?
                'Nhà' : 'Công ty';

            // Cập nhật địa chỉ trên trang giỏ hàng
            const customerNameEl = document.getElementById('customer-name');
            const customerPhoneEl = document.getElementById('customer-phone');
            const deliveryAddressTextEl = document.getElementById('delivery-address-text');
            const addressTagEl = document.getElementById('address-tag');

            if (customerNameEl) customerNameEl.textContent = fullname;
            if (customerPhoneEl) customerPhoneEl.textContent = phone;
            if (deliveryAddressTextEl) deliveryAddressTextEl.textContent =
                `${address}, ${ward}, ${district}, ${province}`;
            if (addressTagEl) addressTagEl.textContent = addressType;

            // Lưu địa chỉ vào localStorage để sử dụng cho thanh toán
            const shippingAddress = {
                fullname,
                phone,
                province,
                district,
                ward,
                address,
                isDefault,
                addressType
            };
            localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));

            // Đóng modal
            closeModal();
        });

        this.loadProvinces();

    }

    async loadProvinces() {
        const provinceSelect = document.querySelector('#province');
        const spinner = document.querySelector('.province-spinner');

        try {
            spinner.style.display = 'inline-block';

            // Gọi API để lấy danh sách tỉnh/thành phố
            const response = await fetch('https://provinces.open-api.vn/api/?depth=3');

            if (!response.ok) {
                throw new Error('Không thể tải dữ liệu tỉnh/thành phố');
            }

            const provinces = await response.json();

            // Thêm các option vào select
            provinces.forEach(province => {
                const option = document.createElement('option');
                option.value = province.code;
                option.textContent = province.name;
                provinceSelect.appendChild(option);
            });

            // Kích hoạt select
            provinceSelect.disabled = false;

            // Nếu đã có dữ liệu địa chỉ cũ, chọn tỉnh/thành phố tương ứng
            if (this.userAddress && this.userAddress.provinceCode) {
                provinceSelect.value = this.userAddress.provinceCode;
                this.loadDistricts(this.userAddress.provinceCode);
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu tỉnh/thành phố:', error);
            alert('Không thể tải dữ liệu tỉnh/thành phố. Vui lòng thử lại sau.');
        } finally {
            spinner.style.display = 'none';
        }
    }

    // Phương thức để tải dữ liệu quận/huyện từ API
    async loadDistricts(provinceCode) {
        const districtSelect = document.querySelector('#district');
        const spinner = document.querySelector('.district-spinner');

        try {
            spinner.style.display = 'inline-block';
            districtSelect.innerHTML = '<option value="">Chọn Quận/Huyện</option>';

            // Gọi API để lấy danh sách quận/huyện theo provinceCode
            const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);

            if (!response.ok) {
                throw new Error('Không thể tải dữ liệu quận/huyện');
            }

            const provinceData = await response.json();
            const districts = provinceData.districts || [];

            // Thêm các option vào select
            districts.forEach(district => {
                const option = document.createElement('option');
                option.value = district.code;
                option.textContent = district.name;
                districtSelect.appendChild(option);
            });

            // Kích hoạt select
            districtSelect.disabled = false;

            // Nếu đã có dữ liệu địa chỉ cũ, chọn quận/huyện tương ứng
            if (this.userAddress && this.userAddress.districtCode && this.userAddress.provinceCode == provinceCode) {
                districtSelect.value = this.userAddress.districtCode;
                this.loadWards(this.userAddress.districtCode);
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu quận/huyện:', error);
            alert('Không thể tải dữ liệu quận/huyện. Vui lòng thử lại sau.');
        } finally {
            spinner.style.display = 'none';
        }
    }

    // Phương thức để tải dữ liệu phường/xã từ API
    async loadWards(districtCode) {
        const wardSelect = document.querySelector('#ward');
        const spinner = document.querySelector('.ward-spinner');

        try {
            spinner.style.display = 'inline-block';
            wardSelect.innerHTML = '<option value="">Chọn Phường/Xã</option>';

            // Gọi API để lấy danh sách phường/xã theo districtCode
            const response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);

            if (!response.ok) {
                throw new Error('Không thể tải dữ liệu phường/xã');
            }

            const districtData = await response.json();
            const wards = districtData.wards || [];

            // Thêm các option vào select
            wards.forEach(ward => {
                const option = document.createElement('option');
                option.value = ward.code;
                option.textContent = ward.name;
                wardSelect.appendChild(option);
            });

            // Kích hoạt select
            wardSelect.disabled = false;

            // Nếu đã có dữ liệu địa chỉ cũ, chọn phường/xã tương ứng
            if (this.userAddress && this.userAddress.wardCode && this.userAddress.districtCode == districtCode) {
                wardSelect.value = this.userAddress.wardCode;
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu phường/xã:', error);
            alert('Không thể tải dữ liệu phường/xã. Vui lòng thử lại sau.');
        } finally {
            spinner.style.display = 'none';
        }
    }
}