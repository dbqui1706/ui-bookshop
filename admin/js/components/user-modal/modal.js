// ==========================================================
// modals.js - Module quản lý các modal cho người dùng
// ==========================================================

import { addUser, updateUser, changeUserStatus } from '../../service/user.js';
import { loadUsers, loadStatistics } from '../../container/user.js';
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
 * Modal thêm người dùng mới
 */
export const addUserModal = () => {
    // Tạo và hiển thị modal
    const modal = createAndShowModal('addUserModal', userAddModalHtml());

    // Thêm sự kiện cho nút lưu
    document.getElementById('saveUserBtn').addEventListener('click', function() {
        handleAddUser(modal);
    });
};

/**
 * Modal chi tiết người dùng
 */
export const userDetailModal = (userDetails) => {
    const status = userDetails.active ? 
        '<span class="badge bg-success">Hoạt động</span>' : 
        '<span class="badge bg-danger">Bị khóa</span>';
    
    const role = userDetails.role === 'ADMIN' ? 
        '<span class="badge bg-primary">Quản trị viên</span>' : 
        '<span class="badge bg-secondary">Khách hàng</span>';
        
    // Tạo và hiển thị modal
    createAndShowModal('viewUserModal', userDetailModalHtml(userDetails));
};

/**
 * Modal chỉnh sửa người dùng
 */
export const editUserModal = (userDetails) => {
    // Tạo và hiển thị modal
    const modal = createAndShowModal('editUserModal', userEditModalHtml());

    // Thêm sự kiện cho nút cập nhật
    document.getElementById('updateUserBtn').addEventListener('click', function() {
        handleUpdateUser(userDetails.id, modal);
    });
};

/**
 * Modal xác nhận thay đổi trạng thái người dùng
 */
export const toggleUserStatusModal = (userDetails) => {
    const action = userDetails.active ? 'khóa' : 'kích hoạt';
    const btnClass = userDetails.active ? 'btn-danger' : 'btn-success';

    // Tạo và hiển thị modal
    const modal = createAndShowModal('toggleUserStatusModal', `
        <div class="modal fade" id="toggleUserStatusModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Xác nhận ${action} tài khoản</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>Bạn có chắc chắn muốn ${action} tài khoản của người dùng "${userDetails.name}" không?</p>
                        ${userDetails.active ? 
                            '<div class="alert alert-warning">Người dùng sẽ không thể đăng nhập vào hệ thống khi bị khóa.</div>' : 
                            '<div class="alert alert-info">Người dùng sẽ có thể đăng nhập vào hệ thống sau khi được kích hoạt.</div>'
                        }
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
        handleToggleUserStatus(userDetails.id, !userDetails.active, modal);
    });
};

/**
 * Modal đặt lại mật khẩu
 */
export const resetPasswordModal = (userDetails) => {
    // Tạo và hiển thị modal
    const modal = createAndShowModal('resetPasswordModal', `
        <div class="modal fade" id="resetPasswordModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Đặt lại mật khẩu</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>Bạn đang đặt lại mật khẩu cho người dùng: <strong>${userDetails.name}</strong></p>
                        <form id="resetPasswordForm">
                            <div class="mb-3">
                                <label for="newPassword" class="form-label">Mật khẩu mới <span class="text-danger">*</span></label>
                                <input type="password" class="form-control" id="newPassword" required>
                            </div>
                            <div class="mb-3">
                                <label for="confirmPassword" class="form-label">Xác nhận mật khẩu <span class="text-danger">*</span></label>
                                <input type="password" class="form-control" id="confirmPassword" required>
                            </div>
                            <div class="alert alert-warning">
                                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                                Người dùng sẽ phải sử dụng mật khẩu mới này để đăng nhập vào hệ thống.
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                        <button type="button" class="btn btn-primary" id="resetPasswordBtn">Đặt lại mật khẩu</button>
                    </div>
                </div>
            </div>
        </div>
    `);

    // Thêm sự kiện cho nút đặt lại mật khẩu
    document.getElementById('resetPasswordBtn').addEventListener('click', function() {
        handleResetPassword(userDetails.id, modal);
    });
};

/**
 * Xử lý thêm người dùng mới
 */
const handleAddUser = async (modal) => {
    // Lấy giá trị từ form
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const password = document.getElementById('userPassword').value.trim();
    const phone = document.getElementById('userPhone').value.trim();
    const role = document.getElementById('userRole').value;
    const active = document.getElementById('userStatus').checked;

    // Kiểm tra dữ liệu
    if (!name) {
        showAlert('error', 'Vui lòng nhập họ tên!');
        return;
    }
    if (!email) {
        showAlert('error', 'Vui lòng nhập email!');
        return;
    }
    if (!password) {
        showAlert('error', 'Vui lòng nhập mật khẩu!');
        return;
    }

    // Kiểm tra định dạng email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showAlert('error', 'Email không hợp lệ!');
        return;
    }

    // Dữ liệu gửi lên server
    const userData = {
        name,
        email,
        password,
        phone,
        role,
        active
    };

    try {
        showLoadingOverlay();
        const result = await addUser(userData);
        hideLoadingOverlay();

        if (result.success) {
            modal.hide();
            showAlert('success', result.message);
            // Làm mới danh sách người dùng
            loadUsers();
            loadStatistics();
        } else {
            showAlert('error', result.message);
        }
    } catch (error) {
        hideLoadingOverlay();
        console.error('Error adding user:', error);
        showAlert('error', 'Đã xảy ra lỗi khi thêm người dùng!');
    }
};

/**
 * Xử lý cập nhật người dùng
 */
const handleUpdateUser = async (userId, modal) => {
    // Lấy giá trị từ form
    const name = document.getElementById('editUserName').value.trim();
    const email = document.getElementById('editUserEmail').value.trim();
    const phone = document.getElementById('editUserPhone').value.trim();
    const password = document.getElementById('editUserPassword').value.trim();
    const role = document.getElementById('editUserRole').value;
    const active = document.getElementById('editUserStatus').checked;

    // Kiểm tra dữ liệu
    if (!name) {
        showAlert('error', 'Vui lòng nhập họ tên!');
        return;
    }
    if (!email) {
        showAlert('error', 'Vui lòng nhập email!');
        return;
    }

    // Kiểm tra định dạng email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showAlert('error', 'Email không hợp lệ!');
        return;
    }

    // Dữ liệu gửi lên server
    const userData = {
        id: userId,
        name,
        email,
        phone,
        role,
        active
    };

    // Thêm mật khẩu nếu được cung cấp
    if (password) {
        userData.password = password;
    }

    try {
        showLoadingOverlay();
        const result = await updateUser(userData);
        hideLoadingOverlay();

        if (result.success) {
            modal.hide();
            showAlert('success', result.message);
            // Làm mới danh sách người dùng
            loadUsers();
            loadStatistics();
        } else {
            showAlert('error', result.message);
        }
    } catch (error) {
        hideLoadingOverlay();
        console.error('Error updating user:', error);
        showAlert('error', 'Đã xảy ra lỗi khi cập nhật người dùng!');
    }
};

/**
 * Xử lý thay đổi trạng thái người dùng
 */
const handleToggleUserStatus = async (userId, newStatus, modal) => {
    try {
        showLoadingOverlay();
        
        // Gọi hàm thay đổi trạng thái
        const result = await changeUserStatus(userId, newStatus);
        
        hideLoadingOverlay();

        if (result.success) {
            modal.hide();
            showAlert('success', result.message);
            // Làm mới danh sách người dùng
            loadUsers();
            loadStatistics();
        } else {
            showAlert('error', result.message);
        }
    } catch (error) {
        hideLoadingOverlay();
        console.error('Error toggling user status:', error);
        showAlert('error', 'Đã xảy ra lỗi khi thay đổi trạng thái người dùng!');
    }
};

/**
 * Xử lý đặt lại mật khẩu
 */
const handleResetPassword = async (userId, modal) => {
    // Lấy giá trị mật khẩu mới và xác nhận
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Kiểm tra mật khẩu
    if (!newPassword) {
        showAlert('error', 'Vui lòng nhập mật khẩu mới!');
        return;
    }

    if (newPassword !== confirmPassword) {
        showAlert('error', 'Xác nhận mật khẩu không khớp!');
        return;
    }

    try {
        showLoadingOverlay();
        
        // Gọi API để đặt lại mật khẩu
        const result = await resetPassword(userId, newPassword);
        
        hideLoadingOverlay();

        if (result.success) {
            modal.hide();
            showAlert('success', result.message);
        } else {
            showAlert('error', result.message);
        }
    } catch (error) {
        hideLoadingOverlay();
        console.error('Error resetting password:', error);
        showAlert('error', 'Đã xảy ra lỗi khi đặt lại mật khẩu!');
    }
};

// Import function resetPassword từ service
import { resetPassword } from '../../service/user.js';import { userDetailModalHtml } from './detail.js';
import { userEditModalHtml } from './edit.js';
import { userAddModalHtml } from './add.js';

