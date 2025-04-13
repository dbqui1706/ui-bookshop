import { roleService } from '../../services/RoleService.js';
import { permissionService } from '../../services/PermissionService.js';
import { rolePermissionService } from '../../services/RolePermissionService.js';
import { EventBus } from '../../core/eventBus.js';
import { showNotification, showConfirmDialog } from '../../core/utils.js';

/**
 * Class RolePermissionsComponent - Component xử lý gán quyền cho vai trò
 */
export class RolePermissionsComponent {
    /**
     * Khởi tạo component
     * @param {HTMLElement} container - Element container chứa component
     */
    constructor(container) {
        this.container = container;
        this.currentRoleId = null;
        this.allPermissions = [];
        this.rolePermissions = [];
        this.modules = [];

        // Lấy service
        this.roleService = roleService.getInstance();
        this.permissionService = permissionService.getInstance();
        this.rolePermissionService = rolePermissionService.getInstance();
        this.eventBus = EventBus.getInstance();

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

            // Lấy danh sách vai trò để hiển thị trong select
            await this.loadRolesForSelect();

            // Lấy danh sách module để hiển thị trong accordion
            this.modules = await this.permissionService.getAllModules();

            // Ẩn loading
            this.showLoading(false);
        } catch (error) {
            // Ẩn loading
            this.showLoading(false);

            console.error('Error initializing RolePermissionsComponent:', error);
            showNotification('error', 'Lỗi', 'Không thể khởi tạo dữ liệu ban đầu.');
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
     * Lấy danh sách vai trò để hiển thị trong select
     */
    async loadRolesForSelect() {
        try {
            // Lấy tất cả vai trò
            const roles = await this.roleService.getAllRoles();

            // Lấy element select
            const selectRole = document.getElementById('selectRole');
            if (!selectRole) return;

            // Xóa các option cũ (trừ option mặc định)
            while (selectRole.options.length > 1) {
                selectRole.remove(1);
            }

            // Thêm các option mới
            roles.forEach(role => {
                const option = document.createElement('option');
                option.value = role.id;
                option.textContent = role.name;
                if (role.isSystem) {
                    option.textContent += ' (Hệ thống)';
                }
                selectRole.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading roles for select:', error);
            throw error;
        }
    }

    /**
     * Xử lý khi chọn vai trò
     * @param {number} roleId - ID của vai trò đã chọn
     */
    async handleRoleSelection(roleId) {
        try {
            this.showLoading(true);

            // Lưu ID vai trò hiện tại
            this.currentRoleId = roleId;

            // Ẩn prompt chọn vai trò và hiển thị danh sách quyền
            document.getElementById('roleSelectPrompt').classList.add('d-none');
            document.getElementById('permissionsList').classList.remove('d-none');

            // Lấy tất cả quyền hệ thống
            this.allPermissions = await this.permissionService.getAllPermissionsRole();

            // Lấy danh sách quyền của vai trò
            this.rolePermissions = await this.getRolePermissions(roleId);

            // Hiển thị danh sách quyền theo module
            this.renderPermissionsByModule();

            this.showLoading(false);
        } catch (error) {
            this.showLoading(false);
            console.error('Error handling role selection:', error);
            showNotification('error', 'Lỗi', 'Không thể tải dữ liệu quyền cho vai trò này.');
        }
    }

    /**
     * Lấy danh sách quyền của vai trò
     * @param {number} roleId - ID của vai trò
     * @returns {Promise<Array>} - Danh sách quyền
     */
    async getRolePermissions(roleId) {
        try {
            return await this.rolePermissionService.getPermissionsByRoleId(roleId);
        } catch (error) {
            console.error(`Error fetching permissions for role ${roleId}:`, error);
            throw error;
        }
    }

    /**
     * Render danh sách quyền theo module
     */
    renderPermissionsByModule() {
        // Lấy danh sách ID quyền của vai trò
        const rolePermissionIds = this.rolePermissions.map(p => p.id);

        // Lọc và nhóm quyền theo module
        const permissionsByModule = {};

        this.modules.forEach(module => {
            permissionsByModule[module] = this.allPermissions.filter(p => p.module === module);
        });

        // Render các quyền vào từng module
        Object.keys(permissionsByModule).forEach(module => {
            const modulePermissions = permissionsByModule[module];
            const permissionGroupElement = document.querySelector(`.permission-group[data-module="${module}"]`);

            if (permissionGroupElement) {
                // Xóa nội dung cũ
                permissionGroupElement.innerHTML = '';

                // Thêm các quyền mới
                modulePermissions.forEach(permission => {
                    const isChecked = rolePermissionIds.includes(permission.id);
                    permissionGroupElement.innerHTML += `
                        <div class="form-check mb-2">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="d-flex gap-3">
                                    <input class="form-check-input permission-checkbox" type="checkbox" 
                                        id="permission-${permission.id}" value="${permission.id}" 
                                        data-module="${permission.module}" ${isChecked ? 'checked' : ''}>
                                    <label class="form-check-label" for="permission-${permission.id}">
                                        ${permission.name}
                                        <small class="text-muted d-block">${permission.code}</small>
                                        ${permission.isSystem ? '<span class="badge bg-primary">Hệ thống</span>' : ''}
                                    </label>
                                </div>
                                <div class="d-flex align-items-center">
                                    ${isChecked ? `<button class="btn btn-sm btn-outline-danger remove-permission" 
                                                data-id="${permission.id}" type="button">
                                                <i class="bi bi-trash"></i>
                                        </button>` : ''}
                                </div>
                            </div>
                        </div>
                    `;
                });

                // Hiển thị số lượng quyền đã chọn trong badge
                const selectedCount = modulePermissions.filter(p => rolePermissionIds.includes(p.id)).length;
                const moduleBadge = document.querySelector(`button[data-bs-target="#collapse${this.capitalizeFirstLetter(module)}"] .badge`);
                if (moduleBadge) {
                    moduleBadge.textContent = selectedCount;

                    // Thêm class active nếu có quyền được chọn
                    if (selectedCount > 0) {
                        moduleBadge.classList.remove('bg-primary');
                        moduleBadge.classList.add('bg-success');
                    } else {
                        moduleBadge.classList.remove('bg-success');
                        moduleBadge.classList.add('bg-primary');
                    }
                }
            }
        });

        // Cập nhật sự kiện tìm kiếm
        this.initializeSearch();

        // Đăng ký sự kiện cho nút xóa quyền
        document.querySelectorAll('.remove-permission').forEach(button => {
            button.addEventListener('click', (e) => {
                const permissionId = e.currentTarget.getAttribute('data-id');
                this.removePermissionFromRole(parseInt(permissionId));
            });
        });
    }

    /**
     * Viết hoa chữ cái đầu
     * @param {string} string - Chuỗi cần viết hoa chữ cái đầu
     * @returns {string} - Chuỗi đã viết hoa chữ cái đầu
     */
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    /**
     * Khởi tạo chức năng tìm kiếm
     */
    initializeSearch() {
        const searchInput = document.getElementById('searchPermissions');
        if (!searchInput) return;

        // Xóa sự kiện trước đó để tránh đăng ký nhiều lần
        searchInput.removeEventListener('input', this.handleSearch);

        // Đăng ký sự kiện mới
        searchInput.addEventListener('input', this.handleSearch.bind(this));
    }

    /**
     * Xử lý tìm kiếm quyền
     * @param {Event} event - Sự kiện input
     */
    handleSearch(event) {
        const searchValue = event.target.value.trim().toLowerCase();

        // Lấy tất cả checkbox quyền
        const permissionCheckboxes = document.querySelectorAll('.permission-checkbox');

        permissionCheckboxes.forEach(checkbox => {
            const label = document.querySelector(`label[for="${checkbox.id}"]`);
            const permissionName = label.textContent.trim().toLowerCase();
            const parentDiv = checkbox.closest('.form-check');

            if (permissionName.includes(searchValue)) {
                parentDiv.style.display = 'block';
            } else {
                parentDiv.style.display = 'none';
            }
        });
    }

    /**
     * Chọn tất cả quyền
     */
    selectAllPermissions() {
        document.querySelectorAll('.permission-checkbox').forEach(checkbox => {
            checkbox.checked = true;
        });

        // Cập nhật số lượng trong badge
        this.updateModuleBadges();
    }

    /**
     * Bỏ chọn tất cả quyền
     */
    deselectAllPermissions() {
        document.querySelectorAll('.permission-checkbox').forEach(checkbox => {
            checkbox.checked = false;
        });

        // Cập nhật số lượng trong badge
        this.updateModuleBadges();
    }

    /**
     * Cập nhật số lượng quyền đã chọn trong badge
     */
    updateModuleBadges() {
        this.modules.forEach(module => {
            const moduleCheckboxes = document.querySelectorAll(`.permission-checkbox[data-module="${module}"]`);
            const selectedCount = Array.from(moduleCheckboxes).filter(cb => cb.checked).length;

            const moduleBadge = document.querySelector(`button[data-bs-target="#collapse${this.capitalizeFirstLetter(module)}"] .badge`);
            if (moduleBadge) {
                moduleBadge.textContent = selectedCount;

                if (selectedCount > 0) {
                    moduleBadge.classList.remove('bg-primary');
                    moduleBadge.classList.add('bg-success');
                } else {
                    moduleBadge.classList.remove('bg-success');
                    moduleBadge.classList.add('bg-primary');
                }
            }
        });
    }

    /**
     * Lưu danh sách quyền cho vai trò
     */
    async saveRolePermissions() {
        try {
            if (!this.currentRoleId) {
                showNotification('warning', 'Lỗi', 'Vui lòng chọn vai trò trước!');
                return;
            }

            this.showLoading(true);

            // Thu thập danh sách ID quyền đã chọn
            const selectedPermissionIds = [];
            document.querySelectorAll('.permission-checkbox:checked').forEach(checkbox => {
                selectedPermissionIds.push(parseInt(checkbox.value));
            });

            // Sử dụng service để cập nhật quyền cho vai trò
            await this.rolePermissionService.setPermissionsForRole(this.currentRoleId, selectedPermissionIds);

            this.showLoading(false);

            // Thông báo thành công
            showNotification('success', 'Thành công', 'Cập nhật quyền cho vai trò thành công!');

            // Cập nhật lại danh sách quyền của vai trò
            this.rolePermissions = await this.getRolePermissions(this.currentRoleId);
        } catch (error) {
            this.showLoading(false);
            console.error('Error saving role permissions:', error);
            showNotification('error', 'Lỗi', error.message || 'Không thể cập nhật quyền cho vai trò!');
        }
    }

    /**
     * Xóa quyền khỏi vai trò
     * @param {number} permissionId - ID của quyền
     * @return {Promise<void>}
     * */
    async removePermissionFromRole(permissionId) {
        try {
            // Xác nhận trước khi xóa
            const confirmed = showConfirmDialog(
                'Xác nhận xóa',
                'Bạn có chắc chắn muốn xóa quyền này khỏi vai trò?',
                'Xóa',
                async () => {
                    this.showLoading(true);

                    // Gọi service để xóa quyền khỏi vai trò
                    await this.rolePermissionService.removePermissionFromRole(this.currentRoleId, permissionId);

                    // Cập nhật lại danh sách quyền
                    this.rolePermissions = await this.getRolePermissions(this.currentRoleId);
                    this.renderPermissionsByModule();

                    this.showLoading(false);

                    showNotification('success', 'Thành công', 'Đã xóa quyền khỏi vai trò!');
                }
            );
        } catch (error) {
            this.showLoading(false);
            console.error('Error removing permission:', error);
            showNotification('error', 'Lỗi', error.message || 'Không thể xóa quyền khỏi vai trò!');
        }
    }

    /**
     * Đăng ký các event listeners
     */
    registerEventListeners() {
        // Xử lý sự kiện khi chọn vai trò
        const selectRoleElement = document.getElementById('selectRole');
        if (selectRoleElement) {
            selectRoleElement.addEventListener('change', (e) => {
                const roleId = e.target.value;
                if (roleId) {
                    this.handleRoleSelection(roleId);
                }
            });
        }

        // Xử lý sự kiện khi click chọn tất cả
        const btnSelectAll = document.getElementById('btnSelectAllPermissions');
        if (btnSelectAll) {
            btnSelectAll.addEventListener('click', () => this.selectAllPermissions());
        }

        // Xử lý sự kiện khi click bỏ chọn tất cả
        const btnDeselectAll = document.getElementById('btnDeselectAllPermissions');
        if (btnDeselectAll) {
            btnDeselectAll.addEventListener('click', () => this.deselectAllPermissions());
        }

        // Xử lý sự kiện khi click lưu thay đổi
        const btnSavePermissions = document.getElementById('btnSaveRolePermissions');
        if (btnSavePermissions) {
            btnSavePermissions.addEventListener('click', () => this.saveRolePermissions());
        }

        // Xử lý sự kiện khi thay đổi checkbox (để cập nhật badge)
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('permission-checkbox')) {
                this.updateModuleBadges();
            }
        });
    }
}