/**
 * Class Permission - Model đại diện cho quyền trong hệ thống
 */
export class Permission {
    /**
     * Khởi tạo đối tượng Permission
     * @param {Object} permissionData - Dữ liệu quyền
     */
    constructor(permissionData = {}) {
        this.id = permissionData.id || null;
        this.name = permissionData.name || '';
        this.code = permissionData.code || '';
        this.module = permissionData.module || '';
        this.description = permissionData.description || '';
        
        // Lưu ý: trong server có thể sử dụng "is_system" hoặc "isSystem"
        this.isSystem = permissionData.isSystem !== undefined ? permissionData.isSystem : 
                       (permissionData.isSystem !== undefined ? permissionData.isSystem : false);
        
        this.createdAt = permissionData.createdAt || permissionData.createdAt || 
                        new Date().toISOString().replace('T', ' ').substring(0, 19);
    }

    /**
     * Chuyển đổi đối tượng Permission sang JSON để lưu trữ hoặc truyền qua API
     * @returns {Object} - Dữ liệu quyền dạng JSON
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            code: this.code,
            module: this.module,
            description: this.description,
            isSystem: this.isSystem, // Sử dụng camelCase cho API
            createdAt: this.createdAt
        };
    }

    /**
     * Tạo đối tượng Permission từ dữ liệu JSON
     * @param {Object} json - Dữ liệu JSON
     * @returns {Permission} - Đối tượng Permission
     */
    static fromJSON(json) {
        return new Permission(json);
    }

    /**
     * Kiểm tra xem quyền có thể xóa được không
     * @returns {boolean} - True nếu có thể xóa, False nếu không thể xóa
     */
    isDeletable() {
        return !this.isSystem;
    }

    /**
     * Kiểm tra xem quyền có thể chỉnh sửa được không
     * @returns {boolean} - True nếu có thể chỉnh sửa, False nếu không thể chỉnh sửa
     */
    isEditable() {
        return true; // Tất cả quyền có thể chỉnh sửa, chỉ có một số trường không thể sửa
    }

    /**
     * Kiểm tra xem quyền có phải là quyền hệ thống không
     * @returns {boolean} - True nếu là quyền hệ thống, False nếu không phải
     */
    isSystem() {
        return this.isSystem;
    }
}