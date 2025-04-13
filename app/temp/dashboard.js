/**
 * Trang tổng quan tồn kho
 */

// Dữ liệu mẫu - Thống kê tổng quan
const inventoryStats = {
    day: {
        totalProducts: 1245,
        stockValue: '2.3 tỷ',
        lowStockCount: 28,
        outOfStock: 15,
        changePercent: {
            totalProducts: 5.2,
            stockValue: 3.7,
            lowStockCount: -2.1,
            outOfStock: -4.5
        }
    },
    week: {
        totalProducts: 1228,
        stockValue: '2.25 tỷ',
        lowStockCount: 32,
        outOfStock: 18,
        changePercent: {
            totalProducts: 3.8,
            stockValue: 2.9,
            lowStockCount: -1.5,
            outOfStock: -2.8
        }
    },
    month: {
        totalProducts: 1210,
        stockValue: '2.18 tỷ',
        lowStockCount: 36,
        outOfStock: 22,
        changePercent: {
            totalProducts: 8.5,
            stockValue: 7.2,
            lowStockCount: -6.4,
            outOfStock: -9.1
        }
    },
    quarter: {
        totalProducts: 1180,
        stockValue: '2.05 tỷ',
        lowStockCount: 42,
        outOfStock: 26,
        changePercent: {
            totalProducts: 12.7,
            stockValue: 11.3,
            lowStockCount: -10.2,
            outOfStock: -15.8
        }
    }
};

// Dữ liệu mẫu - Danh sách tồn kho
const inventoryItems = [
    {
        id: 1,
        code: 'SP00123',
        name: 'Đắc Nhân Tâm',
        category: 'Kỹ năng sống',
        stock: 125,
        reserved: 12,
        available: 113,
        threshold: 25,
        lastUpdated: '08/04/2025',
        status: 'normal',
        image: 'https://via.placeholder.com/40'
    },
    {
        id: 2,
        code: 'SP00124',
        name: 'Nhà Giả Kim',
        category: 'Tiểu thuyết',
        stock: 85,
        reserved: 8,
        available: 77,
        threshold: 20,
        lastUpdated: '07/04/2025',
        status: 'normal',
        image: 'https://via.placeholder.com/40'
    },
    {
        id: 3,
        code: 'SP00125',
        name: 'Tư Duy Phản Biện',
        category: 'Kỹ năng sống',
        stock: 18,
        reserved: 3,
        available: 15,
        threshold: 20,
        lastUpdated: '09/04/2025',
        status: 'low',
        image: 'https://via.placeholder.com/40'
    },
    {
        id: 4,
        code: 'SP00126',
        name: 'Điều Kỳ Diệu Của Thói Quen',
        category: 'Kỹ năng sống',
        stock: 0,
        reserved: 0,
        available: 0,
        threshold: 15,
        lastUpdated: '05/04/2025',
        status: 'out',
        image: 'https://via.placeholder.com/40'
    },
    {
        id: 5,
        code: 'SP00127',
        name: 'Khéo Ăn Nói Sẽ Có Được Thiên Hạ',
        category: 'Kỹ năng sống',
        stock: 10,
        reserved: 2,
        available: 8,
        threshold: 15,
        lastUpdated: '08/04/2025',
        status: 'low',
        image: 'https://via.placeholder.com/40'
    },
    {
        id: 6,
        code: 'SP00128',
        name: 'Đời Ngắn Đừng Ngủ Dài',
        category: 'Kỹ năng sống',
        stock: 32,
        reserved: 4,
        available: 28,
        threshold: 20,
        lastUpdated: '06/04/2025',
        status: 'normal',
        image: 'https://via.placeholder.com/40'
    },
    {
        id: 7,
        code: 'SP00129',
        name: 'Hành Trình Về Phương Đông',
        category: 'Tiểu thuyết',
        stock: 0,
        reserved: 0,
        available: 0,
        threshold: 10,
        lastUpdated: '09/04/2025',
        status: 'out',
        image: 'https://via.placeholder.com/40'
    },
    {
        id: 8,
        code: 'SP00130',
        name: 'Người Giàu Có Nhất Thành Babylon',
        category: 'Kinh tế',
        stock: 56,
        reserved: 6,
        available: 50,
        threshold: 15,
        lastUpdated: '07/04/2025',
        status: 'normal',
        image: 'https://via.placeholder.com/40'
    },
    {
        id: 9,
        code: 'SP00131',
        name: 'Càng Kỷ Luật, Càng Tự Do',
        category: 'Kỹ năng sống',
        stock: 12,
        reserved: 2,
        available: 10,
        threshold: 15,
        lastUpdated: '08/04/2025',
        status: 'low',
        image: 'https://via.placeholder.com/40'
    },
    {
        id: 10,
        code: 'SP00132',
        name: 'Đắc Nhân Tâm (Bìa Cứng)',
        category: 'Kỹ năng sống',
        stock: 38,
        reserved: 3,
        available: 35,
        threshold: 10,
        lastUpdated: '09/04/2025',
        status: 'normal',
        image: 'https://via.placeholder.com/40'
    }
];

// Dữ liệu mẫu - Nhập kho gần đây
const recentImports = [
    {
        id: 'NK00265',
        date: '08/04/2025',
        product: 'Đắc Nhân Tâm',
        quantity: 25,
        user: 'Nguyễn Văn A'
    },
    {
        id: 'NK00264',
        date: '07/04/2025',
        product: 'Nhà Giả Kim',
        quantity: 15,
        user: 'Trần Thị B'
    },
    {
        id: 'NK00263',
        date: '07/04/2025',
        product: 'Điều Kỳ Diệu Của Thói Quen',
        quantity: 20,
        user: 'Nguyễn Văn A'
    },
    {
        id: 'NK00262',
        date: '06/04/2025',
        product: 'Người Giàu Có Nhất Thành Babylon',
        quantity: 12,
        user: 'Lê Thị C'
    },
    {
        id: 'NK00261',
        date: '05/04/2025',
        product: 'Đời Ngắn Đừng Ngủ Dài',
        quantity: 18,
        user: 'Nguyễn Văn A'
    }
];

// Dữ liệu mẫu - Xuất kho gần đây
const recentExports = [
    {
        id: 'XK00132',
        date: '08/04/2025',
        product: 'Đắc Nhân Tâm',
        quantity: 8,
        reason: 'Bán hàng'
    },
    {
        id: 'XK00131',
        date: '08/04/2025',
        product: 'Nhà Giả Kim',
        quantity: 5,
        reason: 'Bán hàng'
    },
    {
        id: 'XK00130',
        date: '07/04/2025',
        product: 'Tư Duy Phản Biện',
        quantity: 3,
        reason: 'Bán hàng'
    },
    {
        id: 'XK00129',
        date: '07/04/2025',
        product: 'Khéo Ăn Nói Sẽ Có Được Thiên Hạ',
        quantity: 2,
        reason: 'Hư hỏng'
    },
    {
        id: 'XK00128',
        date: '06/04/2025',
        product: 'Đời Ngắn Đừng Ngủ Dài',
        quantity: 4,
        reason: 'Bán hàng'
    }
];

// Dữ liệu mẫu - Biểu đồ xu hướng tồn kho
const trendData = {
    day: {
        labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
        datasets: [
            {
                label: 'Giá trị tồn kho',
                data: [2280, 2285, 2290, 2300, 2305, 2310, 2320, 2330],
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
                data: [2150, 2180, 2200, 2230, 2260, 2290, 2330],
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
                data: [2050, 2100, 2150, 2180, 2220, 2270, 2330],
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
                data: [1950, 2050, 2180, 2330],
                borderColor: '#0d6efd',
                backgroundColor: 'rgba(13, 110, 253, 0.1)',
                fill: true,
                tension: 0.3
            }
        ]
    }
};

// Dữ liệu mẫu - Biểu đồ phân bố tồn kho
const distributionData = {
    labels: ['Kỹ năng sống', 'Tiểu thuyết', 'Kinh tế', 'Giáo trình', 'Truyện tranh', 'Sách thiếu nhi'],
    datasets: [{
        data: [40, 20, 15, 10, 8, 7],
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

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', function() {
    // Hiển thị dữ liệu thống kê mặc định (ngày)
    updateStats('day');
    
    // Tải dữ liệu bảng tồn kho
    loadInventoryTable();
    
    // Tải dữ liệu nhập/xuất kho gần đây
    loadRecentActivity();
    
    // Khởi tạo biểu đồ
    initCharts();
    
    // Thêm sự kiện cho các nút lọc
    document.getElementById('filterDay').addEventListener('click', function() {
        updateStats('day');
        updateChart('day');
        setActiveButton(this);
    });
    
    document.getElementById('filterWeek').addEventListener('click', function() {
        updateStats('week');
        updateChart('week');
        setActiveButton(this);
    });
    
    document.getElementById('filterMonth').addEventListener('click', function() {
        updateStats('month');
        updateChart('month');
        setActiveButton(this);
    });
    
    document.getElementById('filterQuarter').addEventListener('click', function() {
        updateStats('quarter');
        updateChart('quarter');
        setActiveButton(this);
    });
    
    // Thêm sự kiện cho dropdown lọc tồn kho
    document.getElementById('stockFilter').addEventListener('change', function() {
        filterInventoryTable(this.value);
    });
    
    // Thêm sự kiện cho ô tìm kiếm sản phẩm
    document.getElementById('searchProduct').addEventListener('input', function() {
        searchInventoryTable(this.value);
    });
    
    // Thêm sự kiện cho các nút trong biểu đồ
    document.querySelectorAll('.chart-card .btn-group .btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const period = this.dataset.period;
            updateChart(period);
            
            // Set nút active
            this.closest('.btn-group').querySelectorAll('.btn').forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
});

// Cập nhật thống kê tổng quan
function updateStats(period) {
    const stats = inventoryStats[period];
    
    document.getElementById('totalProducts').textContent = stats.totalProducts.toLocaleString();
    document.getElementById('stockValue').textContent = stats.stockValue;
    document.getElementById('lowStockCount').textContent = stats.lowStockCount.toLocaleString();
    document.getElementById('outOfStock').textContent = stats.outOfStock.toLocaleString();
    
    // Cập nhật % thay đổi
    updateChangePercent('totalProducts', stats.changePercent.totalProducts);
    updateChangePercent('stockValue', stats.changePercent.stockValue);
    updateChangePercent('lowStockCount', stats.changePercent.lowStockCount);
    updateChangePercent('outOfStock', stats.changePercent.outOfStock);
}

// Cập nhật % thay đổi
function updateChangePercent(elementId, percent) {
    const element = document.getElementById(elementId).nextElementSibling.nextElementSibling;
    const isPositive = percent > 0;
    const icon = isPositive ? 'bi-arrow-up-short' : 'bi-arrow-down-short';
    const trendClass = isPositive ? 'up' : 'down';
    
    // Xác định chuỗi so sánh theo thời gian
    let timeCompare = '';
    const activeFilter = document.querySelector('#filterDay, #filterWeek, #filterMonth, #filterQuarter.btn-light');
    if (activeFilter) {
        switch (activeFilter.id) {
            case 'filterDay':
                timeCompare = 'so với hôm qua';
                break;
            case 'filterWeek':
                timeCompare = 'so với tuần trước';
                break;
            case 'filterMonth':
                timeCompare = 'so với tháng trước';
                break;
            case 'filterQuarter':
                timeCompare = 'so với quý trước';
                break;
        }
    }
    
    element.className = `trend ${trendClass}`;
    element.innerHTML = `<i class="bi ${icon}"></i> ${Math.abs(percent)}% ${timeCompare}`;
}

// Tải dữ liệu bảng tồn kho
function loadInventoryTable() {
    const tableBody = document.querySelector('#inventoryTable tbody');
    tableBody.innerHTML = '';
    
    inventoryItems.forEach(item => {
        const row = document.createElement('tr');
        let statusBadge = '';
        
        switch (item.status) {
            case 'normal':
                statusBadge = '<span class="badge badge-stock badge-normal">Bình thường</span>';
                break;
            case 'low':
                statusBadge = '<span class="badge badge-stock badge-low">Sắp hết</span>';
                break;
            case 'out':
                statusBadge = '<span class="badge badge-stock badge-out">Hết hàng</span>';
                break;
        }
        
        row.innerHTML = `
            <td>${item.code}</td>
            <td>
                <div class="d-flex align-items-center">
                    <img src="${item.image}" class="rounded me-2" alt="${item.name}">
                    <span>${item.name}</span>
                </div>
            </td>
            <td>${item.category}</td>
            <td>${item.stock}</td>
            <td>${item.reserved}</td>
            <td>${item.available}</td>
            <td>${item.threshold}</td>
            <td>${item.lastUpdated}</td>
            <td>${statusBadge}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary btn-action" title="Chi tiết">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-success btn-action" title="Nhập kho">
                    <i class="bi bi-plus-circle"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger btn-action" title="Xuất kho">
                    <i class="bi bi-dash-circle"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Tải dữ liệu nhập/xuất kho gần đây
function loadRecentActivity() {
    // Nhập kho gần đây
    const importTbody = document.getElementById('recentImportTbody');
    importTbody.innerHTML = '';
    
    recentImports.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.date}</td>
            <td>${item.product}</td>
            <td>${item.quantity}</td>
            <td>${item.user}</td>
        `;
        importTbody.appendChild(row);
    });
    
    // Xuất kho gần đây
    const exportTbody = document.getElementById('recentExportTbody');
    exportTbody.innerHTML = '';
    
    recentExports.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.date}</td>
            <td>${item.product}</td>
            <td>${item.quantity}</td>
            <td>${item.reason}</td>
        `;
        exportTbody.appendChild(row);
    });
}

// Khởi tạo các biểu đồ
function initCharts() {
    // Biểu đồ xu hướng tồn kho
    const trendChartCtx = document.getElementById('inventoryTrendChart').getContext('2d');
    window.trendChart = new Chart(trendChartCtx, {
        type: 'line',
        data: trendData.day,
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
                            return `${context.dataset.label}: ${context.raw.toLocaleString()} ₫`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return value / 1000 + 'tr';
                        }
                    }
                }
            }
        }
    });
    
    // Biểu đồ phân bố tồn kho
    const distributionChartCtx = document.getElementById('inventoryDistributionChart').getContext('2d');
    window.distributionChart = new Chart(distributionChartCtx, {
        type: 'doughnut',
        data: distributionData,
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
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            }
        }
    });
}

// Cập nhật biểu đồ theo khoảng thời gian
function updateChart(period) {
    window.trendChart.data = trendData[period];
    window.trendChart.update();
}

// Set active button
function setActiveButton(button) {
    document.querySelectorAll('#filterDay, #filterWeek, #filterMonth, #filterQuarter').forEach(btn => {
        btn.classList.remove('btn-light');
        btn.classList.add('btn-outline-light');
    });
    
    button.classList.remove('btn-outline-light');
    button.classList.add('btn-light');
}

// Lọc bảng tồn kho theo trạng thái
function filterInventoryTable(status) {
    const rows = document.querySelectorAll('#inventoryTable tbody tr');
    
    if (status === 'all') {
        rows.forEach(row => {
            row.style.display = '';
        });
        return;
    }
    
    rows.forEach(row => {
        const statusCell = row.querySelector('td:nth-child(9)');
        if (statusCell.textContent.toLowerCase().includes(status)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Tìm kiếm sản phẩm trong bảng tồn kho
function searchInventoryTable(query) {
    const rows = document.querySelectorAll('#inventoryTable tbody tr');
    const searchQuery = query.toLowerCase().trim();
    
    if (searchQuery === '') {
        rows.forEach(row => {
            row.style.display = '';
        });
        return;
    }
    
    rows.forEach(row => {
        const productName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        const productCode = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
        const category = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
        
        if (productName.includes(searchQuery) || productCode.includes(searchQuery) || category.includes(searchQuery)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}