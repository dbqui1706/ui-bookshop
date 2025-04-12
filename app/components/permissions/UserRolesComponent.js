import { User } from '../../models/user.js';
import { userService } from '../../services/UserService.js';
import { roleService } from '../../services/RoleService.js';
import { userRoleService } from '../../services/UserRoleService.js';
import { userPermissionService } from '../../services/UserPermissionService.js';
import { EventBus } from '../../core/eventBus.js';
import { formatDate, showNotification, showConfirmDialog } from '../../core/utils.js';
import { getToken } from '../../core/storage.js';

/**
 * Class UserRolesComponent - Component xử lý hiển thị và tương tác với gán vai trò cho người dùng
 */
export class UserRolesComponent {
    /**
     * Khởi tạo component
     * @param {HTMLElement} container - Element container chứa component
     */
    constructor(container) {
        this.container = container;
        this.dataTable = null;
        this.currentUserId = null;
        this.allRoles = [];
        
        // Lấy service
        this.userService = userService.getInstance();
        this.roleService = roleService.getInstance();
        this.userRoleService = userRoleService.getInstance();
        this.userPermissionService = userPermissionService.getInstance();
        this.eventBus = EventBus.getInstance();
        
        // Các modal
        this.userRolesModal = null;
        this.userSpecialPermissionsModal = null;
        this.addSpecialPermissionModal = null;
        
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
            
            // Lấy danh sách vai trò để hiển thị checkbox
            await this.loadAllRoles();
            
            // Khởi tạo DataTable
            this.initDataTable();
            
            // Khởi tạo modals
            this.initModals();
            
            this.showLoading(false);
        } catch (error) {
            this.showLoading(false);
            console.error('Error initializing UserRolesComponent:', error);
            showNotification('error', 'Lỗi', 'Không thể khởi tạo dữ liệu người dùng.');
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
     * Lấy danh sách tất cả vai trò
     */
    async loadAllRoles() {
        try {
            this.allRoles = await this.roleService.getAllRoles();
        } catch (error) {
            console.error('Error loading all roles:', error);
            showNotification('error', 'Lỗi', 'Không thể tải danh sách vai trò.');
            throw error;
        }
    }

    /**
     * Khởi tạo DataTable
     */
    initDataTable() {
        // Hủy DataTable cũ nếu đã tồn tại
        if (this.dataTable) {
            this.dataTable.destroy();
        }

        // Khởi tạo DataTable mới với server-side processing
        this.dataTable = new DataTable('#usersTable', {
            processing: true,
            serverSide: true,
            ajax: {
                url: 'http://localhost:8080/api/admin/users',
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
                { data: 'username' },
                { data: 'fullName' },
                { data: 'email' },
                { 
                    data: 'roles',
                    render: (data) => this.renderRoleBadges(data)
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
     * Render badges cho vai trò
     * @param {Array} roles - Danh sách vai trò
     * @returns {string} - HTML string badges
     */
    renderRoleBadges(roles) {
        if (!roles || roles.length === 0) {
            return '<span class="badge bg-secondary">Chưa có vai trò</span>';
        }

        let badges = '';
        roles.forEach(role => {
            const roleName = typeof role === 'object' ? role.name : role;
            const isSystem = typeof role === 'object' ? role.isSystem : false;
            const badgeClass = isSystem ? 'bg-primary' : 'bg-success';
            badges += `<span class="badge ${badgeClass} me-1">${roleName}</span>`;
        });
        
        return badges;
    }

    /**
     * Render các nút thao tác
     * @param {Object} data - Dữ liệu người dùng từ server
     * @returns {string} - HTML string các nút thao tác
     */
    renderActionButtons(data) {
        const manageRolesBtn = `<button class="btn btn-sm btn-outline-primary manage-roles me-1" data-id="${data.id}" title="Quản lý vai trò"><i class="bi bi-people"></i></button>`;
        const specialPermissionsBtn = `<button class="btn btn-sm btn-outline-warning special-permissions me-1" data-id="${data.id}" title="Quyền đặc biệt"><i class="bi bi-shield-lock"></i></button>`;
        
        return manageRolesBtn + specialPermissionsBtn;
    }

    /**
     * Khởi tạo các modal
     */
    initModals() {
        // Modal gán vai trò cho người dùng
        const userRolesModalElement = document.getElementById('userRolesModal');
        if (userRolesModalElement) {
            this.userRolesModal = new bootstrap.Modal(userRolesModalElement);
        }
        
        // Modal quyền đặc biệt cho người dùng
        const userSpecialPermissionsModalElement = document.getElementById('userSpecialPermissionsModal');
        if (userSpecialPermissionsModalElement) {
            this.userSpecialPermissionsModal = new bootstrap.Modal(userSpecialPermissionsModalElement);
        }
        
        // Modal thêm quyền đặc biệt
        const addSpecialPermissionModalElement = document.getElementById('addSpecialPermissionModal');
        if (addSpecialPermissionModalElement) {
            this.addSpecialPermissionModal = new bootstrap.Modal(addSpecialPermissionModalElement);
        }
    }

    /**
     * Đăng ký các event listeners
     */
    registerEventListeners() {
        // Xử lý sự kiện gán vai trò cho người dùng và quyền đặc biệt (sử dụng event delegation)
        document.addEventListener('click', (e) => {
            // Nút quản lý vai trò
            const manageRolesButton = e.target.closest('.manage-roles');
            if (manageRolesButton) {
                const userId = manageRolesButton.getAttribute('data-id');
                this.openUserRolesModal(userId);
            }
            
            // Nút quyền đặc biệt
            const specialPermissionsButton = e.target.closest('.special-permissions');
            if (specialPermissionsButton) {
                const userId = specialPermissionsButton.getAttribute('data-id');
                this.openUserSpecialPermissionsModal(userId);
            }
        });

        // Xử lý sự kiện lưu vai trò cho người dùng
        const btnSaveUserRoles = document.getElementById('btnSaveUserRoles');
        if (btnSaveUserRoles) {
            btnSaveUserRoles.addEventListener('click', () => this.saveUserRoles());
        }
        
        // Xử lý sự kiện lưu quyền đặc biệt cho người dùng
        const btnSaveUserSpecialPermissions = document.getElementById('btnSaveUserSpecialPermissions');
        if (btnSaveUserSpecialPermissions) {
            btnSaveUserSpecialPermissions.addEventListener('click', () => this.saveUserSpecialPermissions());
        }
        
        // Xử lý sự kiện thêm quyền được cấp
        const btnAddGrantPermission = document.getElementById('btnAddGrantPermission');
        if (btnAddGrantPermission) {
            btnAddGrantPermission.addEventListener('click', () => this.openAddSpecialPermissionModal(true));
        }
        
        // Xử lý sự kiện thêm quyền bị từ chối
        const btnAddDenyPermission = document.getElementById('btnAddDenyPermission');
        if (btnAddDenyPermission) {
            btnAddDenyPermission.addEventListener('click', () => this.openAddSpecialPermissionModal(false));
        }
        
        // Xử lý sự kiện xác nhận thêm quyền đặc biệt
        const btnConfirmAddSpecialPermission = document.getElementById('btnConfirmAddSpecialPermission');
        if (btnConfirmAddSpecialPermission) {
            btnConfirmAddSpecialPermission.addEventListener('click', () => this.addSpecialPermission());
        }
        
        // Đăng ký theo dõi các sự kiện từ EventBus
        this.eventBus.subscribe('user-roles:updated', () => this.refreshDataTable());
        this.eventBus.subscribe('user-permission:granted', () => this.refreshDataTable());
        this.eventBus.subscribe('user-permission:denied', () => this.refreshDataTable());
        this.eventBus.subscribe('user-permission:removed', () => this.refreshDataTable());
    }

    /**
     * Mở modal gán vai trò cho người dùng
     * @param {string|number} userId - ID của người dùng
     */
    async openUserRolesModal(userId) {
        try {
            this.showLoading(true);
            
            // Lấy thông tin người dùng
            const user = await this.userService.getUserById(userId);
            
            // Lấy danh sách vai trò của người dùng
            const userRoles = await this.userRoleService.getRolesByUserId(userId);
            
            this.showLoading(false);
            
            if (user) {
                this.currentUserId = user.id;
                
                // Hiển thị tên người dùng
                const userNameElement = document.getElementById('userName');
                if (userNameElement) {
                    userNameElement.textContent = user.fullName || user.username;
                }
                
                // Cập nhật trường ẩn userId
                const userIdField = document.getElementById('userId');
                if (userIdField) {
                    userIdField.value = user.id;
                }
                
                // Render danh sách checkbox vai trò
                this.renderRolesCheckboxes(userRoles);
                
                // Hiển thị modal
                this.userRolesModal.show();
            } else {
                showNotification('error', 'Lỗi', 'Không tìm thấy thông tin người dùng!');
            }
        } catch (error) {
            this.showLoading(false);
            console.error('Error loading user roles:', error);
            showNotification('error', 'Lỗi', 'Không thể tải thông tin vai trò. ' + error.message);
        }
    }

    /**
     * Render danh sách checkbox vai trò
     * @param {Array} userRoles - Danh sách vai trò hiện tại của người dùng
     */
    renderRolesCheckboxes(userRoles) {
        const rolesCheckboxesContainer = document.getElementById('rolesCheckboxes');
        if (!rolesCheckboxesContainer) return;
        
        // Xóa nội dung cũ
        rolesCheckboxesContainer.innerHTML = '';
        
        // Tạo các checkbox cho từng vai trò
        this.allRoles.forEach(role => {
            // Kiểm tra xem người dùng đã có vai trò này chưa
            const isChecked = userRoles.some(userRole => 
                (typeof userRole === 'object' ? userRole.id === role.id : userRole === role.id)
            );
            
            // Tạo element checkbox
            const checkboxColumn = document.createElement('div');
            checkboxColumn.className = 'col-md-6 mb-2';
            
            checkboxColumn.innerHTML = `
                <div class="form-check">
                    <input class="form-check-input role-checkbox" type="checkbox" 
                           id="role-${role.id}" value="${role.id}" ${isChecked ? 'checked' : ''}>
                    <label class="form-check-label" for="role-${role.id}">
                        ${role.name} ${role.isSystem ? '<span class="badge bg-primary">Hệ thống</span>' : ''}
                    </label>
                </div>
            `;
            
            rolesCheckboxesContainer.appendChild(checkboxColumn);
        });
    }

    /**
     * Lưu danh sách vai trò cho người dùng
     */
    async saveUserRoles() {
        try {
            if (!this.currentUserId) {
                showNotification('warning', 'Thiếu thông tin', 'Không tìm thấy ID người dùng!');
                return;
            }
            
            this.showLoading(true);
            
            // Thu thập danh sách vai trò được chọn
            const selectedRoleIds = [];
            document.querySelectorAll('.role-checkbox:checked').forEach(checkbox => {
                selectedRoleIds.push(parseInt(checkbox.value));
            });
            
            // Gửi yêu cầu cập nhật vai trò cho người dùng
            await this.userRoleService.setRolesForUser(this.currentUserId, selectedRoleIds);
            
            this.showLoading(false);
            
            // Đóng modal
            this.userRolesModal.hide();
            
            // Cập nhật DataTable
            this.refreshDataTable();
            
            showNotification('success', 'Thành công', 'Cập nhật vai trò cho người dùng thành công!');
        } catch (error) {
            this.showLoading(false);
            console.error('Error saving user roles:', error);
            showNotification('error', 'Lỗi', error.message || 'Không thể cập nhật vai trò cho người dùng!');
        }
    }

    /**
     * Mở modal quyền đặc biệt cho người dùng
     * @param {string|number} userId - ID của người dùng
     */
    async openUserSpecialPermissionsModal(userId) {
        try {
            this.showLoading(true);
            
            // Lấy thông tin người dùng
            const user = await this.userService.getUserById(userId);
            
            // Lấy danh sách quyền đặc biệt của người dùng
            const specialPermissions = await this.userPermissionService.getSpecialPermissionsByUserId(userId);
            
            this.showLoading(false);
            
            if (user) {
                this.currentUserId = user.id;
                
                // Hiển thị tên người dùng
                const userNameSpecialElement = document.getElementById('userNameSpecial');
                if (userNameSpecialElement) {
                    userNameSpecialElement.textContent = user.fullName || user.username;
                }
                
                // Hiển thị danh sách quyền đặc biệt
                this.renderSpecialPermissions(specialPermissions);
                
                // Hiển thị modal
                this.userSpecialPermissionsModal.show();
            } else {
                showNotification('error', 'Lỗi', 'Không tìm thấy thông tin người dùng!');
            }
        } catch (error) {
            this.showLoading(false);
            console.error('Error loading special permissions:', error);
            showNotification('error', 'Lỗi', 'Không thể tải thông tin quyền đặc biệt. ' + error.message);
        }
    }

    /**
     * Render danh sách quyền đặc biệt
     * @param {Array} specialPermissions - Danh sách quyền đặc biệt
     */
    renderSpecialPermissions(specialPermissions) {
        // Phân loại quyền được cấp và bị từ chối
        const grantedPermissions = specialPermissions.filter(p => p.granted);
        const deniedPermissions = specialPermissions.filter(p => !p.granted);
        
        // Render bảng quyền được cấp
        const grantTableBody = document.querySelector('#grantPermissionsTable tbody');
        if (grantTableBody) {
            grantTableBody.innerHTML = this.renderSpecialPermissionsTable(grantedPermissions);
        }
        
        // Render bảng quyền bị từ chối
        const denyTableBody = document.querySelector('#denyPermissionsTable tbody');
        if (denyTableBody) {
            denyTableBody.innerHTML = this.renderSpecialPermissionsTable(deniedPermissions);
        }
        
        // Đăng ký sự kiện xóa quyền đặc biệt
        document.querySelectorAll('.remove-special-permission').forEach(button => {
            button.addEventListener('click', (e) => {
                const permissionId = e.target.closest('.remove-special-permission').getAttribute('data-id');
                this.removeSpecialPermission(permissionId);
            });
        });
    }

    /**
     * Render bảng quyền đặc biệt
     * @param {Array} permissions - Danh sách quyền đặc biệt
     * @returns {string} - HTML string bảng quyền
     */
    renderSpecialPermissionsTable(permissions) {
        if (permissions.length === 0) {
            return '<tr><td colspan="3" class="text-center">Không có dữ liệu</td></tr>';
        }
        
        let html = '';
        permissions.forEach(permission => {
            html += `
                <tr>
                    <td>${permission.permissionName || 'N/A'}</td>
                    <td>${permission.module || 'N/A'}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-danger remove-special-permission" 
                                data-id="${permission.permissionId}" title="Xóa quyền">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        return html;
    }

    /**
     * Mở modal thêm quyền đặc biệt
     * @param {boolean} isGrant - true: cấp quyền, false: từ chối quyền
     */
    async openAddSpecialPermissionModal(isGrant) {
        try {
            // Cập nhật modal
            document.getElementById('addSpecialPermissionModalLabel').textContent = 
                isGrant ? 'Thêm quyền được cấp' : 'Thêm quyền bị từ chối';
            
            // Lưu loại quyền vào data attribute của nút xác nhận
            const btnConfirm = document.getElementById('btnConfirmAddSpecialPermission');
            if (btnConfirm) {
                btnConfirm.setAttribute('data-grant', isGrant ? 'true' : 'false');
            }
            
            // Đóng modal quyền đặc biệt tạm thời
            this.userSpecialPermissionsModal.hide();
            
            // Lấy danh sách tất cả quyền
            const permissions = await this.permissionService.getAllPermissions();
            
            // Lấy danh sách quyền đặc biệt hiện tại của người dùng
            const specialPermissions = await this.userPermissionService.getSpecialPermissionsByUserId(this.currentUserId);
            
            // Lọc ra các quyền chưa được thêm vào quyền đặc biệt
            const existingPermissionIds = specialPermissions.map(p => p.permissionId);
            const availablePermissions = permissions.filter(p => !existingPermissionIds.includes(p.id));
            
            // Hiển thị danh sách quyền trong select
            const selectElement = document.getElementById('selectSpecialPermission');
            if (selectElement) {
                selectElement.innerHTML = '<option value="" selected disabled>-- Chọn quyền --</option>';
                
                availablePermissions.forEach(permission => {
                    selectElement.innerHTML += `<option value="${permission.id}">${permission.name} (${permission.module})</option>`;
                });
            }
            
            // Hiển thị modal thêm quyền đặc biệt
            this.addSpecialPermissionModal.show();
        } catch (error) {
            console.error('Error opening add special permission modal:', error);
            showNotification('error', 'Lỗi', 'Không thể tải danh sách quyền. ' + error.message);
            
            // Hiển thị lại modal quyền đặc biệt
            this.userSpecialPermissionsModal.show();
        }
    }

    /**
     * Thêm quyền đặc biệt cho người dùng
     */
    async addSpecialPermission() {
        try {
            // Lấy ID quyền đã chọn
            const selectElement = document.getElementById('selectSpecialPermission');
            if (!selectElement || !selectElement.value) {
                showNotification('warning', 'Thiếu thông tin', 'Vui lòng chọn quyền!');
                return;
            }
            
            const permissionId = parseInt(selectElement.value);
            
            // Lấy loại quyền (cấp/từ chối)
            const btnConfirm = document.getElementById('btnConfirmAddSpecialPermission');
            const isGrant = btnConfirm.getAttribute('data-grant') === 'true';
            
            this.showLoading(true);
            
            // Thực hiện cấp/từ chối quyền đặc biệt
            if (isGrant) {
                await this.userPermissionService.grantPermission(this.currentUserId, permissionId);
            } else {
                await this.userPermissionService.denyPermission(this.currentUserId, permissionId);
            }
            
            this.showLoading(false);
            
            // Đóng modal thêm quyền đặc biệt
            this.addSpecialPermissionModal.hide();
            
            // Hiển thị lại modal quyền đặc biệt và cập nhật danh sách
            await this.openUserSpecialPermissionsModal(this.currentUserId);
            
            showNotification('success', 'Thành công', `Đã ${isGrant ? 'cấp' : 'từ chối'} quyền đặc biệt cho người dùng!`);
        } catch (error) {
            this.showLoading(false);
            console.error('Error adding special permission:', error);
            showNotification('error', 'Lỗi', error.message || 'Không thể thêm quyền đặc biệt cho người dùng!');
        }
    }

    /**
     * Xóa quyền đặc biệt của người dùng
     * @param {string|number} permissionId - ID của quyền
     */
    async removeSpecialPermission(permissionId) {
        try {
            const confirmed = await showConfirmDialog(
                'Xác nhận xóa',
                'Bạn có chắc chắn muốn xóa quyền đặc biệt này?',
                'Xóa'
            );
            
            if (confirmed) {
                this.showLoading(true);
                
                await this.userPermissionService.removeSpecialPermission(this.currentUserId, permissionId);
                
                this.showLoading(false);
                
                // Cập nhật lại danh sách quyền đặc biệt
                await this.openUserSpecialPermissionsModal(this.currentUserId);
                
                showNotification('success', 'Thành công', 'Đã xóa quyền đặc biệt!');
            }
        } catch (error) {
            this.showLoading(false);
            console.error('Error removing special permission:', error);
            showNotification('error', 'Lỗi', error.message || 'Không thể xóa quyền đặc biệt!');
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