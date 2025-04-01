import { CartService } from "../service/cart-service.js";

document.addEventListener('DOMContentLoaded', async function () {

    const accountMenu = document.getElementById('accountMenu');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const accountDropdown = document.querySelector('.account-dropdown');

    // Lấy thông tin tài khoản từ sessionStorage
    let userSession = localStorage.getItem('user');
    let user = userSession ? JSON.parse(userSession) : null;
    if (user) {
        // Nếu đã đăng nhập, hiển thị hover dropdown
        accountMenu.innerHTML = `
            <i class="fas fa-user-circle"></i>
            <span>${user.fullName.split(' ')[0] || 'Tài khoản'}</span>
        `;

        // Thiết lập các href cho dropdown items
        const dropdownItems = dropdownMenu.querySelectorAll('.dropdown-item');

        // Ánh xạ các mục menu với đường dẫn tương ứng
        const menuLinks = {
            'Thông tin tài khoản': '/client/account-info.html',
            'Đơn hàng của tôi': '/client/order-info.html',
            'Trung tâm hỗ trợ': '/client/support.html',
            'Đăng xuất': '#'
        };

        // Thiết lập href và xử lý đăng xuất
        dropdownItems.forEach(item => {
            const text = item.textContent.trim();
            if (menuLinks[text]) {
                item.href = menuLinks[text];

                // Xử lý đặc biệt cho nút Đăng xuất
                if (text === 'Đăng xuất') {
                    item.addEventListener('click', function (e) {
                        e.preventDefault();
                        // Xóa thông tin người dùng khỏi sessionStorage
                        sessionStorage.removeItem('user');
                        // Chuyển hướng về trang đăng nhập
                        window.location.href = '/client/login.html';
                    });
                }
            }
        });

        // Hiển thị dropdown khi hover
        accountDropdown.addEventListener('mouseenter', function () {
            dropdownMenu.style.display = 'block';
        });

        accountDropdown.addEventListener('mouseleave', function () {
            dropdownMenu.style.display = 'none';
        });
    } else {
        // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập khi click
        accountMenu.href = '/client/login.html';

        // Ẩn dropdown menu
        if (dropdownMenu) {
            dropdownMenu.style.display = 'none';
        }

        // Xóa các event listener hover
        accountDropdown.classList.remove('account-dropdown');
        accountDropdown.classList.add('menu-item');
    }


    // Cập nhật số lượng sản phẩm trong giỏ hàng
    const cartCountElement = document.getElementById('cart-count');
    const cart = JSON.parse(localStorage.getItem('cart'));

    if (user) {
        const cartService = new CartService();
        const response = await cartService.getCart();
        if (response.success) {
            cartCountElement.textContent = response.data.length;
            localStorage.setItem('cart', JSON.stringify(response.data));
        } else {
            cartCountElement.textContent = 0;
        }
        return;
    }

    if (cart && cart.length > 0) {
        cartCountElement.textContent = cart.length;
    }
    
});
