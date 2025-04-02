import { AddressService } from "../service/address-service.js";
import { openAddressModal } from "../components/address-modal.js";

export class AddressInfoContainer {
    constructor() {
        // Local Storage
        this.user = JSON.parse(localStorage.getItem('user')) || null;

        // Services
        this.addressService = new AddressService();

        // DOM
        this.addressContainer = document.querySelector('.address-info-section .row');
        this.addressTitle = document.querySelector('.address-title');

        // init
        this.init();
    }

    async init() {
        // Nếu không có user, hiển thị thông báo đăng nhập
        if (!this.user) {
            this.renderLoginRequired();
            return;
        }

        // Tải danh sách địa chỉ
        await this.loadAddresses();

        // Khởi tạo các sự kiện
        this.initEvents();
    }

    initEvents() {
        // Nút thêm địa chỉ ở trên cùng
        const addAddressBtn = document.createElement('button');
        addAddressBtn.className = 'btn btn-primary btn-sm';
        addAddressBtn.innerHTML = '<i class="fas fa-plus"></i> Thêm địa chỉ mới';
        addAddressBtn.addEventListener('click', () => this.handleAddAddress());

        // Thêm nút vào tiêu đề
        this.addressTitle.appendChild(addAddressBtn);

        // Xử lý sự kiện click trên container (Event Delegation)
        this.addressContainer.addEventListener('click', (event) => {
            const target = event.target;

            // Tìm button gần nhất
            const button = target.closest('button');
            if (!button) return;

            // Tìm card gần nhất
            const card = button.closest('.address-card');
            if (!card) return;

            // Lấy ID địa chỉ
            const addressId = card.dataset.id;

            // Xác định loại hành động
            if (button.classList.contains('edit-btn')) {
                this.handleEditAddress(addressId);
            } else if (button.classList.contains('delete-btn')) {
                this.handleDeleteAddress(addressId);
            } else if (button.classList.contains('set-default-btn')) {
                this.handleSetDefaultAddress(addressId);
            }
        });

        // Xử lý sự kiện click cho thẻ thêm địa chỉ
        document.addEventListener('click', (event) => {
            const addCard = event.target.closest('.add-address-card');
            if (addCard) {
                this.handleAddAddress();
            }
        });
    }

    async loadAddresses() {
        try {
            // Hiển thị loading state
            this.renderLoading();

            // Lấy danh sách địa chỉ từ API hoặc localStorage
            let addresses;

            // Thử lấy từ API
            const response = await this.addressService.getAddressByUserId(this.user.id);

            if (response.success) {
                addresses = response.data;
                localStorage.setItem('userAddresses', JSON.stringify(addresses));
            } else {
                // Fallback vào localStorage nếu API lỗi
                addresses = this.addressService.getUserAddresses();
            }

            // Hiển thị danh sách địa chỉ
            this.renderAddresses(addresses);
        } catch (error) {
            console.error('Lỗi khi tải danh sách địa chỉ:', error);
            this.renderError('Không thể tải danh sách địa chỉ. Vui lòng thử lại sau.');
        }
    }

    renderLoading() {
        this.addressContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Đang tải...</span>
                </div>
                <p class="mt-3">Đang tải danh sách địa chỉ...</p>
            </div>
        `;
    }

    renderError(message) {
        this.addressContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="alert alert-danger" role="alert">
                    <i class="fas fa-exclamation-circle me-2"></i> ${message}
                </div>
                <button class="btn btn-outline-primary mt-3" id="retry-load-addresses">
                    <i class="fas fa-sync-alt me-2"></i> Thử lại
                </button>
            </div>
        `;

        // Thêm sự kiện thử lại
        document.getElementById('retry-load-addresses').addEventListener('click', () => {
            this.loadAddresses();
        });
    }

    renderLoginRequired() {
        this.addressContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="alert alert-warning" role="alert">
                    <i class="fas fa-user-lock me-2"></i> Vui lòng đăng nhập để xem và quản lý địa chỉ của bạn
                </div>
                <a href="/login" class="btn btn-primary mt-3">
                    <i class="fas fa-sign-in-alt me-2"></i> Đăng nhập ngay
                </a>
            </div>
        `;
    }

    renderAddresses(addresses) {
        // Nếu không có địa chỉ nào
        if (!addresses || addresses.length === 0) {
            this.renderEmptyState();
            return;
        }

        // Xóa nội dung cũ
        this.addressContainer.innerHTML = '';

        // Hiển thị danh sách địa chỉ
        addresses.forEach(address => {
            const col = document.createElement('div');
            col.className = 'col-md-6 mb-3';
            col.innerHTML = this.createAddressCardHTML(address);
            this.addressContainer.appendChild(col);
        });

        // Thêm card "Thêm địa chỉ mới"
        const addCol = document.createElement('div');
        addCol.className = 'col-md-6 mb-3';
        addCol.innerHTML = `
            <div class="add-address-card">
                <div class="add-icon">
                    <i class="fas fa-plus"></i>
                </div>
                <p class="add-address-text">Thêm địa chỉ mới</p>
            </div>
        `;
        this.addressContainer.appendChild(addCol);
    }

    renderEmptyState() {
        this.addressContainer.innerHTML = `
            <div class="col-12 text-center py-4">
                <div class="empty-state">
                    <i class="fas fa-map-marked-alt fa-3x mb-3 text-muted"></i>
                    <h5>Bạn chưa có địa chỉ nào</h5>
                    <p class="text-muted">Thêm địa chỉ mới để thuận tiện cho việc mua sắm</p>
                    <button class="btn btn-primary mt-2" id="add-first-address">
                        <i class="fas fa-plus me-2"></i> Thêm địa chỉ mới
                    </button>
                </div>
            </div>
        `;

        // Thêm sự kiện cho nút thêm địa chỉ đầu tiên
        document.getElementById('add-first-address').addEventListener('click', () => {
            this.handleAddAddress();
        });
    }

    createAddressCardHTML(address) {
        const isDefault = address.isDefault;
        const addressType = address.addressType.toLowerCase() === 'company' ? 'Công ty' : 'Nhà riêng';

        return `
            <div class="address-card ${isDefault ? 'default' : ''}" data-id="${address.id}">
                ${isDefault ? '<span class="default-badge">Mặc định</span>' : ''}
                <div class="address-info">
                    <p class="address-type">${addressType}</p>
                    <p class="recipient-name">${address.recipientName || address.fullname}</p>
                    <p class="phone-number">${address.phoneNumber || address.phone}</p>
                    <p class="address-details">
                        ${address.addressLine1 || address.address}, 
                        ${address.wardName || address.ward}, 
                        ${address.districtName || address.district}, 
                        ${address.provinceName || address.province}
                    </p>
                </div>
                <div class="address-actions">
                    <button class="edit-btn">
                        <i class="fas fa-edit"></i> Sửa
                    </button>
                    <button class="delete-btn">
                        <i class="fas fa-trash-alt"></i> Xóa
                    </button>
                    ${!isDefault ? `
                        <button class="set-default-btn">
                            <i class="fas fa-check-circle"></i> Đặt làm mặc định
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    handleAddAddress() {
        // Sử dụng AddressModal để thêm địa chỉ mới
        openAddressModal(null, (newAddress) => {
            // Thêm ID tạm thời cho địa chỉ mới
            newAddress.id = Date.now().toString();

            // Cập nhật danh sách địa chỉ trong localStorage
            const addresses = this.addressService.getUserAddresses();

            // Nếu đặt làm mặc định, cập nhật trạng thái của các địa chỉ khác
            if (newAddress.isDefault) {
                addresses.forEach(address => {
                    address.isDefault = false;
                });
            }

            // Thêm địa chỉ mới vào danh sách
            addresses.push(newAddress);

            // Lưu lại danh sách địa chỉ
            this.addressService.saveUserAddresses(addresses);

            // Tải lại danh sách địa chỉ
            this.loadAddresses();
        });
    }

    handleEditAddress(addressId) {
        // Tìm địa chỉ cần sửa
        const addresses = this.addressService.getUserAddresses();
        const address = addresses.find(addr => parseInt(addr.id) === parseInt(addressId));

        if (!address) {
            alert('Không tìm thấy địa chỉ.');
            return;
        }

        // Mở modal sửa địa chỉ
        openAddressModal(address, (updatedAddress) => {
            // Cập nhật thông tin địa chỉ
            updatedAddress.id = addressId;

            // Cập nhật danh sách địa chỉ
            const addressIndex = addresses.findIndex(addr => parseInt(addr.id) === parseInt(addressId));
            // Nếu đặt làm mặc định, cập nhật trạng thái của các địa chỉ khác
            if (updatedAddress.isDefault && !addresses[addressIndex].isDefault) {
                addresses.forEach(addr => {
                    addr.isDefault = false;
                });
            }

            // Cập nhật địa chỉ
            addresses[addressIndex] = updatedAddress;

            // Lưu lại danh sách địa chỉ
            this.addressService.saveUserAddresses(addresses);

            // Tải lại danh sách địa chỉ
            this.loadAddresses();
        });
    }

    handleDeleteAddress(addressId) {
        // Hiển thị xác nhận xóa
        const confirmDelete = confirm('Bạn có chắc chắn muốn xóa địa chỉ này không?');

        if (!confirmDelete) return;

        // Tìm và xóa địa chỉ
        const addresses = this.addressService.getUserAddresses();
        const addressIndex = addresses.findIndex(addr => parseInt(addr.id) === parseInt(addressId));

        if (addressIndex === -1) {
            alert('Không tìm thấy địa chỉ.');
            return;
        }

        // Nếu xóa địa chỉ mặc định, cần đặt địa chỉ khác làm mặc định
        const isDefault = addresses[addressIndex].isDefault;

        // Xóa địa chỉ
        addresses.splice(addressIndex, 1);

        // Nếu xóa địa chỉ mặc định và còn địa chỉ khác, đặt địa chỉ đầu tiên làm mặc định
        if (isDefault && addresses.length > 0) {
            addresses[0].isDefault = true;
        }

        // Lưu lại danh sách địa chỉ
        this.addressService.saveUserAddresses(addresses);

        // Tải lại danh sách địa chỉ
        this.loadAddresses();
    }

    async handleSetDefaultAddress(addressId) {
        // Tìm địa chỉ cần đặt làm mặc định
        const addresses = this.addressService.getUserAddresses();

        // Cập nhật trạng thái mặc định
        addresses.forEach(address => {
            address.isDefault = (parseInt(address.id) === parseInt(addressId));
        });
        const response = await this.addressService.updateAddress(addresses.find(addr => parseInt(addr.id) === parseInt(addressId)));
        if (response.success) {
            // Lưu lại danh sách địa chỉ
            this.addressService.saveUserAddresses(addresses);

            // Tải lại danh sách địa chỉ
            this.loadAddresses();
        } else {
            alert(response.message);
        }
    }
}