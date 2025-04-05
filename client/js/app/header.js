import { CartService } from "../service/cart-service.js";

document.addEventListener('DOMContentLoaded', async function () {
    const accountMenu = document.getElementById('accountMenu');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const accountDropdown = document.querySelector('.account-dropdown');
    const cartCountElement = document.getElementById('cart-count');
    
    // Sử dụng một storage nhất quán (localStorage)
    let userSession = localStorage.getItem('user');
    let user = null;
    
    try {
        // Kiểm tra và parse dữ liệu user
        if (userSession) {
            user = JSON.parse(userSession);
            
            // Hiển thị thông tin người dùng
            accountMenu.innerHTML = `
                <i class="fas fa-user-circle"></i>
                <span>${user.fullName ? (user.fullName.split(' ')[0] || 'Tài khoản') : 'Tài khoản'}</span>
            `;

            // Thiết lập dropdown menu
            setupDropdownMenu(dropdownMenu);
            
            // Thiết lập sự kiện hover
            setupHoverEvents(accountDropdown, dropdownMenu);
            
            // Cập nhật giỏ hàng từ server
            await updateCartFromServer(cartCountElement);
        } else {
            // Người dùng chưa đăng nhập
            setupForLoggedOutUser(accountMenu, accountDropdown, dropdownMenu, cartCountElement);
        }
    } catch (error) {
        console.error('Lỗi khi khởi tạo trang:', error);
        // Xử lý trường hợp lỗi - ví dụ: nếu JSON không hợp lệ
        localStorage.removeItem('user');
        setupForLoggedOutUser(accountMenu, accountDropdown, dropdownMenu, cartCountElement);
    }
});

/**
 * Thiết lập các link trong dropdown menu
 */
function setupDropdownMenu(dropdownMenu) {
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
                    // Xóa thông tin người dùng khỏi localStorage (không phải sessionStorage)
                    localStorage.removeItem('user');
                    // Chuyển hướng về trang đăng nhập
                    window.location.href = '/client/login.html';
                });
            }
        }
    });
}

/**
 * Thiết lập sự kiện hover cho dropdown
 */
function setupHoverEvents(accountDropdown, dropdownMenu) {
    // Hiển thị dropdown khi hover
    accountDropdown.addEventListener('mouseenter', function () {
        dropdownMenu.style.display = 'block';
    });

    accountDropdown.addEventListener('mouseleave', function () {
        dropdownMenu.style.display = 'none';
    });
}

/**
 * Cập nhật giỏ hàng từ server
 */
export async function updateCartFromServer(cartCountElement) {
    try {
        const cartService = new CartService();
        const response = await cartService.getCart();
        
        if (response && response.success && response.data) {
            cartCountElement.textContent = response.data.length;
            localStorage.setItem('cart', JSON.stringify(response.data));
        } else {
            cartCountElement.textContent = '0';
            localStorage.removeItem('cart');
        }
    } catch (error) {
        console.error('Lỗi khi lấy thông tin giỏ hàng:', error);
        // Sử dụng dữ liệu local nếu không thể kết nối server
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        cartCountElement.textContent = localCart.length;
    }
}

/**
 * Thiết lập trang cho người dùng chưa đăng nhập
 */
function setupForLoggedOutUser(accountMenu, accountDropdown, dropdownMenu, cartCountElement) {
    // Thiết lập link đăng nhập
    accountMenu.href = '/client/login.html';
    accountMenu.innerHTML = `
        <i class="fas fa-user-circle"></i>
        <span>Đăng nhập</span>
    `;

    // Ẩn dropdown menu
    if (dropdownMenu) {
        dropdownMenu.style.display = 'none';
    }

    // Xóa các event listener hover
    accountDropdown.classList.remove('account-dropdown');
    accountDropdown.classList.add('menu-item');
    
    // Cập nhật số lượng giỏ hàng từ localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cartCountElement.textContent = cart.length;
}