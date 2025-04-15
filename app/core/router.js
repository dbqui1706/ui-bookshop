// app/core/router.js
export class Router {
    constructor(rootElement) {
        this.rootElement = rootElement;
        this.routes = new Map();
        this.currentRoute = null;
        
        // Xử lý sự kiện popstate (khi người dùng nhấn nút back/forward trên trình duyệt)
        window.addEventListener('popstate', (event) => {
            const route = event.state?.route || '/';
            this.navigate(route, false, event.state?.data);
        });
    }

    /**
     * Đăng ký một route
     * @param {string} path - Đường dẫn route
     * @param {Function} handler - Hàm xử lý khi route được kích hoạt
     */
    register(path, handler) {
        this.routes.set(path, handler);
        return this;
    }

    /**
     * Chuyển hướng đến một route
     * @param {string} path - Đường dẫn cần chuyển hướng đến
     * @param {boolean} pushState - Có thêm vào history hay không
     * @param {Object} data - Dữ liệu kèm theo
     */
    navigate(path, pushState = true, data = {}) {
        // Tìm handler cho route
        const handler = this.routes.get(path) || this.routes.get('*');
        
        if (!handler) {
            console.error(`Route not found: ${path}`);
            return;
        }
        
        // Cập nhật history nếu cần
        if (pushState) {
            window.history.pushState({ route: path, data }, '', path);
        }
        
        // Lưu route hiện tại
        this.currentRoute = path;
        
        // Gọi handler
        handler(data);
    }

    /**
     * Khởi tạo router với route mặc định
     * @param {string} defaultRoute - Route mặc định
     */
    init(defaultRoute = '/') {
        // Xử lý route ban đầu
        const path = window.location.pathname || defaultRoute;
        this.navigate(path, false);
    }
}

// Singleton pattern
let instance = null;

export default {
    getInstance: (rootElement) => {
        if (!instance) {
            instance = new Router(rootElement);
        }
        return instance;
    }
};