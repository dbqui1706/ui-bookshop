document.addEventListener('DOMContentLoaded', function() {
    // Xử lý lựa chọn phương thức vận chuyển
    const shippingOptions = document.querySelectorAll('.shipping-option');
    
    shippingOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Xóa class selected từ tất cả options
            shippingOptions.forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Thêm class selected vào option được chọn
            this.classList.add('selected');
            
            // Chọn radio button bên trong
            const radioBtn = this.querySelector('input[type="radio"]');
            if (radioBtn) {
                radioBtn.checked = true;
            }
        });
    });
    
    // Xử lý lựa chọn phương thức thanh toán
    const paymentOptions = document.querySelectorAll('.payment-option');
    
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Xóa class selected từ tất cả options
            paymentOptions.forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Thêm class selected vào option được chọn
            this.classList.add('selected');
            
            // Chọn radio button bên trong
            const radioBtn = this.querySelector('input[type="radio"]');
            if (radioBtn) {
                radioBtn.checked = true;
            }
        });
    });
    
    // Xử lý nút đặt hàng
    const checkoutButton = document.querySelector('.checkout-button');
    
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            // Kiểm tra thông tin trước khi đặt hàng
            const selectedPayment = document.querySelector('.payment-option.selected');
            
            if (!selectedPayment) {
                alert('Vui lòng chọn phương thức thanh toán!');
                return;
            }
            
            // Hiển thị thông báo đặt hàng thành công
            alert('Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại BookStore.');
            
            // Trong thực tế, đây là nơi sẽ gửi dữ liệu đến server để xử lý đơn hàng
            // window.location.href = '/order-confirmation.html';
        });
    }
    
    // Xử lý mã giảm giá
    const couponButton = document.querySelector('.coupon-button');
    const couponInput = document.querySelector('.coupon-input');
    
    if (couponButton && couponInput) {
        couponButton.addEventListener('click', function() {
            const couponCode = couponInput.value.trim();
            
            if (!couponCode) {
                alert('Vui lòng nhập mã giảm giá!');
                return;
            }
            
            // Trong thực tế, đây là nơi sẽ gửi mã giảm giá đến server để kiểm tra và áp dụng
            // Ở đây, chúng ta sẽ giả lập một phản hồi
            if (couponCode.toUpperCase() === 'BOOK10') {
                alert('Áp dụng mã giảm giá thành công!');
                // Cập nhật tóm tắt đơn hàng
                updateOrderSummary(10000); // Giảm 10.000đ
            } else {
                alert('Mã giảm giá không hợp lệ hoặc đã hết hạn!');
            }
        });
    }
    
    // Xử lý lựa chọn mã khuyến mãi Tiki
    const promoOptions = document.querySelectorAll('.promo-option');
    
    promoOptions.forEach(option => {
        option.addEventListener('click', function() {
            const radioBtn = this.querySelector('input[type="radio"]');
            if (radioBtn) {
                radioBtn.checked = true;
            }
        });
    });
    
    // Hàm cập nhật tóm tắt đơn hàng
    function updateOrderSummary(extraDiscount = 0) {
        // Trong thực tế, đây là nơi sẽ tính toán lại tổng tiền đơn hàng
        // Ví dụ: gọi API để cập nhật giỏ hàng với mã giảm giá mới
        
        // Giả lập việc cập nhật tổng tiền
        const totalElement = document.querySelector('.total-value');
        const savingElement = document.querySelector('.saving-text');
        
        if (totalElement && savingElement) {
            // Lấy giá trị hiện tại
            const currentTotal = 358035; // 358.035đ
            const currentSaving = 241165; // 241.165đ
            
            // Tính giá trị mới
            const newTotal = currentTotal - extraDiscount;
            const newSaving = currentSaving + extraDiscount;
            
            // Cập nhật UI
            totalElement.textContent = formatCurrency(newTotal) + 'đ';
            savingElement.textContent = 'Tiết kiệm ' + formatCurrency(newSaving) + 'đ';
        }
    }
    
    // Hàm định dạng số tiền
    function formatCurrency(amount) {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    
    // Xử lý sự kiện thay đổi
    const changeLinks = document.querySelectorAll('.change-link');
    
    changeLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Tính năng đang được phát triển!');
        });
    });
});