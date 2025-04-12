/**
 * Class DataTableComponent - Component quản lý bảng dữ liệu DataTable
 */
export class DataTableComponent {
    /**
     * Khởi tạo DataTable
     * @param {string} selector - CSS selector của element table
     * @param {Object} options - Các tùy chọn DataTable
     */
    constructor(selector, options = {}) {
        this.selector = selector;
        this.tableElement = document.querySelector(selector);
        this.dataTable = null;
        
        // Các tùy chọn mặc định
        this.defaultOptions = {
            responsive: true,
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/vi.json',
            }
        };
        
        // Kết hợp tùy chọn mặc định và tùy chọn người dùng
        this.options = {...this.defaultOptions, ...options};
        
        // Khởi tạo DataTable
        if (this.tableElement) {
            this.initialize();
        } else {
            console.error(`Element not found with selector: ${selector}`);
        }
    }

    /**
     * Khởi tạo DataTable
     */
    initialize() {
        try {
            this.dataTable = new DataTable(this.selector, this.options);
        } catch (error) {
            console.error('Error initializing DataTable:', error);
        }
    }

    /**
     * Thêm dữ liệu mới vào DataTable
     * @param {Array} data - Mảng dữ liệu cần thêm
     */
    addData(data) {
        if (this.dataTable) {
            this.dataTable.rows.add(data).draw();
        }
    }

    /**
     * Cập nhật toàn bộ dữ liệu của DataTable
     * @param {Array} data - Mảng dữ liệu mới
     */
    updateData(data) {
        if (this.dataTable) {
            this.dataTable.clear().rows.add(data).draw();
        }
    }

    /**
     * Xóa dữ liệu theo điều kiện
     * @param {Function} condition - Hàm điều kiện để xóa dữ liệu
     */
    removeData(condition) {
        if (this.dataTable) {
            const indexes = [];
            this.dataTable.rows().every(function(rowIdx) {
                const data = this.data();
                if (condition(data)) {
                    indexes.push(rowIdx);
                }
            });
            
            if (indexes.length > 0) {
                this.dataTable.rows(indexes).remove().draw();
            }
        }
    }

    /**
     * Tìm kiếm dữ liệu trong DataTable
     * @param {string} searchText - Chuỗi tìm kiếm
     */
    search(searchText) {
        if (this.dataTable) {
            this.dataTable.search(searchText).draw();
        }
    }

    /**
     * Lấy dữ liệu từ DataTable
     * @returns {Array} - Mảng dữ liệu
     */
    getData() {
        if (this.dataTable) {
            return this.dataTable.data().toArray();
        }
        return [];
    }

    /**
     * Lấy dữ liệu của hàng được chọn
     * @returns {Array} - Mảng dữ liệu của các hàng được chọn
     */
    getSelectedData() {
        if (this.dataTable) {
            return this.dataTable.rows({selected: true}).data().toArray();
        }
        return [];
    }

    /**
     * Cập nhật một hàng trong DataTable
     * @param {number|Function} rowIdentifier - Chỉ số hàng hoặc hàm xác định hàng cần cập nhật
     * @param {Object} newData - Dữ liệu mới
     */
    updateRow(rowIdentifier, newData) {
        if (this.dataTable) {
            let rowIndex;
            
            if (typeof rowIdentifier === 'function') {
                // Tìm hàng theo điều kiện
                this.dataTable.rows().every(function(rowIdx) {
                    const data = this.data();
                    if (rowIdentifier(data)) {
                        rowIndex = rowIdx;
                        return false; // Dừng vòng lặp khi tìm thấy
                    }
                    return true;
                });
            } else {
                rowIndex = rowIdentifier;
            }
            
            if (rowIndex !== undefined) {
                this.dataTable.row(rowIndex).data(newData).draw(false);
            }
        }
    }

    /**
     * Cập nhật cài đặt DataTable
     * @param {Object} newOptions - Cài đặt mới
     */
    updateOptions(newOptions) {
        if (this.dataTable) {
            // Hủy DataTable hiện tại
            this.destroy();
            
            // Cập nhật tùy chọn
            this.options = {...this.options, ...newOptions};
            
            // Khởi tạo lại DataTable
            this.initialize();
        }
    }

    /**
     * Hủy DataTable
     */
    destroy() {
        if (this.dataTable) {
            this.dataTable.destroy();
            this.dataTable = null;
        }
    }

    /**
     * Làm mới DataTable
     */
    refresh() {
        if (this.dataTable) {
            this.dataTable.ajax.reload();
        }
    }

    /**
     * Thêm sự kiện cho DataTable
     * @param {string} event - Tên sự kiện
     * @param {Function} callback - Hàm callback
     */
    on(event, callback) {
        if (this.dataTable) {
            this.tableElement.addEventListener(`${event}.dt`, callback);
        }
    }
}