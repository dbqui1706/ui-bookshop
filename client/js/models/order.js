/**
    * Thông tin địa chỉ giao hàng
    */
shippingInfo = {
    receiverName: "", // Tên người nhận
    receiverEmail: "", // Email người nhận
    receiverPhone: "", // Số điện thoại người nhận
    addressLine1: "", // Địa chỉ giao hàng chính
    addressLine2: "", // Địa chỉ giao hàng phụ (nếu có)
    city: "", // Thành phố/Tỉnh
    district: "", // Quận/Huyện
    ward: "", // Phường/Xã
    postalCode: "", // Mã bưu điện (nếu có)
    shippingNotes: "" // Ghi chú giao hàng (nếu có)
}

/**
 * Thông tin thanh toán và vận chuyển
 */
orderInfo = {
    userId: 0, // ID của người dùng đặt hàng
    deliveryMethodId: 0, // ID của phương thức giao hàng
    paymentMethodId: 0, // ID của phương thức thanh toán
    couponCode: "", // Mã giảm giá (nếu có)
    note: "" // Ghi chú đơn hàng (nếu có)
}

/**
 * Thông tin các sản phẩm trong đơn hàng
 */
orderItems = [
    // {
    //     productId: 0, // ID của sản phẩm
    //     quantity: 0, // Số lượng
    // }
]

/**
 * Thông tin tổng tiền đơn hàng
 */
totals = {
    subtotal: 0, // Tổng tiền hàng chưa tính thuế, phí
    deliveryPrice: 0, // Phí vận chuyển
    discountAmount: 0, // Số tiền giảm giá
    taxAmount: 0, // Thuế
    totalAmount: 0 // Tổng thanh toán
}

/**
* Sử dụng mẫu:
*/

// Tạo đối tượng OrderDTO
const createOrderDTO = (user, cartItems, shippingAddress, deliveryMethod, paymentMethod, couponInfo = null) => {
    const orderDTO = new OrderDTO();

    // Thiết lập thông tin giao hàng
    orderDTO.shippingInfo = {
        receiverName: shippingAddress.fullname || user.fullname,
        receiverEmail: user.email,
        receiverPhone: shippingAddress.phone || user.phoneNumber,
        addressLine1: shippingAddress.address,
        addressLine2: "",
        city: shippingAddress.province,
        district: shippingAddress.district,
        ward: shippingAddress.ward,
        postalCode: "",
        shippingNotes: shippingAddress.notes || ""
    };

    // Thiết lập thông tin đơn hàng
    orderDTO.orderInfo = {
        userId: user.id,
        deliveryMethodId: deliveryMethod.id,
        paymentMethodId: paymentMethod.id,
        couponCode: couponInfo ? couponInfo.code : "",
        note: ""
    };

    // Thiết lập thông tin sản phẩm
    orderDTO.orderItems = cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
    }));

    // Tính toán tổng tiền
    const subtotal = cartItems.reduce((sum, item) => {
        // Tính toán giá sau khi giảm giá cho mỗi sản phẩm
        const discountedPrice = item.productPrice * (1 - item.productDiscount / 100);
        return sum + (discountedPrice * item.quantity);
    }, 0);

    const deliveryPrice = deliveryMethod.price || 0;
    const discountAmount = couponInfo ? couponInfo.discountAmount : 0;
    const taxAmount = 0; // Thuế nếu có

    orderDTO.totals = {
        subtotal,
        deliveryPrice,
        discountAmount,
        taxAmount,
        totalAmount: subtotal + deliveryPrice - discountAmount + taxAmount
    };

    return orderDTO;
};

/**
* Ví dụ sử dụng:
*/

// Tạo đối tượng đơn hàng để gửi lên server
const placeOrder = () => {
    // Lấy thông tin người dùng từ localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    // Lấy thông tin sản phẩm từ giỏ hàng
    const cartOrderDetail = JSON.parse(localStorage.getItem('cartOrderDetail'));

    // Lấy thông tin địa chỉ giao hàng
    const shippingAddress = cartOrderDetail.address;

    // Thông tin phương thức giao hàng được chọn
    const deliveryMethod = {
        id: 1, // ID của phương thức giao hàng
        name: 'Giao hàng tiết kiệm',
        price: document.getElementById('fast-delivery').checked ? 20000 : 0
    };

    // Thông tin phương thức thanh toán được chọn
    const paymentMethod = {
        id: document.getElementById('cash-payment').checked ? 1 : 2,
        name: document.getElementById('cash-payment').checked ? 'Thanh toán khi nhận hàng' : 'VNPAY'
    };

    // Thông tin mã giảm giá (nếu có)
    const couponInfo = {
        code: "SUMMER2023",
        discountAmount: 50000
    };

    // Tạo đối tượng đơn hàng
    const orderDTO = createOrderDTO(
        user,
        cartOrderDetail.cartItems,
        shippingAddress,
        deliveryMethod,
        paymentMethod,
        couponInfo
    );

    // Gửi đơn hàng đến server
    fetch('http://localhost:8080/api/orders/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(orderDTO)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Xóa giỏ hàng sau khi đặt hàng thành công
                localStorage.removeItem('cartOrderDetail');

                // Hiển thị thông báo thành công
                alert('Đặt hàng thành công!');

                // Chuyển hướng đến trang chi tiết đơn hàng
                window.location.href = `/client/order-detail.html?id=${data.orderId}`;
            } else {
                // Hiển thị thông báo lỗi
                alert(`Đặt hàng thất bại: ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Lỗi khi đặt hàng:', error);
            alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.');
        });
};