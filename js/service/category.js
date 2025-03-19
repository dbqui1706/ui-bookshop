// ==========================================================
// category.js 
// ==========================================================

export const API_URLS = {
    CATEGORIES: "http://localhost:8080/admin2/api/product/product-category",
};

export const getCategory = async () => {
    try {
        const response = await fetch(API_URLS.CATEGORIES, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json;charset=UTF-8",
            },
        });
        if (response.status === 200) {
            return await response.json();
        }
        return {};
    } catch (error) {
        console.log(error);
        return {};
    }
}