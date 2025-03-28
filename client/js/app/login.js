import { LoginContainer } from '../container/login-container.js';

document.addEventListener('DOMContentLoaded', async function() {
    // Khởi tạo và chạy container
    const loginContainer = new LoginContainer();
    loginContainer.init();
    
    // Thêm CSS cho notification
    addNotificationStyles();
});

function addNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .notification-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            padding: 15px 20px;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateY(-20px);
            opacity: 0;
            transition: all 0.3s ease-in-out;
        }
        
        .notification-toast.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .alert-success {
            background-color: #d4edda;
            color: #155724;
            border-color: #c3e6cb;
        }
        
        .alert-error, .alert-danger {
            background-color: #f8d7da;
            color: #721c24;
            border-color: #f5c6cb;
        }
        
        .alert-warning {
            background-color: #fff3cd;
            color: #856404;
            border-color: #ffeeba;
        }
        
        .alert-info {
            background-color: #d1ecf1;
            color: #0c5460;
            border-color: #bee5eb;
        }
    `;
    document.head.appendChild(style);
}
