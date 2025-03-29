// Modal chỉnh sửa danh mục sản phẩm
export const renderEditCategoryModal = () => {
    return `
        <div class="modal fade" id="editCategoryModal" tabindex="-1" aria-labelledby="editCategoryModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title" id="editCategoryModalLabel">
                            Chỉnh sửa thể loại
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editCategoryForm">
                            <!-- Thông báo thành công/lỗi -->
                            <div id="editCategorySuccessMessage" class="alert alert-success mb-3" role="alert"
                                style="display: none"></div>
                            <div id="editCategoryErrorMessage" class="alert alert-danger mb-3" role="alert"
                                style="display: none"></div>
                                
                            <input type="hidden" id="editCategoryId" value="" />
                            <div class="mb-3">
                                <label for="editCategoryName" class="form-label">Tên thể loại <span
                                        class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="editCategoryName" required />
                                <div class="form-text">
                                    Tên thể loại sẽ hiển thị cho người dùng.
                                </div>
                                <div class="invalid-feedback">Vui lòng nhập tên thể loại.</div>
                            </div>
                            <div class="mb-3">
                                <label for="editCategorySlug" class="form-label">Slug <span
                                        class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="editCategorySlug" required />
                                <div class="form-text">
                                    Slug sẽ được sử dụng trong URL (ví dụ: van-hoc,
                                    tam-ly-song).
                                </div>
                                <div class="invalid-feedback">Vui lòng nhập slug cho thể loại.</div>
                            </div>
                            <div class="mb-3">
                                <label for="editCategoryDescription" class="form-label">Mô tả</label>
                                <textarea class="form-control" id="editCategoryDescription" rows="3"></textarea>
                                <div class="form-text">
                                    Mô tả ngắn về thể loại (không bắt buộc).
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label d-block">Trạng thái</label>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="editCategoryStatus"
                                        id="editCategoryStatusActive" value="active" />
                                    <label class="form-check-label" for="editCategoryStatusActive">Hoạt động</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="editCategoryStatus"
                                        id="editCategoryStatusInactive" value="inactive" />
                                    <label class="form-check-label" for="editCategoryStatusInactive">Tạm
                                        khóa</label>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="editCategoryParent" class="form-label">Thể loại cha</label>
                                <select class="form-select" id="editCategoryParent">
                                    <option value="0">Không có</option>
                                    <!-- Danh sách thể loại sẽ được thêm vào đây -->
                                </select>
                                <div class="form-text">
                                    Chọn thể loại cha nếu đây là thể loại con.
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="editCategoryOrder" class="form-label">Thứ tự hiển thị</label>
                                <input type="number" class="form-control" id="editCategoryOrder" min="0" />
                                <div class="form-text">
                                    Thể loại có thứ tự cao hơn sẽ hiển thị trước.
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="editCategoryImage" class="form-label">Hình ảnh</label>
                                <input type="file" class="form-control" id="editCategoryImage" accept="image/*" />
                                <div class="mt-2" id="editCategoryImagePreview">
                                    <img src="" alt="Preview" class="img-thumbnail" style="max-height: 150px" />
                                    <small class="d-block text-muted">Để trống nếu không muốn thay đổi hình ảnh.</small>
                                </div>
                                <div class="form-text">
                                    Chọn hình ảnh đại diện mới cho thể loại (không bắt buộc).
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label d-block">Thông tin thêm</label>
                                <div class="d-flex justify-content-between">
                                    <div>
                                        <span class="text-muted">Ngày tạo:</span>
                                        <span id="editCategoryCreatedAt">-</span>
                                    </div>
                                    <div>
                                        <span class="text-muted">Cập nhật cuối:</span>
                                        <span id="editCategoryUpdatedAt">-</span>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="cancelEditCategoryBtn">
                            Hủy
                        </button>
                        <button type="button" class="btn btn-primary" id="updateCategoryBtn">
                            <i class="bi bi-save me-1"></i> Cập nhật
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
};