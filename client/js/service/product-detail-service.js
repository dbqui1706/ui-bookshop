const API_URL = {
    "PRODUCT_DETAIL": "http://localhost:8080/api/products",
    "PRODUCT_REVIEWS": "http://localhost:8080/api/reviews",
    "RELATED_PRODUCTS": "http://localhost:8080/api/related-products",
    "RECENTLY_VIEWED": "http://localhost:8080/api/recently-viewed"
};

export class ProductDetailService {
    async getProductDetail(productId) {
        try {
            // Trong môi trường thực tế, bỏ comment dòng dưới và xóa phần mockProductDetail
            // const response = await fetch(`${API_URL.PRODUCT_DETAIL}/${productId}`);
            // const data = await response.json();
            // return data;
            
            // Dữ liệu giả cho mục đích phát triển
            return this.mockProductDetail(productId);
        } catch (error) {
            console.error('Lỗi khi tải chi tiết sản phẩm:', error);
            return null;
        }
    }

    async getProductReviews(productId, filters = {}) {
        try {
            // Trong môi trường thực tế, bỏ comment dòng dưới và xóa phần mockReviews
            // const queryParams = new URLSearchParams(filters).toString();
            // const response = await fetch(`${API_URL.PRODUCT_REVIEWS}/${productId}?${queryParams}`);
            // const data = await response.json();
            // return data;
            
            // Dữ liệu giả cho mục đích phát triển
            return this.mockReviews(productId, filters);
        } catch (error) {
            console.error('Lỗi khi tải đánh giá:', error);
            return {
                reviews: [],
                total: 0,
                summary: {
                    average: 0,
                    total: 0,
                    distribution: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
                }
            };
        }
    }

    async getRelatedProducts(productId) {
        try {
            // Trong môi trường thực tế, bỏ comment dòng dưới và xóa phần mockRelatedProducts
            // const response = await fetch(`${API_URL.RELATED_PRODUCTS}/${productId}`);
            // const data = await response.json();
            // return data;
            
            // Dữ liệu giả cho mục đích phát triển
            return this.mockRelatedProducts(productId);
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
            
            // Trong môi trường phát triển chỉ log ra console
            console.log('Đã thêm sản phẩm vào danh sách đã xem:', productId);
        } catch (error) {
            console.error('Lỗi khi thêm vào sản phẩm đã xem:', error);
        }
    }

    // =================== DỮ LIỆU GIẢ ===================
    
    mockProductDetail(productId) {
        // Dữ liệu sản phẩm giả
        return {
            id: productId || '1',
            title: 'COMBO 4 - MINH TRIẾT PHƯƠNG ĐÔNG (TRÍ TUỆ CỦA NGƯỜI XƯA - ĐẠO LÝ NGƯỜI XƯA - HIỂU NGƯỜI để DÙNG NGƯỜI - CỖ HỌC TINH HOA)',
            author: 'Nhiều tác giả',
            price: 257560,
            originalPrice: 582000,
            discount: 56,
            rating: 4.7,
            ratingCount: 255,
            soldCount: 3000,
            images: [
                '/asset/images/image.png',
                '/asset/images/image.png',
                '/asset/images/image.png',
                '/asset/images/image.png'
            ],
            publisher: 'NXB Hồng Đức',
            publishYear: 2022,
            pages: 984,
            sku: '8935235238312',
            description: 'Bộ sách gồm 4 cuốn với nội dung đa dạng và phong phú về trí tuệ phương Đông.',
            features: [
                'Bộ sách gồm 4 cuốn với nội dung đa dạng và phong phú.',
                'Cuốn sách "Trí tuệ của người xưa" tập trung vào trí thức và mưu kế của người xưa.',
                'Cuốn sách "Đạo lý người xưa" giới thiệu về đạo lý, luân thường đạo lý trong cuộc sống.',
                'Cuốn sách "Hiểu người để dùng người" chia sẻ bí quyết hiểu và quản lý con người.',
                'Cuốn sách "Cổ học tinh hoa" tổng hợp tinh hoa tri thức cổ đại phương Đông.'
            ],
            freeShipping: true,
            isAuthentic: true,
            categories: ['Triết Học', 'Phương Đông', 'Kỹ năng sống']
        };
    }

    mockReviews(productId, filters) {
        // Dữ liệu đánh giá giả
        const reviewsData = [
            {
                id: '1',
                name: 'Văn Vụng',
                avatar: null,
                joinedTime: '3 năm',
                rating: 5,
                verified: true,
                content: 'Ok lắm, chỉ có điều: Trên nền tảng Tiki hiển lên 8 ngày sau hàng đến, thế mà có 4 ngày hàng đến rồi. Suýt chút nữa trúng time đi du lịch rồi. Thank shop.<br>5 sao vì tốc độ giao quá nhanh quá nguy hiểm.',
                reviewTime: '1 tháng trước',
                usageTime: '16 phút',
                images: ['/asset/images/review1.jpg', '/asset/images/review2.jpg'],
                likes: 4,
                comments: 1
            },
            {
                id: '2',
                name: 'Nguyễn Cao Duy',
                avatar: null,
                joinedTime: '8 năm',
                rating: 5,
                verified: true,
                content: 'Chất lượng giấy tốt, nội dung thì mới đọc chưa đánh giá được.<br>5 sao cho giao hàng nhanh và sự tận tâm của shop. Mình rất ấn tượng với thư ngỏ và lời cảm ơn của các bạn.<br>Xin cảm ơn!',
                reviewTime: '1 năm trước',
                usageTime: '5 giờ',
                images: ['/asset/images/review3.jpg'],
                likes: 2,
                comments: 0
            },
            {
                id: '3',
                name: 'Nguyễn Văn An',
                avatar: null,
                joinedTime: '2 năm',
                rating: 4,
                verified: true,
                content: 'Sách hay, đóng gói cẩn thận. Tuy nhiên giá hơi cao so với nội dung.',
                reviewTime: '2 tháng trước',
                usageTime: '1 tuần',
                images: [],
                likes: 1,
                comments: 0
            },
            {
                id: '4',
                name: 'Trần Thị Bình',
                avatar: null,
                joinedTime: '5 năm',
                rating: 5,
                verified: true,
                content: 'Combo sách này rất đáng để đầu tư. Mình đã học được rất nhiều từ nó và ứng dụng vào công việc hiệu quả.',
                reviewTime: '6 tháng trước',
                usageTime: '1 tháng',
                images: ['/asset/images/review1.jpg'],
                likes: 7,
                comments: 2
            },
            {
                id: '5',
                name: 'Lê Hoàng Chung',
                avatar: null,
                joinedTime: '1 năm',
                rating: 3,
                verified: true,
                content: 'Sách có nhiều kiến thức bổ ích nhưng chỉ thích hợp cho người mới bắt đầu tìm hiểu về triết học phương Đông.',
                reviewTime: '3 tháng trước',
                usageTime: '2 tuần',
                images: [],
                likes: 0,
                comments: 0
            }
        ];

        // Tạo phân phối đánh giá
        const distribution = {
            5: 200,
            4: 30,
            3: 15,
            2: 7,
            1: 3
        };

        // Áp dụng filter nếu có
        let filteredReviews = [...reviewsData];
        if (filters.filter === 'with-images') {
            filteredReviews = filteredReviews.filter(review => review.images && review.images.length > 0);
        } else if (filters.filter && !isNaN(parseInt(filters.filter))) {
            const ratingFilter = parseInt(filters.filter);
            filteredReviews = filteredReviews.filter(review => review.rating === ratingFilter);
        }

        return {
            reviews: filteredReviews,
            total: reviewsData.length,
            summary: {
                average: 4.7,
                total: 255,
                distribution: distribution
            }
        };
    }

    mockRelatedProducts(productId) {
        // Tạo danh sách sản phẩm liên quan
        const products = [];
        
        // Tạo 8 sản phẩm giả
        for (let i = 1; i <= 8; i++) {
            products.push({
                id: `related-${i}`,
                title: `Sách liên quan ${i}: Tinh hoa triết học phương Đông`,
                author: 'Tác giả mẫu',
                price: 150000 + (i * 10000),
                originalPrice: 200000 + (i * 15000),
                discount: 25,
                rating: 4 + (i % 2 ? 0.5 : 0),
                soldCount: 500 + (i * 100),
                image: '/asset/images/image.png',
                freeShipping: i % 2 === 0,
                sponsored: i === 1
            });
        }
        
        return products;
    }

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