// js/app/permissions/rolePermissions.js

// Import dữ liệu mẫu (trong thực tế sẽ được tải từ API)
import { mockRoles } from './roles.js';
import { mockPermissions } from './permissions.js';

// Dữ liệu mẫu về quyền đã được gán cho vai trò
export const mockRolePermissions = [
    // ADMIN có tất cả quyền
    { role_id: 1, permission_id: 1 },
    { role_id: 1, permission_id: 2 },
    { role_id: 1, permission_id: 3 },
    { role_id: 1, permission_id: 4 },
    { role_id: 1, permission_id: 5 },
    { role_id: 1, permission_id: 6 },
    { role_id: 1, permission_id: 7 },
    { role_id: 1, permission_id: 8 },
    { role_id: 1, permission_id: 9 },
    { role_id: 1, permission_id: 10 },
    { role_id: 1, permission_id: 11 },
    { role_id: 1, permission_id: 12 },
    { role_id: 1, permission_id: 13 },
    { role_id: 1, permission_id: 14 },
    
    // CUSTOMER có một số quyền giới hạn
    { role_id: 2, permission_id: 6 }, // Xem danh sách sản phẩm
    { role_id: 2, permission_id: 7 }, // Xem chi tiết sản phẩm
    
    // EMPLOYEE có quyền quản lý sản phẩm, xem đơn hàng
    { role_id: 3, permission_id: 6 }, // Xem danh sách sản phẩm
    { role_id: 3, permission_id: 7 }, // Xem chi tiết sản phẩm
    { role_id: 3, permission_id: 8 }, // Tạo sản phẩm mới
    { role_id: 3, permission_id: 9 }, // Xem danh sách đơn hàng
    { role_id: 3, permission_id: 10 }, // Xem chi tiết đơn hàng
    
    // SHIPPING có quyền quản lý vận chuyển, xem đơn hàng
    { role_id: 4, permission_id: 9 }, // Xem danh sách đơn hàng
    { role_id: 4, permission_id: 10 }, // Xem chi tiết đơn hàng
    { role_id: 4, permission_id: 11 }, // Xem danh sách vận chuyển
];

let selectedRoleId = null;

// Hàm khởi tạo và xử lý sự kiện
export function loadRolePermissions() {
    // Khởi tạo select2 cho dropdown chọn vai trò
    $('#selectRole').select2({
        width: '100%',
        placeholder: '-- Chọn vai trò --',
        allowClear: true
    });
    
    // Nạp danh sách vai trò vào dropdown
    loadRolesDropdown();
    
    // Xử lý sự kiện khi chọn vai trò
    $('#selectRole').on('select2:select', function (e) {
        selectedRoleId = this.value;
        console.log('Selected Role ID:', selectedRoleId);
        if (selectedRoleId) {
            // Hiển thị danh sách quyền
            document.getElementById('permissionsList').classList.remove('d-none');
            document.getElementById('roleSelectPrompt').classList.add('d-none');
            
            // Nạp danh sách quyền
            loadPermissionsForRole(selectedRoleId);
        } else {
            // Ẩn danh sách quyền
            document.getElementById('permissionsList').classList.add('d-none');
            document.getElementById('roleSelectPrompt').classList.remove('d-none');
        }
    });
    
    // Xử lý sự kiện tìm kiếm quyền
    document.getElementById('searchPermissions').addEventListener('input', function() {
        searchPermissions(this.value);
    });
    
    // Xử lý sự kiện chọn tất cả quyền
    document.getElementById('btnSelectAllPermissions').addEventListener('click', function() {
        selectAllPermissions();
    });
    
    // Xử lý sự kiện bỏ chọn tất cả quyền
    document.getElementById('btnDeselectAllPermissions').addEventListener('click', function() {
        deselectAllPermissions();
    });
    
    // Xử lý sự kiện lưu thay đổi
    document.getElementById('btnSaveRolePermissions').addEventListener('click', function() {
        saveRolePermissions();
    });
}

// Hàm nạp danh sách vai trò vào dropdown
function loadRolesDropdown() {
    const selectRole = document.getElementById('selectRole');
    
    // Xóa tất cả các option hiện tại (trừ option mặc định)
    while (selectRole.options.length > 1) {
        selectRole.remove(1);
    }
    
    // Thêm các option mới
    mockRoles.forEach(role => {
        const option = document.createElement('option');
        option.value = role.id;
        option.textContent = role.name;
        selectRole.appendChild(option);
    });
}

// Hàm nạp danh sách quyền cho vai trò đã chọn
function loadPermissionsForRole(roleId) {
    // Lấy danh sách quyền đã được gán cho vai trò
    const assignedPermissionIds = mockRolePermissions
        .filter(rp => rp.role_id == roleId)
        .map(rp => rp.permission_id);
    
    // Nhóm quyền theo module
    const permissionsByModule = {};
    mockPermissions.forEach(permission => {
        if (!permissionsByModule[permission.module]) {
            permissionsByModule[permission.module] = [];
        }
        permissionsByModule[permission.module].push(permission);
    });
    
    // Hiển thị quyền cho từng module
    Object.keys(permissionsByModule).forEach(module => {
        const permissionsContainer = document.querySelector(`.permission-group[data-module="${module}"]`);
        if (permissionsContainer) {
            permissionsContainer.innerHTML = '';
            
            permissionsByModule[module].forEach(permission => {
                const isChecked = assignedPermissionIds.includes(permission.id);
                
                const permissionItem = document.createElement('div');
                permissionItem.className = 'permission-item';
                permissionItem.innerHTML = `
                    <div class="form-check">
                        <input class="form-check-input permission-checkbox" type="checkbox" 
                               id="permission${permission.id}" 
                               data-id="${permission.id}" 
                               ${isChecked ? 'checked' : ''}>
                        <label class="form-check-label" for="permission${permission.id}">
                            ${permission.name}
                        </label>
                        <div class="permission-description">${permission.description || ''}</div>
                    </div>
                `;
                permissionsContainer.appendChild(permissionItem);
            });
            
            // Cập nhật số lượng quyền được chọn trong module
            updateModulePermissionCount(module);
        }
    });
    
    // Đăng ký sự kiện khi checkbox thay đổi
    document.querySelectorAll('.permission-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const module = this.closest('.permission-group').getAttribute('data-module');
            updateModulePermissionCount(module);
        });
    });
}

// Hàm cập nhật số lượng quyền được chọn trong module
function updateModulePermissionCount(module) {
    const container = document.querySelector(`.permission-group[data-module="${module}"]`);
    if (container) {
        const totalPermissions = container.querySelectorAll('.permission-checkbox').length;
        const checkedPermissions = container.querySelectorAll('.permission-checkbox:checked').length;
        
        // Cập nhật badge
        const badge = document.querySelector(`#heading${capitalizeFirstLetter(module)} .badge`);
        if (badge) {
            badge.textContent = `${checkedPermissions}/${totalPermissions}`;
            
            // Cập nhật màu badge
            if (checkedPermissions === 0) {
                badge.className = 'badge bg-secondary rounded-pill ms-2';
            } else if (checkedPermissions === totalPermissions) {
                badge.className = 'badge bg-success rounded-pill ms-2';
            } else {
                badge.className = 'badge bg-primary rounded-pill ms-2';
            }
        }
    }
}

// Hàm tìm kiếm quyền
function searchPermissions(keyword) {
    keyword = keyword.toLowerCase();
    
    document.querySelectorAll('.permission-item').forEach(item => {
        const permissionName = item.querySelector('.form-check-label').textContent.toLowerCase();
        const permissionDescription = item.querySelector('.permission-description').textContent.toLowerCase();
        
        if (permissionName.includes(keyword) || permissionDescription.includes(keyword)) {
            item.style.display = '';
            // Highlight kết quả tìm kiếm
            item.classList.add('highlight-permission');
        } else {
            item.style.display = 'none';
            item.classList.remove('highlight-permission');
        }
    });
}

// Hàm chọn tất cả quyền
function selectAllPermissions() {
    document.querySelectorAll('.permission-checkbox').forEach(checkbox => {
        checkbox.checked = true;
    });
    
    // Cập nhật số lượng
    document.querySelectorAll('.permission-group').forEach(group => {
        const module = group.getAttribute('data-module');
        updateModulePermissionCount(module);
    });
}

// Hàm bỏ chọn tất cả quyền
function deselectAllPermissions() {
    document.querySelectorAll('.permission-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Cập nhật số lượng
    document.querySelectorAll('.permission-group').forEach(group => {
        const module = group.getAttribute('data-module');
        updateModulePermissionCount(module);
    });
}

// Hàm lưu thay đổi quyền cho vai trò
function saveRolePermissions() {
    if (!selectedRoleId) {
        Swal.fire({
            icon: 'warning',
            title: 'Chưa chọn vai trò',
            text: 'Vui lòng chọn vai trò để gán quyền!'
        });
        return;
    }
    
    // Lấy danh sách quyền đã chọn
    const selectedPermissionIds = [];
    document.querySelectorAll('.permission-checkbox:checked').forEach(checkbox => {
        selectedPermissionIds.push(parseInt(checkbox.getAttribute('data-id')));
    });
    
    // Xóa tất cả quyền hiện tại của vai trò
    const roleIdInt = parseInt(selectedRoleId);
    mockRolePermissions = mockRolePermissions.filter(rp => rp.role_id !== roleIdInt);
    
    // Thêm các quyền mới được chọn
    selectedPermissionIds.forEach(permissionId => {
        mockRolePermissions.push({
            role_id: roleIdInt,
            permission_id: permissionId
        });
    });
    
    // Hiển thị thông báo thành công
    Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Cập nhật quyền cho vai trò thành công!',
        timer: 1500,
        showConfirmButton: false
    });
}

// Hàm viết hoa chữ cái đầu
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}