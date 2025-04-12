/**
 * Class EventBus - Quản lý các sự kiện trong ứng dụng
 * Sử dụng mẫu thiết kế Observer Pattern
 */
class EventBusClass {
    constructor() {
        this.subscribers = {};
    }

    /**
     * Đăng ký một hàm callback cho một sự kiện
     * @param {string} event - Tên sự kiện
     * @param {Function} callback - Hàm callback sẽ được gọi khi sự kiện xảy ra
     * @returns {Function} - Hàm để hủy đăng ký
     */
    subscribe(event, callback) {
        if (!this.subscribers[event]) {
            this.subscribers[event] = [];
        }
        this.subscribers[event].push(callback);

        // Trả về hàm để hủy đăng ký
        return () => {
            this.unsubscribe(event, callback);
        };
    }

    /**
     * Hủy đăng ký một hàm callback cho một sự kiện
     * @param {string} event - Tên sự kiện
     * @param {Function} callback - Hàm callback cần hủy
     */
    unsubscribe(event, callback) {
        if (this.subscribers[event]) {
            this.subscribers[event] = this.subscribers[event].filter(
                subscriber => subscriber !== callback
            );
        }
    }

    /**
     * Phát sự kiện với dữ liệu tùy chọn
     * @param {string} event - Tên sự kiện
     * @param {*} data - Dữ liệu kèm theo sự kiện
     */
    emit(event, data) {
        if (this.subscribers[event]) {
            this.subscribers[event].forEach(callback => {
                callback(data);
            });
        }
    }
}

// Singleton pattern
let instance = null;

export const EventBus = {
    getInstance: () => {
        if (!instance) {
            instance = new EventBusClass();
        }
        return instance;
    }
};