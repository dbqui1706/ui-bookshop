export class Utils {
    // Format price
    static formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    }

    // Format number
    static formatNumber(number) {
        if (number >= 1000) {
            return (number / 1000).toFixed(1) + 'k';
        }
        return number.toString();
    }

    // Create rating stars
    static createRatingStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return `
            ${'<i class="fas fa-star"></i>'.repeat(fullStars)}
            ${hasHalfStar ? '<i class="fas fa-star-half-alt"></i>' : ''}
            ${'<i class="far fa-star"></i>'.repeat(emptyStars)}
        `;
    }

    // Get initials
    static getInitials(name) {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    // Get rating label
    static getRatingLabel(rating) {
        const labels = {
            5: 'Cực kì hài lòng',
            4: 'Hài lòng',
            3: 'Bình thường',
            2: 'Không hài lòng',
            1: 'Rất không hài lòng'
        };
        return labels[rating] || '';
    }
}