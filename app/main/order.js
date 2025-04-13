import { EventBus } from "../core/eventBus.js";
import { OrderContainer } from "../containers/orders/OrderContainer.js";
import { showNotification } from "../core/utils.js";

/**
 * Class OrderApp - Quản lý toàn bộ ứng dụng quản lý đơn hàng
 */
export class OrderApp {
    /**
     * Khởi tạo ứng dụng
     */
    constructor() {
        // Container chính
        this.container = null;
        
        // Event Bus
        this.eventBus = EventBus.getInstance();
        
        // Khởi tạo ứng dụng
        this.initialize();
    }

    /**
     * Khởi tạo ứng dụng
     */
    async initialize() {
        try {
            // Lấy container chính
            this.container = document.getElementById('content');
            
            if (!this.container) {
                console.error('Container not found');
                return;
            }
            
            // Đăng ký các sự kiện chung
            this.registerCommonEvents();
            
            // Khởi tạo OrderContainer
            await this.initOrderContainer();
        } catch (error) {
            console.error('Error initializing app:', error);
            showNotification('error', 'Lỗi khởi tạo', 'Đã xảy ra lỗi khi khởi tạo ứng dụng. Vui lòng thử lại sau.');
        }
    }

    /**
     * Đăng ký các sự kiện chung
     */
    registerCommonEvents() {
        // Đăng ký sự kiện sidebar collapse
        const sidebarCollapseBtn = document.getElementById('sidebarCollapse');
        if (sidebarCollapseBtn) {
            sidebarCollapseBtn.addEventListener('click', () => {
                document.querySelector('#sidebar').classList.toggle('active');
                document.querySelector('#content').classList.toggle('active');
            });
        }
        
        // Đăng ký sự kiện cho các tooltips
        document.addEventListener('mouseover', (event) => {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });
        }, { once: true });
    }

    /**
     * Khởi tạo OrderContainer
     */
    async initOrderContainer() {
        try {
            // Tạo instance OrderContainer
            this.orderContainer = new OrderContainer(this.container);
        } catch (error) {
            console.error('Error initializing OrderContainer:', error);
            showNotification('error', 'Lỗi', 'Không thể khởi tạo trang quản lý đơn hàng.');
        }
    }
}

// Khởi tạo ứng dụng khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    const app = new OrderApp();
});