// ==========================================================
// category.js - Service cho quản lý danh mục
// ==========================================================

export const API_URLS = {
    CATEGORIES: "http://localhost:8080/admin2/api/product/product-category",
    CATEGORY_STATS: "http://localhost:8080/admin2/api/product/category-statistic",
    ADD_CATEGORY: "http://localhost:8080/admin2/api/product/add-category",
    UPDATE_CATEGORY: "http://localhost:8080/admin2/api/product/update-category",
    DELETE_CATEGORY: "http://localhost:8080/admin2/api/product/delete-category",
};

const headers = {
    "Accept": "application/json",
    "Content-Type": "application/json;charset=UTF-8",
};

// Lấy danh sách danh mục
export const getCategories = async (filter) => {
    try {
        const queryParams = new URLSearchParams();
        if (filter.search) queryParams.append("search", filter.search);
        if (filter.status) queryParams.append("status", filter.status);
        if (filter.page) queryParams.append("page", filter.page);
        if (filter.limit) queryParams.append("limit", filter.limit);

        const url = `${API_URLS.CATEGORIES}?${queryParams.toString()}`;
        const response = await fetch(url, {
            method: "GET",
            headers: headers,
        });

        if (response.status === 200) {
            return await response.json();
        }
        return { categories: [], currentPage: 1, totalPages: 1, totalCategories: 0 };
    } catch (error) {
        console.error("Error fetching categories:", error);
        return { categories: [], currentPage: 1, totalPages: 1, totalCategories: 0 };
    }
};

// Lấy thống kê danh mục
export const getCategoryStats = async () => {
    try {
        const response = await fetch(API_URLS.CATEGORY_STATS, {
            method: "GET",
            headers: headers,
        });

        if (response.status === 200) {
            return await response.json();
        }
        return {
            total: 0,
            active: 0,
            inactive: 0
        };
    } catch (error) {
        console.error("Error fetching category stats:", error);
        return {
            total: 0,
            active: 0,
            inactive: 0
        };
    }
};

// Thêm danh mục mới
export const addCategory = async (categoryData) => {
    try {
        const response = await fetch(API_URLS.ADD_CATEGORY, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(categoryData)
        });

        if (response.ok) {
            const result = await response.json();
            return {
                success: true,
                message: "Thêm thể loại thành công!",
                data: result
            };
        } else {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.message || "Không thể thêm thể loại!",
                data: null
            };
        }
    } catch (error) {
        console.error("Error adding category:", error);
        return {
            success: false,
            message: "Đã xảy ra lỗi khi thêm thể loại!",
            data: null
        };
    }
};

// Cập nhật danh mục
export const updateCategory = async (categoryData) => {
    try {
        const response = await fetch(API_URLS.UPDATE_CATEGORY, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(categoryData)
        });

        if (response.ok) {
            const result = await response.json();
            return {
                success: true,
                message: "Cập nhật thể loại thành công!",
                data: result
            };
        } else {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.message || "Không thể cập nhật thể loại!",
                data: null
            };
        }
    } catch (error) {
        console.error("Error updating category:", error);
        return {
            success: false,
            message: "Đã xảy ra lỗi khi cập nhật thể loại!",
            data: null
        };
    }
};

// Xóa danh mục
export const deleteCategory = async (categoryId) => {
    try {
        const response = await fetch(`${API_URLS.DELETE_CATEGORY}?categoryId=${categoryId}`, {
            method: "DELETE",
            headers: headers
        });

        if (response.ok) {
            return {
                success: true,
                message: "Xóa thể loại thành công!"
            };
        } else {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.message || "Không thể xóa thể loại!"
            };
        }
    } catch (error) {
        console.error("Error deleting category:", error);
        return {
            success: false,
            message: "Đã xảy ra lỗi khi xóa thể loại!"
        };
    }
};