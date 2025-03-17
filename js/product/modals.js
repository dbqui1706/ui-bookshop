// ==========================================================
// modals.js - Module quản lý các modal
// ==========================================================

import { renderDetailProduct } from './modals/detail.js';
import { renderEditProduct } from './modals/edit.js';
import { renderAddModal } from './modals/add.js';
import {
    showNotification,
    setupFroalaEditor,
    formatDateForInput,
    setupSelect2
} from './utils.js';


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

    // Thiết lập sự kiện cho nút lưu
    document.getElementById('saveProductBtn').addEventListener('click', function () {
        handleAddProduct();
    });

    // Thiết lập xem trước hình ảnh
    setupImagePreview('product-imageName', 'imagePreview');

    // Thiết lập Froala Editor
    setupFroalaEditor('froala-editor');

    // Thiết lập Select2
    setupSelect2('product-category', '#addProductModal .modal-body');

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
        const productId = productDetails.id;
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
        handleUpdateProduct(productDetails.id);
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
 * Hàm xử lý việc thêm sản phẩm mới
 */
const handleAddProduct = () => {
    // Lấy form
    const form = document.getElementById('addProductForm');

    // Kiểm tra tính hợp lệ của form
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Tạo FormData
    const formData = new FormData(form);

    // Lấy nội dung từ Froala Editor nếu có
    if (typeof FroalaEditor !== 'undefined') {
        const editor = FroalaEditor.INSTANCES.find(i => i.el.id === 'froala-editor');
        if (editor) {
            formData.append('description', editor.html.get());
        }
    }

    // Thực hiện gửi request thêm mới
    addProduct(formData);
};

/**
 * Gửi request API thêm sản phẩm mới
 * @param {FormData} formData Dữ liệu form
 */
const addProduct = async (formData) => {
    try {
        showLoadingOverlay();

        // Gửi request
        const response = await fetch('/admin/productManager/create', {
            method: 'POST',
            body: formData
        });

        // Xử lý kết quả
        if (response.ok) {
            const result = await response.json();

            // Ẩn modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
            modal.hide();

            // Hiển thị thông báo thành công
            showNotification('Thêm sản phẩm thành công!', 'success');

            // Tải lại danh sách sản phẩm
            if (typeof loadProducts === 'function') {
                loadProducts();
            }
        } else {
            const errorData = await response.json();
            showNotification(`Lỗi: ${errorData.message || 'Không thể thêm sản phẩm!'}`, 'error');
        }
    } catch (error) {
        console.error('Lỗi thêm sản phẩm:', error);
        showNotification('Đã xảy ra lỗi khi thêm sản phẩm!', 'error');
    } finally {
        hideLoadingOverlay();
    }
};

/**
 * Hàm xử lý việc cập nhật sản phẩm
 * @param {number} productId ID của sản phẩm cần cập nhật
 */
const handleUpdateProduct = (productId) => {
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

    // Thực hiện gửi request cập nhật
    updateProduct(formData, productId);
};

/**
 * Gửi request API cập nhật sản phẩm
 * @param {FormData} formData Dữ liệu form
 * @param {number} productId ID sản phẩm
 */
const updateProduct = async (formData, productId) => {
    try {
        showLoadingOverlay();

        // Gửi request
        const response = await fetch(`/admin/productManager/update/${productId}`, {
            method: 'POST',
            body: formData
        });

        // Xử lý kết quả
        if (response.ok) {
            const result = await response.json();

            // Ẩn modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
            modal.hide();

            // Hiển thị thông báo thành công
            showNotification('Cập nhật sản phẩm thành công!', 'success');

            // Tải lại danh sách sản phẩm
            if (typeof loadProducts === 'function') {
                loadProducts();
            }
        } else {
            const errorData = await response.json();
            showNotification(`Lỗi: ${errorData.message || 'Không thể cập nhật sản phẩm!'}`, 'error');
        }
    } catch (error) {
        console.error('Lỗi cập nhật sản phẩm:', error);
        showNotification('Đã xảy ra lỗi khi cập nhật sản phẩm!', 'error');
    } finally {
        hideLoadingOverlay();
    }
};

/**
 * Hiển thị overlay loading
 */
const showLoadingOverlay = () => {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center';
    loadingOverlay.id = 'modalLoadingOverlay';
    loadingOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    loadingOverlay.style.zIndex = '9999';
    loadingOverlay.innerHTML = `
        <div class="spinner-border text-light" role="status">
            <span class="visually-hidden">Đang xử lý...</span>
        </div>
    `;
    document.body.appendChild(loadingOverlay);
};

/**
 * Ẩn overlay loading
 */
const hideLoadingOverlay = () => {
    const loadingOverlay = document.getElementById('modalLoadingOverlay');
    if (loadingOverlay) {
        document.body.removeChild(loadingOverlay);
    }
};