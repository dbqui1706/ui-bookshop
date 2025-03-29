// components/address-modal.js
import { AddressService } from '../service/address-service.js';

export class AddressModal {
    constructor() {
        this.modalElement = null;
        this.backdropElement = null;
        this.addressService = new AddressService();
        this.onAddressUpdated = null;
        this.userAddress = null;
    }

    /**
     * Tạo và hiển thị modal địa chỉ giao hàng
     * @param {Object} userAddress - Thông tin địa chỉ hiện tại của người dùng
     * @param {Function} onAddressUpdated - Callback khi người dùng cập nhật địa chỉ
     */
    show(userAddress = null, onAddressUpdated = null) {
        this.userAddress = userAddress;
        this.onAddressUpdated = onAddressUpdated;
        this.createModal();
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
            <h4>Thay đổi địa chỉ giao hàng</h4>
            <button class="close-modal"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
            <form class="address-form">
                <div class="form-row">
                    <label class="form-label">Họ tên</label>
                    <div class="form-input">
                        <input type="text" id="fullname" class="form-control" value="${this.userAddress?.fullname || ''}">
                    </div>
                </div>
                
                <div class="form-row">
                    <label class="form-label">Điện thoại di động</label>
                    <div class="form-input">
                        <input type="text" id="phone" class="form-control" value="${this.userAddress?.phone || ''}">
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
                        <textarea id="address" class="form-control">${this.userAddress?.address || ''}</textarea>
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
                                <input type="radio" id="home" name="addressType" ${this.userAddress?.addressType !== 'company' ? 'checked' : ''}>
                                <label for="home">Nhà riêng / Chung cư</label>
                            </div>
                            <div class="address-type">
                                <input type="radio" id="company" name="addressType" ${this.userAddress?.addressType === 'company' ? 'checked' : ''}>
                                <label for="company">Cơ quan / Công ty</label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="default-address">
                    <input type="checkbox" id="defaultAddress" ${this.userAddress?.isDefault ? 'checked' : ''}>
                    <label for="defaultAddress">Sử dụng địa chỉ này làm mặc định.</label>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn-cancel">Hủy bỏ</button>
                    <button type="button" class="btn-update">Cập nhật</button>
                </div>
            </form>
        </div>
        `;

        document.body.appendChild(this.modalElement);
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

        // Xử lý nút Cập nhật
        const updateBtn = this.modalElement.querySelector('.btn-update');
        updateBtn.addEventListener('click', () => this.handleUpdateAddress());
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
            alert('Không thể tải dữ liệu tỉnh/thành phố. Vui lòng thử lại sau.');
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
            alert('Không thể tải dữ liệu quận/huyện. Vui lòng thử lại sau.');
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
            alert('Không thể tải dữ liệu phường/xã. Vui lòng thử lại sau.');
        } finally {
            spinner.style.display = 'none';
        }
    }

    handleUpdateAddress() {
        // Lấy dữ liệu từ form
        const fullname = this.modalElement.querySelector('#fullname').value;
        const phone = this.modalElement.querySelector('#phone').value;
        const provinceSelect = this.modalElement.querySelector('#province');
        const districtSelect = this.modalElement.querySelector('#district');
        const wardSelect = this.modalElement.querySelector('#ward');
        const address = this.modalElement.querySelector('#address').value;
        const isDefault = this.modalElement.querySelector('#defaultAddress').checked;
        const addressType = this.modalElement.querySelector('#company').checked ? 'company' : 'home';

        // Validate dữ liệu
        if (!fullname || !phone || !provinceSelect.value || !districtSelect.value || 
            !wardSelect.value || !address) {
            alert('Vui lòng điền đầy đủ thông tin.');
            return;
        }

        // Tạo đối tượng địa chỉ mới
        const newAddress = {
            fullname,
            phone,
            provinceCode: provinceSelect.value,
            province: provinceSelect.options[provinceSelect.selectedIndex].text,
            districtCode: districtSelect.value,
            district: districtSelect.options[districtSelect.selectedIndex].text,
            wardCode: wardSelect.value,
            ward: wardSelect.options[wardSelect.selectedIndex].text,
            address,
            isDefault,
            addressType
        };

        // Lưu địa chỉ vào localStorage
        localStorage.setItem('shippingAddress', JSON.stringify(newAddress));

        // Gọi callback nếu có
        if (this.onAddressUpdated) {
            this.onAddressUpdated(newAddress);
        }

        // Đóng modal
        this.close();
    }

    close() {
        if (this.modalElement && this.backdropElement) {
            document.body.removeChild(this.backdropElement);
            document.body.removeChild(this.modalElement);
        }
    }
}

/**
 * Hiển thị modal địa chỉ giao hàng
 * @param {Object} userAddress - Thông tin địa chỉ hiện tại của người dùng
 * @param {Function} onAddressUpdated - Callback khi người dùng cập nhật địa chỉ
 */
export function openAddressModal(userAddress = null, onAddressUpdated = null) {
    const modal = new AddressModal();
    modal.show(userAddress, onAddressUpdated);
}