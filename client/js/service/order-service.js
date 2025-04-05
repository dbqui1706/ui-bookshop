import { STORAGE_KEYS } from '../constants/index.js';

const API_URL = {
    GET_ORDERS: 'http://localhost:8080/api/orders',
    GET_ORDER_DETAIL: 'http://localhost:8080/api/orders?orderId=${orderId}',
    ADD_TO_CART: 'http://localhost:8080/api/cart/add-multiple',
    CANCEL_ORDER: 'http://localhost:8080/api/orders/${orderId}/cancel',
    GET_DELIVERY_METHODS: 'http://localhost:8080/api/delivery-methods',
    GET_PAYMENT_METHODS: 'http://localhost:8080/api/payment-methods',
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
                headers: {
                    'Content-Type': 'application/json'
                },
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
     * Lấy chi tiết đơn hàng
     * @param {string} orderId ID của đơn hàng
     * @returns {Object} Kết quả và dữ liệu chi tiết đơn hàng
     */
    async getOrderDetail(orderId) {
        try {
            const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
            
            if (!token) {
                return {
                    success: false,
                    message: 'Bạn chưa đăng nhập'
                };
            }
            
            // Trong thực tế, URL có thể được thêm từ API_URL.GET_ORDER_DETAIL
            const url = `http://localhost:8080/api/orders/${orderId}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            // Xử lý lỗi HTTP
            if (!response.ok) {
                if (response.status === 401) {
                    // Token hết hạn hoặc không hợp lệ
                    localStorage.removeItem(STORAGE_KEYS.TOKEN);
                    localStorage.removeItem(STORAGE_KEYS.USER);
                    
                    return {
                        success: false,
                        message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
                        unauthorized: true
                    };
                }
                
                if (response.status === 404) {
                    return {
                        success: false,
                        message: 'Không tìm thấy đơn hàng'
                    };
                }
                
                const errorData = await response.json();
                return {
                    success: false,
                    message: errorData.message || 'Không thể tải chi tiết đơn hàng'
                };
            }
            
            // Mô phỏng dữ liệu trả về từ API
            // Trong thực tế, dữ liệu này sẽ được trả về từ server
            const orders = this.getMockOrders('all', '');
            const order = orders.find(o => o.id === orderId);
            
            if (!order) {
                return {
                    success: false,
                    message: 'Không tìm thấy đơn hàng'
                };
            }
            
            // Thêm thông tin chi tiết đơn hàng
            const orderDetail = {
                ...order,
                shippingAddress: {
                    fullName: "Quý Đặng",
                    phone: "0975688272",
                    address: "123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh"
                },
                paymentMethod: "COD (Thanh toán khi nhận hàng)",
                shippingMethod: "Giao hàng tiêu chuẩn",
                subtotal: order.totalAmount - 30000, // Giả định phí vận chuyển là 30,000đ
                shippingFee: 30000,
                discount: 0,
                timeline: [
                    {
                        time: "2025-02-15T08:30:00",
                        status: "pending",
                        description: "Đơn hàng đã được tạo"
                    },
                    {
                        time: "2025-02-15T09:15:00",
                        status: "processing",
                        description: "Đơn hàng đang được xử lý"
                    },
                    {
                        time: "2025-02-16T14:20:00",
                        status: "shipping",
                        description: "Đơn hàng đang được vận chuyển"
                    }
                ]
            };
            
            // Nếu đơn đã giao, thêm thông tin giao hàng
            if (order.status === 'delivered') {
                orderDetail.timeline.push({
                    time: "2025-02-18T10:45:00",
                    status: "delivered",
                    description: "Đơn hàng đã được giao thành công"
                });
                orderDetail.deliveredDate = "2025-02-18";
            }
            
            // Nếu đơn đã hủy, thêm thông tin hủy
            if (order.status === 'cancelled') {
                orderDetail.timeline.push({
                    time: "2025-02-16T11:30:00",
                    status: "cancelled",
                    description: "Đơn hàng đã bị hủy theo yêu cầu của khách hàng"
                });
                orderDetail.cancelReason = "Khách hàng yêu cầu hủy";
            }
            
            return {
                success: true,
                order: orderDetail
            };
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra khi tải chi tiết đơn hàng'
            };
        }
    }
    
    /**
     * Mua lại đơn hàng
     * @param {string} orderId ID của đơn hàng
     * @returns {Object} Kết quả mua lại
     */
    async rebuyOrder(orderId) {
        try {
            const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
            
            if (!token) {
                return {
                    success: false,
                    message: 'Bạn chưa đăng nhập'
                };
            }
            
            // Lấy thông tin đơn hàng
            const orderResponse = await this.getOrderDetail(orderId);
            
            if (!orderResponse.success) {
                return orderResponse;
            }
            
            const order = orderResponse.order;
            
            // Thêm tất cả sản phẩm vào giỏ hàng
            // Trong thực tế, URL có thể được thêm từ API_URL.ADD_TO_CART
            const url = `http://localhost:8080/api/cart/add-multiple`;
            
            const cartItems = order.products.map(product => ({
                productId: product.id,
                quantity: product.quantity,
                variant: product.variant
            }));
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ items: cartItems })
            });
            
            // Xử lý lỗi HTTP
            if (!response.ok) {
                if (response.status === 401) {
                    // Token hết hạn hoặc không hợp lệ
                    localStorage.removeItem(STORAGE_KEYS.TOKEN);
                    localStorage.removeItem(STORAGE_KEYS.USER);
                    
                    return {
                        success: false,
                        message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
                        unauthorized: true
                    };
                }
                
                const errorData = await response.json();
                return {
                    success: false,
                    message: errorData.message || 'Không thể thêm sản phẩm vào giỏ hàng'
                };
            }
            
            // Mô phỏng dữ liệu trả về từ API
            return {
                success: true,
                message: 'Đã thêm tất cả sản phẩm vào giỏ hàng',
                redirectToCart: true
            };
        } catch (error) {
            console.error('Lỗi khi mua lại đơn hàng:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra khi mua lại đơn hàng'
            };
        }
    }
    
    /**
     * Hủy đơn hàng
     * @param {string} orderId ID của đơn hàng
     * @param {string} reason Lý do hủy
     * @returns {Object} Kết quả hủy đơn hàng
     */
    async cancelOrder(orderId, reason) {
        try {
            const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
            
            if (!token) {
                return {
                    success: false,
                    message: 'Bạn chưa đăng nhập'
                };
            }
            
            // Trong thực tế, URL có thể được thêm từ API_URL.CANCEL_ORDER
            const url = `http://localhost:8080/api/orders/${orderId}/cancel`;
            
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reason })
            });
            
            // Xử lý lỗi HTTP
            if (!response.ok) {
                if (response.status === 401) {
                    // Token hết hạn hoặc không hợp lệ
                    localStorage.removeItem(STORAGE_KEYS.TOKEN);
                    localStorage.removeItem(STORAGE_KEYS.USER);
                    
                    return {
                        success: false,
                        message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
                        unauthorized: true
                    };
                }
                
                if (response.status === 404) {
                    return {
                        success: false,
                        message: 'Không tìm thấy đơn hàng'
                    };
                }
                
                if (response.status === 400) {
                    return {
                        success: false,
                        message: 'Không thể hủy đơn hàng này'
                    };
                }
                
                const errorData = await response.json();
                return {
                    success: false,
                    message: errorData.message || 'Không thể hủy đơn hàng'
                };
            }
            
            // Mô phỏng dữ liệu trả về từ API
            return {
                success: true,
                message: 'Hủy đơn hàng thành công'
            };
        } catch (error) {
            console.error('Lỗi khi hủy đơn hàng:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra khi hủy đơn hàng'
            };
        }
    }
}