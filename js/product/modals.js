// ==========================================================
// modals.js - Module quản lý các modal
// ==========================================================

import { formatCurrency, formatDateTime, badgeStockMap } from './utils.js';

export const addProductModal = () => {
    // Kiểm tra nếu modal đã tồn tại, xóa đi để tạo mới
    const existingModal = document.getElementById('addProductModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Render HTML modal
    const modalHTML = `
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

    // Tạo một phần tử div và đặt HTML modal vào đó
    // Tạo một phần tử div và đặt HTML modal vào đó
    const modalElement = document.createElement('div');
    modalElement.innerHTML = modalHTML;

    // Thêm modal vào body
    document.body.appendChild(modalElement.firstElementChild);

    // Khởi tạo và hiển thị modal
    const modal = new bootstrap.Modal(document.getElementById('addProductModal'));
    modal.show();
    return modal;
}


/**
 * Modal hiển thị chi tiết sản phẩm
 * @param productDetails
 * @returns {Modal}
 */
export const productDetailModal = (productDetails) => {
    // Kiểm tra nếu modal đã tồn tại, xóa đi để tạo mới
    const existingModal = document.getElementById('viewProductModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Render HTML modal
    const modalHTML = `
     <div class="modal fade" id="viewProductModal" tabindex="-1" aria-labelledby="viewProductModalLabel" aria-hidden="true">
         <div class="modal-dialog modal-lg">
             <div class="modal-content">
                 <div class="modal-header bg-primary text-white">
                     <h5 class="modal-title" id="viewProductModalLabel">
                         Chi tiết sản phẩm
                     </h5>
                     <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                 </div>
                 <div class="modal-body">
                     <div class="row">
                         <div class="col-md-4 text-center">
                             <img id="viewProductImage" src="${productDetails.imageName || 'https://via.placeholder.com/300x300'}" 
                                 alt="${productDetails.name}" class="img-fluid rounded mb-3" style="max-height: 200px" />
                             <div class="mb-3 p-2">
                                 <span class="badge bg-primary" id="viewProductCategory">${productDetails.categoryName}</span>
                             </div>
                             <div class="d-flex align-items-center justify-content-center gap-3">
                                 <h5 class="mb-0" id="viewProductPrice">Giá: ${formatCurrency(productDetails.discountedPrice)}</h5>
                                 ${productDetails.discountedPrice !== productDetails.price
        ? `<small class="text-muted text-decoration-line-through badge bg-primary text-white" id="viewProductOriginalPrice">${formatCurrency(productDetails.price)}</small>`
        : ""
    }
                             </div>
                         </div>
                         <div class="col-md-8">
                             <h4 id="viewProductName" class="mb-3">${productDetails.name}</h4>
                             <div class="row mb-2">
                                 <div class="col-md-6">
                                     <p class="mb-1"><strong>ID:</strong> <span id="viewProductId">${productDetails.id}</span></p>
                                     <p class="mb-1"><strong>Tác giả:</strong> <span id="viewProductAuthor">${productDetails.author}</span></p>
                                     <p class="mb-1"><strong>Nhà xuất bản:</strong> <span id="viewProductPublisher">${productDetails.publisher}</span></p>
                                     <p class="mb-1"><strong>Năm xuất bản:</strong> <span id="viewProductYear">${productDetails.yearPublishing}</span></p>
                                     <p class="mb-1"><strong>Thể loại:</strong> <span id="viewCategory">${productDetails.categoryName}</span></p>
                                 </div>
                                 <div class="col-md-6">
                                     <p class="mb-1"><strong>Số trang:</strong> <span id="viewProductPages">${productDetails.pages || "N/A"}</span></p>
                                     <p class="mb-1"><strong>Tồn kho:</strong> <span id="viewProductQuantity">${productDetails.quantity}</span></p>
                                     <p class="mb-1"><strong>Lượt mua:</strong> <span id="viewProductTotalBuy">${productDetails.totalBuy}</span></p>
                                     <p class="mb-1"><strong>Trạng thái:</strong> <span id="viewProductStatus">${badgeStockMap[productDetails.stockStatus] || "Không xác định"}</span></p>
                                 </div>
                             </div>
                             <hr />
                             <div class="mb-3">
                                 <h5>Mô tả sản phẩm</h5>
                                 <div id="viewProductDescription" class="overflow-auto" style="max-height: 200px">${productDetails.description}</div>
                             </div>
                             <div class="row mb-2">
                                 <div class="col-md-6">
                                     <p class="mb-1"><strong>Khuyến mãi:</strong> <span id="viewProductDiscount">${productDetails.discount}%</span></p>
                                     <p class="mb-1"><strong>Cho phép giao dịch:</strong> 
                                         <span id="viewProductShop">${productDetails.shop === 0 ?
        `<span class="badge bg-success">Có</span>` :
        `<span class="badge bg-danger">Không</span>`
    }
                                         </span>
                                     </p>
                                 </div>
                                 <div class="col-md-6">
                                     <p class="mb-1"><strong>Bắt đầu KM:</strong> 
                                         <span id="viewProductStartsAt">${productDetails.startsAt ? formatDateTime(productDetails.startsAt) : "Không có"}</span>
                                     </p>
                                     <p class="mb-1"><strong>Kết thúc KM:</strong> 
                                         <span id="viewProductEndsAt">${productDetails.endsAt ? formatDateTime(productDetails.endsAt) : "Không có"}</span>
                                     </p>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
                 <div class="modal-footer">
                     <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                     <button type="button" class="btn btn-primary" id="editFromViewBtn">
                         <i class="bi bi-pencil me-1"></i> Chỉnh sửa
                     </button>
                 </div>
             </div>
         </div>
     </div>
 `;
    // Tạo một phần tử div và đặt HTML modal vào đó
    const modalElement = document.createElement('div');
    modalElement.innerHTML = modalHTML;

    // Thêm modal vào body
    document.body.appendChild(modalElement.firstElementChild);

    // Khởi tạo và hiển thị modal
    const modal = new bootstrap.Modal(document.getElementById('viewProductModal'));
    modal.show();

    // Xử lý nút edit
    // document.querySelector('#viewProductModal [data-action="edit"]').addEventListener('click', function () {
    //     const productId = this.getAttribute('data-product-id');
    //     modal.hide();
    //     console.log('Edit product:', productId);
    //     // Thêm code để chỉnh sửa sản phẩm ở đây nếu cần
    // });

    return modal;
};

export const editProductModal = (productDetails) => {

}