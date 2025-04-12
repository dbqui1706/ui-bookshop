import { PermissionComponent } from '../../components/permissions/PermissionComponent.js';
import { showNotification } from '../../core/utils.js';

/**
 * Class PermissionsContainer - Container điều phối cho phần quản lý quyền hạn
 */
export class PermissionsContainer {
    /**
     * Khởi tạo container
     * @param {HTMLElement} containerElement - Element container chứa tất cả các components
     */
    constructor(containerElement) {
        this.containerElement = containerElement;
        this.permissionComponent = null;
        
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
            console.error('Error initializing PermissionsContainer:', error);
            showNotification('error', 'Lỗi', 'Không thể khởi tạo trang quản lý quyền hạn.');
        }
    }

    /**
     * Tải template HTML
     */
    async loadTemplate() {
        try {
            const response = await fetch('../templates/permissions/permissions.html');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            this.containerElement.innerHTML = html;
        } catch (error) {
            console.error('Error loading permission template:', error);
            throw error;
        }
    }

    /**
     * Khởi tạo các components con
     */
    initComponents() {
        // Khởi tạo component quản lý quyền hạn
        this.permissionComponent = new PermissionComponent(this.containerElement);
    }

    /**
     * Hủy container và giải phóng tài nguyên
     */
    destroy() {
        // Hủy các components con
        if (this.permissionComponent) {
            // Có thể thêm phương thức destroy nếu cần
        }
        
        // Xóa nội dung container
        this.containerElement.innerHTML = '';
        
        // Hủy các tham chiếu
        this.containerElement = null;
        this.permissionComponent = null;
    }
}