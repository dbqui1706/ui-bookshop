// ==========================================================
// modal.js - Xử lý các modal cho trang phân quyền
// ==========================================================

// Modal xem chi tiết vai trò
export function viewRoleModal(role) {
    // Cập nhật thông tin trong modal
    document.getElementById('viewRoleName').textContent = role.name;
    document.getElementById('viewRoleStatus').innerHTML = role.status === 'active' 
        ? '<span class="badge bg-success">Đang hoạt động</span>' 
        : '<span class="badge bg-danger">Không hoạt động</span>';
    document.getElementById('viewRoleCreatedAt').textContent = formatDate(role.createdAt);
    document.getElementById('viewRoleUpdatedAt').textContent = formatDate(role.updatedAt);
    document.getElementById('viewRoleDescription').textContent = role.description || 'Không có mô tả';
    
    // Hiển thị các quyền
    const permissionGroupsContainer = document.querySelector('.view-permission-groups');
    permissionGroupsContainer.innerHTML = '';
    
    // Nhóm các quyền theo module
    const permissionsByModule = {};
    role.permissions.forEach(permission => {
        if (!permissionsByModule[permission.module]) {
            permissionsByModule[permission.module] = [];
        }
        permissionsByModule[permission.module].push(permission);
    });
    
    // Hiển thị từng module và quyền tương ứng
    for (const [moduleName, permissions] of Object.entries(permissionsByModule)) {
        const moduleSection = document.createElement('div');
        moduleSection.className = 'card mb-3';
        
        let permissionsHtml = '';
        permissions.forEach(permission => {
            const badgeClass = permission.granted ? 'bg-success' : 'bg-secondary';
            permissionsHtml += `
                <span class="badge ${badgeClass} me-2 mb-2">${permission.name}</span>
            `;
        });
        
        moduleSection.innerHTML = `
            <div class="card-header bg-light">
                <h6 class="mb-0">${moduleName}</h6>
            </div>
            <div class="card-body">
                ${permissionsHtml}
            </div>
        `;
        
        permissionGroupsContainer.appendChild(moduleSection);
    }
    
    // Hiển thị modal
    const viewModal = new bootstrap.Modal(document.getElementById('viewRoleModal'));
    viewModal.show();
}

// Modal chỉnh sửa vai trò
export function editRoleModal(role) {
    // Cập nhật thông tin trong modal
    document.getElementById('editRoleId').value = role.id;
    document.getElementById('editRoleName').value = role.name;
    document.getElementById('editRoleDescription').value = role.description || '';
    document.getElementById('editRoleStatus').checked = role.status === 'active';
    
    // Hiển thị các quyền trong modal chỉnh sửa
    const permissionGroupsContainer = document.querySelector('.edit-permission-groups');
    permissionGroupsContainer.innerHTML = '';
    
    // Lấy danh sách module và quyền từ dữ liệu mẫu
    const permissionModules = getPermissionModules();
    
    // Tạo HTML cho các module và quyền
    permissionModules.forEach(module => {
        const moduleSection = document.createElement('div');
        moduleSection.className = 'card mb-3';
        
        let permissionsHtml = '';
        let allChecked = true;
        
        module.permissions.forEach(permission => {
            // Kiểm tra xem quyền này có được cấp cho vai trò không
            const permissionGranted = role.permissions.some(p => 
                p.id === permission.id && p.granted
            );
            
            if (!permissionGranted) {
                allChecked = false;
            }
            
            permissionsHtml += `
                <div class="form-check">
                    <input class="form-check-input edit-permission-checkbox" type="checkbox" 
                           id="edit_perm_${permission.id}" data-id="${permission.id}" data-module="${module.id}"
                           ${permissionGranted ? 'checked' : ''}>
                    <label class="form-check-label" for="edit_perm_${permission.id}">
                        ${permission.name}
                    </label>
                </div>
            `;
        });
        
        moduleSection.innerHTML = `
            <div class="card-header bg-light d-flex justify-content-between align-items-center">
                <h6 class="mb-0">${module.name}</h6>
                <div class="form-check">
                    <input class="form-check-input edit-module-checkbox" type="checkbox" 
                           id="edit_module_${module.id}" data-module="${module.id}" ${allChecked ? 'checked' : ''}>
                    <label class="form-check-label" for="edit_module_${module.id}">
                        Chọn tất cả
                    </label>
                </div>
            </div>
            <div class="card-body">
                ${permissionsHtml}
            </div>
        `;
        
        permissionGroupsContainer.appendChild(moduleSection);
    });
    
    // Thiết lập sự kiện cho checkbox "Chọn tất cả"
    const moduleCheckboxes = document.querySelectorAll('.edit-module-checkbox');
    moduleCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const moduleId = this.dataset.module;
            const permissionCheckboxes = document.querySelectorAll(`.edit-permission-checkbox[data-module="${moduleId}"]`);
            
            permissionCheckboxes.forEach(permCheckbox => {
                permCheckbox.checked = this.checked;
            });
        });
    });
    
    // Thiết lập sự kiện cho các permission checkbox
    const permissionCheckboxes = document.querySelectorAll('.edit-permission-checkbox');
    permissionCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const moduleId = this.dataset.module;
            const moduleCheckbox = document.querySelector(`.edit-module-checkbox[data-module="${moduleId}"]`);
            const permissionCheckboxes = document.querySelectorAll(`.edit-permission-checkbox[data-module="${moduleId}"]`);
            const allChecked = [...permissionCheckboxes].every(cb => cb.checked);
            
            moduleCheckbox.checked = allChecked;
        });
    });
    
    // Thiết lập sự kiện cho nút cập nhật
    const updateRoleBtn = document.getElementById('updateRoleBtn');
    updateRoleBtn.addEventListener('click', updateRole);
    
    // Hiển thị modal
    const editModal = new bootstrap.Modal(document.getElementById('editRoleModal'));
    editModal.show();
}

// Modal xóa vai trò
export function deleteRoleModal(role) {
    // Cập nhật thông tin trong modal
    document.getElementById('deleteRoleId').value = role.id;
    document.getElementById('deleteRoleName').textContent = role.name;
    document.getElementById('deleteRoleUserCount').textContent = role.userCount;
    
    // Hiển thị/ẩn cảnh báo người dùng
    const roleDeleteWarning = document.getElementById('roleDeleteWarning');
    if (role.userCount > 0) {
        roleDeleteWarning.classList.remove('d-none');
    } else {
        roleDeleteWarning.classList.add('d-none');
    }
    
    // Thiết lập sự kiện cho nút xóa
    const confirmDeleteBtn = document.getElementById('confirmDeleteRole');
    confirmDeleteBtn.addEventListener('click', deleteRole);
    
    // Hiển thị modal
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteRoleModal'));
    deleteModal.show();
}

// Hàm xử lý cập nhật vai trò
function updateRole() {
    const roleId = parseInt(document.getElementById('editRoleId').value);
    const roleName = document.getElementById('editRoleName').value;
    const roleDescription = document.getElementById('editRoleDescription').value;
    const roleStatus = document.getElementById('editRoleStatus').checked ? 'active' : 'inactive';
    
    // Validate các trường bắt buộc
    if (!roleName.trim()) {
        Swal.fire({
            title: 'Lỗi!',
            text: 'Vui lòng nhập tên vai trò',
            icon: 'error',
            confirmButtonText: 'Đóng'
        });
        return;
    }
    
    // Thu thập thông tin các quyền được chọn
    const permissions = [];
    const permissionCheckboxes = document.querySelectorAll('.edit-permission-checkbox');
    permissionCheckboxes.forEach(checkbox => {
        const permissionId = parseInt(checkbox.dataset.id);
        permissions.push({
            id: permissionId,
            granted: checkbox.checked
        });
    });
    
    // Giả lập cập nhật vai trò
    Swal.fire({
        title: 'Đang cập nhật...',
        text: 'Vui lòng chờ',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    
    setTimeout(() => {
        // Cập nhật vai trò trong mock data
        const roleIndex = mockRoles.findIndex(r => r.id === roleId);
        if (roleIndex !== -1) {
            mockRoles[roleIndex] = {
                ...mockRoles[roleIndex],
                name: roleName,
                description: roleDescription,
                status: roleStatus,
                updatedAt: new Date().toISOString(),
                permissions: permissions.map(p => {
                    const existingPermission = mockRoles[roleIndex].permissions.find(ep => ep.id === p.id);
                    return {
                        id: p.id,
                        name: existingPermission ? existingPermission.name : 'Quyền mới',
                        module: existingPermission ? existingPermission.module : 'Chưa phân loại',
                        granted: p.granted
                    };
                })
            };
        }
        
        // Đóng modal và hiển thị thông báo thành công
        const modal = bootstrap.Modal.getInstance(document.getElementById('editRoleModal'));
        modal.hide();
        
        Swal.fire({
            title: 'Thành công!',
            text: 'Đã cập nhật vai trò',
            icon: 'success',
            confirmButtonText: 'Đóng'
        }).then(() => {
            // Tải lại danh sách vai trò
            loadRoles();
        });
    }, 1000);
}

// Hàm xử lý xóa vai trò
function deleteRole() {
    const roleId = parseInt(document.getElementById('deleteRoleId').value);
    
    // Giả lập xóa vai trò
    Swal.fire({
        title: 'Đang xóa...',
        text: 'Vui lòng chờ',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    
    setTimeout(() => {
        // Xóa vai trò trong mock data
        const roleIndex = mockRoles.findIndex(r => r.id === roleId);
        if (roleIndex !== -1) {
            mockRoles.splice(roleIndex, 1);
        }
        
        // Đóng modal và hiển thị thông báo thành công
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteRoleModal'));
        modal.hide();
        
        Swal.fire({
            title: 'Thành công!',
            text: 'Đã xóa vai trò',
            icon: 'success',
            confirmButtonText: 'Đóng'
        }).then(() => {
            // Tải lại danh sách vai trò
            filteredRoles = [...mockRoles];
            loadRoles();
        });
    }, 1000);
}

// Helper function để lấy danh sách module và quyền
function getPermissionModules() {
    return [
        {
            id: 1,
            name: 'Dashboard',
            permissions: [
                { id: 1, name: 'Xem trang tổng quan' }
            ]
        },
        {
            id: 2,
            name: 'Người dùng',
            permissions: [
                { id: 2, name: 'Quản lý người dùng' },
                { id: 3, name: 'Xem danh sách người dùng' },
                { id: 4, name: 'Thêm người dùng' },
                { id: 5, name: 'Sửa người dùng' },
                { id: 6, name: 'Xóa người dùng' }
            ]
        },
        {
            id: 3,
            name: 'Phân quyền',
            permissions: [
                { id: 7, name: 'Quản lý phân quyền' }
            ]
        },
        {
            id: 4,
            name: 'Sản phẩm',
            permissions: [
                { id: 8, name: 'Quản lý sản phẩm' }
            ]
        },
        {
            id: 5,
            name: 'Đơn hàng',
            permissions: [
                { id: 9, name: 'Quản lý đơn hàng' },
                { id: 12, name: 'Đặt hàng ưu tiên' }
            ]
        },
        {
            id: 6,
            name: 'Báo cáo',
            permissions: [
                { id: 10, name: 'Xem báo cáo' }
            ]
        },
        {
            id: 7,
            name: 'Ưu đãi',
            permissions: [
                { id: 11, name: 'Xem ưu đãi VIP' }
            ]
        },
        {
            id: 8,
            name: 'Khiếu nại',
            permissions: [
                { id: 13, name: 'Xử lý khiếu nại' }
            ]
        },
        {
            id: 9,
            name: 'Hỗ trợ',
            permissions: [
                { id: 14, name: 'Trả lời tin nhắn' }
            ]
        }
    ];
}

// Helper function để format ngày
function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// Thêm tham chiếu đến các hàm cần thiết
import { loadRoles } from '../../container/permission.js';

// Thiết lập sự kiện cho nút lưu vai trò
document.addEventListener('DOMContentLoaded', () => {
    const saveRoleBtn = document.getElementById('saveRoleBtn');
    saveRoleBtn.addEventListener('click', saveNewRole);
});

// Hàm xử lý thêm vai trò mới
function saveNewRole() {
    const roleName = document.getElementById('roleName').value;
    const roleDescription = document.getElementById('roleDescription').value;
    const roleStatus = document.getElementById('roleStatus').checked ? 'active' : 'inactive';
    
    // Validate các trường bắt buộc
    if (!roleName.trim()) {
        Swal.fire({
            title: 'Lỗi!',
            text: 'Vui lòng nhập tên vai trò',
            icon: 'error',
            confirmButtonText: 'Đóng'
        });
        return;
    }
    
    // Thu thập thông tin các quyền được chọn
    const permissions = [];
    const permissionCheckboxes = document.querySelectorAll('.permission-checkbox');
    permissionCheckboxes.forEach(checkbox => {
        const permissionId = parseInt(checkbox.dataset.id);
        const moduleId = parseInt(checkbox.dataset.module);
        const moduleName = getPermissionModules().find(m => m.id === moduleId)?.name || 'Chưa phân loại';
        const permissionName = getPermissionModules()
            .find(m => m.id === moduleId)?.permissions
            .find(p => p.id === permissionId)?.name || 'Quyền mới';
        
        permissions.push({
            id: permissionId,
            name: permissionName,
            module: moduleName,
            granted: checkbox.checked
        });
    });
    
    // Giả lập thêm vai trò mới
    Swal.fire({
        title: 'Đang xử lý...',
        text: 'Vui lòng chờ',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    
    setTimeout(() => {
        // Tạo ID mới
        const newId = Math.max(...mockRoles.map(r => r.id)) + 1;
        
        // Thêm vai trò mới vào mockRoles
        const newRole = {
            id: newId,
            name: roleName,
            description: roleDescription,
            userCount: 0,
            status: roleStatus,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            permissions: permissions
        };
        
        mockRoles.push(newRole);
        
        // Đóng modal và hiển thị thông báo thành công
        const modal = bootstrap.Modal.getInstance(document.getElementById('addRoleModal'));
        modal.hide();
        
        // Reset form
        document.getElementById('addRoleForm').reset();
        
        Swal.fire({
            title: 'Thành công!',
            text: 'Đã thêm vai trò mới',
            icon: 'success',
            confirmButtonText: 'Đóng'
        }).then(() => {
            // Tải lại danh sách vai trò
            filteredRoles = [...mockRoles];
            loadRoles();
        });
    }, 1000);
}