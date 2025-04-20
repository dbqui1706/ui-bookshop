import {  ReportsComponent } from '../../components/inventory/ReportsComponent.js';
import { showNotification } from '../../core/utils.js';

/**
 * Class OrderDetailContainer - Container điều phối cho phần chi tiết đơn hàng
 */
export class ReportContainer {
    /**
     * Khởi tạo container
     * @param {HTMLElement} containerElement - Element container chứa component
     */
    constructor(containerElement) {
        this.containerElement = containerElement;
        this.reportComponent = null;

        // Khởi tạo container
        this.initialize();
    }

    /**
     * Khởi tạo container
     */
    initialize() {
        try {
            // Khởi tạo component chi tiết đơn hàng
            this.reportComponent = new ReportsComponent();
        } catch (error) {
            console.error('Error initializing OrderDetailContainer:', error);
            showNotification('Đã có lỗi xảy ra khi khởi tạo DashBoard Inventory', 'error');
        }
    }
}

