const API_URL = {
    "PRODUCT_DETAIL": "http://localhost:8080/api/product",
    "PRODUCT_REVIEWS": "http://localhost:8080/api/product-reviews",
    "RELATED_PRODUCTS": "http://localhost:8080/api/product-related",
    "RECENTLY_VIEWED": "http://localhost:8080/api/recently-viewed"
};

export class ProductDetailService {
    async getProductDetail(productId) {
        try {
            // Trong môi trường thực tế, bỏ comment dòng dưới và xóa phần mockProductDetail
            const response = await fetch(`${API_URL.PRODUCT_DETAIL}?id=${productId}`);
            const data = await response.json();
            console.log("Get product detail:", data);
            return data;
            
            // Dữ liệu giả cho mục đích phát triển
            // return this.mockProductDetail(productId);
        } catch (error) {
            console.error('Lỗi khi tải chi tiết sản phẩm:', error);
            return null;
        }
    }

    async getProductReviews(productId, filters = {}) {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const response = await fetch(`${API_URL.PRODUCT_REVIEWS}?productId=${productId}&${queryParams}`);
            const data = await response.json();
            console.log("Get product reviews:", data);
            return data;
            
            // Dữ liệu giả cho mục đích phát triển
            // return this.mockReviews(productId, filters);
        } catch (error) {
            console.error('Lỗi khi tải đánh giá:', error);
            return {
                reviews: [],
                ratingsSummary: {
                    averageRating: 0,
                    totalReviews: 0,
                    distribution: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0},
                    percentages: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
                },
                total: 0,
                currentPage: 1,
                totalPages: 1,
                hasMore: false
            };
        }
    }

    async getRelatedProducts(categoryId) {
        try {
            const response = await fetch(`${API_URL.RELATED_PRODUCTS}?categoryId=${categoryId}`);
            const data = await response.json();
            return data;
            
            // Dữ liệu giả cho mục đích phát triển
            // return this.mockRelatedProducts(productId);
        } catch (error) {
            console.error('Lỗi khi tải sản phẩm liên quan:', error);
            return [];
        }
    }

    async getRecentlyViewed() {
        try {
            // Trong môi trường thực tế, bỏ comment dòng dưới và xóa phần mockRecentlyViewed
            // const response = await fetch(API_URL.RECENTLY_VIEWED);
            // const data = await response.json();
            // return data;
            
            // Dữ liệu giả cho mục đích phát triển
            return this.mockRecentlyViewed();
        } catch (error) {
            console.error('Lỗi khi tải sản phẩm đã xem:', error);
            return [];
        }
    }

    async addToRecentlyViewed(productId) {
        try {
            // Trong môi trường thực tế sẽ gọi API
            // await fetch(API_URL.RECENTLY_VIEWED, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ productId })
            // });
            
            console.log('Đã thêm sản phẩm vào danh sách đã xem:', productId);
        } catch (error) {
            console.error('Lỗi khi thêm vào sản phẩm đã xem:', error);
        }
    }

    // =================== DỮ LIỆU GIẢ ===================
    mockRecentlyViewed() {
        // Tạo danh sách sản phẩm đã xem
        const products = [];
        
        // Tạo 6 sản phẩm giả
        for (let i = 1; i <= 6; i++) {
            products.push({
                id: `viewed-${i}`,
                title: `Sách đã xem ${i}: Khám phá bản thân`,
                price: 120000 + (i * 15000),
                originalPrice: 180000 + (i * 20000),
                discount: 30,
                rating: 4 + (i % 3 ? 0.5 : 0),
                soldCount: 300 + (i * 150),
                image: '/asset/images/image.png'
            });
        }
        
        return products;
    }
}