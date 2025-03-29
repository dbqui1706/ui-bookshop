export const userEditModalHtml = () => {
    return `
        <div class="modal fade" id="editUserModal" tabindex="-1" aria-labelledby="editUserModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title" id="editUserModalLabel">
                            Chỉnh sửa người dùng
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editUserForm" method="POST" action="#" enctype="multipart/form-data">
                            <input type="hidden" id="edit-userId" name="id" value="" />

                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="edit-firstName" class="form-label">Họ <span
                                            class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="edit-firstName" name="firstName"
                                        required />
                                </div>
                                <div class="col-md-6">
                                    <label for="edit-lastName" class="form-label">Tên <span
                                            class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="edit-lastName" name="lastName"
                                        required />
                                </div>
                            </div>

                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="edit-email" class="form-label">Email <span
                                            class="text-danger">*</span></label>
                                    <input type="email" class="form-control" id="edit-email" name="email"
                                        required />
                                </div>
                                <div class="col-md-6">
                                    <label for="edit-phone" class="form-label">Số điện thoại <span
                                            class="text-danger">*</span></label>
                                    <input type="tel" class="form-control" id="edit-phone" name="phone" required />
                                </div>
                            </div>

                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="edit-password" class="form-label">Mật khẩu mới</label>
                                    <input type="password" class="form-control" id="edit-password" name="password"
                                        placeholder="Để trống nếu không thay đổi" />
                                </div>
                                <div class="col-md-6">
                                    <label for="edit-confirmPassword" class="form-label">Xác nhận mật khẩu
                                        mới</label>
                                    <input type="password" class="form-control" id="edit-confirmPassword"
                                        name="confirmPassword" placeholder="Để trống nếu không thay đổi" />
                                </div>
                            </div>

                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="edit-role" class="form-label">Vai trò <span
                                            class="text-danger">*</span></label>
                                    <select class="form-select" id="edit-role" name="role" required>
                                        <option value="" disabled>Chọn vai trò</option>
                                        <option value="admin">Quản trị viên</option>
                                        <option value="staff">Nhân viên</option>
                                        <option value="customer">Khách hàng</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label for="edit-status" class="form-label">Trạng thái <span
                                            class="text-danger">*</span></label>
                                    <select class="form-select" id="edit-status" name="status" required>
                                        <option value="active">Đang hoạt động</option>
                                        <option value="inactive">Không hoạt động</option>
                                        <option value="locked">Bị khóa</option>
                                    </select>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="edit-address" class="form-label">Địa chỉ</label>
                                <textarea class="form-control" id="edit-address" name="address" rows="2"></textarea>
                            </div>

                            <div class="mb-3">
                                <label for="edit-avatar" class="form-label">Ảnh đại diện</label>
                                <input type="file" class="form-control" id="edit-avatar" name="avatar"
                                    accept="image/*" />
                                <div class="mt-2" id="editAvatarPreview">
                                    <img src="" alt="Preview" class="img-thumbnail" style="max-height: 150px" />
                                    <small class="d-block text-muted">Để trống nếu không muốn thay đổi ảnh đại
                                        diện.</small>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="edit-notes" class="form-label">Ghi chú</label>
                                <textarea class="form-control" id="edit-notes" name="notes" rows="3"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            Hủy
                        </button>
                        <button type="button" class="btn btn-success" id="resetPasswordBtn">
                            <i class="bi bi-key me-1"></i> Đặt lại mật khẩu
                        </button>
                        <button type="button" class="btn btn-primary" id="updateUserBtn">
                            <i class="bi bi-save me-1"></i> Cập nhật
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}
