import { STORAGE_KEYS } from '../constants/index.js';

const API_URL = {
    GET_ORDERS: 'http://localhost:8080/api/orders',
    GET_ORDER_DETAIL: 'http://localhost:8080/api/orders/detail',
    ADD_TO_CART: 'http://localhost:8080/api/cart/add-multiple',
    CANCEL_ORDER: 'http://localhost:8080/api/orders/${orderId}/cancel',
    GET_DELIVERY_METHODS: 'http://localhost:8080/api/delivery-methods',
    GET_PAYMENT_METHODS: 'http://localhost:8080/api/payment-methods',
}

const HEADERS = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem(STORAGE_KEYS.TOKEN)}`,
}

export class OrderService {
    /**
     * Lấy danh sách đơn hàng theo trạng thái
     * @param {string} status Trạng thái đơn hàng ('all', 'pending', 'processing', 'shipping', 'delivered', 'cancelled')
     * @param {number} page Trang hiện tại
     * @param {number} limit Số lượng đơn hàng trên mỗi trang
     * @param {string} keyword Từ khóa tìm kiếm
     * @returns {Object} Kết quả và dữ liệu đơn hàng
     */
    async getOrders(status = 'all', page = 1, limit = 10, keyword = '') {
        try {
            const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
            
            if (!token) {
                return {
                    success: false,
                    message: 'Bạn chưa đăng nhập'
                };
            }
            
            // Tạo tham số query
            let queryParams = new URLSearchParams({
                page,
                limit
            });
            
            if (status !== 'all') {
                queryParams.append('status', status);
            }
            
            if (keyword) {
                queryParams.append('keyword', keyword);
            }
            
            // Trong thực tế, URL có thể được thêm từ API_URL.GET_ORDERS
            const url = `${API_URL.GET_ORDERS}?${queryParams.toString()}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            // Xử lý lỗi HTTP
            if (!response.ok) {
                if (response.status === 401) {
                    return {
                        success: false,
                        message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
                        unauthorized: true
                    };
                }
                
                const errorData = await response.json();
                return {
                    success: false,
                    message: errorData.message || 'Không thể tải danh sách đơn hàng'
                };
            }
            
            // Mô phỏng dữ liệu trả về từ API
            // Trong thực tế, dữ liệu này sẽ được trả về từ server
            const mockOrders = this.getMockOrders(status, keyword);
            const totalOrders = mockOrders.length;
            const totalPages = Math.ceil(totalOrders / limit);
            const currentPage = page;
            
            // Phân trang giả lập
            const startIndex = (page - 1) * limit;
            const endIndex = Math.min(startIndex + limit, totalOrders);
            const paginatedOrders = mockOrders.slice(startIndex, endIndex);
            
            return {
                success: true,
                orders: paginatedOrders,
                pagination: {
                    totalOrders,
                    totalPages,
                    currentPage,
                    limit
                }
            };
        } catch (error) {
            console.error('Lỗi khi lấy danh sách đơn hàng:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra khi tải danh sách đơn hàng'
            };
        }
    }

    /**
     * Lấy danh sách phương thức giao hàng
     * @returns {Object} Kết quả và dữ liệu phương thức giao hàng
     */
    async getDeliveryMethods() {
        try {
            const response = await fetch(API_URL.GET_DELIVERY_METHODS);
            if (!response.ok) {
                return {
                    success: false,
                    message: 'Không thể tải danh sách phương thức giao hàng'
                };
            }
            
            const data = await response.json();
            
            return {
                success: true,
                data: data
            };
        } catch (error) {
            console.error('Lỗi khi lấy danh sách phương thức giao hàng:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra khi tải danh sách phương thức giao hàng'
            };
        }
    }
    
    /**
     * Lấy danh sách phương thức thanh toán
     * @returns {Object} Kết quả và dữ liệu phương thức thanh toán
     */
    async getPaymentMethods() {
        try {
            const response = await fetch(API_URL.GET_PAYMENT_METHODS);
            if (!response.ok) {
                return {
                    success: false,
                    message: 'Không thể tải danh sách phương thức thanh toán'
                };  
            }
            
            const data = await response.json();
            return {
                success: true,
                data: data
            };          
        } catch (error) {
            console.error('Lỗi khi lấy danh sách phương thức thanh toán:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra khi tải danh sách phương thức thanh toán'
            };
        }
    }
    /**
     * Mô phỏng dữ liệu đơn hàng
     * @param {string} status Trạng thái đơn hàng
     * @param {string} keyword Từ khóa tìm kiếm
     * @returns {Array} Danh sách đơn hàng
     */
    getMockOrders(status, keyword) {
        // Danh sách mẫu các đơn hàng
        const mockOrders = [
            {
                id: "2345678",
                orderDate: "2025-03-15",
                status: "delivered",
                statusText: "Đã giao",
                totalAmount: 718000,
                products: [
                    {
                        id: "prod-001",
                        title: "Combo Sách Kỹ Năng Sống (Bộ 3 Cuốn)",
                        image: "/asset/images/image.png",
                        variant: "Bìa mềm",
                        quantity: 1,
                        price: 359000
                    },
                    {
                        id: "prod-002",
                        title: "Khoa Học Về Những Điều Giản Đơn",
                        image: "/asset/images/image.png",
                        variant: "Bìa mềm",
                        quantity: 1,
                        price: 359000
                    },
                    {
                        id: "prod-003",
                        title: "Đắc Nhân Tâm - Phiên Bản Đặc Biệt",
                        image: "/asset/images/image.png",
                        variant: "Bìa mềm",
                        quantity: 1,
                        price: 359000
                    },
                    {
                        id: "prod-004",
                        title: "Phút Dừng Chân Của Người Trẻ",
                        image: "/asset/images/image.png",
                        variant: "Bìa mềm",
                        quantity: 1,
                        price: 359000
                    }
                ]
            },
            {
                id: "2335597",
                orderDate: "2025-02-27",
                status: "cancelled",
                statusText: "Đã hủy",
                totalAmount: 428000,
                products: [
                    {
                        id: "prod-005",
                        title: "Nghệ Thuật Tư Duy Chiến Lược - Lý Thuyết Trò Chơi Trong Cuộc Sống",
                        image: "/asset/images/image.png",
                        variant: "Bìa cứng",
                        quantity: 2,
                        price: 428000
                    }
                ]
            },
            {
                id: "2324456",
                orderDate: "2025-02-15",
                status: "shipping",
                statusText: "Đang vận chuyển",
                totalAmount: 189000,
                products: [
                    {
                        id: "prod-006",
                        title: "Thao Túng Tâm Lý - Nhận Diện & Chống Lại Thủ Đoạn Thao Túng Tâm Lý",
                        image: "/asset/images/image.png",
                        variant: "Bìa mềm",
                        quantity: 1,
                        price: 189000
                    }
                ]
            },
            {
                id: "2310987",
                orderDate: "2025-02-10",
                status: "processing",
                statusText: "Đang xử lý",
                totalAmount: 276000,
                products: [
                    {
                        id: "prod-007",
                        title: "Tư Duy Phản Biện - Để Trở Thành Người Suy Nghĩ Thông Minh",
                        image: "/asset/images/image.png",
                        variant: "Bìa mềm",
                        quantity: 1,
                        price: 276000
                    }
                ]
            },
            {
                id: "2302345",
                orderDate: "2025-02-05",
                status: "delivered",
                statusText: "Đã giao",
                totalAmount: 168000,
                products: [
                    {
                        id: "prod-008",
                        title: "Sách Cuộc Sống Đơn Giản - Dọn Dẹp Đầu Óc",
                        image: "/asset/images/image.png",
                        variant: "Bìa mềm",
                        quantity: 1,
                        price: 168000
                    }
                ]
            },
            {
                id: "2298765",
                orderDate: "2025-01-28",
                status: "pending",
                statusText: "Chờ thanh toán",
                totalAmount: 520000,
                products: [
                    {
                        id: "prod-009",
                        title: "Tủ Sách Thiên Văn Học (Bộ 4 Cuốn)",
                        image: "/asset/images/image.png",
                        variant: "Bìa cứng",
                        quantity: 1,
                        price: 520000
                    }
                ]
            }
        ];
        
        // Lọc theo trạng thái
        let filteredOrders = mockOrders;
        if (status !== 'all') {
            filteredOrders = mockOrders.filter(order => order.status === status);
        }
        
        // Tìm kiếm theo từ khóa
        if (keyword) {
            const lowercaseKeyword = keyword.toLowerCase();
            
            filteredOrders = filteredOrders.filter(order => {
                // Tìm trong mã đơn hàng
                if (order.id.toLowerCase().includes(lowercaseKeyword)) {
                    return true;
                }
                
                // Tìm trong tên sản phẩm
                for (const product of order.products) {
                    if (product.title.toLowerCase().includes(lowercaseKeyword)) {
                        return true;
                    }
                }
                
                return false;
            });
        }
        
        return filteredOrders;
    }

    async createOrder (orderData) {
        try {
            // Trong thực tế, URL có thể được thêm từ API_URL.CREATE_ORDER
            const url = `http://localhost:8080/api/orders`;
            const response = await fetch(url, {
                method: 'POST',
                headers: HEADERS,
                body: JSON.stringify(orderData)
            });
            
            // Xử lý lỗi HTTP
            if (!response.ok) {
                const errorData = await response.json();
                return {
                    success: false,
                    message: errorData.message || 'Không thể tạo đơn hàng'
                };
            }
            const data = await response.json();
            // Mô phỏng dữ liệu trả về từ API
            return {
                success: true,
                message: 'Đặt hàng thành công',
                data: data,
                redirectToOrderDetail: true
            };
        } catch (error) {
            console.error('Lỗi khi tạo đơn hàng:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra khi tạo đơn hàng'
            };
        }
    }
    
    /**
     * Lấy danh sách đơn hàng với các tham số lọc
     * @param {string} status Trạng thái đơn hàng (all hoặc specific status)
     * @param {number} page Số trang hiện tại
     * @param {number} pageSize Số lượng đơn hàng mỗi trang
     * @param {string} searchTerm Từ khóa tìm kiếm
     * @param {string} sortBy Trường sắp xếp (newest, oldest, highest, lowest)
     * @returns {Promise} Promise chứa kết quả
     */
    async getOrders(status, page, pageSize, searchTerm, sortBy = 'newest') {
        try {
            // Xây dựng URL với các tham số
            let url = `${API_URL.GET_ORDERS}?page=${page}&limit=${pageSize}`;
            
            // Thêm tham số status nếu khác 'all'
            if (status && status !== 'all') {
                url += `&status=${status}`;
            }
            
            // Thêm tham số tìm kiếm nếu có
            if (searchTerm) {
                url += `&search=${searchTerm}`;
            }
            
            // Thêm tham số sắp xếp
            if (sortBy) {
                url += `&sortBy=${sortBy}`;
            }
            
            const response = await fetch(url, {
                method: 'GET',
                headers: HEADERS,
                credentials: 'include' // Để gửi cookie nếu cần xác thực
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Định dạng lại dữ liệu phù hợp với frontend
                return this.formatOrderResponse(data);
            } else {
                return {
                    success: false,
                    message: data.message || 'Không thể tải danh sách đơn hàng'
                };
            }
        } catch (error) {
            console.error('Error in getOrders:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra khi tải danh sách đơn hàng'
            };
        }
    }
    

    /**
     * Định dạng lại dữ liệu đơn hàng từ API response
     * @param {Object} data Dữ liệu từ API
     * @returns {Object} Dữ liệu đã định dạng
     */
    formatOrderResponse(data) {
        if (!data || !data.orders) {
            return {
                success: false,
                message: 'Dữ liệu không hợp lệ'
            };
        }
        // Map các trạng thái thành text hiển thị
        const statusTextMap = {
            'pending': 'Chờ xác nhận',
            'waiting_payment': 'Chờ thanh toán',
            'payment_failed': 'Thanh toán thất bại',
            'processing': 'Đang xử lý',
            'shipping': 'Đang vận chuyển',
            'delivered': 'Đã giao',
            'cancelled': 'Đã hủy',
            'refunded': 'Đã hoàn tiền'
        };
        
        // Chuyển đổi dữ liệu đơn hàng
        const formattedOrders = data.orders.map(order => {
            // Chuyển đổi order items từ API thành định dạng products cho frontend
            const products = order.orderItems.map(item => {
                return {
                    id: item.id,
                    productId: item.productId,
                    title: item.productName,
                    image: '/asset/images/' + item.productImage || '/asset/images/image.png',
                    variant: item.productVariant,
                    quantity: item.quantity,
                    price: parseFloat(item.subtotal),
                    unitPrice: parseFloat(item.price)
                };
            });
            
            return {
                id: order.id,
                orderCode: order.orderCode,
                status: order.status,
                statusText: statusTextMap[order.status] || order.status,
                orderDate: order.orderDate,
                subtotal: parseFloat(order.subtotal),
                shippingFee: parseFloat(order.deliveryPrice),
                discount: parseFloat(order.discountAmount),
                totalAmount: parseFloat(order.totalAmount),
                products: products,
                paymentMethod: order.paymentMethod,
                shippingInfo: {
                    receiverName: order.receiverName,
                    receiverPhone: order.receiverPhone,
                    address: order.address,
                    district: order.district,
                    city: order.city
                },
                trackingNumber: order.trackingNumber,
                shippingCarrier: order.shippingCarrier
            };
        });
        
        // Trả về đối tượng response
        return {
            success: true,
            orders: formattedOrders,
            pagination: {
                totalOrders: data.totalOrders,
                totalPages: data.totalPages,
                currentPage: data.currentPage,
                pageSize: data.pageSize
            },
            orderStatusCounts: data.orderStatusCounts
        };
    }
    
    /**
     * Lấy chi tiết đơn hàng
     * @param {string} orderCode code của đơn hàng
     * @returns {Promise} Promise chứa kết quả
     */
    async getOrderDetail(orderCode) {
        try {
            const response = await fetch(`${API_URL.GET_ORDER_DETAIL}?code=${orderCode}`, {
                method: 'GET',
                headers: HEADERS,
                credentials: 'include'
            });
            
            const data = await response.json();
            
            if (response.ok) {
                return {
                    success: true,
                    data: data
                };
            } else {
                return {
                    success: false,
                    message: data.message || 'Không thể tải thông tin đơn hàng'
                };
            }
        } catch (error) {
            console.error('Error in getOrderDetail:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra khi tải thông tin đơn hàng'
            };
        }
    }
    
    /**
     * Tạo timeline cho đơn hàng dựa trên lịch sử trạng thái
     * @param {Object} orderData Dữ liệu đơn hàng
     * @returns {Array} Mảng các mốc thời gian
     */
    generateTimeline(orderData) {
        // Nếu có lịch sử trạng thái từ API, sử dụng nó
        if (orderData.statusHistory && orderData.statusHistory.length > 0) {
            return orderData.statusHistory.map(history => {
                return {
                    time: history.createdAt,
                    status: history.status,
                    description: this.getStatusDescription(history.status, history.note)
                };
            });
        }
        
        // Nếu không có, tạo timeline dựa trên trạng thái hiện tại
        // ...
        
        return [];
    }
    
    /**
     * Lấy mô tả cho trạng thái đơn hàng
     * @param {string} status Trạng thái đơn hàng
     * @param {string} note Ghi chú (nếu có)
     * @returns {string} Mô tả trạng thái
     */
    getStatusDescription(status, note) {
        if (note) return note;
        
        const descriptions = {
            'pending': 'Đơn hàng đã được tạo, đang chờ thanh toán',
            'waiting_payment': 'Đơn hàng đang chờ thanh toán',
            'payment_failed': 'Thanh toán đơn hàng thất bại',
            'processing': 'Đơn hàng đã được xác nhận, đang chuẩn bị hàng',
            'shipping': 'Đơn hàng đang được vận chuyển',
            'delivered': 'Đơn hàng đã giao thành công',
            'cancelled': 'Đơn hàng đã bị hủy',
            'refunded': 'Đơn hàng đã được hoàn tiền'
        };
        
        return descriptions[status] || `Trạng thái: ${status}`;
    }
    
    /**
     * Hủy đơn hàng
     * @param {string} orderId ID của đơn hàng
     * @param {string} reason Lý do hủy đơn
     * @returns {Promise} Promise chứa kết quả
     */
    async cancelOrder(orderId, reason) {
        try {
            const response = await fetch(`${this.baseUrl}/${orderId}/cancel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reason: reason }),
                credentials: 'include'
            });
            
            const data = await response.json();
            
            return {
                success: response.ok,
                message: data.message || (response.ok ? 'Hủy đơn hàng thành công' : 'Không thể hủy đơn hàng')
            };
        } catch (error) {
            console.error('Error in cancelOrder:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra khi hủy đơn hàng'
            };
        }
    }
    
    /**
     * Mua lại đơn hàng
     * @param {string} orderId ID của đơn hàng
     * @returns {Promise} Promise chứa kết quả
     */
    async rebuyOrder(orderId) {
        try {
            const response = await fetch(`${this.baseUrl}/${orderId}/rebuy`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            
            const data = await response.json();
            
            return {
                success: response.ok,
                message: data.message || (response.ok ? 'Đã thêm sản phẩm vào giỏ hàng' : 'Không thể mua lại đơn hàng'),
                redirectToCart: response.ok
            };
        } catch (error) {
            console.error('Error in rebuyOrder:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra khi mua lại đơn hàng'
            };
        }
    }
}