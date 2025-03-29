// Tạo file login-modal.js
export class LoginModal {
    constructor() {
        this.modalId = 'loginNotificationModal';
        this.modalElement = null;
        this.initialized = false;
    }

    // Tạo HTML của modal với thiết kế split (hình ảnh + form)
    createModalHTML() {
        return `
        <div class="modal fade" id="${this.modalId}" tabindex="-1" aria-labelledby="${this.modalId}Label" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content" style="border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);">
                    <button type="button" class="btn-close position-absolute top-0 end-0 m-3 bg-white rounded-circle" data-bs-dismiss="modal" aria-label="Close" style="z-index: 1050;"></button>
                    
                    <div class="row g-0">
                        <!-- Phần hình ảnh bên trái - tương tự như login-image trong trang của bạn -->
                        <div class="col-md-5 d-none d-md-block">
                            <div class="login-image" style="background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%); height: 100%; position: relative; display: flex; align-items: center; justify-content: center; color: #fff; text-align: center; padding: 30px;">
                                <div class="overlay" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.3); z-index: 1;"></div>
                                <div class="login-image-content" style="position: relative; z-index: 2;">
                                    <h3 style="font-weight: 700; margin-bottom: 20px; font-size: 1.8rem;">Chào mừng trở lại</h3>
                                    <p style="opacity: 0.9; font-size: 1rem;">Khám phá thế giới sách cùng BookStore</p>
                                </div>
                            </div>
                        </div>

                        <!-- Phần form bên phải -->
                        <div class="col-md-7">
                            <div class="modal-body p-4 p-md-5">
                                <div class="text-center mb-4">
                                    <h2 class="login-title" style="font-weight: 700; color: #333; margin-bottom: 10px;">Vui lòng đăng nhập</h2>
                                    <p class="login-subtitle" style="color: #6c757d;">Đăng nhập để tiếp tục mua sắm</p>
                                </div>

                                <div class="text-center mb-4">
                                    <i class="fas fa-user-circle fa-3x" style="color: #2575fc; margin-bottom: 15px;"></i>
                                    <p style="color: #6c757d;">Bạn cần đăng nhập để tiếp tục thanh toán</p>
                                </div>

                                <div class="d-grid gap-2 mb-4">
                                    <button class="btn btn-primary btn-login" style="padding: 12px 20px; font-weight: 600; background-color: #2575fc; border-color: #2575fc; transition: all 0.3s;" id="modalLoginButton">
                                        <i class="fas fa-sign-in-alt me-2"></i>Đăng nhập
                                    </button>
                                    <button class="btn btn-outline-primary btn-register" style="padding: 12px 20px; font-weight: 600; color: #2575fc; border-color: #2575fc;" id="modalRegisterButton">
                                        <i class="fas fa-user-plus me-2"></i>Đăng ký tài khoản mới
                                    </button>
                                </div>

                                <!-- Đăng nhập bằng mạng xã hội -->
                                <div class="social-login">
                                    <p class="text-center mb-3" style="color: #6c757d; font-size: 14px;">Hoặc đăng nhập với</p>
                                    <div class="d-flex justify-content-center gap-3 mb-3">
                                        <button class="social-btn btn btn-outline-primary" style="width: 45px; height: 45px; padding: 0; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.3s;" title="Đăng nhập bằng Facebook">
                                            <i class="fab fa-facebook-f"></i>
                                        </button>
                                        <button class="social-btn btn btn-outline-danger" style="width: 45px; height: 45px; padding: 0; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.3s;" title="Đăng nhập bằng Google">
                                            <i class="fab fa-google"></i>
                                        </button>
                                        <button class="social-btn btn btn-outline-dark" style="width: 45px; height: 45px; padding: 0; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.3s;" title="Đăng nhập bằng Apple">
                                            <i class="fab fa-apple"></i>
                                        </button>
                                    </div>
                                </div>

                                <div class="text-center mt-4">
                                    <button type="button" class="btn btn-link text-secondary" style="text-decoration: none; font-size: 14px;" data-bs-dismiss="modal">
                                        Quay lại giỏ hàng
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    // Tạo CSS cho modal
    createModalCSS() {
        const style = document.createElement('style');
        style.textContent = `
        /* Hover effects */
        .btn-login:hover {
            background-color: #1a68e5 !important;
            border-color: #1a68e5 !important;
            transform: translateY(-2px);
        }
        
        .btn-register:hover {
            background-color:rgb(238, 244, 255) !important;
            border-color: #1a68e5 !important;
            transform: translateY(-2px);
        }

        .social-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
        }
        
        /* Animation cho modal */
        .modal.fade .modal-dialog {
            transition: transform 0.3s ease-out;
        }
        
        /* Hiệu ứng khi modal xuất hiện */
        .modal.show .modal-dialog {
            animation: fadeIn 0.3s ease-in;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Đảm bảo modal có chiều cao phù hợp */
        #${this.modalId} .modal-content {
            min-height: 450px;
        }

        /* Responsive cho modal */
        @media (max-width: 768px) {
            #${this.modalId} .modal-body {
                padding: 30px 20px;
            }
        }
        `;
        return style;
    }

    // Khởi tạo modal
    init() {
        if (this.initialized) return;

        // Tạo và chèn HTML vào DOM nếu chưa tồn tại
        if (!document.getElementById(this.modalId)) {
            document.body.insertAdjacentHTML('beforeend', this.createModalHTML());
            document.head.appendChild(this.createModalCSS());
        }

        this.modalElement = document.getElementById(this.modalId);
        this.setupEventListeners();
        this.initialized = true;
    }

    // Thiết lập các event listener
    setupEventListeners() {
        // Nút đăng nhập trong modal
        document.getElementById('modalLoginButton').addEventListener('click', () => {
            this.hide();
            this.handleLogin();
        });

        // Nút đăng ký trong modal
        document.getElementById('modalRegisterButton')?.addEventListener('click', () => {
            this.hide();
            this.handleRegister();
        });
    }

    // Xử lý khi người dùng nhấn đăng nhập
    handleLogin() {
        // Chuyển hướng đến trang login
        window.location.href = '/client/login.html';
    }

    // Xử lý khi người dùng nhấn đăng ký
    handleRegister() {
        // Đặt một flag trong localStorage để cho biết muốn hiển thị form đăng ký
        localStorage.setItem('showRegisterForm', 'true');
        // Chuyển hướng đến trang login
        window.location.href = '/client/login.html';
    }

    // Phương thức tiện ích để hiển thị một form và ẩn các form khác
    showFormAndHideOthers(formId) {
        const forms = ['login-form', 'register-form', 'forgot-password-form', 'reset-password-form'];

        forms.forEach(id => {
            const formElement = document.getElementById(id);
            if (formElement) {
                if (id === formId) {
                    formElement.classList.remove('d-none');
                } else {
                    formElement.classList.add('d-none');
                }
            }
        });
    }

    // Cuộn đến form được hiển thị
    scrollToForm(formId) {
        const formElement = document.getElementById(formId);
        if (formElement) {
            // Thêm một chút thời gian trễ để đảm bảo DOM đã được cập nhật
            setTimeout(() => {
                formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }

    // Hiển thị modal
    show() {
        this.init(); // Đảm bảo đã khởi tạo
        const bootstrapModal = new bootstrap.Modal(this.modalElement);
        bootstrapModal.show();
    }

    // Ẩn modal
    hide() {
        const bootstrapModal = bootstrap.Modal.getInstance(this.modalElement);
        if (bootstrapModal) {
            bootstrapModal.hide();
        }
    }
}

// Tạo một instance mặc định để xuất khẩu
const loginModal = new LoginModal();
export default loginModal;