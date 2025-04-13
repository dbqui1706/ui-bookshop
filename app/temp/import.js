/**
 * Trang quản lý nhập kho
 */

// Dữ liệu mẫu - Danh sách phiếu nhập kho
const importList = [
    {
        id: 'NK00265',
        date: '08/04/2025',
        supplier: 'NXB Trẻ',
        productCount: 3,
        totalQuantity: 45,
        totalValue: 4750000,
        createdBy: 'Nguyễn Văn A',
        notes: 'Nhập bổ sung sách cho quý 2/2025'
    },
    {
        id: 'NK00264',
        date: '07/04/2025',
        supplier: 'NXB Kim Đồng',
        productCount: 5,
        totalQuantity: 65,
        totalValue: 6820000,
        createdBy: 'Trần Thị B',
        notes: 'Nhập mới sách thiếu nhi'
    },
    {
        id: 'NK00263',
        date: '05/04/2025',
        supplier: 'Nhà sách Fahasa',
        productCount: 4,
        totalQuantity: 40,
        totalValue: 4200000,
        createdBy: 'Nguyễn Văn A',
        notes: 'Nhập bổ sung các đầu sách bán chạy'
    },
    {
        id: 'NK00262',
        date: '03/04/2025',
        supplier: 'NXB Giáo Dục',
        productCount: 6,
        totalQuantity: 80,
        totalValue: 8400000,
        createdBy: 'Lê Thị C',
        notes: 'Nhập giáo trình học kỳ mới'
    },
    {
        id: 'NK00261',
        date: '01/04/2025',
        supplier: 'NXB Trẻ',
        productCount: 2,
        totalQuantity: 30,
        totalValue: 3150000,
        createdBy: 'Nguyễn Văn A',
        notes: 'Nhập bổ sung sách kỹ năng sống'
    },
    {
        id: 'NK00260',
        date: '29/03/2025',
        supplier: 'Nhà sách Phương Nam',
        productCount: 4,
        totalQuantity: 50,
        totalValue: 5250000,
        createdBy: 'Trần Thị B',
        notes: 'Nhập sách văn học nước ngoài'
    },
    {
        id: 'NK00259',
        date: '27/03/2025',
        supplier: 'NXB Kim Đồng',
        productCount: 3,
        totalQuantity: 45,
        totalValue: 4725000,
        createdBy: 'Lê Thị C',
        notes: 'Nhập truyện tranh'
    },
    {
        id: 'NK00258',
        date: '25/03/2025',
        supplier: 'NXB Trẻ',
        productCount: 5,
        totalQuantity: 60,
        totalValue: 6300000,
        createdBy: 'Nguyễn Văn A',
        notes: 'Nhập sách bán chạy'
    },
    {
        id: 'NK00257',
        date: '23/03/2025',
        supplier: 'NXB Giáo Dục',
        productCount: 4,
        totalQuantity: 55,
        totalValue: 5775000,
        createdBy: 'Trần Thị B',
        notes: 'Nhập sách tham khảo'
    },
    {
        id: 'NK00256',
        date: '21/03/2025',
        supplier: 'Nhà sách Fahasa',
        productCount: 3,
        totalQuantity: 40,
        totalValue: 4200000,
        createdBy: 'Lê Thị C',
        notes: 'Nhập sách kỹ năng sống'
    }
];

// Dữ liệu mẫu - Chi tiết phiếu nhập kho
const importDetail = {
    'NK00265': {
        id: 'NK00265',
        date: '08/04/2025 08:45',
        supplier: 'NXB Trẻ',
        createdBy: 'Nguyễn Văn A',
        createdAt: '08/04/2025 08:45',
        notes: 'Nhập bổ sung sách cho quý 2/2025',
        totalQuantity: 45,
        totalValue: 4750000,
        items: [
            {
                product: 'Đắc Nhân Tâm',
                quantity: 20,
                price: 95000,
                subtotal: 1900000
            },
            {
                product: 'Nhà Giả Kim',
                quantity: 15,
                price: 110000,
                subtotal: 1650000
            },
            {
                product: 'Tư Duy Phản Biện',
                quantity: 10,
                price: 120000,
                subtotal: 1200000
            }
        ]
    }
};

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', function() {
    // Tải dữ liệu bảng phiếu nhập kho
    loadImportTable();
    
    // Thiết lập ngày hiện tại cho form nhập kho
    document.getElementById('importDate').valueAsDate = new Date();
    
    // Khởi tạo sự kiện
    initEvents();
});

// Tải dữ liệu bảng phiếu nhập kho
function loadImportTable() {
    const tableBody = document.querySelector('#importTable tbody');
    tableBody.innerHTML = '';
    
    importList.forEach(item => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.date}</td>
            <td>${item.supplier}</td>
            <td>${item.productCount}</td>
            <td>${item.totalQuantity}</td>
            <td>${item.totalValue.toLocaleString()} ₫</td>
            <td>${item.createdBy}</td>
            <td>${item.notes}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary view-import" data-id="${item.id}" title="Xem chi tiết">
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
    document.querySelectorAll('.view-import').forEach(button => {
        button.addEventListener('click', function() {
            const importId = this.getAttribute('data-id');
            showImportDetail(importId);
        });
    });
}

// Khởi tạo các sự kiện
function initEvents() {
    // Sự kiện thêm dòng sản phẩm
    document.getElementById('addProductRow').addEventListener('click', function() {
        addProductRow();
    });
    
    // Sự kiện lưu phiếu nhập
    document.getElementById('saveImport').addEventListener('click', function() {
        saveImport();
    });
    
    // Sự kiện khi thay đổi sản phẩm, số lượng hoặc giá nhập
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('product-select')) {
            updateProductRow(e.target.getAttribute('data-row'));
        }
        
        if (e.target.classList.contains('quantity-input') || e.target.classList.contains('price-input')) {
            updateRowSubtotal(e.target.getAttribute('data-row'));
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

// Thêm dòng sản phẩm mới
function addProductRow() {
    const tbody = document.querySelector('#productImportTable tbody');
    const rowCount = tbody.children.length;
    const newRowId = rowCount + 1;
    
    const newRow = document.createElement('tr');
    newRow.id = `productRow${newRowId}`;
    
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
            <input type="number" class="form-control quantity-input" data-row="${newRowId}" min="1" value="1">
        </td>
        <td>
            <div class="input-group">
                <input type="number" class="form-control price-input" data-row="${newRowId}" min="0" value="0">
                <span class="input-group-text">₫</span>
            </div>
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

// Cập nhật dòng sản phẩm khi chọn sản phẩm
function updateProductRow(rowId) {
    const select = document.querySelector(`.product-select[data-row="${rowId}"]`);
    const productId = select.value;
    
    if (productId) {
        // Trong thực tế, bạn sẽ lấy thông tin sản phẩm từ API
        // Ở đây mình sẽ mô phỏng với vài giá trị
        const productPrices = {
            '1': 95000,
            '2': 110000,
            '3': 120000,
            '4': 135000,
            '5': 90000
        };
        
        const priceInput = document.querySelector(`.price-input[data-row="${rowId}"]`);
        priceInput.value = productPrices[productId];
        
        updateRowSubtotal(rowId);
        updateTotalAmount();
    }
}

// Cập nhật thành tiền của dòng
function updateRowSubtotal(rowId) {
    const quantityInput = document.querySelector(`.quantity-input[data-row="${rowId}"]`);
    const priceInput = document.querySelector(`.price-input[data-row="${rowId}"]`);
    const subtotalInput = document.querySelector(`.subtotal[data-row="${rowId}"]`);
    
    const quantity = parseInt(quantityInput.value) || 0;
    const price = parseFloat(priceInput.value) || 0;
    const subtotal = quantity * price;
    
    subtotalInput.value = subtotal.toLocaleString();
}

// Cập nhật tổng tiền
function updateTotalAmount() {
    const rows = document.querySelectorAll('#productImportTable tbody tr');
    let totalAmount = 0;
    let totalQuantity = 0;
    let totalProducts = rows.length;
    
    rows.forEach(row => {
        const rowId = row.id.replace('productRow', '');
        const quantityInput = row.querySelector(`.quantity-input[data-row="${rowId}"]`);
        const priceInput = row.querySelector(`.price-input[data-row="${rowId}"]`);
        
        const quantity = parseInt(quantityInput.value) || 0;
        const price = parseFloat(priceInput.value) || 0;
        const subtotal = quantity * price;
        
        totalAmount += subtotal;
        totalQuantity += quantity;
    });
    
    document.getElementById('totalAmount').textContent = totalAmount.toLocaleString() + ' ₫';
    document.getElementById('totalQuantity').textContent = totalQuantity;
    document.getElementById('totalProducts').textContent = totalProducts;
}

// Xóa dòng sản phẩm
function removeProductRow(rowId) {
    const row = document.getElementById(`productRow${rowId}`);
    
    if (row) {
        // Nếu chỉ còn 1 dòng, không cho xóa
        const rows = document.querySelectorAll('#productImportTable tbody tr');
        if (rows.length === 1) {
            Swal.fire({
                title: 'Không thể xóa',
                text: 'Phiếu nhập phải có ít nhất một sản phẩm',
                icon: 'warning',
                confirmButtonText: 'Đồng ý'
            });
            return;
        }
        
        Swal.fire({
            title: 'Xác nhận xóa',
            text: 'Bạn có chắc chắn muốn xóa sản phẩm này khỏi phiếu nhập?',
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

// Hiển thị chi tiết phiếu nhập
function showImportDetail(importId) {
    // Lấy dữ liệu chi tiết phiếu nhập (trong thực tế sẽ gọi API)
    const detail = importDetail[importId];
    
    if (detail) {
        // Cập nhật thông tin chi tiết
        document.getElementById('detailImportId').textContent = detail.id;
        document.getElementById('detailImportDate').textContent = detail.date;
        document.getElementById('detailSupplier').textContent = detail.supplier;
        document.getElementById('detailCreatedBy').textContent = detail.createdBy;
        document.getElementById('detailCreatedAt').textContent = detail.createdAt;
        document.getElementById('detailTotalValue').textContent = detail.totalValue.toLocaleString() + ' ₫';
        document.getElementById('detailNotes').textContent = detail.notes;
        
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
        
        // Cập nhật tổng số lượng
        document.getElementById('detailTotalQuantity').textContent = detail.totalQuantity;
        document.getElementById('detailTotalAmount').textContent = detail.totalValue.toLocaleString() + ' ₫';
        
        // Hiển thị modal
        const modal = new bootstrap.Modal(document.getElementById('importDetailModal'));
        modal.show();
    } else {
        Swal.fire({
            title: 'Lỗi',
            text: 'Không tìm thấy thông tin chi tiết phiếu nhập',
            icon: 'error',
            confirmButtonText: 'Đồng ý'
        });
    }
}

// Lưu phiếu nhập
function saveImport() {
    // Kiểm tra dữ liệu đầu vào
    const supplier = document.getElementById('supplier').value;
    const importDate = document.getElementById('importDate').value;
    
    if (!supplier) {
        Swal.fire({
            title: 'Lỗi',
            text: 'Vui lòng chọn nhà cung cấp',
            icon: 'error',
            confirmButtonText: 'Đồng ý'
        });
        return;
    }
    
    if (!importDate) {
        Swal.fire({
            title: 'Lỗi',
            text: 'Vui lòng chọn ngày nhập',
            icon: 'error',
            confirmButtonText: 'Đồng ý'
        });
        return;
    }
    
    // Kiểm tra danh sách sản phẩm
    const rows = document.querySelectorAll('#productImportTable tbody tr');
    const products = [];
    
    let isValid = true;
    rows.forEach(row => {
        const rowId = row.id.replace('productRow', '');
        const productSelect = row.querySelector(`.product-select[data-row="${rowId}"]`);
        const quantityInput = row.querySelector(`.quantity-input[data-row="${rowId}"]`);
        const priceInput = row.querySelector(`.price-input[data-row="${rowId}"]`);
        
        const productId = productSelect.value;
        const quantity = parseInt(quantityInput.value) || 0;
        const price = parseFloat(priceInput.value) || 0;
        
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
                text: 'Số lượng phải lớn hơn 0',
                icon: 'error',
                confirmButtonText: 'Đồng ý'
            });
            isValid = false;
            return;
        }
        
        if (price <= 0) {
            Swal.fire({
                title: 'Lỗi',
                text: 'Giá nhập phải lớn hơn 0',
                icon: 'error',
                confirmButtonText: 'Đồng ý'
            });
            isValid = false;
            return;
        }
        
        products.push({
            productId,
            quantity,
            price
        });
    });
    
    if (!isValid) return;
    
    // Trong thực tế, bạn sẽ gửi dữ liệu lên server
    // Ở đây mình sẽ mô phỏng việc lưu thành công
    Swal.fire({
        title: 'Xác nhận',
        text: 'Bạn có chắc chắn muốn lưu phiếu nhập này?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Lưu',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Thành công!',
                text: 'Phiếu nhập đã được lưu thành công',
                icon: 'success',
                confirmButtonText: 'Đồng ý'
            }).then(() => {
                // Đóng modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('importInventoryModal'));
                modal.hide();
                
                // Trong thực tế, bạn sẽ làm mới dữ liệu từ server
                // Ở đây mình sẽ mô phỏng việc làm mới dữ liệu
                setTimeout(() => {
                    // Thêm phiếu nhập mới vào đầu danh sách
                    const newImport = {
                        id: document.getElementById('importId').value,
                        date: formatDate(new Date(importDate)),
                        supplier: document.getElementById('supplier').options[document.getElementById('supplier').selectedIndex].text,
                        productCount: products.length,
                        totalQuantity: products.reduce((sum, product) => sum + product.quantity, 0),
                        totalValue: products.reduce((sum, product) => sum + (product.price * product.quantity), 0),
                        createdBy: 'Admin',
                        notes: document.getElementById('importNotes').value || 'Không có ghi chú'
                    };
                    
                    importList.unshift(newImport);
                    
                    // Làm mới bảng
                    loadImportTable();
                    
                    // Reset form
                    resetImportForm();
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

// Reset form nhập kho
function resetImportForm() {
    // Reset supplier và date
    document.getElementById('supplier').value = '';
    document.getElementById('importDate').valueAsDate = new Date();
    document.getElementById('importNotes').value = '';
    
    // Giữ lại một dòng sản phẩm và reset
    const tbody = document.querySelector('#productImportTable tbody');
    tbody.innerHTML = `
        <tr id="productRow1">
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
                <input type="number" class="form-control quantity-input" data-row="1" min="1" value="1">
            </td>
            <td>
                <div class="input-group">
                    <input type="number" class="form-control price-input" data-row="1" min="0" value="0">
                    <span class="input-group-text">₫</span>
                </div>
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
    
    // Tạo mã phiếu nhập mới
    const currentId = parseInt(document.getElementById('importId').value.replace('NK', ''));
    document.getElementById('importId').value = 'NK' + (currentId + 1).toString().padStart(5, '0');
}