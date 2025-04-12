import { User } from '../models/user.js';
import { EventBus } from '../core/eventBus.js';
import { api } from '../core/api.js';

/**
 * Class UserService - Service xử lý logic liên quan đến người dùng
 */
export class UserService {
    /**
     * Khởi tạo service
     */
    constructor() {
        // Event bus để giao tiếp giữa các component
        this.eventBus = EventBus.getInstance();
        // API endpoints
        this.endpoints = {
            getAll: 'api/admin/users',
            getById: 'api/admin/users/',
            create: 'api/admin/users/create',
            update: 'api/admin/users/update',
            delete: 'api/admin/users/delete',
            updateStatus: 'api/admin/users/status',
            resetPassword: 'api/admin/users/reset-password'
        };
    }

    /**
     * Lấy tất cả người dùng
     * @returns {Promise<User[]>} - Danh sách người dùng
     */
    async getAllUsers() {
        try {
            const response = await api.get(this.endpoints.getAll);
            return response.map(userData => new User(userData));
        } catch (error) {
            console.error('Error fetching users:', error);
            throw new Error('Không thể tải danh sách người dùng');
        }
    }

    /**
     * Lấy danh sách người dùng phân trang cho DataTable
     * @param {number} start - Vị trí bắt đầu
     * @param {number} length - Số lượng bản ghi
     * @param {string} orderColumn - Cột sắp xếp
     * @param {string} orderDirection - Hướng sắp xếp
     * @param {string} searchValue - Giá trị tìm kiếm
     * @returns {Promise<{data: User[], recordsTotal: number, recordsFiltered: number}>} - Kết quả phân trang
     */
    async getUsersByPage(start, length, orderColumn, orderDirection, searchValue) {
        try {
            const params = {
                start,
                length,
                'order[0][column]': orderColumn,
                'order[0][dir]': orderDirection,
                'search[value]': searchValue
            };
            
            return await api.get(this.endpoints.getAll, params);
        } catch (error) {
            console.error('Error fetching users by page:', error);
            throw new Error('Không thể tải danh sách người dùng');
        }
    }

    /**
     * Lấy người dùng theo ID
     * @param {number} id - ID của người dùng
     * @returns {Promise<User|null>} - Người dùng tìm thấy hoặc null
     */
    async getUserById(id) {
        try {
            const response = await api.get(`${this.endpoints.getById}${id}`);
            return new User(response);
        } catch (error) {
            console.error(`Error fetching user ${id}:`, error);
            throw new Error('Không thể tải thông tin người dùng');
        }
    }

    /**
     * Tạo người dùng mới
     * @param {User} user - Đối tượng người dùng
     * @returns {Promise<User>} - Người dùng đã được tạo
     */
    async createUser(user) {
        try {
            const response = await api.post(this.endpoints.create, user.toJSON());
            const newUser = new User(response);
            
            // Thông báo thay đổi
            this.eventBus.emit('user:created', newUser);
            
            return newUser;
        } catch (error) {
            console.error('Error creating user:', error);
            throw new Error(error.message || 'Không thể tạo người dùng mới');
        }
    }

    /**
     * Cập nhật người dùng
     * @param {number} id - ID của người dùng
     * @param {User} userData - Dữ liệu cập nhật
     * @returns {Promise<User>} - Người dùng đã được cập nhật
     */
    async updateUser(id, userData) {
        try {
            // Đảm bảo ID được đặt đúng
            const userToUpdate = userData.toJSON();
            userToUpdate.id = parseInt(id);
            
            // Gửi yêu cầu cập nhật
            const response = await api.put(this.endpoints.update, userToUpdate);
            const updatedUser = new User(response);
            
            // Thông báo thay đổi
            this.eventBus.emit('user:updated', updatedUser);
            
            return updatedUser;
        } catch (error) {
            console.error(`Error updating user ${id}:`, error);
            throw new Error(error.message || 'Không thể cập nhật người dùng');
        }
    }

    /**
     * Xóa người dùng
     * @param {number} id - ID của người dùng
     * @returns {Promise<boolean>} - Kết quả xóa người dùng
     */
    async deleteUser(id) {
        try {
            await api.delete(this.endpoints.delete, { id });
            
            // Thông báo thay đổi
            this.eventBus.emit('user:deleted', id);
            
            return true;
        } catch (error) {
            console.error(`Error deleting user ${id}:`, error);
            throw new Error(error.message || 'Không thể xóa người dùng');
        }
    }

    /**
     * Cập nhật trạng thái người dùng
     * @param {number} id - ID của người dùng
     * @param {boolean} status - Trạng thái mới
     * @returns {Promise<User>} - Người dùng đã được cập nhật
     */
    async updateUserStatus(id, status) {
        try {
            const response = await api.put(this.endpoints.updateStatus, { id, status });
            const updatedUser = new User(response);
            
            // Thông báo thay đổi
            this.eventBus.emit('user:status_updated', updatedUser);
            
            return updatedUser;
        } catch (error) {
            console.error(`Error updating user status ${id}:`, error);
            throw new Error(error.message || 'Không thể cập nhật trạng thái người dùng');
        }
    }

    /**
     * Đặt lại mật khẩu cho người dùng
     * @param {number} id - ID của người dùng
     * @returns {Promise<{success: boolean, newPassword: string}>} - Kết quả đặt lại mật khẩu
     */
    async resetUserPassword(id) {
        try {
            const response = await api.post(this.endpoints.resetPassword, { id });
            
            // Thông báo thay đổi
            this.eventBus.emit('user:password_reset', id);
            
            return response;
        } catch (error) {
            console.error(`Error resetting password for user ${id}:`, error);
            throw new Error(error.message || 'Không thể đặt lại mật khẩu');
        }
    }

    /**
     * Kiểm tra người dùng có tồn tại không
     * @param {number} id - ID của người dùng
     * @returns {Promise<boolean>} - true nếu tồn tại, false nếu không
     */
    async isUserExists(id) {
        try {
            const user = await this.getUserById(id);
            return !!user;
        } catch (error) {
            return false;
        }
    }
}

// Singleton pattern - chỉ tạo một instance duy nhất của UserService
let instance = null;

export const userService = {
    getInstance: () => {
        if (!instance) {
            instance = new UserService();
        }
        return instance;
    }
};