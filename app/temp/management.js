// Chuyển đổi giữa các tab
document.addEventListener('DOMContentLoaded', function () {
    const importTab = document.getElementById('importTab');
    const exportTab = document.getElementById('exportTab');
    const importTabContent = document.getElementById('importTabContent');
    const exportTabContent = document.getElementById('exportTabContent');

    importTab.addEventListener('click', function () {
        importTab.classList.add('active');
        exportTab.classList.remove('active');
        importTabContent.classList.add('active');
        exportTabContent.classList.remove('active');
    });

    exportTab.addEventListener('click', function () {
        exportTab.classList.add('active');
        importTab.classList.remove('active');
        exportTabContent.classList.add('active');
        importTabContent.classList.remove('active');
    });

    // Xử lý hiển thị các trường liên quan khi thay đổi lý do xuất kho
    const exportReason = document.getElementById('exportReason');
    const orderReferenceRow = document.getElementById('orderReferenceRow');
    const supplierReferenceRow = document.getElementById('supplierReferenceRow');

    exportReason.addEventListener('change', function () {
        if (this.value === 'order') {
            orderReferenceRow.style.display = 'block';
            supplierReferenceRow.style.display = 'none';
        } else if (this.value === 'return') {
            orderReferenceRow.style.display = 'none';
            supplierReferenceRow.style.display = 'block';
        } else {
            orderReferenceRow.style.display = 'none';
            supplierReferenceRow.style.display = 'none';
        }
    });

    // Khởi tạo Select2 cho các dropdown
    $('.product-select').select2({
        dropdownParent: $('.modal-body'),
        placeholder: "Chọn sản phẩm",
        width: '100%'
    });

    // Xử lý thêm dòng sản phẩm cho phiếu nhập
    document.getElementById('addProductRow').addEventListener('click', function () {
        addProductRow('import');
    });

    // Xử lý thêm dòng sản phẩm cho phiếu xuất
    document.getElementById('addExportRow').addEventListener('click', function () {
        addProductRow('export');
    });

    // Xử lý khi click vào nút xem chi tiết phiếu nhập
    document.querySelectorAll('.view-import').forEach(button => {
        button.addEventListener('click', function () {
            const importId = this.getAttribute('data-id');
            viewImportDetail(importId);
        });
    });

    // Xử lý khi click vào nút xem chi tiết phiếu xuất
    document.querySelectorAll('.view-export').forEach(button => {
        button.addEventListener('click', function () {
            const exportId = this.getAttribute('data-id');
            viewExportDetail(exportId);
        });
    });

    // Khởi tạo ngày mặc định là ngày hiện tại
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('importDate').value = today;
    document.getElementById('exportDate').value = today;
});

// Hàm thêm dòng sản phẩm mới vào bảng
function addProductRow(type) {
    const tableId = type === 'import' ? 'productImportTable' : 'productExportTable';
    const tbody = document.querySelector(`#${tableId} tbody`);
    const rowCount = tbody.querySelectorAll('tr').length;
    const newRowId = rowCount + 1;

    let newRow = document.createElement('tr');
    newRow.id = type === 'import' ? `productRow${newRowId}` : `exportRow${newRowId}`;

    if (type === 'import') {
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
                            <input type="number" class="form-control price-input" data-row="${newRowId}" min="0" value="85000">
                            <span class="input-group-text">₫</span>
                        </div>
                    </td>
                    <td>
                        <div class="input-group">
                            <input type="text" class="form-control subtotal" data-row="${newRowId}" value="85,000" readonly>
                            <span class="input-group-text">₫</span>
                        </div>
                    </td>
                    <td class="text-center">
                        <button type="button" class="btn btn-sm btn-outline-danger remove-row" data-row="${newRowId}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                `;
    } else {
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
                        <input type="text" class="form-control stock-display" data-row="${newRowId}" value="125" readonly>
                    </td>
                    <td>
                        <input type="number" class="form-control quantity-input" data-row="${newRowId}" min="1" max="125" value="1">
                    </td>
                    <td>
                        <div class="input-group">
                            <input type="text" class="form-control subtotal" data-row="${newRowId}" value="120,000" readonly>
                            <span class="input-group-text">₫</span>
                        </div>
                    </td>
                    <td class="text-center">
                        <button type="button" class="btn btn-sm btn-outline-danger remove-row" data-row="${newRowId}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                `;
    }

    tbody.appendChild(newRow);

    // Khởi tạo Select2 cho dropdown trong dòng mới
    $(`#${tableId} .product-select[data-row="${newRowId}"]`).select2({
        dropdownParent: $('.modal-body'),
        placeholder: "Chọn sản phẩm",
        width: '100%'
    });

    // Thêm sự kiện xóa dòng
    const removeBtn = newRow.querySelector('.remove-row');
    removeBtn.addEventListener('click', function () {
        const rowId = this.getAttribute('data-row');
        removeProductRow(type, rowId);
    });

    // Thêm sự kiện cập nhật thành tiền khi thay đổi số lượng hoặc giá
    const quantityInput = newRow.querySelector('.quantity-input');
    quantityInput.addEventListener('change', function () {
        const rowId = this.getAttribute('data-row');
        updateSubtotal(type, rowId);
    });

    if (type === 'import') {
        const priceInput = newRow.querySelector('.price-input');
        priceInput.addEventListener('change', function () {
            const rowId = this.getAttribute('data-row');
            updateSubtotal(type, rowId);
        });
    }

    // Thêm sự kiện cập nhật tồn kho khi chọn sản phẩm (chỉ cho xuất kho)
    if (type === 'export') {
        const productSelect = newRow.querySelector('.product-select');
        productSelect.addEventListener('change', function () {
            const rowId = this.getAttribute('data-row');
            updateStockInfo(rowId);
        });
    }

    // Cập nhật tổng số lượng và tổng giá trị
    updateTotals(type);
}

// Hàm xóa dòng sản phẩm
function removeProductRow(type, rowId) {
    const rowSelector = type === 'import' ? `#productRow${rowId}` : `#exportRow${rowId}`;
    const row = document.querySelector(rowSelector);

    if (row) {
        // Hủy Select2 trước khi xóa dòng
        const select = row.querySelector('.product-select');
        $(select).select2('destroy');

        // Xóa dòng
        row.remove();

        // Cập nhật tổng số lượng và tổng giá trị
        updateTotals(type);
    }
}

// Hàm cập nhật thành tiền khi thay đổi số lượng hoặc giá
function updateSubtotal(type, rowId) {
    const rowSelector = type === 'import' ? `#productRow${rowId}` : `#exportRow${rowId}`;
    const row = document.querySelector(rowSelector);

    if (!row) return;

    const quantity = parseInt(row.querySelector('.quantity-input').value) || 0;
    let price = 0;

    if (type === 'import') {
        price = parseFloat(row.querySelector('.price-input').value) || 0;
    } else {
        // Với xuất kho, giá được lấy từ dữ liệu sản phẩm (giả định 120,000đ cho tất cả sản phẩm)
        price = 120000;
    }

    const subtotal = quantity * price;
    row.querySelector('.subtotal').value = formatCurrency(subtotal);

    // Cập nhật tổng số lượng và tổng giá trị
    updateTotals(type);
}

// Hàm cập nhật thông tin tồn kho khi chọn sản phẩm (chỉ cho xuất kho)
function updateStockInfo(rowId) {
    const row = document.querySelector(`#exportRow${rowId}`);
    if (!row) return;

    const productSelect = row.querySelector('.product-select');
    const stockDisplay = row.querySelector('.stock-display');
    const quantityInput = row.querySelector('.quantity-input');

    // Lấy dữ liệu tồn kho từ server (giả định)
    // Trong ví dụ này, chúng ta sẽ dùng một số giá trị cố định cho từng sản phẩm
    const productStocks = {
        '1': 125,
        '2': 87,
        '3': 53,
        '4': 92,
        '5': 64
    };

    const productId = productSelect.value;
    const stock = productStocks[productId] || 0;

    // Cập nhật hiển thị tồn kho
    stockDisplay.value = stock;

    // Cập nhật max số lượng có thể xuất
    quantityInput.setAttribute('max', stock);

    // Đảm bảo số lượng xuất không vượt quá tồn kho
    if (parseInt(quantityInput.value) > stock) {
        quantityInput.value = stock;
    }

    // Cập nhật thành tiền
    updateSubtotal('export', rowId);
}

// Hàm cập nhật tổng số lượng và tổng giá trị
function updateTotals(type) {
    const tableId = type === 'import' ? 'productImportTable' : 'productExportTable';
    const table = document.getElementById(tableId);
    const rows = table.querySelectorAll('tbody tr');

    let totalQuantity = 0;
    let totalAmount = 0;

    rows.forEach(row => {
        const quantity = parseInt(row.querySelector('.quantity-input').value) || 0;
        const subtotalText = row.querySelector('.subtotal').value;
        const subtotal = parseFloat(subtotalText.replace(/[^\d]/g, '')) || 0;

        totalQuantity += quantity;
        totalAmount += subtotal;
    });

    // Cập nhật hiển thị tổng số lượng, số lượng sản phẩm và tổng giá trị
    if (type === 'import') {
        document.getElementById('totalQuantity').textContent = totalQuantity;
        document.getElementById('totalProducts').textContent = rows.length;
        document.getElementById('totalAmount').textContent = formatCurrency(totalAmount) + ' ₫';
    } else {
        document.getElementById('totalExportQuantity').textContent = totalQuantity;
        document.getElementById('totalExportProducts').textContent = rows.length;
        document.getElementById('totalExportAmount').textContent = formatCurrency(totalAmount) + ' ₫';
    }
}

// Hàm hiển thị chi tiết phiếu nhập
function viewImportDetail(importId) {
    // Trong thực tế, bạn sẽ gọi API để lấy dữ liệu chi tiết phiếu nhập
    // Ở đây chúng ta dùng dữ liệu mẫu
    document.getElementById('detailImportId').textContent = importId;

    // Hiển thị chi tiết sản phẩm
    const productTableBody = document.querySelector('#importDetailModal #detailProductTable tbody');
    productTableBody.innerHTML = '';

    // Dữ liệu mẫu
    const sampleProducts = [
        { name: 'Đắc Nhân Tâm - Dale Carnegie', quantity: 20, price: 85000, subtotal: 1700000 },
        { name: 'Nhà Giả Kim - Paulo Coelho', quantity: 15, price: 75000, subtotal: 1125000 },
        { name: 'Tư Duy Phản Biện - Harvey Mindset', quantity: 10, price: 95000, subtotal: 950000 },
        { name: 'Điều Kỳ Diệu Của Thói Quen - Charles Duhigg', quantity: 5, price: 110000, subtotal: 550000 },
    ];

    sampleProducts.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${product.name}</td>
                    <td>${product.quantity}</td>
                    <td>${formatCurrency(product.price)} ₫</td>
                    <td>${formatCurrency(product.subtotal)} ₫</td>
                `;
        productTableBody.appendChild(row);
    });

    // Hiển thị modal
    const importDetailModal = new bootstrap.Modal(document.getElementById('importDetailModal'));
    importDetailModal.show();
}

// Hàm hiển thị chi tiết phiếu xuất
function viewExportDetail(exportId) {
    // Trong thực tế, bạn sẽ gọi API để lấy dữ liệu chi tiết phiếu xuất
    // Ở đây chúng ta dùng dữ liệu mẫu
    document.getElementById('detailExportId').textContent = exportId;

    // Hiển thị chi tiết sản phẩm
    const productTableBody = document.querySelector('#exportDetailModal #detailProductTable tbody');
    productTableBody.innerHTML = '';

    // Dữ liệu mẫu
    const sampleProducts = [
        { name: 'Đắc Nhân Tâm - Dale Carnegie', quantity: 2, price: 120000, subtotal: 240000 },
        { name: 'Nhà Giả Kim - Paulo Coelho', quantity: 1, price: 110000, subtotal: 110000 }
    ];

    sampleProducts.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${product.name}</td>
                    <td>${product.quantity}</td>
                    <td>${formatCurrency(product.price)} ₫</td>
                    <td>${formatCurrency(product.subtotal)} ₫</td>
                `;
        productTableBody.appendChild(row);
    });

    // Hiển thị modal
    const exportDetailModal = new bootstrap.Modal(document.getElementById('exportDetailModal'));
    exportDetailModal.show();
}

// Hàm định dạng tiền tệ VND
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount);
}