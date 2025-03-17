export const renderDeleteProduct = (productDetails) => {
    return `
        <div class="modal fade" id="deleteProductModal" tabindex="-1" aria-labelledby="deleteProductModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title" id="deleteProductModalLabel">
                            Xác nhận xóa sản phẩm
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>
                            Bạn có chắc chắn muốn xóa sản phẩm
                            <strong id="deleteProductName">${productDetails.name}</strong>?
                        </p>
                        <p class="text-danger">
                            Lưu ý: Hành động này không thể hoàn tác.
                        </p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            Hủy
                        </button>
                        <button type="button" class="btn btn-danger" id="confirmDeleteBtn">
                            <i class="bi bi-trash me-1"></i> Xóa
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}