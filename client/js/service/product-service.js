const API_URL = {
    "PRODUCTS": "http://localhost:8080/api/products",
    "PRODUCT_DETAIL": "http://localhost:8080/api/product",
    "CATEGORIES": "http://localhost:8080/api/categories",
    "PUBLISHERS": "http://localhost:8080/api/publishers",
    "SEARCH": "http://localhost:8080/api/search"
}

export class ProductService {
    /**
     * Lấy danh sách sản phẩm với các bộ lọc
     * @param {Object} filters - Các tham số lọc bao gồm:
     *   - q: Từ khóa tìm kiếm
     *   - categories: Danh mục (chuỗi phân cách bởi dấu phẩy)
     *   - publishers: Nhà xuất bản (chuỗi phân cách bởi dấu phẩy)
     *   - priceFrom: Giá tối thiểu
     *   - priceTo: Giá tối đa
     *   - rating: Đánh giá tối thiểu
     *   - services: Các dịch vụ (freeship, sale, ...)
     *   - sortBy: Sắp xếp theo (popular, price-asc, price-desc, newest)
     *   - page: Trang hiện tại
     *   - limit: Số sản phẩm trên mỗi trang
     * @returns {Promise<Object>} Kết quả trả về:
     * {
     *   products: [
     *     {
     *       id: string,
     *       title: string,
     *       author: string,
     *       price: number,
     *       originalPrice: number,
     *       discount: number,
     *       rating: number,
     *       soldCount: number,
     *       imageUrl: string,
     *       freeShipping: boolean,
     *       isAuthentic: boolean,
     *       ...
     *     }
     *   ],
     *   total: number, // Tổng số sản phẩm
     *   page: number,  // Trang hiện tại
     *   limit: number, // Số sản phẩm mỗi trang
     *   lastPage: number // Trang cuối cùng
     * }
     */
    async getProducts(filters = {}) {
        try {
            // Nếu có từ khóa tìm kiếm, sử dụng API tìm kiếm
            if (filters.q) {
                return this.searchProducts(filters);
            }
            
            const queryParams = new URLSearchParams(filters).toString();
            const url = `${API_URL.PRODUCTS}?${queryParams}`;
            
            // Trong trường hợp không có API thực tế, trả về dữ liệu mẫu
            // Trong môi trường thực tế, bỏ comment đoạn code dưới đây và xóa phần mockResponse
            
            const response = await fetch(url);
            const data = await response.json();
            return data;
            
            // Mock response cho mục đích phát triển
            // return this.mockProductResponse(filters);
        } catch (error) {
            console.error('Lỗi khi tải sản phẩm:', error);
            // Trả về cấu trúc đúng để tránh lỗi khi gọi hàm
            return {
                products: [],
                total: 0,
                page: 1,
                limit: 12,
                lastPage: 1
            };
        }
    }
    /**
     * Lấy chi tiết sản phẩm
     * @param {string} id - ID của sản phẩm
     * @returns {Promise<Object>} Kết quả trả về:
     * {
     *   id: string,
     *   title: string,
     *   author: string,
     *   price: number,
     *   originalPrice: number,
     *   discount: number,
     *   rating: number,
     *   soldCount: number,
     *   imageUrl: string,
     *   freeShipping: boolean,
     *   isAuthentic: boolean,
     *   ...
     * }
     */
    async getProductDetail(id) {
        try {
            const response = await fetch(`${API_URL.PRODUCT_DETAIL}?id=${id}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Lỗi khi tải chi tiết sản phẩm:', error);
            return null;
        }
    }

    /**
     * Tìm kiếm sản phẩm với từ khóa
     */
    async searchProducts(filters = {}) {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const url = `${API_URL.SEARCH}?${queryParams}`;
            console.log("Search products:", url);
            
            // Trong trường hợp thực tế
            // const response = await fetch(url);
            // const data = await response.json();
            // return data;
            
            // Mock response cho mục đích phát triển
            return this.mockProductResponse(filters);
        } catch (error) {
            console.error('Lỗi khi tìm kiếm sản phẩm:', error);
            return {
                products: [],
                total: 0,
                page: 1,
                limit: 12,
                lastPage: 1
            };
        }
    }

    /**
     * Lấy danh sách danh mục
     * @returns {Promise<Array>} Danh sách danh mục
     * [
     *   { id: string, name: string, count: number },
     *   ...
     * ]
     */
    async getCategories() {
        try {
            const response = await fetch(API_URL.CATEGORIES);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Lỗi khi tải danh mục:', error);
            // Trả về danh sách rỗng
            return [];
        }
    }

    /**
     * Lấy danh sách nhà xuất bản
     * @returns {Promise<Array>} Danh sách nhà xuất bản
     * [
     *   { id: string, name: string, count: number },
     *   ...
     * ]
     */
    async getPublishers() {
        try {
            const response = await fetch(API_URL.PUBLISHERS);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Lỗi khi tải nhà xuất bản:', error);
            // Trả về danh sách rỗng
            return [];
        }
    }

    /**
     * Tạo dữ liệu mẫu cho việc phát triển giao diện
     * @private
     */
    mockProductResponse(filters) {
        // Tạo danh sách sản phẩm mẫu
        const mockBooks = [
            {
                id: '1',
                title: 'The Psychology of Money',
                author: 'Morgan Housel',
                price: 159000,
                originalPrice: 199000,
                discount: 20,
                rating: 5,
                soldCount: 1200,
                imageUrl: '/asset/images/image.png',
                freeShipping: true,
                isAuthentic: true
            },
            {
                id: '2',
                title: 'Sapiens: A Brief History of Humankind',
                author: 'Yuval Noah Harari',
                price: 249000,
                originalPrice: 299000,
                discount: 15,
                rating: 5,
                soldCount: 956,
                imageUrl: '/asset/images/image.png',
                freeShipping: true,
                isAuthentic: true
            },
            {
                id: '3',
                title: 'Atomic Habits: An Easy & Proven Way',
                author: 'James Clear',
                price: 363100,
                originalPrice: 490000,
                discount: 26,
                rating: 5,
                soldCount: 2300,
                imageUrl: '/asset/images/image.png',
                freeShipping: true,
                isAuthentic: true
            },
            {
                id: '4',
                title: 'Rich Dad Poor Dad',
                author: 'Robert T. Kiyosaki',
                price: 169000,
                originalPrice: 189000,
                discount: 10,
                rating: 4,
                soldCount: 1800,
                imageUrl: '/asset/images/image.png',
                freeShipping: true,
                isAuthentic: true
            },
            {
                id: '5',
                title: 'Nexus',
                author: 'Yuval Noah Harari',
                price: 202900,
                originalPrice: 327000,
                discount: 38,
                rating: 5,
                soldCount: 1000,
                imageUrl: '/asset/images/image.png',
                freeShipping: true,
                isAuthentic: true
            },
            {
                id: '6',
                title: 'Thinking, Fast and Slow',
                author: 'Daniel Kahneman',
                price: 289000,
                originalPrice: 329000,
                discount: 12,
                rating: 4,
                soldCount: 850,
                imageUrl: '/asset/images/image.png',
                freeShipping: true,
                isAuthentic: true
            },
            {
                id: '7',
                title: 'To Kill a Mockingbird',
                author: 'Harper Lee',
                price: 195000,
                originalPrice: 212000,
                discount: 8,
                rating: 5,
                soldCount: 1200,
                imageUrl: '/asset/images/image.png',
                freeShipping: true,
                isAuthentic: true
            },
            {
                id: '8',
                title: '1984',
                author: 'George Orwell',
                price: 168000,
                originalPrice: 198000,
                discount: 15,
                rating: 5,
                soldCount: 970,
                imageUrl: '/asset/images/image.png',
                freeShipping: false,
                isAuthentic: true
            }
        ];

        // Lặp lại các sản phẩm để có nhiều dữ liệu hơn
        const duplicatedBooks = [];
        for (let i = 0; i < 3; i++) {
            mockBooks.forEach(book => {
                duplicatedBooks.push({
                    ...book,
                    id: `${book.id}-${i}`,
                    title: i > 0 ? `${book.title} (Edition ${i+1})` : book.title
                });
            });
        }

        // Áp dụng các bộ lọc
        let filteredBooks = [...duplicatedBooks];

        // Lọc theo từ khóa
        if (filters.q) {
            const searchTerm = filters.q.toLowerCase();
            filteredBooks = filteredBooks.filter(book => 
                book.title.toLowerCase().includes(searchTerm) || 
                book.author.toLowerCase().includes(searchTerm)
            );
        }

        // Lọc theo khoảng giá
        if (filters.priceFrom) {
            filteredBooks = filteredBooks.filter(book => book.price >= parseInt(filters.priceFrom));
        }
        if (filters.priceTo) {
            filteredBooks = filteredBooks.filter(book => book.price <= parseInt(filters.priceTo));
        }

        // Lọc theo đánh giá
        if (filters.rating) {
            filteredBooks = filteredBooks.filter(book => book.rating >= parseInt(filters.rating));
        }

        // Áp dụng phân trang
        const page = parseInt(filters.page) || 1;
        const limit = parseInt(filters.limit) || 12;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

        return {
            products: paginatedBooks,
            total: filteredBooks.length,
            page: page,
            limit: limit,
            lastPage: Math.ceil(filteredBooks.length / limit)
        };
    }
}