// utils/formatter.js
/**
 * Định dạng giá tiền theo tiền tệ Việt Nam
 * @param {number|string} price - Giá cần định dạng
 * @returns {string} - Chuỗi đã định dạng với đơn vị đ
 */
export function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + '<sup>đ</sup>';
}

/**
 * Định dạng ngày tháng
 * @param {Date|string} date - Ngày cần định dạng
 * @param {string} format - Định dạng (mặc định: dd/mm/yyyy)
 * @returns {string} - Chuỗi ngày đã định dạng
 */
export function formatDate(date, format = 'dd/mm/yyyy') {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();

    return format
        .replace('dd', day)
        .replace('mm', month)
        .replace('yyyy', year);
}