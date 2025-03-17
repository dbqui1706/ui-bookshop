import { formatCurrency, formatDateTime, badgeStockMap } from '../utils.js';

export const renderDetailProduct = (productDetails) => {
    return `
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
}