// ==========================================================
// modals.js - Module quản lý các modal
// ==========================================================

import { renderDetailProduct } from './modals/detail.js';
import { renderEditProduct } from './modals/edit.js';
import { renderAddModal } from './modals/add.js';
import { renderDeleteProduct } from './modals/delete.js';

import { addProduct, updateProduct, deleteProduct } from './api.js';
import { loadProducts } from './product.js';
import {
    showNotification,
    setupFroalaEditor,
    formatDateForInput,
    setupSelect2,
    showLoadingOverlay,
    hideLoadingOverlay,
    showAlert
} from '../utils.js';


/**
 * Hàm tiện ích để tạo và hiển thị modal
 * @param {string} modalId - ID của modal
 * @param {string} modalHTML - Nội dung HTML của modal
 * @returns {Modal} - Đối tượng modal Bootstrap
 */
const createAndShowModal = (modalId, modalHTML) => {
    // Kiểm tra nếu modal đã tồn tại, xóa đi để tạo mới
    const existingModal = document.getElementById(modalId);
    if (existingModal) {
        existingModal.remove();
    }

    // Tạo một phần tử div và đặt HTML modal vào đó
    const modalElement = document.createElement('div');
    modalElement.innerHTML = modalHTML;

    // Thêm modal vào body
    document.body.appendChild(modalElement.firstElementChild);

    // Khởi tạo và hiển thị modal
    const modal = new bootstrap.Modal(document.getElementById(modalId));
    modal.show();

    return modal;
};


/**
 * Hàm điền dữ liệu danh mục vào select box
 * @param {string} selectId - ID của select box
 * @param {number|string} selectedValue - Giá trị được chọn (nếu có)
 */
const populateCategories = (selectId, selectedValue = null) => {
    const categorySelect = document.getElementById(selectId);
    const categoryFilter = document.getElementById('categoryFilter');

    if (categoryFilter && categorySelect) {
        Array.from(categoryFilter.options).forEach(option => {
            if (option.value) {
                const newOption = document.createElement('option');
                newOption.value = option.value;
                newOption.textContent = option.textContent;

                if (selectedValue && option.value == selectedValue) {
                    newOption.selected = true;
                }

                categorySelect.appendChild(newOption);
            }
        });
    }
};

/**
 * Hàm thiết lập xem trước hình ảnh
 * @param {string} inputId - ID của input file
 * @param {string|Element} previewElement - ID hoặc phần tử xem trước
 */
const setupImagePreview = (inputId, previewElement) => {
    const fileInput = document.getElementById(inputId);
    const preview = typeof previewElement === 'string'
        ? document.getElementById(previewElement)
        : previewElement;

    if (fileInput) {
        fileInput.addEventListener('change', function (e) {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                const url = URL.createObjectURL(file);

                if (preview.tagName === 'IMG') {
                    preview.src = url;
                    preview.parentElement.style.display = 'block';
                } else if (preview.querySelector('img')) {
                    preview.querySelector('img').src = url;
                    preview.style.display = 'block';
                }
            }
        });
    }
};

/**
 * Modal thêm sản phẩm mới
 * @returns {Modal}
 */
export const addProductModal = () => {
    const modal = createAndShowModal('addProductModal', renderAddModal());

    // Điền dữ liệu danh mục
    populateCategories('product-category');

     // Thiết lập xem trước hình ảnh
     setupImagePreview('product-imageName', 'imagePreview');

     // Thiết lập Froala Editor
     setupFroalaEditor('froala-editor');
 
     // Thiết lập Select2
     setupSelect2('product-category', '#addProductModal .modal-body');

    // Thiết lập sự kiện cho nút lưu
    document.getElementById('saveProductBtn').addEventListener('click', function (e) {
        handleAddProduct(modal);
    });

    return modal;
};

/**
 * Modal hiển thị chi tiết sản phẩm
 * @param {Object} productDetails - Thông tin chi tiết sản phẩm
 * @returns {Modal}
 */
export const productDetailModal = (productDetails) => {
    const modal = createAndShowModal('viewProductModal', renderDetailProduct(productDetails));

    // Xử lý nút edit
    document.getElementById('editFromViewBtn').addEventListener('click', function () {
        modal.hide();
        editProductModal(productDetails);
    });

    return modal;
};

/**
 * Modal chỉnh sửa sản phẩm
 * @param {Object} productDetails - Thông tin chi tiết sản phẩm
 * @returns {Modal}
 */
export const editProductModal = (productDetails) => {
    const modal = createAndShowModal('editProductModal', renderEditProduct(productDetails));

    // Điền dữ liệu danh mục
    populateCategories('editProductCategory', productDetails.categoryId);

    // Đặt giá trị cho các trường ngày tháng
    if (productDetails.startsAt) {
        document.getElementById('editProductStartsAt').value = formatDateForInput(productDetails.startsAt);
    }
    if (productDetails.endsAt) {
        document.getElementById('editProductEndsAt').value = formatDateForInput(productDetails.endsAt);
    }

    // Thiết lập sự kiện cho nút cập nhật
    document.getElementById('updateProductBtn').addEventListener('click', function () {
        handleUpdateProduct(productDetails.id, modal);
    });

    // Thiết lập xem trước hình ảnh
    setupImagePreview('editProductImage', document.getElementById('editImagePreview').querySelector('img'));

    // Thiết lập Select2
    setupSelect2('editProductCategory', '#editProductModal .modal-body');

    // Thiết lập Froala Editor
    const editor = setupFroalaEditor('edit-froala-editor', function () {
        document.getElementById('editProductDescription').value = this.html.get();
    });

    // Đặt nội dung cho editor nếu có
    if (editor && productDetails.description) {
        editor.html.set(productDetails.description);
    }

    return modal;
};

/**
 * Modal xác nhận xóa sản phẩm
 * @param {Object} productDetails - Thông tin sản phẩm
 * @returns {Modal}
 */
export const deleteProductModal = (productDetails) => {
    
    const modal = createAndShowModal('deleteProductModal', renderDeleteProduct(productDetails));

    // Thiết lập sự kiện cho nút xóa
    document.getElementById('confirmDeleteBtn').addEventListener('click', function() {
        handleDeleteProduct(productDetails.id, modal);
    });

    return modal;
};

/**
 * Hàm xử lý việc thêm sản phẩm mới
 * @param {Modal} modal - Modal Bootstrap instance
 */
const handleAddProduct = async (modal) => {
    // Lấy form
    const form = document.getElementById('addProductForm');
    
    // Kiểm tra validation
    if (!form.checkValidity()) {
        // Hiển thị các thông báo lỗi validation
        form.classList.add('was-validated');
        return;
    }
    
    try {
        // Hiển thị overlay loading
        showLoadingOverlay();
        
        // Lấy nội dung từ Froala Editor và cập nhật vào hidden input
        const editorContent = FroalaEditor.INSTANCES[0].html.get();
        document.getElementById('product-description').value = editorContent;
        
        // Tạo FormData từ form
        const formData = new FormData(form);

        // Gọi API để thêm sản phẩm
        const result = await addProduct(formData);
        
        if (result.success) {
            // Hiển thị thông báo thành công
            const successMessage = document.getElementById('successMessage');
            successMessage.textContent = result.message;
            successMessage.style.display = 'block';
            
            // Ẩn thông báo lỗi nếu có
            document.getElementById('errorMessage').style.display = 'none';
            
            showAlert('success', 'Thêm sản phẩm thành công!');

            // Reset form sau 1 giây
            setTimeout(() => {
                form.reset();
                form.classList.remove('was-validated');
                document.getElementById('imagePreview').style.display = 'none';
                FroalaEditor.INSTANCES[0].html.set('');
                successMessage.style.display = 'none';
                
                // Tải lại danh sách sản phẩm
                loadProducts();
                
                // Đóng modal
                modal.hide();
            }, 1);


        } else {
            // Hiển thị thông báo lỗi
            const errorMessage = document.getElementById('errorMessage');
            errorMessage.textContent = result.message;
            errorMessage.style.display = 'block';
            
            // Ẩn thông báo thành công nếu có
            document.getElementById('successMessage').style.display = 'none';
        }
    } catch (error) {
        console.error('Lỗi xử lý form:', error);
        
        // Hiển thị thông báo lỗi
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = 'Đã xảy ra lỗi khi xử lý form!';
        errorMessage.style.display = 'block';
    } finally {
        // Ẩn overlay loading
        hideLoadingOverlay();
    }
};

/**
 * Hàm xử lý việc cập nhật sản phẩm
 * @param {number} productId - ID của sản phẩm cần cập nhật
 * @param {Modal} modal - Modal Bootstrap instance
 */
const handleUpdateProduct = async (productId, modal) => {
    // Lấy form
    const form = document.getElementById('editProductForm');

    // Kiểm tra tính hợp lệ của form
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Tạo FormData
    const formData = new FormData(form);

    // Nếu không chọn file hình ảnh mới, xoá trường image để không gửi lên server
    const imageInput = document.getElementById('editProductImage');
    if (imageInput.files.length === 0) {
        formData.delete('image');
    }

    // Lấy nội dung từ Froala Editor nếu có
    if (typeof FroalaEditor !== 'undefined') {
        const editor = FroalaEditor.INSTANCES.find(i => i.el.id === 'edit-froala-editor');
        if (editor) {
            formData.set('description', editor.html.get());
        }
    }

    // Hiển thị loading
    showLoadingOverlay();

    try {
        // Gọi API cập nhật sản phẩm
        const result = await updateProduct(formData, productId);

        if (result.success) {
            // Ẩn modal
            modal.hide();
            
            // Hiển thị thông báo thành công
            showNotification(result.message, 'success');
            
            // Tải lại danh sách sản phẩm
            loadProducts();
        } else {
            // Hiển thị thông báo lỗi
            showNotification(result.message, 'error');
        }
    } finally {
        // Ẩn loading dù thành công hay thất bại
        hideLoadingOverlay();
    }
};

/**
 * Hàm xử lý việc xóa sản phẩm
 * @param {number} productId - ID của sản phẩm cần xóa
 * @param {Modal} modal - Modal Bootstrap instance
 */
const handleDeleteProduct = async (productId, modal) => {
    // Hiển thị loading
    showLoadingOverlay();

    try {
        // Gọi API xóa sản phẩm
        const result = await deleteProduct(productId);

        if (result.success) {
            // Ẩn modal
            modal.hide();
            
            // Hiển thị thông báo thành công
            showNotification(result.message, 'success');
            
            // Tải lại danh sách sản phẩm
            loadProducts();
        } else {
            // Hiển thị thông báo lỗi
            showNotification(result.message, 'error');
        }
    } finally {
        // Ẩn loading dù thành công hay thất bại
        hideLoadingOverlay();
    }
};