// client/js/container/checkout-container.js
import { OrderService } from "../service/order-service.js";
import { formatPrice } from "../utils/formatter.js";
import { openAddressModal } from "../components/address-modal.js";
import { openCouponModal } from "../components/coupon-checkout-modal.js";
import { DialogComponent } from "../components/dialog-component.js";
import { AddressService } from "../service/address-service.js";
import { openAddressSelectorModal } from "../components/address-selector-modal.js";

export class CheckoutContainer {
    constructor() {
        // Khởi tạo các thuộc tính dữ liệu
        this.cartOrderDetail = null;
        this.user = null;
        this.orderService = new OrderService();
        this.addressService = new AddressService();
        this.deliveryMethods = [];
        this.paymentMethods = [];

        // Khởi tạo order object để gửi về server
        this.orderData = {
            userId: null,
            cartItems: [],
            totalAmount: 0,
            deliveryAddress: null,
            deliveryMethod: null,
            paymentMethod: null,
            deliveryPrice: 0,
            discountPromotionAmount: 0,
            couponCode: null
        };

        // Khởi tạo các biến trạng thái
        this.selectedDeliveryMethod = null;
        this.selectedPaymentMethod = null;
        this.deliveryPrice = 0;
        this.discountPrice = 0;

        this.priceSummary = {
            subtotal: 0,
            deliveryPrice: 0,
            discountAmount: 0,
            totalAmount: 0,
        };

        // Load dữ liệu và khởi tạo giao diện
        this.loadData();
        console.log("Order Data", this.orderData);
    }

    loadData() {
        // Lấy dữ liệu từ localStorage
        this.cartOrderDetail = JSON.parse(localStorage.getItem('cartOrderDetail')) || null;
        this.user = JSON.parse(localStorage.getItem('user')) || null;

        // Kiểm tra dữ liệu đơn hàng
        if (!this.cartOrderDetail) {
            console.error('Không tìm thấy dữ liệu giỏ hàng.');
            window.location.href = '/client/cart.html';
            return;
        }

        // Đảm bảo giữ nguyên địa chỉ đã chọn (nếu có)
        if (!this.cartOrderDetail.address) {
            // Nếu không có, khởi tạo object rỗng thay vì mảng
            this.cartOrderDetail.address = {};
        }

        // Cập nhật orderData ban đầu
        this.updateOrderData();

        // Khởi tạo giao diện
        this.init();

        console.log("Order Data", this.orderData);
    }

    updateOrderData() {
        if (!this.cartOrderDetail || !this.user) return;

        this.orderData.userId = this.user.id;
        this.orderData.cartItems = this.cartOrderDetail.cartItems.map(item => ({
            cartItemId: item.cartItemId,
            productId: item.productId,
            quantity: item.quantity,
            price: item.productPrice * (1 - item.productDiscount / 100),
            originalPrice: item.productPrice,
            discount: item.productDiscount,
            name: item.productName,
            image: item.productImage || '/asset/images/image.png'
        }));
        this.orderData.totalAmount = this.cartOrderDetail.totalPaymentOrder;
        this.orderData.deliveryAddress = this.cartOrderDetail.address;
        this.orderData.deliveryMethod = this.selectedDeliveryMethod;
        this.orderData.paymentMethod = this.selectedPaymentMethod;
        this.orderData.deliveryPrice = this.deliveryPrice;
        this.orderData.discountPromotionAmount = this.discountPrice;
    }

    async init() {
        try {
            // Render danh sách sản phẩm
            this.renderProductList();

            // Render hình thức giao hàng
            await this.fetchAndRenderDeliveryMethods();

            // Render hình thức thanh toán
            await this.fetchAndRenderPaymentMethods();

            // Render thông tin địa chỉ giao hàng
            this.renderDeliveryAddress();

            // Cập nhật thông tin tổng tiền
            this.updateTotalPrice();

            // Thiết lập các sự kiện
            this.setupEventListeners();
        } catch (error) {
            console.error('Lỗi khởi tạo trang thanh toán:', error);
            DialogComponent.alert('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.');
        }
    }

    renderProductList() {
        const productListEl = document.getElementById('product-list');
        if (!productListEl || !this.cartOrderDetail.cartItems || this.cartOrderDetail.cartItems.length === 0) return;

        // Xóa nội dung cũ
        productListEl.innerHTML = '';

        // Thêm từng sản phẩm vào danh sách
        this.cartOrderDetail.cartItems.forEach(item => {
            const productItem = document.createElement('div');
            productItem.className = 'product-item';

            const discountPrice = item.productPrice * (1 - item.productDiscount / 100);

            productItem.innerHTML = `
                <div class="product-image">
                    <img src="${item.productImage || '/asset/images/image.png'}" alt="${item.productName}">
                </div>
                <div class="product-details">
                    <div class="product-name">${item.productName}</div>
                    <div class="product-seller">
                        Cung cấp bởi <span class="seller-name">BookStore</span>
                    </div>
                    <div class="product-price-mobile">
                        <span class="current-price">${formatPrice(discountPrice * item.quantity)}</span>
                        ${item.productDiscount > 0 ? `<span class="original-price">${formatPrice(item.productPrice * item.quantity)}</span>` : ''}
                    </div>
                    <div class="product-quantity">
                        <span>SL: x${item.quantity}</span>
                    </div>
                </div>
                <div class="product-price">
                    <span class="current-price">${formatPrice(discountPrice * item.quantity)}</span>
                    ${item.productDiscount > 0 ? `<span class="original-price">${formatPrice(item.productPrice * item.quantity)}</span>` : ''}
                </div>
            `;

            productListEl.appendChild(productItem);
        });
    }

    async fetchAndRenderDeliveryMethods() {
        try {
            const response = await this.orderService.getDeliveryMethods();
            if (!response.success) {
                throw new Error(response.message || 'Không thể tải phương thức giao hàng');
            }

            this.deliveryMethods = response.data;
            this.renderDeliveryMethods();

            // Mặc định chọn phương thức đầu tiên
            if (this.deliveryMethods.length > 0) {
                setTimeout(() => {
                    console.log("Delivery Methods ID:", this.deliveryMethods[0].id);
                    this.setDeliveryMethod(this.deliveryMethods[0].id);
                }, 0);
            }
        } catch (error) {
            console.error('Lỗi khi tải phương thức giao hàng:', error);
            this.deliveryMethods = [];
            // Fallback: Hiển thị phương thức mặc định nếu lỗi API
            this.renderDefaultDeliveryMethods();
        }
    }

    renderDeliveryMethods() {
        const shippingOptions = document.getElementById('shipping-options');
        if (!shippingOptions) return;

        // render delivery methods
        const html = this.deliveryMethods.map(method => `
            <div class="shipping-option" data-id="${method.id}">
                <div class="option-radio">
                    <input type="radio" id="shipping-${method.id}" name="delivery-method" value="${method.id}">
                </div>
                <div class="option-details">
                    <div class="option-description">${method.name}</div>
                    <div class="option-time">${method.estimatedDays} ngày</div>
                </div>
                <div class="option-price">
                    <div class="price-current">${formatPrice(parseFloat(method.price))}</div>
                </div>
            </div>
        `).join('');
        shippingOptions.innerHTML = html;
    }

    renderDefaultDeliveryMethods() {
        const shippingOptions = document.getElementById('shipping-options');
        if (!shippingOptions) return;

        // Hiển thị 2 phương thức giao hàng mặc định nếu API lỗi
        shippingOptions.innerHTML = `
            <div class="shipping-option" data-id="saving-delivery">
                <div class="option-radio">
                    <input type="radio" id="saving-delivery" name="delivery-method" value="saving-delivery" checked>
                </div>
                <div class="option-details">
                    <div class="option-description">Giao hàng tiết kiệm</div>
                    <div class="option-time">3-5 ngày</div>
                </div>
                <div class="option-price">
                    <div class="price-current">${formatPrice(0)}</div>
                </div>
            </div>
            <div class="shipping-option" data-id="fast-delivery">
                <div class="option-radio">
                    <input type="radio" id="fast-delivery" name="delivery-method" value="fast-delivery">
                </div>
                <div class="option-details">
                    <div class="option-description">Giao hàng nhanh</div>
                    <div class="option-time">1-2 ngày</div>
                </div>
                <div class="option-price">
                    <div class="price-current">${formatPrice(20000)}</div>
                </div>
            </div>
        `;

        // Mặc định chọn tiết kiệm
        this.setDeliveryMethod('saving-delivery');
    }

    async fetchAndRenderPaymentMethods() {
        try {
            const response = await this.orderService.getPaymentMethods();
            if (!response.success) {
                throw new Error(response.message || 'Không thể tải phương thức thanh toán');
            }

            this.paymentMethods = response.data;
            this.renderPaymentMethods();

            // Mặc định chọn phương thức đầu tiên
            if (this.paymentMethods.length > 0) {
                this.setPaymentMethod(this.paymentMethods[0].code);
            }
        } catch (error) {
            console.error('Lỗi khi tải phương thức thanh toán:', error);
            this.paymentMethods = [];
            // Fallback: Hiển thị phương thức mặc định nếu lỗi API
            this.renderDefaultPaymentMethods();
        }
    }

    renderPaymentMethods() {
        const paymentOptions = document.getElementById('payment-options');
        if (!paymentOptions) return;

        // render payment methods
        const html = this.paymentMethods.map(method => `
            <div class="payment-option" data-id="${method.code}">
                <div class="option-radio">
                    <input type="radio" id="${method.code}" name="payment-method" value="${method.code}">
                </div>
                <div class="option-icon">
                    <img src="${method.code === "cod" ? "/asset/icons/cash-icon.png" : "/asset/icons/vnpay.png"}" alt="${method.name}">
                </div>
                <div class="option-details">
                    <div class="option-title">${method.description}</div>
                </div>
            </div>
        `).join('');
        paymentOptions.innerHTML = html;
    }

    renderDefaultPaymentMethods() {
        const paymentOptions = document.getElementById('payment-options');
        if (!paymentOptions) return;

        // Hiển thị 2 phương thức thanh toán mặc định nếu API lỗi
        paymentOptions.innerHTML = `
            <div class="payment-option" data-id="cash-payment">
                <div class="option-radio">
                    <input type="radio" id="cash-payment" name="payment-method" value="cash-payment" checked>
                </div>
                <div class="option-icon">
                    <img src="/asset/icons/cash-icon.png" alt="Tiền mặt">
                </div>
                <div class="option-details">
                    <div class="option-title">Thanh toán tiền mặt khi nhận hàng</div>
                </div>
            </div>
            <div class="payment-option" data-id="vnpay-payment">
                <div class="option-radio">
                    <input type="radio" id="vnpay-payment" name="payment-method" value="vnpay-payment">
                </div>
                <div class="option-icon">
                    <img src="/asset/icons/vnpay.png" alt="VNPay">
                </div>
                <div class="option-details">
                    <div class="option-title">Thanh toán bằng VNPay</div>
                </div>
            </div>
        `;

        // Mặc định chọn thanh toán tiền mặt
        this.setPaymentMethod('cash-payment');
    }

    async renderDeliveryAddress() {
        console.log(this.orderData);

        // Lấy danh sách địa chỉ từ localStorage hoặc API
        let addresses = this.addressService.getUserAddresses();

        if (addresses.length === 0) {
            const response = await this.addressService.getAddressByUserId(this.user.id);
            if (response.success) {
                addresses = response.data;
                // Lưu vào localStorage để sử dụng sau
                this.addressService.saveUserAddresses(addresses);
            }
        }

        // Kiểm tra xem đã có địa chỉ được chọn chưa
        if (!this.cartOrderDetail.address || Object.keys(this.cartOrderDetail.address).length === 0) {
            // Chỉ khi không có địa chỉ nào đã được chọn, mới dùng địa chỉ mặc định
            const defaultAddress = addresses.find(addr => addr.isDefault);
            if (defaultAddress) {
                this.cartOrderDetail.address = defaultAddress;
                // Cập nhật lại orderData
                this.orderData.deliveryAddress = defaultAddress;
                // Lưu lại thông tin đã cập nhật
                localStorage.setItem('cartOrderDetail', JSON.stringify(this.cartOrderDetail));
            }
        }

        const customerNameEl = document.getElementById('customer-name');
        const customerPhoneEl = document.getElementById('customer-phone');
        const deliveryEmailEl = document.getElementById('delivery-email');
        const deliveryAddressTextEl = document.getElementById('delivery-address-text');
        const addressTagEl = document.querySelector('.address-tag');

        if (!this.cartOrderDetail.address || Object.keys(this.cartOrderDetail.address).length === 0) {
            // Hiển thị thông báo nếu chưa có địa chỉ
            if (deliveryAddressTextEl) {
                deliveryAddressTextEl.innerHTML = '<span class="text-danger">Vui lòng cung cấp địa chỉ giao hàng</span>';
            }
            return;
        }

        const address = this.cartOrderDetail.address;

        if (customerNameEl) customerNameEl.textContent = address.recipientName || address.fullname;
        if (customerPhoneEl) customerPhoneEl.textContent = address.phoneNumber || address.phone;
        if (deliveryEmailEl && this.user) deliveryEmailEl.textContent = this.user.email || '';

        if (deliveryAddressTextEl) {
            const addressLine = address.addressLine1 || address.address;
            const ward = address.wardName || address.ward;
            const district = address.districtName || address.district;
            const province = address.provinceName || address.province;

            deliveryAddressTextEl.textContent = `${addressLine}, ${ward}, ${district}, ${province}`;
        }

        if (addressTagEl) {
            const addressType = (address.addressType || 'HOME').toUpperCase();
            addressTagEl.textContent = addressType === 'COMPANY' ? 'Công ty' : 'Nhà';
        }
    }

    updateTotalPrice() {
        const totalPriceEl = document.getElementById('total-price');
        const discountPriceEl = document.getElementById('discount-price');
        const promotionPriceEl = document.getElementById('promotion-price');
        const shippingPriceEl = document.getElementById('shipping-price');
        const totalPaymentEl = document.getElementById('total-payment');
        const savingPriceEl = document.getElementById('saving-price');

        if (!totalPriceEl || !discountPriceEl || !promotionPriceEl || !totalPaymentEl || !savingPriceEl) return;

        // Lấy thông tin từ cartOrderDetail
        const totalOriginalPrice = this.cartOrderDetail.totalPriceOrder || 0;
        const totalDiscountPrice = this.cartOrderDetail.totalDiscountOrder || 0;

        // Tính toán giá cuối cùng
        let totalPayment = this.cartOrderDetail.totalPaymentOrder || 0;

        // Thêm phí vận chuyển
        totalPayment += this.deliveryPrice;

        // Trừ khuyến mãi
        totalPayment -= this.discountPrice;

        // Tổng tiết kiệm
        const totalSaving = totalDiscountPrice + parseFloat(this.discountPrice || 0);

        // Cập nhật giao diện
        totalPriceEl.innerHTML = formatPrice(totalOriginalPrice);
        discountPriceEl.innerHTML = formatPrice(-totalDiscountPrice);
        promotionPriceEl.innerHTML = formatPrice(-this.discountPrice);

        // Cập nhật phí vận chuyển nếu element tồn tại
        if (shippingPriceEl) {
            shippingPriceEl.innerHTML = `+${formatPrice(this.deliveryPrice)}`;
        }

        totalPaymentEl.innerHTML = formatPrice(totalPayment);   
        savingPriceEl.innerHTML = `Tiết kiệm ${formatPrice(totalSaving.toFixed(0))}`;

        // Cập nhật số lượng sản phẩm trên nút đặt hàng
        const checkoutButton = document.getElementById('checkout-button');
        if (checkoutButton) {
            const itemCount = this.cartOrderDetail.cartItems ? this.cartOrderDetail.cartItems.length : 0;
            checkoutButton.textContent = `Đặt Hàng`;
        }

        // Cập nhật dữ liệu đơn hàng
        this.orderData.totalAmount = totalPayment;
        this.orderData.deliveryPrice = this.deliveryPrice;
        this.orderData.discountPromotionAmount = this.discountPrice;

        
        this.priceSummary = {
            subtotal: totalOriginalPrice,
            deliveryPrice: this.deliveryPrice,
            discountAmount: totalSaving,
            totalAmount: totalPayment,
        };
    }

    setupEventListeners() {
        // Xử lý sự kiện cho nút thay đổi địa chỉ
        const changeAddressLink = document.getElementById('change-address');
        if (changeAddressLink) {
            changeAddressLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleChooseDeliveryAddress();
            });
        }

        // Xử lý sự kiện cho phương thức giao hàng
        this.setupDeliveryMethodEvents();

        // Xử lý sự kiện cho phương thức thanh toán
        this.setupPaymentMethodEvents();

        // Xử lý sự kiện cho mã giảm giá
        const moreCouponsLink = document.querySelector('.more-coupons');
        if (moreCouponsLink) {
            moreCouponsLink.addEventListener('click', () => {
                this.handleOpenCouponModal();
            });
        }

        // Xử lý sự kiện cho nút đặt hàng
        const checkoutButton = document.getElementById('checkout-button');
        if (checkoutButton) {
            checkoutButton.addEventListener('click', () => {
                this.handlePlaceOrder();
            });
        }
    }

    setupDeliveryMethodEvents() {
        const deliveryOptions = document.querySelectorAll('.shipping-option');

        deliveryOptions.forEach(option => {
            option.addEventListener('click', () => {
                const deliveryMethodId = option.getAttribute('data-id');
                this.setDeliveryMethod(deliveryMethodId);
            });
        });
    }

    setDeliveryMethod(methodId) {
        // Cập nhật UI
        const deliveryOptions = document.querySelectorAll('.shipping-option');
        deliveryOptions.forEach(opt => {
            const isSelected = parseInt(opt.getAttribute('data-id')) === parseInt(methodId);
            opt.classList.toggle('selected', isSelected);
            const radio = opt.querySelector(`input[type="radio"][id="shipping-${methodId}"]`);
            if (radio) {
                radio.checked = isSelected;
            }
        });

        this.selectedDeliveryMethod = methodId;

        const selectedMethod = this.deliveryMethods.find(method => parseInt(method.id) === parseInt(methodId));
        if (selectedMethod) {
            this.deliveryPrice = parseFloat(selectedMethod.price) || 0;
        }

        this.orderData.deliveryMethod = methodId;
        this.orderData.deliveryPrice = this.deliveryPrice;

        this.updateTotalPrice();
    }

    setupPaymentMethodEvents() {
        const paymentOptions = document.querySelectorAll('.payment-option');

        paymentOptions.forEach(option => {
            option.addEventListener('click', () => {
                const paymentMethodId = option.getAttribute('data-id');
                this.setPaymentMethod(paymentMethodId);
            });
        });
    }

    setPaymentMethod(methodId) {
        // Cập nhật UI
        const paymentOptions = document.querySelectorAll('.payment-option');
        paymentOptions.forEach(opt => {
            const isSelected = opt.getAttribute('data-id') === methodId;
            opt.classList.toggle('selected', isSelected);

            const radio = opt.querySelector('input[type="radio"]');
            if (radio) radio.checked = isSelected;
        });

        // Cập nhật trạng thái
        this.selectedPaymentMethod = methodId;

        // Cập nhật orderData
        this.orderData.paymentMethod = methodId;
    }

    handleOpenAddressModal() {
        // Lấy địa chỉ hiện tại từ cartOrderDetail
        openAddressModal(this.cartOrderDetail.address, (newAddress) => {
            // Cập nhật địa chỉ mới vào cartOrderDetail
            this.cartOrderDetail.address = newAddress;
            localStorage.setItem('cartOrderDetail', JSON.stringify(this.cartOrderDetail));

            // Cập nhật orderData
            this.orderData.deliveryAddress = newAddress;

            // Render lại địa chỉ
            this.renderDeliveryAddress();
        });
    }

    // Chọn địa chỉ giao hàng
    handleChooseDeliveryAddress() {
        openAddressSelectorModal((selectedAddress) => {
            // Cập nhật địa chỉ giao hàng trong đơn hàng
            this.cartOrderDetail.address = selectedAddress;
            localStorage.setItem('cartOrderDetail', JSON.stringify(this.cartOrderDetail));

            // Cập nhật orderData
            this.orderData.deliveryAddress = selectedAddress;

            // Render lại địa chỉ
            this.renderDeliveryAddress();
        }, this.cartOrderDetail.address?.id);
    }


    handleOpenCouponModal() {
        const orderValue = this.cartOrderDetail.totalPaymentOrder || 0;

        // Tạo đối tượng coupon hiện tại nếu có
        const currentCoupon = this.orderData.couponCode ? {
            code: this.orderData.couponCode,
            discount: this.discountPrice
        } : null;

        openCouponModal(orderValue, currentCoupon, (selectedCoupons) => {
            if (!selectedCoupons || !selectedCoupons.success) return;
            // Cập nhật trạng thái mã giảm giá
            if (selectedCoupons.discount) {
                const discount = selectedCoupons.discount;

                // Lưu mã coupon
                this.orderData.couponCode = discount.code;

                // Lưu số tiền giảm giá
                const typeDiscount = discount.discountType; // "fixed" || "percentage"
                if (typeDiscount === 'fixed') {
                    this.discountPrice = parseFloat(discount.discountValue) || 0;
                } else {
                    const maxDiscount = discount.maxDiscount || 0;
                    const currentDiscount = (parseFloat(discount.discountValue) / 100 * orderValue).toFixed(0) || 0;
                    this.discountPrice = Math.min(currentDiscount, maxDiscount);
                }
            } else {
                this.discountPrice = 0;
                this.orderData.couponCode = null;
            }

            // Cập nhật orderData
            this.orderData.discountPromotionAmount = this.discountPrice;

            // Cập nhật lại tổng tiền
            this.updateTotalPrice();

            console.log("Order Data with Coupon", this.orderData);
            // render lại mã giảm giá
            this.renderCouponCode(selectedCoupons);
        });
    }

    renderCouponCode(coupons) {
        const couponOptEl = document.getElementById('coupon-options');
        couponOptEl.innerHTML = '';

        couponOptEl.innerHTML = `
            <div class="coupon-item-checkout" id=${coupons.code}>
                <div class="coupon-icon">
                    <i class="fa-solid fa-ticket"></i>
                </div>
                <div class="coupon-detail">
                    <div class="coupon-value">Giảm ${coupons.discount.discountValue}${coupons.discount.discountType === 'percentage' ? '%' : 'đ'}
                    </div>
                    <div class="coupon-info-icon">
                        <i class="fas fa-info-circle"></i>
                    </div>
                </div>
            </div>    
        `
    }

    validateOrder() {
        // Kiểm tra các điều kiện bắt buộc
        if (!this.orderData.deliveryAddress) {
            DialogComponent.alert('Vui lòng cung cấp địa chỉ giao hàng trước khi đặt hàng.');
            return false;
        }

        if (!this.orderData.deliveryMethod) {
            DialogComponent.alert('Vui lòng chọn phương thức giao hàng.');
            return false;
        }

        if (!this.orderData.paymentMethod) {
            DialogComponent.alert('Vui lòng chọn phương thức thanh toán.');
            return false;
        }

        if (!this.orderData.cartItems || this.orderData.cartItems.length === 0) {
            DialogComponent.alert('Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi đặt hàng.');
            return false;
        }

        return true;
    }

    async handlePlaceOrder() {
        // Kiểm tra điều kiện
        if (!this.validateOrder()) return;

        try {
            // Hiển thị dialog xác nhận
            DialogComponent.confirm(
                'Bạn có chắc chắn muốn đặt đơn hàng này?',
                'Xác nhận đặt hàng',
                async () => {
                    try {
                        // Hiển thị thông báo đang xử lý
                        const loadingDialog = new DialogComponent({
                            title: 'Đang xử lý',
                            content: 'Đơn hàng của bạn đang được xử lý, vui lòng đợi một chút...',
                            closeButton: false
                        });
                        loadingDialog.show();

                        // Gọi API tạo đơn hàng
                        const response = await this.submitOrder();

                        // Đóng dialog loading
                        loadingDialog.hide();

                        if (response.success) {
                            this.showOrderSuccess(response.data);
                        } else {
                            throw new Error(response.message || 'Đặt hàng thất bại');
                        }
                    } catch (error) {
                        console.error('Lỗi khi đặt hàng:', error);
                        DialogComponent.alert('Có lỗi xảy ra khi đặt hàng: ' + (error.message || 'Vui lòng thử lại sau.'));
                    }
                }
            );
        } catch (error) {
            console.error('Lỗi khi xử lý đặt hàng:', error);
            DialogComponent.alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
        }
    }

    async submitOrder() {
        try {
            // Trong thực tế, gọi API đặt hàng
            const submitOrder = {
                userId: this.orderData.userId,
                cartItems: this.orderData.cartItems,
                deliveryAddress: this.orderData.deliveryAddress,
                deliveryMethod: this.orderData.deliveryMethod,
                paymentMethod: this.orderData.paymentMethod,
                couponCode: this.orderData.couponCode,
                priceSummary: this.priceSummary
            }
            return await this.orderService.createOrder(submitOrder);

            // // Giả lập API call để demo
            // await new Promise(resolve => setTimeout(resolve, 1500));

            // // Giả lập response thành công
            // return {
            //     success: true,
            //     data: {
            //         orderId: Date.now().toString().slice(-8),
            //         status: 'pending'
            //     },
            //     message: 'Đặt hàng thành công'
            // };
        } catch (error) {
            console.error('Lỗi khi gửi đơn hàng:', error);
            throw error;
        }
    }

    showOrderSuccess(orderData) {
        // Hiển thị thông báo thành công
        const successDialog = new DialogComponent({
            title: 'Đặt hàng thành công',
            content: `
                <div class="text-center mb-3">
                    <i class="fas fa-check-circle text-success" style="font-size: 48px;"></i>
                </div>
                <p class="text-center">Đơn hàng của bạn đã được đặt thành công.</p>
                <p class="text-center">Mã đơn hàng: <strong>DH${orderData.orderCode}</strong></p>
                <p class="text-center">Cảm ơn bạn đã mua sắm tại BookStore!</p>
            `,
            buttons: [
                {
                    text: 'Xem đơn hàng',
                    class: 'btn-outline-primary',
                    id: 'btn-view-order',
                    dismiss: true,
                    onClick: () => {
                        window.location.href = '/client/order-info.html';
                        localStorage.removeItem('cartOrderDetail');
                        window.history.pushState(null, '', '/client/index.html');
                    }
                },
                {
                    text: 'Tiếp tục mua sắm',
                    class: 'btn-primary',
                    id: 'btn-continue-shopping',
                    dismiss: true,
                    onClick: () => {
                        // Xóa dữ liệu đơn hàng sau khi đặt thành công
                        localStorage.removeItem('cartOrderDetail');
                        // Chuyển hướng về trang chủ và không cho phép quay lại
                        window.history.pushState(null, '', '/client/index.html');
                        window.location.href = '/client/index.html';
                    }
                }
            ]
        });
        successDialog.show();

        // Xóa dữ liệu đơn hàng sau khi đặt thành công
        localStorage.removeItem('cartOrderDetail');
    }
}