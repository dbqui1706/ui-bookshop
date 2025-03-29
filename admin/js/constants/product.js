export const stockFilterMap = {
    DEFAULT: "Tất cả",
    AVAILABLE: "Còn hàng",
    ALMOST_OUT_OF_STOCK: "Sắp hết",
    OUT_OF_STOCK: "Hết hàng"
};

export const badgeStockMap = {
    'AVAILABLE': `<span class="badge bg-success">Còn hàng</span>`,
    'ALMOST_OUT_OF_STOCK': `<span class="badge bg-warning text-dark">Sắp hết</span>`,
    'OUT_OF_STOCK': `<span class="badge bg-danger">Hết hàng</span>`
};

export const sortOptionMap = {
    DEFAULT: "Mặc định",
    PRICE_ASC: "Giá tăng dần",
    PRICE_DESC: "Giá giảm dần",
    NAME_ASC: "Tên A-Z",
    NAME_DESC: "Tên Z-A",
    POPULARITY_ASC: "Phổ biến nhất",
    CREATED_AT_ASC: "Cũ nhất",
    CREATED_AT_DESC: "Mới nhất"
};