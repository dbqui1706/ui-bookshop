// containers/cart-container.js
import loginModal from '../components/login-modal.js';
import { openCouponModal } from '../components/coupon-modal.js';
import { openAddressModal } from '../components/address-modal.js';
import { initCouponInfoPopovers } from '../components/coupon-popover.js';
import { CartService } from '../service/cart-service.js';
import { formatPrice } from '../utils/formatter.js';

export class CartContainer {
    constructor() {
        // Khởi tạo dịch vụ giỏ hàng
        this.cartService = new CartService();

        // Lấy giỏ hàng từ localStorage
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.user = JSON.parse(localStorage.getItem('user')) || null;

        // Khởi tạo địa chỉ giao hàng
        this.addressForm = JSON.parse(localStorage.getItem('shippingAddress')) || null;

        // Kiểm tra xem người dùng đã đăng nhập hay chưa
        this.isLoggedIn = this.user !== null;

        // Ẩn Delivery address và Coupon nếu người dùng chưa đăng nhập
        if (!this.isLoggedIn) {
            document.querySelector('.delivery-address').classList.add('d-none');
            document.querySelector('.checkout-coupon').classList.add('d-none');
        }

        // Các phần tử DOM
        this.initDOMElements();

        // Khởi tạo các event listeners
        this.initEventListeners();

        // Tải giỏ hàng từ server or local storage
        this.loadCart();

        // Khởi tạo các popover và modal
        // this.initPopoversAndModals();
    }

    initDOMElements() {
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
        this.sellerGroup = document.querySelector('#seller-group');
    }

    async loadCart() {
        try {
            // Nếu user đã đăng nhập và giỏ hàng trống thì lấy từ server
            if (this.user && this.cart.length === 0) {
                const cartData = await this.cartService.getCart();
                if (cartData.success) {
                    this.cart = cartData.data;
                }
            }

            // Cập nhật UI và lưu vào localStorage
            this.updateCartUI(true);
            this.saveCartToLocalStorage();
        } catch (error) {
            console.error('Lỗi khi tải giỏ hàng:', error);
        }
    }

    updateCartUI(trigger = false) {
        // Hiển thị phần giỏ hàng trống nếu không có sản phẩm
        const emptyCart = document.querySelector('.cart-empty')?.parentElement;
        const cartMain = document.querySelector('.cart-main-container')?.parentElement;
        const checkoutSummary = document.querySelector('.checkout-summary')?.parentElement;

        if (this.cart.length === 0) {
            if (emptyCart) emptyCart.classList.remove('d-none');
            if (cartMain) cartMain.classList.add('d-none');
            if (checkoutSummary) checkoutSummary.classList.add('d-none');
        } else {
            if (emptyCart) emptyCart.classList.add('d-none');
            if (cartMain) cartMain.classList.remove('d-none');
            if (checkoutSummary) checkoutSummary.classList.remove('d-none');
        }

        // Cập nhật số lượng sản phẩm trong giỏ hàng
        if (this.cartCount) {
            this.cartCount.textContent = this.cart.length;
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
        if (!this.sellerGroup) return;

        // render cart items
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
                if (this.checkoutButton) {
                    this.checkoutButton.textContent = `Mua Hàng (${this.getSelectedItemsCount()})`;
                }
            });
        });
    }

    // Sự kiện cho input số lượng
    quantityInputsListener() {
        if (!this.sellerGroup) return;

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
            if (product && event.target.parentElement) {
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
                const priceCurrentEl = cardItem.querySelector('.price-current');
                const priceOriginalEl = cardItem.querySelector('.price-original');

                if (priceCurrentEl) {
                    priceCurrentEl.innerHTML = formatPrice(
                        (product.productPrice * (1 - product.productDiscount / 100) * product.quantity).toFixed(0)
                    );
                }

                if (priceOriginalEl) {
                    priceOriginalEl.innerHTML = product.productDiscount > 0 ? formatPrice(product.productPrice * product.quantity) : '';
                }
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
                        ${formatPrice((item.productPrice * (1 - item.productDiscount / 100)).toFixed(0) * item.quantity)}
                    </div>
                    <div class="price-original" data-item-id="${item.productId}">
                       ${item.productDiscount > 0 ? formatPrice(item.productPrice * item.quantity) : ''}
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
        const totalPriceEl = document.getElementById('total-price');
        const discountPriceEl = document.getElementById('discount-price');
        const totalPaymentEl = document.getElementById('total-payment');

        if (!totalPriceEl || !discountPriceEl || !totalPaymentEl) return;

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
        totalPriceEl.innerHTML = formatPrice(totalOriginalPrice);
        discountPriceEl.innerHTML = formatPrice(-totalDiscountPrice);
        totalPaymentEl.innerHTML = formatPrice(totalPayment);
        return {
            totalOriginalPrice,
            totalDiscountPrice,
            totalPayment,
        }
    }

    saveCartToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    initEventListeners() {
        // Sự kiện cho checkbox "Chọn tất cả"
        if (this.selectAllCheckbox) {
            this.selectAllCheckbox.addEventListener('change', () => this.handleSelectAll());
        }

        // Sự kiện cho liên kết "Xem thêm mã giảm giá"
        if (this.changeCouponsLink) {
            this.changeCouponsLink.addEventListener('click', () => this.handleOpenCouponModal());
        }

        // Sự kiện cho liên kết "Thay đổi địa chỉ"
        if (this.changeAddressLink) {
            this.changeAddressLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleOpenAddressModal();
            });
        }

        // Sự kiện cho nút thanh toán
        if (this.checkoutButton) {
            this.checkoutButton.addEventListener('click', () => this.handleCheckout());
        }
    }

    // Sự kiện cho checkbox "Chọn tất cả"
    handleSelectAll() {
        if (!this.selectAllCheckbox || !this.itemCheckboxes) return;

        const isChecked = this.selectAllCheckbox.checked;

        this.cart.forEach(item => {
            item.checked = isChecked;
        });

        // Thay đổi các trang thái checkbox
        this.itemCheckboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
        });

        // Cập nhật số lượng sản phẩm trong button mua hàng
        if (this.checkoutButton) {
            this.checkoutButton.textContent = `Mua Hàng (${this.getSelectedItemsCount()})`;
        }

        this.updateTotalPrice();
    }

    // Sự kiện cho nút giảm số lượng
    async handleDecreaseQuantity(productId) {
        const product = this.cart.find(item => item.productId === productId);

        if (product && product.quantity > 1) {
            try {
                product.quantity -= 1;

                if (this.user) {
                    await this.cartService.updateCartItem(product.cartItemId, product.quantity);
                }
                this.updateTotalPrice();
                this.saveCartToLocalStorage();
            } catch (error) {
                product.quantity += 1;
                console.error('Lỗi khi cập nhật số lượng sản phẩm:', error);
            }
        }
    }

    // Sự kiện cho nút tăng số lượng
    async handleIncreaseQuantity(productId) {
        const product = this.cart.find(item => item.productId === productId);

        if (product) {
            try {
                product.quantity += 1;
                if (this.user) {
                    await this.cartService.updateCartItem(product.cartItemId, product.quantity);
                }
                this.updateTotalPrice();
                this.saveCartToLocalStorage();
            } catch (error) {
                product.quantity -= 1;
                console.error('Lỗi khi cập nhật số lượng sản phẩm:', error);
            }
        }
    }

    // Sự kiện cho nút xóa sản phẩm
    async handleRemoveItem(productId) {
        const cartItem = this.cart.find(item => item.productId === productId);
        try {
            if (this.user) {
                const response = await this.cartService.removeCartItem(cartItem.cartItemId);
                if (!response.success) {
                    alert(response.message);
                    return;
                }
            }
            this.cart = this.cart.filter(item => item.productId !== productId);
            this.updateCartUI();
            this.saveCartToLocalStorage();
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm:', error);
        }
    }

    handleCheckout() {
        // Kiểm tra xem có sản phẩm nào được chọn không
        const hasSelectedItems = Array.from(this.itemCheckboxes).some(cb => cb.checked);

        if (!hasSelectedItems) {
            alert('Vui lòng chọn ít nhất một sản phẩm để mua hàng.');
            return;
        }

        // Nếu chưa đăng nhập, hiển thị modal đăng nhập
        if (!this.user) {
            loginModal.show();
            return;
        }

        // Tạo đối tượng cart-order
        const cartOrderDetail = {
            cartItems: this.cart.filter(item => item.checked).map(item => ({
                ...item,
                totalPrice: item.productPrice * item.quantity,
                totalPayment: item.productPrice * (1 - item.productDiscount / 100) * item.quantity,
            })),
            totalPriceOrder: this.updateTotalPrice().totalOriginalPrice,
            totalDiscountOrder: this.updateTotalPrice().totalDiscountPrice,
            totalPaymentOrder: this.updateTotalPrice().totalPayment,
            address: this.addressForm,
        }
        console.log(cartOrderDetail);
        // lưu cartOrder vào localStorage
        localStorage.setItem('cartOrderDetail', JSON.stringify(cartOrderDetail));

        // chuyển đến trang thanh toán
        window.location.href = '/client/checkout.html';
    }

    handleOpenCouponModal() {
        openCouponModal((selectedCoupons) => {
            console.log('Mã giảm giá đã chọn:', selectedCoupons);
            // Xử lý sau khi chọn mã giảm giá
            // Ví dụ: cập nhật UI, lưu vào localStorage, gửi lên server, v.v.
        });
    }

    handleOpenAddressModal() {
        // Lấy địa chỉ hiện tại từ localStorage
        const currentAddress = JSON.parse(localStorage.getItem('shippingAddress')) || null;

        openAddressModal(currentAddress, (newAddress) => {
            console.log('Địa chỉ mới:', newAddress);
            // Cập nhật UI với địa chỉ mới
            this.updateAddressUI(newAddress);
        });
    }

    updateAddressUI(address) {
        const customerNameEl = document.getElementById('customer-name');
        const customerPhoneEl = document.getElementById('customer-phone');
        const deliveryAddressTextEl = document.getElementById('delivery-address-text');
        const addressTagEl = document.getElementById('address-tag');

        if (customerNameEl) customerNameEl.textContent = address.fullname;
        if (customerPhoneEl) customerPhoneEl.textContent = address.phone;
        if (deliveryAddressTextEl) {
            deliveryAddressTextEl.textContent = `${address.address}, ${address.ward}, ${address.district}, ${address.province}`;
        }
        if (addressTagEl) {
            addressTagEl.textContent = address.addressType === 'company' ? 'Công ty' : 'Nhà';
        }
        
        this.addressForm = {
            fullname: address.fullname,
            phone: address.phone,
            address: address.address,
            ward: address.ward,
            district: address.district,
            province: address.province,
            addressType: address.addressType,
        }
    }

    initPopoversAndModals() {
        // Khởi tạo popover cho icon thông tin khuyến mãi
        initCouponInfoPopovers();
    }
}