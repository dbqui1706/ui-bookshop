

import { STORAGE_KEYS } from '../constants/index.js';

const API_URL = {
    GET_USER_INFO: '/api/user/profile',
    UPDATE_USER_INFO: '/api/user/profile',
    UPDATE_PASSWORD: '/api/user/password',
    UPDATE_PHONE: '/api/user/phone',
    UPDATE_EMAIL: '/api/user/email',
    SETUP_PIN: '/api/user/pin',
};

export class UserProfileService {
    /**
     * Lấy thông tin hồ sơ người dùng
     * @returns {Object} Kết quả và dữ liệu hồ sơ
     */
    async getUserProfile() {
        try {
            const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

            if (!token) {
                return {
                    success: false,
                    message: 'Bạn chưa đăng nhập'
                };
            }

            const response = await fetch(API_URL.GET_USER_INFO, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // Xử lý lỗi HTTP
            if (!response.ok) {
                if (response.status === 401) {
                    // Token hết hạn hoặc không hợp lệ
                    localStorage.removeItem(STORAGE_KEYS.TOKEN);
                    localStorage.removeItem(STORAGE_KEYS.USER);

                    return {
                        success: false,
                        message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
                        unauthorized: true
                    };
                }

                const errorData = await response.json();
                return {
                    success: false,
                    message: errorData.message || 'Không thể tải thông tin hồ sơ'
                };
            }

            const data = await response.json();

            // Lưu thông tin người dùng mới
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));

            return {
                success: true,
                user: data.user
            };
        } catch (error) {
            console.error('Lỗi khi lấy thông tin hồ sơ:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra khi tải thông tin hồ sơ'
            };
        }
    }

    /**
     * Cập nhật thông tin hồ sơ người dùng
     * @param {Object} userData Dữ liệu cập nhật
     * @returns {Object} Kết quả cập nhật
     */
    async updateUserProfile(userData) {
        try {
            const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

            if (!token) {
                return {
                    success: false,
                    message: 'Bạn chưa đăng nhập'
                };
            }

            const response = await fetch(API_URL.UPDATE_USER_INFO, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            // Xử lý lỗi HTTP
            if (!response.ok) {
                if (response.status === 401) {
                    // Token hết hạn hoặc không hợp lệ
                    localStorage.removeItem(STORAGE_KEYS.TOKEN);
                    localStorage.removeItem(STORAGE_KEYS.USER);

                    return {
                        success: false,
                        message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
                        unauthorized: true
                    };
                }

                const errorData = await response.json();
                return {
                    success: false,
                    message: errorData.message || 'Không thể cập nhật thông tin hồ sơ',
                    errors: errorData.errors
                };
            }

            const data = await response.json();

            // Cập nhật thông tin người dùng trong local storage
            const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');
            const updatedUser = { ...currentUser, ...userData };
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));

            return {
                success: true,
                user: data.user || updatedUser,
                message: data.message || 'Cập nhật thông tin thành công'
            };
        } catch (error) {
            console.error('Lỗi khi cập nhật hồ sơ:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra khi cập nhật thông tin hồ sơ'
            };
        }
    }

    /**
     * Cập nhật mật khẩu
     * @param {Object} passwordData Dữ liệu mật khẩu {currentPassword, newPassword, confirmPassword}
     * @returns {Object} Kết quả cập nhật
     */
    async updatePassword(passwordData) {
        try {
            const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

            if (!token) {
                return {
                    success: false,
                    message: 'Bạn chưa đăng nhập'
                };
            }

            const response = await fetch(API_URL.UPDATE_PASSWORD, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(passwordData)
            });

            // Xử lý lỗi HTTP
            if (!response.ok) {
                if (response.status === 401) {
                    // Token hết hạn hoặc không hợp lệ
                    localStorage.removeItem(STORAGE_KEYS.TOKEN);
                    localStorage.removeItem(STORAGE_KEYS.USER);

                    return {
                        success: false,
                        message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
                        unauthorized: true
                    };
                }

                const errorData = await response.json();
                return {
                    success: false,
                    message: errorData.message || 'Không thể cập nhật mật khẩu',
                    errors: errorData.errors
                };
            }

            const data = await response.json();

            return {
                success: true,
                message: data.message || 'Cập nhật mật khẩu thành công'
            };
        } catch (error) {
            console.error('Lỗi khi cập nhật mật khẩu:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra khi cập nhật mật khẩu'
            };
        }
    }

    /**
     * Cập nhật số điện thoại
     * @param {string} phone Số điện thoại mới
     * @returns {Object} Kết quả cập nhật
     */
    async updatePhone(phone) {
        try {
            const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

            if (!token) {
                return {
                    success: false,
                    message: 'Bạn chưa đăng nhập'
                };
            }

            const response = await fetch(API_URL.UPDATE_PHONE, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ phone })
            });

            // Xử lý lỗi HTTP
            if (!response.ok) {
                if (response.status === 401) {
                    // Token hết hạn hoặc không hợp lệ
                    localStorage.removeItem(STORAGE_KEYS.TOKEN);
                    localStorage.removeItem(STORAGE_KEYS.USER);

                    return {
                        success: false,
                        message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
                        unauthorized: true
                    };
                }

                const errorData = await response.json();
                return {
                    success: false,
                    message: errorData.message || 'Không thể cập nhật số điện thoại'
                };
            }

            const data = await response.json();

            // Cập nhật thông tin người dùng trong local storage
            const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');
            const updatedUser = { ...currentUser, phone };
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));

            return {
                success: true,
                message: data.message || 'Cập nhật số điện thoại thành công'
            };
        } catch (error) {
            console.error('Lỗi khi cập nhật số điện thoại:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra khi cập nhật số điện thoại'
            };
        }
    }

    /**
     * Cập nhật email
     * @param {string} email Email mới
     * @returns {Object} Kết quả cập nhật
     */
    async updateEmail(email) {
        try {
            const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

            if (!token) {
                return {
                    success: false,
                    message: 'Bạn chưa đăng nhập'
                };
            }

            const response = await fetch(API_URL.UPDATE_EMAIL, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            // Xử lý lỗi HTTP
            if (!response.ok) {
                if (response.status === 401) {
                    // Token hết hạn hoặc không hợp lệ
                    localStorage.removeItem(STORAGE_KEYS.TOKEN);
                    localStorage.removeItem(STORAGE_KEYS.USER);

                    return {
                        success: false,
                        message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
                        unauthorized: true
                    };
                }

                const errorData = await response.json();
                return {
                    success: false,
                    message: errorData.message || 'Không thể cập nhật email'
                };
            }

            const data = await response.json();

            // Cập nhật thông tin người dùng trong local storage
            const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');
            const updatedUser = { ...currentUser, email };
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));

            return {
                success: true,
                message: data.message || 'Cập nhật email thành công'
            };
        } catch (error) {
            console.error('Lỗi khi cập nhật email:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra khi cập nhật email'
            };
        }
    }

    /**
     * Thiết lập mã PIN
     * @param {Object} pinData Dữ liệu PIN {pin, confirmPin}
     * @returns {Object} Kết quả thiết lập
     */
    async setupPIN(pinData) {
        try {
            const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

            if (!token) {
                return {
                    success: false,
                    message: 'Bạn chưa đăng nhập'
                };
            }

            const response = await fetch(API_URL.SETUP_PIN, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pinData)
            });

            // Xử lý lỗi HTTP
            if (!response.ok) {
                if (response.status === 401) {
                    // Token hết hạn hoặc không hợp lệ
                    localStorage.removeItem(STORAGE_KEYS.TOKEN);
                    localStorage.removeItem(STORAGE_KEYS.USER);

                    return {
                        success: false,
                        message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
                        unauthorized: true
                    };
                }

                const errorData = await response.json();
                return {
                    success: false,
                    message: errorData.message || 'Không thể thiết lập mã PIN',
                    errors: errorData.errors
                };
            }

            const data = await response.json();

            // Cập nhật trạng thái PIN trong local storage
            const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');
            const updatedUser = { ...currentUser, hasPin: true };
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));

            return {
                success: true,
                message: data.message || 'Thiết lập mã PIN thành công'
            };
        } catch (error) {
            console.error('Lỗi khi thiết lập PIN:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra khi thiết lập mã PIN'
            };
        }
    }

    /**
     * Yêu cầu xóa tài khoản
     * @returns {Object} Kết quả yêu cầu
     */
    async requestDeleteAccount() {
        try {
            const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

            if (!token) {
                return {
                    success: false,
                    message: 'Bạn chưa đăng nhập'
                };
            }

            const response = await fetch(API_URL.DELETE_ACCOUNT, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // Xử lý lỗi HTTP
            if (!response.ok) {
                if (response.status === 401) {
                    // Token hết hạn hoặc không hợp lệ
                    localStorage.removeItem(STORAGE_KEYS.TOKEN);
                    localStorage.removeItem(STORAGE_KEYS.USER);

                    return {
                        success: false,
                        message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
                        unauthorized: true
                    };
                }

                const errorData = await response.json();
                return {
                    success: false,
                    message: errorData.message || 'Không thể yêu cầu xóa tài khoản'
                };
            }

            const data = await response.json();

            return {
                success: true,
                message: data.message || 'Yêu cầu xóa tài khoản đã được gửi. Vui lòng kiểm tra email để xác nhận.'
            };
        } catch (error) {
            console.error('Lỗi khi yêu cầu xóa tài khoản:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra khi yêu cầu xóa tài khoản'
            };
        }
    }

    /**
     * Liên kết tài khoản mạng xã hội
     * @param {string} provider Nhà cung cấp ('facebook', 'google')
     * @returns {Object} Kết quả liên kết
     */
    async linkSocialAccount(provider) {
        try {
            const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

            if (!token) {
                return {
                    success: false,
                    message: 'Bạn chưa đăng nhập'
                };
            }

            // URL liên kết tùy thuộc vào nhà cung cấp
            const linkUrl = provider === 'facebook' ?
                API_URL.FACEBOOK_LOGIN :
                API_URL.GOOGLE_LOGIN;

            // Tạo popup để liên kết
            const width = 600;
            const height = 600;
            const left = window.screenX + (window.outerWidth - width) / 2;
            const top = window.screenY + (window.outerHeight - height) / 2;

            window.open(
                `${linkUrl}?link=true&token=${token}`,
                `Link ${provider}`,
                `width=${width},height=${height},left=${left},top=${top}`
            );

            // Ở đây chỉ mô phỏng việc liên kết
            // Trong thực tế, cần xử lý callback từ popup

            return {
                success: true,
                message: `Đã mở cửa sổ liên kết với ${provider}. Vui lòng hoàn tất quá trình liên kết.`
            };
        } catch (error) {
            console.error(`Lỗi khi liên kết ${provider}:`, error);
            return {
                success: false,
                message: `Có lỗi xảy ra khi liên kết với ${provider}`
            };
        }
    }
}