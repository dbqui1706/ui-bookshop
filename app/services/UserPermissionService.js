import { EventBus } from '../core/eventBus.js';
import { api } from '../core/api.js';

/**
 * Class SpecialPermission - Model quyền đặc biệt cho người dùng
 */
export class SpecialPermission {
    /**
     * Khởi tạo đối tượng SpecialPermission
     * @param {Object} data - Dữ liệu quyền đặc biệt
     */
    constructor(data = {}) {
        this.id = data.id || null;
        this.userId = data.userId || null;
        this.permissionId = data.permissionId || null;
        this.permissionName = data.permissionName || '';
        this.permissionCode = data.permissionCode || '';
        this.module = data.module || '';
        this.granted = data.granted !== undefined ? data.granted : true; // true: cấp quyền, false: từ chối quyền
        this.createdAt = data.createdAt || null;
    }

    /**
     * Chuyển đối tượng thành JSON để gửi lên server
     * @returns {Object} - Dữ liệu JSON
     */
    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            permissionId: this.permissionId,
            granted: this.granted
        };
    }
}

/**
 * Class UserPermissionService - Service xử lý logic liên quan đến quyền đặc biệt của người dùng
 */
export class UserPermissionService {
    /**
     * Khởi tạo service
     */
    constructor() {
        // Event bus để giao tiếp giữa các component
        this.eventBus = EventBus.getInstance();
        // API endpoints
        this.endpoints = {
            getSpecialPermissions: 'api/admin/users-special-permissions',
            grantPermission: 'api/admin/users-special-permissions/grant',
            denyPermission: 'api/admin/users-special-permissions/deny',
            removePermission: 'api/admin/users-special-permissions/remove'
        };
    }

    /**
     * Lấy danh sách quyền đặc biệt của người dùng
     * @param {number} userId - ID của người dùng
     * @returns {Promise<SpecialPermission[]>} - Danh sách quyền đặc biệt
     */
    async getSpecialPermissionsByUserId(userId) {
        try {
            const response = await api.get(this.endpoints.getSpecialPermissions, { userId });
            return response.map(permData => new SpecialPermission(permData));
        } catch (error) {
            console.error(`Error fetching special permissions for user ${userId}:`, error);
            throw new Error('Không thể tải danh sách quyền đặc biệt của người dùng');
        }
    }

    /**
     * Cấp quyền đặc biệt cho người dùng
     * @param {number} userId - ID của người dùng
     * @param {number} permissionId - ID của quyền
     * @returns {Promise<boolean>} - Kết quả cấp quyền
     */
    async grantPermission(userId, permissionId) {
        try {
            await api.post(this.endpoints.grantPermission, null, { userId, permissionId });
            
            // Thông báo thay đổi
            this.eventBus.emit('user-permission:granted', { userId, permissionId });
            
            return true;
        } catch (error) {
            console.error(`Error granting permission ${permissionId} to user ${userId}:`, error);
            throw new Error(error.message || 'Không thể cấp quyền đặc biệt cho người dùng');
        }
    }

    /**
     * Từ chối quyền đặc biệt cho người dùng
     * @param {number} userId - ID của người dùng
     * @param {number} permissionId - ID của quyền
     * @returns {Promise<boolean>} - Kết quả từ chối quyền
     */
    async denyPermission(userId, permissionId) {
        try {
            await api.post(this.endpoints.denyPermission, null, { userId, permissionId });
            
            // Thông báo thay đổi
            this.eventBus.emit('user-permission:denied', { userId, permissionId });
            
            return true;
        } catch (error) {
            console.error(`Error denying permission ${permissionId} for user ${userId}:`, error);
            throw new Error(error.message || 'Không thể từ chối quyền đặc biệt cho người dùng');
        }
    }

    /**
     * Xóa quyền đặc biệt của người dùng
     * @param {number} userId - ID của người dùng
     * @param {number} permissionId - ID của quyền
     * @returns {Promise<boolean>} - Kết quả xóa quyền
     */
    async removeSpecialPermission(userId, permissionId) {
        try {
            await api.delete(this.endpoints.removePermission, { userId, permissionId });
            
            // Thông báo thay đổi
            this.eventBus.emit('user-permission:removed', { userId, permissionId });
            
            return true;
        } catch (error) {
            console.error(`Error removing special permission ${permissionId} from user ${userId}:`, error);
            throw new Error(error.message || 'Không thể xóa quyền đặc biệt của người dùng');
        }
    }
}

// Singleton pattern - chỉ tạo một instance duy nhất của UserPermissionService
let instance = null;

export const userPermissionService = {
    getInstance: () => {
        if (!instance) {
            instance = new UserPermissionService();
        }
        return instance;
    }
};