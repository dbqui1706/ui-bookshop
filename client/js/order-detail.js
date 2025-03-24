document.addEventListener('DOMContentLoaded', function() {
    // Dữ liệu mẫu cho đơn hàng
    const orderData = {
        orderId: 'BK2025031802',
        orderDate: '18/03/2025 15:30',
        status: 'shipped', // 'processing', 'shipped', 'completed', 'canceled', 'refunded'
        timeline: [
            { step: 'ordered', label: 'Đã đặt hàng', date: '18/03 15:30', completed: true },
            { step: 'confirmed', label: 'Đã xác nhận', date: '18/03 16:45', completed: true },
            { step: 'shipping', label: 'Đang giao hàng', date: '19/03 09:20', completed: false, active: true },
            { step: 'delivered', label: 'Đã giao hàng', date: 'Dự kiến 20/03', completed: false }
        ],
        shipping: {
            name: 'Quý Đặng',
            phone: '0912345678',
            address: '123 Đường Nguyễn Văn Linh, Phường Tân Phong, Quận 7, TP.HCM',
            method: 'Giao hàng nhanh (2-3 ngày)',
            note: 'Gọi trước khi giao hàng',
            carrier: 'GiaoHangNhanh',
            trackingNumber: 'GHN87652431'
        },
        payment: {
            method: 'Thanh toán khi nhận hàng (COD)',
            status: 'Chưa thanh toán',
            coupon: 'BOOK10 (-10%)'
        },
        items: [
            {
                id: 1,
                name: 'Tôi tài giỏi, bạn cũng thế',
                author: 'Adam Khoo',
                price: 120000,
                quantity: 1,
                image: 'https://placehold.co/120x160'
            },
            {
                id: 2,
                name: 'Đắc nhân tâm (Bìa cứng)',
                author: 'Dale Carnegie',
                price: 150000,
                quantity: 2,
                image: 'https://placehold.co/120x160'
            },
            {
                id: 3,
                name: 'Nhà giả kim',
                author: 'Paulo Coelho',
                price: 85000,
                quantity: 1,
                image: 'https://placehold.co/120x160'
            }
        ],
        summary: {
            subtotal: 505000,
            discount: 50500,
            shipping: 0
        }
    };

    // Tính tổng tiền
    orderData.summary.total = orderData.summary.subtotal - orderData.summary.discount + orderData.summary.shipping;

    // Format currency
    function formatCurrency(amount) {
        return amount.toLocaleString('vi-VN') + 'đ';
    }

    // Hiển thị thông tin đơn hàng từ dữ liệu
    function renderOrderDetails() {
        // Cập nhật trạng thái đơn hàng
        const statusElement = document.querySelector('.order-status');
        if (statusElement) {
            statusElement.className = 'order-status';
            statusElement.classList.add('status-' + orderData.status);
            
            // Cập nhật text trạng thái
            if (orderData.status === 'processing') {
                statusElement.textContent = 'Đang xử lý';
            } else if (orderData.status === 'shipped') {
                statusElement.textContent = 'Đang giao hàng';
            } else if (orderData.status === 'completed') {
                statusElement.textContent = 'Đã hoàn thành';
            } else if (orderData.status === 'canceled') {
                statusElement.textContent = 'Đã hủy';
            } else if (orderData.status === 'refunded') {
                statusElement.textContent = 'Đã hoàn tiền';
            }
        }

        // Ẩn/hiện nút hủy đơn hàng dựa trên trạng thái
        const cancelBtn = document.querySelector('.btn-cancel-order');
        if (cancelBtn) {
            if (orderData.status === 'completed' || orderData.status === 'canceled' || orderData.status === 'refunded') {
                cancelBtn.style.display = 'none';
            }
        }
    }

    // Xử lý sự kiện nút
    function setupEventListeners() {
        // Nút theo dõi đơn hàng
        const trackBtn = document.querySelector('.btn-track');
        if (trackBtn) {
            trackBtn.addEventListener('click', function() {
                alert('Chuyển đến trang theo dõi đơn hàng với mã: ' + orderData.shipping.trackingNumber);
            });
        }

        // Nút hủy đơn hàng
        const cancelBtn = document.querySelector('.btn-cancel-order');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
                    alert('Đơn hàng đã được gửi yêu cầu hủy!');
                    // Ở đây sẽ có logic để gửi yêu cầu hủy đơn hàng đến server
                }
            });
        }

        // Nút liên hệ hỗ trợ
        const supportBtn = document.querySelector('.btn-contact-support');
        if (supportBtn) {
            supportBtn.addEventListener('click', function() {
                alert('Chuyển đến trang liên hệ hỗ trợ');
            });
        }

        // Nút đặt hàng lại
        const reorderBtn = document.querySelector('.btn-order-again');
        if (reorderBtn) {
            reorderBtn.addEventListener('click', function() {
                alert('Đã thêm tất cả sản phẩm vào giỏ hàng!');
            });
        }

        // Nút đánh giá sản phẩm
    }

    // Render chi tiết đơn hàng
    renderOrderDetails();
    
    // Thiết lập các sự kiện
    setupEventListeners();
});