/**
 * Class InventoryMovementData - Mô hình dữ liệu cho biến động nhập xuất kho
 */
export class InventoryMovementData {
    constructor(data = {}) {
        this.periodDate = data.periodDate || '';
        this.periodLabel = data.periodLabel || '';
        this.importQuantity = data.importQuantity || 0;
        this.importValue = data.importValue || 0;
        this.exportQuantity = data.exportQuantity || 0;
        this.exportValue = data.exportValue || 0;
        this.netQuantityChange = data.netQuantityChange || 0;
        this.netValueChange = data.netValueChange || 0;
    }
}

/**
 * Class InventoryHistoryItem - Mô hình dữ liệu cho lịch sử kho
 */
export class InventoryHistoryItem {
    constructor(data = {}) {
        this.id = data.id || 0;
        this.createdAt = data.createdAt || new Date();
        this.productId = data.productId || 0;
        this.productName = data.productName || '';
        this.productImage = data.productImage || '';
        this.actionType = data.actionType || 'import';
        this.previousQuantity = data.previousQuantity || 0;
        this.quantityChange = data.quantityChange || 0;
        this.currentQuantity = data.currentQuantity || 0;
        this.reason = data.reason || '';
        this.referenceId = data.referenceId || null;
        this.referenceType = data.referenceType || '';
        this.notes = data.notes || '';
        this.createdByName = data.createdByName || '';
    }
}

/**
 * Class CategoryMovementRatio - Mô hình dữ liệu cho tỷ lệ xuất nhập theo danh mục
 */
export class CategoryMovementRatio {
    constructor(data = {}) {
        this.categoryId = data.categoryId || 0;
        this.categoryName = data.categoryName || '';
        this.importQuantity = data.importQuantity || 0;
        this.importValue = data.importValue || 0;
        this.exportQuantity = data.exportQuantity || 0;
        this.exportValue = data.exportValue || 0;
        this.currentQuantity = data.currentQuantity || 0;
        this.currentValue = data.currentValue || 0;
        this.movementRatio = data.movementRatio || 0;
    }
}

/**
 * Class InventoryMovementSummary - Mô hình dữ liệu cho tổng quan biến động kho
 */
export class InventoryMovementSummary {
    constructor(data = {}) {
        this.importQty30days = data.importQty30days || 0;
        this.exportQty30days = data.exportQty30days || 0;
        this.importValue30days = data.importValue30days || 0;
        this.exportValue30days = data.exportValue30days || 0;
        this.importQtyPrev30days = data.importQtyPrev30days || 0;
        this.exportQtyPrev30days = data.exportQtyPrev30days || 0;
        this.adjustmentQty30days = data.adjustmentQty30days || 0;
        this.highTurnoverProducts = data.highTurnoverProducts || 0;
        this.noMovementProducts = data.noMovementProducts || 0;
        
        // Tính % thay đổi
        this.importQtyChangePercent = this.calculateChangePercent(this.importQty30days, this.importQtyPrev30days);
        this.exportQtyChangePercent = this.calculateChangePercent(this.exportQty30days, this.exportQtyPrev30days);
    }
    
    /**
     * Tính phần trăm thay đổi
     */
    calculateChangePercent(current, previous) {
        if (previous === 0) return 100;
        return ((current - previous) / previous * 100).toFixed(1);
    }
}