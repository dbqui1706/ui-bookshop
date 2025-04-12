import { Role } from '../models/role.js';
import { EventBus } from '../core/eventBus.js';
import { api } from '../core/api.js';

/**
 * Class RoleService - Service xử lý logic liên quan đến vai trò
 */
export class RoleService {
    /**
     * Khởi tạo service
     */
    constructor() {
        // Event bus để giao tiếp giữa các component
        this.eventBus = EventBus.getInstance();
        // API endpoints
        this.endpoints = {
            getAll: 'api/admin/roles',
            getById: 'api/admin/roles/',
            create: 'api/admin/roles/create',
            update: 'api/admin/roles/update',
            delete: 'api/admin/roles/delete'
        };
    }

    /**
     * Lấy tất cả vai trò
     * @returns {Promise<Role[]>} - Danh sách vai trò
     */
    async getAllRoles() {
        try {
            const response = await api.get(this.endpoints.getAll);
            return response.map(roleData => new Role(roleData));
        } catch (error) {
            console.error('Error fetching roles:', error);
            throw new Error('Không thể tải danh sách vai trò');
        }
    }

    /**
     * Lấy vai trò theo ID
     * @param {number} id - ID của vai trò
     * @returns {Promise<Role|null>} - Vai trò tìm thấy hoặc null
     */
    async getRoleById(id) {
        console.log(this.endpoints.getById + id)
        try {
            const response = await api.get(`${this.endpoints.getById + id}`);
            if (!response) {
                return null; // Không tìm thấy vai trò
            }
            return new Role(response);
        } catch (error) {
            console.error(`Error fetching role ${id}:`, error);
            throw new Error('Không thể tải thông tin vai trò');
        }
    }

    /**
     * Tạo vai trò mới
     * @param {Role} role - Đối tượng vai trò
     * @returns {Promise<Role>} - Vai trò đã được tạo
     */
    async createRole(role) {
        try {
            const response = await api.post(this.endpoints.create, role.toJSON());
            const newRole = new Role(response);
            
            // Thông báo thay đổi
            this.eventBus.emit('role:created', newRole);
            
            return newRole;
        } catch (error) {
            console.error('Error creating role:', error);
            
            // Xử lý lỗi cụ thể từ server
            if (error.response && error.response.status === 400) {
                if (error.response.data && error.response.data.message) {
                    throw new Error(error.response.data.message);
                }
            }
            
            throw new Error('Không thể tạo vai trò mới');
        }
    }

    /**
     * Cập nhật vai trò
     * @param {number} id - ID của vai trò
     * @param {Role} roleData - Dữ liệu cập nhật
     * @returns {Promise<Role>} - Vai trò đã được cập nhật
     */
    async updateRole(id, roleData) {
        try {
            // Đảm bảo ID được đặt đúng
            const roleToUpdate = roleData.toJSON();
            roleToUpdate.id = parseInt(id);
            
            // Lấy vai trò hiện tại để so sánh sau khi cập nhật
            const oldRole = await this.getRoleById(id);

            // Gửi yêu cầu cập nhật
            const response = await api.put(this.endpoints.update, roleToUpdate);
            const updatedRole = new Role(response);
            
            // Thông báo thay đổi
            this.eventBus.emit('role:updated', {
                oldRole,
                newRole: updatedRole
            });
            
            return updatedRole;
        } catch (error) {
            console.error(`Error updating role ${id}:`, error);
            
            // Xử lý lỗi cụ thể từ server
            if (error.response && error.response.status === 400) {
                if (error.response.data && error.response.data.message) {
                    throw new Error(error.response.data.message);
                }
            }
            
            throw new Error('Không thể cập nhật vai trò');
        }
    }

    /**
     * Xóa vai trò
     * @param {number} id - ID của vai trò
     * @returns {Promise<boolean>} - Kết quả xóa vai trò
     */
    async deleteRole(id) {
        try {
            // Lấy vai trò cần xóa để thông báo sau khi xóa
            const roleToDelete = await this.getRoleById(id);
            
            // Gửi yêu cầu xóa với ID dưới dạng tham số truy vấn
            await api.delete(this.endpoints.delete, { id });
            
            // Thông báo thay đổi
            this.eventBus.emit('role:deleted', roleToDelete);
            
            return true;
        } catch (error) {
            console.error(`Error deleting role ${id}:`, error);
            
            // Xử lý lỗi cụ thể từ server
            if (error.response) {
                if (error.response.status === 403) {
                    throw new Error('Không thể xóa vai trò hệ thống');
                } else if (error.response.status === 404) {
                    throw new Error('Vai trò không tồn tại');
                } else if (error.response.data && error.response.data.message) {
                    throw new Error(error.response.data.message);
                }
            }
            
            throw new Error('Không thể xóa vai trò');
        }
    }
}

// Singleton pattern - chỉ tạo một instance duy nhất của RoleService
let instance = null;

export const roleService = {
    getInstance: () => {
        if (!instance) {
            instance = new RoleService();
        }
        return instance;
    }
};