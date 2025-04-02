// components/address-selector-modal.js
import { AddressService } from "../service/address-service.js";

export class AddressSelectorModal {
    constructor() {
        this.modalElement = null;
        this.backdropElement = null;
        this.addressService = new AddressService();
        this.addresses = [];
        this.onSelectAddress = null;
        this.selectedAddressId = null;
    }

    /**
     * Hiển thị modal chọn địa chỉ giao hàng
     * @param {Function} onSelectAddress - Callback khi người dùng chọn địa chỉ
     * @param {String|Number} selectedAddressId - ID của địa chỉ đang được chọn (nếu có)
     */
    async show(onSelectAddress = null, selectedAddressId = null) {
        this.onSelectAddress = onSelectAddress;
        this.selectedAddressId = selectedAddressId;
        
        // Tải danh sách địa chỉ
        await this.loadAddresses();
        
        // Tạo và hiển thị modal
        this.createModal();
        document.head.appendChild(this.createModalCSS());
        this.setupEventListeners();
    }

    async loadAddresses() {
        try {
            // Lấy user hiện tại từ localStorage
            const user = JSON.parse(localStorage.getItem('user')) || null;
            
            if (!user || !user.id) {
                this.addresses = [];
                return;
            }
            
            // Thử lấy địa chỉ từ API
            const response = await this.addressService.getAddressByUserId(user.id);
            
            if (response.success) {
                this.addresses = response.data;
            } else {
                // Fallback: Lấy từ localStorage nếu API thất bại
                this.addresses = this.addressService.getUserAddresses();
            }
        } catch (error) {
            console.error('Lỗi khi tải danh sách địa chỉ:', error);
            // Fallback: Lấy từ localStorage nếu có lỗi
            this.addresses = this.addressService.getUserAddresses();
        }
    }

    createModal() {
        // Tạo backdrop
        this.backdropElement = document.createElement('div');
        this.backdropElement.className = 'modal-backdrop';
        document.body.appendChild(this.backdropElement);

        // Tạo modal container
        this.modalElement = document.createElement('div');
        this.modalElement.className = 'address-selector-modal';
        
        // Tạo HTML cho modal
        this.modalElement.innerHTML = `
            <div class="modal-header">
                <h4>Địa chỉ giao hàng</h4>
                <button class="close-modal"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <p class="address-hint">
                    Hãy chọn địa chỉ nhận hàng để được dự báo thời gian giao hàng cùng phí đóng gói, vận chuyển một cách chính xác nhất.
                </p>
                
                ${this.renderAddressList()}
                
                <div class="address-actions">
                    <a href="/client/address-info.html" target="_blank" class="btn-manage-address">
                        <i class="fas fa-plus-circle"></i> Thêm địa chỉ mới
                    </a>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-cancel">Hủy bỏ</button>
                <button class="btn-confirm" ${this.addresses.length === 0 ? 'disabled' : ''}>
                    Giao đến địa chỉ này
                </button>
            </div>
        `;

        document.body.appendChild(this.modalElement);
    }

    renderAddressList() {
        if (this.addresses.length === 0) {
            return `
                <div class="empty-address">
                    <div class="empty-icon">
                        <i class="fas fa-map-marker-alt"></i>
                    </div>
                    <p>Bạn chưa có địa chỉ nào</p>
                    <p class="empty-hint">Vui lòng thêm địa chỉ mới để tiếp tục</p>
                </div>
            `;
        }

        const addressListHTML = this.addresses.map(address => {
            const isDefault = address.isDefault;
            const isSelected = this.selectedAddressId ? 
                address.id.toString() === this.selectedAddressId.toString() : 
                isDefault;
            const addressType = address.addressType === 'COMPANY' ? 'Công ty' : 'Nhà riêng';

            return `
                <div class="address-item ${isSelected ? 'selected' : ''}" data-id="${address.id}">
                    <div class="address-radio">
                        <input type="radio" name="delivery-address" id="address-${address.id}" 
                            ${isSelected ? 'checked' : ''}>
                        <label for="address-${address.id}"></label>
                    </div>
                    <div class="address-content">
                        <div class="address-info">
                            <div class="recipient-info">
                                <span class="recipient-name">${address.recipientName}</span>
                                <span class="address-type">${addressType}</span>
                                ${isDefault ? '<span class="default-badge">Mặc định</span>' : ''}
                            </div>
                            <div class="phone-number">${address.phoneNumber}</div>
                            <div class="address-text">
                                ${address.addressLine1}, 
                                ${address.wardName}, 
                                ${address.districtName}, 
                                ${address.provinceName}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        return `<div class="address-list">${addressListHTML}</div>`;
    }

    createModalCSS() {
        const style = document.createElement('style');
        style.textContent = `
            .modal-backdrop {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 1050;
            }

            .address-selector-modal {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 95%;
                max-width: 600px;
                background-color: white;
                border-radius: 8px;
                z-index: 1100;
                max-height: 90vh;
                display: flex;
                flex-direction: column;
                animation: modalFadeIn 0.3s ease-out;
            }

            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px 20px;
                border-bottom: 1px solid #eee;
                position: sticky;
                top: 0;
                background-color: white;
                border-radius: 8px 8px 0 0;
                z-index: 1;
            }

            .modal-header h4 {
                font-size: 18px;
                font-weight: 500;
                margin: 0;
                color: #212121;
            }

            .close-modal {
                background: none;
                border: none;
                font-size: 20px;
                color: #757575;
                cursor: pointer;
            }

            .modal-body {
                padding: 16px 20px;
                overflow-y: auto;
                flex: 1;
            }

            .address-hint {
                font-size: 14px;
                color: #757575;
                margin-bottom: 16px;
                line-height: 1.5;
            }

            .address-list {
                margin-bottom: 16px;
                max-height: 400px;
                overflow-y: auto;
            }

            .address-item {
                display: flex;
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 16px;
                margin-bottom: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .address-item:hover {
                border-color: #2979ff;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }

            .address-item.selected {
                border-color: #2979ff;
                box-shadow: 0 0 0 1px #2979ff;
                background-color: #f5f9ff;
            }

            .address-radio {
                margin-right: 12px;
                display: flex;
                align-items: flex-start;
                padding-top: 2px;
            }

            .address-radio input[type="radio"] {
                width: 18px;
                height: 18px;
                accent-color: #2979ff;
            }

            .address-content {
                flex: 1;
            }

            .recipient-info {
                margin-bottom: 4px;
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                gap: 8px;
            }

            .recipient-name {
                font-weight: 500;
                font-size: 15px;
                color: #212121;
            }

            .address-type {
                font-size: 12px;
                color: #757575;
                background-color: #f1f1f1;
                padding: 2px 6px;
                border-radius: 4px;
                font-weight: 500;
            }

            .default-badge {
                font-size: 12px;
                color: #2979ff;
                background-color: #e3f2fd;
                padding: 2px 6px;
                border-radius: 4px;
                font-weight: 500;
            }

            .phone-number {
                font-size: 14px;
                color: #212121;
                margin-bottom: 4px;
            }

            .address-text {
                font-size: 14px;
                color: #424242;
                line-height: 1.5;
            }

            .empty-address {
                text-align: center;
                padding: 32px 16px;
                background-color: #f9f9f9;
                border-radius: 8px;
                margin-bottom: 16px;
            }

            .empty-icon {
                font-size: 40px;
                color: #bdbdbd;
                margin-bottom: 16px;
            }

            .empty-hint {
                font-size: 14px;
                color: #757575;
                margin-top: 8px;
            }

            .address-actions {
                display: flex;
                justify-content: center;
                margin-top: 16px;
            }

            .btn-manage-address {
                color: #2979ff;
                text-decoration: none;
                font-size: 14px;
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 12px;
                border-radius: 4px;
                transition: background-color 0.2s;
            }

            .btn-manage-address:hover {
                background-color: #f0f7ff;
            }

            .modal-footer {
                padding: 16px 20px;
                display: flex;
                justify-content: flex-end;
                gap: 12px;
                border-top: 1px solid #eee;
                background-color: white;
                border-radius: 0 0 8px 8px;
            }

            .btn-cancel {
                padding: 10px 20px;
                background-color: #f5f5f5;
                border: none;
                border-radius: 4px;
                color: #424242;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: background-color 0.2s;
            }

            .btn-cancel:hover {
                background-color: #e0e0e0;
            }

            .btn-confirm {
                padding: 10px 20px;
                background-color: #f23f44;
                border: none;
                border-radius: 4px;
                color: white;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: background-color 0.2s;
            }

            .btn-confirm:hover {
                background-color: #e03238;
            }

            .btn-confirm:disabled {
                background-color: #ffcdd2;
                cursor: not-allowed;
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

            @media (max-width: 576px) {
                .address-selector-modal {
                    width: 100%;
                    height: 100%;
                    max-height: 100%;
                    border-radius: 0;
                    top: 0;
                    left: 0;
                    transform: none;
                }
                
                .modal-header, .modal-footer {
                    border-radius: 0;
                }
                
                .address-list {
                    max-height: none;
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

        // Xử lý click vào item địa chỉ
        const addressItems = this.modalElement.querySelectorAll('.address-item');
        addressItems.forEach(item => {
            item.addEventListener('click', () => {
                const addressId = item.getAttribute('data-id');
                this.selectAddress(addressId);
            });
        });

        // Xử lý nút xác nhận
        const confirmBtn = this.modalElement.querySelector('.btn-confirm');
        confirmBtn.addEventListener('click', () => {
            if (this.addresses.length === 0) return;
            
            // Lấy địa chỉ đang được chọn
            const selectedItem = this.modalElement.querySelector('.address-item.selected');
            if (!selectedItem) return;
            
            const addressId = selectedItem.getAttribute('data-id');
            const selectedAddress = this.addresses.find(addr => addr.id.toString() === addressId);
            
            if (selectedAddress && this.onSelectAddress) {
                this.onSelectAddress(selectedAddress);
            }
            
            this.close();
        });
    }

    selectAddress(addressId) {
        const addressItems = this.modalElement.querySelectorAll('.address-item');
        addressItems.forEach(item => {
            const isSelected = parseInt(item.getAttribute('data-id')) === parseInt(addressId);
            item.classList.toggle('selected', isSelected);
            
            const radio = item.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = isSelected;
            }
        });
        
        // Đảm bảo nút xác nhận được kích hoạt
        const confirmBtn = this.modalElement.querySelector('.btn-confirm');
        if (confirmBtn) {
            confirmBtn.disabled = false;
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
 * Hiển thị modal chọn địa chỉ giao hàng
 * @param {Function} onSelectAddress - Callback khi người dùng chọn địa chỉ
 * @param {String|Number} selectedAddressId - ID của địa chỉ đang được chọn (nếu có)
 */
export function openAddressSelectorModal(onSelectAddress = null, selectedAddressId = null) {
    const modal = new AddressSelectorModal();
    modal.show(onSelectAddress, selectedAddressId);
}