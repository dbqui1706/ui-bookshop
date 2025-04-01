const API_URL = {
    "CATEGORIES": "http://localhost:8080/api/categories",
    "PUBLISHERS": "http://localhost:8080/api/category/publishers"
}

export class CategoryService {
    /**
     * Lấy danh sách tất cả danh mục
     * @returns {Promise<Array>} Danh sách danh mục:
     * [
     *   {
     *     id: string,
     *     name: string,
     *     count: number,
     *     description: string,
     *     imageName: string,
     *   },
     *   ...
     * ]
     */
    async getAllCategories() {
        try {
            const response = await fetch(API_URL.CATEGORIES);
            const data = await response.json();
            return data.map(category => ({
                id: category.id,
                name: category.name,
                count: category.productCount,
                imageName: category.imageName
            }));
        } catch (error) {
            console.error('Lỗi khi tải danh mục:', error);
            return this.mockCategories();
        }
    }
    
    /**
     * Lấy danh mục theo ID
     * @param {string} id - ID của danh mục
     * @returns {Promise<Object>} Thông tin danh mục
     */
    async getCategoryById(id) {
        try {
            const response = await fetch(`${API_URL.CATEGORIES}/${id}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Lỗi khi tải danh mục ID=${id}:`, error);
            
            // Trả về danh mục mẫu nếu không có API thật
            const mockCategories = this.mockCategories();
            return mockCategories.find(cat => cat.id === id) || null;
        }
    }
    
    /**
     * Lấy sách theo danh mục
     * @param {string} categoryId - ID của danh mục
     * @param {Object} filters - Các tham số lọc
     * @returns {Promise<Object>} Kết quả trả về tương tự getProducts
     */
    async getBooksByCategory(categoryId, filters = {}) {
        try {
            const queryParams = new URLSearchParams({
                ...filters,
                categoryId
            }).toString();
            
            const response = await fetch(`${API_URL.CATEGORIES}/${categoryId}/books?${queryParams}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Lỗi khi tải sách theo danh mục ID=${categoryId}:`, error);
            return {
                products: [],
                total: 0,
                page: 1,
                limit: 12
            };
        }
    }
    
    /**
     * Lấy danh sách tất cả nhà xuất bản
     * @returns {Promise<Array>} Danh sách nhà xuất bản
     */
    async getAllPublishers() {
        try {
            const response = await fetch(API_URL.PUBLISHERS);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Lỗi khi tải danh mục:', error);
            // return this.mockCategories();
            return [];
        }
    }

    /**
     * Tạo dữ liệu mẫu danh mục
     * @private
     */
    mockCategories() {
        return [
            {
                id: 'fiction',
                name: 'Văn học',
                slug: 'van-hoc',
                count: 142,
                children: [
                    { id: 'novel', name: 'Tiểu thuyết', count: 87 },
                    { id: 'short-story', name: 'Truyện ngắn', count: 35 },
                    { id: 'poetry', name: 'Thơ', count: 20 }
                ]
            },
            {
                id: 'business',
                name: 'Kinh tế',
                slug: 'kinh-te',
                count: 89,
                children: [
                    { id: 'management', name: 'Quản trị', count: 45 },
                    { id: 'marketing', name: 'Marketing', count: 32 },
                    { id: 'finance', name: 'Tài chính', count: 12 }
                ]
            },
            {
                id: 'children',
                name: 'Thiếu nhi',
                slug: 'thieu-nhi',
                count: 75,
                children: [
                    { id: 'picture-book', name: 'Sách tranh', count: 38 },
                    { id: 'children-novel', name: 'Tiểu thuyết thiếu nhi', count: 25 },
                    { id: 'education', name: 'Giáo dục', count: 12 }
                ]
            },
            {
                id: 'language',
                name: 'Ngoại ngữ',
                slug: 'ngoai-ngu',
                count: 62,
                children: [
                    { id: 'english', name: 'Tiếng Anh', count: 42 },
                    { id: 'japanese', name: 'Tiếng Nhật', count: 10 },
                    { id: 'korean', name: 'Tiếng Hàn', count: 10 }
                ]
            },
            {
                id: 'life-skills',
                name: 'Kỹ năng sống',
                slug: 'ky-nang-song',
                count: 54,
                children: [
                    { id: 'self-help', name: 'Phát triển bản thân', count: 30 },
                    { id: 'communication', name: 'Giao tiếp', count: 14 },
                    { id: 'leadership', name: 'Lãnh đạo', count: 10 }
                ]
            }
        ];
    }
}