export const renderAddModal = () => {
    return `
        <div class="modal fade" id="addProductModal" tabindex="-1" aria-labelledby="addProductModalLabel"
             aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title" id="addProductModalLabel">
                            Thêm sản phẩm mới
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                                aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="addProductForm" method="POST"
                              action="/admin/productManager/create"
                              enctype="multipart/form-data">
                            <!-- Thông báo thành công/lỗi -->
                            <div id="successMessage" class="alert alert-success mb-3" role="alert"
                                 style="display: none"></div>
                            <div id="errorMessage" class="alert alert-danger mb-3" role="alert"
                                 style="display: none"></div>
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="product-name" class="form-label">Tên sách <span
                                            class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="product-name" name="name" required/>
                                    <div class="invalid-feedback"></div>
                                </div>
                                <div class="col-md-6">
                                    <label for="product-category" class="form-label">Thể loại <span class="text-danger">*</span></label>
                                    <select class="form-select" id="product-category" name="category" required>
                                        <option value="" selected disabled>
                                            Chọn một thể loại...
                                        </option>
                                        <!-- Danh sách thể loại sẽ được tải động -->
                                    </select>
                                    <div class="invalid-feedback"></div>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="product-price" class="form-label">Giá gốc <span
                                            class="text-danger">*</span></label>
                                    <div class="input-group">
                                        <input type="number" class="form-control" id="product-price" name="price"
                                               min="0" step="500" required/>
                                        <span class="input-group-text">₫</span>
                                        <div class="invalid-feedback"></div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <label for="product-discount" class="form-label">Khuyến mãi <span
                                            class="text-danger">*</span></label>
                                    <div class="input-group">
                                        <input type="number" class="form-control" id="product-discount" name="discount"
                                               min="0" max="100" value="0" required/>
                                        <span class="input-group-text">%</span>
                                        <div class="invalid-feedback"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="product-quantity" class="form-label">Tồn kho <span
                                            class="text-danger">*</span></label>
                                    <input type="number" class="form-control" id="product-quantity" name="quantity"
                                           min="0" required/>
                                    <div class="invalid-feedback"></div>
                                </div>
                                <div class="col-md-6">
                                    <label for="product-totalBuy" class="form-label">Lượt mua <span class="text-danger">*</span></label>
                                    <input type="number" class="form-control" id="product-totalBuy" name="totalBuy"
                                           min="0" value="0" required/>
                                    <div class="invalid-feedback"></div>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="product-author" class="form-label">Tác giả <span
                                            class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="product-author" name="author" required/>
                                    <div class="invalid-feedback"></div>
                                </div>
                                <div class="col-md-6">
                                    <label for="product-pages" class="form-label">Số trang <span
                                            class="text-danger">*</span></label>
                                    <input type="number" class="form-control" id="product-pages" name="pages" min="1"
                                           required/>
                                    <div class="invalid-feedback"></div>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="product-publisher" class="form-label">Nhà xuất bản <span
                                            class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="product-publisher" name="publisher"
                                           required/>
                                    <div class="invalid-feedback"></div>
                                </div>
                                <div class="col-md-6">
                                    <label for="product-yearPublishing" class="form-label">Năm xuất bản <span
                                            class="text-danger">*</span></label>
                                    <input type="number" class="form-control" id="product-yearPublishing"
                                           name="yearPublishing" min="1901" max="2099" required/>
                                    <div class="invalid-feedback"></div>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="product-startsAt" class="form-label">Ngày bắt đầu khuyến mãi</label>
                                    <input type="datetime-local" class="form-control" id="product-startsAt"
                                           name="startsAt"/>
                                    <div class="invalid-feedback"></div>
                                </div>
                                <div class="col-md-6">
                                    <label for="product-endsAt" class="form-label">Ngày kết thúc khuyến mãi</label>
                                    <input type="datetime-local" class="form-control" id="product-endsAt"
                                           name="endsAt"/>
                                    <div class="invalid-feedback"></div>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Mô tả sách</label>
                                <div id="editor-container">
                                    <div id="froala-editor"></div>
                                </div>
                                <div class="invalid-feedback"></div>
                            </div>
                            <div class="mb-3">
                                <label for="product-imageName" class="form-label">Hình sản phẩm</label>
                                <input type="file" class="form-control" id="product-imageName" name="image"
                                       accept="image/*"/>
                                <div class="mt-2" id="imagePreview" style="display: none">
                                    <img src="" alt="Preview" class="img-thumbnail" style="max-height: 200px"/>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label d-block">Cho phép giao dịch?
                                        <span class="text-danger">*</span></label>
                                    <div class="form-check d-inline-block me-4">
                                        <input class="form-check-input" type="radio" name="shop" id="product-shop-yes"
                                               value="1" checked required/>
                                        <label class="form-check-label" for="product-shop-yes">Có</label>
                                    </div>
                                    <div class="form-check d-inline-block">
                                        <input class="form-check-input" type="radio" name="shop" id="product-shop-no"
                                               value="0" required/>
                                        <label class="form-check-label" for="product-shop-no">Không</label>
                                    </div>
                                    <div class="invalid-feedback"></div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            Hủy
                        </button>
                        <button type="button" class="btn btn-warning" id="resetFormBtn">
                            <i class="bi bi-arrow-counterclockwise me-1"></i> Mặc định
                        </button>
                        <button type="button" class="btn btn-primary" id="saveProductBtn">
                            <i class="bi bi-save me-1"></i> Thêm sản phẩm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}