// Modal thêm danh mục sản phẩm
export const renderAddCategoryModal = () => {
    return `
        <div class="modal fade" id="addCategoryModal" tabindex="-1" aria-labelledby="addCategoryModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title" id="addCategoryModalLabel">
                            Thêm thể loại mới
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="addCategoryForm">
                            <!-- Thông báo thành công/lỗi -->
                            <div id="categorySuccessMessage" class="alert alert-success mb-3" role="alert"
                                style="display: none"></div>
                            <div id="categoryErrorMessage" class="alert alert-danger mb-3" role="alert"
                                style="display: none"></div>
                            
                            <div class="mb-3">
                                <label for="categoryName" class="form-label">Tên thể loại <span
                                        class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="categoryName" required />
                                <div class="form-text">
                                    Tên thể loại sẽ hiển thị cho người dùng.
                                </div>
                                <div class="invalid-feedback">Vui lòng nhập tên thể loại.</div>
                            </div>
                            <div class="mb-3">
                                <label for="categorySlug" class="form-label">Slug <span
                                        class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="categorySlug" required />
                                <div class="form-text">
                                    Slug sẽ được sử dụng trong URL (ví dụ: van-hoc,
                                    tam-ly-song).
                                </div>
                                <div class="invalid-feedback">Vui lòng nhập slug cho thể loại.</div>
                            </div>
                            <div class="mb-3">
                                <label for="categoryDescription" class="form-label">Mô tả</label>
                                <textarea class="form-control" id="categoryDescription" rows="3"></textarea>
                                <div class="form-text">
                                    Mô tả ngắn về thể loại (không bắt buộc).
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label d-block">Trạng thái</label>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="categoryStatus"
                                        id="categoryStatusActive" value="active" checked />
                                    <label class="form-check-label" for="categoryStatusActive">Hoạt động</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="categoryStatus"
                                        id="categoryStatusInactive" value="inactive" />
                                    <label class="form-check-label" for="categoryStatusInactive">Tạm khóa</label>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="categoryParent" class="form-label">Thể loại cha</label>
                                <select class="form-select" id="categoryParent">
                                    <option value="0" selected>Không có</option>
                                    <!-- Danh sách thể loại sẽ được thêm vào đây -->
                                </select>
                                <div class="form-text">
                                    Chọn thể loại cha nếu đây là thể loại con.
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="categoryOrder" class="form-label">Thứ tự hiển thị</label>
                                <input type="number" class="form-control" id="categoryOrder" min="0" value="0" />
                                <div class="form-text">
                                    Thể loại có thứ tự cao hơn sẽ hiển thị trước.
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="categoryImage" class="form-label">Hình ảnh</label>
                                <input type="file" class="form-control" id="categoryImage" accept="image/*" />
                                <div class="mt-2" id="categoryImagePreview" style="display: none">
                                    <img src="" alt="Preview" class="img-thumbnail" style="max-height: 150px" />
                                </div>
                                <div class="form-text">
                                    Chọn hình ảnh đại diện cho thể loại (không bắt buộc).
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="cancelAddCategoryBtn">
                            Hủy
                        </button>
                        <button type="button" class="btn btn-warning" id="resetCategoryFormBtn">
                            <i class="bi bi-arrow-counterclockwise me-1"></i> Mặc định
                        </button>
                        <button type="button" class="btn btn-primary" id="saveCategoryBtn">
                            <i class="bi bi-save me-1"></i> Lưu thể loại
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
};