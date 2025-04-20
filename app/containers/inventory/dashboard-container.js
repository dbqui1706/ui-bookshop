import { DashBoardComponent } from '../../components/inventory/DashBoardComponent.js';
import { showNotification } from '../../core/utils.js';

/**
 * Class OrderDetailContainer - Container điều phối cho phần chi tiết đơn hàng
 */
export class DashBoardContainer {
    /**
     * Khởi tạo container
     * @param {HTMLElement} containerElement - Element container chứa component
     */
    constructor(containerElement) {
        this.containerElement = containerElement;
        this.dashBoardConponent = null;

        // Khởi tạo container
        this.initialize();
    }

    /**
     * Khởi tạo container
     */
    initialize() {
        try {
            // Khởi tạo component chi tiết đơn hàng
            this.dashBoardConponent = new DashBoardComponent();
        } catch (error) {
            console.error('Error initializing OrderDetailContainer:', error);
            showNotification('Đã có lỗi xảy ra khi khởi tạo DashBoard Inventory', 'error');
        }
    }
}

