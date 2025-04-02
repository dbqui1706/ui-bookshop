export const ERROR_MESSAGES = {
    GENERIC_ERROR: 'Có lỗi xảy ra. Vui lòng thử lại sau.',
    NETWORK_ERROR: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.',
    VALIDATION_ERROR: 'Vui lòng kiểm tra lại thông tin đã nhập.',
    AUTH_ERROR: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
    SERVER_ERROR: 'Máy chủ đang gặp sự cố. Vui lòng thử lại sau.',
};

export const STORAGE_KEYS = {
    USER: 'user',
    TOKEN: 'token',
    THEME: 'theme',
    LANGUAGE: 'language',
    ADDRESS_LIST: 'address',
};

export const VALIDATION = {
    EMAIL_REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    PHONE_REGEX: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
    PASSWORD_MIN_LENGTH: 8,
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 50,
};