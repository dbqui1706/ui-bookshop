import { Permission } from '../models/permission.js';
import { EventBus } from '../core/eventBus.js';
import { api } from '../core/api.js';

/**
 * Class RolePermissionService - Service xử lý logic liên quan đến quyền của vai trò
 */
export class RolePermissionService {
    /**
     * Khởi tạo service
     */
    constructor() {
        // Event bus để giao tiếp giữa các component
        this.eventBus = EventBus.getInstance();
        // API endpoints
        this.endpoints = {
            getPermissionsByRoleId: 'api/admin/roles-permissions',
            setPermissionsForRole: 'api/admin/roles-permissions/update',
            addPermissionToRole: 'api/admin/roles-permissions/add',
            removePermissionFromRole: 'api/admin/roles-permissions/remove',
            removeAllPermissionsFromRole: 'api/admin/roles-permissions/remove-all'
        };
    }

    /**
     * Lấy danh sách quyền của vai trò
     * @param {number} roleId - ID của vai trò
     * @returns {Promise<Permission[]>} - Danh sách quyền
     */
    async getPermissionsByRoleId(roleId) {
        try {
            const response = await api.get(this.endpoints.getPermissionsByRoleId, { roleId });
            return response.map(permissionData => new Permission(permissionData));
        } catch (error) {
            console.error(`Error fetching permissions for role ${roleId}:`, error);
            throw new Error('Không thể tải danh sách quyền của vai trò');
        }
    }

    /**
     * Thiết lập danh sách quyền cho vai trò
     * @param {number} roleId - ID của vai trò
     * @param {number[]} permissionIds - Danh sách ID quyền
     * @returns {Promise<boolean>} - Kết quả thiết lập quyền
     */
    async setPermissionsForRole(roleId, permissionIds) {
        try {
            await api.post(this.endpoints.setPermissionsForRole, permissionIds, { roleId });
            
            // Thông báo thay đổi
            this.eventBus.emit('role-permissions:updated', { roleId, permissionIds });
            
            return true;
        } catch (error) {
            console.error(`Error setting permissions for role ${roleId}:`, error);
            throw new Error(error.message || 'Không thể thiết lập quyền cho vai trò');
        }
    }

    /**
     * Thêm một quyền cho vai trò
     * @param {number} roleId - ID của vai trò
     * @param {number} permissionId - ID của quyền
     * @returns {Promise<boolean>} - Kết quả thêm quyền
     */
    async addPermissionToRole(roleId, permissionId) {
        try {
            await api.post(this.endpoints.addPermissionToRole, null, { roleId, permissionId });
            
            // Thông báo thay đổi
            this.eventBus.emit('role-permission:added', { roleId, permissionId });
            
            return true;
        } catch (error) {
            console.error(`Error adding permission ${permissionId} to role ${roleId}:`, error);
            throw new Error(error.message || 'Không thể thêm quyền cho vai trò');
        }
    }

    /**
     * Xóa một quyền khỏi vai trò
     * @param {number} roleId - ID của vai trò
     * @param {number} permissionId - ID của quyền
     * @returns {Promise<boolean>} - Kết quả xóa quyền
     */
    async removePermissionFromRole(roleId, permissionId) {
        try {
            await api.post(this.endpoints.removePermissionFromRole, null, { roleId, permissionId });
        
            // Thông báo thay đổi
            this.eventBus.emit('role-permission:removed', { roleId, permissionId });
            
            return true;
        } catch (error) {
            console.error(`Error removing permission ${permissionId} from role ${roleId}:`, error);
            throw new Error(error.message || 'Không thể xóa quyền khỏi vai trò');
        }
    }

    /**
     * Xóa tất cả quyền của vai trò
     * @param {number} roleId - ID của vai trò
     * @returns {Promise<boolean>} - Kết quả xóa quyền
     */
    async removeAllPermissionsFromRole(roleId) {
        try {
            await api.post(this.endpoints.removeAllPermissionsFromRole, null, { roleId });
            
            // Thông báo thay đổi
            this.eventBus.emit('role-permissions:cleared', roleId);
            
            return true;
        } catch (error) {
            console.error(`Error removing all permissions from role ${roleId}:`, error);
            throw new Error(error.message || 'Không thể xóa tất cả quyền của vai trò');
        }
    }
}

// Singleton pattern - chỉ tạo một instance duy nhất của RolePermissionService
let instance = null;

export const rolePermissionService = {
    getInstance: () => {
        if (!instance) {
            instance = new RolePermissionService();
        }
        return instance;
    }
};