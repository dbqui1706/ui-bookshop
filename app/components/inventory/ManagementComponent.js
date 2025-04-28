import { EventBus } from "../../core/eventBus.js";
import { getToken } from "../../core/storage.js";
import { showNotification, formatDate, formatCurrency } from "../../core/utils.js";
import { inventoryService } from "../../services/InventoryService.js";

export class ManagementComponent {
    constructor() {
        // service
        this.inventoryService = inventoryService.getInstance();
        this.eventBus = EventBus.getInstance();

        // DOM elements
        this.importTabBtn = document.getElementById('importTab');
        this.exportTabBtn = document.getElementById('exportTab');

        this.tabImport = document.getElementById('importTabContent');
        this.tabExport = document.getElementById('exportTabContent');

        this.importTable = document.getElementById('importTable');
        this.exportTable = document.getElementById('exportTable');

        // Search form elements
        this.importCodeInput = document.getElementById('importCode');
        this.statusFilter = document.getElementById('statusFilter');
        this.importStartDate = document.getElementById('importStartDate');
        this.importEndDate = document.getElementById('importEndDate');
        this.searchImportBtn = document.getElementById('searchImportBtn');

        this.exportCodeInput = document.getElementById('exportCode');
        this.exportReasonFilter = document.getElementById('exportReasonFilter');
        this.exportStartDate = document.getElementById('exportStartDate');
        this.exportEndDate = document.getElementById('exportEndDate');
        this.searchExportBtn = document.getElementById('searchExportBtn');

        // Button to create a new receipt
        this.createReceiptBtn = document.querySelector('.btn-light[data-bs-toggle="modal"]');

        // Modal elements for detail views
        this.importDetailModal = new bootstrap.Modal(document.getElementById('importDetailModal'));
        this.exportDetailModal = new bootstrap.Modal(document.getElementById('exportDetailModal'));

        // Modal content elements - Import
        this.detailImportId = document.getElementById('detailImportId');
        this.detailImportDate = document.getElementById('detailImportDate');
        this.detailSupplier = document.getElementById('detailSupplier');
        this.detailCreatedBy = document.getElementById('detailCreatedBy');
        this.detailCreatedAt = document.getElementById('detailCreatedAt');
        this.detailTotalValue = document.getElementById('detailTotalValue');
        this.detailNotes = document.getElementById('detailNotes');
        this.detailProductTable = document.querySelector('#importDetailModal #detailProductTable tbody');
        this.detailTotalQuantity = document.querySelector('#importDetailModal #detailTotalQuantity');
        this.detailTotalAmount = document.querySelector('#importDetailModal #detailTotalAmount');
        this.printImportBtn = document.getElementById('printImport');

        // Modal content elements - Export
        this.detailExportId = document.getElementById('detailExportId');
        this.detailExportDate = document.getElementById('detailExportDate');
        this.detailExportReason = document.getElementById('detailExportReason');
        this.detailReference = document.getElementById('detailReference');
        this.detailReferenceContainer = document.getElementById('detailReferenceContainer');
        this.exportDetailProductTable = document.querySelector('#exportDetailModal #detailProductTable tbody');
        this.exportDetailTotalQuantity = document.querySelector('#exportDetailModal #detailTotalQuantity');
        this.exportDetailTotalAmount = document.querySelector('#exportDetailModal #detailTotalAmount');
        this.printExportBtn = document.getElementById('printExport');

        // Variables
        this.datatables = {
            import: null,
            export: null
        };

        this.currentReceiptId = null;
        this.currentReceiptType = null;

        // Initialize component
        this.initialize();
    }

    initialize() {
        // Set default dates
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        this.importStartDate.valueAsDate = firstDayOfMonth;
        this.importEndDate.valueAsDate = today;
        this.exportStartDate.valueAsDate = firstDayOfMonth;
        this.exportEndDate.valueAsDate = today;

        // Initialize DataTables
        this.initImportTable();
        this.initExportTable();

        // Setup event listeners
        this.setupEventListeners();

        // Show import tab by default
        this.showImportTab();
    }

    setupEventListeners() {
        // Tab switching
        this.importTabBtn.addEventListener('click', () => this.showImportTab());
        this.exportTabBtn.addEventListener('click', () => this.showExportTab());

        // Search buttons
        this.searchImportBtn.addEventListener('click', () =>
            this.datatables.import.ajax.reload() // Reload the DataTable with new filter values
        );
        this.searchExportBtn.addEventListener('click', () =>
            this.datatables.export.ajax.reload()
        );

        // Create receipt button
        if (this.createReceiptBtn) {
            this.createReceiptBtn.addEventListener('click', () => {
                window.location.href = 'inventory-create.html';
            });
        }

        // Print buttons
        this.printImportBtn.addEventListener('click', () => this.printReceipt('import'));
        this.printExportBtn.addEventListener('click', () => this.printReceipt('export'));

        // Add event delegation for view/print buttons in tables
        $(this.importTable).on('click', '.view-import', (event) => {
            const receiptCode = $(event.currentTarget).data('id');
            this.showReceiptDetail(receiptCode, 'import');
        });

        $(this.importTable).on('click', '.print-import', (event) => {
            const receiptCode = $(event.currentTarget).data('id');
            this.printReceiptByCode(receiptCode, 'import');
        });

        $(this.exportTable).on('click', '.view-import', (event) => {
            const receiptCode = $(event.currentTarget).data('id');
            this.showReceiptDetail(receiptCode, 'export');
        });

        $(this.exportTable).on('click', '.print-import', (event) => {
            const receiptCode = $(event.currentTarget).data('id');
            this.printReceiptByCode(receiptCode, 'export');
        });
    }

    showImportTab() {
        // Update active tab
        this.importTabBtn.classList.add('active');
        this.exportTabBtn.classList.remove('active');

        // Show/hide content
        this.tabImport.classList.add('active');
        this.tabExport.classList.remove('active');

        // Redraw the table to fix layout issues
        if (this.datatables.import) {
            this.datatables.import.columns.adjust().draw();
        }
    }

    showExportTab() {
        // Update active tab
        this.exportTabBtn.classList.add('active');
        this.importTabBtn.classList.remove('active');

        // Show/hide content
        this.tabExport.classList.add('active');
        this.tabImport.classList.remove('active');

        // Redraw the table to fix layout issues
        if (this.datatables.export) {
            this.datatables.export.columns.adjust().draw();
        }
    }

    initImportTable() {
        // Initialize import DataTable
        this.datatables.import = $('#importTable').DataTable({
            ajax: {
                url: "http://localhost:8080/api/admin/inventory/import",
                type: 'GET',
                headers: {
                    Authorization: `Bearer ${getToken()}`
                },
                data: (d) => {
                    d.receiptType = 'import';
                    d.receiptCode = this.importCodeInput.value;
                    d.status = this.statusFilter.value;
                    d.startDate = this.importStartDate.value;
                    d.endDate = this.importEndDate.value;
                    return d;
                },
                error: (xhr, error, thrown) => {
                    console.error('DataTable error:', error, thrown);
                    showNotification('error', 'Lỗi', 'Không thể tải dữ liệu: ' + thrown);
                },
            },
            processing: true,
            serverSide: true, // Set to true if using server-side processing
            searching: true, // We handle searching ourselves via API
            ordering: true,
            responsive: true,
            autoWidth: false,
            dom: '<"d-flex justify-content-between align-items-center"<"d-flex"l><"d-flex"f>>rt<"d-flex justify-content-between align-items-center"ip>',
            lengthMenu: [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "Tất cả"]],
            pageLength: 5,
            pagingType: 'simple_numbers',
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/vi.json' // Vietnamese language
            },
            columns: [
                { data: 'receiptCode', title: 'Mã phiếu' },
                { data: 'createdAt', title: 'Ngày nhập', render: (data) => formatDate(data) },
                { data: null, title: 'Nhà cung cấp', render: (data) => data.supplier || "" },
                { data: 'totalItems', title: 'Số lượng SP' },
                { data: 'totalQuantity', title: 'Tổng SL' },
                {
                    data: 'totalValue',
                    title: 'Giá trị nhập',
                    render: function (data) {
                        return formatCurrency(data);
                    }
                },
                { data: 'createdByName', title: 'Người nhập' },
                {
                    data: 'notes', title: 'Ghi chú',
                    render: function (data) {
                        // Check if data is null or empty
                        if (data === null || data.trim === '') {
                            return 'Không có ghi chú';
                        }
                        // Nếu note quá dài, chỉ hiển thị 20 ký tự đầu tiên
                        if (data.length > 20) {
                            return data.substring(0, 20) + '...';
                        }
                        return data;
                    }
                },
                {
                    data: 'status',
                    title: 'Trạng thái',
                    render: function (data) {
                        let badgeClass = 'bg-success';
                        let statusText = 'Hoàn thành';

                        if (data === 'pending') {
                            badgeClass = 'bg-warning text-dark';
                            statusText = 'Chờ xử lý';
                        } else if (data === 'cancelled') {
                            badgeClass = 'bg-danger';
                            statusText = 'Đã hủy';
                        }

                        return `<span class="badge ${badgeClass}">${statusText}</span>`;
                    }
                },
                {
                    data: null,
                    title: 'Thao tác',
                    orderable: false,
                    render: function (data, type, row) {
                        return `
                            <div class="btn-group btn-group-sm">
                                <button type="button" class="btn btn-info view-import" data-id="${row.receiptCode}">
                                    <i class="bi bi-eye"></i>
                                </button>
                                <button type="button" class="btn btn-success print-import" data-id="${row.receiptCode}">
                                    <i class="bi bi-printer"></i>
                                </button>
                            </div>
                        `;
                    }
                }
            ],
            order: [[1, 'desc']] // Sort by date descending
        });
    }

    initExportTable() {
        // Initialize export DataTable
        this.datatables.export = $('#exportTable').DataTable({
            ajax: {
                url: "http://localhost:8080/api/admin/inventory/import",
                type: 'GET',
                headers: {
                    Authorization: `Bearer ${getToken()}`
                },
                data: (d) => {
                    d.receiptType = 'export';
                    d.receiptCode = $('#exportCode').val();
                    // d.status = this.statusFilter.value;
                    d.startDate = $('#exportStartDate').val();
                    d.endDate = $('#exportEndDate').val();
                    return d;
                },
                error: (xhr, error, thrown) => {
                    console.error('DataTable error:', error, thrown);
                    showNotification('error', 'Lỗi', 'Không thể tải dữ liệu: ' + thrown);
                },
            },
            processing: true,
            serverSide: true, // Set to true if using server-side processing
            searching: true, // We handle searching ourselves via API
            ordering: true,
            responsive: true,
            autoWidth: false,
            dom: '<"d-flex justify-content-between align-items-center"<"d-flex"l><"d-flex"f>>rt<"d-flex justify-content-between align-items-center"ip>',
            lengthMenu: [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "Tất cả"]],
            pageLength: 5,
            pagingType: 'simple_numbers',
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/vi.json' // Vietnamese language
            },
            columns: [
                { data: 'receiptCode', title: 'Mã phiếu' },
                { data: 'createdAt', title: 'Ngày xuất', render: (data) => formatDate(data) },
                { data: null, title: 'Nhà cung cấp', render: (data) => data.supplier || "" },
                { data: 'totalItems', title: 'Số lượng SP' },
                { data: 'totalQuantity', title: 'Tổng SL' },
                {
                    data: 'totalValue',
                    title: 'Giá trị xuất',
                    render: function (data) {
                        return formatCurrency(data);
                    }
                },
                { data: 'createdByName', title: 'Người xuất' },
                {
                    data: 'notes', title: 'Ghi chú',
                    render: function (data) {
                        // Check if data is null or empty
                        if (!data || data.trim() === '') {
                            return 'Không có ghi chú';
                        }
                        // Nếu note quá dài, chỉ hiển thị 20 ký tự đầu tiên
                        if (data.length > 20) {
                            return data.substring(0, 20) + '...';
                        }
                        return data;
                    }
                },
                {
                    data: 'status',
                    title: 'Trạng thái',
                    render: function (data) {
                        let badgeClass = 'bg-success';
                        let statusText = 'Hoàn thành';

                        if (data === 'pending') {
                            badgeClass = 'bg-warning text-dark';
                            statusText = 'Chờ xử lý';
                        } else if (data === 'cancelled') {
                            badgeClass = 'bg-danger';
                            statusText = 'Đã hủy';
                        }

                        return `<span class="badge ${badgeClass}">${statusText}</span>`;
                    }
                },
                {
                    data: null,
                    title: 'Thao tác',
                    orderable: false,
                    render: function (data, type, row) {
                        return `
                            <div class="btn-group btn-group-sm">
                                <button type="button" class="btn btn-info view-import" data-id="${row.receiptCode}">
                                    <i class="bi bi-eye"></i>
                                </button>
                                <button type="button" class="btn btn-success print-import" data-id="${row.receiptCode}">
                                    <i class="bi bi-printer"></i>
                                </button>
                            </div>
                        `;
                    }
                }
            ],
            order: [[1, 'desc']] // Sort by date descending
        });
    }

    /**
     * Hiển thị chi tiết phiếu nhập/xuất kho
     * @param {string} receiptCode - Mã phiếu nhập/xuất
     * @param {string} type - Loại phiếu (import/export)
     */
    showReceiptDetail(receiptCode, type) {
        // Lưu thông tin phiếu hiện tại
        this.currentReceiptCode = receiptCode;
        this.currentReceiptType = type;

        // Tìm phiếu trong bộ nhớ cache (dữ liệu đã tải từ DataTable)
        let receiptData = null;
        if (type === 'import') {
            receiptData = this.datatables.import.rows().data().toArray()
                .find(item => item.receiptCode === receiptCode);
        } else {
            receiptData = this.datatables.export.rows().data().toArray()
                .find(item => item.receiptCode === receiptCode);
        }

        if (!receiptData) {
            showNotification('error', 'Lỗi', 'Không tìm thấy thông tin phiếu');
            return;
        }
        console.log('Receipt data:', receiptData);

        // Gọi API để lấy chỉ danh sách sản phẩm của phiếu
        this.inventoryService.getReceiptDetailByCode(receiptCode)
            .then(itemsData => {
                // Gộp thông tin phiếu với danh sách sản phẩm
                const completeData = {
                    ...receiptData,
                    items: itemsData
                };

                // Hiển thị modal tương ứng
                if (type === 'import') {
                    this.populateImportDetailModal(completeData);
                    this.importDetailModal.show();
                } else {
                    this.populateExportDetailModal(completeData);
                    this.exportDetailModal.show();
                }
            })
            .catch(error => {
                console.error('Error fetching receipt items:', error);
                showNotification('error', 'Lỗi', 'Không thể tải danh sách sản phẩm');
            });
    }

    /**
 * Điền thông tin vào modal chi tiết phiếu nhập
 * @param {Object} data - Dữ liệu chi tiết phiếu
 */
    populateImportDetailModal(data) {
        // Fill header information
        this.detailImportId.textContent = data.receiptCode || '';
        this.detailImportDate.textContent = formatDate(data.createdAt) || '';
        this.detailSupplier.textContent = data.supplier || 'N/A';
        this.detailCreatedBy.textContent = data.createdByName || '';
        this.detailCreatedAt.textContent = formatDate(data.createdAt, true) || '';
        this.detailTotalValue.textContent = formatCurrency(data.totalValue) || '0 ₫';
        this.detailNotes.textContent = data.notes || 'Không có ghi chú';

        // Clear existing product rows
        this.detailProductTable.innerHTML = '';

        // Check if items exist
        if (data.items && data.items.length > 0) {
            // Fill product table
            data.items.forEach((item, index) => {
                const row = document.createElement('tr');
                const rowTotal = item.quantity * item.unitPrice;

                row.innerHTML = `
                <td>${index + 1}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="flex-shrink-0">
                            <img src="${"/asset/images/" + item.productImage || 'https://via.placeholder.com/40'}" alt="${item.productName}" width="40" class="rounded">
                        </div>
                        <div class="ms-2">
                            <div class="fw-medium">${item.productName}</div>
                            ${item.productAuthor ? `<small class="text-muted">${item.productAuthor}</small>` : ''}
                        </div>
                    </div>
                </td>
                <td>${item.quantity || 0}</td>
                <td>${formatCurrency(item.unitPrice) || '0 ₫'}</td>
                <td>${formatCurrency(rowTotal) || '0 ₫'}</td>
            `;

                this.detailProductTable.appendChild(row);
            });

            // Update footer totals
            this.detailTotalQuantity.textContent = data.totalQuantity || 0;
            this.detailTotalAmount.textContent = formatCurrency(data.totalValue) || '0 ₫';
        } else {
            // No items found
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="5" class="text-center">Không có dữ liệu sản phẩm</td>`;
            this.detailProductTable.appendChild(row);
        }
    }

    /**
     * Điền thông tin vào modal chi tiết phiếu xuất
     * @param {Object} data - Dữ liệu chi tiết phiếu
     */
    populateExportDetailModal(data) {
        // Fill header information
        this.detailExportId.textContent = data.receiptCode || '';
        this.detailExportDate.textContent = formatDate(data.createdAt) || '';

        // Xác định lý do xuất kho
        let exportReason = 'Khác';
        if (data.orderId) {
            exportReason = 'Bán hàng';
            // Hiển thị thông tin đơn hàng
            this.detailReferenceContainer.style.display = 'block';
            this.detailReference.textContent = `#${data.orderId}`;
        } else if (data.supplier) {
            exportReason = 'Trả nhà cung cấp';
            // Ẩn thông tin đơn hàng
            this.detailReferenceContainer.style.display = 'none';
        } else {
            // Ẩn thông tin đơn hàng
            this.detailReferenceContainer.style.display = 'none';
        }

        this.detailExportReason.textContent = exportReason;
        this.detailCreatedBy.textContent = data.createdByName || '';
        this.detailCreatedAt.textContent = formatDate(data.createdAt, true) || '';
        this.detailNotes.textContent = data.notes || 'Không có ghi chú';

        // Clear existing product rows
        this.exportDetailProductTable.innerHTML = '';

        // Check if items exist
        if (data.items && data.items.length > 0) {
            // Fill product table
            data.items.forEach((item, index) => {
                const row = document.createElement('tr');
                const rowTotal = item.quantity * item.unitPrice;

                row.innerHTML = `
                <td>${index + 1}</td>
                <td>
                     <div class="d-flex align-items-center">
                        <div class="flex-shrink-0">
                            <img src="${"/asset/images/" + item.productImage || 'https://via.placeholder.com/40'}" alt="${item.productName}" width="40" class="rounded">
                        </div>
                        <div class="ms-2">
                            <div class="fw-medium">${item.productName}</div>
                            ${item.productAuthor ? `<small class="text-muted">${item.productAuthor}</small>` : ''}
                        </div>
                    </div>
                </td>
                <td>${item.quantity || 0}</td>
                <td>${formatCurrency(item.unitPrice) || '0 ₫'}</td>
                <td>${formatCurrency(rowTotal) || '0 ₫'}</td>
            `;

                this.exportDetailProductTable.appendChild(row);
            });

            // Update footer totals
            this.exportDetailTotalQuantity.textContent = data.totalQuantity || 0;
            this.exportDetailTotalAmount.textContent = formatCurrency(data.totalValue) || '0 ₫';
        } else {
            // No items found - hiển thị thông báo loading hoặc không có dữ liệu
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="5" class="text-center">Không có dữ liệu sản phẩm</td>`;
            this.exportDetailProductTable.appendChild(row);
        }
    }

    /**
     * In phiếu nhập/xuất kho
     * @param {string} type - Loại phiếu (import/export)
     */
    printReceipt(type) {
        if (!this.currentReceiptId) {
            showNotification('warning', 'Cảnh báo', 'Không tìm thấy mã phiếu để in');
            return;
        }

        this.printReceiptByCode(this.currentReceiptId, type);
    }

    /**
     * In phiếu nhập/xuất kho theo mã
     * @param {string} receiptCode - Mã phiếu
     * @param {string} type - Loại phiếu (import/export)
     */
    printReceiptByCode(receiptCode, type) {
        // Gọi API để lấy thông tin chi tiết phiếu
        this.inventoryService.getReceiptDetailByCode(receiptCode)
            .then(data => {
                // Tạo nội dung phiếu để in
                const printContent = this.createPrintContent(data, type);

                // Tạo iframe ẩn để in
                const printFrame = document.createElement('iframe');
                printFrame.style.display = 'none';
                document.body.appendChild(printFrame);

                printFrame.contentDocument.write(printContent);
                printFrame.contentDocument.close();

                // Đợi iframe load xong và in
                printFrame.onload = function () {
                    setTimeout(() => {
                        printFrame.contentWindow.print();
                        document.body.removeChild(printFrame);
                    }, 500);
                };
            })
            .catch(error => {
                console.error('Error printing receipt:', error);
                showNotification('error', 'Lỗi', 'Không thể in phiếu');
            });
    }

    /**
     * Tạo nội dung HTML để in phiếu
     * @param {Object} data - Dữ liệu chi tiết phiếu
     * @param {string} type - Loại phiếu (import/export)
     * @returns {string} - Nội dung HTML
     */
    createPrintContent(data, type) {
        const title = type === 'import' ? 'PHIẾU NHẬP KHO' : 'PHIẾU XUẤT KHO';
        const receiptType = type === 'import' ? 'nhập' : 'xuất';

        let itemsHtml = '';
        let totalAmount = 0;

        if (data.items && data.items.length > 0) {
            data.items.forEach((item, index) => {
                const rowTotal = item.quantity * item.unitPrice;
                totalAmount += rowTotal;

                itemsHtml += `
                    <tr>
                        <td style="text-align: center">${index + 1}</td>
                        <td>${item.productName || ''}</td>
                        <td style="text-align: center">${item.quantity || 0}</td>
                        <td style="text-align: right">${formatCurrency(item.unitPrice) || '0 ₫'}</td>
                        <td style="text-align: right">${formatCurrency(rowTotal) || '0 ₫'}</td>
                    </tr>
                `;
            });
        } else {
            itemsHtml = `<tr><td colspan="5" style="text-align: center">Không có dữ liệu sản phẩm</td></tr>`;
        }

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${title} - ${data.receiptCode}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 20px;
                        font-size: 14px;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .shop-name {
                        font-size: 22px;
                        font-weight: bold;
                        margin-bottom: 5px;
                    }
                    .title {
                        font-size: 18px;
                        font-weight: bold;
                        margin-bottom: 10px;
                    }
                    .receipt-code {
                        font-weight: bold;
                    }
                    .info-container {
                        margin-bottom: 20px;
                    }
                    .info-row {
                        display: flex;
                        margin-bottom: 5px;
                    }
                    .info-label {
                        width: 120px;
                        font-weight: bold;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                    }
                    th {
                        background-color: #f2f2f2;
                        text-align: left;
                    }
                    .footer {
                        margin-top: 30px;
                    }
                    .signature-container {
                        display: flex;
                        justify-content: space-between;
                        margin-top: 50px;
                    }
                    .signature-box {
                        text-align: center;
                        width: 30%;
                    }
                    .signature-title {
                        font-weight: bold;
                        margin-bottom: 50px;
                    }
                    .total-row {
                        font-weight: bold;
                    }
                    @media print {
                        @page {
                            size: A4;
                            margin: 1cm;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="shop-name">BOOKSHOP</div>
                    <div class="title">${title}</div>
                    <div class="receipt-code">Mã phiếu: ${data.receiptCode}</div>
                </div>
                
                <div class="info-container">
                    <div class="info-row">
                        <div class="info-label">Ngày ${receiptType}:</div>
                        <div>${formatDate(data.createdAt)}</div>
                    </div>
                    ${type === 'import' ? `
                    <div class="info-row">
                        <div class="info-label">Nhà cung cấp:</div>
                        <div>${data.supplier || 'N/A'}</div>
                    </div>
                    ` : `
                    <div class="info-row">
                        <div class="info-label">Lý do xuất:</div>
                        <div>${data.orderId ? 'Bán hàng' : (data.supplier ? 'Trả nhà cung cấp' : 'Khác')}</div>
                    </div>
                    ${data.orderId ? `
                    <div class="info-row">
                        <div class="info-label">Đơn hàng:</div>
                        <div>#${data.orderId}</div>
                    </div>
                    ` : ''}
                    ${data.supplier && type === 'export' ? `
                    <div class="info-row">
                        <div class="info-label">Nhà cung cấp:</div>
                        <div>${data.supplier}</div>
                    </div>
                    ` : ''}
                    `}
                    <div class="info-row">
                        <div class="info-label">Người ${receiptType}:</div>
                        <div>${data.createdByName || ''}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Ghi chú:</div>
                        <div>${data.notes || 'Không có ghi chú'}</div>
                    </div>
                </div>
                
                <table>
                    <thead>
                        <tr>
                            <th style="width: 5%; text-align: center">STT</th>
                            <th style="width: 45%">Sản phẩm</th>
                            <th style="width: 10%; text-align: center">Số lượng</th>
                            <th style="width: 20%; text-align: right">Đơn giá</th>
                            <th style="width: 20%; text-align: right">Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                    <tfoot>
                        <tr class="total-row">
                            <td colspan="2" style="text-align: right">Tổng cộng:</td>
                            <td style="text-align: center">${data.totalQuantity || 0}</td>
                            <td></td>
                            <td style="text-align: right">${formatCurrency(totalAmount) || '0 ₫'}</td>
                        </tr>
                    </tfoot>
                </table>
                
                <div class="footer">
                    <div style="margin-bottom: 10px">Số tiền bằng chữ: ${this.numberToWords(totalAmount)} đồng.</div>
                </div>
                
                <div class="signature-container">
                    <div class="signature-box">
                        <div class="signature-title">Người lập phiếu</div>
                        <div>${data.createdByName || ''}</div>
                    </div>
                    <div class="signature-box">
                        <div class="signature-title">Người ${type === 'import' ? 'giao hàng' : 'nhận hàng'}</div>
                        <div></div>
                    </div>
                    <div class="signature-box">
                        <div class="signature-title">Thủ kho</div>
                        <div></div>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    /**
     * Chuyển đổi số thành chữ (tiếng Việt)
     * @param {number} number - Số cần chuyển đổi
     * @returns {string} - Chuỗi số bằng chữ
     */
    numberToWords(number) {
        // Danh sách từ ngữ
        const units = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín', 'mười', 'mười một', 'mười hai', 'mười ba', 'mười bốn', 'mười lăm', 'mười sáu', 'mười bảy', 'mười tám', 'mười chín'];
        const tens = ['', '', 'hai mươi', 'ba mươi', 'bốn mươi', 'năm mươi', 'sáu mươi', 'bảy mươi', 'tám mươi', 'chín mươi'];

        // Hàm đọc hàng trăm
        const readHundreds = (num) => {
            let result = '';

            // Hàng trăm
            const hundred = Math.floor(num / 100);
            if (hundred > 0) {
                result += units[hundred] + ' trăm ';
            }

            // Hàng chục và đơn vị
            const remainder = num % 100;
            if (remainder > 0) {
                if (remainder < 20) {
                    result += units[remainder];
                } else {
                    const ten = Math.floor(remainder / 10);
                    const unit = remainder % 10;

                    result += tens[ten];
                    if (unit === 1) {
                        result += ' mốt';
                    } else if (unit === 5) {
                        result += ' lăm';
                    } else if (unit > 0) {
                        result += ' ' + units[unit];
                    }
                }
            } else if (result !== '') {
                // Nếu các chữ số hàng chục và đơn vị là 0, thì không cần thêm gì
            }

            return result;
        };

        // Nếu số là 0
        if (number === 0) {
            return 'không';
        }

        // Chuyển số thành chuỗi và tạo mảng các nhóm 3 chữ số
        const numStr = Math.floor(number).toString();
        const groups = [];

        for (let i = numStr.length; i > 0; i -= 3) {
            const start = Math.max(0, i - 3);
            groups.unshift(parseInt(numStr.substring(start, i)));
        }

        // Danh sách đơn vị tính
        const groupNames = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ'];

        // Đọc từng nhóm
        let result = '';
        for (let i = 0; i < groups.length; i++) {
            const group = groups[i];
            const groupStr = readHundreds(group);

            if (groupStr !== '') {
                result += groupStr + ' ' + groupNames[groups.length - i - 1] + ' ';
            }
        }

        // Format kết quả
        result = result.trim();
        result = result.charAt(0).toUpperCase() + result.slice(1);

        return result;
    }
}