export class Filter {
    constructor() {
        this.categories = [];
        this.publishers = [];
        this.priceRange = {
            from: null,
            to: null
        };
        this.rating = null;
        this.services = [];
        this.sortBy = 'popular'; // Mặc định sắp xếp theo phổ biến
        this.page = 1;
        this.limit = 12;
        this.searchTerm = '';
    }

    setCategories(categories) {
        this.categories = categories;
    }

    setPublishers(publishers) {
        this.publishers = publishers;
    }

    setPriceRange(from, to) {
        this.priceRange = { from, to };
    }

    setRating(rating) {
        this.rating = rating;
    }

    setServices(services) {
        this.services = services;
    }

    setSortBy(sortBy) {
        this.sortBy = sortBy;
    }

    setPage(page) {
        this.page = page;
    }

    setSearchTerm(searchTerm) {
        this.searchTerm = searchTerm;
    }

    toQueryParams() {
        const params = {};
        
        if (this.searchTerm) params.q = this.searchTerm;
        if (this.categories.length) params.categories = this.categories.join(',');
        if (this.publishers.length) params.publishers = this.publishers.join(',');
        if (this.priceRange.from !== null) params.priceFrom = this.priceRange.from;
        if (this.priceRange.to !== null) params.priceTo = this.priceRange.to;
        if (this.rating) params.rating = this.rating;
        if (this.services.length) params.services = this.services.join(',');
        if (this.sortBy) params.sortBy = this.sortBy;
        
        params.page = this.page;
        params.limit = this.limit;

        return params;
    }

    reset() {
        this.categories = [];
        this.publishers = [];
        this.priceRange = { from: null, to: null };
        this.rating = null;
        this.services = [];
        this.sortBy = 'popular';
        this.page = 1;
        this.searchTerm = '';
    }
}