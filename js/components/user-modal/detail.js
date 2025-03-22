export const userDetailModalHtml = (userDetails) => {
    return `
        <div class="modal fade" id="viewUserModal" tabindex="-1" aria-labelledby="viewUserModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header bg-primary text-white">
                <h5 class="modal-title" id="viewUserModalLabel">
                    Thông tin người dùng
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-md-4 text-center mb-4">
                        <img id="viewUserAvatar" src="https://via.placeholder.com/150" alt="Avatar" class="img-fluid rounded-circle mb-3" style="width: 150px; height: 150px; object-fit: cover" />
                        <div id="viewUserStatus" class="badge bg-success mb-2">
                            Đang hoạt động
                        </div>
                        <h5 id="viewUserName" class="mb-1">Nguyễn Văn Admin</h5>
                        <div id="viewUserRole" class="badge bg-danger mb-3">
                            Quản trị viên
                        </div>
                        <div class="d-grid">
                            <button class="btn btn-outline-primary btn-sm" id="editFromViewBtn" data-bs-toggle="modal" data-bs-target="#editUserModal">
                                <i class="bi bi-pencil me-1"></i> Chỉnh sửa
                            </button>
                        </div>
                    </div>
                    <div class="col-md-8">
                        <div class="card mb-3">
                            <div class="card-header">
                                <h6 class="mb-0">Thông tin cá nhân</h6>
                            </div>
                            <div class="card-body">
                                <div class="row mb-2">
                                    <div class="col-md-4 fw-bold">ID:</div>
                                    <div class="col-md-8" id="viewUserId">#U001</div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-md-4 fw-bold">Email:</div>
                                    <div class="col-md-8" id="viewUserEmail">
                                        admin@example.com
                                    </div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-md-4 fw-bold">Số điện thoại:</div>
                                    <div class="col-md-8" id="viewUserPhone">
                                        0123456789
                                    </div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-md-4 fw-bold">Địa chỉ:</div>
                                    <div class="col-md-8" id="viewUserAddress">
                                        123 Đường Quản Trị, Quận 1, TP.HCM
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="card mb-3">
                            <div class="card-header">
                                <h6 class="mb-0">Thông tin tài khoản</h6>
                            </div>
                            <div class="card-body">
                                <div class="row mb-2">
                                    <div class="col-md-4 fw-bold">Ngày tạo:</div>
                                    <div class="col-md-8" id="viewUserCreated">
                                        01/01/2025
                                    </div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-md-4 fw-bold">Đăng nhập cuối:</div>
                                    <div class="col-md-8" id="viewUserLastLogin">
                                        14/03/2025, 08:45
                                    </div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-md-4 fw-bold">Số đơn hàng:</div>
                                    <div class="col-md-8" id="viewUserOrders">15</div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-md-4 fw-bold">Tổng chi tiêu:</div>
                                    <div class="col-md-8" id="viewUserSpent">
                                        12,500,000đ
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <h6 class="mb-0">Ghi chú</h6>
                            </div>
                            <div class="card-body">
                                <p id="viewUserNotes" class="mb-0">
                                    Quản trị viên hệ thống chính với quyền hạn cao nhất.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                    Đóng
                </button>
            </div>
        </div>
    </div>
</div>
    `
}
