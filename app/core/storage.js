// assets/js/utils/storage.js

// Local storage keys
const STORAGE_KEYS = {
    USER: 'user',
    TOKEN: 'token',
    CART: 'cart'
};

/**
 * Lưu thông tin người dùng vào localStorage
 * @param {object} user - Thông tin người dùng
 */
export const saveUser = (user) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

/**
 * Lấy thông tin người dùng từ localStorage
 * @returns {object|null} - Thông tin người dùng hoặc null nếu chưa đăng nhập
 */
export const getUser = () => {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
};

/**
 * Xóa thông tin người dùng khỏi localStorage
 */
export const removeUser = () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
};

/**
 * Lưu token vào localStorage
 * @param {string} token - Access token
 */
export const saveToken = (token) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
};

/**
 * Lấy token từ localStorage
 * @returns {string|null} - Token hoặc null nếu chưa đăng nhập
 */
export const getToken = () => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

/**
 * Xóa token khỏi localStorage
 */
export const removeToken = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
};

/**
 * Kiểm tra người dùng đã đăng nhập chưa
 * @returns {boolean} - true nếu đã đăng nhập, false nếu chưa
 */
export const isAuthenticated = () => {
    return getToken() !== null && getUser() !== null;
};

/**
 * Lưu giỏ hàng vào localStorage
 * @param {object} cart - Thông tin giỏ hàng
 */
export const saveCart = (cart) => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
};

/**
 * Lấy giỏ hàng từ localStorage
 * @returns {object} - Thông tin giỏ hàng hoặc giỏ hàng trống
 */
export const getCart = () => {
    const cart = localStorage.getItem(STORAGE_KEYS.CART);
    return cart ? JSON.parse(cart) : { items: [], total: 0 };
};

/**
 * Xóa giỏ hàng khỏi localStorage
 */
export const clearCart = () => {
    localStorage.removeItem(STORAGE_KEYS.CART);
};

export default {
    saveUser,
    getUser,
    removeUser,
    saveToken,
    getToken,
    removeToken,
    isAuthenticated,
    saveCart,
    getCart,
    clearCart
};