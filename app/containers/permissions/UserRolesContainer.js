import { UserRolesComponent } from '../../components/permissions/UserRolesComponent.js';
import { showNotification } from '../../core/utils.js';

/**
 * Class UserRolesContainer - Container điều phối cho phần gán vai trò cho người dùng
 */
export class UserRolesContainer {
    /**
     * Khởi tạo container
     * @param {HTMLElement} containerElement - Element container chứa tất cả các components
     */
    constructor(containerElement) {
        this.containerElement = containerElement;
        this.userRolesComponent = null;
        
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
            console.error('Error initializing UserRolesContainer:', error);
            showNotification('error', 'Lỗi', 'Không thể khởi tạo trang gán vai trò cho người dùng.');
        }
    }

    /**
     * Tải template HTML
     */
    async loadTemplate() {
        try {
            const response = await fetch('../templates/permissions/user-roles.html');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            this.containerElement.innerHTML = html;
        } catch (error) {
            console.error('Error loading user-roles template:', error);
            throw error;
        }
    }

    /**
     * Khởi tạo các components con
     */
    initComponents() {
        // Khởi tạo component gán vai trò cho người dùng
        this.userRolesComponent = new UserRolesComponent(this.containerElement);
    }

    /**
     * Hủy container và giải phóng tài nguyên
     */
    destroy() {
        // Hủy các components con
        if (this.userRolesComponent) {
            // Có thể thêm phương thức destroy nếu cần
        }
        
        // Xóa nội dung container
        this.containerElement.innerHTML = '';
        
        // Hủy các tham chiếu
        this.containerElement = null;
        this.userRolesComponent = null;
    }
}