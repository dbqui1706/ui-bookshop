import { Permission } from '../../models/permission.js';
import { permissionService } from '../../services/PermissionService.js';
import { EventBus } from '../../core/eventBus.js';
import { formatDate, showNotification, showConfirmDialog, slugify } from '../../core/utils.js';
import { getToken } from '../../core/storage.js';

/**
 * Class PermissionComponent - Component xử lý hiển thị và tương tác với danh sách quyền
 */
export class PermissionComponent {
    /**
     * Khởi tạo component
     * @param {HTMLElement} container - Element container chứa component
     */
    constructor(container) {
        this.container = container;
        this.dataTable = null;
        this.currentPermissionId = null;
        this.modules = [];
        this.currentModule = 'all'; // Tab module hiện tại

        // Lấy service
        this.permissionService = permissionService.getInstance();
        this.eventBus = EventBus.getInstance();

        // Khởi tạo các modal
        this.permissionModal = null;
        this.deletePermissionModal = null;

        // Đăng ký sự kiện
        this.registerEventListeners();

        // Khởi tạo component
        this.initialize();
    }

    /**
     * Khởi tạo component
     */
    async initialize() {
        try {
            this.showLoading(true);

            // Lấy danh sách module
            await this.loadModules();

            // Khởi tạo DataTable với server-side processing
            this.initDataTable();

            // Khởi tạo modals
            this.initModals();

            this.showLoading(false);
        } catch (error) {
            this.showLoading(false);
            console.error('Error initializing PermissionComponent:', error);
            showNotification('error', 'Lỗi', 'Không thể khởi tạo dữ liệu quyền.');
        }
    }

    /**
     * Hiển thị hoặc ẩn trạng thái loading
     * @param {boolean} show - Hiển thị hoặc ẩn
     */
    showLoading(show) {
        // Tìm hoặc tạo container loading
        let loadingElement = this.container.querySelector('.loading-overlay');

        if (show) {
            if (!loadingElement) {
                loadingElement = document.createElement('div');
                loadingElement.className = 'loading-overlay position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center';
                loadingElement.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
                loadingElement.style.zIndex = '1050';
                loadingElement.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Đang tải...</span></div>';
                this.container.style.position = 'relative';
                this.container.appendChild(loadingElement);
            }
        } else {
            if (loadingElement) {
                loadingElement.remove();
            }
        }
    }

    /**
     * Lấy danh sách module
     */
    async loadModules() {
        try {
            this.modules = await this.permissionService.getAllModules();
            // Thêm các tab module
            this.renderModuleTabs();
        } catch (error) {
            console.error('Error loading modules:', error);
            throw new Error('Không thể tải danh sách module');
        }
    }

    /**
     * Tạo các tab module
     */
    renderModuleTabs() {
        const tabsContainer = document.getElementById('permissionModuleTabs');
        if (!tabsContainer) return;

        // Xóa các tab hiện tại (trừ tab "Tất cả")
        const tabs = tabsContainer.querySelectorAll('.nav-item:not(:first-child)');
        tabs.forEach(tab => tab.remove());
        // Thêm tab cho mỗi module
        this.modules.forEach(module => {
            const moduleId = module.toLowerCase(); // Dùng chữ thường cho ID
            const tab = document.createElement('li');
            tab.className = 'nav-item';
            tab.role = 'presentation';
            tab.innerHTML = `
                <button class="nav-link" id="${moduleId}-module-tab" data-module="${moduleId}"
                        data-bs-toggle="pill" data-bs-target="#${moduleId}-module" 
                        type="button" role="tab" aria-controls="${moduleId}-module" aria-selected="false">
                    ${this.getModuleDisplayName(module)}
                </button>
            `;
            tabsContainer.appendChild(tab);

            // Thêm tab content (bảng DataTable sẽ được tạo động khi tab được chọn)
            this.createModuleTabContent(moduleId);
        });
    }

    /**
     * Tạo tab content cho module
     * @param {string} moduleId - ID của module
     */
    createModuleTabContent(moduleId) {
        const tabContentContainer = document.getElementById('permissionModuleTabContent');
        if (!tabContentContainer) return;

        // Kiểm tra nếu tab content đã tồn tại
        if (document.getElementById(`${moduleId}-module`)) return;

        // Tạo tab content
        const tabPane = document.createElement('div');
        tabPane.className = 'tab-pane fade';
        tabPane.id = `${moduleId}-module`;
        tabPane.setAttribute('role', 'tabpanel');
        tabPane.setAttribute('aria-labelledby', `${moduleId}-module-tab`);

        // Tạo bảng DataTable
        tabPane.innerHTML = `
            <div class="table-responsive">
                <table id="${moduleId}PermissionsTable" class="table table-striped table-hover" style="width: 100%">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên quyền</th>
                            <th>Mã quyền</th>
                            <th>Mô tả</th>
                            <th>Loại quyền</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Dữ liệu sẽ được thêm bằng JavaScript -->
                    </tbody>
                </table>
            </div>
        `;

        tabContentContainer.appendChild(tabPane);
    }

    /**
     * Khởi tạo DataTable
     */
    initDataTable() {
        // Hủy DataTable cũ nếu đã tồn tại
        if (this.dataTable) {
            this.dataTable.destroy();
        }

        // DataTable cho tab "Tất cả"
        this.dataTable = new DataTable('#permissionsTable', {
            processing: true,
            serverSide: true,
            ajax: {
                url: 'http://localhost:8080/api/admin/permissions',
                type: 'GET',
                data: (d) => {
                    // Thêm filter theo module
                    if (this.currentModule !== 'all') {
                        d.module = this.currentModule;
                    }
                    return d;
                },
                error: (xhr, error, thrown) => {
                    console.error('DataTable AJAX error:', error, thrown);
                    showNotification('error', 'Lỗi dữ liệu', 'Không thể tải dữ liệu từ server.');
                },
                beforeSend: (xhr) => {
                    const token = getToken();
                    if (!token) {
                        showNotification('error', 'Lỗi xác thực', 'Vui lòng đăng nhập lại!');
                        return;
                    }
                    xhr.setRequestHeader('Authorization', 'Bearer ' + getToken());
                },
            },
            columns: [
                { data: 'id' },
                { data: 'name' },
                { data: 'code' },
                {
                    data: 'module',
                    render: (data) => this.renderModuleBadge(data)
                },
                { data: 'description' },
                {
                    data: 'isSystem',
                    render: function (data) {
                        return data ?
                            '<span class="badge bg-primary">Hệ thống</span>' :
                            '<span class="badge bg-secondary">Tùy chỉnh</span>';
                    }
                },
                {
                    data: null,
                    orderable: false,
                    searchable: false,
                    render: (data) => this.renderActionButtons(data)
                }
            ],
            responsive: true,
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/vi.json',
            },
            order: [[0, 'desc']] // Sắp xếp mặc định theo ID giảm dần
        });

        // Đăng ký sự kiện cho các tab module
        const moduleTabs = document.querySelectorAll('#permissionModuleTabs .nav-link');
        moduleTabs.forEach(tab => {
            tab.addEventListener('shown.bs.tab', (event) => {
                const module = event.target.getAttribute('data-module');
                this.currentModule = module;

                if (module === 'all') {
                    // Nếu là tab "Tất cả", refresh DataTable chính
                    this.refreshDataTable();
                } else {
                    // Nếu là tab module, khởi tạo hoặc refresh DataTable cho module đó
                    this.initModuleDataTable(module);
                }
            });
        });
    }

    /**
     * Khởi tạo DataTable cho module cụ thể
     * @param {string} module - ID của module
     */
    initModuleDataTable(module) {
        const tableId = `#${module}PermissionsTable`;
        const table = $(tableId).DataTable();

        // Nếu DataTable đã tồn tại, hủy nó
        if (table) {
            table.destroy();
        }

        // Khởi tạo DataTable mới
        new DataTable(tableId, {
            processing: true,
            serverSide: true,
            ajax: {
                url: 'http://localhost:8080/api/admin/permissions?module=' + module,
                type: 'GET',
                data: (d) => {
                    d.module = module;
                    return d;
                },
                error: (xhr, error, thrown) => {
                    console.error('DataTable AJAX error:', error, thrown);
                    showNotification('error', 'Lỗi dữ liệu', 'Không thể tải dữ liệu từ server.');
                },
                beforeSend: (xhr) => {
                    const token = getToken();
                    if (!token) {
                        showNotification('error', 'Lỗi xác thực', 'Vui lòng đăng nhập lại!');
                        return;
                    }
                    xhr.setRequestHeader('Authorization', 'Bearer ' + getToken());
                }
            },
            columns: [
                { data: 'id' },
                { data: 'name' },
                { data: 'code' },
                { data: 'description' },
                {
                    data: 'isSystem',
                    render: function (data) {
                        return data ?
                            '<span class="badge bg-primary">Hệ thống</span>' :
                            '<span class="badge bg-secondary">Tùy chỉnh</span>';
                    }
                },
                {
                    data: null,
                    orderable: false,
                    searchable: false,
                    render: (data) => this.renderActionButtons(data)
                }
            ],
            responsive: true,
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/vi.json',
            },
            order: [[0, 'desc']] // Sắp xếp mặc định theo ID giảm dần
        });
    }

    /**
     * Render badge cho module
     * @param {string} module - Tên module
     * @returns {string} - HTML string badge
     */
    renderModuleBadge(module) {
        const color = this.getModuleColor(module);
        const name = this.getModuleDisplayName(module);
        return `<span class="badge bg-${color}">${name}</span>`;
    }

    /**
     * Lấy màu cho badge module
     * @param {string} module - Tên module
     * @returns {string} - Tên màu Bootstrap
     */
    getModuleColor(module) {
        const moduleColors = {
            'user': 'primary',
            'product': 'success',
            'order': 'info',
            'shipping': 'warning',
            'report': 'secondary',
            'system': 'danger'
        };
        return moduleColors[module] || 'dark';
    }

    /**
     * Lấy tên hiển thị cho module
     * @param {string} module - Tên module
     * @returns {string} - Tên hiển thị
     */
    getModuleDisplayName(module) {
        const moduleNames = {
            'user': 'Người dùng',
            'product': 'Sản phẩm',
            'order': 'Đơn hàng',
            'shipping': 'Vận chuyển',
            'report': 'Báo cáo',
            'system': 'Hệ thống'
        };
        return moduleNames[module] || module;
    }

    /**
     * Render các nút thao tác
     * @param {Object} data - Dữ liệu quyền từ server
     * @returns {string} - HTML string các nút thao tác
     */
    renderActionButtons(data) {
        const editBtn = `<button class="btn btn-sm btn-outline-primary edit-permission me-1" data-id="${data.id}"><i class="bi bi-pencil"></i></button>`;

        const deleteBtn = data.isSystem ?
            `<button class="btn btn-sm btn-outline-danger" disabled title="Quyền hệ thống không thể xóa"><i class="bi bi-trash"></i></button>` :
            `<button class="btn btn-sm btn-outline-danger delete-permission" data-id="${data.id}"><i class="bi bi-trash"></i></button>`;

        return editBtn + deleteBtn;
    }

    /**
     * Khởi tạo các modal
     */
    initModals() {
        // Modal thêm/sửa quyền
        const permissionModalElement = document.getElementById('permissionModal');
        if (permissionModalElement) {
            this.permissionModal = new bootstrap.Modal(permissionModalElement);
        }

        // Modal xác nhận xóa quyền
        const deletePermissionModalElement = document.getElementById('deletePermissionModal');
        if (deletePermissionModalElement) {
            this.deletePermissionModal = new bootstrap.Modal(deletePermissionModalElement);
        }
    }

    /**
     * Đăng ký các event listeners
     */
    registerEventListeners() {
        // Xử lý sự kiện thêm quyền mới
        const btnAddPermission = document.getElementById('btnAddPermission');
        if (btnAddPermission) {
            btnAddPermission.addEventListener('click', () => this.openAddPermissionModal());
        }

        // Xử lý sự kiện lưu quyền
        const btnSavePermission = document.getElementById('btnSavePermission');
        if (btnSavePermission) {
            btnSavePermission.addEventListener('click', () => this.savePermission());
        }

        // Xử lý sự kiện sửa và xóa quyền (sử dụng event delegation)
        document.addEventListener('click', (e) => {
            const editButton = e.target.closest('.edit-permission');
            if (editButton) {
                const permissionId = editButton.getAttribute('data-id');
                this.openEditPermissionModal(permissionId);
            }

            const deleteButton = e.target.closest('.delete-permission');
            if (deleteButton) {
                const permissionId = deleteButton.getAttribute('data-id');
                this.openDeletePermissionModal(permissionId);
            }
        });

        // Xử lý sự kiện xác nhận xóa quyền
        const btnConfirmDeletePermission = document.getElementById('btnConfirmDeletePermission');
        if (btnConfirmDeletePermission) {
            btnConfirmDeletePermission.addEventListener('click', () => this.deletePermission());
        }

        // Tự động cập nhật mã quyền khi chọn module và nhập tên
        const permissionModule = document.getElementById('permissionModule');
        const permissionName = document.getElementById('permissionName');
        if (permissionModule && permissionName) {
            permissionModule.addEventListener('change', () => this.updatePermissionCode());
            permissionName.addEventListener('input', () => this.updatePermissionCode());
        }

        // Đăng ký theo dõi các sự kiện từ EventBus
        this.eventBus.subscribe('permission:created', () => this.refreshAllDataTables());
        this.eventBus.subscribe('permission:updated', () => this.refreshAllDataTables());
        this.eventBus.subscribe('permission:deleted', () => this.refreshAllDataTables());
    }

    /**
     * Tự động cập nhật mã quyền dựa trên tên và module
     */
    updatePermissionCode() {
        const module = document.getElementById('permissionModule').value;
        let name = document.getElementById('permissionName').value;
        const permissionCode = document.getElementById('permissionCode');

        if (module && name) {
            // Chuyển tên thành snake_case cho mã
            const code = slugify(name);
            permissionCode.value = `${module}.${code}`;
        }
    }

    /**
     * Mở modal thêm quyền mới
     */
    openAddPermissionModal() {
        this.currentPermissionId = null;
        document.getElementById('permissionModalLabel').textContent = 'Thêm quyền mới';
        document.getElementById('permissionForm').reset();

        // Đảm bảo checkbox is_system có thể chỉnh sửa 
        const isSystemCheckbox = document.getElementById('isSystemPermission');
        if (isSystemCheckbox) {
            isSystemCheckbox.disabled = false;
        }

        this.permissionModal.show();
    }

    /**
     * Mở modal sửa quyền
     * @param {string|number} permissionId - ID của quyền
     */
    async openEditPermissionModal(permissionId) {
        try {
            this.showLoading(true);

            const permission = await this.permissionService.getPermissionById(permissionId);

            this.showLoading(false);

            if (permission) {
                this.currentPermissionId = permission.id;
                document.getElementById('permissionModalLabel').textContent = 'Chỉnh sửa quyền';
                document.getElementById('permissionId').value = permission.id;
                document.getElementById('permissionName').value = permission.name;
                document.getElementById('permissionCode').value = permission.code;
                document.getElementById('permissionModule').value = permission.module;
                document.getElementById('permissionDescription').value = permission.description || '';

                const isSystemCheckbox = document.getElementById('isSystemPermission');
                if (isSystemCheckbox) {
                    isSystemCheckbox.checked = permission.isSystem;
                    isSystemCheckbox.disabled = permission.isSystem; // Không cho phép thay đổi trạng thái hệ thống nếu là quyền hệ thống
                }

                this.permissionModal.show();
            } else {
                showNotification('error', 'Lỗi', 'Không tìm thấy quyền!');
            }
        } catch (error) {
            this.showLoading(false);
            console.error('Error loading permission:', error);
            showNotification('error', 'Lỗi', 'Không thể tải thông tin quyền. ' + error.message);
        }
    }

    /**
     * Mở modal xác nhận xóa quyền
     * @param {string|number} permissionId - ID của quyền
     */
    async openDeletePermissionModal(permissionId) {
        try {
            this.showLoading(true);

            const permission = await this.permissionService.getPermissionById(permissionId);

            this.showLoading(false);

            if (permission) {
                if (permission.isSystem) {
                    showNotification('warning', 'Không thể xóa', 'Quyền hệ thống không thể bị xóa!');
                    return;
                }

                this.currentPermissionId = permission.id;
                const deletePermissionName = document.getElementById('deletePermissionName');
                if (deletePermissionName) {
                    deletePermissionName.textContent = permission.name;
                }
                this.deletePermissionModal.show();
            } else {
                showNotification('error', 'Lỗi', 'Không tìm thấy quyền!');
            }
        } catch (error) {
            this.showLoading(false);
            console.error('Error loading permission for delete:', error);
            showNotification('error', 'Lỗi', 'Không thể tải thông tin quyền. ' + error.message);
        }
    }

    /**
     * Lưu quyền (thêm mới hoặc cập nhật)
     */
    async savePermission() {
        try {
            const permissionName = document.getElementById('permissionName').value;
            const permissionCode = document.getElementById('permissionCode').value;
            const permissionModule = document.getElementById('permissionModule').value;
            const permissionDescription = document.getElementById('permissionDescription').value;
            const isSystemPermission = document.getElementById('isSystemPermission')?.checked || false;

            // Kiểm tra dữ liệu đầu vào
            if (!permissionName || !permissionCode || !permissionModule) {
                showNotification('warning', 'Thiếu thông tin', 'Vui lòng điền đầy đủ thông tin bắt buộc!');
                return;
            }

            this.showLoading(true);

            // Tạo đối tượng Permission
            const permissionData = new Permission({
                name: permissionName,
                code: permissionCode,
                module: permissionModule,
                description: permissionDescription,
                isSystem: isSystemPermission,
            });

            if (this.currentPermissionId) {
                // Cập nhật quyền hiện có
                await this.permissionService.updatePermission(this.currentPermissionId, permissionData);
                showNotification('success', 'Thành công', 'Cập nhật quyền thành công!');
            } else {
                // Thêm quyền mới
                await this.permissionService.createPermission(permissionData);
                showNotification('success', 'Thành công', 'Thêm quyền mới thành công!');
            }

            this.showLoading(false);

            // Đóng modal
            this.permissionModal.hide();

            // Cập nhật DataTable
            this.refreshAllDataTables();

        } catch (error) {
            this.showLoading(false);
            console.error('Error saving permission:', error);
            showNotification('error', 'Lỗi', error.message || 'Không thể lưu quyền!');
        }
    }

    /**
     * Xóa quyền
     */
    async deletePermission() {
        try {
            if (this.currentPermissionId) {
                this.showLoading(true);

                await this.permissionService.deletePermission(this.currentPermissionId);

                this.showLoading(false);

                // Đóng modal
                this.deletePermissionModal.hide();

                // Cập nhật DataTable
                this.refreshAllDataTables();

                showNotification('success', 'Thành công', 'Xóa quyền thành công!');
            }
        } catch (error) {
            this.showLoading(false);
            console.error('Error deleting permission:', error);
            showNotification('error', 'Lỗi', error.message || 'Không thể xóa quyền!');
        }
    }

    /**
     * Cập nhật bảng DataTable chính
     */
    refreshDataTable() {
        if (this.dataTable) {
            this.dataTable.ajax.reload();
        }
    }

    /**
     * Cập nhật các bảng DataTable
     */
    refreshAllDataTables() {
        // Cập nhật DataTable chính
        this.refreshDataTable();

        // Chỉ cập nhật DataTable của tab đang active
        const activeTabId = document.querySelector('#permissionModuleTabs .nav-link.active').getAttribute('data-module');
        if (activeTabId && activeTabId !== 'all') {
            try {
                const dataTableInstance = $(`#${activeTabId}PermissionsTable`).DataTable();
                if (dataTableInstance) {
                    dataTableInstance.ajax.reload();
                }
            } catch (error) {
                console.warn(`Could not reload DataTable for active module ${activeTabId}:`, error);
            }
        }
    }
}