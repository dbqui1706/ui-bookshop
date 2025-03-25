export const SORT_OPTIONS = {
    "ASC": "asc",
    "DESC": "desc"
}

export const SORT_BY_OPTIONS = {
    "TOTAL_BUY": "total_buy",
    "CATEGORIES": "categories",
    "PUBLISHERS": "publishers",
    "PRICE_RANGE": "price_range",
    "RATING": "rating",
}
export class ProductContainer {
    constructor() {
        this.products = [];
        this.filters = {
            page: 1,
            limit: 12,
            sort: SORT_OPTIONS.ASC,
            sortBy: SORT_BY_OPTIONS.TOTAL_BUY,
        }
    }

    async loadProducts() {
        try {

            // Show loading indicator

            // Call API to get products

            // Render products

        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            // Hide loading indicator
        }
    }
}
