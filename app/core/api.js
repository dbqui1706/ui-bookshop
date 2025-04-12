/**
 * Class ApiService - Service xử lý các HTTP requests tới server API
 */
import { getToken } from "./storage.js";

export class ApiService {
    /**
     * Khởi tạo ApiService
     * @param {string} baseUrl - Base URL của API server
     */
    constructor(baseUrl = 'http://localhost:8080') {
        this.baseUrl = baseUrl;
        this.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${getToken()}` // Lấy token từ localStorage
        };
    }

    /**
     * Thực hiện HTTP request
     * @param {string} endpoint - API endpoint
     * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
     * @param {Object} data - Dữ liệu gửi đi (cho POST, PUT)
     * @param {Object} params - Query parameters
     * @returns {Promise<any>} - Promise kết quả từ API
     */
    async request(endpoint, method = 'POST', data = null, params = null) {
        try {
            // Xây dựng URL
            let url = `${this.baseUrl}${endpoint}`;
            
            // Thêm query parameters nếu có
            if (params) {
                const queryParams = new URLSearchParams();
                Object.keys(params).forEach(key => {
                    if (params[key] !== null && params[key] !== undefined) {
                        queryParams.append(key, params[key]);
                    }
                });
                
                const queryString = queryParams.toString();
                if (queryString) {
                    url += `?${queryString}`;
                }
            }
            
            // Cấu hình request
            const config = {
                method,
                headers: this.headers,
            };
            
            // Thêm body nếu là POST, PUT
            if (['POST', 'PUT'].includes(method) && data) {
                config.body = JSON.stringify(data);
            }
            
            // Gửi request
            const response = await fetch(url, config);
            
            // Parse JSON response
            const result = await response.json();
            
            // Kiểm tra status code
            if (!response.ok) {
                // Trả về lỗi với thông tin từ server
                throw new Error(result.message || 'Lỗi từ server');
            }
            
            return result;
        } catch (error) {
            console.error('API request error:', error);
            throw error;
        }
    }

    /**
     * Gửi GET request
     * @param {string} endpoint - API endpoint
     * @param {Object} params - Query parameters
     * @returns {Promise<any>} - Promise kết quả từ API
     */
    async get(endpoint, params = null) {
        return this.request(endpoint, 'GET', null, params);
    }

    /**
     * Gửi POST request
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Dữ liệu gửi đi
     * @param {Object} params - Query parameters
     * @returns {Promise<any>} - Promise kết quả từ API
     */
    async post(endpoint, data, params = null) {
        return this.request(endpoint, 'POST', data, params);
    }

    /**
     * Gửi PUT request
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Dữ liệu gửi đi
     * @param {Object} params - Query parameters
     * @returns {Promise<any>} - Promise kết quả từ API
     */
    async put(endpoint, data, params = null) {
        return this.request(endpoint, 'PUT', data, params);
    }

    /**
     * Gửi DELETE request
     * @param {string} endpoint - API endpoint
     * @param {Object} params - Query parameters
     * @returns {Promise<any>} - Promise kết quả từ API
     */
    async delete(endpoint, params = null) {
        return this.request(endpoint, 'DELETE', null, params);
    }

    /**
     * Thêm header cho request
     * @param {string} key - Tên header
     * @param {string} value - Giá trị header
     */
    setHeader(key, value) {
        this.headers[key] = value;
    }

    /**
     * Xóa header
     * @param {string} key - Tên header cần xóa
     */
    removeHeader(key) {
        delete this.headers[key];
    }
}

// Tạo single instance của ApiService
const API_BASE_URL = 'http://localhost:8080/'; // URL gốc của API, để trống nếu cùng domain
export const api = new ApiService(API_BASE_URL);