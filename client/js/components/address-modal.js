// components/address-modal.js
import { AddressService } from '../service/address-service.js';

export class AddressModal {
    constructor() {
        this.modalElement = null;
        this.backdropElement = null;
        this.addressService = new AddressService();
        this.onComplete = null;
        this.userAddress = null;
        this.isUpdateMode = false;
        this.userId = JSON.parse(localStorage.getItem('user'))?.id || null;
    }

    /**
     * Tạo và hiển thị modal địa chỉ
     * @param {Object} userAddress - Thông tin địa chỉ hiện tại (null nếu là thêm mới)
     * @param {Function} onComplete - Callback khi hoàn thành thêm/sửa địa chỉ
     */
    show(userAddress = null, onComplete = null) {
        this.userAddress = userAddress;
        this.isUpdateMode = !!userAddress; // Nếu có userAddress thì là UPDATE, không thì là ADD
        this.onComplete = onComplete;
        this.createModal();
        document.head.appendChild(this.createModalCSS());
        this.setupEventListeners();
        this.loadProvinces();
    }

    createModal() {
        // Tạo modal backdrop
        this.backdropElement = document.createElement('div');
        this.backdropElement.className = 'modal-backdrop';
        document.body.appendChild(this.backdropElement);

        // Tạo modal container
        this.modalElement = document.createElement('div');
        this.modalElement.className = 'address-modal';
        this.modalElement.innerHTML = `
        <div class="modal-header">
            <h4>${this.isUpdateMode ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}</h4>
            <button class="close-modal"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
            <form class="address-form">
                <div class="form-row">
                    <label class="form-label">Tên người nhận</label>
                    <div class="form-input">
                        <input type="text" id="recipientName" class="form-control" value="${this.userAddress?.recipientName || ''}">
                    </div>
                </div>
                
                <div class="form-row">
                    <label class="form-label">Số điện thoại</label>
                    <div class="form-input">
                        <input type="text" id="phoneNumber" class="form-control" value="${this.userAddress?.phoneNumber || ''}">
                    </div>
                </div>
                
                <div class="form-row">
                    <label class="form-label">Tỉnh/Thành phố</label>
                    <div class="form-input">
                        <select id="province" class="form-select">
                            <option value="">Chọn Tỉnh/Thành phố</option>
                        </select>
                        <div class="loading-spinner province-spinner" style="display: none;">
                            <i class="fas fa-spinner fa-spin"></i>
                        </div>
                    </div>
                </div>
                
                <div class="form-row">
                    <label class="form-label">Quận/Huyện</label>
                    <div class="form-input">
                        <select id="district" class="form-select" disabled>
                            <option value="">Chọn Quận/Huyện</option>
                        </select>
                        <div class="loading-spinner district-spinner" style="display: none;">
                            <i class="fas fa-spinner fa-spin"></i>
                        </div>
                    </div>
                </div>
                
                <div class="form-row">
                    <label class="form-label">Phường/Xã</label>
                    <div class="form-input">
                        <select id="ward" class="form-select" disabled>
                            <option value="">Chọn Phường/Xã</option>
                        </select>
                        <div class="loading-spinner ward-spinner" style="display: none;">
                            <i class="fas fa-spinner fa-spin"></i>
                        </div>
                    </div>
                </div>
                
                <div class="form-row">
                    <label class="form-label">Địa chỉ</label>
                    <div class="form-input">
                        <input type="text" id="addressLine1" class="form-control" value="${this.userAddress?.addressLine1 || ''}">
                    </div>
                </div>
                
                <div class="address-note">
                    Để nhận hàng thuận tiện hơn, bạn vui lòng cho biết loại địa chỉ.
                </div>
                
                <div class="form-row">
                    <label class="form-label">Loại địa chỉ</label>
                    <div class="form-input">
                        <div class="address-types">
                            <div class="address-type">
                                <input type="radio" id="homeType" name="addressType" value="HOME" ${this.userAddress?.addressType !== 'COMPANY' ? 'checked' : ''}>
                                <label for="homeType">Nhà riêng / Chung cư</label>
                            </div>
                            <div class="address-type">
                                <input type="radio" id="companyType" name="addressType" value="COMPANY" ${this.userAddress?.addressType === 'COMPANY' ? 'checked' : ''}>
                                <label for="companyType">Cơ quan / Công ty</label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="default-address">
                    <input type="checkbox" id="isDefault" ${this.userAddress?.isDefault ? 'checked' : ''}>
                    <label for="isDefault">Sử dụng địa chỉ này làm mặc định.</label>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn-cancel">Hủy bỏ</button>
                    <button type="button" class="btn-save">${this.isUpdateMode ? 'Cập nhật' : 'Lưu địa chỉ'}</button>
                </div>
            </form>
        </div>
        `;

        document.body.appendChild(this.modalElement);
    }

    createModalCSS() {
        const style = document.createElement('style');
        style.textContent = `
            /* 2. Styling cho Modal Backdrop */
            .modal-backdrop {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 1050;
            }

            .address-modal {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 90%;
                max-width: 550px;
                background-color: white;
                border-radius: 8px;
                z-index: 1100;
                max-height: 90vh;
                overflow-y: auto;
                animation: modalFadeIn 0.3s ease-out;
            }

            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                border-bottom: 1px solid #f1f1f1;
                position: sticky;
                top: 0;
                background-color: white;
                z-index: 10;
            }

            .modal-header h4 {
                font-size: 18px;
                font-weight: 500;
                margin: 0;
            }

            .close-modal {
                background: none;
                border: none;
                font-size: 16px;
                color: #757575;
                cursor: pointer;
            }

            .modal-body {
                padding: 20px;
            }

            .form-row {
                display: flex;
                margin-bottom: 15px;
                align-items: flex-start;
            }

            .form-label {
                width: 140px;
                font-weight: 500;
                margin-bottom: 0;
                font-size: 14px;
                padding-top: 8px;
            }

            .form-input {
                flex: 1;
                position: relative;
            }

            .form-control, .form-select {
                padding: 8px 12px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
                width: 100%;
            }

            .form-control:focus, .form-select:focus {
                outline: none;
                border-color: #1a94ff;
                box-shadow: 0 0 0 2px rgba(26, 148, 255, 0.2);
            }

            .form-control.error, .form-select.error {
                border-color: #dc3545;
            }

            .error-message {
                color: #dc3545;
                font-size: 12px;
                margin-top: 4px;
            }

            textarea.form-control {
                resize: vertical;
                min-height: 60px;
            }

            .loading-spinner {
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                color: #1a94ff;
            }

            .address-note {
                padding-left: 140px;
                font-size: 12px;
                color: #757575;
                margin-top: 5px;
                margin-bottom: 15px;
            }

            .address-types {
                display: flex;
                gap: 20px;
            }

            .address-type {
                display: flex;
                align-items: center;
            }

            .address-type input[type="radio"] {
                margin-right: 8px;
            }

            .default-address {
                padding-left: 140px;
                display: flex;
                align-items: center;
                margin-top: 5px;
                margin-bottom: 15px;
            }

            .default-address input[type="checkbox"] {
                margin-right: 8px;
                width: 18px;
                height: 18px;
            }

            .form-actions {
                display: flex;
                justify-content: flex-end;
                gap: 15px;
                margin-top: 20px;
            }

            .btn-cancel {
                padding: 8px 20px;
                background-color: #f1f1f1;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
                cursor: pointer;
                min-width: 120px;
                text-align: center;
            }

            .btn-save {
                padding: 8px 20px;
                background-color: #1a94ff;
                color: white;
                border: none;
                border-radius: 4px;
                font-size: 14px;
                cursor: pointer;
                min-width: 120px;
                text-align: center;
            }

            .btn-save:hover {
                background-color: #0d84e8;
            }

            .btn-cancel:hover {
                background-color: #e5e5e5;
            }

            @keyframes modalFadeIn {
                from {
                    opacity: 0;
                    transform: translate(-50%, -60%);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%);
                }
            }

            @media (max-width: 600px) {
                .form-row {
                    flex-direction: column;
                    align-items: flex-start;
                }
                
                .form-label {
                    width: 100%;
                    margin-bottom: 5px;
                    padding-top: 0;
                }
                
                .form-input {
                    width: 100%;
                }
                
                .address-note, .default-address {
                    padding-left: 0;
                }
                
                .address-types {
                    flex-direction: column;
                    gap: 10px;
                }
                
                .form-actions {
                    flex-direction: column;
                    margin-top: 30px;
                }
                
                .btn-cancel, .btn-save {
                    width: 100%;
                }
            }
        `;
        return style;
    }

    setupEventListeners() {
        // Xử lý đóng modal
        const closeBtn = this.modalElement.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => this.close());
        this.backdropElement.addEventListener('click', () => this.close());

        // Xử lý nút Hủy bỏ
        const cancelBtn = this.modalElement.querySelector('.btn-cancel');
        cancelBtn.addEventListener('click', () => this.close());

        // Xử lý khi chọn tỉnh/thành phố
        const provinceSelect = this.modalElement.querySelector('#province');
        provinceSelect.addEventListener('change', () => {
            const provinceCode = provinceSelect.value;
            if (provinceCode) {
                this.loadDistricts(provinceCode);
                // Reset quận/huyện và phường/xã
                this.modalElement.querySelector('#district').innerHTML = '<option value="">Chọn Quận/Huyện</option>';
                this.modalElement.querySelector('#district').disabled = true;
                this.modalElement.querySelector('#ward').innerHTML = '<option value="">Chọn Phường/Xã</option>';
                this.modalElement.querySelector('#ward').disabled = true;
            }
        });

        // Xử lý khi chọn quận/huyện
        const districtSelect = this.modalElement.querySelector('#district');
        districtSelect.addEventListener('change', () => {
            const districtCode = districtSelect.value;
            if (districtCode) {
                this.loadWards(districtCode);
                // Reset phường/xã
                this.modalElement.querySelector('#ward').innerHTML = '<option value="">Chọn Phường/Xã</option>';
                this.modalElement.querySelector('#ward').disabled = true;
            }
        });

        // Xử lý nút Lưu/Cập nhật
        const saveBtn = this.modalElement.querySelector('.btn-save');
        saveBtn.addEventListener('click', () => this.handleSaveAddress());
    }

    async loadProvinces() {
        const provinceSelect = this.modalElement.querySelector('#province');
        const spinner = this.modalElement.querySelector('.province-spinner');

        try {
            spinner.style.display = 'inline-block';

            // Gọi API để lấy danh sách tỉnh/thành phố
            const provinces = await this.addressService.getProvinces();

            // Thêm các option vào select
            provinces.forEach(province => {
                const option = document.createElement('option');
                option.value = province.code;
                option.textContent = province.name;
                provinceSelect.appendChild(option);
            });

            // Kích hoạt select
            provinceSelect.disabled = false;

            // Nếu đã có dữ liệu địa chỉ cũ, chọn tỉnh/thành phố tương ứng
            if (this.userAddress && this.userAddress.provinceCode) {
                provinceSelect.value = this.userAddress.provinceCode;
                this.loadDistricts(this.userAddress.provinceCode);
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu tỉnh/thành phố:', error);
            this.showError(provinceSelect, 'Không thể tải dữ liệu tỉnh/thành phố. Vui lòng thử lại sau.');
        } finally {
            spinner.style.display = 'none';
        }
    }

    async loadDistricts(provinceCode) {
        const districtSelect = this.modalElement.querySelector('#district');
        const spinner = this.modalElement.querySelector('.district-spinner');

        try {
            spinner.style.display = 'inline-block';
            districtSelect.innerHTML = '<option value="">Chọn Quận/Huyện</option>';

            // Gọi API để lấy danh sách quận/huyện
            const districts = await this.addressService.getDistricts(provinceCode);

            // Thêm các option vào select
            districts.forEach(district => {
                const option = document.createElement('option');
                option.value = district.code;
                option.textContent = district.name;
                districtSelect.appendChild(option);
            });

            // Kích hoạt select
            districtSelect.disabled = false;

            // Nếu đã có dữ liệu địa chỉ cũ, chọn quận/huyện tương ứng
            if (this.userAddress && this.userAddress.districtCode &&
                this.userAddress.provinceCode == provinceCode) {
                districtSelect.value = this.userAddress.districtCode;
                this.loadWards(this.userAddress.districtCode);
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu quận/huyện:', error);
            this.showError(districtSelect, 'Không thể tải dữ liệu quận/huyện. Vui lòng thử lại sau.');
        } finally {
            spinner.style.display = 'none';
        }
    }

    async loadWards(districtCode) {
        const wardSelect = this.modalElement.querySelector('#ward');
        const spinner = this.modalElement.querySelector('.ward-spinner');

        try {
            spinner.style.display = 'inline-block';
            wardSelect.innerHTML = '<option value="">Chọn Phường/Xã</option>';

            // Gọi API để lấy danh sách phường/xã
            const wards = await this.addressService.getWards(districtCode);

            // Thêm các option vào select
            wards.forEach(ward => {
                const option = document.createElement('option');
                option.value = ward.code;
                option.textContent = ward.name;
                wardSelect.appendChild(option);
            });

            // Kích hoạt select
            wardSelect.disabled = false;

            // Nếu đã có dữ liệu địa chỉ cũ, chọn phường/xã tương ứng
            if (this.userAddress && this.userAddress.wardCode &&
                this.userAddress.districtCode == districtCode) {
                wardSelect.value = this.userAddress.wardCode;
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu phường/xã:', error);
            this.showError(wardSelect, 'Không thể tải dữ liệu phường/xã. Vui lòng thử lại sau.');
        } finally {
            spinner.style.display = 'none';
        }
    }

    showError(element, message) {
        // Thêm class error vào element
        element.classList.add('error');
        
        // Kiểm tra và xóa thông báo lỗi cũ nếu có
        const existingError = element.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Tạo thông báo lỗi mới
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        
        // Thêm vào sau element
        element.parentElement.appendChild(errorMessage);
    }

    clearError(element) {
        // Xóa class error
        element.classList.remove('error');
        
        // Xóa thông báo lỗi nếu có
        const errorMessage = element.parentElement.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    validateForm() {
        let isValid = true;
        const requiredFields = [
            { id: 'recipientName', message: 'Vui lòng nhập tên người nhận' },
            { id: 'phoneNumber', message: 'Vui lòng nhập số điện thoại' },
            { id: 'province', message: 'Vui lòng chọn Tỉnh/Thành phố' },
            { id: 'district', message: 'Vui lòng chọn Quận/Huyện' },
            { id: 'ward', message: 'Vui lòng chọn Phường/Xã' },
            { id: 'addressLine1', message: 'Vui lòng nhập địa chỉ' }
        ];

        requiredFields.forEach(field => {
            const element = this.modalElement.querySelector(`#${field.id}`);
            const value = element.value.trim();
            
            // Xóa lỗi cũ
            this.clearError(element);
            
            // Kiểm tra giá trị
            if (!value) {
                this.showError(element, field.message);
                isValid = false;
            }
        });

        // Kiểm tra định dạng số điện thoại
        const phoneNumber = this.modalElement.querySelector('#phoneNumber').value.trim();
        if (phoneNumber && !/^(0|\+84|\(\+84\))[3|5|7|8|9][0-9]{8}$/.test(phoneNumber)) {
            this.showError(this.modalElement.querySelector('#phoneNumber'), 'Số điện thoại không hợp lệ');
            isValid = false;
        }

        return isValid;
    }

    async handleSaveAddress() {
        // Validate form
        if (!this.validateForm()) {
            return;
        }

        // Lấy dữ liệu từ form
        const recipientName = this.modalElement.querySelector('#recipientName').value.trim();
        const phoneNumber = this.modalElement.querySelector('#phoneNumber').value.trim();
        const provinceSelect = this.modalElement.querySelector('#province');
        const districtSelect = this.modalElement.querySelector('#district');
        const wardSelect = this.modalElement.querySelector('#ward');
        const addressLine1 = this.modalElement.querySelector('#addressLine1').value.trim();
        const isDefault = this.modalElement.querySelector('#isDefault').checked;
        const addressType = this.modalElement.querySelector('input[name="addressType"]:checked').value;

        // Tạo đối tượng địa chỉ mới theo cấu trúc của UserAddress
        const addressData = {
            id: this.isUpdateMode ? this.userAddress.id : null,
            userId: this.userId,
            recipientName,
            phoneNumber,
            addressLine1,
            provinceCode: parseInt(provinceSelect.value),
            districtCode: parseInt(districtSelect.value),
            wardCode: parseInt(wardSelect.value),
            provinceName: provinceSelect.options[provinceSelect.selectedIndex].text,
            districtName: districtSelect.options[districtSelect.selectedIndex].text,
            wardName: wardSelect.options[wardSelect.selectedIndex].text,
            isDefault,
            addressType
        };
        console.log(addressData);
        try {
            // Hiển thị loading state
            const saveBtn = this.modalElement.querySelector('.btn-save');
            const originalText = saveBtn.textContent;
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';

            // Xác định endpoint dựa vào mode
            const endpoint = this.isUpdateMode 
                ? 'http://localhost:8080/api/address/update' 
                : 'http://localhost:8080/api/address/add';

            // Gọi API để lưu địa chỉ
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(addressData)
            });

            // Xử lý kết quả
            if (response.ok) {
                const result = await response.json();
                
                // Lưu địa chỉ vào localStorage để fallback
                if (this.isUpdateMode) {
                    // Cập nhật địa chỉ hiện tại
                    const addresses = this.addressService.getUserAddresses();
                    const index = addresses.findIndex(addr => addr.id === addressData.id);
                    if (index !== -1) {
                        addresses[index] = addressData;
                    }
                    this.addressService.saveUserAddresses(addresses);
                } else {
                    // Thêm địa chỉ mới
                    const addresses = this.addressService.getUserAddresses();
                    addressData.id = result.id || Date.now().toString(); // Sử dụng ID từ API hoặc tạo ID tạm
                    addresses.push(addressData);
                    this.addressService.saveUserAddresses(addresses);
                }

                // Gọi callback nếu có
                if (this.onComplete) {
                    this.onComplete(addressData);
                }

                // Đóng modal
                this.close();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Không thể lưu địa chỉ.');
            }
        } catch (error) {
            console.error('Lỗi khi lưu địa chỉ:', error);
            alert(error.message || 'Đã xảy ra lỗi khi lưu địa chỉ. Vui lòng thử lại sau.');
            
            // Khôi phục trạng thái nút
            const saveBtn = this.modalElement.querySelector('.btn-save');
            saveBtn.disabled = false;
            saveBtn.textContent = originalText;
        }
    }

    close() {
        if (this.modalElement && this.backdropElement) {
            document.body.removeChild(this.backdropElement);
            document.body.removeChild(this.modalElement);
        }
    }
}

/**
 * Hiển thị modal để thêm/cập nhật địa chỉ
 * @param {Object} userAddress - Thông tin địa chỉ hiện tại (null nếu là thêm mới)
 * @param {Function} onComplete - Callback khi hoàn thành thêm/sửa địa chỉ
 */
export function openAddressModal(userAddress = null, onComplete = null) {
    const modal = new AddressModal();
    modal.show(userAddress, onComplete);
}