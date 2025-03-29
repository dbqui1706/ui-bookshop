// ==========================================================
// user.js - Chứa các hằng số API và hàm gọi API
// ==========================================================


export const API_URLS = {
    USERS: "http://localhost:8080/admin2/api/users",
    STATISTIC: "http://localhost:8080/admin2/api/user/statistic",
    ADD_USER: "http://localhost:8080/admin2/api/user/add",
    UPDATE_USER: "http://localhost:8080/admin2/api/user/update",
    CHANGE_STATUS: "http://localhost:8080/admin2/api/user/change-status"
};

const headers = {
    "Accept": "application/json",
    "Content-Type": "application/json;charset=UTF-8",
};

export const getUsers = async (filter) => {
    try {
        const queryParams = new URLSearchParams();
        if (filter.search) queryParams.append("search", filter.search);
        if (filter.role) queryParams.append("role", filter.role);
        if (filter.status) queryParams.append("status", filter.status);
        if (filter.sort) queryParams.append("sort", filter.sort);
        if (filter.page) queryParams.append("page", filter.page);
        if (filter.limit) queryParams.append("limit", filter.limit);

        const url = `${API_URLS.USERS}?${queryParams.toString()}`;
        const response = await fetch(url, {
            method: "GET",
            headers: headers,
        });

        if (response.status === 200) {
            return await response.json();
        }
        return { users: [], currentPage: 1, totalPages: 1, totalUsers: 0 };
    } catch (error) {
        console.log(error);
        return { users: [], currentPage: 1, totalPages: 1, totalUsers: 0 };
    }
};

export const getUserStats = async () => {
    try {
        const response = await fetch(API_URLS.STATISTIC, {
            method: "GET",
            headers: headers,
        });

        if (response.status === 200) {
            return await response.json();
        }
        return {
            totalUsers: 0,
            activeUsers: 0,
            activePercentage: 0,
            newUsersThisMonth: 0,
            newUsersLastMonth: 0,
            lockedAccounts: 0,
            lockedPercentage: 0,
            growthPercentage: 0,
        };
    } catch (error) {
        console.log(error);
        return {
            totalUsers: 0,
            activeUsers: 0,
            activePercentage: 0,
            newUsersThisMonth: 0,
            newUsersLastMonth: 0,
            lockedAccounts: 0,
            lockedPercentage: 0,
            growthPercentage: 0,
        };
    }
};

// Thêm người dùng mới
export const addUser = async (userData) => {
    try {
        const response = await fetch(API_URLS.ADD_USER, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            const result = await response.json();
            return {
                success: true,
                message: "Thêm người dùng thành công!",
                data: result
            };
        } else {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.message || "Không thể thêm người dùng!",
                data: null
            };
        }
    } catch (error) {
        console.error("Error adding user:", error);
        return {
            success: false,
            message: "Đã xảy ra lỗi khi thêm người dùng!",
            data: null
        };
    }
};

// Cập nhật người dùng
export const updateUser = async (userData) => {
    try {
        const response = await fetch(API_URLS.UPDATE_USER, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            const result = await response.json();
            return {
                success: true,
                message: "Cập nhật người dùng thành công!",
                data: result
            };
        } else {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.message || "Không thể cập nhật người dùng!",
                data: null
            };
        }
    } catch (error) {
        console.error("Error updating user:", error);
        return {
            success: false,
            message: "Đã xảy ra lỗi khi cập nhật người dùng!",
            data: null
        };
    }
};

// Thay đổi trạng thái người dùng
export const changeUserStatus = async (userId, active) => {
    try {
        const response = await fetch(`${API_URLS.CHANGE_STATUS}`, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify({ userId, active })
        });

        if (response.ok) {
            return {
                success: true,
                message: active ? "Người dùng đã được kích hoạt!" : "Người dùng đã bị khóa!"
            };
        } else {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.message || "Không thể thay đổi trạng thái người dùng!"
            };
        }
    } catch (error) {
        console.error("Error changing user status:", error);
        return {
            success: false,
            message: "Đã xảy ra lỗi khi thay đổi trạng thái người dùng!"
        };
    }
};

// Lấy chi tiết người dùng
export const getUserById = async (userId) => {
    try {
        const response = await fetch(`${API_URLS.USERS}/${userId}`, {
            method: "GET",
            headers: headers,
        });

        if (response.status === 200) {
            return {
                success: true,
                data: await response.json()
            };
        }
        return {
            success: false,
            message: "Không tìm thấy người dùng!",
            data: null
        };
    } catch (error) {
        console.error("Error fetching user detail:", error);
        return {
            success: false,
            message: "Đã xảy ra lỗi khi lấy thông tin người dùng!",
            data: null
        };
    }
};

// Xóa người dùng (nếu cần)
export const deleteUser = async (userId) => {
    try {
        const response = await fetch(`${API_URLS.USERS}/${userId}`, {
            method: "DELETE",
            headers: headers,
        });

        if (response.ok) {
            return {
                success: true,
                message: "Xóa người dùng thành công!"
            };
        } else {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.message || "Không thể xóa người dùng!"
            };
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        return {
            success: false,
            message: "Đã xảy ra lỗi khi xóa người dùng!"
        };
    }
};

// Đặt lại mật khẩu
export const resetPassword = async (userId, newPassword) => {
    try {
        const response = await fetch(`${API_URLS.USERS}/reset-password`, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify({ userId, newPassword })
        });

        if (response.ok) {
            return {
                success: true,
                message: "Đặt lại mật khẩu thành công!"
            };
        } else {
            const errorData = await response.json();
            return {
                success: false, 
                message: errorData.message || "Không thể đặt lại mật khẩu!"
            };
        }
    } catch (error) {
        console.error("Error resetting password:", error);
        return {
            success: false,
            message: "Đã xảy ra lỗi khi đặt lại mật khẩu!"
        };
    }
};