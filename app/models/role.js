/**
 * Class Role - Model đại diện cho vai trò trong hệ thống
 */
export class Role {
    /**
     * Khởi tạo đối tượng Role
     * @param {Object} roleData - Dữ liệu vai trò
     */
    constructor(roleData = {}) {
        this.id = roleData.id || null;
        this.name = roleData.name || '';
        this.description = roleData.description || '';
        this.is_system = roleData.isSystem || false;
        this.created_at = roleData.created_at || new Date().toISOString().replace('T', ' ').substring(0, 19);
    }

    /**
     * Chuyển đổi đối tượng Role sang JSON để lưu trữ hoặc truyền qua API
     * @returns {Object} - Dữ liệu vai trò dạng JSON
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            is_system: this.is_system,
            created_at: this.created_at
        };
    }

    /**
     * Tạo đối tượng Role từ dữ liệu JSON
     * @param {Object} json - Dữ liệu JSON
     * @returns {Role} - Đối tượng Role
     */
    static fromJSON(json) {
        return new Role(json);
    }

    /**
     * Kiểm tra xem vai trò có thể xóa được không
     * @returns {boolean} - True nếu có thể xóa, False nếu không thể xóa
     */
    isDeletable() {
        return !this.is_system;
    }

    /**
     * Kiểm tra xem vai trò có thể chỉnh sửa được không
     * @returns {boolean} - True nếu có thể chỉnh sửa, False nếu không thể chỉnh sửa
     */
    isEditable() {
        return true; // Tất cả vai trò có thể chỉnh sửa, chỉ có một số trường không thể sửa
    }
}