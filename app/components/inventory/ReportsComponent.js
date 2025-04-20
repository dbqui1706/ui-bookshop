import { EventBus } from '../../core/eventBus.js';
import { formatDate, formatCurrency, formatQuantity, formatPercent, hexToRgba, showNotification, showConfirmDialog, generateColorFromString } from '../../core/utils.js';
import { getToken } from '../../core/storage.js';
import { inventoryService } from '../../services/InventoryService.js';

export class ReportsComponent {
    constructor() {
        // Lấy service
        this.eventBus = EventBus.getInstance();
        this.inventoryService = inventoryService.getInstance();

        this.isLoading = false;
        this.currentPeriod = 'day';
        this.currentPeriodMovement = 'day';
        this.dataTables = {};
        this.charts = {};

        // Ngày bắt đầu và kết thúc mặc định (30 ngày gần nhất)
        const today = new Date();
        this.endDate = today;
        this.startDate = new Date();
        this.startDate.setDate(today.getDate() - 30);


        this.dataHistory = null;

        // Filter cho lịch sử kho
        this.productFilter = document.getElementById('productFilter');
        this.actionTypeFilter = document.getElementById('actionTypeFilter');
        this.reasonFilter = document.getElementById('reasonFilter');
        this.startDateFilter = document.getElementById('startDate');
        this.endDateFilter = document.getElementById('endDate');

        // Khởi tạo component
        this.initialize();
    }

    initialize() {
        // Gắn sự kiện
        this.attachEventListeners();
        // Khởi tạo DataTables
        this.initDataTables();

        // Tải dữ liệu ban đầu
        this.loadInitialData();
    }

    /**
     * Gắn các sự kiện
     */
    attachEventListeners() {
        // Sự kiện chuyển đổi khoảng thời gian biểu đồ
        const periodButtons = document.querySelectorAll('[data-period]');
        periodButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Loại bỏ trạng thái active
                periodButtons.forEach(btn => btn.classList.remove('active'));

                // Thêm trạng thái active cho nút được click
                button.classList.add('active');

                // Cập nhật khoảng thời gian và tải dữ liệu mới
                this.currentPeriod = button.getAttribute('data-period');
                this.loadInventoryMovementData();
            });
        });

        // Sự kiện filter cho lịch sử kho
        const applyAdvancedFilter = document.getElementById('applyAdvancedFilter');
        if (applyAdvancedFilter) {
            applyAdvancedFilter.addEventListener('click', () => {
                this.dataTables.historyTable.ajax.reload();
            });
        }

        // Sử kiện refresh cho lịch sử kho
        const refreshTable = document.getElementById('refreshTable');
        if (refreshTable) {
            refreshTable.addEventListener('click', () => {
                this.dataTables.historyTable.ajax.reload();
            });
        }


        // Thêm sự kiện cho nút reset filter
        const resetAdvancedFilter = document.getElementById('resetAdvancedFilter');
        if (resetAdvancedFilter) {
            resetAdvancedFilter.addEventListener('click', () => {
                // Reset các input filter
                document.getElementById('productFilterAdvanced').value = '';
                document.getElementById('actionTypeFilterAdvanced').value = '';
                document.getElementById('quantityChangeFilter').value = '';
                document.getElementById('referenceFilter').value = '';
                document.getElementById('reasonFilter').value = '';

                // Reset các ngày về mặc định
                document.getElementById('startDateAdvanced').value = this.formatDateForInput(this.startDate);
                document.getElementById('endDateAdvanced').value = this.formatDateForInput(this.endDate);

                // Tải lại dữ liệu
                this.dataTables.historyTable.ajax.reload();
            });
        }

        // Sự kiện chuyển đổi khoảng thời gian biểu đồ biến động kho
        const periodMovementButtons = document.querySelectorAll('#periodMovement .period-selector');
        periodMovementButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Loại bỏ trạng thái active
                periodButtons.forEach(btn => btn.classList.remove('active'));

                // Thêm trạng thái active cho nút được click
                button.classList.add('active');

                // Cập nhật khoảng thời gian và tải dữ liệu mới
                this.currentPeriodMovement = button.getAttribute('data-period');
                console.log('Period changed to:', this.currentPeriod);
                this.loadInventoryMovementData();
            });
        });

        // Sự kiện khi thay đổi ngày bắt đầu và kết thúc
        const movementStartDate = document.getElementById('movementStartDate');
        const movementEndDate = document.getElementById('movementEndDate');

        if (movementStartDate && movementEndDate) {
            // Set giá trị mặc định cho ngày bắt đầu và kết thúc
            movementStartDate.value = this.formatDateForInput(this.startDate);
            movementEndDate.value = this.formatDateForInput(this.endDate);

            // Gắn sự kiện khi thay đổi ngày
            movementStartDate.addEventListener('change', () => {
                if (new Date(movementStartDate.value) > new Date(movementEndDate.value)) {
                    showNotification('warning', 'Cảnh báo', 'Ngày bắt đầu không thể lớn hơn ngày kết thúc');
                    movementStartDate.value = this.formatDateForInput(this.startDate);
                } else {
                    this.startDate = new Date(movementStartDate.value);
                    this.loadInventoryMovementData();
                }
            });

            movementEndDate.addEventListener('change', () => {
                if (new Date(movementEndDate.value) < new Date(movementStartDate.value)) {
                    showNotification('warning', 'Cảnh báo', 'Ngày kết thúc không thể nhỏ hơn ngày bắt đầu');
                    movementEndDate.value = this.formatDateForInput(this.endDate);
                } else {
                    this.endDate = new Date(movementEndDate.value);
                    this.loadInventoryMovementData();
                }
            });
        }

    }

    /**
     * Khởi tạo DataTables
     */
    initDataTables() {

        // DataTable cho lịch sử kho
        this.initHistoryTable();

        // DataTable cho sản phẩm chậm luân chuyển
        this.initSlowMovingTable();
    }

    /**
     * Khởi tạo bảng History
     */

    initHistoryTable() {
        this.dataTables.historyTable = $('#historyTable').DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: 'http://localhost:8080/api/admin/inventory/history',
                type: 'GET',
                data: (d) => {
                    // Lấy các giá trị filter
                    d.productId = $('#productFilter').val();
                    d.actionType = $('#actionTypeFilterAdvanced').val();
                    d.referenceFilter = $('#referenceFilter').val();
                    d.reasonFilter = $('#reasonFilter').val();
                    d.startDate = $('#startDateAdvanced').val();
                    d.endDate = $('#endDateAdvanced').val();
                    return d;
                },
                beforeSend: (xhr) => {
                    this.isLoading = true;
                    xhr.setRequestHeader('Authorization', `Bearer ${getToken()}`);
                },
                complete: (data) => {
                    this.isLoading = false;
                    this.updateTableSummary(data.responseJSON);
                },
                error: (xhr, error, thrown) => {
                    console.error('Error loading history data:', error);
                    showNotification(
                        'error', 'Lỗi', 'Không thể tải dữ liệu lịch sử kho',
                    );
                },

            },
            columns: [
                { data: 'id' },
                {
                    data: 'createdAt',
                    render: function (data) {
                        return formatDate(data, 'DD/MM/YYYY HH:mm');
                    }
                },
                { data: 'productName' },
                {
                    data: 'actionType',
                    render: function (data) {
                        const types = {
                            'import': '<span class="badge bg-success">Nhập kho</span>',
                            'export': '<span class="badge bg-danger">Xuất kho</span>',
                            'adjustment': '<span class="badge bg-warning">Điều chỉnh</span>'
                        };
                        return types[data] || data;
                    }
                },
                {
                    data: 'previousQuantity',
                    render: function (data) {
                        return formatQuantity(data);
                    }
                },
                {
                    data: 'quantityChange',
                    render: function (data) {
                        const cls = data >= 0 ? 'text-success' : 'text-danger';
                        const sign = data >= 0 ? '+' : '';
                        return `<span class="${cls}">${sign}${formatQuantity(data)}</span>`;
                    }
                },
                {
                    data: 'currentQuantity',
                    render: function (data) {
                        return formatQuantity(data);
                    }
                },
                { data: 'referenceId' },
                { data: 'reason' },
                { data: 'createdByName' }
            ],
            order: [[0, 'desc']],
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/vi.json'
            },
            drawCallback: function () {

            }
        });
    }

    /*
    * Khởi tạo bảng sản phẩm chậm luân chuyển
    */
    initSlowMovingTable() {

        console.log(document.getElementById('slowMovingTable'));

        this.dataTables.slowMovingTable = $('#slowMovingTable').DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: 'http://localhost:8080/api/admin/inventory/slow-moving',
                type: 'GET',
                data: function (d) {
                    // Thêm các tham số bộ lọc tùy chỉnh
                    // d.categoryId = $('#categoryFilter').val();
                    d.minPrice = $('#minPriceFilter').val();
                    d.maxPrice = $('#maxPriceFilter').val();
                    d.minDaysInStock = $('#minDaysInStockFilter').val();
                    d.maxTurnover = $('#maxTurnoverFilter').val();
                    // d.sortBy = $('#slowMovingSortBy').val();
                    return d;
                },
                beforeSend: (xhr) => {
                    this.isLoading = true;
                    xhr.setRequestHeader('Authorization', `Bearer ${getToken()}`);
                },
                complete: (data) => {
                    this.isLoading = false;
                },
                error: (xhr, error, thrown) => {
                    console.error('Error loading history data:', error);
                    showNotification(
                        'error', 'Lỗi', 'Không thể tải dữ liệu chậm luân chuyển',
                    );
                },

            },
            columns: [
                { data: 'productId' },
                {
                    data: null,
                    render: function (data, type, row) {
                        return `<div class="d-flex align-items-center">
                            <div class="flex-shrink-0">
                                <img src="${"/asset/images/" + row.thumbnail || 'https://via.placeholder.com/40'}" alt="${row.productName}" width="40" class="rounded">
                            </div>
                            <div class="ms-2">
                                <div class="fw-medium">${row.productName}</div>
                                ${row.author ? `<small class="text-muted">${row.author}</small>` : ''}
                            </div>
                        </div>`;
                    }
                },
                { data: 'categoryName' },
                {
                    data: 'price',
                    render: function (data) {
                        return formatCurrency(data);
                    }
                },
                {
                    data: 'stockQuantity',
                    render: function (data) {
                        return formatQuantity(data);
                    }
                },
                {
                    data: 'daysInStock',
                    render: function (data) {
                        const cls = data > 180 ? 'text-danger' : data > 90 ? 'text-warning' : '';
                        return `<span class="${cls}">${data} ngày</span>`;
                    }
                },
                {
                    data: 'turnoverRate',
                    render: function (data) {
                        const cls = data < 0.5 ? 'text-danger' : data < 1 ? 'text-warning' : '';
                        return `<span class="${cls}">${data.toFixed(2)}</span>`;
                    }
                },
                {
                    data: 'stockValue',
                    render: function (data) {
                        return formatCurrency(data);
                    }
                },
                {
                    data: 'suggestion',
                    render: function (data) {
                        return `<span class="badge bg-info">${data}</span>`;
                    }
                }
            ],
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/vi.json'
            },
            order: [[5, 'desc']],
        });

        // Gắn sự kiện cho nút applySlowMovingFilter
        const applySlowMovingFilter = document.getElementById('applySlowMovingFilter');
        if (applySlowMovingFilter) {
            applySlowMovingFilter.addEventListener('click', () => {
                this.dataTables.slowMovingTable.ajax.reload();
            });
        }
        // Gắn sự kiện cho nút applyCommonFilter
        const applyCommonFilter = document.getElementById('applyCommonFilter');
        if (applyCommonFilter) {
            applyCommonFilter.addEventListener('click', () => {
                this.dataTables.slowMovingTable.ajax.reload();
            });
        }

        // Gắn sự kiện cho nút refreshSlowMovingTable
        const refreshSlowMovingTable = document.getElementById('refreshSlowMovingTable');
        if (refreshSlowMovingTable) {
            refreshSlowMovingTable.addEventListener('click', () => {
                this.dataTables.slowMovingTable.ajax.reload();
            });
        }
    }

    /**
     * Tải dữ liệu ban đầu
     */
    loadInitialData() {
        // Tải dữ liệu thống kê
        this.loadStatisticsData();

        // Tải dữ liệu biến động nhập/xuất kho
        this.loadInventoryMovementData();

        // Tải dữ liệu phân bố tồn kho theo danh mục
        this.loadCategoryDistributionData();

        // Tải dữ liệu top sản phẩm có giá trị tồn kho cao
        this.loadTopInventoryValueProducts();

        // Tải dữ liệu vòng quay tồn kho theo danh mục
        this.loadTurnoverByCategoryData();
    }

    /**
     * Tải dữ liệu thống kê
     */
    async loadStatisticsData() {
        try {
            this.isLoading = true;

            // Lấy dữ liệu từ API
            const summary = await this.inventoryService.getMovementSummary();

            // Cập nhật UI
            document.getElementById('totalInventoryValue').textContent = formatCurrency(summary.importValue30days - summary.exportValue30days);
            document.getElementById('inventoryTurnover').textContent = (summary.exportQty30days / (summary.importQty30days - summary.exportQty30days)).toFixed(1);
            document.getElementById('inventoryDays').textContent = Math.round(30 / (summary.exportQty30days / (summary.importQty30days - summary.exportQty30days)));
            document.getElementById('stockOutRate').textContent = formatPercent(summary.noMovementProducts / summary.highTurnoverProducts * 100);

            // Cập nhật các chỉ báo xu hướng
            const trendsElements = document.querySelectorAll('.trend');

            if (trendsElements.length >= 4) {
                // Tổng giá trị tồn kho
                this.updateTrendElement(
                    trendsElements[0],
                    (summary.importValue30days - summary.exportValue30days) - (summary.importQtyPrev30days - summary.exportQtyPrev30days) * 200000,
                    'so với kỳ trước'
                );

                // Vòng quay tồn kho
                this.updateTrendElement(
                    trendsElements[1],
                    (summary.exportQty30days / (summary.importQty30days - summary.exportQty30days)) - (summary.exportQtyPrev30days / (summary.importQtyPrev30days - summary.exportQtyPrev30days)),
                    'lần so với kỳ trước'
                );

                // Số ngày tồn kho
                this.updateTrendElement(
                    trendsElements[2],
                    Math.round(30 / (summary.exportQty30days / (summary.importQty30days - summary.exportQty30days))) - Math.round(30 / (summary.exportQtyPrev30days / (summary.importQtyPrev30days - summary.exportQtyPrev30days))),
                    'ngày so với kỳ trước',
                    true
                );

                // Tỷ lệ hết hàng
                this.updateTrendElement(
                    trendsElements[3],
                    (summary.noMovementProducts / summary.highTurnoverProducts * 100) - ((summary.noMovementProducts + 2) / (summary.highTurnoverProducts - 1) * 100),
                    '% so với kỳ trước',
                    true
                );
            }

        } catch (error) {
            console.error('Error loading statistics data:', error);
            showNotification('Không thể tải dữ liệu thống kê', 'error');

            // Dữ liệu mẫu nếu API chưa sẵn sàng
            this.loadSampleStatisticsData();
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Cập nhật phần tử xu hướng
     * @param {Element} element - Phần tử cần cập nhật
     * @param {number} change - Giá trị thay đổi
     * @param {string} unit - Đơn vị
     * @param {boolean} reverseDirection - Đảo ngược hướng (true: giảm là tốt, false: tăng là tốt)
     */
    updateTrendElement(element, change, unit, reverseDirection = false) {
        if (!element) return;

        const icon = element.querySelector('i');
        const isUp = reverseDirection ? change < 0 : change > 0;

        // Cập nhật class
        if (isUp) {
            element.classList.remove('down');
            element.classList.add('up');
            icon.classList.remove('bi-arrow-down-short');
            icon.classList.add('bi-arrow-up-short');
        } else {
            element.classList.remove('up');
            element.classList.add('down');
            icon.classList.remove('bi-arrow-up-short');
            icon.classList.add('bi-arrow-down-short');
        }

        // Cập nhật nội dung
        element.innerHTML = `
            <i class="bi ${isUp ? 'bi-arrow-up-short' : 'bi-arrow-down-short'}"></i> 
            ${Math.abs(change).toFixed(1)} ${unit}
        `;
    }

    /**
     * Tải dữ liệu biến động nhập/xuất kho
     */
    async loadInventoryMovementData() {
        try {
            // Hiển thị loading state
            const chartContainer = document.getElementById('inventoryMovementChart');
            if (chartContainer) {
                chartContainer.classList.add('loading');
            }

            // Lấy giá trị ngày bắt đầu và kết thúc từ các input
            const movementStartDate = document.getElementById('movementStartDate').value || this.formatDateForInput(this.startDate);
            const movementEndDate = document.getElementById('movementEndDate').value || this.formatDateForInput(this.endDate);

            // Cập nhật giá trị cho các input nếu trống
            if (!document.getElementById('movementStartDate').value) {
                document.getElementById('movementStartDate').value = this.formatDateForInput(this.startDate);
            }

            if (!document.getElementById('movementEndDate').value) {
                document.getElementById('movementEndDate').value = this.formatDateForInput(this.endDate);
            }

            // Lấy dữ liệu từ API
            const data = await this.inventoryService.getInventoryMovement(
                this.currentPeriod,
                new Date(movementStartDate),
                new Date(movementEndDate)
            );

            // Dữ liệu cho biểu đồ
            const chartData = {
                labels: data.map(item => item.periodLabel),
                datasets: [
                    {
                        label: 'Nhập kho',
                        data: data.map(item => item.importQuantity),
                        backgroundColor: hexToRgba('#36a2eb', 0.8),
                        borderColor: '#36a2eb',
                        borderWidth: 1
                    },
                    {
                        label: 'Xuất kho',
                        data: data.map(item => item.exportQuantity),
                        backgroundColor: hexToRgba('#ff6384', 0.8),
                        borderColor: '#ff6384',
                        borderWidth: 1
                    }
                ]
            };

            // Thêm dataset cho biến động ròng nếu cần
            if (data.some(item => item.netQuantityChange !== undefined)) {
                chartData.datasets.push({
                    label: 'Biến động ròng',
                    data: data.map(item => item.netQuantityChange || 0),
                    type: 'line',
                    borderColor: '#4bc0c0',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    tension: 0.4,
                    pointBackgroundColor: '#4bc0c0',
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    // Chỉ hiển thị trong tooltip, không vẽ trên biểu đồ
                    hidden: true
                });
            }

            // Cấu hình biểu đồ
            const config = {
                type: 'bar',
                data: chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: false,
                            text: 'Biến động nhập/xuất kho'
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    // Nếu là dataset ẩn (như biến động ròng), không hiển thị
                                    if (context.dataset.hidden) {
                                        return null;
                                    }

                                    const label = context.dataset.label;
                                    const value = formatQuantity(context.raw);

                                    // Lấy giá trị tiền tương ứng nếu có
                                    let valueInfo = '';
                                    if (context.datasetIndex === 0 && context.dataset.importValues) {
                                        valueInfo = ` - ${formatCurrency(context.dataset.importValues[context.dataIndex])}`;
                                    } else if (context.datasetIndex === 1 && context.dataset.exportValues) {
                                        valueInfo = ` - ${formatCurrency(context.dataset.exportValues[context.dataIndex])}`;
                                    }

                                    // Chỉ tính phần trăm cho dataset Nhập và Xuất
                                    let percentageInfo = '';
                                    if (context.datasetIndex < 2) {
                                        // Lấy giá trị của dataset khác trong cùng index
                                        const otherDatasetIndex = context.datasetIndex === 0 ? 1 : 0;
                                        const otherValue = context.chart.data.datasets[otherDatasetIndex].data[context.dataIndex];

                                        // Tính tổng và tỷ lệ phần trăm
                                        const total = context.raw + otherValue;
                                        const percentage = total > 0 ? ((context.raw / total) * 100).toFixed(1) : 0;
                                        percentageInfo = ` (${percentage}% tổng)`;
                                    }

                                    // Thêm thông tin xu hướng nếu có đủ dữ liệu
                                    let trendInfo = '';
                                    if (context.dataIndex > 0) {
                                        const prevValue = context.dataset.data[context.dataIndex - 1];
                                        const change = context.raw - prevValue;
                                        const changePct = prevValue !== 0 ? ((change / prevValue) * 100).toFixed(1) : 0;

                                        if (change > 0) {
                                            trendInfo = ` (↑ ${formatQuantity(change)}, +${changePct}%)`;
                                        } else if (change < 0) {
                                            trendInfo = ` (↓ ${formatQuantity(Math.abs(change))}, ${changePct}%)`;
                                        } else {
                                            trendInfo = " (không thay đổi)";
                                        }
                                    }

                                    return `${label}: ${value}${valueInfo}${percentageInfo}${trendInfo}`;
                                },

                                // Thêm tiêu đề tooltip với thông tin thời gian
                                title: function (context) {
                                    const title = context[0].label;
                                    return `Thời gian: ${title}`;
                                },

                                // Thêm footer với thông tin tổng và cân bằng
                                footer: function (context) {
                                    // Lấy dữ liệu từ cả hai dataset tại index hiện tại
                                    const dataIndex = context[0].dataIndex;
                                    const datasets = context[0].chart.data.datasets;
                                    const importQty = datasets[0].data[dataIndex];
                                    const exportQty = datasets[1].data[dataIndex];

                                    // Lấy giá trị tiền nếu có
                                    const importValue = datasets[0].importValues ? datasets[0].importValues[dataIndex] : 0;
                                    const exportValue = datasets[1].exportValues ? datasets[1].exportValues[dataIndex] : 0;

                                    // Tính tổng và cân bằng
                                    const totalQty = importQty + exportQty;
                                    const balanceQty = importQty - exportQty;

                                    // Tạo mảng thông tin footer
                                    const footerLines = [
                                        `Tổng giao dịch: ${formatQuantity(totalQty)} sản phẩm`,
                                        `Cân bằng: ${formatQuantity(balanceQty)} (${balanceQty >= 0 ? 'Nhập > Xuất' : 'Xuất > Nhập'})`
                                    ];

                                    // Thêm thông tin giá trị nếu có
                                    if (importValue !== undefined || exportValue !== undefined) {
                                        const totalValue = (importValue || 0) + (exportValue || 0);
                                        const balanceValue = (importValue || 0) - (exportValue || 0);

                                        footerLines.push('');
                                        footerLines.push(`Giá trị nhập: ${formatCurrency(importValue || 0)}`);
                                        footerLines.push(`Giá trị xuất: ${formatCurrency(exportValue || 0)}`);
                                        footerLines.push(`Tổng giá trị: ${formatCurrency(totalValue)}`);
                                        footerLines.push(`Cân bằng giá trị: ${formatCurrency(balanceValue)}`);
                                    }

                                    // Nếu có giá trị biến động ròng, thêm thông tin
                                    if (datasets.length > 2 && datasets[2].data && datasets[2].data[dataIndex] !== undefined) {
                                        const netChange = datasets[2].data[dataIndex];
                                        footerLines.push('');
                                        footerLines.push(`Biến động ròng: ${formatQuantity(netChange)}`);
                                    }

                                    return footerLines;
                                }
                            },
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleFont: {
                                weight: 'bold'
                            },
                            padding: 12,
                            displayColors: true,
                            boxWidth: 10,
                            boxHeight: 10
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false
                            }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function (value) {
                                    return formatQuantity(value);
                                }
                            }
                        }
                    }
                }
            };

            // Vẽ biểu đồ
            this.renderChart('inventoryMovementChart', config);

        } catch (error) {
            console.error('Error loading inventory movement data:', error);
            showNotification('Không thể tải dữ liệu biến động nhập/xuất kho', 'error');
        } finally {
            this.isLoading = false;
        }
    }


    /**
     * Cập nhật thông tin tóm tắt cho bảng
     */
    updateTableSummary(data) {
        const totalRecords = document.getElementById('totalRecords');
        const totalImport = document.getElementById('totalImport');
        const totalExport = document.getElementById('totalExport');
        const totalAdjustment = document.getElementById('totalAdjustment');

        const totalRecordsCount = data.recordsTotal || 0;
        const totalImportCount = data.summary.totalImport || 0;
        const totalExportCount = data.summary.totalExport || 0;
        const totalAdjustmentCount = data.summary.totalAdjustment || 0;

        totalRecords.textContent = totalRecordsCount
        totalImport.textContent = formatQuantity(totalImportCount);
        totalExport.textContent = formatQuantity(totalExportCount);
        totalAdjustment.textContent = formatQuantity(totalAdjustmentCount);
    }

    /**
     * Tải dữ liệu phân bố tồn kho theo danh mục
     */
    async loadCategoryDistributionData() {
        try {
            this.isLoading = true;

            // Lấy dữ liệu từ API
            const data = await this.inventoryService.getInventoryDistribution();

            this.inventoryDistributionChart = document.getElementById('inventoryValueByCategory');

            // Chuyển đổi dữ liệu từ mảng đối tượng thành định dạng cho biểu đồ
            const labels = data.map(item => item.category);
            const values = data.map(item => item.perByQuantity); // Sử dụng phần trăm theo số lượng

            // Tạo màu động dựa trên số lượng danh mục
            const colors = labels.map(label => generateColorFromString(label));
            const ctx = this.inventoryDistributionChart.getContext('2d');
            this.distributionChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: values,
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
                                    const item = data[context.dataIndex];
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

        } catch (error) {
            console.error('Error loading category distribution data:', error);
            showNotification(
                'error',
                'Lỗi',
                'Không thể tải dữ liệu phân bố tồn kho theo danh mục',
            );

            // Dữ liệu mẫu
            this.loadSampleCategoryDistributionData();
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Tải dữ liệu top sản phẩm có giá trị tồn kho cao
     */
    async loadTopInventoryValueProducts() {
        try {
            this.isLoading = true;

            // Dữ liệu mẫu
            const data = await this.inventoryService.getTopInventory();
            const colors = data.map(item => generateColorFromString(item.productName));
            // Dữ liệu cho biểu đồ
            const chartData = {
                labels: data.map(item => item.productName),
                datasets: [
                    {
                        label: 'Giá trị tồn kho',
                        data: data.map(item => item.inventoryValue),
                        backgroundColor: colors.slice(0, data.length),
                        borderColor: '#4BC0C0',
                        borderWidth: 1
                    }
                ]
            };

            // Cấu hình biểu đồ
            const config = {
                type: 'bar',
                data: chartData,
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false,
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    return `Giá trị: ${formatCurrency(context.raw)}`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                callback: function (value) {
                                    return formatCurrency(value, 'VND', false);
                                }
                            }
                        }
                    }
                }
            };

            // Vẽ biểu đồ
            this.renderChart('topInventoryValueProducts', config);

        } catch (error) {
            console.error('Error loading top inventory value products:', error);
            showNotification('Không thể tải dữ liệu top sản phẩm có giá trị tồn kho cao', 'error');
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Tải dữ liệu vòng quay tồn kho theo danh mục
     */
    async loadTurnoverByCategoryData() {
        try {
            this.isLoading = true;

            // Lấy dữ liệu từ API
            const data = await this.inventoryService.getCategoryMovementRatio();

            // Dữ liệu cho biểu đồ
            const chartData = {
                labels: data.map(item => item.categoryName),
                datasets: [
                    {
                        label: 'Vòng quay tồn kho',
                        data: data.map(item => item.movementRatio / 100 * 4), // Nhân với 4 để có vòng quay thực tế
                        backgroundColor: hexToRgba('#9966FF', 0.8),
                        borderColor: '#9966FF',
                        borderWidth: 1
                    }
                ]
            };

            // Cấu hình biểu đồ
            const config = {
                type: 'bar',
                data: chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false,
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    return `Vòng quay: ${context.raw.toFixed(1)}`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Vòng quay (lần/tháng)'
                            }
                        }
                    }
                }
            };

            // Vẽ biểu đồ
            this.renderChart('turnoverByCategoryChart', config);

        } catch (error) {
            console.error('Error loading turnover by category data:', error);
            showNotification('Không thể tải dữ liệu vòng quay tồn kho theo danh mục', 'error');

            // Dữ liệu mẫu
            this.loadSampleTurnoverByCategoryData();
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Tải dữ liệu sản phẩm chậm/nhanh luân chuyển
     * @param {string} tabId - ID của tab (slow-moving, fast-moving, stock-out)
     */
    loadProductMovementData(tabId) {
        // Dữ liệu mẫu cho sản phẩm chậm luân chuyển
        if (tabId === 'slow-moving') {
            const tbody = document.getElementById('slowMovingTbody');
            if (tbody) {
                tbody.innerHTML = this.generateSlowMovingProductsHTML();
            }
        }

        // Dữ liệu mẫu cho sản phẩm nhanh luân chuyển
        else if (tabId === 'fast-moving') {
            const tbody = document.getElementById('fastMovingTbody');
            if (tbody) {
                tbody.innerHTML = this.generateFastMovingProductsHTML();
            }
        }

        // Dữ liệu mẫu cho sản phẩm thường xuyên hết hàng
        else if (tabId === 'stock-out') {
            const tbody = document.getElementById('stockOutTbody');
            if (tbody) {
                tbody.innerHTML = this.generateStockOutProductsHTML();
            }
        }
    }

    /**
     * Vẽ biểu đồ
     * @param {string} canvasId - ID của canvas
     * @param {Object} config - Cấu hình biểu đồ
     */
    renderChart(canvasId, config) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        // Hủy biểu đồ cũ nếu đã tồn tại
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        // Vẽ biểu đồ mới
        this.charts[canvasId] = new Chart(canvas, config);
    }

    /**
     * Format date object để sử dụng trong input type="date"
     * @param {Date} date - Đối tượng Date cần format
     * @returns {string} - Chuỗi date đã format (yyyy-mm-dd)
     */
    formatDateForInput(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * Xuất báo cáo
     */
    exportReport() {
        const reportType = document.getElementById('exportReportType').value;
        const exportFormat = document.getElementById('exportFormat').value;

        showNotification(`Đang xuất báo cáo ${reportType} định dạng ${exportFormat}...`, 'info');

        // Giả lập quá trình xuất báo cáo
        setTimeout(() => {
            showNotification('Xuất báo cáo thành công!', 'success');
        }, 1500);
    }

    /**
     * Gửi báo cáo qua email
     */
    sendReportByEmail() {
        showConfirmDialog(
            'Bạn muốn gửi báo cáo qua email?',
            'Xác nhận gửi email',
            () => {
                showNotification('Đang gửi báo cáo qua email...', 'info');

                // Giả lập quá trình gửi email
                setTimeout(() => {
                    showNotification('Gửi báo cáo qua email thành công!', 'success');
                }, 1500);
            }
        );
    }

    // ========= HELPER METHODS FOR SAMPLE DATA =========

    /**
     * Tải dữ liệu mẫu cho thống kê
     */
    loadSampleStatisticsData() {
        document.getElementById('totalInventoryValue').textContent = '2.34 tỷ';
        document.getElementById('inventoryTurnover').textContent = '4.5';
        document.getElementById('inventoryDays').textContent = '21';
        document.getElementById('stockOutRate').textContent = '2.5%';
    }

    /**
     * Tải dữ liệu mẫu cho biểu đồ chính
     */
    loadSampleInventoryMovementData() {
        // Dữ liệu mẫu
        const labels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];
        const importData = [2100, 1900, 2300, 2800, 2400, 2600];
        const exportData = [1800, 1600, 2000, 2200, 2100, 2400];

        // Dữ liệu cho biểu đồ
        const chartData = {
            labels: labels,
            datasets: [
                {
                    label: 'Nhập kho',
                    data: importData,
                    backgroundColor: hexToRgba('#36a2eb', 0.8),
                    borderColor: '#36a2eb',
                    borderWidth: 1
                },
                {
                    label: 'Xuất kho',
                    data: exportData,
                    backgroundColor: hexToRgba('#ff6384', 0.8),
                    borderColor: '#ff6384',
                    borderWidth: 1
                }
            ]
        };

        // Cấu hình biểu đồ
        const config = {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return `${context.dataset.label}: ${formatQuantity(context.raw)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function (value) {
                                return formatQuantity(value);
                            }
                        }
                    }
                }
            }
        };

        // Vẽ biểu đồ
        this.renderChart('mainReportChart', config);
    }

    /**
     * Tải dữ liệu mẫu cho phân bố tồn kho theo danh mục
     */
    loadSampleCategoryDistributionData() {
        // Dữ liệu mẫu
        const data = [
            { categoryName: 'Sách Kỹ năng', percentage: 35 },
            { categoryName: 'Sách Văn học', percentage: 25 },
            { categoryName: 'Sách Kinh tế', percentage: 15 },
            { categoryName: 'Sách Thiếu nhi', percentage: 10 },
            { categoryName: 'Sách Ngoại ngữ', percentage: 8 },
            { categoryName: 'Khác', percentage: 7 }
        ];

        // Dữ liệu cho biểu đồ
        const chartData = {
            labels: data.map(item => item.categoryName),
            datasets: [
                {
                    data: data.map(item => item.percentage),
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
                    ],
                    borderWidth: 1
                }
            ]
        };

        // Cấu hình biểu đồ
        const config = {
            type: 'pie',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return `${context.label}: ${context.raw}%`;
                            }
                        }
                    }
                }
            }
        };

        // Vẽ biểu đồ
        this.renderChart('inventoryValueByCategory', config);
    }

    /**
     * Tải dữ liệu mẫu cho vòng quay tồn kho theo danh mục
     */
    loadSampleTurnoverByCategoryData() {
        // Dữ liệu mẫu
        const data = [
            { categoryName: 'Sách Kỹ năng', turnover: 5.2 },
            { categoryName: 'Sách Văn học', turnover: 4.7 },
            { categoryName: 'Sách Kinh tế', turnover: 4.3 },
            { categoryName: 'Sách Thiếu nhi', turnover: 6.1 },
            { categoryName: 'Sách Ngoại ngữ', turnover: 3.8 },
            { categoryName: 'Khác', turnover: 2.9 }
        ];

        // Dữ liệu cho biểu đồ
        const chartData = {
            labels: data.map(item => item.categoryName),
            datasets: [
                {
                    label: 'Vòng quay tồn kho',
                    data: data.map(item => item.turnover),
                    backgroundColor: hexToRgba('#9966FF', 0.8),
                    borderColor: '#9966FF',
                    borderWidth: 1
                }
            ]
        };

        // Cấu hình biểu đồ
        const config = {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return `Vòng quay: ${context.raw.toFixed(1)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Vòng quay (lần/tháng)'
                        }
                    }
                }
            }
        };

        // Vẽ biểu đồ
        this.renderChart('turnoverByCategoryChart', config);
    }

    /**
     * Tạo HTML cho sản phẩm chậm luân chuyển
     * @returns {string} - HTML
     */
    generateSlowMovingProductsHTML() {
        const data = [
            {
                productCode: 'SP001',
                productName: 'Trí Tuệ Do Thái',
                category: 'Sách Kỹ năng',
                stock: 120,
                days: 85,
                turnover: 0.8,
                value: 240000000,
                suggestion: 'Giảm giá 20%'
            },
            {
                productCode: 'SP002',
                productName: 'Cuộc Sống Không Giới Hạn',
                category: 'Sách Kỹ năng',
                stock: 95,
                days: 72,
                turnover: 1.1,
                value: 190000000,
                suggestion: 'Tổ chức sự kiện'
            },
            {
                productCode: 'SP003',
                productName: 'Phương Pháp Giáo Dục Con Của Người Do Thái',
                category: 'Sách Giáo dục',
                stock: 85,
                days: 65,
                turnover: 1.3,
                value: 170000000,
                suggestion: 'Giảm giá 15%'
            },
            {
                productCode: 'SP004',
                productName: 'Người Giàu Có Nhất Thành Babylon',
                category: 'Sách Kinh tế',
                stock: 75,
                days: 60,
                turnover: 1.5,
                value: 150000000,
                suggestion: 'Đặt vị trí nổi bật'
            },
            {
                productCode: 'SP005',
                productName: 'Đọc Vị Bất Kỳ Ai',
                category: 'Sách Tâm lý',
                stock: 65,
                days: 55,
                turnover: 1.7,
                value: 130000000,
                suggestion: 'Gói combo cùng sách bán chạy'
            }
        ];

        return data.map(item => `
            <tr>
                <td>${item.productCode}</td>
                <td>${item.productName}</td>
                <td>${item.category}</td>
                <td>${formatQuantity(item.stock)}</td>
                <td>${item.days}</td>
                <td>${item.turnover.toFixed(1)}</td>
                <td>${formatCurrency(item.value)}</td>
                <td>
                    <span class="badge bg-warning">${item.suggestion}</span>
                </td>
            </tr>
        `).join('');
    }

    /**
     * Tạo HTML cho sản phẩm nhanh luân chuyển
     * @returns {string} - HTML
     */
    generateFastMovingProductsHTML() {
        const data = [
            {
                productCode: 'SP006',
                productName: 'Đắc Nhân Tâm',
                category: 'Sách Kỹ năng',
                stock: 150,
                days: 15,
                turnover: 6.8,
                trend: 'Tăng 15%',
                suggestion: 'Tăng lượng đặt hàng'
            },
            {
                productCode: 'SP007',
                productName: 'Nhà Giả Kim',
                category: 'Sách Văn học',
                stock: 120,
                days: 18,
                turnover: 5.9,
                trend: 'Tăng 12%',
                suggestion: 'Duy trì lượng tồn kho'
            },
            {
                productCode: 'SP008',
                productName: 'Tư Duy Phản Biện',
                category: 'Sách Kỹ năng',
                stock: 100,
                days: 20,
                turnover: 5.2,
                trend: 'Tăng 8%',
                suggestion: 'Tăng giá nhẹ 5%'
            },
            {
                productCode: 'SP009',
                productName: 'Điều Kỳ Diệu Của Thói Quen',
                category: 'Sách Kỹ năng',
                stock: 90,
                days: 22,
                turnover: 4.8,
                trend: 'Tăng 5%',
                suggestion: 'Duy trì lượng tồn kho'
            },
            {
                productCode: 'SP010',
                productName: 'Khéo Ăn Nói Sẽ Có Được Thiên Hạ',
                category: 'Sách Kỹ năng',
                stock: 85,
                days: 24,
                turnover: 4.5,
                trend: 'Tăng 3%',
                suggestion: 'Duy trì lượng tồn kho'
            }
        ];

        return data.map(item => `
            <tr>
                <td>${item.productCode}</td>
                <td>${item.productName}</td>
                <td>${item.category}</td>
                <td>${formatQuantity(item.stock)}</td>
                <td>${item.days}</td>
                <td>${item.turnover.toFixed(1)}</td>
                <td><span class="text-success">${item.trend}</span></td>
                <td>
                    <span class="badge bg-success">${item.suggestion}</span>
                </td>
            </tr>
        `).join('');
    }

    /**
     * Tạo HTML cho sản phẩm thường xuyên hết hàng
     * @returns {string} - HTML
     */
    generateStockOutProductsHTML() {
        const data = [
            {
                productCode: 'SP011',
                productName: 'Cây Cam Ngọt Của Tôi',
                category: 'Sách Văn học',
                stock: 15,
                stockOutCount: 5,
                stockOutDays: 23,
                safetyStock: 50,
                suggestion: 'Tăng gấp đôi lượng đặt hàng'
            },
            {
                productCode: 'SP012',
                productName: 'Sapiens: Lược Sử Loài Người',
                category: 'Sách Khoa học',
                stock: 10,
                stockOutCount: 4,
                stockOutDays: 18,
                safetyStock: 40,
                suggestion: 'Tăng 80% lượng đặt hàng'
            },
            {
                productCode: 'SP013',
                productName: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
                category: 'Sách Kỹ năng',
                stock: 20,
                stockOutCount: 3,
                stockOutDays: 15,
                safetyStock: 45,
                suggestion: 'Tăng 70% lượng đặt hàng'
            },
            {
                productCode: 'SP014',
                productName: 'Muôn Kiếp Nhân Sinh',
                category: 'Sách Tâm linh',
                stock: 12,
                stockOutCount: 3,
                stockOutDays: 12,
                safetyStock: 35,
                suggestion: 'Tăng 60% lượng đặt hàng'
            },
            {
                productCode: 'SP015',
                productName: 'Tôi Tài Giỏi, Bạn Cũng Thế',
                category: 'Sách Kỹ năng',
                stock: 18,
                stockOutCount: 2,
                stockOutDays: 10,
                safetyStock: 30,
                suggestion: 'Tăng 50% lượng đặt hàng'
            }
        ];

        return data.map(item => `
            <tr>
                <td>${item.productCode}</td>
                <td>${item.productName}</td>
                <td>${item.category}</td>
                <td>${formatQuantity(item.stock)}</td>
                <td>${item.stockOutCount}</td>
                <td>${item.stockOutDays}</td>
                <td>${formatQuantity(item.safetyStock)}</td>
                <td>
                    <span class="badge bg-danger">${item.suggestion}</span>
                </td>
            </tr>
        `).join('');
    }
}