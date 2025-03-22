// Modal xác nhận xóa danh mục sản phẩm
export const renderDeleteCategoryModal = (category) => {
    return `
        <div class="modal fade" id="deleteCategoryModal" tabindex="-1" aria-labelledby="deleteCategoryModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title" id="deleteCategoryModalLabel">
                            Xác nhận xóa thể loại
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>
                            Bạn có chắc chắn muốn xóa thể loại
                            <strong id="deleteCategoryName">${category.name}</strong>?
                        </p>
                        <div class="alert alert-warning">
                            <i class="bi bi-exclamation-triangle me-2"></i> Cảnh báo: Thao tác này không thể hoàn tác.
                        </div>
                        <div class="alert alert-danger" id="deleteCategoryWarning" ${category.productCount > 0 ? '' : 'style="display: none"'}>
                            <p><i class="bi bi-x-circle me-2"></i> <strong>Không thể xóa thể loại này!</strong></p>
                            <p class="mb-0">Thể loại này đang có <strong>${category.productCount}</strong> sản phẩm. Vui lòng xóa hoặc chuyển các sản phẩm sang thể loại khác trước.</p>
                        </div>
                        <div class="form-check mt-3" id="deleteConfirmCheck" ${category.productCount > 0 ? 'style="display: none"' : ''}>
                            <input class="form-check-input" type="checkbox" id="confirmDeleteCheck">
                            <label class="form-check-label" for="confirmDeleteCheck">
                                Tôi hiểu rằng thao tác này không thể hoàn tác và xác nhận muốn xóa thể loại này.
                            </label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="cancelDeleteCategoryBtn">
                            Hủy
                        </button>
                        <button type="button" class="btn btn-danger" id="confirmDeleteCategoryBtn" 
                            ${category.productCount > 0 ? 'disabled' : ''}>
                            <i class="bi bi-trash me-1"></i> Xóa thể loại
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
};