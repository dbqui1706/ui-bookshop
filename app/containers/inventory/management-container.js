import { ManagementComponent } from '../../components/inventory/ManagementComponent.js';
import { showNotification } from '../../core/utils.js';

/**
 * Class OrderDetailContainer - Container điều phối cho phần chi tiết đơn hàng
 */
export class ManagementContainer {
    /**
     * Khởi tạo container
     * @param {HTMLElement} containerElement - Element container chứa component
     */
    constructor(containerElement) {
        this.containerElement = containerElement;
        this.managementConponent = null;

        // Khởi tạo container
        this.initialize();
    }

    /**
     * Khởi tạo container
     */
    initialize() {
        try {
            // Khởi tạo component chi tiết đơn hàng
            this.managementConponent = new ManagementComponent();
        } catch (error) {
            console.error('Error initializing OrderDetailContainer:', error);
            showNotification(
                'error',
                'Lỗi',
                'Đã có lỗi xảy ra khi khởi tạo Management Inventory',
            );
        }
    }
}

