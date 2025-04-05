import { SWAL_STYLE } from '../constants/login-contats.js';
import { UserService } from '../service/user-service.js';
import { CartService } from '../service/cart-service.js';
export class LoginContainer {
    constructor() {
        this.userService = new UserService();
        this.cartService = new CartService();

        // Các form
        this.loginForm = null;
        this.forgotPasswordForm = null;
        this.registerForm = null;

        // Các trường nhập liệu
        this.loginEmail = null;
        this.loginPassword = null;
        this.registerFullname = null;
        this.registerEmail = null;
        this.registerPhone = null;
        this.registerPassword = null;
        this.registerConfirmPassword = null;
        this.registerGender = null;
        this.forgotEmail = null;

        // Nút chuyển đổi
        this.showForgotPassword = null;
        this.showRegister = null;
        this.backToLoginFromForgot = null;
        this.backToLoginFromRegister = null;

        // Sidebar
        this.sidebarTitle = null;
        this.sidebarDescription = null;

        // Local storage
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.user = null;
    }

    init() {
        // Lấy các phần tử DOM
        this.initElements();

        // Gắn sự kiện
        this.bindEvents();

        // Gắn sự kiện cho các một hành động từ modal từ trang khác
        this.initModalEvents();
    }

    initModalEvents() {
        // Kiểm tra flag từ localStorage
        if (localStorage.getItem('showRegisterForm') === 'true') {
            // Xóa flag
            localStorage.removeItem('showRegisterForm');

            // Kích hoạt nút "Đăng ký ngay" có sẵn
            document.getElementById('show-register')?.click();
        }
    }
    initElements() {
        // Forms
        this.loginFormContainer = document.getElementById('login-form');
        this.forgotPasswordFormContainer = document.getElementById('forgot-password-form');
        this.registerFormContainer = document.getElementById('register-form');
        this.resetPasswordFormContainer = document.getElementById('reset-password-form');

        this.loginForm = document.getElementById('loginForm');
        this.forgotPasswordForm = document.getElementById('forgotPasswordForm');
        this.registerForm = document.getElementById('registerForm');
        this.resetPasswordForm = document.getElementById('resetPasswordForm');

        // Các trường nhập liệu
        this.loginEmail = document.getElementById('login-email');
        this.loginPassword = document.getElementById('login-password');
        this.registerFullname = document.getElementById('register-fullname');
        this.registerEmail = document.getElementById('register-email');
        this.registerPhone = document.getElementById('register-phone');
        this.registerPassword = document.getElementById('register-password');
        this.registerConfirmPassword = document.getElementById('register-confirm-password');
        this.forgotEmail = document.getElementById('forgot-email');
        this.resetPassword = document.getElementById('reset-password');
        this.resetConfirmPassword = document.getElementById('reset-confirm-password');
        this.registerGender = document.querySelector('input[name="gender"]:checked');

        // Nút chuyển đổi
        this.showForgotPassword = document.getElementById('show-forgot-password');
        this.showRegister = document.getElementById('show-register');
        this.backToLoginFromForgot = document.getElementById('back-to-login-from-forgot');
        this.backToLoginFromRegister = document.getElementById('back-to-login-from-register');
        this.showResetPassword = document.getElementById('show-reset-password');


        // Sidebar
        this.sidebarTitle = document.getElementById('sidebar-title');
        this.sidebarDescription = document.getElementById('sidebar-description');

        // Các nút toggle password
        this.togglePasswordButtons = document.querySelectorAll('.toggle-password');

        // Password strength
        this.passwordStrengthBar = document.querySelector('.password-strength .progress-bar');
        this.resetPasswordStrengthBar = document.querySelector('.reset-password-strength .progress-bar');

        // Social buttons
        this.googleLoginBtn = document.querySelector('.social-btn:nth-child(2)');
        this.facebookLoginBtn = document.querySelector('.social-btn:nth-child(1)');
    }

    bindEvents() {
        // Form submissions
        this.loginForm.addEventListener('submit', this.handleLogin.bind(this));
        this.registerForm.addEventListener('submit', this.handleRegister.bind(this));
        this.forgotPasswordForm.addEventListener('submit', this.handleForgotPassword.bind(this));
        this.resetPasswordForm.addEventListener('submit', this.handleResetPassword.bind(this));

        // Form switching
        this.showForgotPassword.addEventListener('click', this.switchToForgotPassword.bind(this));
        this.showRegister.addEventListener('click', this.switchToRegister.bind(this));
        this.backToLoginFromForgot.addEventListener('click', this.switchToLogin.bind(this));
        this.backToLoginFromRegister.addEventListener('click', this.switchToLogin.bind(this));

        // Toggle password visibility
        this.togglePasswordButtons.forEach(button => {
            button.addEventListener('click', this.togglePasswordVisibility.bind(this));
        });

        // Password strength meter
        if ((this.registerPassword && this.passwordStrengthBar)) {
            this.registerPassword.addEventListener('input', this.updatePasswordStrength.bind(this));
        }
        if (this.resetPassword && this.resetPasswordStrengthBar) {
            this.resetPassword.addEventListener('input', this.updateResetPasswordStrength.bind(this))
        }

        // Social login
        if (this.googleLoginBtn) {
            this.googleLoginBtn.addEventListener('click', this.handleGoogleLogin.bind(this));
        }

        if (this.facebookLoginBtn) {
            this.facebookLoginBtn.addEventListener('click', this.handleFacebookLogin.bind(this));
        }
    }

    // Form switching handlers
    switchToForgotPassword(e) {
        e.preventDefault();

        this.loginFormContainer.classList.add('d-none');
        this.forgotPasswordFormContainer.classList.remove('d-none');

        this.sidebarTitle.textContent = 'Lấy lại mật khẩu';
        this.sidebarDescription.textContent = 'Chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu qua email của bạn';

        this.fadeInForm(this.forgotPasswordFormContainer);
    }

    switchToRegister(e) {
        e.preventDefault();

        this.loginFormContainer.classList.add('d-none');
        this.registerFormContainer.classList.remove('d-none');

        this.sidebarTitle.textContent = 'Tham gia cùng chúng tôi';
        this.sidebarDescription.textContent = 'Tạo tài khoản để trải nghiệm mua sắm tuyệt vời';

        this.fadeInForm(this.registerFormContainer);
    }

    switchToLogin(e) {
        e.preventDefault();

        this.forgotPasswordFormContainer.classList.add('d-none');
        this.registerFormContainer.classList.add('d-none');
        this.loginFormContainer.classList.remove('d-none');

        this.sidebarTitle.textContent = 'Chào mừng trở lại';
        this.sidebarDescription.textContent = 'Khám phá thế giới sách cùng BookStore';

        this.fadeInForm(this.loginFormContainer);
    }

    // Hiệu ứng fade in cho form
    fadeInForm(form) {
        form.style.opacity = 0;
        form.style.transition = 'opacity 0.3s ease-in-out';
        setTimeout(() => {
            form.style.opacity = 1;
        }, 10);
    }

    // Toggle password visibility
    togglePasswordVisibility(e) {
        const button = e.currentTarget;
        const passwordInput = button.previousElementSibling;
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // Thay đổi icon
        const icon = button.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    }

    // Password strength
    updatePasswordStrength() {
        const password = this.registerPassword.value;
        const strength = this.calculatePasswordStrength(password);

        // Cập nhật progress bar 
        this.passwordStrengthBar.style.width = strength + '%';


        // Đổi màu dựa trên độ mạnh
        if (strength < 30) {
            this.passwordStrengthBar.className = 'progress-bar bg-danger';
        } else if (strength < 60) {
            this.passwordStrengthBar.className = 'progress-bar bg-warning';
        } else {
            this.passwordStrengthBar.className = 'progress-bar bg-success';
        }
    }

    updateResetPasswordStrength() {
        const password = this.resetPassword.value;
        const strength = this.calculatePasswordStrength(password);

        // Cập nhật progress bar 
        this.resetPasswordStrengthBar.style.width = strength + '%';

        // Đổi màu dựa trên độ mạnh
        if (strength < 30) {
            this.resetPasswordStrengthBar.className = 'progress-bar bg-danger';
        } else if (strength < 60) {
            this.resetPasswordStrengthBar.className = 'progress-bar bg-warning';
        } else {
            this.resetPasswordStrengthBar.className = 'progress-bar bg-success';
        }
    }

    calculatePasswordStrength(password) {
        let strength = 0;

        // Tiêu chí: độ dài
        if (password.length > 6) strength += 20;
        if (password.length > 10) strength += 10;

        // Tiêu chí: có số
        if (/\d/.test(password)) strength += 20;

        // Tiêu chí: có chữ thường
        if (/[a-z]/.test(password)) strength += 20;

        // Tiêu chí: có chữ hoa
        if (/[A-Z]/.test(password)) strength += 20;

        // Tiêu chí: có ký tự đặc biệt
        if (/[^a-zA-Z0-9]/.test(password)) strength += 20;

        return Math.min(100, strength);
    }

    // Form submission handlers
    async handleLogin(e) {
        e.preventDefault();

        try {
            // Validate form
            if (!this.validateLoginForm()) {
                return;
            }
            const formData = new FormData();
            formData.append('email', this.loginEmail.value);
            formData.append('password', CryptoJS.MD5(this.loginPassword.value).toString().toUpperCase());

            const response = await this.userService.login(formData);

            if (response.success) {
                // Lưu thông tin người dùng
                localStorage.setItem('user', JSON.stringify(response.user));
                localStorage.setItem('token', response.token);

                this.user = response.user;

                // Xem giỏ hàng có sản phẩm không
                // nếu có thì call api save cart
                if (this.cart.length > 0) {
                    this.saveCart();
                }
                
                // Chuyển hướng
                window.location.href = '/client/index.html';
            } else {
                this.showNotification(response.message || 'Đăng nhập thất bại', 'error');
            }
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            this.showNotification('Có lỗi xảy ra khi đăng nhập', 'error');
        }
    }

    // Lưu giỏ hàng vào database
    async saveCart() {
        const response = await this.cartService.saveCart(
            this.user.id,
            this.cart
        );
        if (!response.success) {
            this.showNotification(response.message || 'Lưu giỏ hàng thất bại', 'error');
        }
    }

    async handleRegister(e) {
        e.preventDefault();

        try {
            // Validate form
            if (!this.validateRegisterForm()) {
                return;
            }

            const formData = new FormData();
            formData.append('fullname', this.registerFullname.value);
            formData.append('email', this.registerEmail.value);
            formData.append('phone', this.registerPhone.value);
            formData.append('password', CryptoJS.MD5(this.registerPassword.value).toString().toUpperCase());
            formData.append('gender', parseInt(this.registerGender.value));

            const response = await this.userService.register(formData);

            if (response.success) {
                this.showNotification('Đăng ký thành công! Vui lòng đăng nhập.', 'success');

                // Hiển thị thông báo đã gửi một email xác thực bằng sweetalert2
                Swal.fire({
                    icon: 'success',
                    title: 'Gửi email thành công!',
                    html: '<div class="swal-email-msg">Một email xác thực đã được gửi tới <strong>' + this.registerEmail.value + '</strong></div>' +
                        '<div class="swal-email-tip">Vui lòng kiểm tra hộp thư đến và thư rác</div>',
                    timer: 5000,
                    timerProgressBar: true,
                    showConfirmButton: true,
                    confirmButtonText: 'Đã hiểu',
                    confirmButtonColor: '#4caf50',
                    backdrop: `rgba(0,0,0,0.4)`,
                    allowOutsideClick: false,
                    showClass: {
                        popup: 'animate__animated animate__fadeInDown'
                    },
                    hideClass: {
                        popup: 'animate__animated animate__fadeOutUp'
                    }
                }).then(() => {
                    this.switchToLogin({ preventDefault: () => { } });
                });
            } else {
                this.showNotification(response.message || 'Đăng ký thất bại', 'error');
            }
        } catch (error) {
            console.error('Lỗi đăng ký:', error);
            this.showNotification('Có lỗi xảy ra khi đăng ký', 'error');
        }
    }

    async handleForgotPassword(e) {
        e.preventDefault();

        try {
            // Validate form
            if (!this.validateForgotPasswordForm()) {
                return;
            }

            const email = this.forgotEmail.value;

            // Gọi API quên mật khẩu (cần bổ sung vào UserService)
            // const response = await this.userService.forgotPassword(email);

            // Giả lập response thành công
            const response = { success: true };

            if (response.success) {
                this.showNotification('Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn!', 'success');

                // Xóa form
                this.forgotPasswordForm.reset();

                // Chuyển về form đăng nhập
                setTimeout(() => {
                    this.switchToLogin({ preventDefault: () => { } });
                }, 2000);
            } else {
                this.showNotification(response.message || 'Yêu cầu đặt lại mật khẩu thất bại', 'error');
            }
        } catch (error) {
            console.error('Lỗi quên mật khẩu:', error);
            this.showNotification('Có lỗi xảy ra khi gửi yêu cầu', 'error');
        }
    }

    async handleResetPassword(e) {
        e.preventDefault();

        try {
            // Validate form
            if (!this.validateResetPasswordForm()) {
                return;
            }

            const formData = new FormData();
            formData.append('email', this.forgotEmail.value);
            formData.append('password', CryptoJS.MD5(this.registerPassword.value).toString().toUpperCase());
            formData.append('confirmPassword', CryptoJS.MD5(this.registerConfirmPassword.value).toString().toUpperCase());

            const response = await this.userService.resetPassword(formData);
        } catch (error) {
            console.error('Lỗi đặt lại mật khẩu:', error);
            this.showNotification('Có lỗi xảy ra khi đặt lại mật khẩu', 'error');
        }
    }

    async handleGoogleLogin() {
        try {
            const response = await this.userService.googleLogin();

            if (response.success) {
                localStorage.setItem('user', JSON.stringify(response.user));
                localStorage.setItem('token', response.token);

                this.showNotification('Đăng nhập bằng Google thành công!', 'success');

                setTimeout(() => {
                    window.location.href = '/client/index.html';
                }, 1500);
            } else {
                this.showNotification(response.message || 'Đăng nhập bằng Google thất bại', 'error');
            }
        } catch (error) {
            console.error('Lỗi đăng nhập Google:', error);
            this.showNotification('Có lỗi xảy ra khi đăng nhập bằng Google', 'error');
        }
    }

    async handleFacebookLogin() {
        try {
            const response = await this.userService.facebookLogin();

            if (response.success) {
                localStorage.setItem('user', JSON.stringify(response.user));
                localStorage.setItem('token', response.token);

                this.showNotification('Đăng nhập bằng Facebook thành công!', 'success');

                setTimeout(() => {
                    window.location.href = '/client/index.html';
                }, 1500);
            } else {
                this.showNotification(response.message || 'Đăng nhập bằng Facebook thất bại', 'error');
            }
        } catch (error) {
            console.error('Lỗi đăng nhập Facebook:', error);
            this.showNotification('Có lỗi xảy ra khi đăng nhập bằng Facebook', 'error');
        }
    }

    // Form validation
    validateLoginForm() {
        let isValid = true;

        // Kiểm tra email
        if (!this.loginEmail.value.trim()) {
            this.showInputError(this.loginEmail, 'Vui lòng nhập email hoặc số điện thoại');
            isValid = false;
        } else {
            this.clearInputError(this.loginEmail);
        }

        // Kiểm tra mật khẩu
        if (!this.loginPassword.value) {
            this.showInputError(this.loginPassword, 'Vui lòng nhập mật khẩu');
            isValid = false;
        } else {
            this.clearInputError(this.loginPassword);
        }

        return isValid;
    }

    validateRegisterForm() {
        let isValid = true;

        // Kiểm tra họ tên
        if (!this.registerFullname.value.trim()) {
            this.showInputError(this.registerFullname, 'Vui lòng nhập họ và tên');
            isValid = false;
        } else {
            this.clearInputError(this.registerFullname);
        }

        // Kiểm tra email
        if (!this.registerEmail.value.trim()) {
            this.showInputError(this.registerEmail, 'Vui lòng nhập email');
            isValid = false;
        } else if (!this.isValidEmail(this.registerEmail.value)) {
            this.showInputError(this.registerEmail, 'Email không hợp lệ');
            isValid = false;
        } else {
            this.clearInputError(this.registerEmail);
        }

        // Kiểm tra số điện thoại
        if (!this.registerPhone.value.trim()) {
            this.showInputError(this.registerPhone, 'Vui lòng nhập số điện thoại');
            isValid = false;
        } else if (!this.isValidPhone(this.registerPhone.value)) {
            this.showInputError(this.registerPhone, 'Số điện thoại không hợp lệ');
            isValid = false;
        } else {
            this.clearInputError(this.registerPhone);
        }

        // Kiểm tra mật khẩu
        if (!this.registerPassword.value) {
            this.showInputError(this.registerPassword, 'Vui lòng nhập mật khẩu');
            isValid = false;
        } else if (this.registerPassword.value.length < 8) {
            this.showInputError(this.registerPassword, 'Mật khẩu phải có ít nhất 8 ký tự');
            isValid = false;
        } else {
            this.clearInputError(this.registerPassword);
        }

        // Kiểm tra xác nhận mật khẩu
        if (!this.registerConfirmPassword.value) {
            this.showInputError(this.registerConfirmPassword, 'Vui lòng xác nhận mật khẩu');
            isValid = false;
        } else if (this.registerConfirmPassword.value !== this.registerPassword.value) {
            this.showInputError(this.registerConfirmPassword, 'Mật khẩu xác nhận không khớp');
            isValid = false;
        } else {
            this.clearInputError(this.registerConfirmPassword);
        }

        // Kiểm tra đồng ý điều khoản
        const agreeTerms = document.getElementById('agreeTerms');
        if (!agreeTerms.checked) {
            this.showNotification('Vui lòng đồng ý với Điều khoản sử dụng và Chính sách bảo mật', 'warning');
            isValid = false;
        }

        return isValid;
    }

    validateForgotPasswordForm() {
        let isValid = true;

        // Kiểm tra email
        if (!this.forgotEmail.value.trim()) {
            this.showInputError(this.forgotEmail, 'Vui lòng nhập email');
            isValid = false;
        } else if (!this.isValidEmail(this.forgotEmail.value)) {
            this.showInputError(this.forgotEmail, 'Email không hợp lệ');
            isValid = false;
        } else {
            this.clearInputError(this.forgotEmail);
        }

        return isValid;
    }

    // Helper methods
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    isValidPhone(phone) {
        return /^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(phone);
    }

    showInputError(input, message) {
        const formGroup = input.closest('.mb-3');
        const errorElement = formGroup.querySelector('.invalid-feedback') || document.createElement('div');

        if (!formGroup.querySelector('.invalid-feedback')) {
            errorElement.className = 'invalid-feedback';
            formGroup.appendChild(errorElement);
        }

        errorElement.textContent = message;
        input.classList.add('is-invalid');
    }

    clearInputError(input) {
        input.classList.remove('is-invalid');
        const formGroup = input.closest('.mb-3');
        const errorElement = formGroup.querySelector('.invalid-feedback');

        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    showNotification(message, type = 'info') {
        // Tạo thông báo
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} notification-toast`;
        notification.innerHTML = `<div>${message}</div>`;

        // Thêm vào body
        document.body.appendChild(notification);

        // Hiển thị với hiệu ứng
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Tự động ẩn sau 3 giây
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}