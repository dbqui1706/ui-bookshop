import { RoleComponent } from '../../components/permissions/RoleComponent.js';
import { showNotification } from '../../core/utils.js';

/**
 * Class RolesContainer - Container điều phối cho phần quản lý vai trò
 */
export class RolesContainer {
    /**
     * Khởi tạo container
     * @param {HTMLElement} containerElement - Element container chứa tất cả các components
     */
    constructor(containerElement) {
        this.containerElement = containerElement;
        this.roleComponent = null;
        
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
            console.error('Error initializing RolesContainer:', error);
            showNotification('error', 'Lỗi', 'Không thể khởi tạo trang quản lý vai trò.');
        }
    }

    /**
     * Tải template HTML
     */
    async loadTemplate() {
        try {
            const templatePath = '../templates/permissions/roles.html';
            const response = await fetch(templatePath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            this.containerElement.innerHTML = html;
        } catch (error) {
            console.error('Error loading role template:', error);
            throw error;
        }
    }

    /**
     * Khởi tạo các components con
     */
    initComponents() {
        // Khởi tạo component quản lý vai trò
        this.roleComponent = new RoleComponent(this.containerElement);
    }

    /**
     * Hủy container và giải phóng tài nguyên
     */
    destroy() {
        // Hủy các components con
        if (this.roleComponent) {
            // Có thể thêm phương thức destroy nếu cần
        }
        
        // Xóa nội dung container
        this.containerElement.innerHTML = '';
        
        // Hủy các tham chiếu
        this.containerElement = null;
        this.roleComponent = null;
    }
}