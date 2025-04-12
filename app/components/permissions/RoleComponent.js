import { Role } from '../../models/role.js';
import { roleService } from '../../services/RoleService.js';
import { EventBus } from '../../core/eventBus.js';
import { formatDate, showNotification, showConfirmDialog } from '../../core/utils.js';
import { getToken } from '../../core/storage.js';

/**
 * Class RoleComponent - Component xử lý hiển thị và tương tác với danh sách vai trò sử dụng server-side processing
 */
export class RoleComponent {
    /**
     * Khởi tạo component
     * @param {HTMLElement} container - Element container chứa component
     */
    constructor(container) {
        this.container = container;
        this.dataTable = null;
        this.currentRoleId = null;
        
        // Lấy service
        this.roleService = roleService.getInstance();
        this.eventBus = EventBus.getInstance();
        
        // Khởi tạo các modal
        this.roleModal = null;
        this.deleteRoleModal = null;
        
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
            // Khởi tạo DataTable với server-side processing
            this.initDataTable();
            
            // Khởi tạo modals
            this.initModals();
        } catch (error) {
            console.error('Error initializing RoleComponent:', error);
            showNotification('error', 'Lỗi', 'Không thể khởi tạo dữ liệu vai trò.');
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
                loadingElement.style.zIndex = '1050'; // Cao hơn DataTable
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
     * Khởi tạo DataTable với server-side processing
     */
    initDataTable() {
        // Hủy DataTable cũ nếu đã tồn tại
        if (this.dataTable) {
            this.dataTable.destroy();
        }

        // Khởi tạo DataTable mới với server-side processing
        this.dataTable = new DataTable('#rolesTable', {
            processing: true,
            serverSide: true,
            ajax: {
                url: 'http://localhost:8080/api/admin/roles',
                type: 'GET',
                beforeSend: (xhr) => {
                    const token = getToken();
                    if (!token) {
                        showNotification('error', 'Lỗi xác thực', 'Vui lòng đăng nhập lại!');
                        return;
                    }
                    xhr.setRequestHeader('Authorization', 'Bearer ' + getToken());
                },
                error: (xhr, error, thrown) => {
                    console.error('DataTable AJAX error:', error, thrown);
                    showNotification('error', 'Lỗi dữ liệu', 'Không thể tải dữ liệu từ server.');
                }
            },
            columns: [
                { data: 'id' },
                { data: 'name' },
                { data: 'description' },
                { 
                    data: 'isSystem', // Phía server trả về tên trường là "isSystem"
                    render: function(data) {
                        return data ? 
                            '<span class="badge bg-primary">Hệ thống</span>' : 
                            '<span class="badge bg-secondary">Tùy chỉnh</span>';
                    }
                },
                { 
                    data: 'createdAt', // Phía server trả về tên trường là "createdAt"
                    render: function(data) {
                        return formatDate(data);
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
            // Cấu hình thêm cho DataTable
            order: [[0, 'desc']], // Sắp xếp mặc định theo ID giảm dần
            pageLength: 10,
            lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "Tất cả"]]
        });
    }

    /**
     * Render các nút thao tác
     * @param {Object} data - Dữ liệu vai trò từ server
     * @returns {string} - HTML string các nút thao tác
     */
    renderActionButtons(data) {
        const editBtn = `<button class="btn btn-sm btn-outline-primary edit-role me-1" data-id="${data.id}"><i class="bi bi-pencil"></i></button>`;
        
        // Sử dụng trường "system" từ dữ liệu server
        const deleteBtn = data.isSystem ? 
            `<button class="btn btn-sm btn-outline-danger" disabled title="Vai trò hệ thống không thể xóa"><i class="bi bi-trash"></i></button>` :
            `<button class="btn btn-sm btn-outline-danger delete-role" data-id="${data.id}"><i class="bi bi-trash"></i></button>`;
        
        return editBtn + deleteBtn;
    }

    /**
     * Khởi tạo các modal
     */
    initModals() {
        // Modal thêm/sửa vai trò
        const roleModalElement = document.getElementById('roleModal');
        if (roleModalElement) {
            this.roleModal = new bootstrap.Modal(roleModalElement);
        }
        
        // Modal xác nhận xóa vai trò
        const deleteRoleModalElement = document.getElementById('deleteRoleModal');
        if (deleteRoleModalElement) {
            this.deleteRoleModal = new bootstrap.Modal(deleteRoleModalElement);
        }
    }

    /**
     * Đăng ký các event listeners
     */
    registerEventListeners() {
        // Xử lý sự kiện thêm vai trò mới
        const btnAddRole = document.getElementById('btnAddRole');
        if (btnAddRole) {
            btnAddRole.addEventListener('click', () => this.openAddRoleModal());
        }

        // Xử lý sự kiện lưu vai trò
        const btnSaveRole = document.getElementById('btnSaveRole');
        if (btnSaveRole) {
            btnSaveRole.addEventListener('click', () => this.saveRole());
        }

        // Xử lý sự kiện sửa vai trò và xóa vai trò (sử dụng event delegation)
        document.querySelector('#rolesTable tbody').addEventListener('click', (e) => {
            const editButton = e.target.closest('.edit-role');
            if (editButton) {
                const roleId = editButton.getAttribute('data-id');
                this.openEditRoleModal(roleId);
            }
            
            const deleteButton = e.target.closest('.delete-role');
            if (deleteButton) {
                const roleId = deleteButton.getAttribute('data-id');
                this.openDeleteRoleModal(roleId);
            }
        });

        // Xử lý sự kiện xác nhận xóa vai trò
        const btnConfirmDeleteRole = document.getElementById('btnConfirmDeleteRole');
        if (btnConfirmDeleteRole) {
            btnConfirmDeleteRole.addEventListener('click', () => this.deleteRole());
        }

        // Đăng ký theo dõi các sự kiện từ EventBus
        this.eventBus.subscribe('role:created', () => this.refreshDataTable());
        this.eventBus.subscribe('role:updated', () => this.refreshDataTable());
        this.eventBus.subscribe('role:deleted', () => this.refreshDataTable());
    }

    /**
     * Mở modal thêm vai trò mới
     */
    openAddRoleModal() {
        this.currentRoleId = null;
        document.getElementById('roleModalLabel').textContent = 'Thêm vai trò mới';
        document.getElementById('roleForm').reset();
        
        // Đảm bảo checkbox is_system có thể chỉnh sửa 
        const isSystemCheckbox = document.getElementById('isSystemRole');
        if (isSystemCheckbox) {
            isSystemCheckbox.disabled = false;
        }
        
        this.roleModal.show();
    }

    /**
     * Mở modal sửa vai trò
     * @param {string|number} roleId - ID của vai trò
     */
    async openEditRoleModal(roleId) {
        try {
            this.showLoading(true);
            
            const role = await this.roleService.getRoleById(roleId);
            
            this.showLoading(false);
            
            if (role) {
                this.currentRoleId = role.id;
                document.getElementById('roleModalLabel').textContent = 'Chỉnh sửa vai trò';
                document.getElementById('roleId').value = role.id;
                document.getElementById('roleName').value = role.name;
                document.getElementById('roleDescription').value = role.description || '';
                
                const isSystemCheckbox = document.getElementById('isSystemRole');
                console.log('isSystemCheckbox', isSystemCheckbox);
                if (isSystemCheckbox) {
                    isSystemCheckbox.checked = !role.isSystem;
                    isSystemCheckbox.disabled = !role.isSystem; // Không cho phép thay đổi trạng thái hệ thống nếu là vai trò hệ thống
                }

                this.roleModal.show();
            } else {
                showNotification('error', 'Lỗi', 'Không tìm thấy vai trò!');
            }
        } catch (error) {
            this.showLoading(false);
            console.error('Error loading role:', error);
            showNotification('error', 'Lỗi', 'Không thể tải thông tin vai trò. ' + error.message);
        }
    }

    /**
     * Mở modal xác nhận xóa vai trò
     * @param {string|number} roleId - ID của vai trò
     */
    async openDeleteRoleModal(roleId) {
        try {
            this.showLoading(true);
            
            const role = await this.roleService.getRoleById(roleId);
            
            this.showLoading(false);
            
            if (role) {
                if (role.isSystem) {
                    showNotification('warning', 'Không thể xóa', 'Vai trò hệ thống không thể bị xóa!');
                    return;
                }
                
                this.currentRoleId = role.id;
                const deleteRoleName = document.getElementById('deleteRoleName');
                if (deleteRoleName) {
                    deleteRoleName.textContent = role.name;
                }
                this.deleteRoleModal.show();
            } else {
                showNotification('error', 'Lỗi', 'Không tìm thấy vai trò!');
            }
        } catch (error) {
            this.showLoading(false);
            console.error('Error loading role for delete:', error);
            showNotification('error', 'Lỗi', 'Không thể tải thông tin vai trò. ' + error.message);
        }
    }

    /**
     * Lưu vai trò (thêm mới hoặc cập nhật)
     */
    async saveRole() {
        try {
            const roleName = document.getElementById('roleName').value;
            const roleDescription = document.getElementById('roleDescription').value;
            const isSystemRole = document.getElementById('isSystemRole')?.checked || false;

            if (!roleName) {
                showNotification('warning', 'Thiếu thông tin', 'Vui lòng nhập tên vai trò!');
                return;
            }

            this.showLoading(true);

            // Tạo đối tượng Role
            const roleData = new Role({
                name: roleName,
                description: roleDescription,
                is_system: isSystemRole
            });

            if (this.currentRoleId) {
                // Cập nhật vai trò hiện có
                await this.roleService.updateRole(this.currentRoleId, roleData);
                showNotification('success', 'Thành công', 'Cập nhật vai trò thành công!');
            } else {
                // Thêm vai trò mới
                await this.roleService.createRole(roleData);
                showNotification('success', 'Thành công', 'Thêm vai trò mới thành công!');
            }

            this.showLoading(false);

            // Đóng modal
            this.roleModal.hide();
            
            // Cập nhật DataTable
            this.refreshDataTable();
            
        } catch (error) {
            this.showLoading(false);
            console.error('Error saving role:', error);
            showNotification('error', 'Lỗi', error.message || 'Không thể lưu vai trò!');
        }
    }

    /**
     * Xóa vai trò
     */
    async deleteRole() {
        try {
            if (this.currentRoleId) {
                this.showLoading(true);
                
                await this.roleService.deleteRole(this.currentRoleId);
                
                this.showLoading(false);
                
                // Đóng modal
                this.deleteRoleModal.hide();
                
                // Cập nhật DataTable
                this.refreshDataTable();
                
                showNotification('success', 'Thành công', 'Xóa vai trò thành công!');
            }
        } catch (error) {
            this.showLoading(false);
            console.error('Error deleting role:', error);
            showNotification('error', 'Lỗi', error.message || 'Không thể xóa vai trò!');
        }
    }

    /**
     * Cập nhật bảng DataTable
     */
    refreshDataTable() {
        if (this.dataTable) {
            this.dataTable.ajax.reload();
        }
    }
}