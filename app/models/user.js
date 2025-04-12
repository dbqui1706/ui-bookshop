/**
 * Class User - Model người dùng
 */
export class User {
    /**
     * Khởi tạo đối tượng User
     * @param {Object} data - Dữ liệu người dùng
     */
    constructor(data = {}) {
        this.id = data.id || null;
        this.username = data.username || '';
        this.fullName = data.fullName || '';
        this.email = data.email || '';
        this.avatar = data.avatar || '';
        this.phone = data.phone || '';
        this.address = data.address || '';
        this.isActive = data.isActive !== undefined ? data.isActive : true;
        this.roles = data.roles || [];
        this.createdAt = data.createdAt || null;
        this.updatedAt = data.updatedAt || null;
    }

    /**
     * Chuyển đối tượng thành JSON để gửi lên server
     * @returns {Object} - Dữ liệu JSON
     */
    toJSON() {
        return {
            id: this.id,
            username: this.username,
            fullName: this.fullName,
            email: this.email,
            avatar: this.avatar,
            phone: this.phone,
            address: this.address,
            isActive: this.isActive,
            roles: this.roles.map(role => typeof role === 'object' ? role.id : role)
        };
    }
}