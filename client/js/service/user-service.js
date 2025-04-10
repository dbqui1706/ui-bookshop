import { STORAGE_KEYS } from "../constants/index.js";


const API_URL = {
    LOGIN: 'http://localhost:8080/api/auth/login',
    REGISTER: 'http://localhost:8080/api/auth/register',
    LOGOUT: 'http://localhost:8080/api/auth/logout',
    FORGOT_PASSWORD: 'http://localhost:8080/api/auth/forgot-password',
    GOOGLE_LOGIN: 'http://localhost:8080/api/auth/google',
    FACEBOOK_LOGIN: 'http://localhost:8080/api/auth/facebook'
}

export class UserService {
    /**
     * Đăng nhập
     * @param {*} formData : {email: string, password: string}
     * @returns 
     */
    async login(formData) {
        try {
            const response = await fetch(API_URL.LOGIN, {
                method: 'POST',
                credentials: 'include', // Quan trọng để nhận cookie
                body: formData
            });

            // Xử lý lỗi HTTP
            if (!response.ok) {
                const errorData = await response.json();
                return {
                    success: false,
                    message: errorData.message || 'Đăng nhập thất bại'
                };
            }

            const data = await response.json();
            console.log(data);
            return {
                success: true,
                ...data
            };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra khi đăng nhập'
            };
        }
    }

    /**
     * Đăng ký
     * @param {*} formData : {email: string, password: string, name: string, phone: string}
     * @returns 
     */
    async register(formData) {
        try {
            const response = await fetch(API_URL.REGISTER, {
                method: 'POST',
                body: formData
            });

            // Xử lý lỗi HTTP
            if (!response.ok) {
                const errorData = await response.json();
                return {
                    success: false,
                    message: errorData.message || 'Đăng ký thất bại'
                };
            }

            const data = await response.json();
            return {
                success: true,
                ...data
            };
        } catch (error) {
            console.error('Register error:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra khi đăng ký'
            };
        }
    }

    /**
     * Quên mật khẩu
     * @param {string} email Email của người dùng
     * @returns 
     */
    async forgotPassword(email) {
        try {
            const formData = new FormData();
            formData.append('email', email);

            const response = await fetch(API_URL.FORGOT_PASSWORD, {
                method: 'POST',
                body: formData
            });

            // Xử lý lỗi HTTP
            if (!response.ok) {
                const errorData = await response.json();
                return {
                    success: false,
                    message: errorData.message || 'Yêu cầu đặt lại mật khẩu thất bại'
                };
            }

            const data = await response.json();
            return {
                success: true,
                ...data
            };
        } catch (error) {
            console.error('Forgot password error:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra khi gửi yêu cầu'
            };
        }
    }

    /**
     * Đăng xuất
     * @returns 
     */
    async logout() {
        try {
            const response = await fetch(API_URL.LOGOUT, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                // Xóa thông tin đăng nhập khỏi localStorage
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }

            return {
                success: response.ok
            };
        } catch (error) {
            console.error('Logout error:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra khi đăng xuất'
            };
        }
    }

    /**
     * Đăng nhập bằng Google
     * @returns 
     */
    async googleLogin() {
        try {
            // Lưu ý: Thông thường, đăng nhập Google sẽ mở popup hoặc redirect
            // Ở đây chỉ mô phỏng đơn giản
            const response = await fetch(API_URL.GOOGLE_LOGIN, {
                method: 'POST'
            });

            // Xử lý lỗi HTTP
            if (!response.ok) {
                const errorData = await response.json();
                return {
                    success: false,
                    message: errorData.message || 'Đăng nhập bằng Google thất bại'
                };
            }

            const data = await response.json();
            return {
                success: true,
                ...data
            };
        } catch (error) {
            console.error('Google login error:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra khi đăng nhập bằng Google'
            };
        }
    }

    /**
     * Đăng nhập bằng Facebook
     * @returns 
     */
    async facebookLogin() {
        try {
            // Lưu ý: Thông thường, đăng nhập Facebook sẽ mở popup hoặc redirect
            // Ở đây chỉ mô phỏng đơn giản
            const response = await fetch(API_URL.FACEBOOK_LOGIN, {
                method: 'POST'
            });

            // Xử lý lỗi HTTP
            if (!response.ok) {
                const errorData = await response.json();
                return {
                    success: false,
                    message: errorData.message || 'Đăng nhập bằng Facebook thất bại'
                };
            }

            const data = await response.json();
            return {
                success: true,
                ...data
            };
        } catch (error) {
            console.error('Facebook login error:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra khi đăng nhập bằng Facebook'
            };
        }
    }
}
