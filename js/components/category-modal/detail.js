// Modal xem chi tiết danh mục sản phẩm
import { formatDateTime } from '../../utils/index.js';

export const renderDetailCategoryModal = (category) => {
    return `
        <div class="modal fade" id="viewCategoryModal" tabindex="-1" aria-labelledby="viewCategoryModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title" id="viewCategoryModalLabel">
                            Chi tiết thể loại
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-4 text-center mb-3">
                                <img id="viewCategoryImage" 
                                    src="${category.imageName || 'https://via.placeholder.com/150?text=Không+có+hình'}" 
                                    alt="${category.name}" 
                                    class="img-fluid rounded mb-3" />
                                <div class="d-grid">
                                    <span class="badge ${category.isActive ? 'bg-success' : 'bg-danger'} fs-6 py-2">
                                        ${category.isActive ? 'Đang hoạt động' : 'Đã tạm khóa'}
                                    </span>
                                </div>
                            </div>
                            <div class="col-md-8">
                                <h4 id="viewCategoryName">${category.name}</h4>
                                <p class="text-muted" id="viewCategorySlug">Slug: ${category.slug || 'Chưa có'}</p>
                                
                                <div class="mb-3">
                                    <h6>Thông tin cơ bản</h6>
                                    <ul class="list-group list-group-flush">
                                        <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                                            <span>ID:</span>
                                            <span class="badge bg-secondary" id="viewCategoryId">#${category.id}</span>
                                        </li>
                                        <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                                            <span>Số sách:</span>
                                            <span class="badge bg-primary" id="viewCategoryProductCount">${category.productCount || 0}</span>
                                        </li>
                                        <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                                            <span>Thứ tự hiển thị:</span>
                                            <span id="viewCategoryOrder">${category.displayOrder || 0}</span>
                                        </li>
                                        <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                                            <span>Thể loại cha:</span>
                                            <span id="viewCategoryParent">${category.parentName || 'Không có'}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mb-3 mt-3">
                            <h6>Mô tả</h6>
                            <div class="card">
                                <div class="card-body" id="viewCategoryDescription">
                                    ${category.description || '<em class="text-muted">Không có mô tả</em>'}
                                </div>
                            </div>
                        </div>
                        
                        <div class="row mt-3">
                            <div class="col-md-6">
                                <div class="mb-2">
                                    <small class="text-muted">Ngày tạo:</small>
                                    <p class="mb-0" id="viewCategoryCreatedAt">${formatDateTime(category.createdAt)}</p>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-2">
                                    <small class="text-muted">Cập nhật cuối:</small>
                                    <p class="mb-0" id="viewCategoryUpdatedAt">${category.updatedAt ? formatDateTime(category.updatedAt) : 'Chưa cập nhật'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            Đóng
                        </button>
                        <button type="button" class="btn btn-primary" id="editFromViewBtn" data-category-id="${category.id}">
                            <i class="bi bi-pencil me-1"></i> Chỉnh sửa
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
};