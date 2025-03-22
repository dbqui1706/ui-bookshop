export const userAddModalHtml = () => {
    return `
        <div class="modal fade" id="addUserModal" tabindex="-1" aria-labelledby="addUserModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title" id="addUserModalLabel">
                            Thêm người dùng mới
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="addUserForm" method="POST" action="#" enctype="multipart/form-data">
                            <!-- Thông báo thành công/lỗi -->
                            <div id="successMessage" class="alert alert-success mb-3" role="alert"
                                style="display: none"></div>
                            <div id="errorMessage" class="alert alert-danger mb-3" role="alert"
                                style="display: none"></div>

                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="user-firstName" class="form-label">Họ <span
                                            class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="user-firstName" name="firstName"
                                        required />
                                    <div class="invalid-feedback"></div>
                                </div>
                                <div class="col-md-6">
                                    <label for="user-lastName" class="form-label">Tên <span
                                            class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="user-lastName" name="lastName"
                                        required />
                                    <div class="invalid-feedback"></div>
                                </div>
                            </div>

                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="user-email" class="form-label">Email <span
                                            class="text-danger">*</span></label>
                                    <input type="email" class="form-control" id="user-email" name="email"
                                        required />
                                    <div class="invalid-feedback"></div>
                                </div>
                                <div class="col-md-6">
                                    <label for="user-phone" class="form-label">Số điện thoại <span
                                            class="text-danger">*</span></label>
                                    <input type="tel" class="form-control" id="user-phone" name="phone" required />
                                    <div class="invalid-feedback"></div>
                                </div>
                            </div>

                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="user-password" class="form-label">Mật khẩu <span
                                            class="text-danger">*</span></label>
                                    <input type="password" class="form-control" id="user-password" name="password"
                                        required />
                                    <div class="invalid-feedback"></div>
                                </div>
                                <div class="col-md-6">
                                    <label for="user-confirmPassword" class="form-label">Xác nhận mật khẩu
                                        <span class="text-danger">*</span></label>
                                    <input type="password" class="form-control" id="user-confirmPassword"
                                        name="confirmPassword" required />
                                    <div class="invalid-feedback"></div>
                                </div>
                            </div>

                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="user-role" class="form-label">Vai trò <span
                                            class="text-danger">*</span></label>
                                    <select class="form-select" id="user-role" name="role" required>
                                        <option value="" selected disabled>Chọn vai trò</option>
                                        <option value="admin">Quản trị viên</option>
                                        <option value="staff">Nhân viên</option>
                                        <option value="customer">Khách hàng</option>
                                    </select>
                                    <div class="invalid-feedback"></div>
                                </div>
                                <div class="col-md-6">
                                    <label for="user-status" class="form-label">Trạng thái <span
                                            class="text-danger">*</span></label>
                                    <select class="form-select" id="user-status" name="status" required>
                                        <option value="active" selected>Đang hoạt động</option>
                                        <option value="inactive">Không hoạt động</option>
                                        <option value="locked">Bị khóa</option>
                                    </select>
                                    <div class="invalid-feedback"></div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="user-address" class="form-label">Địa chỉ</label>
                                <textarea class="form-control" id="user-address" name="address" rows="2"></textarea>
                            </div>

                            <div class="mb-3">
                                <label for="user-avatar" class="form-label">Ảnh đại diện</label>
                                <input type="file" class="form-control" id="user-avatar" name="avatar"
                                    accept="image/*" />
                                <div class="mt-2" id="avatarPreview" style="display: none">
                                    <img src="" alt="Preview" class="img-thumbnail" style="max-height: 150px" />
                                </div>
                            </div>

                            <div class="mb-3 form-check">
                                <input type="checkbox" class="form-check-input" id="user-sendWelcomeEmail"
                                    name="sendWelcomeEmail" checked />
                                <label class="form-check-label" for="user-sendWelcomeEmail">Gửi email chào mừng với
                                    thông tin đăng nhập</label>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            Hủy
                        </button>
                        <button type="button" class="btn btn-primary" id="saveUserBtn">
                            <i class="bi bi-save me-1"></i> Lưu người dùng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}
