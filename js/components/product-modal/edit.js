// Render HTML modal
const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
};

export const renderEditProduct = (productDetails) => {
    return `
        <div class="modal fade" id="editProductModal" tabindex="-1" aria-labelledby="editProductModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title" id="editProductModalLabel">
                            Chỉnh sửa sản phẩm
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editProductForm" enctype="multipart/form-data">
                            <input type="hidden" id="editProductId" name="id" value="${productDetails.id}" />
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="editProductName" class="form-label">Tên sách <span
                                            class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="editProductName" name="name"
                                        value="${productDetails.name}" required />
                                </div>
                                <div class="col-md-6">
                                    <label for="product-category" class="form-label">Thể loại <span
                                            class="text-danger">*</span></label>
                                    <select class="form-select" id="product-category" name="categoryId" value=${productDetails.categoryId} required>
                                        <option value="" disabled>Chọn một thể loại...</option>
                                        <!-- Danh sách thể loại sẽ được tải động -->
                                    </select>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="editProductPrice" class="form-label">Giá gốc <span
                                            class="text-danger">*</span></label>
                                    <div class="input-group">
                                        <input type="number" class="form-control" id="editProductPrice" name="price"
                                            min="0" step="500" value="${productDetails.price}" required />
                                        <span class="input-group-text">₫</span>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <label for="editProductDiscount" class="form-label">Khuyến mãi <span
                                            class="text-danger">*</span></label>
                                    <div class="input-group">
                                        <input type="number" class="form-control" id="editProductDiscount"
                                            name="discount" min="0" max="100" value="${productDetails.discount}" required />
                                        <span class="input-group-text">%</span>
                                    </div>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="editProductQuantity" class="form-label">Tồn kho <span
                                            class="text-danger">*</span></label>
                                    <input type="number" class="form-control" id="editProductQuantity"
                                        name="quantity" min="0" value="${productDetails.quantity}" required />
                                </div>
                                <div class="col-md-6">
                                    <label for="editProductTotalBuy" class="form-label">Lượt mua <span
                                            class="text-danger">*</span></label>
                                    <input type="number" class="form-control" id="editProductTotalBuy"
                                        name="totalBuy" min="0" value="${productDetails.totalBuy}" required />
                                </div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="editProductAuthor" class="form-label">Tác giả <span
                                            class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="editProductAuthor" name="author"
                                        value="${productDetails.author}" required />
                                </div>
                                <div class="col-md-6">
                                    <label for="editProductPages" class="form-label">Số trang <span
                                            class="text-danger">*</span></label>
                                    <input type="number" class="form-control" id="editProductPages" name="pages"
                                        min="1" value="${productDetails.pages}" required />
                                </div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="editProductPublisher" class="form-label">Nhà xuất bản <span
                                            class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="editProductPublisher"
                                        name="publisher" value="${productDetails.publisher}" required />
                                </div>
                                <div class="col-md-6">
                                    <label for="editProductYearPublishing" class="form-label">Năm xuất bản <span
                                            class="text-danger">*</span></label>
                                    <input type="number" class="form-control" id="editProductYearPublishing"
                                        name="yearPublishing" min="1901" max="2099" value="${productDetails.yearPublishing}" required />
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="editProductDescription" class="form-label">Mô tả sách</label>
                                <div id="edit-editor-container">
                                    <div id="edit-froala-editor"></div>
                                    <input type="hidden" id="editProductDescription" name="description" />
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="product-imageName" class="form-label">Hình sản phẩm</label>
                                <input type="file" class="form-control" id="product-imageName" name="image"
                                    accept="image/*" />
                                <div class="mt-2" id="editImagePreview">
                                    <img src="${productDetails.imageName || 'https://via.placeholder.com/300x300'}" alt="Preview" class="img-thumbnail" style="max-height: 150px" />
                                    <small class="d-block text-muted">Để trống nếu không muốn thay đổi hình
                                        ảnh.</small>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label d-block">Cho phép giao dịch?
                                        <span class="text-danger">*</span></label>
                                    <div class="form-check d-inline-block me-4">
                                        <input class="form-check-input" type="radio" name="shop"
                                            id="editProductShopYes" value="1" ${productDetails.shop === 0 ? 'checked' : ''} required />
                                        <label class="form-check-label" for="editProductShopYes">Có</label>
                                    </div>
                                    <div class="form-check d-inline-block">
                                        <input class="form-check-input" type="radio" name="shop"
                                            id="editProductShopNo" value="0" ${productDetails.shop === 1 ? 'checked' : ''} required />
                                        <label class="form-check-label" for="editProductShopNo">Không</label>
                                    </div>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="editProductStartsAt" class="form-label">Ngày bắt đầu khuyến
                                        mãi</label>
                                    <input type="datetime-local" class="form-control" id="editProductStartsAt"
                                        name="startsAt" ${productDetails.startsAt ? `value="${formatDateForInput(productDetails.startsAt)}"` : ''} />
                                </div>
                                <div class="col-md-6">
                                    <label for="editProductEndsAt" class="form-label">Ngày kết thúc khuyến
                                        mãi</label>
                                    <input type="datetime-local" class="form-control" id="editProductEndsAt"
                                        name="endsAt" ${productDetails.endsAt ? `value="${formatDateForInput(productDetails.endsAt)}"` : ''} />
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            Hủy
                        </button>
                        <button type="button" class="btn btn-primary" id="updateProductBtn">
                            <i class="bi bi-save me-1"></i> Cập nhật
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}