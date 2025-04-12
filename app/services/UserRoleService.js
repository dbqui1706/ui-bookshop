import { Role } from '../models/role.js';
import { EventBus } from '../core/eventBus.js';
import { api } from '../core/api.js';

/**
 * Class UserRoleService - Service xử lý logic liên quan đến vai trò của người dùng
 */
export class UserRoleService {
    /**
     * Khởi tạo service
     */
    constructor() {
        // Event bus để giao tiếp giữa các component
        this.eventBus = EventBus.getInstance();
        // API endpoints
        this.endpoints = {
            getRolesByUserId: 'api/admin/users-roles',
            setRolesForUser: 'api/admin/users-roles/update',
            addRoleToUser: 'api/admin/users-roles/add',
            removeRoleFromUser: 'api/admin/users-roles/remove',
            removeAllRolesFromUser: 'api/admin/users-roles/remove-all'
        };
    }

    /**
     * Lấy danh sách vai trò của người dùng
     * @param {number} userId - ID của người dùng
     * @returns {Promise<Role[]>} - Danh sách vai trò
     */
    async getRolesByUserId(userId) {
        try {
            const response = await api.get(this.endpoints.getRolesByUserId, { userId });
            return response.map(roleData => new Role(roleData));
        } catch (error) {
            console.error(`Error fetching roles for user ${userId}:`, error);
            throw new Error('Không thể tải danh sách vai trò của người dùng');
        }
    }

    /**
     * Thiết lập danh sách vai trò cho người dùng
     * @param {number} userId - ID của người dùng
     * @param {number[]} roleIds - Danh sách ID vai trò
     * @returns {Promise<boolean>} - Kết quả thiết lập vai trò
     */
    async setRolesForUser(userId, roleIds) {
        try {
            await api.post(this.endpoints.setRolesForUser, roleIds, { userId });
            
            // Thông báo thay đổi
            this.eventBus.emit('user-roles:updated', { userId, roleIds });
            
            return true;
        } catch (error) {
            console.error(`Error setting roles for user ${userId}:`, error);
            throw new Error(error.message || 'Không thể thiết lập vai trò cho người dùng');
        }
    }

    /**
     * Thêm một vai trò cho người dùng
     * @param {number} userId - ID của người dùng
     * @param {number} roleId - ID của vai trò
     * @returns {Promise<boolean>} - Kết quả thêm vai trò
     */
    async addRoleToUser(userId, roleId) {
        try {
            await api.post(this.endpoints.addRoleToUser, null, { userId, roleId });
            
            // Thông báo thay đổi
            this.eventBus.emit('user-role:added', { userId, roleId });
            
            return true;
        } catch (error) {
            console.error(`Error adding role ${roleId} to user ${userId}:`, error);
            throw new Error(error.message || 'Không thể thêm vai trò cho người dùng');
        }
    }

    /**
     * Xóa một vai trò khỏi người dùng
     * @param {number} userId - ID của người dùng
     * @param {number} roleId - ID của vai trò
     * @returns {Promise<boolean>} - Kết quả xóa vai trò
     */
    async removeRoleFromUser(userId, roleId) {
        try {
            await api.post(this.endpoints.removeRoleFromUser, null, { userId, roleId });
            
            // Thông báo thay đổi
            this.eventBus.emit('user-role:removed', { userId, roleId });
            
            return true;
        } catch (error) {
            console.error(`Error removing role ${roleId} from user ${userId}:`, error);
            throw new Error(error.message || 'Không thể xóa vai trò khỏi người dùng');
        }
    }

    /**
     * Xóa tất cả vai trò của người dùng
     * @param {number} userId - ID của người dùng
     * @returns {Promise<boolean>} - Kết quả xóa vai trò
     */
    async removeAllRolesFromUser(userId) {
        try {
            await api.post(this.endpoints.removeAllRolesFromUser, null, { userId });
            
            // Thông báo thay đổi
            this.eventBus.emit('user-roles:cleared', userId);
            
            return true;
        } catch (error) {
            console.error(`Error removing all roles from user ${userId}:`, error);
            throw new Error(error.message || 'Không thể xóa tất cả vai trò của người dùng');
        }
    }
}

// Singleton pattern - chỉ tạo một instance duy nhất của UserRoleService
let instance = null;

export const userRoleService = {
    getInstance: () => {
        if (!instance) {
            instance = new UserRoleService();
        }
        return instance;
    }
};