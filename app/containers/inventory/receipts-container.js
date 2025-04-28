import { ReciptsComponent } from '../../components/inventory/ReceiptsComponent.js';
import { showNotification } from '../../core/utils.js';

/**
 * Class OrderDetailContainer - Container điều phối cho phần chi tiết đơn hàng
 */
export class ReceiptsContainer {
    /**
     * Khởi tạo container
     * @param {HTMLElement} containerElement - Element container chứa component
     */
    constructor(containerElement) {
        this.containerElement = containerElement;
        this.receiptsConponent = null;

        // Khởi tạo container
        this.initialize();
    }

    /**
     * Khởi tạo container
     */
    initialize() {
        try {
            this.receiptsConponent = new ReciptsComponent();
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

