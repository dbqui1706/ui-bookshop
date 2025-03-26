import { ProductContainer } from '../container/home-container.js';

document.addEventListener('DOMContentLoaded', async function () {
    /**
     * Khởi tạo container quản lý sản phẩm
     * ProductContainer sẽ xử lý:
     * 1. Lấy dữ liệu sản phẩm từ API
     * 2. Xử lý các sự kiện bộ lọc
     * 3. Render sản phẩm lên giao diện
     * 4. Xử lý tải thêm sản phẩm
     */
    const productContainer = new ProductContainer();
    
    // Xử lý sự kiện collapse cho bộ lọc
    setupFilterCollapse();
    
    // Xử lý toggle cho filter trên mobile
    setupMobileFilter();
    
    // Xử lý số cho input giá
    setupPriceInputFormatting();
    
    // Khởi tạo tooltip nếu cần
    initializeTooltips();
});

/**
 * Xử lý sự kiện collapse cho bộ lọc
 */
function setupFilterCollapse() {
    const filterTitles = document.querySelectorAll('.filter-group-title');
    
    filterTitles.forEach(title => {
        title.addEventListener('click', function() {
            // Toggle icon direction
            const icon = this.querySelector('i');
            if (icon) {
                if (this.getAttribute('aria-expanded') === 'true') {
                    icon.style.transform = 'rotate(-90deg)';
                } else {
                    icon.style.transform = 'rotate(0deg)';
                }
            }
        });
    });
}

/**
 * Xử lý toggle cho filter trên mobile
 */
function setupMobileFilter() {
    const filterToggleBtn = document.querySelector('.filter-toggle-btn');
    const filterSidebar = document.querySelector('.filter-sidebar');
    
    if (filterToggleBtn && filterSidebar) {
        filterToggleBtn.addEventListener('click', function() {
            filterSidebar.classList.toggle('filter-sidebar-mobile-open');
        });
        
        // Close button trong sidebar mobile
        const closeSidebarBtn = document.querySelector('.filter-sidebar-close');
        if (closeSidebarBtn) {
            closeSidebarBtn.addEventListener('click', function() {
                filterSidebar.classList.remove('filter-sidebar-mobile-open');
            });
        }
        
        // Click outside để đóng sidebar
        document.addEventListener('click', function(event) {
            if (filterSidebar.classList.contains('filter-sidebar-mobile-open') && 
                !filterSidebar.contains(event.target) && 
                event.target !== filterToggleBtn) {
                filterSidebar.classList.remove('filter-sidebar-mobile-open');
            }
        });
    }
}

/**
 * Cài đặt định dạng số cho input giá
 */
function setupPriceInputFormatting() {
    const priceInputs = document.querySelectorAll('.price-input');
    
    priceInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            // Chỉ giữ lại các số
            let value = this.value.replace(/\D/g, '');
            
            // Định dạng số với dấu phân cách
            if (value) {
                value = parseInt(value).toLocaleString('vi-VN');
            }
            
            // Thêm ký hiệu tiền tệ nếu có giá trị
            this.value = value ? value : '';
        });
        
        // Khi focus vào, xóa các ký tự định dạng
        input.addEventListener('focus', function() {
            this.value = this.value.replace(/\D/g, '');
        });
        
        // Khi blur, định dạng lại
        input.addEventListener('blur', function() {
            if (this.value) {
                const value = parseInt(this.value.replace(/\D/g, '')).toLocaleString('vi-VN');
                this.value = value;
            }
        });
    });
}

/**
 * Khởi tạo tooltips
 */
function initializeTooltips() {
    // Sử dụng Bootstrap Tooltip
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => {
        new bootstrap.Tooltip(tooltip);
    });
}

/**
 * Xử lý "Xem thêm" trong các bộ lọc
 */
document.querySelectorAll('.filter-more').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Tìm parent filter group
        const filterGroup = this.closest('.filter-group');
        
        if (filterGroup) {
            // Tìm các tùy chọn ẩn
            const hiddenOptions = filterGroup.querySelectorAll('.filter-option.d-none');
            
            if (hiddenOptions.length > 0) {
                // Hiển thị các tùy chọn ẩn
                hiddenOptions.forEach(option => {
                    option.classList.remove('d-none');
                });
                
                // Đổi text của nút
                this.innerHTML = 'Thu gọn <i class="fas fa-chevron-up"></i>';
            } else {
                // Ẩn các tùy chọn dư thừa
                const allOptions = filterGroup.querySelectorAll('.filter-option');
                const visibleCount = 5; // Số lượng hiển thị mặc định
                
                for (let i = visibleCount; i < allOptions.length; i++) {
                    allOptions[i].classList.add('d-none');
                }
                
                // Đổi text của nút
                this.innerHTML = 'Xem thêm <i class="fas fa-chevron-down"></i>';
            }
        }
    });
});

// Xử lý click vào sản phẩm
document.addEventListener('click', function(e) {
    const bookCard = e.target.closest('.book-card');
    if (bookCard) {
        const bookTitle = bookCard.querySelector('.book-title').textContent;
        console.log(`User clicked on book: ${bookTitle}`);
        
        // Thêm vào danh sách xem gần đây
        addToRecentlyViewed(bookCard);
        
        // Trong trường hợp thực tế, có thể tạo link đến trang chi tiết sản phẩm
        // window.location.href = `/product-detail.html?id=${bookId}`;
    }
});

/**
 * Thêm sản phẩm vào danh sách xem gần đây
 */
function addToRecentlyViewed(bookCard) {
    // Clone sản phẩm
    const bookClone = bookCard.cloneNode(true);
    
    // Lấy container sản phẩm đã xem
    const recentlyViewedContainer = document.getElementById('recentlyViewed');
    
    if (recentlyViewedContainer) {
        // Kiểm tra xem đã có sản phẩm này chưa
        const bookTitle = bookCard.querySelector('.book-title').textContent;
        const existingBooks = recentlyViewedContainer.querySelectorAll('.book-title');
        
        for (let i = 0; i < existingBooks.length; i++) {
            if (existingBooks[i].textContent === bookTitle) {
                // Đã tồn tại, không thêm nữa
                return;
            }
        }
        
        // Thêm vào danh sách xem gần đây
        const colDiv = document.createElement('div');
        colDiv.className = 'col';
        colDiv.appendChild(bookClone);
        
        // Thêm vào đầu danh sách
        if (recentlyViewedContainer.firstChild) {
            recentlyViewedContainer.insertBefore(colDiv, recentlyViewedContainer.firstChild);
        } else {
            recentlyViewedContainer.appendChild(colDiv);
        }
        
        // Giới hạn số lượng sản phẩm hiển thị
        const maxItems = 4;
        const items = recentlyViewedContainer.querySelectorAll('.col');
        
        for (let i = maxItems; i < items.length; i++) {
            items[i].remove();
        }
        
        // Lưu vào localStorage
        saveRecentlyViewedToStorage();
    }
}

/**
 * Lưu danh sách sản phẩm đã xem vào localStorage
 */
function saveRecentlyViewedToStorage() {
    const recentlyViewedContainer = document.getElementById('recentlyViewed');
    
    if (recentlyViewedContainer) {
        const books = recentlyViewedContainer.querySelectorAll('.book-card');
        const recentlyViewedBooks = [];
        
        books.forEach(book => {
            const title = book.querySelector('.book-title').textContent;
            const price = book.querySelector('.book-price').textContent;
            const img = book.querySelector('img').getAttribute('src');
            
            recentlyViewedBooks.push({
                title,
                price,
                img
            });
        });
        
        localStorage.setItem('recentlyViewedBooks', JSON.stringify(recentlyViewedBooks));
    }
}

/**
 * Tải danh sách sản phẩm đã xem từ localStorage
 */
function loadRecentlyViewedFromStorage() {
    const recentlyViewedContainer = document.getElementById('recentlyViewed');
    
    if (recentlyViewedContainer) {
        const storedBooks = localStorage.getItem('recentlyViewedBooks');
        
        if (storedBooks) {
            const books = JSON.parse(storedBooks);
            
            // Xóa nội dung hiện tại
            recentlyViewedContainer.innerHTML = '';
            
            // Thêm các sản phẩm từ localStorage
            books.forEach(book => {
                const bookHTML = `
                <div class="col">
                    <div class="book-card">
                        <img src="${book.img}" alt="${book.title}">
                        <div class="book-info">
                            <h5 class="book-title">${book.title}</h5>
                            <div class="book-price">${book.price}</div>
                        </div>
                    </div>
                </div>
                `;
                
                recentlyViewedContainer.innerHTML += bookHTML;
            });
        }
    }
}

// Tải sản phẩm đã xem khi trang tải xong
document.addEventListener('DOMContentLoaded', function() {
    loadRecentlyViewedFromStorage();
});