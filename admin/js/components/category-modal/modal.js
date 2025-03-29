// ==========================================================
// modals.js - Module quản lý các modal cho danh mục
// ==========================================================

// Sẽ import các component khi tạo
// import { renderDetailCategory } from './detail.js'
// import { renderEditCategory } from './edit.js';
// import { renderAddCategory } from './add.js';
// import { renderDeleteCategory } from './delete.js';

import { addCategory, updateCategory, deleteCategory } from '../../service/category.js';
import { loadCategories, loadStatistics } from '../../container/category.js';
import {
    showNotification,
    formatDateTime,
    showLoadingOverlay,
    hideLoadingOverlay,
    showAlert
} from '../../utils/index.js';

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
 * Modal thêm danh mục mới
 */
export const addCategoryModal = () => {
    // Tạo và hiển thị modal
    const modal = createAndShowModal('addCategoryModal', `
        <div class="modal fade" id="addCategoryModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Thêm danh mục mới</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="addCategoryForm">
                            <div class="mb-3">
                                <label for="categoryName" class="form-label">Tên danh mục <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="categoryName" required>
                            </div>
                            <div class="mb-3">
                                <label for="categorySlug" class="form-label">Slug</label>
                                <input type="text" class="form-control" id="categorySlug">
                                <div class="form-text">Để trống để tự động tạo từ tên danh mục</div>
                            </div>
                            <div class="mb-3">
                                <label for="categoryDescription" class="form-label">Mô tả</label>
                                <textarea class="form-control" id="categoryDescription" rows="3"></textarea>
                            </div>
                            <div class="mb-3 form-check">
                                <input type="checkbox" class="form-check-input" id="categoryStatus" checked>
                                <label class="form-check-label" for="categoryStatus">Kích hoạt</label>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                        <button type="button" class="btn btn-primary" id="saveCategoryBtn">Lưu</button>
                    </div>
                </div>
            </div>
        </div>
    `);

    // Thêm sự kiện cho nút lưu
    document.getElementById('saveCategoryBtn').addEventListener('click', function() {
        handleAddCategory(modal);
    });
};

/**
 * Modal chi tiết danh mục
 */
export const categoryDetailModal = (categoryDetails) => {
    const status = categoryDetails.isActive ? 
        '<span class="badge bg-success">Hoạt động</span>' : 
        '<span class="badge bg-danger">Tạm khóa</span>';
        
    // Tạo và hiển thị modal
    createAndShowModal('categoryDetailModal', `
        <div class="modal fade" id="categoryDetailModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Chi tiết danh mục</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="table-responsive">
                            <table class="table table-bordered">
                                <tbody>
                                    <tr>
                                        <th style="width: 35%">ID</th>
                                        <td>#${categoryDetails.id}</td>
                                    </tr>
                                    <tr>
                                        <th>Tên danh mục</th>
                                        <td>${categoryDetails.name}</td>
                                    </tr>
                                    <tr>
                                        <th>iamge</th>
                                        <td>
                                            <img src="${categoryDetails.imageName}" alt="${categoryDetails.name}" class="img-fluid rounded" style="max-width: 100px;">
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Mô tả</th>
                                        <td>${categoryDetails.description || 'Không có mô tả'}</td>
                                    </tr>
                                    <tr>
                                        <th>Số sách</th>
                                        <td>${categoryDetails.productCount || 0}</td>
                                    </tr>
                                    <tr>
                                        <th>Trạng thái</th>
                                        <td>${status}</td>
                                    </tr>
                                    <tr>
                                        <th>Ngày tạo</th>
                                        <td>${formatDateTime(categoryDetails.createdAt)}</td>
                                    </tr>
                                    <tr>
                                        <th>Cập nhật cuối</th>
                                        <td>${categoryDetails.updatedAt ? formatDateTime(categoryDetails.updatedAt) : 'Chưa cập nhật'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                    </div>
                </div>
            </div>
        </div>
    `);
};

/**
 * Modal chỉnh sửa danh mục
 */
export const editCategoryModal = (categoryDetails) => {
    // Tạo và hiển thị modal
    const modal = createAndShowModal('editCategoryModal', `
        <div class="modal fade" id="editCategoryModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Chỉnh sửa danh mục</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editCategoryForm">
                            <input type="hidden" id="editCategoryId" value="${categoryDetails.id}">
                            <div class="mb-3">
                                <label for="editCategoryName" class="form-label">Tên danh mục <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="editCategoryName" value="${categoryDetails.name}" required>
                            </div>
                            <div class="mb-3">
                                <label for="editCategorySlug" class="form-label">Slug</label>
                                <input type="text" class="form-control" id="editCategorySlug" value="${categoryDetails.slug || ''}">
                                <div class="form-text">Để trống để tự động tạo từ tên danh mục</div>
                            </div>
                            <div class="mb-3">
                                <label for="editCategoryDescription" class="form-label">Mô tả</label>
                                <textarea class="form-control" id="editCategoryDescription" rows="3">${categoryDetails.description || ''}</textarea>
                            </div>
                            <div class="mb-3 form-check">
                                <input type="checkbox" class="form-check-input" id="editCategoryStatus" ${categoryDetails.isActive ? 'checked' : ''}>
                                <label class="form-check-label" for="editCategoryStatus">Kích hoạt</label>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                        <button type="button" class="btn btn-primary" id="updateCategoryBtn">Cập nhật</button>
                    </div>
                </div>
            </div>
        </div>
    `);

    // Thêm sự kiện cho nút cập nhật
    document.getElementById('updateCategoryBtn').addEventListener('click', function() {
        handleUpdateCategory(categoryDetails.id, modal);
    });
};

/**
 * Modal xác nhận xóa hoặc thay đổi trạng thái danh mục
 */
export const toggleCategoryStatusModal = (categoryDetails) => {
    const action = categoryDetails.isActive ? 'khóa' : 'kích hoạt';
    const btnClass = categoryDetails.isActive ? 'btn-danger' : 'btn-success';

    // Tạo và hiển thị modal
    const modal = createAndShowModal('toggleCategoryStatusModal', `
        <div class="modal fade" id="toggleCategoryStatusModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Xác nhận ${action}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>Bạn có chắc chắn muốn ${action} danh mục "${categoryDetails.name}" không?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                        <button type="button" class="btn ${btnClass}" id="confirmToggleStatusBtn">Xác nhận</button>
                    </div>
                </div>
            </div>
        </div>
    `);

    // Thêm sự kiện cho nút xác nhận
    document.getElementById('confirmToggleStatusBtn').addEventListener('click', function() {
        handleToggleCategoryStatus(categoryDetails.id, !categoryDetails.isActive, modal);
    });
};

/**
 * Xử lý thêm danh mục mới
 */
const handleAddCategory = async (modal) => {
    // Lấy giá trị từ form
    const name = document.getElementById('categoryName').value.trim();
    const slug = document.getElementById('categorySlug').value.trim();
    const description = document.getElementById('categoryDescription').value.trim();
    const isActive = document.getElementById('categoryStatus').checked;

    // Kiểm tra dữ liệu
    if (!name) {
        showAlert('error', 'Vui lòng nhập tên danh mục!');
        return;
    }

    // Dữ liệu gửi lên server
    const categoryData = {
        name,
        slug,
        description,
        isActive
    };

    try {
        showLoadingOverlay();
        const result = await addCategory(categoryData);
        hideLoadingOverlay();

        if (result.success) {
            modal.hide();
            showAlert('success', result.message);
            // Làm mới danh sách danh mục
            loadCategories();
            loadStatistics();
        } else {
            showAlert('error', result.message);
        }
    } catch (error) {
        hideLoadingOverlay();
        console.error('Error adding category:', error);
        showAlert('error', 'Đã xảy ra lỗi khi thêm danh mục!');
    }
};

/**
 * Xử lý cập nhật danh mục
 */
const handleUpdateCategory = async (categoryId, modal) => {
    // Lấy giá trị từ form
    const name = document.getElementById('editCategoryName').value.trim();
    const slug = document.getElementById('editCategorySlug').value.trim();
    const description = document.getElementById('editCategoryDescription').value.trim();
    const isActive = document.getElementById('editCategoryStatus').checked;

    // Kiểm tra dữ liệu
    if (!name) {
        showAlert('error', 'Vui lòng nhập tên danh mục!');
        return;
    }

    // Dữ liệu gửi lên server
    const categoryData = {
        id: categoryId,
        name,
        slug,
        description,
        isActive
    };

    try {
        showLoadingOverlay();
        const result = await updateCategory(categoryData);
        hideLoadingOverlay();

        if (result.success) {
            modal.hide();
            showAlert('success', result.message);
            // Làm mới danh sách danh mục
            loadCategories();
            loadStatistics();
        } else {
            showAlert('error', result.message);
        }
    } catch (error) {
        hideLoadingOverlay();
        console.error('Error updating category:', error);
        showAlert('error', 'Đã xảy ra lỗi khi cập nhật danh mục!');
    }
};

/**
 * Xử lý thay đổi trạng thái danh mục
 */
const handleToggleCategoryStatus = async (categoryId, newStatus, modal) => {
    try {
        showLoadingOverlay();
        
        // Gọi hàm cập nhật trạng thái
        const result = await updateCategory({
            id: categoryId,
            isActive: newStatus
        });
        
        hideLoadingOverlay();

        if (result.success) {
            modal.hide();
            showAlert('success', result.message);
            // Làm mới danh sách danh mục
            loadCategories();
            loadStatistics();
        } else {
            showAlert('error', result.message);
        }
    } catch (error) {
        hideLoadingOverlay();
        console.error('Error toggling category status:', error);
        showAlert('error', 'Đã xảy ra lỗi khi thay đổi trạng thái danh mục!');
    }
}; 