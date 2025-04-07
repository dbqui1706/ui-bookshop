// assets/js/api/httpClient.js

import { getToken, removeToken, removeUser } from '../utils/storage.js';

// API Base URL
const API_BASE_URL = 'http://localhost:8080/api';

// Loại API không cần xác thực
const PUBLIC_ENDPOINTS = [
    '/auth/login',
    '/auth/register',
    '/products',
    '/product',
    '/categories',
    '/category/publishers'
];

/**
 * Kiểm tra xem API có cần xác thực không
 * @param {string} url - URL của API
 * @returns {boolean} - true nếu cần xác thực, false nếu không
 */
const requiresAuth = (url) => {
    return !PUBLIC_ENDPOINTS.some(endpoint => url.includes(endpoint));
};

/**
 * Thêm token vào request options
 * @param {object} options - Request options
 * @returns {object} - Request options với token
 */
const addAuthHeader = (options = {}) => {
    const token = getToken();
    
    if (!token) {
        return options;
    }
    
    // Tạo headers object nếu chưa có
    if (!options.headers) {
        options.headers = {};
    }
    
    // Thêm Authorization header
    options.headers.Authorization = `Bearer ${token}`;
    
    return options;
};

/**
 * Thêm token vào URL nếu là GET request
 * @param {string} url - URL gốc
 * @param {object} options - Request options
 * @returns {string} - URL với token (nếu cần)
 */
const addTokenToUrl = (url, options = {}) => {
    // Chỉ thêm vào URL nếu là GET request
    if (options.method && options.method !== 'GET') {
        return url;
    }
    
    const token = getToken();
    
    if (!token) {
        return url;
    }
    
    // Thêm token vào query string
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}token=${token}`;
};

/**
 * Xử lý response từ API
 * @param {Response} response - Fetch API Response object
 * @returns {Promise} - Promise với dữ liệu hoặc lỗi
 */
const handleResponse = async (response) => {
    // Nếu status là 401 Unauthorized, đăng xuất người dùng
    if (response.status === 401) {
        console.log('Unauthorized request, logging out...');
        // Xóa token và thông tin người dùng
        removeToken();
        removeUser();
        
        // Chuyển hướng về trang đăng nhập nếu không phải đang ở đó
        if (!window.location.href.includes('login.html')) {
            window.location.href = '/login.html?session_expired=true';
            return Promise.reject(new Error('Phiên làm việc hết hạn'));
        }
    }
    
    // Parse JSON nếu có thể
    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
        data = await response.json();
    } else {
        data = await response.text();
    }
    
    // Trả về lỗi nếu response không OK
    if (!response.ok) {
        const error = {
            status: response.status,
            message: data.error || 'Có lỗi xảy ra',
            data: data
        };
        return Promise.reject(error);
    }
    
    return data;
};

/**
 * HTTP client cho API requests
 */
const httpClient = {
    /**
     * GET request
     * @param {string} endpoint - API endpoint (không cần base URL)
     * @param {object} options - Fetch API options
     * @returns {Promise} - Promise với response data
     */
    async get(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const needsAuth = requiresAuth(endpoint);
        
        // Thiết lập options
        options.method = 'GET';
        options.credentials = 'include';
        
        // Thêm token nếu cần
        if (needsAuth) {
            options = addAuthHeader(options);
            const urlWithToken = addTokenToUrl(url, options);
            console.log(`Making authenticated GET request to ${endpoint}`);
            return fetch(urlWithToken, options).then(handleResponse);
        }
        
        console.log(`Making public GET request to ${endpoint}`);
        return fetch(url, options).then(handleResponse);
    },
    
    /**
     * POST request
     * @param {string} endpoint - API endpoint (không cần base URL)
     * @param {object} data - Dữ liệu gửi đi
     * @param {object} options - Fetch API options
     * @returns {Promise} - Promise với response data
     */
    async post(endpoint, data, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const needsAuth = requiresAuth(endpoint);
        
        // Thiết lập options
        options.method = 'POST';
        options.credentials = 'include';
        options.headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        // Thêm dữ liệu vào body
        options.body = JSON.stringify(data);
        
        // Thêm token nếu cần
        if (needsAuth) {
            options = addAuthHeader(options);
            console.log(`Making authenticated POST request to ${endpoint}`);
            return fetch(url, options).then(handleResponse);
        }
        
        console.log(`Making public POST request to ${endpoint}`);
        return fetch(url, options).then(handleResponse);
    },
    
    /**
     * PUT request
     * @param {string} endpoint - API endpoint (không cần base URL)
     * @param {object} data - Dữ liệu gửi đi
     * @param {object} options - Fetch API options
     * @returns {Promise} - Promise với response data
     */
    async put(endpoint, data, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        
        // Luôn cần xác thực cho PUT requests
        options.method = 'PUT';
        options.credentials = 'include';
        options.headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        // Thêm dữ liệu vào body
        options.body = JSON.stringify(data);
        
        // Thêm token
        options = addAuthHeader(options);
        
        console.log(`Making authenticated PUT request to ${endpoint}`);
        return fetch(url, options).then(handleResponse);
    },
    
    /**
     * DELETE request
     * @param {string} endpoint - API endpoint (không cần base URL)
     * @param {object} options - Fetch API options
     * @returns {Promise} - Promise với response data
     */
    async delete(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        
        // Luôn cần xác thực cho DELETE requests
        options.method = 'DELETE';
        options.credentials = 'include';
        
        // Thêm token
        options = addAuthHeader(options);
        
        console.log(`Making authenticated DELETE request to ${endpoint}`);
        return fetch(url, options).then(handleResponse);
    }
};

export default httpClient;