import { Permission } from '../models/permission.js';
import { EventBus } from '../core/eventBus.js';
import { api } from '../core/api.js';

/**
 * Class PermissionService - Service xử lý logic liên quan đến quyền
 */
export class PermissionService {
    /**
     * Khởi tạo service
     */
    constructor() {
        // Event bus để giao tiếp giữa các component
        this.eventBus = EventBus.getInstance();
        // API endpoints
        this.endpoints = {
            getAll: 'api/admin/permissions',
            getById: 'api/admin/permissions/',
            getModules: 'api/admin/permissions/modules',
            create: 'api/admin/permissions/create',
            update: 'api/admin/permissions/update',
            delete: 'api/admin/permissions/delete',
            getAllRole: 'api/admin/permissions/getAll',
        };
    }

    /**
     * Lấy tất cả quyền
     * @returns {Promise<Permission[]>} - Danh sách quyền
     */
    async getAllPermissions() {
        try {
            const response = await api.get(this.endpoints.getAll);
            return response.map(permissionData => new Permission(permissionData));
        } catch (error) {
            console.error('Error fetching permissions:', error);
            throw new Error('Không thể tải danh sách quyền');
        }
    }

    /**
     * Lấy tất cả quyền
     * @returns {Promise<Permission[]>} - Danh sách quyền
     */
    async getAllPermissionsRole() {
        try {
            const response = await api.get(this.endpoints.getAllRole);
            return response.map(permissionData => new Permission(permissionData));
        } catch (error) {
            console.error('Error fetching permissions:', error);
            throw new Error('Không thể tải danh sách quyền');
        }
    }


    /**
     * Lấy quyền theo ID
     * @param {number} id - ID của quyền
     * @returns {Promise<Permission|null>} - Quyền tìm thấy hoặc null
     */
    async getPermissionById(id) {
        try {
            const response = await api.get(`${this.endpoints.getById}${id}`);
            return new Permission(response);
        } catch (error) {
            console.error(`Error fetching permission ${id}:`, error);
            throw new Error('Không thể tải thông tin quyền');
        }
    }

    /**
     * Lấy danh sách quyền theo module
     * @param {string} module - Tên module
     * @returns {Promise<Permission[]>} - Danh sách quyền thuộc module
     */
    async getPermissionsByModule(module) {
        try {
            const response = await api.get(this.endpoints.getAll, { module });
            return response.map(permissionData => new Permission(permissionData));
        } catch (error) {
            console.error(`Error fetching permissions for module ${module}:`, error);
            throw new Error(`Không thể tải danh sách quyền cho module ${module}`);
        }
    }

    /**
     * Lấy danh sách tất cả các module
     * @returns {Promise<string[]>} - Danh sách tên module
     */
    async getAllModules() {
        try {
            return await api.get(this.endpoints.getModules);
        } catch (error) {
            console.error('Error fetching modules:', error);
            throw new Error('Không thể tải danh sách module');
        }
    }

    /**
     * Tạo quyền mới
     * @param {Permission} permission - Đối tượng quyền
     * @returns {Promise<Permission>} - Quyền đã được tạo
     */
    async createPermission(permission) {
        try {
            permission.createdAt = undefined; // Không gửi trường này
            permission.updatedAt = undefined; // Không gửi trường này
            const response = await api.post(this.endpoints.create, permission.toJSON());
            const newPermission = new Permission(response);
            
            // Thông báo thay đổi
            this.eventBus.emit('permission:created', newPermission);
            
            return newPermission;
        } catch (error) {
            console.error('Error creating permission:', error);
            
            // Xử lý lỗi cụ thể từ server
            if (error.response && error.response.status === 400) {
                if (error.response.data && error.response.data.message) {
                    throw new Error(error.response.data.message);
                }
            }
            
            throw new Error('Không thể tạo quyền mới');
        }
    }

    /**
     * Cập nhật quyền
     * @param {number} id - ID của quyền
     * @param {Permission} permissionData - Dữ liệu cập nhật
     * @returns {Promise<Permission>} - Quyền đã được cập nhật
     */
    async updatePermission(id, permissionData) {
        try {
            // Đảm bảo ID được đặt đúng
            const permissionToUpdate = permissionData.toJSON();
            permissionToUpdate.id = parseInt(id);
            permissionToUpdate.createdAt = undefined; // Không cập nhật trường này
            
            // Lấy quyền hiện tại để so sánh sau khi cập nhật
            const oldPermission = await this.getPermissionById(id);
            

            // Gửi yêu cầu cập nhật
            const response = await api.put(this.endpoints.update, permissionToUpdate);
            const updatedPermission = new Permission(response);
            console.log('Old permission:', oldPermission);
            console.log('Updated permission:', updatedPermission);

            // Thông báo thay đổi
            this.eventBus.emit('permission:updated', {
                oldPermission,
                newPermission: updatedPermission
            });
            
            return updatedPermission;
        } catch (error) {
            console.error(`Error updating permission ${id}:`, error);
            
            // Xử lý lỗi cụ thể từ server
            if (error.response && error.response.status === 400) {
                if (error.response.data && error.response.data.message) {
                    throw new Error(error.response.data.message);
                }
            }
            
            throw new Error('Không thể cập nhật quyền');
        }
    }

    /**
     * Xóa quyền
     * @param {number} id - ID của quyền
     * @returns {Promise<boolean>} - Kết quả xóa quyền
     */
    async deletePermission(id) {
        try {
            // Lấy quyền cần xóa để thông báo sau khi xóa
            const permissionToDelete = await this.getPermissionById(id);
            
            // Gửi yêu cầu xóa với ID dưới dạng tham số truy vấn
            await api.delete(this.endpoints.delete, { id });
            
            // Thông báo thay đổi
            this.eventBus.emit('permission:deleted', permissionToDelete);
            
            return true;
        } catch (error) {
            console.error(`Error deleting permission ${id}:`, error);
            
            // Xử lý lỗi cụ thể từ server
            if (error.response) {
                if (error.response.status === 403) {
                    throw new Error('Không thể xóa quyền hệ thống');
                } else if (error.response.status === 404) {
                    throw new Error('Quyền không tồn tại');
                } else if (error.response.data && error.response.data.message) {
                    throw new Error(error.response.data.message);
                }
            }
            
            throw new Error('Không thể xóa quyền');
        }
    }
}

// Singleton pattern - chỉ tạo một instance duy nhất của PermissionService
let instance = null;

export const permissionService = {
    getInstance: () => {
        if (!instance) {
            instance = new PermissionService();
        }
        return instance;
    }
};