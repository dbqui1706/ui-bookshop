// ==========================================================
// api.js - Chứa các hằng số API và hàm gọi API
// ==========================================================


export const API_URLS = {
    STATISTIC: "http://localhost:8080/admin2/api/product/statistic",
    PRODUCTS: "http://localhost:8080/admin2/api/product/table",
    CATEGORIES: "http://localhost:8080/admin2/api/product/category",
    CREATE_PRODUCT: "http://localhost:8080/admin2/api/product/add",
    UPDATE_PRODUCT: "http://localhost:8080/admin2/api/product/update",
    DELETE_PRODUCT: "http://localhost:8080/admin2/api/product/delete",
};

const headers = {
    "Accept": "application/json",
    "Content-Type": "application/json;charset=UTF-8",
}


export const getCategory = async () => {
    try {
        const response = await fetch(API_URLS.CATEGORIES, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json;charset=UTF-8",
            },
        });
        if (response.status === 200) {
            return await response.json();
        }
        return {};
    } catch (error) {
        console.log(error);
        return {};
    }
};


export const getStatistic = async () => {
    try {
        const response = await fetch(API_URLS.STATISTIC, {
            method: "GET",
            headers: headers,
        });
        if (response.status === 200) {
            return await response.json();
        }
        return {
            total: 0,
            available: 0,
            almostOutOfStock: 0,
            outOfStock: 0
        };
    } catch (error) {
        console.log(error);
        return {
            total: 0,
            available: 0,
            almostOutOfStock: 0,
            outOfStock: 0
        };
    }
};

/**
* Lấy danh sách sản phẩm theo bộ lọc
* @param filter
* @returns {Promise<any|{totalProducts: number, totalPages: number, currentPage: number, products: *[]}>}
*/
export const getProducts = async (filter) => {
    try {
        const queryParams = new URLSearchParams();
        if (filter.category) queryParams.append("category", filter.category);
        if (filter.stock) queryParams.append("stock", filter.stock);
        if (filter.sortOption) queryParams.append("sortOption", filter.sortOption);
        if (filter.search) queryParams.append("search", filter.search);
        if (filter.page) queryParams.append("page", filter.page);
        if (filter.limit) queryParams.append("limit", filter.limit);

        const url = `${API_URLS.PRODUCTS}?${queryParams.toString()}`;
        const response = await fetch(url, {
            method: "GET",
            headers: headers,
        });

        if (response.status === 200) {
            return await response.json();
        }
        return { products: [], currentPage: 1, totalPages: 1, totalProducts: 0 };
    } catch (error) {
        console.log(error);
        return { products: [], currentPage: 1, totalPages: 1, totalProducts: 0 };
    }
};

/**
 * Thêm sản phẩm mới
 * @param {FormData} formData - Dữ liệu form (có thể chứa file hình ảnh)
 * @returns {Promise<{success: boolean, message: string, data: Object|null}>}
 */
export const addProduct = async (formData) => {
    try {
        const response = await fetch(API_URLS.CREATE_PRODUCT, {
            method: 'POST',
            body: formData,
            // Không đặt headers khi sử dụng FormData với file upload
        });

        if (response.ok) {
            const result = await response.json();
            return {
                success: true,
                message: 'Thêm sản phẩm thành công!',
                data: result
            };
        } else {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.message || 'Không thể thêm sản phẩm!',
                data: null
            };
        }
    } catch (error) {
        console.error('Lỗi thêm sản phẩm:', error);
        return {
            success: false,
            message: 'Đã xảy ra lỗi khi thêm sản phẩm!',
            data: null
        };
    }
};

/**
 * Cập nhật sản phẩm
 * @param {FormData} formData - Dữ liệu form (có thể chứa file hình ảnh)
 * @param {number} productId - ID của sản phẩm cần cập nhật
 * @returns {Promise<{success: boolean, message: string, data: Object|null}>}
 */
export const updateProduct = async (formData, productId) => {
    try {
        const response = await fetch(`${API_URLS.UPDATE_PRODUCT}/${productId}`, {
            method: 'POST',
            body: formData,
            // Không đặt headers khi sử dụng FormData với file upload
        });

        if (response.ok) {
            const result = await response.json();
            return {
                success: true,
                message: 'Cập nhật sản phẩm thành công!',
                data: result
            };
        } else {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.message || 'Không thể cập nhật sản phẩm!',
                data: null
            };
        }
    } catch (error) {
        console.error('Lỗi cập nhật sản phẩm:', error);
        return {
            success: false,
            message: 'Đã xảy ra lỗi khi cập nhật sản phẩm!',
            data: null
        };
    }
};

/**
 * Xóa sản phẩm
 * @param {number} productId - ID của sản phẩm cần xóa
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const deleteProduct = async (productId) => {
    try {
        const response = await fetch(`${API_URLS.DELETE_PRODUCT}/${productId}`, {
            method: 'DELETE',
            headers: headers
        });

        if (response.ok) {
            return {
                success: true,
                message: 'Xóa sản phẩm thành công!'
            };
        } else {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.message || 'Không thể xóa sản phẩm!'
            };
        }
    } catch (error) {
        console.error('Lỗi xóa sản phẩm:', error);
        return {
            success: false,
            message: 'Đã xảy ra lỗi khi xóa sản phẩm!'
        };
    }
};