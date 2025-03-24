// JavaScript cho chức năng xem đơn hàng
document.addEventListener('DOMContentLoaded', function() {
    // Hiển thị dữ liệu đơn hàng mẫu sau khi nhấn nút tìm kiếm
    const searchButton = document.querySelector('.search-button');
    const emptyOrder = document.querySelector('.empty-order');
    const orderList = document.querySelector('.order-list');
    
    if (searchButton && emptyOrder && orderList) {
        searchButton.addEventListener('click', function() {
            // Ẩn thông báo không có đơn hàng
            emptyOrder.style.display = 'none';
            // Hiển thị danh sách đơn hàng mẫu
            orderList.style.display = 'block';
        });
    }
    
    // Xử lý chuyển tab
    const tabItems = document.querySelectorAll('.tab-item');
    if (tabItems.length) {
        tabItems.forEach(tab => {
            tab.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Xóa class active khỏi tất cả các tab
                tabItems.forEach(item => item.classList.remove('active'));
                
                // Thêm class active cho tab được click
                this.classList.add('active');
                
                // Nếu tab khác "Tất cả đơn" thì ẩn các đơn hàng không liên quan
                const tabText = this.textContent.trim();
                const orderItems = document.querySelectorAll('.order-item');
                
                // Xử lý hiển thị đơn hàng dựa trên tab
                if (tabText === "Tất cả đơn") {
                    // Nếu có đơn hàng thì hiển thị tất cả
                    if (orderItems.length) {
                        emptyOrder.style.display = 'none';
                        orderList.style.display = 'block';
                        orderItems.forEach(item => item.style.display = 'block');
                    } else {
                        emptyOrder.style.display = 'block';
                        orderList.style.display = 'none';
                    }
                } else {
                    // Hiển thị đơn hàng dựa trên trạng thái
                    let statusClass = '';
                    switch (tabText) {
                        case "Chờ thanh toán":
                            statusClass = 'pending';
                            break;
                        case "Đang xử lý":
                            statusClass = 'processing';
                            break;
                        case "Đang vận chuyển":
                            statusClass = 'shipping';
                            break;
                        case "Đã giao":
                            statusClass = 'delivered';
                            break;
                        case "Đã hủy":
                            statusClass = 'cancelled';
                            break;
                    }
                    
                    // Lọc đơn hàng theo trạng thái
                    let hasMatchingOrders = false;
                    orderItems.forEach(item => {
                        const statusBadge = item.querySelector('.status-badge');
                        if (statusBadge && statusBadge.classList.contains(statusClass)) {
                            item.style.display = 'block';
                            hasMatchingOrders = true;
                        } else {
                            item.style.display = 'none';
                        }
                    });
                    
                    // Hiển thị thông báo nếu không có đơn hàng phù hợp
                    if (hasMatchingOrders) {
                        emptyOrder.style.display = 'none';
                        orderList.style.display = 'block';
                    } else {
                        emptyOrder.style.display = 'block';
                        orderList.style.display = 'none';
                    }
                }
            });
        });
    }
    
    // Xử lý các nút chức năng
    const detailButtons = document.querySelectorAll('.btn-detail');
    const rebuyButtons = document.querySelectorAll('.btn-rebuy');
    const reviewButtons = document.querySelectorAll('.btn-review');
    const trackButtons = document.querySelectorAll('.btn-track');
    
    // Xử lý nút xem chi tiết
    detailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.closest('.order-item').querySelector('.order-id').textContent.split('#')[1];
            alert(`Xem chi tiết đơn hàng #${orderId}`);
        });
    });
    
    // Xử lý nút mua lại
    rebuyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productTitle = this.closest('.order-item').querySelector('.product-title').textContent;
            alert(`Đã thêm sản phẩm "${productTitle}" vào giỏ hàng`);
        });
    });
    
    // Xử lý nút đánh giá
    reviewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productTitle = this.closest('.order-item').querySelector('.product-title').textContent;
            alert(`Đánh giá sản phẩm "${productTitle}"`);
        });
    });
    
    // Xử lý nút theo dõi đơn
    trackButtons.forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.closest('.order-item').querySelector('.order-id').textContent.split('#')[1];
            alert(`Theo dõi đơn hàng #${orderId}`);
        });
    });
});