// service/coupon-service.js
export class CouponService {
    constructor() {
        this.baseUrl = {
            GET_AVAILABLE_COUPONS: 'http://localhost:8080/api/coupons',
            APPLY_COUPON: 'http://localhost:8080/api/coupons/apply'
        };
    }
    
    /**
     * Lấy danh sách mã giảm giá khả dụng
     * @param {Number} userId - ID người dùng
     * @param {Number} orderValue - Giá trị đơn hàng
     * @returns {Promise<Object>} - Kết quả trả về
     */
    async getAvailableCoupons(userId, orderValue) {
        try {
            const response = await fetch(`${this.baseUrl.GET_AVAILABLE_COUPONS}?userId=${userId}&orderValue=${orderValue}`);
            
            if (!response.ok) {
                throw new Error('Không thể tải danh sách mã giảm giá');
            }
            
            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            console.error('Lỗi khi tải danh sách mã giảm giá:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }
    
    /**
     * Kiểm tra và áp dụng mã giảm giá
     * @param {String} code - Mã giảm giá
     * @param {Number} orderValue - Giá trị đơn hàng
     * @param {Number} userId - ID người dùng
     * @returns {Promise<Object>} - Kết quả trả về
     */
    async applyCoupon(code, orderValue, userId) {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    code,
                    orderValue,
                    userId
                })
            });
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Lỗi khi áp dụng mã giảm giá:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra khi áp dụng mã giảm giá'
            };
        }
    }
}