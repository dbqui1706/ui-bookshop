// js/app/permissions/userRoles.js

// Dữ liệu mẫu cho người dùng
const mockUsers = [
    { id: 1, username: "admin", fullname: "Admin User", email: "admin@bookshop.com", is_active: true },
    { id: 2, username: "customer1", fullname: "Customer One", email: "customer1@example.com", is_active: true },
    { id: 3, username: "employee1", fullname: "Employee One", email: "employee1@bookshop.com", is_active: true },
    { id: 4, username: "shipper1", fullname: "Shipper One", email: "shipper1@bookshop.com", is_active: true },
    { id: 5, username: "manager1", fullname: "Manager One", email: "manager1@bookshop.com", is_active: true },
    { id: 6, username: "editor1", fullname: "Editor One", email: "editor1@bookshop.com", is_active: false }
];

// Import dữ liệu mẫu và tạo các quan hệ giữa user và role
import { mockRoles } from './roles.js';
import { mockPermissions } from './permissions.js';

// Dữ liệu mẫu về vai trò đã gán cho người dùng
const mockUserRoles = [
    { user_id: 1, role_id: 1 }, // admin có vai trò ADMIN
    { user_id: 2, role_id: 2 }, // customer1 có vai trò CUSTOMER
    { user_id: 3, role_id: 3 }, // employee1 có vai trò EMPLOYEE
    { user_id: 4, role_id: 4 }, // shipper1 có vai trò SHIPPING
    { user_id: 5, role_id: 3 }, // manager1 có vai trò EMPLOYEE
    { user_id: 5, role_id: 5 }, // manager1 có vai trò MANAGER
    { user_id: 6, role_id: 6 }  // editor1 có vai trò CONTENT_EDITOR
];

// Dữ liệu mẫu về quyền đặc biệt được gán trực tiếp cho người dùng
const mockUserPermissions = [
    { user_id: 3, permission_id: 9, is_granted: 1 }, // employee1 được cấp thêm quyền xem danh sách đơn hàng
    { user_id: 5, permission_id: 12, is_granted: 1 }, // manager1 được cấp thêm quyền xem báo cáo doanh thu
    { user_id: 5, permission_id: 14, is_granted: 1 }, // manager1 được cấp thêm quyền xem nhật ký hệ thống
    { user_id: 1, permission_id: 5, is_granted: 0 }  // admin bị từ chối quyền xóa người dùng (mặc dù vai trò ADMIN có quyền này)
];

let dataTable;
let currentUserId = null;
let currentAction = 'roles'; // 'roles' hoặc 'permissions'

// Hàm khởi tạo DataTable và xử lý sự kiện
export function loadUserRoles() {
    // Nếu DataTable đã được khởi tạo, hủy nó để tạo lại
    if (dataTable) {
        dataTable.destroy();
    }

    // Khởi tạo DataTable
    dataTable = new DataTable('#usersTable', {
        data: mockUsers,
        columns: [
            { data: 'id' },
            { data: 'username' },
            { data: 'fullname' },
            { data: 'email' },
            { 
                data: null,
                render: function(data) {
                    // Lấy danh sách vai trò của người dùng
                    const userRoles = mockUserRoles
                        .filter(ur => ur.user_id === data.id)
                        .map(ur => {
                            const role = mockRoles.find(r => r.id === ur.role_id);
                            return role ? role.name : '';
                        });
                    
                    // Hiển thị các badge cho từng vai trò
                    let html = '';
                    userRoles.forEach(roleName => {
                        const badgeClass = getBadgeClassForRole(roleName);
                        html += `<span class="role-badge ${badgeClass}">${roleName}</span>`;
                    });
                    
                    return html || '<span class="text-muted">Chưa có vai trò</span>';
                }
            },
            {
                data: null,
                render: function(data) {
                    return `
                        <div class="btn-group">
                            <button class="btn btn-sm btn-outline-primary edit-user-roles" data-id="${data.id}" title="Gán vai trò">
                                <i class="bi bi-person-badge"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-info edit-user-permissions" data-id="${data.id}" title="Quyền đặc biệt">
                                <i class="bi bi-key"></i>
                            </button>
                        </div>
                    `;
                }
            }
        ],
        responsive: true,
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/vi.json',
        }
    });

    // Xử lý sự kiện khi click vào nút gán vai trò
    document.querySelector('#usersTable tbody').addEventListener('click', function(e) {
        if (e.target.closest('.edit-user-roles')) {
            const userId = e.target.closest('.edit-user-roles').getAttribute('data-id');
            openUserRolesModal(userId);
        }
    });

    // Xử lý sự kiện khi click vào nút quyền đặc biệt
    document.querySelector('#usersTable tbody').addEventListener('click', function(e) {
        if (e.target.closest('.edit-user-permissions')) {
            const userId = e.target.closest('.edit-user-permissions').getAttribute('data-id');
            openUserPermissionsModal(userId);
        }
    });

    // Xử lý sự kiện lưu vai trò cho người dùng
    document.getElementById('btnSaveUserRoles').addEventListener('click', function() {
        saveUserRoles();
    });

    // Xử lý sự kiện lưu quyền đặc biệt cho người dùng
    document.getElementById('btnSaveUserSpecialPermissions').addEventListener('click', function() {
        saveUserSpecialPermissions();
    });

    // Xử lý sự kiện thêm quyền đặc biệt
    document.getElementById('btnAddGrantPermission').addEventListener('click', function() {
        currentAction = 'grant';
        openAddSpecialPermissionModal();
    });

    document.getElementById('btnAddDenyPermission').addEventListener('click', function() {
        currentAction = 'deny';
        openAddSpecialPermissionModal();
    });

    // Xử lý sự kiện xác nhận thêm quyền đặc biệt
    document.getElementById('btnConfirmAddSpecialPermission').addEventListener('click', function() {
        addSpecialPermission();
    });

    // Khởi tạo select2 cho dropdown chọn quyền
    $('#selectSpecialPermission').select2({
        dropdownParent: $('#addSpecialPermissionModal'),
        width: '100%',
        placeholder: '-- Chọn quyền --',
        allowClear: true
    });
}

// Hàm mở modal gán vai trò cho người dùng
function openUserRolesModal(userId) {
    const user = mockUsers.find(u => u.id == userId);
    if (user) {
        currentUserId = user.id;
        document.getElementById('userName').textContent = user.fullname;
        
        // Nạp danh sách vai trò
        loadRolesForUser(user.id);
        
        const userRolesModal = new bootstrap.Modal(document.getElementById('userRolesModal'));
        userRolesModal.show();
    }
}

// Hàm nạp danh sách vai trò cho người dùng
function loadRolesForUser(userId) {
    // Lấy danh sách vai trò đã gán cho người dùng
    const userRoleIds = mockUserRoles
        .filter(ur => ur.user_id == userId)
        .map(ur => ur.role_id);
    
    // Hiển thị danh sách vai trò dưới dạng checkbox
    const rolesContainer = document.getElementById('rolesCheckboxes');
    rolesContainer.innerHTML = '';
    
    mockRoles.forEach(role => {
        const isChecked = userRoleIds.includes(role.id);
        const col = document.createElement('div');
        col.className = 'col-md-6 mb-2';
        col.innerHTML = `
            <div class="form-check">
                <input class="form-check-input role-checkbox" type="checkbox" 
                       id="role${role.id}" 
                       value="${role.id}" 
                       ${isChecked ? 'checked' : ''}>
                <label class="form-check-label" for="role${role.id}">
                    ${role.name}
                </label>
                <div class="form-text small">${role.description || ''}</div>
            </div>
        `;
        rolesContainer.appendChild(col);
    });
}

// Hàm lưu vai trò cho người dùng
function saveUserRoles() {
    // Lấy danh sách vai trò đã chọn
    const selectedRoleIds = [];
    document.querySelectorAll('.role-checkbox:checked').forEach(checkbox => {
        selectedRoleIds.push(parseInt(checkbox.value));
    });
    
    // Xóa tất cả vai trò hiện tại của người dùng
    mockUserRoles = mockUserRoles.filter(ur => ur.user_id !== currentUserId);
    
    // Thêm các vai trò mới được chọn
    selectedRoleIds.forEach(roleId => {
        mockUserRoles.push({
            user_id: currentUserId,
            role_id: roleId
        });
    });
    
    // Cập nhật DataTable
    dataTable.ajax.reload(null, false);
    
    // Đóng modal
    bootstrap.Modal.getInstance(document.getElementById('userRolesModal')).hide();
    
    // Hiển thị thông báo thành công
    Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Cập nhật vai trò cho người dùng thành công!',
        timer: 1500,
        showConfirmButton: false
    });
    
    // Load lại DataTable để cập nhật hiển thị
    dataTable.clear().rows.add(mockUsers).draw();
}

// Hàm mở modal quyền đặc biệt cho người dùng
function openUserPermissionsModal(userId) {
    const user = mockUsers.find(u => u.id == userId);
    if (user) {
        currentUserId = user.id;
        document.getElementById('userNameSpecial').textContent = user.fullname;
        
        // Nạp danh sách quyền đặc biệt
        loadSpecialPermissionsForUser(user.id);
        
        const userPermissionsModal = new bootstrap.Modal(document.getElementById('userSpecialPermissionsModal'));
        userPermissionsModal.show();
    }
}

// Hàm nạp danh sách quyền đặc biệt cho người dùng
function loadSpecialPermissionsForUser(userId) {
    // Lấy danh sách quyền đặc biệt đã gán cho người dùng
    const grantedPermissions = mockUserPermissions
        .filter(up => up.user_id == userId && up.is_granted == 1)
        .map(up => {
            const permission = mockPermissions.find(p => p.id === up.permission_id);
            return permission;
        })
        .filter(p => p !== undefined);
    
    const deniedPermissions = mockUserPermissions
        .filter(up => up.user_id == userId && up.is_granted == 0)
        .map(up => {
            const permission = mockPermissions.find(p => p.id === up.permission_id);
            return permission;
        })
        .filter(p => p !== undefined);
    
    // Hiển thị danh sách quyền được cấp
    const grantedTable = document.getElementById('grantPermissionsTable').getElementsByTagName('tbody')[0];
    grantedTable.innerHTML = '';
    
    if (grantedPermissions.length > 0) {
        grantedPermissions.forEach(permission => {
            const row = grantedTable.insertRow();
            row.innerHTML = `
                <td>${permission.name}</td>
                <td><span class="badge bg-${getModuleColor(permission.module)}">${getModuleName(permission.module)}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-danger remove-special-permission" 
                            data-id="${permission.id}" data-type="grant">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
        });
    } else {
        const row = grantedTable.insertRow();
        row.innerHTML = '<td colspan="3" class="text-center text-muted">Không có quyền đặc biệt nào được cấp</td>';
    }
    
    // Hiển thị danh sách quyền bị từ chối
    const deniedTable = document.getElementById('denyPermissionsTable').getElementsByTagName('tbody')[0];
    deniedTable.innerHTML = '';
    
    if (deniedPermissions.length > 0) {
        deniedPermissions.forEach(permission => {
            const row = deniedTable.insertRow();
            row.innerHTML = `
                <td>${permission.name}</td>
                <td><span class="badge bg-${getModuleColor(permission.module)}">${getModuleName(permission.module)}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-danger remove-special-permission" 
                            data-id="${permission.id}" data-type="deny">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
        });
    } else {
        const row = deniedTable.insertRow();
        row.innerHTML = '<td colspan="3" class="text-center text-muted">Không có quyền đặc biệt nào bị từ chối</td>';
    }
    
    // Xử lý sự kiện xóa quyền đặc biệt
    document.querySelectorAll('.remove-special-permission').forEach(button => {
        button.addEventListener('click', function() {
            const permissionId = this.getAttribute('data-id');
            const type = this.getAttribute('data-type');
            removeSpecialPermission(permissionId, type);
        });
    });
}

// Hàm mở modal thêm quyền đặc biệt
function openAddSpecialPermissionModal() {
    // Nạp danh sách quyền vào dropdown
    loadPermissionsDropdown();
    
    // Cập nhật tiêu đề modal
    document.getElementById('addSpecialPermissionModalLabel').textContent = 
        (currentAction === 'grant') ? 'Thêm quyền được cấp' : 'Thêm quyền bị từ chối';
    
    // Hiển thị modal
    const modal = new bootstrap.Modal(document.getElementById('addSpecialPermissionModal'));
    modal.show();
}

// Hàm nạp danh sách quyền vào dropdown
function loadPermissionsDropdown() {
    const selectPermission = document.getElementById('selectSpecialPermission');
    
    // Xóa tất cả các option hiện tại (trừ option mặc định)
    while (selectPermission.options.length > 1) {
        selectPermission.remove(1);
    }
    
    // Lấy danh sách quyền đặc biệt hiện tại của người dùng
    const existingPermissionIds = mockUserPermissions
        .filter(up => up.user_id == currentUserId)
        .map(up => up.permission_id);
    
    // Thêm các option mới (chỉ hiển thị các quyền chưa được gán)
    mockPermissions
        .filter(p => !existingPermissionIds.includes(p.id))
        .forEach(permission => {
            const option = document.createElement('option');
            option.value = permission.id;
            option.textContent = `${permission.name} (${getModuleName(permission.module)})`;
            selectPermission.appendChild(option);
        });
}

// Hàm thêm quyền đặc biệt
function addSpecialPermission() {
    const permissionId = document.getElementById('selectSpecialPermission').value;
    
    if (!permissionId) {
        Swal.fire({
            icon: 'warning',
            title: 'Chưa chọn quyền',
            text: 'Vui lòng chọn quyền để thêm!'
        });
        return;
    }
    
    // Thêm quyền đặc biệt
    mockUserPermissions.push({
        user_id: currentUserId,
        permission_id: parseInt(permissionId),
        is_granted: currentAction === 'grant' ? 1 : 0
    });
    
    // Đóng modal
    bootstrap.Modal.getInstance(document.getElementById('addSpecialPermissionModal')).hide();
    
    // Cập nhật lại danh sách quyền đặc biệt
    loadSpecialPermissionsForUser(currentUserId);
    
    // Hiển thị thông báo thành công
    Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Thêm quyền đặc biệt thành công!',
        timer: 1500,
        showConfirmButton: false
    });
}

// Hàm xóa quyền đặc biệt
function removeSpecialPermission(permissionId, type) {
    // Hiển thị hộp thoại xác nhận
    Swal.fire({
        title: 'Xác nhận xóa',
        text: 'Bạn có chắc chắn muốn xóa quyền đặc biệt này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            // Xóa quyền đặc biệt
            const isGranted = type === 'grant' ? 1 : 0;
            mockUserPermissions = mockUserPermissions.filter(up => 
                !(up.user_id == currentUserId && up.permission_id == permissionId && up.is_granted == isGranted)
            );
            
            // Cập nhật lại danh sách quyền đặc biệt
            loadSpecialPermissionsForUser(currentUserId);
            
            // Hiển thị thông báo thành công
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Xóa quyền đặc biệt thành công!',
                timer: 1500,
                showConfirmButton: false
            });
        }
    });
}

// Hàm lưu quyền đặc biệt cho người dùng
function saveUserSpecialPermissions() {
    // Đóng modal
    bootstrap.Modal.getInstance(document.getElementById('userSpecialPermissionsModal')).hide();
    
    // Hiển thị thông báo thành công
    Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Cập nhật quyền đặc biệt thành công!',
        timer: 1500,
        showConfirmButton: false
    });
}

// Hàm lấy class cho badge vai trò
function getBadgeClassForRole(roleName) {
    const roleClasses = {
        'ADMIN': 'role-badge-admin',
        'CUSTOMER': 'role-badge-customer',
        'EMPLOYEE': 'role-badge-employee',
        'SHIPPING': 'role-badge-shipping'
    };
    
    return roleClasses[roleName] || '';
}

// Hàm lấy tên module
function getModuleName(moduleCode) {
    const moduleNames = {
        user: 'Người dùng',
        product: 'Sản phẩm',
        order: 'Đơn hàng',
        shipping: 'Vận chuyển',
        report: 'Báo cáo',
        system: 'Hệ thống'
    };
    return moduleNames[moduleCode] || moduleCode;
}

// Hàm lấy màu cho module
function getModuleColor(moduleCode) {
    const moduleColors = {
        user: 'primary',
        product: 'success',
        order: 'info',
        shipping: 'warning',
        report: 'secondary',
        system: 'danger'
    };
    return moduleColors[moduleCode] || 'dark';
}