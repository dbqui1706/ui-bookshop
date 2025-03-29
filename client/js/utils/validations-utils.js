import { VALIDATION } from '../constants/index.js';

/**
 * Kiểm tra email có hợp lệ không
 * @param {string} email Email cần kiểm tra
 * @returns {boolean} Kết quả kiểm tra
 */
export function isValidEmail(email) {
    return VALIDATION.EMAIL_REGEX.test(email);
}

/**
 * Kiểm tra số điện thoại có hợp lệ không
 * @param {string} phone Số điện thoại cần kiểm tra
 * @returns {boolean} Kết quả kiểm tra
 */
export function isValidPhone(phone) {
    return VALIDATION.PHONE_REGEX.test(phone);
}

/**
 * Kiểm tra mật khẩu có đủ mạnh không
 * @param {string} password Mật khẩu cần kiểm tra
 * @returns {Object} Kết quả kiểm tra và thông báo
 */
export function validatePassword(password) {
    const result = {
        isValid: true,
        message: ''
    };

    if (!password || password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
        result.isValid = false;
        result.message = `Mật khẩu phải có ít nhất ${VALIDATION.PASSWORD_MIN_LENGTH} ký tự`;
        return result;
    }

    // Kiểm tra có ít nhất 1 chữ hoa
    if (!/[A-Z]/.test(password)) {
        result.isValid = false;
        result.message = 'Mật khẩu phải có ít nhất 1 chữ hoa';
        return result;
    }

    // Kiểm tra có ít nhất 1 chữ thường
    if (!/[a-z]/.test(password)) {
        result.isValid = false;
        result.message = 'Mật khẩu phải có ít nhất 1 chữ thường';
        return result;
    }

    // Kiểm tra có ít nhất 1 số
    if (!/[0-9]/.test(password)) {
        result.isValid = false;
        result.message = 'Mật khẩu phải có ít nhất 1 số';
        return result;
    }

    // Kiểm tra có ít nhất 1 ký tự đặc biệt
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        result.isValid = false;
        result.message = 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt';
        return result;
    }

    return result;
}

/**
 * Kiểm tra họ tên có hợp lệ không
 * @param {string} name Họ tên cần kiểm tra
 * @returns {Object} Kết quả kiểm tra và thông báo
 */
export function validateFullName(name) {
    const result = {
        isValid: true,
        message: ''
    };

    if (!name || name.trim() === '') {
        result.isValid = false;
        result.message = 'Họ tên không được để trống';
        return result;
    }

    if (name.length < VALIDATION.NAME_MIN_LENGTH) {
        result.isValid = false;
        result.message = `Họ tên phải có ít nhất ${VALIDATION.NAME_MIN_LENGTH} ký tự`;
        return result;
    }

    if (name.length > VALIDATION.NAME_MAX_LENGTH) {
        result.isValid = false;
        result.message = `Họ tên không được vượt quá ${VALIDATION.NAME_MAX_LENGTH} ký tự`;
        return result;
    }

    // Kiểm tra họ tên chỉ chứa chữ cái và khoảng trắng
    if (!/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/.test(name)) {
        result.isValid = false;
        result.message = 'Họ tên chỉ được chứa chữ cái và khoảng trắng';
        return result;
    }

    return result;
}

/**
 * Kiểm tra mã PIN có hợp lệ không
 * @param {string} pin Mã PIN cần kiểm tra
 * @returns {Object} Kết quả kiểm tra và thông báo
 */
export function validatePIN(pin) {
    const result = {
        isValid: true,
        message: ''
    };

    if (!pin || pin.trim() === '') {
        result.isValid = false;
        result.message = 'Mã PIN không được để trống';
        return result;
    }

    // Kiểm tra PIN có đúng 6 số không
    if (!/^\d{6}$/.test(pin)) {
        result.isValid = false;
        result.message = 'Mã PIN phải có đúng 6 số';
        return result;
    }

    // Kiểm tra PIN không được chứa dãy số liên tiếp hoặc lặp lại
    if (/012345|123456|234567|345678|456789|987654|876543|765432|654321|543210|000000|111111|222222|333333|444444|555555|666666|777777|888888|999999/.test(pin)) {
        result.isValid = false;
        result.message = 'Mã PIN không được chứa dãy số liên tiếp hoặc lặp lại';
        return result;
    }

    return result;
}

/**
 * Kiểm tra nickname có hợp lệ không
 * @param {string} nickname Nickname cần kiểm tra
 * @returns {Object} Kết quả kiểm tra và thông báo
 */
export function validateNickname(nickname) {
    const result = {
        isValid: true,
        message: ''
    };

    // Nếu nickname trống, vẫn hợp lệ (không bắt buộc)
    if (!nickname || nickname.trim() === '') {
        return result;
    }

    if (nickname.length < 2) {
        result.isValid = false;
        result.message = 'Nickname phải có ít nhất 2 ký tự';
        return result;
    }

    if (nickname.length > 20) {
        result.isValid = false;
        result.message = 'Nickname không được vượt quá 20 ký tự';
        return result;
    }

    // Kiểm tra nickname chỉ chứa chữ cái, số và gạch dưới
    if (!/^[a-zA-Z0-9_]+$/.test(nickname)) {
        result.isValid = false;
        result.message = 'Nickname chỉ được chứa chữ cái, số và gạch dưới';
        return result;
    }

    return result;
}

/**
 * Tạo các thông báo lỗi cho form
 * @param {string} fieldId ID của field cần hiển thị lỗi
 * @param {string} message Thông báo lỗi
 */
export function showValidationError(fieldId, message) {
    // Tìm field
    const field = document.getElementById(fieldId);
    if (!field) return;

    // Thêm class lỗi
    field.classList.add('is-invalid');

    // Tạo hoặc cập nhật thông báo lỗi
    let errorDiv = field.nextElementSibling;
    if (!errorDiv || !errorDiv.classList.contains('invalid-feedback')) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        field.parentNode.insertBefore(errorDiv, field.nextSibling);
    }

    errorDiv.textContent = message;
}

/**
 * Xóa thông báo lỗi cho field
 * @param {string} fieldId ID của field cần xóa lỗi
 */
export function clearValidationError(fieldId) {
    // Tìm field
    const field = document.getElementById(fieldId);
    if (!field) return;

    // Xóa class lỗi
    field.classList.remove('is-invalid');

    // Xóa thông báo lỗi nếu có
    const errorDiv = field.nextElementSibling;
    if (errorDiv && errorDiv.classList.contains('invalid-feedback')) {
        errorDiv.textContent = '';
    }
}

/**
 * Xóa tất cả thông báo lỗi trong một form
 * @param {string} formId ID của form cần xóa lỗi
 */
export function clearAllValidationErrors(formId) {
    // Tìm form
    const form = document.getElementById(formId);
    if (!form) return;

    // Xóa tất cả class lỗi
    const invalidFields = form.querySelectorAll('.is-invalid');
    invalidFields.forEach(field => {
        field.classList.remove('is-invalid');
    });

    // Xóa tất cả thông báo lỗi
    const errorDivs = form.querySelectorAll('.invalid-feedback');
    errorDivs.forEach(div => {
        div.textContent = '';
    });
}