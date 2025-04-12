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