// assets/js/api/auth.js

import httpClient from './httpClient.js';
import { saveUser, saveToken, removeUser, removeToken } from '../utils/storage.js';

/**
 * API authentication module
 */
const authApi = {
    /**
     * Đăng nhập
     * @param {string} email - Email người dùng
     * @param {string} password - Mật khẩu
     * @returns {Promise} - Promise với kết quả đăng nhập
     */
    async login(email, password) {
        try {
            console.log('Attempting to login with:', email);
            
            const response = await httpClient.post('/auth/login', {
                email: email,
                password: password
            });
            
            console.log('Login successful, received data:', response);
            
            // Lưu thông tin người dùng và token
            saveUser(response.user);
            saveToken(response.token);
            
            return {
                success: true,
                data: response
            };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error.message || 'Đăng nhập thất bại'
            };
        }
    },
    
    /**
     * Đăng ký
     * @param {object} userData - Thông tin người dùng đăng ký
     * @returns {Promise} - Promise với kết quả đăng ký
     */
    async register(userData) {
        try {
            const response = await httpClient.post('/auth/register', userData);
            
            return {
                success: true,
                data: response
            };
        } catch (error) {
            console.error('Register error:', error);
            return {
                success: false,
                message: error.message || 'Đăng ký thất bại'
            };
        }
    },
    
    /**
     * Đăng xuất
     * @returns {Promise} - Promise với kết quả đăng xuất
     */
    async logout() {
        try {
            // Gọi API đăng xuất
            await httpClient.get('/auth/logout');
            
            // Xóa thông tin người dùng và token
            removeUser();
            removeToken();
            
            return {
                success: true
            };
        } catch (error) {
            console.error('Logout error:', error);
            
            // Xóa thông tin người dùng và token ngay cả khi API thất bại
            removeUser();
            removeToken();
            
            return {
                success: false,
                message: error.message || 'Đăng xuất thất bại'
            };
        }
    },
    
    /**
     * Đổi mật khẩu
     * @param {string} oldPassword - Mật khẩu cũ
     * @param {string} newPassword - Mật khẩu mới
     * @returns {Promise} - Promise với kết quả đổi mật khẩu
     */
    async changePassword(oldPassword, newPassword) {
        try {
            const response = await httpClient.post('/auth/change-password', {
                oldPassword: oldPassword,
                newPassword: newPassword
            });
            
            return {
                success: true,
                data: response
            };
        } catch (error) {
            console.error('Change password error:', error);
            return {
                success: false,
                message: error.message || 'Đổi mật khẩu thất bại'
            };
        }
    }
};

export default authApi;