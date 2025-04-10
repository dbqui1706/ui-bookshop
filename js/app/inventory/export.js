/**
 * Trang quản lý xuất kho
 */

// Dữ liệu mẫu - Danh sách phiếu xuất kho
const exportList = [
    {
        id: 'XK00132',
        date: '08/04/2025',
        reason: 'Bán hàng',
        productCount: 2,
        totalQuantity: 13,
        createdBy: 'Nguyễn Văn A',
        notes: 'Xuất hàng cho đơn hàng của khách hàng Nguyễn Văn C',
        reference: 'DH00123'
    },
    {
        id: 'XK00131',
        date: '07/04/2025',
        reason: 'Bán hàng',
        productCount: 3,
        totalQuantity: 10,
        createdBy: 'Trần Thị B',
        notes: 'Xuất hàng cho đơn hàng của khách hàng Trần Văn D',
        reference: 'DH00122'
    },
    {
        id: 'XK00130',
        date: '06/04/2025',
        reason: 'Hư hỏng',
        productCount: 1,
        totalQuantity: 5,
        createdBy: 'Nguyễn Văn A',
        notes: 'Sách bị ngấm nước do rò rỉ ống nước',
        reference: null
    },
    {
        id: 'XK00129',
        date: '05/04/2025',
        reason: 'Trả nhà cung cấp',
        productCount: 2,
        totalQuantity: 15,
        createdBy: 'Lê Thị C',
        notes: 'Trả sách bị lỗi in cho NXB Trẻ',
        reference: 'NCC002'
    },
    {
        id: 'XK00128',
        date: '04/04/2025',
        reason: 'Bán hàng',
        productCount: 4,
        totalQuantity: 12,
        createdBy: 'Nguyễn Văn A',
        notes: 'Xuất hàng cho đơn hàng của khách hàng Lê Văn E',
        reference: 'DH00121'
    },
    {
        id: 'XK00127',
        date: '03/04/2025',
        reason: 'Hết hạn',
        productCount: 1,
        totalQuantity: 8,
        createdBy: 'Trần Thị B',
        notes: 'Xuất sách tạp chí hết hạn',
        reference: null
    },
    {
        id: 'XK00126',
        date: '02/04/2025',
        reason: 'Bán hàng',
        productCount: 3,
        totalQuantity: 9,
        createdBy: 'Lê Thị C',
        notes: 'Xuất hàng cho đơn hàng của khách hàng Phạm Thị F',
        reference: 'DH00120'
    },
    {
        id: 'XK00125',
        date: '01/04/2025',
        reason: 'Bán hàng',
        productCount: 2,
        totalQuantity: 7,
        createdBy: 'Nguyễn Văn A',
        notes: 'Xuất hàng cho đơn hàng của khách hàng Nguyễn Thị G',
        reference: 'DH00119'
    },
    {
        id: 'XK00124',
        date: '31/03/2025',
        reason: 'Trả nhà cung cấp',
        productCount: 1,
        totalQuantity: 10,
        createdBy: 'Trần Thị B',
        notes: 'Trả sách bị lỗi in cho NXB Kim Đồng',
        reference: 'NCC001'
    },
    {
        id: 'XK00123',
        date: '30/03/2025',
        reason: 'Bán hàng',
        productCount: 3,
        totalQuantity: 11,
        createdBy: 'Lê Thị C',
        notes: 'Xuất hàng cho đơn hàng của khách hàng Hoàng Văn H',
        reference: 'DH00118'
    }
];

// Dữ liệu mẫu - Chi tiết phiếu xuất kho
const exportDetail = {
    'XK00132': {
        id: 'XK00132',
        date: '08/04/2025 14:30',
        reason: 'Bán hàng',
        createdBy: 'Nguyễn Văn A',
        createdAt: '08/04/2025 14:30',
        notes: 'Xuất hàng cho đơn hàng của khách hàng Nguyễn Văn C',
        reference: 'DH00123',
        referenceType: 'order',
        totalQuantity: 13,
        totalValue: 350000,
        items: [
            {
                product: 'Đắc Nhân Tâm',
                quantity: 8,
                price: 150000,
                subtotal: 1200000
            },
            {
                product: 'Nhà Giả Kim',
                quantity: 5,
                price: 130000,
                subtotal: 650000
            }
        ]
    }
};

// Dữ liệu mẫu - Sản phẩm trong kho
const inventoryProducts = {
    '1': {
        id: 1,
        name: 'Đắc Nhân Tâm - Dale Carnegie',
        stock: 125,
        price: 150000
    },
    '2': {
        id: 2,
        name: 'Nhà Giả Kim - Paulo Coelho',
        stock: 85,
        price: 130000
    },
    '3': {
        id: 3,
        name: 'Tư Duy Phản Biện - Harvey Mindset',
        stock: 18,
        price: 120000
    },
    '4': {
        id: 4,
        name: 'Điều Kỳ Diệu Của Thói Quen - Charles Duhigg',
        stock: 0,
        price: 140000
    },
    '5': {
        id: 5,
        name: 'Khéo Ăn Nói Sẽ Có Được Thiên Hạ - Trác Nhã',
        stock: 10,
        price: 110000
    }
};

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', function() {
    // Tải dữ liệu bảng phiếu xuất kho
    loadExportTable();
    
    // Thiết lập ngày hiện tại cho form xuất kho
    document.getElementById('exportDate').valueAsDate = new Date();
    
    // Khởi tạo sự kiện
    initEvents();
});

// Tải dữ liệu bảng phiếu xuất kho
function loadExportTable() {
    const tableBody = document.querySelector('#exportTable tbody');
    tableBody.innerHTML = '';
    
    exportList.forEach(item => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.date}</td>
            <td>${item.reason}</td>
            <td>${item.productCount}</td>
            <td>${item.totalQuantity}</td>
            <td>${item.createdBy}</td>
            <td>${item.notes}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary view-export" data-id="${item.id}" title="Xem chi tiết">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-secondary" title="In phiếu">
                    <i class="bi bi-printer"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" title="Xóa">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Gắn sự kiện cho nút xem chi tiết
    document.querySelectorAll('.view-export').forEach(button => {
        button.addEventListener('click', function() {
            const exportId = this.getAttribute('data-id');
            showExportDetail(exportId);
        });
    });
}

// Khởi tạo các sự kiện
function initEvents() {
    // Sự kiện khi chọn lý do xuất kho
    document.getElementById('exportReason').addEventListener('change', function() {
        const reason = this.value;
        
        // Hiển thị/ẩn các trường tham chiếu tương ứng
        if (reason === 'order') {
            document.getElementById('orderReferenceRow').style.display = '';
            document.getElementById('supplierReferenceRow').style.display = 'none';
        } else if (reason === 'return') {
            document.getElementById('orderReferenceRow').style.display = 'none';
            document.getElementById('supplierReferenceRow').style.display = '';
        } else {
            document.getElementById('orderReferenceRow').style.display = 'none';
            document.getElementById('supplierReferenceRow').style.display = 'none';
        }
    });
    
    // Sự kiện thêm dòng sản phẩm
    document.getElementById('addExportRow').addEventListener('click', function() {
        addProductRow();
    });
    
    // Sự kiện lưu phiếu xuất
    document.getElementById('saveExport').addEventListener('click', function() {
        saveExport();
    });
    
    // Sự kiện khi thay đổi sản phẩm
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('product-select')) {
            updateProductStock(e.target.getAttribute('data-row'));
        }
        
        if (e.target.classList.contains('quantity-input')) {
            validateQuantity(e.target);
            updateRowValue(e.target.getAttribute('data-row'));
            updateTotalAmount();
        }
    });
    
    // Sự kiện khi xóa dòng sản phẩm
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-row') || 
            (e.target.parentElement && e.target.parentElement.classList.contains('remove-row'))) {
            const button = e.target.classList.contains('remove-row') ? e.target : e.target.parentElement;
            const rowId = button.getAttribute('data-row');
            removeProductRow(rowId);
        }
    });
}

// Cập nhật thông tin tồn kho khi chọn sản phẩm
function updateProductStock(rowId) {
    const select = document.querySelector(`.product-select[data-row="${rowId}"]`);
    const productId = select.value;
    
    if (productId) {
        const stockDisplay = document.querySelector(`.stock-display[data-row="${rowId}"]`);
        const quantityInput = document.querySelector(`.quantity-input[data-row="${rowId}"]`);
        
        // Lấy thông tin tồn kho từ dữ liệu mẫu
        const stock = inventoryProducts[productId].stock;
        const price = inventoryProducts[productId].price;
        
        stockDisplay.value = stock;
        quantityInput.max = stock;
        
        // Nếu tồn kho = 0, disabled ô số lượng
        if (stock === 0) {
            quantityInput.disabled = true;
            quantityInput.value = 0;
        } else {
            quantityInput.disabled = false;
            quantityInput.value = 1;
        }
        
        updateRowValue(rowId);
        updateTotalAmount();
    }
}

// Validate số lượng xuất không vượt quá tồn kho
function validateQuantity(input) {
    const max = parseInt(input.max);
    const value = parseInt(input.value);
    
    if (value > max) {
        input.value = max;
        Swal.fire({
            title: 'Cảnh báo',
            text: 'Số lượng xuất không thể vượt quá số lượng tồn kho',
            icon: 'warning',
            confirmButtonText: 'Đồng ý'
        });
    }
}

// Cập nhật giá trị của dòng
function updateRowValue(rowId) {
    const select = document.querySelector(`.product-select[data-row="${rowId}"]`);
    const productId = select.value;
    
    if (productId) {
        const quantityInput = document.querySelector(`.quantity-input[data-row="${rowId}"]`);
        const subtotalInput = document.querySelector(`.subtotal[data-row="${rowId}"]`);
        
        const quantity = parseInt(quantityInput.value) || 0;
        const price = inventoryProducts[productId].price;
        const subtotal = quantity * price;
        
        subtotalInput.value = subtotal.toLocaleString();
    }
}

// Cập nhật tổng tiền
function updateTotalAmount() {
    const rows = document.querySelectorAll('#productExportTable tbody tr');
    let totalAmount = 0;
    let totalQuantity = 0;
    let totalProducts = 0;
    
    rows.forEach(row => {
        const rowId = row.id.replace('exportRow', '');
        const selectElem = row.querySelector(`.product-select[data-row="${rowId}"]`);
        
        if (selectElem.value) {
            totalProducts++;
            
            const quantityInput = row.querySelector(`.quantity-input[data-row="${rowId}"]`);
            const quantity = parseInt(quantityInput.value) || 0;
            
            if (quantity > 0) {
                const productId = selectElem.value;
                const price = inventoryProducts[productId].price;
                
                totalAmount += quantity * price;
                totalQuantity += quantity;
            }
        }
    });
    
    document.getElementById('totalExportAmount').textContent = totalAmount.toLocaleString() + ' ₫';
    document.getElementById('totalExportQuantity').textContent = totalQuantity;
    document.getElementById('totalExportProducts').textContent = totalProducts;
}

// Thêm dòng sản phẩm mới
function addProductRow() {
    const tbody = document.querySelector('#productExportTable tbody');
    const rowCount = tbody.children.length;
    const newRowId = rowCount + 1;
    
    const newRow = document.createElement('tr');
    newRow.id = `exportRow${newRowId}`;
    
    newRow.innerHTML = `
        <td>
            <select class="form-select product-select" data-row="${newRowId}">
                <option value="">-- Chọn sản phẩm --</option>
                <option value="1">Đắc Nhân Tâm - Dale Carnegie</option>
                <option value="2">Nhà Giả Kim - Paulo Coelho</option>
                <option value="3">Tư Duy Phản Biện - Harvey Mindset</option>
                <option value="4">Điều Kỳ Diệu Của Thói Quen - Charles Duhigg</option>
                <option value="5">Khéo Ăn Nói Sẽ Có Được Thiên Hạ - Trác Nhã</option>
            </select>
        </td>
        <td>
            <input type="text" class="form-control stock-display" data-row="${newRowId}" value="0" readonly>
        </td>
        <td>
            <input type="number" class="form-control quantity-input" data-row="${newRowId}" min="1" value="0">
        </td>
        <td>
            <div class="input-group">
                <input type="text" class="form-control subtotal" data-row="${newRowId}" value="0" readonly>
                <span class="input-group-text">₫</span>
            </div>
        </td>
        <td class="text-center">
            <button type="button" class="btn btn-sm btn-outline-danger remove-row" data-row="${newRowId}">
                <i class="bi bi-trash"></i>
            </button>
        </td>
    `;
    
    tbody.appendChild(newRow);
    updateTotalAmount();
}

// Xóa dòng sản phẩm
function removeProductRow(rowId) {
    const row = document.getElementById(`exportRow${rowId}`);
    
    if (row) {
        // Nếu chỉ còn 1 dòng, không cho xóa
        const rows = document.querySelectorAll('#productExportTable tbody tr');
        if (rows.length === 1) {
            Swal.fire({
                title: 'Không thể xóa',
                text: 'Phiếu xuất phải có ít nhất một sản phẩm',
                icon: 'warning',
                confirmButtonText: 'Đồng ý'
            });
            return;
        }
        
        Swal.fire({
            title: 'Xác nhận xóa',
            text: 'Bạn có chắc chắn muốn xóa sản phẩm này khỏi phiếu xuất?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                row.remove();
                updateTotalAmount();
            }
        });
    }
}

// Hiển thị chi tiết phiếu xuất
function showExportDetail(exportId) {
    // Lấy dữ liệu chi tiết phiếu xuất (trong thực tế sẽ gọi API)
    const detail = exportDetail[exportId];
    
    if (detail) {
        // Cập nhật thông tin chi tiết
        document.getElementById('detailExportId').textContent = detail.id;
        document.getElementById('detailExportDate').textContent = detail.date;
        document.getElementById('detailExportReason').textContent = detail.reason;
        document.getElementById('detailCreatedBy').textContent = detail.createdBy;
        document.getElementById('detailCreatedAt').textContent = detail.createdAt;
        document.getElementById('detailNotes').textContent = detail.notes;
        
        // Hiển thị tham chiếu nếu có
        const referenceContainer = document.getElementById('detailReferenceContainer');
        if (detail.reference) {
            referenceContainer.style.display = '';
            
            // Điều chỉnh nhãn tham chiếu theo loại
            const referenceLabel = referenceContainer.querySelector('p:first-child');
            if (detail.referenceType === 'order') {
                referenceLabel.textContent = 'Đơn hàng tham chiếu:';
            } else if (detail.referenceType === 'supplier') {
                referenceLabel.textContent = 'Nhà cung cấp:';
            } else {
                referenceLabel.textContent = 'Tham chiếu:';
            }
            
            document.getElementById('detailReference').textContent = detail.reference;
        } else {
            referenceContainer.style.display = 'none';
        }
        
        // Cập nhật bảng sản phẩm
        const tableBody = document.querySelector('#detailProductTable tbody');
        tableBody.innerHTML = '';
        
        detail.items.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.product}</td>
                <td>${item.quantity}</td>
                <td>${item.price.toLocaleString()} ₫</td>
                <td>${item.subtotal.toLocaleString()} ₫</td>
            `;
            tableBody.appendChild(row);
        });
        
        // Cập nhật tổng số lượng và tổng tiền
        document.getElementById('detailTotalQuantity').textContent = detail.totalQuantity;
        document.getElementById('detailTotalAmount').textContent = detail.totalValue.toLocaleString() + ' ₫';
        
        // Hiển thị modal
        const modal = new bootstrap.Modal(document.getElementById('exportDetailModal'));
        modal.show();
    } else {
        Swal.fire({
            title: 'Lỗi',
            text: 'Không tìm thấy thông tin chi tiết phiếu xuất',
            icon: 'error',
            confirmButtonText: 'Đồng ý'
        });
    }
}

// Lưu phiếu xuất
function saveExport() {
    // Kiểm tra dữ liệu đầu vào
    const reason = document.getElementById('exportReason').value;
    const exportDate = document.getElementById('exportDate').value;
    
    if (!reason) {
        Swal.fire({
            title: 'Lỗi',
            text: 'Vui lòng chọn lý do xuất kho',
            icon: 'error',
            confirmButtonText: 'Đồng ý'
        });
        return;
    }
    
    if (!exportDate) {
        Swal.fire({
            title: 'Lỗi',
            text: 'Vui lòng chọn ngày xuất',
            icon: 'error',
            confirmButtonText: 'Đồng ý'
        });
        return;
    }
    
    // Kiểm tra tham chiếu nếu cần
    let reference = null;
    if (reason === 'order') {
        reference = document.getElementById('orderReference').value;
        if (!reference) {
            Swal.fire({
                title: 'Lỗi',
                text: 'Vui lòng chọn đơn hàng tham chiếu',
                icon: 'error',
                confirmButtonText: 'Đồng ý'
            });
            return;
        }
    } else if (reason === 'return') {
        reference = document.getElementById('supplierReference').value;
        if (!reference) {
            Swal.fire({
                title: 'Lỗi',
                text: 'Vui lòng chọn nhà cung cấp',
                icon: 'error',
                confirmButtonText: 'Đồng ý'
            });
            return;
        }
    }
    
    // Kiểm tra danh sách sản phẩm
    const rows = document.querySelectorAll('#productExportTable tbody tr');
    const products = [];
    
    let isValid = true;
    rows.forEach(row => {
        const rowId = row.id.replace('exportRow', '');
        const productSelect = row.querySelector(`.product-select[data-row="${rowId}"]`);
        const quantityInput = row.querySelector(`.quantity-input[data-row="${rowId}"]`);
        
        const productId = productSelect.value;
        const quantity = parseInt(quantityInput.value) || 0;
        
        if (!productId) {
            Swal.fire({
                title: 'Lỗi',
                text: 'Vui lòng chọn sản phẩm cho tất cả các dòng',
                icon: 'error',
                confirmButtonText: 'Đồng ý'
            });
            isValid = false;
            return;
        }
        
        if (quantity <= 0) {
            Swal.fire({
                title: 'Lỗi',
                text: 'Số lượng xuất phải lớn hơn 0',
                icon: 'error',
                confirmButtonText: 'Đồng ý'
            });
            isValid = false;
            return;
        }
        
        // Kiểm tra số lượng xuất <= số lượng tồn kho
        const stock = inventoryProducts[productId].stock;
        if (quantity > stock) {
            Swal.fire({
                title: 'Lỗi',
                text: `Số lượng xuất của sản phẩm "${inventoryProducts[productId].name}" không thể vượt quá số lượng tồn kho (${stock})`,
                icon: 'error',
                confirmButtonText: 'Đồng ý'
            });
            isValid = false;
            return;
        }
        
        products.push({
            productId,
            quantity,
            price: inventoryProducts[productId].price
        });
    });
    
    if (!isValid) return;
    
    // Trong thực tế, bạn sẽ gửi dữ liệu lên server
    // Ở đây mình sẽ mô phỏng việc lưu thành công
    Swal.fire({
        title: 'Xác nhận',
        text: 'Bạn có chắc chắn muốn lưu phiếu xuất này?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Lưu',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Thành công!',
                text: 'Phiếu xuất đã được lưu thành công',
                icon: 'success',
                confirmButtonText: 'Đồng ý'
            }).then(() => {
                // Đóng modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('exportInventoryModal'));
                modal.hide();
                
                // Trong thực tế, bạn sẽ làm mới dữ liệu từ server
                // Ở đây mình sẽ mô phỏng việc làm mới dữ liệu
                setTimeout(() => {
                    // Thêm phiếu xuất mới vào đầu danh sách
                    const reasonText = document.getElementById('exportReason').options[document.getElementById('exportReason').selectedIndex].text;
                    const newExport = {
                        id: document.getElementById('exportId').value,
                        date: formatDate(new Date(exportDate)),
                        reason: reasonText,
                        productCount: products.length,
                        totalQuantity: products.reduce((sum, product) => sum + product.quantity, 0),
                        createdBy: 'Admin',
                        notes: document.getElementById('exportNotes').value || 'Không có ghi chú',
                        reference: reference
                    };
                    
                    exportList.unshift(newExport);
                    
                    // Làm mới bảng
                    loadExportTable();
                    
                    // Reset form
                    resetExportForm();
                }, 500);
            });
        }
    });
}

// Định dạng ngày
function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Reset form xuất kho
function resetExportForm() {
    // Reset các trường
    document.getElementById('exportReason').value = '';
    document.getElementById('exportDate').valueAsDate = new Date();
    document.getElementById('exportNotes').value = '';
    document.getElementById('orderReferenceRow').style.display = 'none';
    document.getElementById('supplierReferenceRow').style.display = 'none';
    document.getElementById('orderReference').value = '';
    document.getElementById('supplierReference').value = '';
    
    // Giữ lại một dòng sản phẩm và reset
    const tbody = document.querySelector('#productExportTable tbody');
    tbody.innerHTML = `
        <tr id="exportRow1">
            <td>
                <select class="form-select product-select" data-row="1">
                    <option value="">-- Chọn sản phẩm --</option>
                    <option value="1">Đắc Nhân Tâm - Dale Carnegie</option>
                    <option value="2">Nhà Giả Kim - Paulo Coelho</option>
                    <option value="3">Tư Duy Phản Biện - Harvey Mindset</option>
                    <option value="4">Điều Kỳ Diệu Của Thói Quen - Charles Duhigg</option>
                    <option value="5">Khéo Ăn Nói Sẽ Có Được Thiên Hạ - Trác Nhã</option>
                </select>
            </td>
            <td>
                <input type="text" class="form-control stock-display" data-row="1" value="0" readonly>
            </td>
            <td>
                <input type="number" class="form-control quantity-input" data-row="1" min="1" value="0">
            </td>
            <td>
                <div class="input-group">
                    <input type="text" class="form-control subtotal" data-row="1" value="0" readonly>
                    <span class="input-group-text">₫</span>
                </div>
            </td>
            <td class="text-center">
                <button type="button" class="btn btn-sm btn-outline-danger remove-row" data-row="1">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `;
    
    // Reset tổng tiền
    updateTotalAmount();
    
    // Tạo mã phiếu xuất mới
    const currentId = parseInt(document.getElementById('exportId').value.replace('XK', ''));
    document.getElementById('exportId').value = 'XK' + (currentId + 1).toString().padStart(5, '0');
}