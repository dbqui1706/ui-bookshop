import { Order } from '../models/order.js';
import { OrderDetail } from '../models/orderDetail.js';
import { EventBus } from '../core/eventBus.js';
import { api } from '../core/api.js';
import { formatDate } from '../core/utils.js';
import { getToken } from '../core/storage.js';

/**
 * Class OrderService - Service xử lý logic liên quan đến đơn hàng
 */
export class OrderService {
    /**
     * Khởi tạo service
     */
    constructor() {
        // Event bus để giao tiếp giữa các component
        this.eventBus = EventBus.getInstance();
        
        // API endpoints
        this.endpoints = {
            getAll: 'api/admin/orders',
            getById: 'api/admin/orders/',
            getByCode: 'api/admin/orders',
            create: 'api/admin/orders/create',
            update: 'api/admin/orders/update',
            updateStatus: 'api/admin/orders/update-status',
            delete: 'api/admin/orders/delete'
        };
        
        // Mock data cho đơn hàng
        this.mockOrders = this.generateMockOrders();
    }

    /**
     * Tạo dữ liệu mẫu cho đơn hàng
     * @returns {Array} - Danh sách đơn hàng mẫu
     */
    generateMockOrders() {
        const mockData = [];
        const statuses = ['pending', 'waiting_payment', 'processing', 'shipping', 'delivered', 'cancelled', 'refunded'];
        const paymentStatuses = ['pending', 'completed', 'failed', 'refunded'];
        const paymentMethods = [
            { id: 1, name: 'COD' }, 
            { id: 2, name: 'Chuyển khoản' }, 
            { id: 3, name: 'Thẻ tín dụng' }, 
            { id: 4, name: 'Ví MoMo' }
        ];
        
        // Tạo sản phẩm mẫu
        const mockProducts = [
            { id: 1, name: 'Đắc Nhân Tâm', image: 'https://via.placeholder.com/40', price: 120000 },
            { id: 2, name: 'Nhà Giả Kim', image: 'https://via.placeholder.com/40', price: 85000 },
            { id: 3, name: 'Tuổi Trẻ Đáng Giá Bao Nhiêu', image: 'https://via.placeholder.com/40', price: 65000 },
            { id: 4, name: 'Người Giàu Có Nhất Thành Babylon', image: 'https://via.placeholder.com/40', price: 95000 },
            { id: 5, name: 'Đọc Vị Bất Kỳ Ai', image: 'https://via.placeholder.com/40', price: 110000 },
            { id: 6, name: 'Tư Duy Phản Biện', image: 'https://via.placeholder.com/40', price: 75000 },
            { id: 7, name: 'Chiến Tranh Tiền Tệ', image: 'https://via.placeholder.com/40', price: 135000 },
            { id: 8, name: 'Khởi Nghiệp Tinh Gọn', image: 'https://via.placeholder.com/40', price: 125000 }
        ];
        
        // Tạo người dùng mẫu
        const mockUsers = [
            { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', phone: '0912345678' },
            { id: 2, name: 'Trần Thị B', email: 'tranthib@example.com', phone: '0987654321' },
            { id: 3, name: 'Lê Văn C', email: 'levanc@example.com', phone: '0909123456' },
            { id: 4, name: 'Phạm Thị D', email: 'phamthid@example.com', phone: '0978123456' },
            { id: 5, name: 'Hoàng Văn E', email: 'hoangvane@example.com', phone: '0936789012' }
        ];
        
        // Tạo 50 đơn hàng mẫu
        for (let i = 1; i <= 50; i++) {
            // Chọn ngẫu nhiên trạng thái và phương thức thanh toán
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            
            const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
            // Xác định trạng thái thanh toán dựa trên trạng thái đơn hàng và phương thức thanh toán
            let paymentStatus;
            if (status === 'delivered' || status === 'shipping') {
                paymentStatus = paymentMethod.id === 1 ? (Math.random() > 0.3 ? 'completed' : 'pending') : 'completed';
            } else if (status === 'cancelled') {
                paymentStatus = Math.random() > 0.5 ? 'failed' : 'pending';
            } else if (status === 'refunded') {
                paymentStatus = 'refunded';
            } else {
                paymentStatus = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
                paymentStatus = paymentMethod.id === 1 ? 'pending' : (Math.random() > 0.3 ? 'completed' : 'pending');
            }
            
            // Chọn ngẫu nhiên người dùng
            const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
            
            // Tạo đơn hàng mẫu
            const order = {
                id: i,
                orderCode: 'ORD' + String(i).padStart(6, '0'),
                userId: user.id,
                userName: user.name,
                userEmail: user.email,
                userPhone: user.phone,
                status: status,
                deliveryMethodId: Math.floor(Math.random() * 3) + 1,
                paymentMethodId: paymentMethod.id,
                paymentMethodName: paymentMethod.name,
                paymentStatus: paymentStatus,
                subtotal: 0,
                deliveryPrice: Math.floor(Math.random() * 3) * 15000,
                discountAmount: 0,
                taxAmount: 0,
                totalAmount: 0,
                couponCode: Math.random() > 0.8 ? 'SALE' + Math.floor(Math.random() * 1000) : null,
                note: Math.random() > 0.7 ? 'Ghi chú đơn hàng #' + i : '',
                isVerified: Math.random() > 0.1,
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
                updatedAt: null,
                items: [],
                shipping: {
                    receiverName: user.name,
                    receiverPhone: user.phone,
                    receiverEmail: user.email,
                    address: Math.floor(Math.random() * 200) + 1 + ' Đường ' + 
                             String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                             ', Phường ' + Math.floor(Math.random() * 30) + 
                             ', Quận ' + Math.floor(Math.random() * 12) + 
                             ', TP. Hồ Chí Minh',
                    province: 'TP. Hồ Chí Minh',
                    district: 'Quận ' + Math.floor(Math.random() * 12),
                    ward: 'Phường ' + Math.floor(Math.random() * 30),
                    notes: Math.random() > 0.8 ? 'Ghi chú giao hàng' : ''
                }
            };
            
            // Tạo items trong đơn hàng
            const numItems = Math.floor(Math.random() * 5) + 1;
            const selectedProducts = [];
            
            for (let j = 0; j < numItems; j++) {
                // Chọn ngẫu nhiên sản phẩm (đảm bảo không trùng lặp)
                let product;
                do {
                    product = mockProducts[Math.floor(Math.random() * mockProducts.length)];
                } while (selectedProducts.includes(product.id));
                
                selectedProducts.push(product.id);
                
                // Xác định số lượng và giá
                const quantity = Math.floor(Math.random() * 3) + 1;
                const discountPercent = Math.random() > 0.7 ? Math.floor(Math.random() * 20) + 5 : 0;
                const price = product.price * (1 - discountPercent / 100);
                const subtotal = price * quantity;
                
                // Thêm item vào đơn hàng
                order.items.push({
                    id: j + 1,
                    orderId: order.id,
                    productId: product.id,
                    productName: product.name,
                    productImage: product.image,
                    basePrice: product.price,
                    discountPercent: discountPercent,
                    price: price,
                    quantity: quantity,
                    subtotal: subtotal,
                    createdAt: order.createdAt,
                    updatedAt: null
                });
                
                // Cập nhật tổng tiền đơn hàng
                order.subtotal += subtotal;
            }
            
            // Tính giảm giá (nếu có)
            if (order.couponCode) {
                order.discountAmount = Math.round(order.subtotal * 0.1); // Giảm 10%
            }
            
            // Tính thuế (nếu có)
            order.taxAmount = Math.round(order.subtotal * 0.05); // 5% thuế
            
            // Tính tổng tiền
            order.totalAmount = order.subtotal + order.taxAmount + order.deliveryPrice - order.discountAmount;
            
            // Thêm vào danh sách đơn hàng mẫu
            mockData.push(new Order(order));
        }
        
        return mockData;
    }

    /**
     * Lấy tất cả đơn hàng
     * @param {Object} params - Tham số lọc và phân trang
     * @returns {Promise<Object>} - Danh sách đơn hàng và thông tin phân trang
     */
    async getAllOrders(params = {}) {
        try {
            // Trong môi trường thực tế, sẽ gọi API
            // const response = await api.get(this.endpoints.getAll, params);
            
            // Sử dụng mock data
            let filteredOrders = [...this.mockOrders];
            
            // Áp dụng bộ lọc
            if (params.search) {
                const searchLower = params.search.toLowerCase();
                filteredOrders = filteredOrders.filter(order => 
                    order.orderCode.toLowerCase().includes(searchLower) ||
                    order.userName.toLowerCase().includes(searchLower) ||
                    order.userPhone.includes(params.search)
                );
            }
            
            if (params.status) {
                filteredOrders = filteredOrders.filter(order => order.status === params.status);
            }
            
            if (params.paymentMethod) {
                filteredOrders = filteredOrders.filter(order => order.paymentMethodId === parseInt(params.paymentMethod));
            }
            
            if (params.fromDate) {
                const fromDate = new Date(params.fromDate);
                filteredOrders = filteredOrders.filter(order => new Date(order.createdAt) >= fromDate);
            }
            
            if (params.toDate) {
                const toDate = new Date(params.toDate);
                toDate.setHours(23, 59, 59, 999); // Đặt thời gian về cuối ngày
                filteredOrders = filteredOrders.filter(order => new Date(order.createdAt) <= toDate);
            }
            
            // Tính toán phân trang
            const page = parseInt(params.page) || 1;
            const limit = parseInt(params.limit) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            
            // Tổng số đơn hàng sau khi lọc
            const total = filteredOrders.length;
            
            // Sắp xếp theo thời gian tạo mới nhất
            filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            // Lấy dữ liệu theo phân trang
            const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
            
            // Định dạng dữ liệu output cho DataTable
            return {
                data: paginatedOrders,
                page: page,
                limit: limit,
                total: total,
                totalPages: Math.ceil(total / limit)
            };
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw new Error('Không thể tải danh sách đơn hàng');
        }
    }

    /**
     * Lấy đơn hàng theo ID
     * @param {number} id - ID của đơn hàng
     * @returns {Promise<Order|null>} - Đơn hàng tìm thấy hoặc null
     */
    async getOrderById(id) {
        try {
            // Trong môi trường thực tế, sẽ gọi API
            // const response = await api.get(`${this.endpoints.getById}${id}`);
            
            // Sử dụng mock data
            const order = this.mockOrders.find(order => order.id === parseInt(id));
            
            if (!order) {
                return null; // Không tìm thấy đơn hàng
            }
            
            return order;
        } catch (error) {
            console.error(`Error fetching order ${id}:`, error);
            throw new Error('Không thể tải thông tin đơn hàng');
        }
    }

    /**
     * Lấy đơn hàng theo mã đơn hàng
     * @param {string} code - Mã đơn hàng
     * @returns {Promise<OrderDeail|null>} - Đơn hàng tìm thấy hoặc null
     */
    async getOrderByCode(code) {
        try {
            const response = await api.get(`${this.endpoints.getByCode}`, {code});
            
            return new OrderDetail(response);
        } catch (error) {
            throw new Error('Không thể tải thông tin đơn hàng');
        }
    }

    /**
     * Tạo đơn hàng mới
     * @param {Order} order - Đối tượng đơn hàng
     * @returns {Promise<Order>} - Đơn hàng đã được tạo
     */
    async createOrder(order) {
        try {
            // Trong môi trường thực tế, sẽ gọi API
            // const response = await api.post(this.endpoints.create, order.toJSON());
            
            // Sử dụng mock data
            const lastId = this.mockOrders.length > 0 ? 
                Math.max(...this.mockOrders.map(o => o.id)) : 0;
            
            // Tạo đơn hàng mới
            const newOrder = new Order({
                ...order.toJSON(),
                id: lastId + 1,
                orderCode: 'ORD' + String(lastId + 1).padStart(6, '0'),
                createdAt: new Date(),
                updatedAt: new Date()
            });
            
            // Thêm vào danh sách
            this.mockOrders.push(newOrder);
            
            // Thông báo thay đổi
            this.eventBus.emit('order:created', newOrder);
            
            return newOrder;
        } catch (error) {
            console.error('Error creating order:', error);
            throw new Error('Không thể tạo đơn hàng mới');
        }
    }

    /**
     * Cập nhật đơn hàng
     * @param {number} id - ID của đơn hàng
     * @param {Order} orderData - Dữ liệu cập nhật
     * @returns {Promise<Order>} - Đơn hàng đã được cập nhật
     */
    async updateOrder(id, orderData) {
        try {
            // Trong môi trường thực tế, sẽ gọi API
            // const response = await api.put(this.endpoints.update, { id, ...orderData.toJSON() });
            
            // Sử dụng mock data
            const index = this.mockOrders.findIndex(order => order.id === parseInt(id));
            
            if (index === -1) {
                throw new Error('Không tìm thấy đơn hàng');
            }
            
            // Lưu trữ đơn hàng cũ để thông báo thay đổi
            const oldOrder = this.mockOrders[index];
            
            // Cập nhật đơn hàng
            const updatedOrder = new Order({
                ...oldOrder.toJSON(),
                ...orderData.toJSON(),
                id: parseInt(id),
                updatedAt: new Date()
            });
            
            // Cập nhật vào danh sách
            this.mockOrders[index] = updatedOrder;
            
            // Thông báo thay đổi
            this.eventBus.emit('order:updated', {
                oldOrder,
                newOrder: updatedOrder
            });
            
            return updatedOrder;
        } catch (error) {
            console.error(`Error updating order ${id}:`, error);
            throw new Error('Không thể cập nhật đơn hàng');
        }
    }

    /**
     * Cập nhật trạng thái đơn hàng
     * @param {number} id - ID của đơn hàng
     * @param {string} status - Trạng thái mới
     * @param {string} note - Ghi chú khi thay đổi trạng thái
     * @returns {Promise<Order>} - Đơn hàng đã được cập nhật
     */
    async updateOrderStatus(id, status, note = '') {
        console.log('updateOrderStatus', id, status, note);
        try {
            const response = await api.put(this.endpoints.updateStatus, 
               { id, status, note },

            );
            
            if (!response) {
                return {
                    success: false,
                    message: 'Cập nhật trạng thái đơn hàng thất bại',
                }
            }
            
            return {
                success: true,
                message: 'Cập nhật trạng thái đơn hàng thành công',
            }
        } catch (error) {
            console.error(`Error updating order status ${id}:`, error);
            throw new Error('Không thể cập nhật trạng thái đơn hàng');
        }
    }

    /**
     * Xóa đơn hàng
     * @param {number} id - ID của đơn hàng
     * @returns {Promise<boolean>} - Kết quả xóa đơn hàng
     */
    async deleteOrder(id) {
        try {
            // Trong môi trường thực tế, sẽ gọi API
            // await api.delete(this.endpoints.delete, { id });
            
            // Sử dụng mock data
            const index = this.mockOrders.findIndex(order => order.id === parseInt(id));
            
            if (index === -1) {
                throw new Error('Không tìm thấy đơn hàng');
            }
            
            // Lưu lại đơn hàng bị xóa để thông báo
            const deletedOrder = this.mockOrders[index];
            
            // Xóa khỏi danh sách
            this.mockOrders.splice(index, 1);
            
            // Thông báo thay đổi
            this.eventBus.emit('order:deleted', deletedOrder);
            
            return true;
        } catch (error) {
            console.error(`Error deleting order ${id}:`, error);
            throw new Error('Không thể xóa đơn hàng');
        }
    }

    /**
     * Lấy thống kê đơn hàng
     * @returns {Promise<Object>} - Thống kê đơn hàng
     */
    async getOrderStatistics() {
        try {
            // Trong môi trường thực tế, sẽ gọi API để lấy thống kê
            // const response = await api.get('/api/admin/orders/statistics');
            
            // Sử dụng mock data để tạo thống kê
            const total = this.mockOrders.length;
            
            // Đếm đơn hàng theo trạng thái
            const pendingCount = this.mockOrders.filter(order => order.status === 'pending').length;
            const processingCount = this.mockOrders.filter(order => order.status === 'processing').length;
            const shippingCount = this.mockOrders.filter(order => order.status === 'shipping').length;
            const deliveredCount = this.mockOrders.filter(order => order.status === 'delivered').length;
            const cancelledCount = this.mockOrders.filter(order => order.status === 'cancelled').length;
            
            // Tính tổng doanh thu
            const totalRevenue = this.mockOrders
                .filter(order => order.status === 'delivered')
                .reduce((sum, order) => sum + order.totalAmount, 0);
            
            // Tính tổng doanh thu trong tháng hiện tại
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const monthlyRevenue = this.mockOrders
                .filter(order => 
                    order.status === 'delivered' && 
                    new Date(order.createdAt) >= startOfMonth
                )
                .reduce((sum, order) => sum + order.totalAmount, 0);
            
            // Thống kê đơn hàng 30 ngày gần nhất theo ngày
            const last30Days = [];
            for (let i = 0; i < 30; i++) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                date.setHours(0, 0, 0, 0);
                
                const nextDay = new Date(date);
                nextDay.setDate(nextDay.getDate() + 1);
                
                const ordersInDay = this.mockOrders.filter(order => 
                    new Date(order.createdAt) >= date && 
                    new Date(order.createdAt) < nextDay
                );
                
                last30Days.push({
                    date: formatDate(date),
                    count: ordersInDay.length,
                    revenue: ordersInDay.reduce((sum, order) => sum + order.totalAmount, 0)
                });
            }
            
            // Trả về kết quả thống kê
            return {
                total,
                pending: pendingCount,
                processing: processingCount,
                shipping: shippingCount,
                delivered: deliveredCount,
                cancelled: cancelledCount,
                totalRevenue,
                monthlyRevenue,
                last30Days: last30Days.reverse() // Đảo ngược để có thứ tự từ cũ đến mới
            };
        } catch (error) {
            console.error('Error fetching order statistics:', error);
            throw new Error('Không thể tải thống kê đơn hàng');
        }
    }
    
    /**
     * Tìm kiếm sản phẩm để thêm vào đơn hàng
     * @param {string} keyword - Từ khóa tìm kiếm
     * @returns {Promise<Array>} - Danh sách sản phẩm
     */
    async searchProducts(keyword) {
        try {
            // Trong môi trường thực tế, sẽ gọi API
            // const response = await api.get('/api/admin/products/search', { keyword });
            
            // Sử dụng mock data
            const mockProducts = [
                { id: 1, name: 'Đắc Nhân Tâm', image: 'https://via.placeholder.com/40', price: 120000, stock: 45, sku: 'DNT0001' },
                { id: 2, name: 'Nhà Giả Kim', image: 'https://via.placeholder.com/40', price: 85000, stock: 120, sku: 'NGK0002' },
                { id: 3, name: 'Tuổi Trẻ Đáng Giá Bao Nhiêu', image: 'https://via.placeholder.com/40', price: 65000, stock: 85, sku: 'TTR0003' },
                { id: 4, name: 'Người Giàu Có Nhất Thành Babylon', image: 'https://via.placeholder.com/40', price: 95000, stock: 33, sku: 'NCB0004' },
                { id: 5, name: 'Đọc Vị Bất Kỳ Ai', image: 'https://via.placeholder.com/40', price: 110000, stock: 67, sku: 'DVA0005' },
                { id: 6, name: 'Tư Duy Phản Biện', image: 'https://via.placeholder.com/40', price: 75000, stock: 150, sku: 'TDPB0006' },
                { id: 7, name: 'Chiến Tranh Tiền Tệ', image: 'https://via.placeholder.com/40', price: 135000, stock: 30, sku: 'CTTT0007' },
                { id: 8, name: 'Khởi Nghiệp Tinh Gọn', image: 'https://via.placeholder.com/40', price: 125000, stock: 25, sku: 'KNTG0008' }
            ];
            
            // Tìm kiếm sản phẩm
            if (!keyword) {
                return mockProducts;
            }
            
            const keywordLower = keyword.toLowerCase();
            return mockProducts.filter(product => 
                product.name.toLowerCase().includes(keywordLower) ||
                product.sku.toLowerCase().includes(keywordLower)
            );
        } catch (error) {
            console.error('Error searching products:', error);
            throw new Error('Không thể tìm kiếm sản phẩm');
        }
    }
    
    /**
     * Tìm kiếm khách hàng để thêm vào đơn hàng
     * @param {string} keyword - Từ khóa tìm kiếm
     * @returns {Promise<Array>} - Danh sách khách hàng
     */
    async searchCustomers(keyword) {
        try {
            // Trong môi trường thực tế, sẽ gọi API
            // const response = await api.get('/api/admin/customers/search', { keyword });
            
            // Sử dụng mock data
            const mockCustomers = [
                { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', phone: '0912345678', 
                  addresses: [{ id: 1, address: '123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh', isDefault: true }] 
                },
                { id: 2, name: 'Trần Thị B', email: 'tranthib@example.com', phone: '0987654321',
                  addresses: [{ id: 2, address: '456 Đường DEF, Phường UVW, Quận 2, TP. Hồ Chí Minh', isDefault: true }]
                },
                { id: 3, name: 'Lê Văn C', email: 'levanc@example.com', phone: '0909123456',
                  addresses: [{ id: 3, address: '789 Đường GHI, Phường RST, Quận 3, TP. Hồ Chí Minh', isDefault: true }]
                },
                { id: 4, name: 'Phạm Thị D', email: 'phamthid@example.com', phone: '0978123456',
                  addresses: [{ id: 4, address: '101 Đường JKL, Phường OPQ, Quận 4, TP. Hồ Chí Minh', isDefault: true }]
                },
                { id: 5, name: 'Hoàng Văn E', email: 'hoangvane@example.com', phone: '0936789012',
                  addresses: [{ id: 5, address: '202 Đường MNO, Phường HIJ, Quận 5, TP. Hồ Chí Minh', isDefault: true }]
                }
            ];
            
            // Tìm kiếm khách hàng
            if (!keyword) {
                return mockCustomers;
            }
            
            const keywordLower = keyword.toLowerCase();
            return mockCustomers.filter(customer => 
                customer.name.toLowerCase().includes(keywordLower) ||
                customer.email.toLowerCase().includes(keywordLower) ||
                customer.phone.includes(keyword)
            );
        } catch (error) {
            console.error('Error searching customers:', error);
            throw new Error('Không thể tìm kiếm khách hàng');
        }
    }
    
    /**
     * In đơn hàng
     * @param {number} id - ID của đơn hàng
     * @returns {Promise<string>} - URL file PDF đơn hàng
     */
    async printOrder(id) {
        try {
            // Trong môi trường thực tế, sẽ gọi API để tạo file PDF
            // const response = await api.get(`/api/admin/orders/${id}/print`);
            
            // Mô phỏng thời gian tạo PDF
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Trả về URL file PDF (giả lập)
            return `/orders/print/${id}`;
        } catch (error) {
            console.error(`Error printing order ${id}:`, error);
            throw new Error('Không thể in đơn hàng');
        }
    }
    
    /**
     * Xuất danh sách đơn hàng ra Excel
     * @param {Array} ids - Danh sách ID đơn hàng
     * @returns {Promise<string>} - URL file Excel
     */
    async exportOrdersToExcel(ids = []) {
        try {
            // Trong môi trường thực tế, sẽ gọi API để tạo file Excel
            // const response = await api.post('/api/admin/orders/export', { ids });
            
            // Mô phỏng thời gian tạo Excel
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Trả về URL file Excel (giả lập)
            return '/orders/export';
        } catch (error) {
            console.error('Error exporting orders:', error);
            throw new Error('Không thể xuất danh sách đơn hàng');
        }
    }
}

// Singleton pattern - chỉ tạo một instance duy nhất của OrderService
let instance = null;

export const orderService = {
    getInstance: () => {
        if (!instance) {
            instance = new OrderService();
        }
        return instance;
    }
};