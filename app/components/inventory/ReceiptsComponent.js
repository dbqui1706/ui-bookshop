import { EventBus } from "../../core/eventBus.js";
import { getToken } from "../../core/storage.js";
import { showNotification, formatDate, formatCurrency } from "../../core/utils.js";
import { inventoryService } from "../../services/InventoryService.js";

export class ReciptsComponent {
    constructor() {
        // service
        this.inventoryService = inventoryService.getInstance();
        this.eventBus = EventBus.getInstance();

        // DOM elements
        this.productSearchModal = document.getElementById("productSearchModal");
        this.searchKeyword = document.getElementById("searchKeyword");
        this.stockFilter = document.getElementById("stockFilter");
        this.searchButton = document.getElementById("searchButton");
        this.resetFiltersBtn = document.getElementById("resetFilters");
        this.tableProducts = document.getElementById("table-products");

        this.formTypeRadios = document.querySelectorAll('input[name="formType"]');
        this.importForm = document.getElementById("importForm");
        this.productTable = document.getElementById("productTable");
        this.productTableBody = this.productTable.querySelector("tbody");
        this.saveBtn = document.getElementById("saveBtn");
        this.importNotes = document.getElementById("importNotes");

        this.totalQuantity = document.getElementById("totalQuantity");
        this.totalProducts = document.getElementById("totalProducts");
        this.totalAmount = document.getElementById("totalAmount");

        // Variables
        this.receiptType = "import"; // Default type
        this.selectedProducts = new Map(); // Map to store selected products (key: productId, value: product object)
        this.dataTableProducts = null;

        // Initialize component
        this.initialize();
    }

    initialize() {
        // Setup event listeners
        this.setupEventListeners();

        // Setup initial state
        this.updateSummary();
    }

    setupEventListeners() {
        // Search modal events
        this.productSearchModal.addEventListener('show.bs.modal', () => this.onSearchModalShow());
        this.searchButton.addEventListener('click', () => this.searchProducts());
        this.searchKeyword.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') this.searchProducts();
        });
        this.resetFiltersBtn.addEventListener('click', () => this.resetFilters());
        this.stockFilter.addEventListener('change', () => this.searchProducts());

        // Form type selection events
        this.formTypeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.receiptType = e.target.value;
                document.getElementById('table-tile').textContent = this.receiptType === 'import' ? 'Danh sách Nhập kho' : 'Danh sách Xuất kho';
                this.saveBtn.textContent = this.receiptType === 'import' ? 'Lưu phiếu Nhập kho' : 'Lưu phiếu Xuất kho';
            });
        });

        // Save button event
        this.saveBtn.addEventListener('click', () => this.saveReceipt());

        // Product table events (delegated)
        this.productTableBody.addEventListener('input', (e) => {
            if (e.target.matches('.product-quantity, .product-price')) {
                const row = e.target.closest('tr');
                const productId = row.dataset.productId;

                // Update the stored product data
                if (this.selectedProducts.has(productId)) {
                    const product = this.selectedProducts.get(productId);

                    if (e.target.classList.contains('product-quantity')) {
                        product.quantity = parseInt(e.target.value) || 1;
                    } else if (e.target.classList.contains('product-price')) {
                        product.price = parseFloat(e.target.value) || 0;
                    }

                    // Update row total
                    this.updateRowTotal(row);

                    // Update summary
                    this.updateSummary();
                }
            }
        });

        // Remove product button (delegated)
        this.productTableBody.addEventListener('click', (e) => {
            if (e.target.matches('.remove-product-btn, .remove-product-btn *')) {
                const row = e.target.closest('tr');
                const productId = row.dataset.productId;

                // Remove from selected products
                this.selectedProducts.delete(productId);

                // Remove row
                row.remove();

                // Update summary
                this.updateSummary();
            }
        });
    }

    onSearchModalShow() {
        if (!this.dataTableProducts) {
            this.initDataTableSearchProducts();
        } else {
            this.dataTableProducts.ajax.reload();
        }
    }

    initDataTableSearchProducts() {
        this.dataTableProducts = $(this.tableProducts).DataTable({
            ajax: {
                url: "http://localhost:8080/api/admin/inventory/inventory-products",
                type: 'GET',
                headers: {
                    Authorization: `Bearer ${getToken()}`
                },
                data: (d) => {
                    // Add custom search parameters
                    d.search = this.searchKeyword.value || '';
                    d.stockFilter = this.stockFilter.value || '';
                    return d;
                },
                error: (xhr, error, thrown) => {
                    console.error('DataTable error:', error, thrown);
                    showNotification('error', 'Lỗi', 'Không thể tải dữ liệu: ' + thrown);
                },

            },
            processing: true,
            serverSide: true,
            searching: false, // We handle searching ourselves
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
                {
                    data: "id",
                    title: "Mã SP",
                },
                {
                    data: null,
                    render: function (data, type, row) {
                        return `<div class="d-flex align-items-center">
                            <div class="flex-shrink-0">
                                <img src="${"/asset/images/" + row.imageName || 'https://via.placeholder.com/40'}" alt="${row.name}" width="40" class="rounded">
                            </div>
                            <div class="ms-2">
                                <div class="fw-medium">${row.name}</div>
                                ${row.author ? `<small class="text-muted">${row.author}</small>` : ''}
                            </div>
                        </div>`;
                    }
                },
                {
                    data: "categories",
                    title: "Danh mục",
                    render: function (data) {
                        if (!data) return '';
                        const categories = data.split(',');
                        return categories.map(cat =>
                            `<span class="badge bg-secondary">${cat.trim()}</span>`
                        ).join(' ');
                    }
                },
                {
                    data: "price",
                    title: "Đơn giá",
                    render: function (data) {
                        return formatCurrency(data);
                    }
                },
                {
                    data: 'actualQuantity',
                    title: "Tồn kho",
                },
                {
                    data: 'reservedQuantity',
                    title: "Đã đặt",
                },
                {
                    data: 'stockStatus',
                    title: "Trạng thái",
                    render: function (data) {
                        const map = {
                            'out_of_stock': 'Hết hàng',
                            'low_stock': 'Còn ít',
                            'medium_stock': 'Còn vừa',
                            'high_stock': 'Còn nhiều',
                        };
                        const stockClass = this.getStockColorClass(data);
                        return `<span class="badge ${stockClass}">
                            ${map[data] || 'Không xác định'}
                        </span>`;
                    }.bind(this)
                },
                {
                    data: null,
                    title: "Thao tác",
                    orderable: false,
                    render: function (data) {
                        const isSelected = this.selectedProducts.has(data.id.toString());

                        if (isSelected) {
                            return `
                                <button class="btn btn-sm btn-danger product-toggle-select" data-product-id="${data.id}">
                                    <i class="bi bi-x-circle me-1"></i>Hủy chọn
                                </button>
                            `;
                        } else {
                            return `
                                <button class="btn btn-sm btn-success product-toggle-select" data-product-id="${data.id}">
                                    <i class="bi bi-check-circle me-1"></i>Chọn
                                </button>
                            `;
                        }
                    }.bind(this)
                }
            ],
            rowCallback: (row, data) => {
                // Add click handler for select/deselect buttons
                $(row).find('.product-toggle-select').on('click', () => {
                    this.toggleProductSelection(data);
                });
            }
        });
    }

    getStockColorClass(stockStatus) {
        switch (stockStatus) {
            case 'out_of_stock': return 'bg-danger';
            case 'low_stock': return 'bg-warning';
            case 'medium_stock': return 'bg-info';
            case 'high_stock': return 'bg-success';
            default: return 'bg-secondary';
        }
    }

    getStockBadgeClass(stockStatus) {
        switch (stockStatus) {
            case 'out_of_stock': return 'danger';
            case 'low_stock': return 'warning';
            case 'medium_stock': return 'info';
            case 'high_stock': return 'success';
            default: return 'secondary';
        }
    }

    searchProducts() {
        if (this.dataTableProducts) {
            this.dataTableProducts.ajax.reload();
        }
    }

    resetFilters() {
        this.searchKeyword.value = '';
        this.stockFilter.value = '';
        this.searchProducts();
    }

    toggleProductSelection(product) {
        const productId = product.id.toString();

        if (this.selectedProducts.has(productId)) {
            // Product is already selected, remove it
            this.selectedProducts.delete(productId);
            this.removeProductRow(productId);
        } else {
            // Product is not selected, add it
            // Calculate default price based on receipt type
            const defaultPrice = this.receiptType === 'import'
                ? (product.lastImportPrice > 0 ? product.lastImportPrice : Math.round(product.price * 0.8))
                : product.price;

            // Add product to selection with default quantity = 1
            const productWithQty = {
                ...product,
                quantity: 1,
                price: defaultPrice
            };

            this.selectedProducts.set(productId, productWithQty);
            this.addProductRow(productWithQty);
        }

        // Refresh the row in datatable to update the button
        this.searchProducts();

        // Update summary
        this.updateSummary();
    }

    addProductRow(product) {
        const row = document.createElement('tr');
        row.dataset.productId = product.id;

        const rowTotal = product.quantity * product.price;

        row.innerHTML = `
            <td>
                <div class="fw-medium">${product.name}</div>
                <small class="text-muted">${product.author || ''}</small>
            </td>
            <td>
                <span class="form-control product-available">${product.actualQuantity}</span>
            </td>
            <td>
                <input type="number" class="form-control product-quantity" min="1" value="${product.quantity}">
            </td>
            <td>
                <input type="number" class="form-control product-price" min="0" value="${product.price}">
            </td>
            <td>
                <span class="row-total">${formatCurrency(rowTotal)}</span>
            </td>
            <td class="text-center">
                <button type="button" class="btn btn-sm btn-outline-danger remove-product-btn">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;

        this.productTableBody.appendChild(row);
    }

    removeProductRow(productId) {
        const row = this.productTableBody.querySelector(`tr[data-product-id="${productId}"]`);
        if (row) {
            row.remove();
        }
    }

    updateRowTotal(row) {
        console.log(
            "Updating row total for row:", row.dataset.productId,
            "Quantity:", row.querySelector('.product-quantity').value,
            "Price:", row.querySelector('.product-price').value
        )
        const quantity = parseInt(row.querySelector('.product-quantity').value) || 0;
        const price = parseFloat(row.querySelector('.product-price').value) || 0;
        const total = quantity * price;

        row.querySelector('.row-total').textContent = formatCurrency(total);
    }

    updateSummary() {
        let totalQuantity = 0;
        let totalAmount = 0;

        // Calculate from selected products
        this.selectedProducts.forEach(product => {
            totalQuantity += product.quantity;
            totalAmount += product.quantity * product.price;
        });

        // Update the summary elements
        this.totalQuantity.textContent = totalQuantity;
        this.totalProducts.textContent = this.selectedProducts.size;
        this.totalAmount.textContent = formatCurrency(totalAmount);
    }

    validateForm() {
        // Check if there are any products selected
        if (this.selectedProducts.size === 0) {
            showNotification('error', 'Lỗi', 'Vui lòng chọn ít nhất một sản phẩm');
            return false;
        }

        // Check quantities and prices
        let isValid = true;

        this.selectedProducts.forEach(product => {
            if (product.quantity <= 0) {
                showNotification('error', 'Lỗi', `Số lượng của sản phẩm "${product.name}" phải lớn hơn 0`);
                isValid = false;
            }

            if (product.price < 0) {
                showNotification('error', 'Lỗi', `Giá của sản phẩm "${product.name}" không thể âm`);
                isValid = false;
            }

            // For export receipts, check if quantity doesn't exceed stock
            if (this.receiptType === 'export') {
                const availableStock = product.actualQuantity || 0;
                if (product.quantity > availableStock) {
                    showNotification('error', 'Lỗi', `Số lượng xuất của sản phẩm "${product.name}" (${product.quantity}) vượt quá số lượng tồn kho (${availableStock})`);
                    isValid = false;
                }
            }
        });

        return isValid;
    }

    collectFormData() {
        // Basic receipt data
        const receiptData = {
            receiptType: this.receiptType,
            status: 'draft',
            notes: this.importNotes.value,
            items: []
        };

        // Add items from selected products
        this.selectedProducts.forEach(product => {
            receiptData.items.push({
                productId: product.id,
                quantity: product.quantity,
                unitPrice: product.price
            });
        });

        // Calculate totals
        receiptData.totalItems = receiptData.items.length;
        receiptData.totalQuantity = receiptData.items.reduce((sum, item) => sum + item.quantity, 0);

        return receiptData;
    }

    saveReceipt() {
        if (!this.validateForm()) {
            return;
        }

        const formData = this.collectFormData();

        // Call service to save receipt
        this.inventoryService.createReceipt(formData)
            .then(response => {
                showNotification('success', 'Thành công', `Phiếu ${this.receiptType === 'import' ? 'nhập' : 'xuất'} kho đã được tạo`);

                // Redirect to receipt list page
                setTimeout(() => {
                    window.location.href = 'inventory-management.html';
                }, 1500);
            })
            .catch(error => {
                console.error('Error saving receipt:', error);
                showNotification('error', 'Lỗi', 'Không thể lưu phiếu. Vui lòng thử lại sau.');
            });
    }
}