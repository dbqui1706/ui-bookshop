import { InventoryTrend } from '../models/inventory-trends.js';
import {
    InventoryMovementData,
    InventoryHistoryItem,
    CategoryMovementRatio,
    InventoryMovementSummary
} from '../models/inventory-movement.js';
import { EventBus } from '../core/eventBus.js';
import { api } from '../core/api.js';

/**
 * Class InventoryService - Service xử lý logic liên quan đến kho hàng
 */
export class InventoryService {
    /**
     * Khởi tạo service
     */
    constructor() {
        // Event bus để giao tiếp giữa các component
        this.eventBus = EventBus.getInstance();
        // API endpoints
        this.endpoints = {
            trends: 'api/admin/inventory/trends',
            distribution: 'api/admin/inventory/distribution',
            recentImports: 'api/admin/inventory/import-recently',
            recentExports: 'api/admin/inventory/export-recently',
            // Thêm endpoints mới
            inventoryMovement: 'api/admin/inventory/movement',
            inventoryHistory: 'api/admin/inventory/history',
            categoryMovementRatio: 'api/admin/inventory/category-movement-ratio',
            movementSummary: 'api/admin/inventory/movement-summary',
            topInventory: 'api/admin/inventory/top-10',
        };
    }

    /**
     * Lấy xu hướng tồn kho theo thời gian
     * @param {string} interval - Khoảng thời gian (day, week, month, quarter)
     * @returns {Promise<InventoryTrend[]>} - Danh sách xu hướng tồn kho
     */
    async getInventoryTrends(interval = 'day') {
        try {
            const response = await api.get(this.endpoints.trends, { interval });
            // Kiểm tra xem response có dữ liệu không
            if (!response || response.length === 0) {
                throw new Error('Không có dữ liệu xu hướng tồn kho');
            }
            return response.map(trendData => {
                const trend = new InventoryTrend();
                trend.label = trendData.date;
                trend.value = trendData.value;
                return trend;
            });
        } catch (error) {
            console.error('Error fetching inventory trends:', error);
            throw new Error('Không thể tải danh sách xu hướng tồn kho');
        }
    }

    /**
     * Lấy phân bố tồn kho
     * @returns {Promise<Object>} - Dữ liệu phân bố tồn kho
     */
    async getInventoryDistribution() {
        try {
            const response = await api.get(this.endpoints.distribution);
            // Kiểm tra xem response có dữ liệu không
            if (!response || response.length === 0) {
                throw new Error('Không có dữ liệu phân bố tồn kho');
            }
            return response;
        } catch (error) {
            console.error('Error fetching inventory distribution:', error);
            throw new Error('Không thể lấy phân bố tồn kho');
        }
    }

    /**
     * Lấy danh sách sản phẩm được nhập gần đây
     * 
     * @returns {Promise<Object[]>} - Danh sách sản phẩm được nhập gần đây
     */
    async getRecentImports() {
        try {
            const response = await api.get(this.endpoints.recentImports);
            // Kiểm tra xem response có dữ liệu không
            if (!response || response.length === 0) {
                throw new Error('Không có dữ liệu sản phẩm được nhập gần đây');
            }
            return response;
        } catch (error) {
            console.error('Error fetching recent imports:', error);
            throw new Error('Không thể tải danh sách sản phẩm được nhập gần đây');
        }
    }

    /**
     * Lấy danh sách sản phẩm được xuất gần đây
     * 
     * @returns {Promise<Object[]>} - Danh sách sản phẩm được xuất gần đây
     */
    async getRecentExports() {
        try {
            const response = await api.get(this.endpoints.recentExports);
            // Kiểm tra xem response có dữ liệu không
            if (!response || response.length === 0) {
                throw new Error('Không có dữ liệu sản phẩm được xuất gần đây');
            }
            return response;
        } catch (error) {
            console.error('Error fetching recent exports:', error);
            throw new Error('Không thể tải danh sách sản phẩm được xuất gần đây');
        }
    }

    /**
     * Lấy dữ liệu biến động nhập/xuất kho theo thời gian
     * @param {string} period - Khoảng thời gian (day, week, month, quarter)
     * @param {Date} startDate - Ngày bắt đầu 
     * @param {Date} endDate - Ngày kết thúc
     * @returns {Promise<InventoryMovementData[]>} - Dữ liệu biến động nhập/xuất kho
     */
    async getInventoryMovement(period = 'day', startDate = null, endDate = null) {
        try {
            const params = {
                period,
                startDate: startDate,
                endDate: endDate
            };

            // Thử gọi API thực tế
            try {
                const response = await api.get(this.endpoints.inventoryMovement, params);
                return response.map(item => new InventoryMovementData(item));
            } catch (apiError) {
                console.warn('API chưa sẵn sàng, sử dụng dữ liệu mẫu:', apiError);
                // Trả về dữ liệu mẫu nếu API chưa sẵn sàng
                return this.generateSampleMovementData(period);
            }
        } catch (error) {
            console.error('Error fetching inventory movement:', error);
            throw new Error('Không thể tải dữ liệu biến động nhập/xuất kho');
        }
    }

    /**
     * Lấy dữ liệu lịch sử kho cho DataTable
     * @param {Object} params - Các tham số lọc và phân trang
     * @returns {Promise<Object>} - Dữ liệu cho DataTable
     */
    async getInventoryHistory(params = {}) {
        try {
            // Params mặc định
            const defaultParams = {
                productId: null,
                actionType: null,
                startDate: null,
                endDate: null,
                start: 0,
                length: 10,
                sortColumn: 'createdAt',
                sortDirection: 'desc'
            };

            const queryParams = { ...defaultParams, ...params };

            // Thử gọi API thực tế
            try {
                const response = await api.get(this.endpoints.inventoryHistory, queryParams);

                return {
                    data: response.data.map(item => new InventoryHistoryItem(item)),
                    recordsTotal: response.recordsTotal,
                    recordsFiltered: response.recordsFiltered
                };
            } catch (apiError) {
                console.warn('API chưa sẵn sàng, sử dụng dữ liệu mẫu:', apiError);
                // Trả về dữ liệu mẫu nếu API chưa sẵn sàng
                return this.generateSampleHistoryData(queryParams);
            }
        } catch (error) {
            console.error('Error fetching inventory history:', error);
            throw new Error('Không thể tải dữ liệu lịch sử kho');
        }
    }

    /**
     * Lấy tỷ lệ xuất nhập theo danh mục
     * @returns {Promise<CategoryMovementRatio[]>} - Dữ liệu tỷ lệ xuất nhập theo danh mục
     */
    async getCategoryMovementRatio() {
        try {
            // Thử gọi API thực tế
            try {
                const response = await api.get(this.endpoints.categoryMovementRatio);
                return response.map(item => new CategoryMovementRatio(item));
            } catch (apiError) {
                console.warn('API chưa sẵn sàng, sử dụng dữ liệu mẫu:', apiError);
                // Trả về dữ liệu mẫu nếu API chưa sẵn sàng
                return this.generateSampleCategoryRatioData();
            }
        } catch (error) {
            console.error('Error fetching category movement ratio:', error);
            throw new Error('Không thể tải dữ liệu tỷ lệ xuất nhập theo danh mục');
        }
    }

    /**
     * Lấy tổng quan biến động kho
     * @returns {Promise<InventoryMovementSummary>} - Dữ liệu tổng quan biến động kho
     */
    async getMovementSummary() {
        try {
            // Thử gọi API thực tế
            try {
                const response = await api.get(this.endpoints.movementSummary);
                return new InventoryMovementSummary(response);
            } catch (apiError) {
                console.warn('API chưa sẵn sàng, sử dụng dữ liệu mẫu:', apiError);
                // Trả về dữ liệu mẫu nếu API chưa sẵn sàng
                return this.generateSampleSummaryData();
            }
        } catch (error) {
            console.error('Error fetching movement summary:', error);
            throw new Error('Không thể tải dữ liệu tổng quan biến động kho');
        }
    }

    /**
     * Lấy danh sách sản phẩm tồn kho hàng đầu
     * @returns {Promise<Object[]>} - Danh sách sản phẩm tồn kho hàng đầu
     */
    async getTopInventory() {
        try {
            // Thử gọi API thực tế
            const response = await api.get(this.endpoints.topInventory);
            // Kiểm tra xem response có dữ liệu không
            if (!response || response.length === 0) {
                throw new Error('Không có dữ liệu sản phẩm tồn kho hàng đầu');
            }
            return response;
        } catch (error) {
            console.error('Error fetching top inventory:', error);
            throw new Error('Không thể tải danh sách sản phẩm tồn kho hàng đầu');
        }
    }

    // ========= HELPER METHODS FOR SAMPLE DATA =========

    /**
     * Tạo dữ liệu mẫu cho biến động nhập/xuất kho
     * @param {string} period - Khoảng thời gian (day, week, month, quarter)
     * @returns {InventoryMovementData[]} - Dữ liệu mẫu
     */
    generateSampleMovementData(period) {
        const result = [];
        let count;

        switch (period) {
            case 'day': count = 7; break;
            case 'week': count = 6; break;
            case 'month': count = 6; break;
            case 'quarter': count = 4; break;
            default: count = 7;
        }

        const today = new Date();

        for (let i = 0; i < count; i++) {
            const date = new Date();

            // Điều chỉnh ngày theo period
            if (period === 'day') {
                date.setDate(today.getDate() - i);
            } else if (period === 'week') {
                date.setDate(today.getDate() - (i * 7));
            } else if (period === 'month') {
                date.setMonth(today.getMonth() - i);
            } else if (period === 'quarter') {
                date.setMonth(today.getMonth() - (i * 3));
            }

            // Tạo nhãn cho period
            let periodLabel;
            if (period === 'day') {
                periodLabel = `${date.getDate()}/${date.getMonth() + 1}`;
            } else if (period === 'week') {
                periodLabel = `Tuần ${Math.ceil(date.getDate() / 7)} (${date.getDate()}/${date.getMonth() + 1})`;
            } else if (period === 'month') {
                periodLabel = `${date.getMonth() + 1}/${date.getFullYear()}`;
            } else if (period === 'quarter') {
                const quarter = Math.floor(date.getMonth() / 3) + 1;
                periodLabel = `Q${quarter}/${date.getFullYear()}`;
            }

            // Tạo dữ liệu ngẫu nhiên
            const importQty = Math.floor(Math.random() * 100) + 50;
            const importValue = (Math.random() * 10000000 + 5000000).toFixed(0);
            const exportQty = Math.floor(Math.random() * 80) + 20;
            const exportValue = (Math.random() * 8000000 + 4000000).toFixed(0);

            result.push(new InventoryMovementData({
                periodDate: date,
                periodLabel,
                importQuantity: importQty,
                importValue,
                exportQuantity: exportQty,
                exportValue,
                netQuantityChange: importQty - exportQty,
                netValueChange: importValue - exportValue
            }));
        }

        // Sắp xếp theo ngày tăng dần
        return result.sort((a, b) => new Date(a.periodDate) - new Date(b.periodDate));
    }

    /**
     * Tạo dữ liệu mẫu cho lịch sử kho
     * @param {Object} params - Các tham số lọc và phân trang
     * @returns {Object} - Dữ liệu mẫu cho DataTable
     */
    generateSampleHistoryData(params) {
        const sampleData = [];

        // Các sản phẩm mẫu
        const products = [
            { id: 1, name: 'Đắc Nhân Tâm', image: 'dacnhantam.jpg' },
            { id: 2, name: 'Nhà Giả Kim', image: 'nhagiakim.jpg' },
            { id: 3, name: 'Tư Duy Phản Biện', image: 'tuduyphanbien.jpg' },
            { id: 4, name: 'Điều Kỳ Diệu Của Thói Quen', image: 'dieukydieu.jpg' },
            { id: 5, name: 'Khéo Ăn Nói Sẽ Có Được Thiên Hạ', image: 'kheoannoi.jpg' }
        ];

        // Người dùng mẫu
        const users = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Phạm Thị D'];

        // Các loại hành động
        const actionTypes = ['import', 'export', 'adjustment'];

        // Các lý do
        const reasons = {
            import: ['Nhập kho từ nhà cung cấp', 'Nhập hàng trả lại', 'Điều chuyển từ kho khác'],
            export: ['Xuất cho đơn hàng', 'Xuất hàng bị lỗi', 'Điều chuyển đến kho khác'],
            adjustment: ['Kiểm kê điều chỉnh', 'Hàng hư hỏng', 'Hàng mất mát']
        };

        // Tạo dữ liệu mẫu
        for (let i = 1; i <= 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 30));

            const product = products[Math.floor(Math.random() * products.length)];
            const actionType = actionTypes[Math.floor(Math.random() * actionTypes.length)];
            const reason = reasons[actionType][Math.floor(Math.random() * reasons[actionType].length)];

            const previousQty = Math.floor(Math.random() * 100) + 50;
            let quantityChange;

            if (actionType === 'import') {
                quantityChange = Math.floor(Math.random() * 50) + 10;
            } else if (actionType === 'export') {
                quantityChange = -1 * (Math.floor(Math.random() * 30) + 5);
            } else { // adjustment
                quantityChange = Math.random() > 0.5 ?
                    Math.floor(Math.random() * 10) + 1 :
                    -1 * (Math.floor(Math.random() * 10) + 1);
            }

            sampleData.push(new InventoryHistoryItem({
                id: i,
                createdAt: date,
                productId: product.id,
                productName: product.name,
                productImage: product.image,
                actionType,
                previousQuantity: previousQty,
                quantityChange,
                currentQuantity: previousQty + quantityChange,
                reason,
                referenceId: actionType === 'export' ? Math.floor(Math.random() * 1000) + 1 : null,
                referenceType: actionType === 'export' ? 'order' : '',
                notes: '',
                createdByName: users[Math.floor(Math.random() * users.length)]
            }));
        }

        // Sắp xếp theo ngày giảm dần
        sampleData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Lọc theo loại hành động nếu có
        let filteredData = sampleData;
        if (params.actionType) {
            filteredData = filteredData.filter(item => item.actionType === params.actionType);
        }

        // Lọc theo sản phẩm nếu có
        if (params.productId) {
            filteredData = filteredData.filter(item => item.productId === params.productId);
        }

        // Lấy subset cho phân trang
        const start = params.start || 0;
        const length = params.length || 10;
        const paginatedData = filteredData.slice(start, start + length);

        return {
            data: paginatedData,
            recordsTotal: sampleData.length,
            recordsFiltered: filteredData.length
        };
    }

    /**
     * Tạo dữ liệu mẫu cho tỷ lệ xuất nhập theo danh mục
     * @returns {CategoryMovementRatio[]} - Dữ liệu mẫu
     */
    generateSampleCategoryRatioData() {
        const categories = [
            { id: 1, name: 'Sách Kỹ năng' },
            { id: 2, name: 'Sách Văn học' },
            { id: 3, name: 'Sách Kinh tế' },
            { id: 4, name: 'Sách Thiếu nhi' },
            { id: 5, name: 'Sách Ngoại ngữ' },
            { id: 6, name: 'Sách Tâm lý' }
        ];

        return categories.map(category => {
            const importQty = Math.floor(Math.random() * 200) + 100;
            const importValue = (Math.random() * 20000000 + 10000000).toFixed(0);
            const exportQty = Math.floor(Math.random() * importQty);
            const exportValue = (exportQty / importQty * importValue).toFixed(0);
            const currentQty = importQty - exportQty;
            const currentValue = (importValue - exportValue).toFixed(0);
            const movementRatio = ((exportQty / importQty) * 100).toFixed(1);

            return new CategoryMovementRatio({
                categoryId: category.id,
                categoryName: category.name,
                importQuantity: importQty,
                importValue,
                exportQuantity: exportQty,
                exportValue,
                currentQuantity: currentQty,
                currentValue,
                movementRatio
            });
        });
    }

    /**
     * Tạo dữ liệu mẫu cho tổng quan biến động kho
     * @returns {InventoryMovementSummary} - Dữ liệu mẫu
     */
    generateSampleSummaryData() {
        const importQty30days = Math.floor(Math.random() * 500) + 300;
        const importQtyPrev30days = Math.floor(Math.random() * 500) + 300;
        const exportQty30days = Math.floor(Math.random() * 400) + 200;
        const exportQtyPrev30days = Math.floor(Math.random() * 400) + 200;

        return new InventoryMovementSummary({
            importQty30days,
            exportQty30days,
            importValue30days: (importQty30days * 200000).toFixed(0),
            exportValue30days: (exportQty30days * 250000).toFixed(0),
            importQtyPrev30days,
            exportQtyPrev30days,
            adjustmentQty30days: Math.floor(Math.random() * 50) + 10,
            highTurnoverProducts: Math.floor(Math.random() * 20) + 5,
            noMovementProducts: Math.floor(Math.random() * 30) + 10
        });
    }
}

// Singleton pattern - chỉ tạo một instance duy nhất của InventoryService
let instance = null;

export const inventoryService = {
    getInstance: () => {
        if (!instance) {
            instance = new InventoryService();
        }
        return instance;
    }
};