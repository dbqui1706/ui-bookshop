import { DialogComponent } from "../components/dialog-component.js";
import { FormComponent } from "../components/form-component.js";
import { UserProfileService } from "../service/user-profile-service.js";
import { showToast } from "../utils/common-utils.js";
import { 
    validateFullName, 
    validateNickname, 
    validatePassword, 
    validatePIN, 
    isValidEmail, 
    isValidPhone 
} from "../utils/validations-utils.js";
import { STORAGE_KEYS } from "../constants/index.js";

export class AccountInfo {
    constructor() {
        this.userProfileService = new UserProfileService();
        this.init();
    }
    
    /**
     * Khởi tạo các thành phần và sự kiện
     */
    async init() {
        // Lấy thông tin người dùng từ local storage
        this.userInfo = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');
        
        // Nếu không có thông tin, thử lấy từ server
        if (!this.userInfo || Object.keys(this.userInfo).length === 0) {
            const response = await this.userProfileService.getUserProfile();
            if (response.success) {
                this.userInfo = response.user;
            } else {
                // Hiển thị thông báo lỗi nếu cần
                if (response.message) {
                    showToast(response.message, 'error');
                }
                return;
            }
        }
        
        // Thiết lập các trường dữ liệu
        // this.setupDateSelects();
        this.populateUserInfo();
        
        // Thiết lập sự kiện cho các nút
        this.setupEventListeners();
    }
    
    /**
     * Thiết lập danh sách ngày, tháng, năm
     */
    setupDateSelects() {
        const daySelect = document.getElementById('day');
        const monthSelect = document.getElementById('month');
        const yearSelect = document.getElementById('year');
        
        // Thêm các ngày
        for (let i = 1; i <= 31; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            daySelect.appendChild(option);
        }
        
        // Thêm các tháng
        for (let i = 1; i <= 12; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            monthSelect.appendChild(option);
        }
        
        // Thêm các năm
        const currentYear = new Date().getFullYear();
        for (let i = currentYear; i >= currentYear - 100; i--) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            yearSelect.appendChild(option);
        }
    }
    
    /**
     * Điền thông tin người dùng vào form
     */
    populateUserInfo() {
        
        // address:  "123 Admin St, Admin City"
        // createdAt:  "Mar 22, 2025, 9:38:55 AM"
        // email:  "admin@bookshop.com"
        // fullName:  "Admin User"
        // gender:  1
        // id:  6
        // isActiveEmail:  true
        // password:  "202CB962AC59075B964B07152D234B70"
        // phoneNumber:  "0987654321"
        // role:  "ADMIN"
        // username:  "admin"


        // Điền họ tên
        if (this.userInfo.fullName) {
            document.getElementById('fullName').value = this.userInfo.fullName;
        }
        
        // Điền nickname
        if (this.userInfo.username) {
            document.getElementById('nickname').value = this.userInfo.username;
        }
        
        // Điền ngày sinh nếu có
        // if (this.userInfo.birthDate) {
        //     const birthDate = new Date(this.userInfo.birthDate);
            
        //     document.getElementById('day').value = birthDate.getDate();
        //     document.getElementById('month').value = birthDate.getMonth() + 1;
        //     document.getElementById('year').value = birthDate.getFullYear();
        // }
        
        
        // Thiết lập giới tính
        if (parseInt(this.userInfo.gender) === 1) {
            document.getElementById('male').checked = true;
        } else if (parseInt(this.userInfo.gender) === 0) {
            document.getElementById('female').checked = true;
        } 
        
        // Điền số điện thoại và email
        if (this.userInfo.phoneNumber) {
            document.getElementById('phoneDisplay').textContent = this.userInfo.phoneNumber;
        }
        
        if (this.userInfo.email) {
            document.getElementById('emailDisplay').textContent = this.userInfo.email;
        }
    }
    
    /**
     * Thiết lập các sự kiện cho các nút và form
     */
    setupEventListeners() {
        // Sự kiện nút Lưu thay đổi
        const saveButton = document.getElementById('saveButton');
        if (saveButton) {
            saveButton.addEventListener('click', this.handleSaveProfile.bind(this));
        }
        
        // Sự kiện cập nhật số điện thoại
        const updatePhoneBtn = document.getElementById('updatePhoneBtn');
        if (updatePhoneBtn) {
            updatePhoneBtn.addEventListener('click', this.handleUpdatePhone.bind(this));
        }
        
        // Sự kiện cập nhật email
        const updateEmailBtn = document.getElementById('updateEmailBtn');
        if (updateEmailBtn) {
            updateEmailBtn.addEventListener('click', this.handleUpdateEmail.bind(this));
        }
        
        // Sự kiện cập nhật mật khẩu
        const updatePasswordBtn = document.getElementById('updatePasswordBtn');
        if (updatePasswordBtn) {
            updatePasswordBtn.addEventListener('click', this.handleUpdatePassword.bind(this));
        }
        
        // Sự kiện thiết lập mã PIN
        const setupPinBtn = document.getElementById('setupPinBtn');
        if (setupPinBtn) {
            setupPinBtn.addEventListener('click', this.handleSetupPin.bind(this));
        }
        
        // Sự kiện yêu cầu xóa tài khoản
        const deleteAccountBtn = document.getElementById('deleteAccountBtn');
        if (deleteAccountBtn) {
            deleteAccountBtn.addEventListener('click', this.handleDeleteAccount.bind(this));
        }
        
        // Sự kiện liên kết Facebook
        const linkFacebookBtn = document.getElementById('linkFacebookBtn');
        if (linkFacebookBtn) {
            linkFacebookBtn.addEventListener('click', () => this.handleLinkSocial('facebook'));
        }
        
        // Sự kiện liên kết Google
        const linkGoogleBtn = document.getElementById('linkGoogleBtn');
        if (linkGoogleBtn) {
            linkGoogleBtn.addEventListener('click', () => this.handleLinkSocial('google'));
        }
    }
    
    /**
     * Xử lý sự kiện lưu thông tin hồ sơ
     */
    async handleSaveProfile() {
        console.log('handleSaveProfile');
        // Lấy giá trị từ form
        const fullName = document.getElementById('fullName').value.trim();
        const nickname = document.getElementById('nickname').value.trim();
        
        // Lấy giới tính
        let gender = null;
        const maleRadio = document.getElementById('male');
        const femaleRadio = document.getElementById('female');
        
        if (maleRadio && maleRadio.checked) {
            gender = 1;
        } else if (femaleRadio && femaleRadio.checked) {
            gender = 0;
        } 
        
        // Kiểm tra họ tên
        const nameValidation = validateFullName(fullName);
        if (!nameValidation.isValid) {
            showToast(nameValidation.message, 'error');
            return;
        }
        
        // Kiểm tra nickname nếu có
        if (nickname) {
            const nicknameValidation = validateNickname(nickname);
            if (!nicknameValidation.isValid) {
                showToast(nicknameValidation.message, 'error');
                return;
            }
        }
        
        // Tạo dữ liệu cập nhật
        const updateData = {
            fullName,
            gender
        };
        
        // Thêm các trường không bắt buộc
        if (nickname) {
            updateData.nickname = nickname;
        }
        
        // Gọi API cập nhật
        // const response = await this.userProfileService.updateUserProfile(updateData);
        const response = {
            success: true,
            message: 'Cập nhật thông tin thành công'
        };
        
        if (response.success) {
            showToast(response.message || 'Cập nhật thông tin thành công', 'success');
            // Cập nhật thông tin người dùng trong bộ nhớ
            // this.userInfo = { ...this.userInfo, ...updateData };
        } else {
            showToast(response.message || 'Cập nhật thông tin thất bại', 'error');
        }
    }
    
    /**
     * Xử lý sự kiện cập nhật số điện thoại
     */
    handleUpdatePhone() {
        const dialog = new DialogComponent({
            title: 'Cập nhật số điện thoại',
            content: `
                <div class="form-group mb-3">
                    <label for="phoneInput" class="form-label">Số điện thoại mới</label>
                    <input type="tel" class="form-control" id="phoneInput" placeholder="Nhập số điện thoại mới">
                    <div class="form-text">Hãy nhập số điện thoại Việt Nam hợp lệ.</div>
                </div>
            `,
            buttons: [
                {
                    text: 'Hủy',
                    class: 'btn-secondary',
                    dismiss: true
                },
                {
                    text: 'Cập nhật',
                    class: 'btn-primary',
                    id: 'updatePhoneConfirmBtn',
                    onClick: async () => {
                        const phoneInput = document.getElementById('phoneInput');
                        const phone = phoneInput.value.trim();
                        
                        if (!isValidPhone(phone)) {
                            showToast('Số điện thoại không hợp lệ', 'error');
                            return;
                        }
                        
                        const response = await this.userProfileService.updatePhone(phone);
                        
                        if (response.success) {
                            showToast(response.message || 'Cập nhật số điện thoại thành công', 'success');
                            document.getElementById('phoneDisplay').textContent = phone;
                            this.userInfo.phone = phone;
                        } else {
                            showToast(response.message || 'Cập nhật số điện thoại thất bại', 'error');
                        }
                    }
                }
            ]
        });
        
        dialog.show();
    }
    
    /**
     * Xử lý sự kiện cập nhật email
     */
    handleUpdateEmail() {
        const dialog = new DialogComponent({
            title: 'Cập nhật email',
            content: `
                <div class="form-group mb-3">
                    <label for="emailInput" class="form-label">Email mới</label>
                    <input type="email" class="form-control" id="emailInput" placeholder="Nhập email mới">
                    <div class="form-text">Một email xác nhận sẽ được gửi đến địa chỉ mới.</div>
                </div>
            `,
            buttons: [
                {
                    text: 'Hủy',
                    class: 'btn-secondary',
                    dismiss: true
                },
                {
                    text: 'Cập nhật',
                    class: 'btn-primary',
                    id: 'updateEmailConfirmBtn',
                    onClick: async () => {
                        const emailInput = document.getElementById('emailInput');
                        const email = emailInput.value.trim();
                        
                        if (!isValidEmail(email)) {
                            showToast('Email không hợp lệ', 'error');
                            return;
                        }
                        
                        const response = await this.userProfileService.updateEmail(email);
                        
                        if (response.success) {
                            showToast(response.message || 'Cập nhật email thành công', 'success');
                            document.getElementById('emailDisplay').textContent = email;
                            this.userInfo.email = email;
                        } else {
                            showToast(response.message || 'Cập nhật email thất bại', 'error');
                        }
                    }
                }
            ]
        });
        
        dialog.show();
    }
    
    /**
     * Xử lý sự kiện cập nhật mật khẩu
     */
    handleUpdatePassword() {
        const dialog = new DialogComponent({
            title: 'Cập nhật mật khẩu',
            content: `
                <div class="form-group mb-3">
                    <label for="currentPassword" class="form-label">Mật khẩu hiện tại</label>
                    <input type="password" class="form-control" id="currentPassword" placeholder="Nhập mật khẩu hiện tại">
                </div>
                <div class="form-group mb-3">
                    <label for="newPassword" class="form-label">Mật khẩu mới</label>
                    <input type="password" class="form-control" id="newPassword" placeholder="Nhập mật khẩu mới">
                    <div class="form-text">Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.</div>
                </div>
                <div class="form-group mb-3">
                    <label for="confirmPassword" class="form-label">Xác nhận mật khẩu mới</label>
                    <input type="password" class="form-control" id="confirmPassword" placeholder="Nhập lại mật khẩu mới">
                </div>
            `,
            buttons: [
                {
                    text: 'Hủy',
                    class: 'btn-secondary',
                    dismiss: true
                },
                {
                    text: 'Cập nhật',
                    class: 'btn-primary',
                    id: 'updatePasswordConfirmBtn',
                    onClick: async () => {
                        const currentPassword = document.getElementById('currentPassword').value;
                        const newPassword = document.getElementById('newPassword').value;
                        const confirmPassword = document.getElementById('confirmPassword').value;
                        
                        // Kiểm tra mật khẩu hiện tại
                        if (!currentPassword) {
                            showToast('Vui lòng nhập mật khẩu hiện tại', 'error');
                            return;
                        }
                        
                        // Kiểm tra mật khẩu mới
                        const passwordValidation = validatePassword(newPassword);
                        if (!passwordValidation.isValid) {
                            showToast(passwordValidation.message, 'error');
                            return;
                        }
                        
                        // Kiểm tra xác nhận mật khẩu
                        if (newPassword !== confirmPassword) {
                            showToast('Xác nhận mật khẩu không khớp', 'error');
                            return;
                        }
                        
                        const response = await this.userProfileService.updatePassword({
                            currentPassword,
                            newPassword,
                            confirmPassword
                        });
                        
                        if (response.success) {
                            showToast(response.message || 'Cập nhật mật khẩu thành công', 'success');
                            dialog.hide();
                        } else {
                            showToast(response.message || 'Cập nhật mật khẩu thất bại', 'error');
                        }
                    }
                }
            ]
        });
        
        dialog.show();
    }
    
    /**
     * Xử lý sự kiện thiết lập mã PIN
     */
    handleSetupPin() {
        const dialog = new DialogComponent({
            title: 'Thiết lập mã PIN',
            content: `
                <div class="form-group mb-3">
                    <label for="pinInput" class="form-label">Mã PIN (6 số)</label>
                    <input type="password" class="form-control" id="pinInput" placeholder="Nhập mã PIN 6 số" maxlength="6" inputmode="numeric" pattern="[0-9]*">
                    <div class="form-text">Mã PIN dùng để xác nhận các giao dịch quan trọng.</div>
                </div>
                <div class="form-group mb-3">
                    <label for="confirmPin" class="form-label">Xác nhận mã PIN</label>
                    <input type="password" class="form-control" id="confirmPin" placeholder="Nhập lại mã PIN" maxlength="6" inputmode="numeric" pattern="[0-9]*">
                </div>
            `,
            buttons: [
                {
                    text: 'Hủy',
                    class: 'btn-secondary',
                    dismiss: true
                },
                {
                    text: 'Thiết lập',
                    class: 'btn-primary',
                    id: 'setupPinConfirmBtn',
                    onClick: async () => {
                        const pin = document.getElementById('pinInput').value;
                        const confirmPin = document.getElementById('confirmPin').value;
                        
                        // Kiểm tra mã PIN
                        const pinValidation = validatePIN(pin);
                        if (!pinValidation.isValid) {
                            showToast(pinValidation.message, 'error');
                            return;
                        }
                        
                        // Kiểm tra xác nhận mã PIN
                        if (pin !== confirmPin) {
                            showToast('Xác nhận mã PIN không khớp', 'error');
                            return;
                        }
                        
                        const response = await this.userProfileService.setupPIN({
                            pin,
                            confirmPin
                        });
                        
                        if (response.success) {
                            showToast(response.message || 'Thiết lập mã PIN thành công', 'success');
                            dialog.hide();
                            // Cập nhật trạng thái nút thiết lập PIN
                            const setupPinBtn = document.getElementById('setupPinBtn');
                            if (setupPinBtn) {
                                setupPinBtn.textContent = 'Cập nhật';
                            }
                        } else {
                            showToast(response.message || 'Thiết lập mã PIN thất bại', 'error');
                        }
                    }
                }
            ]
        });
        
        dialog.show();
    }
    
    /**
     * Xử lý sự kiện yêu cầu xóa tài khoản
     */
    handleDeleteAccount() {
        DialogComponent.confirm(
            'Bạn chắc chắn muốn yêu cầu xóa tài khoản? Hành động này không thể hoàn tác và bạn sẽ mất tất cả dữ liệu liên quan đến tài khoản.',
            'Xác nhận xóa tài khoản',
            async () => {
                const response = await this.userProfileService.requestDeleteAccount();
                
                if (response.success) {
                    showToast(response.message || 'Yêu cầu xóa tài khoản đã được gửi', 'success');
                } else {
                    showToast(response.message || 'Yêu cầu xóa tài khoản thất bại', 'error');
                }
            }
        );
    }
    
    /**
     * Xử lý sự kiện liên kết mạng xã hội
     * @param {string} provider Nhà cung cấp ('facebook', 'google')
     */
    async handleLinkSocial(provider) {
        // Thực hiện liên kết với mạng xã hội
        const response = await this.userProfileService.linkSocialAccount(provider);
        
        // Hiển thị kết quả
        if (response.success) {
            showToast(response.message, 'info');
        } else {
            showToast(response.message, 'error');
        }
    }
}