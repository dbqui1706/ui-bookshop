// utils/dom-utils.js
/**
 * Tạo và chèn element vào DOM
 * @param {string} tag - Loại tag HTML
 * @param {Object} attributes - Các thuộc tính của element
 * @param {string|Node} content - Nội dung HTML hoặc Node
 * @param {Element} parent - Element cha để chèn vào
 * @returns {Element} - Element đã tạo
 */
export function createElement(tag, attributes = {}, content = '', parent = null) {
    const element = document.createElement(tag);
    
    // Thêm các thuộc tính
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'innerHTML') {
            element.innerHTML = value;
        } else {
            element.setAttribute(key, value);
        }
    });
    
    // Thêm nội dung
    if (content) {
        if (typeof content === 'string') {
            element.innerHTML = content;
        } else {
            element.appendChild(content);
        }
    }
    
    // Chèn vào parent nếu có
    if (parent) {
        parent.appendChild(element);
    }
    
    return element;
}

/**
 * Copy text vào clipboard
 * @param {string} text - Text cần copy
 * @returns {Promise} - Promise hoàn thành khi copy xong
 */
export function copyToClipboard(text) {
    return navigator.clipboard.writeText(text).catch(() => {
        // Fallback cho các trình duyệt cũ
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return Promise.resolve();
        } catch (err) {
            document.body.removeChild(textArea);
            return Promise.reject(err);
        }
    });
}