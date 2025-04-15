import { OrderDetailComponent } from '../../components/orders/OrderDetailComponent.js';
import { showNotification } from '../../core/utils.js';

/**
 * Class OrderDetailContainer - Container điều phối cho phần chi tiết đơn hàng
 */
export class OrderDetailContainer {
    /**
     * Khởi tạo container
     * @param {HTMLElement} containerElement - Element container chứa component
     */
    constructor(containerElement) {
        this.containerElement = containerElement;
        this.orderDetailComponent = null;

        // Khởi tạo container
        this.initialize();
    }

    /**
     * Khởi tạo container
     */
    initialize() {
        try {
            // Khởi tạo component chi tiết đơn hàng
            this.orderDetailComponent = new OrderDetailComponent(this.containerElement);
        } catch (error) {
            console.error('Error initializing OrderDetailContainer:', error);
            showNotification('Đã xảy ra lỗi khi khởi tạo trang chi tiết đơn hàng', 'error');
        }
    }
}

