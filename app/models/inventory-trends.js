export class InventoryTrend {
    constructor() {
        this.label = '';
        this.value = 0;
    }
    toJSON() {
        return {
            label: this.label,
            value: this.value,
        };
    }
}