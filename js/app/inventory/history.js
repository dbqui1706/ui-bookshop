/**
 * Trang lịch sử tồn kho
 */

// Dữ liệu mẫu - Lịch sử tồn kho
const inventoryHistoryData = [
    {
        id: 'LS00325',
        timestamp: '09/04/2025 14:30',
        product: {
            id: 1,
            name: 'Đắc Nhân Tâm'
        },
        actionType: 'import',
        previousQuantity: 100,
        change: 25,
        currentQuantity: 125,
        reference: 'NK00265',
        referenceType: 'import',
        reason: 'Nhập bổ sung sách cho quý 2/2025',
        createdBy: 'Nguyễn Văn A'
    },
    {
        id: 'LS00324',
        timestamp: '08/04/2025 15:45',
        product: {
            id: 1,
            name: 'Đắc Nhân Tâm'
        },
        actionType: 'export',
        previousQuantity: 108,
        change: -8,
        currentQuantity: 100,
        reference: 'XK00132',
        referenceType: 'order',
        reason: 'Xuất hàng cho đơn hàng DH00123',
        createdBy: 'Nguyễn Văn A'
    },
    {
        id: 'LS00323',
        timestamp: '08/04/2025 11:15',
        product: {
            id: 2,
            name: 'Nhà Giả Kim'
        },
        actionType: 'export',
        previousQuantity: 90,
        change: -5,
        currentQuantity: 85,
        reference: 'XK00132',
        referenceType: 'order',
        reason: 'Xuất hàng cho đơn hàng DH00123',
        createdBy: 'Nguyễn Văn A'
    },
    {
        id: 'LS00322',
        timestamp: '07/04/2025 16:20',
        product: {
            id: 2,
            name: 'Nhà Giả Kim'
        },
        actionType: 'import',
        previousQuantity: 75,
        change: 15,
        currentQuantity: 90,
        reference: 'NK00264',
        referenceType: 'import',
        reason: 'Nhập mới sách thiếu nhi',
        createdBy: 'Trần Thị B'
    },
    {
        id: 'LS00321',
        timestamp: '07/04/2025 14:10',
        product: {
            id: 3,
            name: 'Tư Duy Phản Biện'
        },
        actionType: 'export',
        previousQuantity: 21,
        change: -3,
        currentQuantity: 18,
        reference: 'XK00130',
        referenceType: 'order',
        reason: 'Xuất hàng cho đơn hàng DH00122',
        createdBy: 'Trần Thị B'
    },
    {
        id: 'LS00320',
        timestamp: '06/04/2025 15:35',
        product: {
            id: 5,
            name: 'Khéo Ăn Nói Sẽ Có Được Thiên Hạ'
        },
        actionType: 'adjustment',
        previousQuantity: 12,
        change: -2,
        currentQuantity: 10,
        reference: null,
        referenceType: null,
        reason: 'Điều chỉnh sau kiểm kê',
        createdBy: 'Lê Thị C'
    },
    {
        id: 'LS00319',
        timestamp: '06/04/2025 11:40',
        product: {
            id: 4,
            name: 'Điều Kỳ Diệu Của Thói Quen'
        },
        actionType: 'export',
        previousQuantity: 5,
        change: -5,
        currentQuantity: 0,
        reference: 'XK00129',
        referenceType: 'damage',
        reason: 'Sách bị ngấm nước do rò rỉ ống nước',
        createdBy: 'Nguyễn Văn A'
    },
    {
        id: 'LS00318',
        timestamp: '05/04/2025 16:50',
        product: {
            id: 3,
            name: 'Tư Duy Phản Biện'
        },
        actionType: 'export',
        previousQuantity: 31,
        change: -10,
        currentQuantity: 21,
        reference: 'XK00128',
        referenceType: 'return',
        reason: 'Trả sách bị lỗi in cho NXB Trẻ',
        createdBy: 'Lê Thị C'
    },
    {
        id: 'LS00317',
        timestamp: '05/04/2025 14:20',
        product: {
            id: 4,
            name: 'Điều Kỳ Diệu Của Thói Quen'
        },
        actionType: 'import',
        previousQuantity: 0,
        change: 5,
        currentQuantity: 5,
        reference: 'NK00263',
        referenceType: 'import',
        reason: 'Nhập bổ sung các đầu sách bán chạy',
        createdBy: 'Nguyễn Văn A'
    },
    {
        id: 'LS00316',
        timestamp: '04/04/2025 10:15',
        product: {
            id: 3,
            name: 'Tư Duy Phản Biện'
        },
        actionType: 'import',
        previousQuantity: 11,
        change: 20,
        currentQuantity: 31,
        reference: 'NK00262',
        referenceType: 'import',
        reason: 'Nhập giáo trình học kỳ mới',
        createdBy: 'Lê Thị C'
    }
];

// Dữ liệu mẫu biểu đồ lịch sử tồn kho theo sản phẩm
const productHistoryChartData = {
    '1': { // Đắc Nhân Tâm
        labels: ['01/04', '03/04', '05/04', '08/04', '09/04'],
        data: [90, 95, 98, 100, 125]
    },
    '2': { // Nhà Giả Kim
        labels: ['01/04', '03/04', '05/04', '07/04', '08/04'],
        data: [65, 70, 75, 90, 85]
    },
    '3': { // Tư Duy Phản Biện
        labels: ['01/04', '02/04', '04/04', '05/04', '07/04'],
        data: [8, 10, 31, 21, 18]
    },
    '4': { // Điều Kỳ Diệu Của Thói Quen
        labels: ['01/04', '03/04', '05/04', '06/04', '09/04'],
        data: [12, 8, 5, 0, 0]
    },
    '5': { // Khéo Ăn Nói Sẽ Có Được Thiên Hạ
        labels: ['01/04', '03/04', '05/04', '06/04', '09/04'],
        data: [18, 15, 14, 10, 10]
    }
};

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', function() {
    // Tải dữ liệu bảng lịch sử
    loadHistoryTable();
    
    // Khởi tạo biểu đồ
    initHistoryChart();
    
    // Khởi tạo sự kiện
    initEvents();
});

// Tải dữ liệu bảng lịch sử
function loadHistoryTable(filter = {}) {
    const tableBody = document.querySelector('#historyTable tbody');
    tableBody.innerHTML = '';
    
    // Lọc dữ liệu nếu cần
    let filteredData = [...inventoryHistoryData];
    
    if (filter.productId) {
        filteredData = filteredData.filter(item => item.product.id == filter.productId);
    }
    
    if (filter.actionType) {
        filteredData = filteredData.filter(item => item.actionType === filter.actionType);
    }
    
    if (filter.startDate) {
        const startDate = new Date(filter.startDate);
        filteredData = filteredData.filter(item => {
            const itemDate = parseDate(item.timestamp);
            return itemDate >= startDate;
        });
    }
    
    if (filter.endDate) {
        const endDate = new Date(filter.endDate);
        endDate.setHours(23, 59, 59, 999); // Đặt thời gian về cuối ngày
        filteredData = filteredData.filter(item => {
            const itemDate = parseDate(item.timestamp);
            return itemDate <= endDate;
        });
    }
    
    filteredData.forEach(item => {
        const row = document.createElement('tr');
        
        // Tạo badge cho loại hành động
        let actionBadge = '';
        let changeClass = '';
        let changePrefix = '';
        
        switch (item.actionType) {
            case 'import':
                actionBadge = '<span class="badge bg-success">Nhập kho</span>';
                changeClass = 'positive';
                changePrefix = '+';
                break;
            case 'export':
                actionBadge = '<span class="badge bg-danger">Xuất kho</span>';
                changeClass = 'negative';
                changePrefix = '';
                break;
            case 'adjustment':
                actionBadge = '<span class="badge bg-warning text-dark">Điều chỉnh</span>';
                changeClass = item.change > 0 ? 'positive' : 'negative';
                changePrefix = item.change > 0 ? '+' : '';
                break;
        }
        
        // Tạo badge cho tham chiếu
        let referenceBadge = '';
        if (item.reference) {
            switch (item.referenceType) {
                case 'import':
                    referenceBadge = `<span class="history-reference bg-success-subtle text-success">${item.reference}</span>`;
                    break;
                case 'order':
                    referenceBadge = `<span class="history-reference bg-primary-subtle text-primary">${item.reference}</span>`;
                    break;
                case 'damage':
                    referenceBadge = `<span class="history-reference bg-danger-subtle text-danger">${item.reference}</span>`;
                    break;
                case 'return':
                    referenceBadge = `<span class="history-reference bg-warning-subtle text-warning">${item.reference}</span>`;
                    break;
                default:
                    referenceBadge = `<span class="history-reference">${item.reference}</span>`;
            }
        } else {
            referenceBadge = '<span class="text-muted">-</span>';
        }
        
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.timestamp}</td>
            <td>${item.product.name}</td>
            <td>${actionBadge}</td>
            <td>${item.previousQuantity}</td>
            <td><span class="history-change ${changeClass}">${changePrefix}${item.change}</span></td>
            <td>${item.currentQuantity}</td>
            <td>${referenceBadge}</td>
            <td>${item.reason}</td>
            <td>${item.createdBy}</td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Khởi tạo biểu đồ lịch sử tồn kho theo sản phẩm
function initHistoryChart() {
    const ctx = document.getElementById('inventoryHistoryChart').getContext('2d');
    
    window.historyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: productHistoryChartData['1'].labels,
            datasets: [{
                label: 'Tồn kho',
                data: productHistoryChartData['1'].data,
                borderColor: '#0d6efd',
                backgroundColor: 'rgba(13, 110, 253, 0.1)',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Biến động tồn kho của sản phẩm: Đắc Nhân Tâm'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Tồn kho: ${context.parsed.y}`;
                        }
                    }
                }
            }
        }
    });
}

// Khởi tạo các sự kiện
function initEvents() {
    // Sự kiện chọn sản phẩm cho biểu đồ
    document.getElementById('productHistoryChart').addEventListener('change', function() {
        const productId = this.value;
        updateHistoryChart(productId);
    });
    
    // Sự kiện lọc theo thời gian
    document.getElementById('filterAllTime').addEventListener('click', function() {
        loadHistoryTable();
        setActiveButton(this);
    });
    
    document.getElementById('filterWeek').addEventListener('click', function() {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        loadHistoryTable({
            startDate: formatDateForInput(sevenDaysAgo)
        });
        
        setActiveButton(this);
    });
    
    document.getElementById('filterMonth').addEventListener('click', function() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        loadHistoryTable({
            startDate: formatDateForInput(thirtyDaysAgo)
        });
        
        setActiveButton(this);
    });
    
    // Sự kiện filter từ form
    document.querySelector('button.btn-primary').addEventListener('click', function() {
        const productId = document.getElementById('productFilter').value;
        const actionType = document.getElementById('actionTypeFilter').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        
        loadHistoryTable({
            productId: productId,
            actionType: actionType,
            startDate: startDate,
            endDate: endDate
        });
    });
}

// Cập nhật biểu đồ lịch sử tồn kho theo sản phẩm
function updateHistoryChart(productId) {
    const data = productHistoryChartData[productId];
    const productName = document.getElementById('productHistoryChart').options[document.getElementById('productHistoryChart').selectedIndex].text;
    
    window.historyChart.data.labels = data.labels;
    window.historyChart.data.datasets[0].data = data.data;
    window.historyChart.options.plugins.title.text = `Biến động tồn kho của sản phẩm: ${productName}`;
    window.historyChart.update();
}

// Đặt nút active
function setActiveButton(button) {
    document.querySelectorAll('#filterAllTime, #filterWeek, #filterMonth').forEach(btn => {
        btn.classList.remove('btn-light');
        btn.classList.add('btn-outline-light');
    });
    
    button.classList.remove('btn-outline-light');
    button.classList.add('btn-light');
}

// Parse ngày từ chuỗi định dạng dd/mm/yyyy
function parseDate(dateString) {
    const parts = dateString.split(' ')[0].split('/');
    return new Date(parts[2], parts[1] - 1, parts[0]);
}

// Format ngày cho input date
function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}