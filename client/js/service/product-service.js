const API_URL = {
    "PRODUCTS": "http://localhost:8080/api/products",
    "CATEGORIES": "http://localhost:8080/api/categories",
    "PUBLISHERS": "http://localhost:8080/api/publishers"
}

export class ProductService {
    async getProducts(filters = {}) {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const url = `${API_URL.PRODUCTS}?${queryParams}`;
            console.log("Get products:", url);
            const response = await fetch(`${API_URL.PRODUCTS}?${queryParams}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Lỗi khi tải sản phẩm:', error);
            return [];
        }
    }

    async getCategories() {
        try {
            const response = await fetch(API_URL.CATEGORIES);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Lỗi khi tải danh mục:', error);
            return [];
        }
    }

    async getPublishers() {
        try {
            const response = await fetch(API_URL.PUBLISHERS);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Lỗi khi tải nhà xuất bản:', error);
            return [];
        }
    }
}



