document.addEventListener('DOMContentLoaded', function() {
    // Bắt các phần tử DOM
    const reviewBtns = document.querySelectorAll('.btn-review');
    const reviewModalOverlay = document.getElementById('reviewModalOverlay');
    const closeReviewModalBtn = document.getElementById('closeReviewModal');
    const cancelReviewBtn = document.getElementById('cancelReview');
    const reviewForm = document.getElementById('reviewForm');
    const photoUpload = document.getElementById('photoUpload');
    const photoPreviewContainer = document.getElementById('photoPreviewContainer');
    const reviewProductImage = document.getElementById('reviewProductImage');
    const reviewProductTitle = document.getElementById('reviewProductTitle');
    const reviewProductAuthor = document.getElementById('reviewProductAuthor');
    
    // Thêm sự kiện click cho các nút "Đánh giá"
    reviewBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Lấy thông tin sản phẩm từ phần tử cha
            const productCell = e.target.closest('.product-cell');
            const productImage = productCell.querySelector('img').src;
            const productTitle = productCell.querySelector('.product-title').textContent;
            const productAuthor = productCell.querySelector('.product-author').textContent;
            
            // Cập nhật thông tin sản phẩm vào form đánh giá
            reviewProductImage.src = productImage;
            reviewProductTitle.textContent = productTitle;
            reviewProductAuthor.textContent = productAuthor;
            
            // Hiển thị modal đánh giá
            reviewModalOverlay.style.display = 'flex';
            
            // Tự động focus vào trường tiêu đề
            setTimeout(() => {
                document.getElementById('reviewTitle').focus();
            }, 300);
            
            // Ngăn chặn sự kiện lan truyền
            e.stopPropagation();
        });
    });
    
    // Đóng modal khi nhấn vào nút đóng
    closeReviewModalBtn.addEventListener('click', function() {
        reviewModalOverlay.style.display = 'none';
        resetForm();
    });
    
    // Đóng modal khi nhấn vào nút Hủy
    cancelReviewBtn.addEventListener('click', function() {
        reviewModalOverlay.style.display = 'none';
        resetForm();
    });
    
    // Đóng modal khi nhấn vào vùng ngoài
    reviewModalOverlay.addEventListener('click', function(e) {
        if (e.target === reviewModalOverlay) {
            reviewModalOverlay.style.display = 'none';
            resetForm();
        }
    });
    
    // Xử lý upload hình ảnh
    photoUpload.addEventListener('change', handleImageUpload);
    
    // Xử lý submit form
    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Kiểm tra xem đã chọn số sao chưa
        const rating = document.querySelector('input[name="rating"]:checked');
        if (!rating) {
            alert('Vui lòng chọn số sao đánh giá!');
            return;
        }
        
        // Kiểm tra tiêu đề đánh giá
        const reviewTitle = document.getElementById('reviewTitle').value.trim();
        if (reviewTitle === '') {
            alert('Vui lòng nhập tiêu đề đánh giá!');
            return;
        }
        
        // Kiểm tra nội dung đánh giá
        const reviewContent = document.getElementById('reviewContent').value.trim();
        if (reviewContent === '') {
            alert('Vui lòng nhập nội dung đánh giá!');
            return;
        }
        
        // Thu thập dữ liệu từ form
        const formData = {
            productTitle: reviewProductTitle.textContent,
            rating: rating.value,
            title: reviewTitle,
            content: reviewContent,
            tags: Array.from(document.querySelectorAll('input[name="tags"]:checked')).map(tag => tag.value)
        };
        
        // Hiển thị thông báo thành công (trong thực tế sẽ gửi dữ liệu lên server)
        console.log('Form data:', formData);
        alert('Cảm ơn bạn đã gửi đánh giá!');
        
        // Đóng modal và reset form
        reviewModalOverlay.style.display = 'none';
        resetForm();
    });
    
    // Hàm xử lý upload hình ảnh
    function handleImageUpload(e) {
        const files = e.target.files;
        
        if (!files || files.length === 0) return;
        
        // Giới hạn số lượng ảnh (tối đa 5 ảnh)
        const maxImages = 5;
        const currentImages = photoPreviewContainer.querySelectorAll('.photo-preview').length;
        
        // Kiểm tra nếu số ảnh vượt quá giới hạn
        if (currentImages + files.length > maxImages) {
            alert(`Bạn chỉ có thể tải lên tối đa ${maxImages} ảnh.`);
            return;
        }
        
        // Xử lý từng file ảnh
        Array.from(files).forEach(file => {
            // Kiểm tra kiểu file (chỉ chấp nhận ảnh)
            if (!file.type.startsWith('image/')) {
                alert(`File "${file.name}" không phải là ảnh.`);
                return;
            }
            
            // Tạo preview cho ảnh
            const reader = new FileReader();
            reader.onload = function(event) {
                const photoPreview = document.createElement('div');
                photoPreview.className = 'photo-preview';
                
                photoPreview.innerHTML = `
                    <img src="${event.target.result}" alt="Preview">
                    <button type="button" class="photo-remove-btn">&times;</button>
                `;
                
                // Thêm sự kiện xóa ảnh
                const removeBtn = photoPreview.querySelector('.photo-remove-btn');
                removeBtn.addEventListener('click', function() {
                    photoPreview.remove();
                });
                
                // Thêm vào container
                photoPreviewContainer.appendChild(photoPreview);
            };
            
            reader.readAsDataURL(file);
        });
        
        // Reset input file để có thể chọn lại cùng một file nếu cần
        e.target.value = '';
    }
    
    // Hàm reset form
    function resetForm() {
        reviewForm.reset();
        photoPreviewContainer.innerHTML = '';
    }
});