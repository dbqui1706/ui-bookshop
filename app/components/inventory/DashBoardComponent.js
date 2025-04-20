import { EventBus } from '../../core/eventBus.js';
import { formatDate, showNotification, showConfirmDialog } from '../../core/utils.js';
import { getToken } from '../../core/storage.js';
import { inventoryService } from '../../services/InventoryService.js';

export class DashBoardComponent {
    constructor() {
        // Lấy service
        this.eventBus = EventBus.getInstance();
        this.inventoryService = inventoryService.getInstance();

        // Khởi tạo biểu đồ
        this.trendChart = null;
        this.distributionChart = null;
        this.inventoryTable = null;

        // Khởi tạo element DOM
        this.inventoryTrendChart = document.getElementById('inventoryTrendChart');
        this.inventoryDistributionChart = document.getElementById('inventoryDistributionChart');

        // các element cho bộ lọc tồn kho
        this.timeRangeFilter = document.getElementById('timeRangeFilter');
        this.stockFilter = document.getElementById('stockFilter');
        this.durationFilter = document.getElementById('durationFilter');
        this.customDurationDiv = document.getElementById('customDurationDiv');
        this.dateRangeDiv = document.getElementById('dateRangeDiv');
        this.dateRangeEndDiv = document.getElementById('dateRangeEndDiv');
        this.searchProduct = document.getElementById('searchProduct');

        // buttons
        this.resetFilterBtn = document.getElementById('resetFilterBtn');
        this.applyFilterBtn = document.getElementById('applyFilterBtn');

        // Thiết lập thời gian mặc định
        this.currentPeriod = 'day';



        // Khởi tạo component
        this.initialize();
    }

    /**
     * Khởi tạo component
     */
    initialize() {
        this.setupEventListeners();
        this.loadDashboardData();
        this.initializeDataTable();
        this.loadRecentActivity();
    }

    /**
     * Thiết lập các event listeners
     */
    setupEventListeners() {
        // Event cho nút lọc thời gian
        document.getElementById('filterDay').addEventListener('click', () => {
            this.updatePeriodFilter('day');
        });

        document.getElementById('filterWeek').addEventListener('click', () => {
            this.updatePeriodFilter('week');
        });

        document.getElementById('filterMonth').addEventListener('click', () => {
            this.updatePeriodFilter('month');
        });

        document.getElementById('filterQuarter').addEventListener('click', () => {
            this.updatePeriodFilter('quarter');
        });

        // Event cho các nút trong biểu đồ xu hướng
        document.querySelectorAll('.chart-card .btn-group .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const period = e.target.dataset.period;
                this.updateChartPeriod(period);

                // Set nút active
                e.target.closest('.btn-group').querySelectorAll('.btn').forEach(b => {
                    b.classList.remove('active');
                });
                e.target.classList.add('active');
            });
        });

        // // Event cho bộ lọc tồn kho
        // document.getElementById('stockFilter').addEventListener('change', (e) => {
        //     this.inventoryTable.search('').columns().search('').draw();

        //     const filterValue = e.target.value;
        //     if (filterValue !== 'all') {
        //         this.inventoryTable.column(8).search(filterValue).draw();
        //     } else {
        //         this.inventoryTable.column(8).search('').draw();
        //     }
        // });
    }

    /**
     * Thiết lập bộ lọc thời gian
     * @param {string} period - Khoảng thời gian (day, week, month, quarter)
     */
    async updatePeriodFilter(period) {
        this.currentPeriod = period;

        // Set active button
        document.querySelectorAll('#filterDay, #filterWeek, #filterMonth, #filterQuarter').forEach(btn => {
            btn.classList.remove('btn-light');
            btn.classList.add('btn-outline-light');
        });

        document.getElementById(`filter${period.charAt(0).toUpperCase() + period.slice(1)}`).classList.remove('btn-outline-light');
        document.getElementById(`filter${period.charAt(0).toUpperCase() + period.slice(1)}`).classList.add('btn-light');

        // Cập nhật dữ liệu
        await this.loadDashboardData();
    }

    /**
     * Tải dữ liệu dashboard
     */
    async loadDashboardData() {
        try {

            // Tải dữ liệu thống kê
            // const stats = await this.inventoryService.getInventoryStats(this.currentPeriod);
            // this.updateStatsDisplay(stats);

            // Tải xu hướng tồn kho
            const trends = await this.inventoryService.getInventoryTrends(this.currentPeriod);
            this.renderInventoryTrendChart(trends);

            // Tải phân bố tồn kho
            const distribution = await this.inventoryService.getInventoryDistribution();
            this.renderInventoryDistributionChart(distribution);

        } catch (error) {
            showNotification('error', 'Lỗi', error.message || 'Không thể tải dữ liệu dashboard');
        }
    }

    /**
     * Cập nhật hiển thị thống kê
     * @param {Object} stats - Dữ liệu thống kê
     */
    updateStatsDisplay(stats) {
        // Cập nhật thông tin thống kê
        document.getElementById('totalProducts').textContent = stats.totalProducts.toLocaleString();
        document.getElementById('stockValue').textContent = stats.stockValue;
        document.getElementById('lowStockCount').textContent = stats.lowStockCount.toLocaleString();
        document.getElementById('outOfStock').textContent = stats.outOfStock.toLocaleString();

        // Cập nhật % thay đổi
        this.updateChangePercent('totalProducts', stats.changePercent.totalProducts, this.currentPeriod);
        this.updateChangePercent('stockValue', stats.changePercent.stockValue, this.currentPeriod);
        this.updateChangePercent('lowStockCount', stats.changePercent.lowStockCount, this.currentPeriod);
        this.updateChangePercent('outOfStock', stats.changePercent.outOfStock, this.currentPeriod);
    }

    /**
     * Cập nhật % thay đổi
     * @param {string} elementId - ID của phần tử
     * @param {number} percent - Phần trăm thay đổi
     * @param {string} period - Khoảng thời gian
     */
    updateChangePercent(elementId, percent, period) {
        const element = document.getElementById(elementId).nextElementSibling.nextElementSibling;
        const isPositive = percent > 0;
        const icon = isPositive ? 'bi-arrow-up-short' : 'bi-arrow-down-short';
        const trendClass = isPositive ? 'up' : 'down';

        // Xác định chuỗi so sánh theo thời gian
        let timeCompare = '';
        switch (period) {
            case 'day':
                timeCompare = 'so với hôm qua';
                break;
            case 'week':
                timeCompare = 'so với tuần trước';
                break;
            case 'month':
                timeCompare = 'so với tháng trước';
                break;
            case 'quarter':
                timeCompare = 'so với quý trước';
                break;
        }

        element.className = `trend ${trendClass}`;
        element.innerHTML = `<i class="bi ${icon}"></i> ${Math.abs(percent)}% ${timeCompare}`;
    }

    /**
     * Khởi tạo DataTable cho bảng tồn kho
     */
    initializeDataTable() {
        // Thiết lập các sự kiện cho bộ lọc
        this.setupFilterEvents();

        // Khởi tạo datepicker
        this.setupDatePicker();

        // Khởi tạo DataTable
        this.inventoryTable = new DataTable('#inventoryTable', {
            processing: true,
            serverSide: true,
            ajax: {
                url: 'http://localhost:8080/api/admin/inventory/inventory-status',
                type: 'GET',
                data: (d) => {
                    // Các tham số lọc như cũ
                    d.stockStatus = this.stockFilter.value;
                    d.category = document.getElementById('categoryFilter').value;

                    // Các tham số lọc khác
                    if (this.durationFilter.value === 'custom') {
                        d.durationDays = document.getElementById('customDuration').value;
                    } else {
                        d.durationDays = this.durationFilter.value;
                    }

                    d.timeRange = this.timeRangeFilter.value;
                    if (this.timeRangeFilter.value === 'custom') {
                        d.startDate = document.getElementById('startDate').value;
                        d.endDate = document.getElementById('endDate').value;
                    }

                    return d;
                },
                beforeSend: (xhr) => {
                    xhr.setRequestHeader('Authorization', `Bearer ${getToken()}`);
                },
                error: (xhr, error, thrown) => {
                    console.error('DataTable error:', error, thrown);
                    showNotification('error', 'Lỗi', 'Không thể tải dữ liệu tồn kho: ' + thrown);
                },

            },
            // Không thay đổi phần columns nhưng hãy đảm bảo tên cột khớp với tên thuộc tính trong JSON
            columns: [
                {
                    data: 'productId', render: function (data) {
                        return String(data);
                    }
                },
                {
                    data: null,
                    render: function (data, type, row) {
                        return `
                            <div class="d-flex align-items-center">
                                <img src="${"/asset/images/" + row.image || '/img/no-image.png'}" class="rounded me-2" 
                                     alt="${row.productName}" width="40" height="40">
                                <div>
                                    <div>${row.productName}</div>
                                    <small class="text-muted">${row.author || ''}</small>
                                </div>
                            </div>
                        `;
                    }
                },
                { data: 'stock', className: 'text-end' },
                { data: 'reserved', className: 'text-end' },
                { data: 'available', className: 'text-end' },
                { data: 'threshold', className: 'text-end' },
                {
                    data: 'storageDays',
                    className: 'text-end',
                    render: function (data) {
                        let className = '';
                        return `<span class="${className}">${data}</span>`;
                    }
                },
                {
                    data: 'daysSinceLastSale',
                    className: 'text-end',
                    render: function (data, type, row) {
                        let className = '';
                        return `<span class="${className}">${data}</span>`;
                    }
                },
                {
                    data: 'lastUpdated',
                    render: function (data) {
                        return formatDate(data);
                    }
                },
                {
                    data: 'price',
                    className: 'text-end',
                    render: function (data) {
                        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data);
                    }
                },
                {
                    data: 'inventoryValue',
                    className: 'text-end',
                    render: function (data) {
                        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data);
                    }
                },
                {
                    data: 'status',
                    render: function (data) {
                        let statusClass, statusText;
                        switch (data) {
                            case 'normal':
                                statusClass = 'badge-normal';
                                statusText = 'Bình thường';
                                break;
                            case 'low':
                                statusClass = 'badge-low';
                                statusText = 'Sắp hết';
                                break;
                            case 'out':
                                statusClass = 'badge-out';
                                statusText = 'Hết hàng';
                                break;
                            default:
                                statusClass = 'badge-secondary';
                                statusText = data;
                        }
                        return `<span class="badge badge-stock ${statusClass}">${statusText}</span>`;
                    }
                },
                {
                    data: null,
                    orderable: false,
                    render: function (data) {
                        return `
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-sm btn-outline-primary btn-action" title="Chi tiết" 
                                    data-id="${data.productId}" data-action="detail">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-success btn-action" title="Nhập kho" 
                                    data-id="${data.productId}" data-action="import" ${data.status === 'out' ? '' : ''}>
                                <i class="bi bi-plus-circle"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger btn-action" title="Xuất kho" 
                                    data-id="${data.productId}" data-action="export" ${data.available <= 0 ? 'disabled' : ''}>
                                <i class="bi bi-dash-circle"></i>
                            </button>
                        </div>
                    `;
                    }
                }
            ],
            // Các cấu hình khác...
            responsive: true,
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/vi.json'
            },
            order: [[6, 'desc']], // Sắp xếp theo số ngày tồn kho
            dom: '<"d-flex justify-content-between align-items-center"<"d-flex"l><"d-flex"f>>rt<"d-flex justify-content-between align-items-center"ip>',
            lengthMenu: [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "Tất cả"]],
            pageLength: 5,
            pagingType: 'simple_numbers',
            drawCallback: () => {
                // Thêm sự kiện cho các nút thao tác
                // this.addActionButtonEventListeners();
            },

        });
    }

    /**
     * Xử lý hành động xem chi tiết
     * @param {string} id - ID sản phẩm
     */
    handleDetailAction(id) {
        // Chuyển đến trang chi tiết sản phẩm
        window.location.href = `/product-detail.html?id=${id}`;
    }

    /**
     * Xử lý hành động nhập kho
     * @param {string} id - ID sản phẩm
     */
    handleImportAction(id) {
        // Điều hướng hoặc mở modal nhập kho
        window.location.href = `/inventory-import.html?id=${id}`;
    }

    /**
     * Xử lý hành động xuất kho
     * @param {string} id - ID sản phẩm
     */
    handleExportAction(id) {
        // Điều hướng hoặc mở modal xuất kho
        window.location.href = `/inventory-export.html?id=${id}`;
    }

    /**
     * Tải dữ liệu hoạt động gần đây
     */
    async loadRecentActivity() {
        try {
            // Tải dữ liệu nhập kho gần đây
            const imports = await this.inventoryService.getRecentImports();
            this.renderRecentImports(imports);

            // Tải dữ liệu xuất kho gần đây
            const exports = await this.inventoryService.getRecentExports();
            this.renderRecentExports(exports);

        } catch (error) {
            showNotification('error', 'Lỗi', 'Không thể tải dữ liệu hoạt động gần đây');
        }
    }

    /**
     * Hiển thị dữ liệu nhập kho gần đây
     * @param {Array} imports - Danh sách nhập kho
     */
    renderRecentImports(imports) {
        const importTbody = document.getElementById('recentImportTbody');
        importTbody.innerHTML = '';

        imports.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${"/asset/images/" + item.productImage || '/img/no-image.png'}" class="rounded me-2" 
                                alt="${item.productName}" width="40" height="40">
                        <div>
                            <div>${item.productName}</div>
                            <small class="text-muted">${item.productAuthor || ''}</small>
                        </div>
                    </div>
                </td>
                <td>${item.quantity}</td>
                <td>${formatDate(item.date)}</td>
                <td>${item.createdByName}</td>
            `;
            importTbody.appendChild(row);
        });
    }

    /**
     * Hiển thị dữ liệu xuất kho gần đây
     * @param {Array} exports - Danh sách xuất kho
     */
    renderRecentExports(exports) {
        console.log(exports);
        const exportTbody = document.getElementById('recentExportTbody');
        exportTbody.innerHTML = '';

        exports.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${item.id}</td>
            <td>
                <div class="d-flex align-items-center">
                    <img src="${"/asset/images/" + item.productImage || '/img/no-image.png'}" class="rounded me-2" 
                            alt="${item.productName}" width="40" height="40">
                    <div>
                        <div>${item.productName}</div>
                        <small class="text-muted">${item.productAuthor || ''}</small>
                    </div>
                </div>
            </td>
            <td>${item.quantity}</td>
            <td>${item.reason}</td>
            <td>${formatDate(item.date)}</td>
        `;
            exportTbody.appendChild(row);
        });
    }

    /**
     * Cập nhật biểu đồ theo khoảng thời gian
     * @param {string} period - Khoảng thời gian
     */
    async updateChartPeriod(period) {
        try {
            const trends = await this.inventoryService.getInventoryTrends(period);
            this.renderInventoryTrendChart(trends);
        } catch (error) {
            showNotification('error', 'Lỗi', 'Không thể cập nhật biểu đồ');
        }
    }

    /**
     * Vẽ biểu đồ xu hướng tồn kho
     * @param {Array} trends - Dữ liệu xu hướng
     */
    renderInventoryTrendChart(trends) {
        // Hủy biểu đồ hiện tại nếu có
        if (this.trendChart) {
            this.trendChart.destroy();
        }

        const labels = trends.map(trend => trend.label);
        const values = trends.map(trend => trend.value);

        const ctx = this.inventoryTrendChart.getContext('2d');
        this.trendChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    data: values,
                    label: 'Giá trị tồn kho',
                    borderColor: '#0d6efd',
                    backgroundColor: 'rgba(13, 110, 253, 0.1)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                aspectRatio: 2.5,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Thời gian'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Giá trị'
                        },
                        ticks: {
                            // Định dạng số để dễ đọc
                            callback: function (value) {
                                if (value >= 1000000000) {
                                    return (value / 1000000000).toFixed(2) + ' tỷ';
                                }
                                if (value >= 1000000) {
                                    return (value / 1000000).toFixed(2) + ' triệu';
                                }
                                return value;
                            }
                        },
                        // Bắt đầu từ gần giá trị nhỏ nhất để biểu đồ không quá cao
                        min: Math.min(...values) * 0.95,
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                let value = context.raw;
                                if (value >= 1000000000) {
                                    return `Giá trị tồn kho: ${(value / 1000000000).toFixed(2)} tỷ`;
                                }
                                if (value >= 1000000) {
                                    return `Giá trị tồn kho: ${(value / 1000000).toFixed(2)} triệu`;
                                }
                                return `Giá trị tồn kho: ${value}`;
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Vẽ biểu đồ phân bố tồn kho
     * @param {Object} distribution - Dữ liệu phân bố
     */
    renderInventoryDistributionChart(distribution) {
        // Hủy biểu đồ hiện tại nếu có
        if (this.distributionChart) {
            this.distributionChart.destroy();
        }

        // Chuyển đổi dữ liệu từ mảng đối tượng thành định dạng cho biểu đồ
        const labels = distribution.map(item => item.category);
        const data = distribution.map(item => item.perByQuantity); // Sử dụng phần trăm theo số lượng

        // Tạo màu động dựa trên số lượng danh mục
        const colors = labels.map(label => this.generateColorFromString(label));
        const ctx = this.inventoryDistributionChart.getContext('2d');
        this.distributionChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors.slice(0, labels.length),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        display: true,
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const item = distribution[context.dataIndex];
                                return [
                                    `${item.category}: ${item.perByQuantity}%`,
                                    `Số lượng: ${item.totalQuantity}`,
                                    `Giá trị: ${(item.totalValue / 1000000).toFixed(2)} triệu`
                                ];
                            }
                        }
                    }
                }
            }
        });
    }

    // Tạo màu động dựa trên tên danh mục để đảm bảo tính nhất quán
    generateColorFromString = (str) => {
        // Tạo mã màu dựa trên chuỗi đầu vào
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }

        // Chuyển số hash thành màu hex dạng #RRGGBB
        let color = '#';
        for (let i = 0; i < 3; i++) {
            // Lấy giá trị từ 0-255 cho RGB
            const value = (hash >> (i * 8)) & 0xFF;
            // Điều chỉnh độ sáng để tránh màu quá tối hoặc quá sáng
            const adjustedValue = Math.max(Math.min(value, 220), 50);
            // Chuyển thành hex
            color += ('00' + adjustedValue.toString(16)).substr(-2);
        }

        return color;
    };

    /**
 * Thiết lập sự kiện cho các bộ lọc
 */
    setupFilterEvents() {
        // Xử lý hiển thị/ẩn trường tùy chỉnh cho thời gian tồn kho
        this.durationFilter.addEventListener('change', (e) => {
            this.customDurationDiv.style.display = e.target.value === 'custom' ? 'block' : 'none';
        });

        // Xử lý hiển thị/ẩn trường tùy chỉnh cho khoảng thời gian
        this.timeRangeFilter.addEventListener('change', (e) => {
            this.dateRangeDiv.style.display = e.target.value === 'custom' ? 'block' : 'none';
            this.dateRangeEndDiv.style.display = e.target.value === 'custom' ? 'block' : 'none';
        });

        // Xử lý nút áp dụng bộ lọc
        this.applyFilterBtn.addEventListener('click', () => {
            this.inventoryTable.ajax.reload();
        });

        // Xử lý nút reset bộ lọc
        this.resetFilterBtn.addEventListener('click', () => {
            this.resetFilters();
        });

        // Xử lý xuất dữ liệu
        document.getElementById('exportInventoryBtn').addEventListener('click', () => {
            this.exportInventoryData();
        });
    }

    /**
     * Thiết lập datepicker cho các trường ngày
     */
    setupDatePicker() {
        // Thiết lập ngày mặc định 
        const today = new Date();
        const lastMonth = new Date();
        lastMonth.setMonth(today.getMonth() - 1);

        document.getElementById('endDate').value = this.formatDateForInput(today);
        document.getElementById('startDate').value = this.formatDateForInput(lastMonth);
    }

    /**
     * Định dạng ngày cho input date
     */
    formatDateForInput(date) {
        return date.toISOString().split('T')[0];
    }

    /**
     * Đặt lại các bộ lọc
     */
    resetFilters() {
        this.stockFilter.value = '';
        document.getElementById('categoryFilter').value = '';
        this.durationFilter.value = '';
        document.getElementById('customDuration').value = '';
        this.timeRangeFilter.value = 'all';
        document.getElementById('startDate').value = '';
        document.getElementById('endDate').value = '';
        this.searchProduct.value = '';

        this.customDurationDiv.style.display = 'none';
        this.dateRangeDiv.style.display = 'none';
        this.dateRangeEndDiv.style.display = 'none';

        this.inventoryTable.search('').columns().search('').draw();
    }
}