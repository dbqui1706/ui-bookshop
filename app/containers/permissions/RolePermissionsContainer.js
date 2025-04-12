import { RolePermissionsComponent } from '../../components/permissions/RolePermissionsComponent.js';
import { showNotification } from '../../core/utils.js';

/**
 * Class RolePermissionsContainer - Container điều phối cho phần gán quyền cho vai trò
 */
export class RolePermissionsContainer {
    /**
     * Khởi tạo container
     * @param {HTMLElement} containerElement - Element container chứa tất cả các components
     */
    constructor(containerElement) {
        this.containerElement = containerElement;
        this.rolePermissionsComponent = null;
        
        // Khởi tạo container
        this.initialize();
    }

    /**
     * Khởi tạo container và các components con
     */
    async initialize() {
        try {
            // Tải template HTML
            await this.loadTemplate();
            
            // Khởi tạo component con
            this.initComponents();
            
        } catch (error) {
            console.error('Error initializing RolePermissionsContainer:', error);
            showNotification('error', 'Lỗi', 'Không thể khởi tạo trang gán quyền cho vai trò.');
        }
    }

    /**
     * Tải template HTML
     */
    async loadTemplate() {
        try {
            const response = await fetch('../templates/permissions/role-permissions.html');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            this.containerElement.innerHTML = html;
        } catch (error) {
            console.error('Error loading role-permissions template:', error);
            throw error;
        }
    }

    /**
     * Khởi tạo các components con
     */
    initComponents() {
        // Khởi tạo component gán quyền cho vai trò
        this.rolePermissionsComponent = new RolePermissionsComponent(this.containerElement);
    }

    /**
     * Hủy container và giải phóng tài nguyên
     */
    destroy() {
        // Hủy các components con
        if (this.rolePermissionsComponent) {
            // Có thể thêm phương thức destroy nếu cần
        }
        
        // Xóa nội dung container
        this.containerElement.innerHTML = '';
        
        // Hủy các tham chiếu
        this.containerElement = null;
        this.rolePermissionsComponent = null;
    }
}