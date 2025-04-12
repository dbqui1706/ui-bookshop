import { RolesContainer } from '../containers/permissions/RolesContainer.js';
import { PermissionsContainer } from '../containers/permissions/PermissionsContainer.js';
import { RolePermissionsContainer } from '../containers/permissions/RolePermissionsContainer.js';
import { UserRolesContainer } from '../containers/permissions/UserRolesContainer.js';
import { EventBus } from '../core/eventBus.js';
import { showNotification } from '../core/utils.js';

/**
 * Class App - Quản lý toàn bộ ứng dụng
 */
export class PermissionsApp {
    /**
     * Khởi tạo ứng dụng
     */
    constructor() {
        // Các container
        this.containers = {};
        
        // Event Bus
        this.eventBus = EventBus.getInstance();
        
        // Khởi tạo các container theo tab
        this.initialize();
    }

    /**
     * Khởi tạo ứng dụng
     */
    async initialize() {
        try {
            // Đăng ký các sự kiện
            this.registerEventListeners();

            // Khởi tạo container cho tab đang active
            await this.initActiveTab();
        } catch (error) {
            console.error('Error initializing app:', error);
            showNotification('error', 'Lỗi khởi tạo', 'Đã xảy ra lỗi khi khởi tạo ứng dụng. Vui lòng thử lại sau.');
        }
    }

    /**
     * Đăng ký các event listeners
     */
    registerEventListeners() {
        // Xử lý sự kiện khi chuyển tab
        document.querySelectorAll('#permissionTabs .nav-link').forEach(tab => {
            tab.addEventListener('shown.bs.tab', (event) => {
                this.handleTabChange(event.target.getAttribute('id'));
            });
        });

        // Xử lý sự kiện sidebar collapse
        const sidebarCollapseBtn = document.getElementById('sidebarCollapse');
        if (sidebarCollapseBtn) {
            sidebarCollapseBtn.addEventListener('click', () => {
                document.querySelector('#sidebar').classList.toggle('active');
                document.querySelector('#content').classList.toggle('active');
            });
        }
    }

    /**
     * Khởi tạo tab đang active
     */
    async initActiveTab() {
        const activeTabId = document.querySelector('#permissionTabs .nav-link.active').getAttribute('id');
        await this.handleTabChange(activeTabId);
    }

    /**
     * Xử lý sự kiện chuyển tab
     * @param {string} tabId - ID của tab
     */
    async handleTabChange(tabId) {
        try {
            switch (tabId) {
                case 'roles-tab':
                    await this.loadRolesTab();
                    break;
                case 'permissions-tab':
                    await this.loadPermissionsTab();
                    break;
                case 'role-permissions-tab':
                    await this.loadRolePermissionsTab();
                    break;
                case 'user-roles-tab':
                    await this.loadUserRolesTab();
                    break;
            }
        } catch (error) {
            console.error(`Error loading tab ${tabId}:`, error);
            showNotification('error', 'Lỗi tải tab', `Đã xảy ra lỗi khi tải nội dung tab. Vui lòng thử lại sau.`);
        }
    }

    /**
     * Tải tab Vai trò
     */
    async loadRolesTab() {
        if (!this.containers.roles) {
            const container = document.getElementById('roles-container');
            this.containers.roles = new RolesContainer(container);
        }
    }

    /**
     * Tải tab Quyền hạn
     */
    async loadPermissionsTab() {
        if (!this.containers.permissions) {
            const container = document.getElementById('permissions-container');
            this.containers.permissions = new PermissionsContainer(container);
        }
    }

    /**
     * Tải tab Gán quyền cho vai trò
     */
    async loadRolePermissionsTab() {
        if (!this.containers.rolePermissions) {
            const container = document.getElementById('role-permissions-container');
            this.containers.rolePermissions = new RolePermissionsContainer(container);
        }
    }

    /**
     * Tải tab Gán vai trò cho người dùng
     */
    async loadUserRolesTab() {
        if (!this.containers.userRoles) {
            const container = document.getElementById('user-roles-container');
            this.containers.userRoles = new UserRolesContainer(container);
        }
    }
}

// Khởi tạo ứng dụng
document.addEventListener('DOMContentLoaded', () => {
    const app = new PermissionsApp();
});