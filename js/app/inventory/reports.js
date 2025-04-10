/**
 * Trang báo cáo thống kê tồn kho
 */

// Dữ liệu mẫu - Báo cáo theo thời gian
const reportData = {
    day: {
        totalInventoryValue: 2340000000,
        inventoryTurnover: 4.5,
        inventoryDays: 21,
        stockOutRate: 2.5,
        changePercent: {
            totalInventoryValue: 3.2,
            inventoryTurnover: 0.8,
            inventoryDays: -3,
            stockOutRate: -1.2
        }
    },
    week: {
        totalInventoryValue: 2260000000,
        inventoryTurnover: 4.2,
        inventoryDays: 24,
        stockOutRate: 3.1,
        changePercent: {
            totalInventoryValue: 2.8,
            inventoryTurnover: 0.6,
            inventoryDays: -2,
            stockOutRate: -0.8
        }
    },
    month: {
        totalInventoryValue: 2180000000,
        inventoryTurnover: 3.9,
        inventoryDays: 28,
        stockOutRate: 3.5,
        changePercent: {
            totalInventoryValue: 6.5,
            inventoryTurnover: 1.2,
            inventoryDays: -5,
            stockOutRate: -2.2
        }
    },
    quarter: {
        totalInventoryValue: 2050000000,
        inventoryTurnover: 3.4,
        inventoryDays: 32,
        stockOutRate: 4.2,
        changePercent: {
            totalInventoryValue: 10.8,
            inventoryTurnover: 1.8,
            inventoryDays: -8,
            stockOutRate: -3.5
        }
    }
};

// Dữ liệu mẫu - Biểu đồ giá trị tồn kho
const inventoryValueChartData = {
    day: {
        labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
        datasets: [
            {
                label: 'Giá trị tồn kho',
                data: [2280, 2285, 2290, 2300, 2305, 2310, 2320, 2340],
                borderColor: '#0d6efd',
                backgroundColor: 'rgba(13, 110, 253, 0.1)',
                fill: true,
                tension: 0.3
            }
        ]
    },
    week: {
        labels: ['03/04', '04/04', '05/04', '06/04', '07/04', '08/04', '09/04'],
        datasets: [
            {
                label: 'Giá trị tồn kho',
                data: [2180, 2190, 2210, 2225, 2245, 2270, 2340],
                borderColor: '#0d6efd',
                backgroundColor: 'rgba(13, 110, 253, 0.1)',
                fill: true,
                tension: 0.3
            }
        ]
    },
    month: {
        labels: ['10/03', '15/03', '20/03', '25/03', '30/03', '04/04', '09/04'],
        datasets: [
            {
                label: 'Giá trị tồn kho',
                data: [2050, 2080, 2120, 2150, 2190, 2260, 2340],
                borderColor: '#0d6efd',
                backgroundColor: 'rgba(13, 110, 253, 0.1)',
                fill: true,
                tension: 0.3
            }
        ]
    },
    quarter: {
        labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4'],
        datasets: [
            {
                label: 'Giá trị tồn kho',
                data: [1950, 2050, 2180, 2340],
                borderColor: '#0d6efd',
                backgroundColor: 'rgba(13, 110, 253, 0.1)',
                fill: true,
                tension: 0.3
            }
        ]
    }
};

// Dữ liệu mẫu - Giá trị tồn kho theo danh mục
const inventoryValueByCategoryData = {
    labels: ['Kỹ năng sống', 'Tiểu thuyết', 'Kinh tế', 'Giáo trình', 'Truyện tranh', 'Sách thiếu nhi'],
    datasets: [{
        label: 'Giá trị tồn kho (triệu đồng)',
        data: [980, 540, 420, 210, 120, 70],
        backgroundColor: [
            '#0d6efd',
            '#6f42c1',
            '#20c997',
            '#ffc107',
            '#fd7e14',
            '#dc3545'
        ],
        borderWidth: 1
    }]
};

// Dữ liệu mẫu - Top 10 sản phẩm có giá trị tồn kho cao nhất
const topInventoryValueProductsData = {
    labels: [
        'Đắc Nhân Tâm',
        'Nhà Giả Kim',
        'Tư Duy Phản Biện',
        'Người Giàu Có Nhất Thành Babylon',
        'Đời Ngắn Đừng Ngủ Dài',
        'Đắc Nhân Tâm (Bìa Cứng)',
        'Khéo Ăn Nói Sẽ Có Được Thiên Hạ',
        'Càng Kỷ Luật, Càng Tự Do',
        'Hành Trình Về Phương Đông',
        'Điều Kỳ Diệu Của Thói Quen'
    ],
    datasets: [{
        label: 'Giá trị tồn kho (triệu đồng)',
        data: [18.75, 11.05, 2.16, 7.84, 4.48, 7.6, 1.1, 1.68, 0, 0],
        backgroundColor: '#0d6efd',
        borderColor: '#0a58ca',
        borderWidth: 1
    }]
};

// Dữ liệu mẫu - Biến động nhập/xuất kho
const inventoryMovementData = {
    labels: ['03/04', '04/04', '05/04', '06/04', '07/04', '08/04', '09/04'],
    datasets: [
        {
            label: 'Nhập kho',
            data: [45, 30, 65, 20, 35, 0, 45],
            backgroundColor: '#20c997',
            borderColor: '#20c997',
            borderWidth: 1
        },
        {
            label: 'Xuất kho',
            data: [20, 12, 25, 18, 15, 13, 0],
            backgroundColor: '#dc3545',
            borderColor: '#dc3545',
            borderWidth: 1
        }
    ]
};

// Dữ liệu mẫu - Vòng quay tồn kho theo danh mục
const turnoverByCategoryData = {
    labels: ['Kỹ năng sống', 'Tiểu thuyết', 'Kinh tế', 'Giáo trình', 'Truyện tranh', 'Sách thiếu nhi'],
    datasets: [{
        label: 'Vòng quay tồn kho',
        data: [3.8, 5.2, 4.9, 3.5, 6.8, 7.2],
        backgroundColor: '#6f42c1',
        borderWidth: 1
    }]
};

// Dữ liệu mẫu - Sản phẩm chậm luân chuyển
const slowMovingProductsData = [
    {
        id: 1,
        code: 'SP00126',
        name: 'Điều Kỳ Diệu Của Thói Quen',
        category: 'Kỹ năng sống',
        stock: 0,
        inventoryDays: 0,
        turnover: 0,
        value: 0,
        recommendation: 'buy'
    },
    {
        id: 2,
        code: 'SP00129',
        name: 'Hành Trình Về Phương Đông',
        category: 'Tiểu thuyết',
        stock: 0,
        inventoryDays: 0,
        turnover: 0,
        value: 0,
        recommendation: 'buy'
    },
    {
        id: 3,
        code: 'SP00127',
        name: 'Khéo Ăn Nói Sẽ Có Được Thiên Hạ',
        category: 'Kỹ năng sống',
        stock: 10,
        inventoryDays: 45,
        turnover: 2.1,
        value: 1100000,
        recommendation: 'sell'
    },
    {
        id: 4,
        code: 'SP00125',
        name: 'Tư Duy Phản Biện',
        category: 'Kỹ năng sống',
        stock: 18,
        inventoryDays: 38,
        turnover: 2.5,
        value: 2160000,
        recommendation: 'sell'
    },
    {
        id: 5,
        code: 'SP00131',
        name: 'Càng Kỷ Luật, Càng Tự Do',
        category: 'Kỹ năng sống',
        stock: 12,
        inventoryDays: 35,
        turnover: 2.7,
        value: 1680000,
        recommendation: 'watch'
    }
];

// Dữ liệu mẫu - Sản phẩm nhanh luân chuyển
const fastMovingProductsData = [
    {
        id: 1,
        code: 'SP00123',
        name: 'Đắc Nhân Tâm',
        category: 'Kỹ năng sống',
        stock: 125,
        inventoryDays: 8,
        turnover: 12.2,
        trend: 'up',
        recommendation: 'buy'
    },
    {
        id: 2,
        code: 'SP00124',
        name: 'Nhà Giả Kim',
        category: 'Tiểu thuyết',
        stock: 85,
        inventoryDays: 10,
        turnover: 9.5,
        trend: 'up',
        recommendation: 'buy'
    },
    {
        id: 3,
        code: 'SP00132',
        name: 'Đắc Nhân Tâm (Bìa Cứng)',
        category: 'Kỹ năng sống',
        stock: 38,
        inventoryDays: 12,
        turnover: 8.3,
        trend: 'flat',
        recommendation: 'watch'
    },
    {
        id: 4,
        code: 'SP00130',
        name: 'Người Giàu Có Nhất Thành Babylon',
        category: 'Kinh tế',
        stock: 56,
        inventoryDays: 15,
        turnover: 6.5,
        trend: 'up',
        recommendation: 'buy'
    },
    {
        id: 5,
        code: 'SP00128',
        name: 'Đời Ngắn Đừng Ngủ Dài',
        category: 'Kỹ năng sống',
        stock: 32,
        inventoryDays: 18,
        turnover: 5.8,
        trend: 'down',
        recommendation: 'watch'
    }
];

// Dữ liệu mẫu - Sản phẩm thường xuyên hết hàng
const stockOutProductsData = [
    {
        id: 1,
        code: 'SP00126',
        name: 'Điều Kỳ Diệu Của Thói Quen',
        category: 'Kỹ năng sống',
        stock: 0,
        stockOutCount: 5,
        stockOutDays: 12,
        safetyStock: 15,
        recommendation: 'buy'
    },
    {
        id: 2,
        code: 'SP00129',
        name: 'Hành Trình Về Phương Đông',
        category: 'Tiểu thuyết',
        stock: 0,
        stockOutCount: 3,
        stockOutDays: 8,
        safetyStock: 12,
        recommendation: 'buy'
    },
    {
        id: 3,
        code: 'SP00125',
        name: 'Tư Duy Phản Biện',
        category: 'Kỹ năng sống',
        stock: 18,
        stockOutCount: 2,
        stockOutDays: 5,
        safetyStock: 25,
        recommendation: 'watch'
    },
    {
        id: 4,
        code: 'SP00127',
        name: 'Khéo Ăn Nói Sẽ Có Được Thiên Hạ',
        category: 'Kỹ năng sống',
        stock: 10,
        stockOutCount: 2,
        stockOutDays: 4,
        safetyStock: 20,
        recommendation: 'watch'
    },
    {
        id: 5,
        code: 'SP00133',
        name: 'Dám Bị Ghét',
        category: 'Kỹ năng sống',
        stock: 8,
        stockOutCount: 1,
        stockOutDays: 3,
        safetyStock: 15,
        recommendation: 'watch'
    }
];

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', function() {
    // Cập nhật thống kê tổng quan
    updateReportStats('day');
    
    // Khởi tạo biểu đồ
    initCharts();
    
    // Tải dữ liệu bảng sản phẩm
    loadProductTables();
    
    // Khởi tạo sự kiện
    initEvents();
});

// Cập nhật thống kê tổng quan theo thời gian
function updateReportStats(period) {
    const stats = reportData[period];
    
    document.getElementById('totalInventoryValue').textContent = formatCurrency(stats.totalInventoryValue);
    document.getElementById('inventoryTurnover').textContent = stats.inventoryTurnover.toFixed(1);
    document.getElementById('inventoryDays').textContent = stats.inventoryDays;
    document.getElementById('stockOutRate').textContent = stats.stockOutRate.toFixed(1) + '%';
    
    // Cập nhật % thay đổi
    updateChangePercent('totalInventoryValue', stats.changePercent.totalInventoryValue);
    updateChangePercent('inventoryTurnover', stats.changePercent.inventoryTurnover, ' lần');
    updateChangePercent('inventoryDays', stats.changePercent.inventoryDays, ' ngày');
    updateChangePercent('stockOutRate', stats.changePercent.stockOutRate, '%');
}

// Cập nhật % thay đổi
function updateChangePercent(elementId, value, unit = '') {
    const element = document.getElementById(elementId).nextElementSibling.nextElementSibling;
    const isPositive = value > 0;
    const isNegativeGood = elementId === 'inventoryDays' || elementId === 'stockOutRate';
    
    // Xác định class và icon
    let trendClass;
    let icon;
    
    if (isPositive) {
        if (isNegativeGood) {
            trendClass = 'down';
            icon = 'bi-arrow-up-short';
        } else {
            trendClass = 'up';
            icon = 'bi-arrow-up-short';
        }
    } else {
        if (isNegativeGood) {
            trendClass = 'up';
            icon = 'bi-arrow-down-short';
        } else {
            trendClass = 'down';
            icon = 'bi-arrow-down-short';
        }
    }
    
    element.className = `trend ${trendClass}`;
    element.innerHTML = `<i class="bi ${icon}"></i> ${Math.abs(value)}${unit} so với kỳ trước`;
}

// Khởi tạo các biểu đồ
function initCharts() {
    // Biểu đồ giá trị tồn kho
    const mainChartCtx = document.getElementById('mainReportChart').getContext('2d');
    window.mainChart = new Chart(mainChartCtx, {
        type: 'line',
        data: inventoryValueChartData.day,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw.toLocaleString()} triệu ₫`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString() + ' tr';
                        }
                    }
                }
            }
        }
    });
    
    // Biểu đồ giá trị tồn kho theo danh mục
    const categoryChartCtx = document.getElementById('inventoryValueByCategory').getContext('2d');
    window.categoryChart = new Chart(categoryChartCtx, {
        type: 'pie',
        data: inventoryValueByCategoryData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw} triệu ₫`;
                        }
                    }
                }
            }
        }
    });
    
    // Biểu đồ top 10 sản phẩm có giá trị tồn kho cao nhất
    const topProductsChartCtx = document.getElementById('topInventoryValueProducts').getContext('2d');
    window.topProductsChart = new Chart(topProductsChartCtx, {
        type: 'bar',
        data: topInventoryValueProductsData,
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.raw} triệu ₫`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        callback: function(value) {
                            return value + ' tr';
                        }
                    }
                }
            }
        }
    });
    
    // Biểu đồ biến động nhập/xuất kho
    const movementChartCtx = document.getElementById('inventoryMovementChart').getContext('2d');
    window.movementChart = new Chart(movementChartCtx, {
        type: 'bar',
        data: inventoryMovementData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw} sản phẩm`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value + ' sp';
                        }
                    }
                }
            }
        }
    });
    
    // Biểu đồ vòng quay tồn kho theo danh mục
    const turnoverChartCtx = document.getElementById('turnoverByCategoryChart').getContext('2d');
    window.turnoverChart = new Chart(turnoverChartCtx, {
        type: 'bar',
        data: turnoverByCategoryData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Vòng quay: ${context.raw} lần`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value + ' lần';
                        }
                    }
                }
            }
        }
    });
}

// Tải dữ liệu bảng sản phẩm
function loadProductTables() {
    // Sản phẩm chậm luân chuyển
    const slowMovingTbody = document.getElementById('slowMovingTbody');
    slowMovingTbody.innerHTML = '';
    
    slowMovingProductsData.forEach(item => {
        const row = document.createElement('tr');
        
        // Tạo badge cho đề xuất
        let recommendationBadge = '';
        switch (item.recommendation) {
            case 'buy':
                recommendationBadge = '<span class="recommendation buy">Nhập thêm</span>';
                break;
            case 'sell':
                recommendationBadge = '<span class="recommendation sell">Giảm giá</span>';
                break;
            case 'watch':
                recommendationBadge = '<span class="recommendation watch">Theo dõi</span>';
                break;
        }
        
        row.innerHTML = `
            <td>${item.code}</td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${item.stock}</td>
            <td>${item.inventoryDays}</td>
            <td>${item.turnover.toFixed(1)}</td>
            <td>${formatCurrency(item.value)}</td>
            <td>${recommendationBadge}</td>
        `;
        
        slowMovingTbody.appendChild(row);
    });
    
    // Sản phẩm nhanh luân chuyển
    const fastMovingTbody = document.getElementById('fastMovingTbody');
    fastMovingTbody.innerHTML = '';
    
    fastMovingProductsData.forEach(item => {
        const row = document.createElement('tr');
        
        // Tạo badge cho đề xuất
        let recommendationBadge = '';
        switch (item.recommendation) {
            case 'buy':
                recommendationBadge = '<span class="recommendation buy">Nhập thêm</span>';
                break;
            case 'sell':
                recommendationBadge = '<span class="recommendation sell">Giảm giá</span>';
                break;
            case 'watch':
                recommendationBadge = '<span class="recommendation watch">Theo dõi</span>';
                break;
        }
        
        // Tạo xu hướng bán
        let trendIndicator = '';
        switch (item.trend) {
            case 'up':
                trendIndicator = '<span class="trend-indicator up"><i class="bi bi-arrow-up-short"></i> Tăng</span>';
                break;
            case 'down':
                trendIndicator = '<span class="trend-indicator down"><i class="bi bi-arrow-down-short"></i> Giảm</span>';
                break;
            case 'flat':
                trendIndicator = '<span class="trend-indicator flat"><i class="bi bi-dash"></i> Ổn định</span>';
                break;
        }
        
        row.innerHTML = `
            <td>${item.code}</td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${item.stock}</td>
            <td>${item.inventoryDays}</td>
            <td>${item.turnover.toFixed(1)}</td>
            <td>${trendIndicator}</td>
            <td>${recommendationBadge}</td>
        `;
        
        fastMovingTbody.appendChild(row);
    });
    
    // Sản phẩm thường xuyên hết hàng
    const stockOutTbody = document.getElementById('stockOutTbody');
    stockOutTbody.innerHTML = '';
    
    stockOutProductsData.forEach(item => {
        const row = document.createElement('tr');
        
        // Tạo badge cho đề xuất
        let recommendationBadge = '';
        switch (item.recommendation) {
            case 'buy':
                recommendationBadge = '<span class="recommendation buy">Nhập thêm</span>';
                break;
            case 'sell':
                recommendationBadge = '<span class="recommendation sell">Giảm giá</span>';
                break;
            case 'watch':
                recommendationBadge = '<span class="recommendation watch">Theo dõi</span>';
                break;
        }
        
        row.innerHTML = `
            <td>${item.code}</td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${item.stock}</td>
            <td>${item.stockOutCount}</td>
            <td>${item.stockOutDays}</td>
            <td>${item.safetyStock}</td>
            <td>${recommendationBadge}</td>
        `;
        
        stockOutTbody.appendChild(row);
    });
}

// Khởi tạo các sự kiện
function initEvents() {
    // Sự kiện lọc theo thời gian
    document.getElementById('reportDay').addEventListener('click', function() {
        updateReportStats('day');
        updateCharts('day');
        setActiveButton(this);
    });
    
    document.getElementById('reportWeek').addEventListener('click', function() {
        updateReportStats('week');
        updateCharts('week');
        setActiveButton(this);
    });
    
    document.getElementById('reportMonth').addEventListener('click', function() {
        updateReportStats('month');
        updateCharts('month');
        setActiveButton(this);
    });
    
    document.getElementById('reportQuarter').addEventListener('click', function() {
        updateReportStats('quarter');
        updateCharts('quarter');
        setActiveButton(this);
    });
    
    // Sự kiện thay đổi loại báo cáo
    document.getElementById('reportType').addEventListener('change', function() {
        // Trong thực tế sẽ cập nhật dữ liệu biểu đồ và bảng theo loại báo cáo
        // Ở đây chỉ giả lập thông báo
        Swal.fire({
            title: 'Thông báo',
            text: 'Đã cập nhật loại báo cáo: ' + this.options[this.selectedIndex].text,
            icon: 'info',
            confirmButtonText: 'Đồng ý'
        });
    });
    
    // Sự kiện tạo báo cáo
    document.getElementById('generateReport').addEventListener('click', function() {
        const startDate = document.getElementById('reportStartDate').value;
        const endDate = document.getElementById('reportEndDate').value;
        const reportType = document.getElementById('reportType').value;
        
        if (!startDate || !endDate) {
            Swal.fire({
                title: 'Lỗi',
                text: 'Vui lòng chọn đầy đủ ngày bắt đầu và kết thúc',
                icon: 'error',
                confirmButtonText: 'Đồng ý'
            });
            return;
        }
        
        // Trong thực tế sẽ gọi API để lấy dữ liệu theo thời gian và loại báo cáo
        // Ở đây chỉ giả lập thông báo thành công
        Swal.fire({
            title: 'Thành công',
            text: 'Đã tạo báo cáo từ ' + formatDate(new Date(startDate)) + ' đến ' + formatDate(new Date(endDate)),
            icon: 'success',
            confirmButtonText: 'Đồng ý'
        });
    });
    
    // Sự kiện cho các nút trong biểu đồ
    document.querySelectorAll('.chart-card .btn-group .btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const period = this.dataset.period;
            updateCharts(period);
            
            // Set nút active
            this.closest('.btn-group').querySelectorAll('.btn').forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
}

// Cập nhật biểu đồ theo khoảng thời gian
function updateCharts(period) {
    // Cập nhật biểu đồ giá trị tồn kho
    window.mainChart.data = inventoryValueChartData[period];
    window.mainChart.update();
}

// Đặt nút active
function setActiveButton(button) {
    document.querySelectorAll('#reportDay, #reportWeek, #reportMonth, #reportQuarter').forEach(btn => {
        btn.classList.remove('btn-light');
        btn.classList.add('btn-outline-light');
    });
    
    button.classList.remove('btn-outline-light');
    button.classList.add('btn-light');
}

// Định dạng tiền tệ
function formatCurrency(amount) {
    if (amount >= 1000000000) {
        return (amount / 1000000000).toFixed(2) + ' tỷ';
    } else if (amount >= 1000000) {
        return (amount / 1000000).toFixed(2) + ' triệu';
    } else {
        return amount.toLocaleString() + ' ₫';
    }
}

// Định dạng ngày
function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}