// service/address-service.js
import { STORAGE_KEYS } from "../constants/index.js";

const API_BASE_URL = {
    GET_USER_ADDRESS: 'http://localhost:8080/api/address',
    UPDATE_USER_ADDRESS: 'http://localhost:8080/api/address/update',
    DELETE_USER_ADDRESS: 'http://localhost:8080/api/address/delete',
    ADD_USER_ADDRESS: 'http://localhost:8080/api/address/add',
}

const HEADERS = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem(STORAGE_KEYS.TOKEN)}`,
}

export class AddressService {
    constructor() {
        this.apiBaseUrl = 'https://provinces.open-api.vn/api';
    }

    /**
     * Lấy danh sách tỉnh/thành phố
     * @returns {Promise<Array>} - Danh sách tỉnh/thành phố
     */
    async getProvinces() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/?depth=1`);
            
            if (!response.ok) {
                throw new Error('Không thể tải dữ liệu tỉnh/thành phố');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Lỗi khi tải danh sách tỉnh/thành phố:', error);
            throw error;
        }
    }

    /**
     * Lấy danh sách quận/huyện theo mã tỉnh/thành phố
     * @param {string|number} provinceCode - Mã tỉnh/thành phố
     * @returns {Promise<Array>} - Danh sách quận/huyện
     */
    async getDistricts(provinceCode) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/p/${provinceCode}?depth=2`);
            
            if (!response.ok) {
                throw new Error('Không thể tải dữ liệu quận/huyện');
            }
            
            const provinceData = await response.json();
            return provinceData.districts || [];
        } catch (error) {
            console.error('Lỗi khi tải danh sách quận/huyện:', error);
            throw error;
        }
    }

    /**
     * Lấy danh sách phường/xã theo mã quận/huyện
     * @param {string|number} districtCode - Mã quận/huyện
     * @returns {Promise<Array>} - Danh sách phường/xã
     */
    async getWards(districtCode) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/d/${districtCode}?depth=2`);
            
            if (!response.ok) {
                throw new Error('Không thể tải dữ liệu phường/xã');
            }
            
            const districtData = await response.json();
            return districtData.wards || [];
        } catch (error) {
            console.error('Lỗi khi tải danh sách phường/xã:', error);
            throw error;
        }
    }

    /**
     * Lấy thông tin chi tiết của một tỉnh/thành phố
     * @param {string|number} provinceCode - Mã tỉnh/thành phố
     * @returns {Promise<Object>} - Thông tin chi tiết tỉnh/thành phố
     */
    async getProvinceDetail(provinceCode) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/p/${provinceCode}`);
            
            if (!response.ok) {
                throw new Error('Không thể tải thông tin tỉnh/thành phố');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Lỗi khi tải thông tin tỉnh/thành phố:', error);
            throw error;
        }
    }

    /**
     * Lấy thông tin chi tiết của một quận/huyện
     * @param {string|number} districtCode - Mã quận/huyện
     * @returns {Promise<Object>} - Thông tin chi tiết quận/huyện
     */
    async getDistrictDetail(districtCode) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/d/${districtCode}`);
            
            if (!response.ok) {
                throw new Error('Không thể tải thông tin quận/huyện');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Lỗi khi tải thông tin quận/huyện:', error);
            throw error;
        }
    }

    /**
     * Lấy thông tin chi tiết của một phường/xã
     * @param {string|number} wardCode - Mã phường/xã
     * @returns {Promise<Object>} - Thông tin chi tiết phường/xã
     */
    async getWardDetail(wardCode) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/w/${wardCode}`);
            
            if (!response.ok) {
                throw new Error('Không thể tải thông tin phường/xã');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Lỗi khi tải thông tin phường/xã:', error);
            throw error;
        }
    }

    /**
     * Lưu địa chỉ giao hàng vào localStorage
     * @param {Object} address - Thông tin địa chỉ giao hàng
     */
    saveShippingAddress(address) {
        try {
            localStorage.setItem('shippingAddress', JSON.stringify(address));
            return true;
        } catch (error) {
            console.error('Lỗi khi lưu địa chỉ giao hàng:', error);
            return false;
        }
    }

    /**
     * Lấy địa chỉ giao hàng từ localStorage
     * @returns {Object|null} - Thông tin địa chỉ giao hàng hoặc null nếu không có
     */
    getShippingAddress() {
        try {
            const addressData = localStorage.getItem('shippingAddress');
            return addressData ? JSON.parse(addressData) : null;
        } catch (error) {
            console.error('Lỗi khi đọc địa chỉ giao hàng:', error);
            return null;
        }
    }

    /**
     * Lưu danh sách địa chỉ của người dùng vào localStorage
     * @param {Array} addresses - Danh sách địa chỉ
     */
    saveUserAddresses(addresses) {
        try {
            localStorage.setItem('userAddresses', JSON.stringify(addresses));
            return true;
        } catch (error) {
            console.error('Lỗi khi lưu danh sách địa chỉ:', error);
            return false;
        }
    }

    /**
     * Lấy danh sách địa chỉ của người dùng từ localStorage
     * @returns {Array} - Danh sách địa chỉ hoặc mảng rỗng nếu không có
     */
    getUserAddresses() {
        try {
            const addressesData = localStorage.getItem('userAddresses');
            return addressesData ? JSON.parse(addressesData) : [];
        } catch (error) {
            console.error('Lỗi khi đọc danh sách địa chỉ:', error);
            return [];
        }
    }
    

    async getAddressByUserId(userId) {
        try {
            const response = await fetch(`${API_BASE_URL.GET_USER_ADDRESS}`, {
                method: 'GET',
                headers: HEADERS,
            });
            if (!response.ok) {
                return {
                    success: false,
                    message: 'Không thể tải danh sách địa chỉ'
                }
            }
            return {
                success: true,
                data: await response.json()
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách địa chỉ:', error);
            return {
                success: false,
                message: 'Lỗi khi lấy danh sách địa chỉ'
            }
        }
    }

    async updateAddress(address) {
        try {
            const response = await fetch(`${API_BASE_URL.UPDATE_USER_ADDRESS}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'  
                },
                body: JSON.stringify(address)
            });
            if (!response.ok) {
                return {
                    success: false,
                    message: 'Không thể cập nhật địa chỉ'   
                }
            }
            return {
                success: true,
                data: await response.json()
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật địa chỉ:', error);
            return {
                success: false,
                message: 'Lỗi khi cập nhật địa chỉ'
            }
        }
    }
}