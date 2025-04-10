// js/app/permissions/roles.js

// Data mẫu cho vai trò
export const mockRoles = [
    { id: 1, name: "ADMIN", description: "Quản trị viên hệ thống có toàn quyền truy cập", is_system: true, created_at: "2023-05-10 08:30:00" },
    { id: 2, name: "CUSTOMER", description: "Khách hàng đã đăng ký tài khoản", is_system: true, created_at: "2023-05-10 08:30:00" },
    { id: 3, name: "EMPLOYEE", description: "Nhân viên cửa hàng sách", is_system: true, created_at: "2023-05-10 08:30:00" },
    { id: 4, name: "SHIPPING", description: "Nhân viên vận chuyển/giao hàng", is_system: true, created_at: "2023-05-10 08:30:00" },
    { id: 5, name: "MANAGER", description: "Quản lý cửa hàng, có quyền quản lý nhân viên và báo cáo", is_system: false, created_at: "2023-05-15 10:25:00" },
    { id: 6, name: "CONTENT_EDITOR", description: "Biên tập viên nội dung, quản lý bài viết và tin tức", is_system: false, created_at: "2023-06-20 14:15:00" }
];

let dataTable;
let currentRoleId = null;

// Hàm khởi tạo DataTable và xử lý sự kiện
export function loadRoles() {
    // Nếu DataTable đã được khởi tạo, hủy nó để tạo lại
    if (dataTable) {
        dataTable.destroy();
    }

    // Khởi tạo DataTable
    dataTable = new DataTable('#rolesTable', {
        data: mockRoles,
        columns: [
            { data: 'id' },
            { data: 'name' },
            { data: 'description' },
            { 
                data: 'is_system',
                render: function(data) {
                    return data ? '<span class="badge bg-primary">Hệ thống</span>' : '<span class="badge bg-secondary">Tùy chỉnh</span>';
                }
            },
            { 
                data: 'created_at',
                render: function(data) {
                    return formatDate(data);
                }
            },
            {
                data: null,
                render: function(data) {
                    const editBtn = `<button class="btn btn-sm btn-outline-primary edit-role me-1" data-id="${data.id}"><i class="bi bi-pencil"></i></button>`;
                    const deleteBtn = data.is_system ? 
                        `<button class="btn btn-sm btn-outline-danger" disabled title="Vai trò hệ thống không thể xóa"><i class="bi bi-trash"></i></button>` :
                        `<button class="btn btn-sm btn-outline-danger delete-role" data-id="${data.id}"><i class="bi bi-trash"></i></button>`;
                    return editBtn + deleteBtn;
                }
            }
        ],
        responsive: true,
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/vi.json',
        }
    });

    // Xử lý sự kiện thêm vai trò mới
    document.getElementById('btnAddRole').addEventListener('click', function() {
        currentRoleId = null;
        document.getElementById('roleModalLabel').textContent = 'Thêm vai trò mới';
        document.getElementById('roleForm').reset();
        const roleModal = new bootstrap.Modal(document.getElementById('roleModal'));
        roleModal.show();
    });

    // Xử lý sự kiện lưu vai trò
    document.getElementById('btnSaveRole').addEventListener('click', function() {
        saveRole();
    });

    // Xử lý sự kiện sửa vai trò
    document.querySelector('#rolesTable tbody').addEventListener('click', function(e) {
        if (e.target.closest('.edit-role')) {
            const roleId = e.target.closest('.edit-role').getAttribute('data-id');
            editRole(roleId);
        }
    });

    // Xử lý sự kiện xóa vai trò
    document.querySelector('#rolesTable tbody').addEventListener('click', function(e) {
        if (e.target.closest('.delete-role')) {
            const roleId = e.target.closest('.delete-role').getAttribute('data-id');
            confirmDeleteRole(roleId);
        }
    });

    // Xử lý sự kiện xác nhận xóa vai trò
    document.getElementById('btnConfirmDeleteRole').addEventListener('click', function() {
        deleteRole();
    });
}

// Hàm xử lý sửa vai trò
function editRole(roleId) {
    const role = mockRoles.find(r => r.id == roleId);
    if (role) {
        currentRoleId = role.id;
        document.getElementById('roleModalLabel').textContent = 'Chỉnh sửa vai trò';
        document.getElementById('roleId').value = role.id;
        document.getElementById('roleName').value = role.name;
        document.getElementById('roleDescription').value = role.description;
        document.getElementById('isSystemRole').checked = role.is_system;
        document.getElementById('isSystemRole').disabled = role.is_system; // Không cho phép thay đổi trạng thái hệ thống nếu là vai trò hệ thống

        const roleModal = new bootstrap.Modal(document.getElementById('roleModal'));
        roleModal.show();
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Không tìm thấy vai trò!'
        });
    }
}

// Hàm xử lý lưu vai trò (thêm mới hoặc cập nhật)
function saveRole() {
    const roleName = document.getElementById('roleName').value;
    const roleDescription = document.getElementById('roleDescription').value;
    const isSystemRole = document.getElementById('isSystemRole').checked;

    if (!roleName) {
        Swal.fire({
            icon: 'warning',
            title: 'Thiếu thông tin',
            text: 'Vui lòng nhập tên vai trò!'
        });
        return;
    }

    // Kiểm tra trùng tên vai trò
    if (!currentRoleId && mockRoles.some(r => r.name === roleName)) {
        Swal.fire({
            icon: 'warning',
            title: 'Trùng tên',
            text: 'Tên vai trò đã tồn tại!'
        });
        return;
    }

    if (currentRoleId) {
        // Cập nhật vai trò hiện có
        const index = mockRoles.findIndex(r => r.id == currentRoleId);
        if (index !== -1) {
            mockRoles[index].name = roleName;
            mockRoles[index].description = roleDescription;
            if (!mockRoles[index].is_system) { // Chỉ cho phép thay đổi trạng thái hệ thống nếu không phải vai trò hệ thống
                mockRoles[index].is_system = isSystemRole;
            }
        }
    } else {
        // Thêm vai trò mới
        const newId = mockRoles.length > 0 ? Math.max(...mockRoles.map(r => r.id)) + 1 : 1;
        const currentDate = new Date().toISOString().replace('T', ' ').substring(0, 19);
        
        mockRoles.push({
            id: newId,
            name: roleName,
            description: roleDescription,
            is_system: isSystemRole,
            created_at: currentDate
        });
    }

    // Cập nhật DataTable và đóng modal
    dataTable.clear().rows.add(mockRoles).draw();
    bootstrap.Modal.getInstance(document.getElementById('roleModal')).hide();

    // Hiển thị thông báo thành công
    Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: currentRoleId ? 'Cập nhật vai trò thành công!' : 'Thêm vai trò mới thành công!',
        timer: 1500,
        showConfirmButton: false
    });
}

// Hàm xác nhận xóa vai trò
function confirmDeleteRole(roleId) {
    const role = mockRoles.find(r => r.id == roleId);
    if (role) {
        currentRoleId = role.id;
        document.getElementById('deleteRoleName').textContent = role.name;
        const deleteModal = new bootstrap.Modal(document.getElementById('deleteRoleModal'));
        deleteModal.show();
    }
}

// Hàm xóa vai trò
function deleteRole() {
    const index = mockRoles.findIndex(r => r.id == currentRoleId);
    if (index !== -1) {
        if (mockRoles[index].is_system) {
            Swal.fire({
                icon: 'error',
                title: 'Không thể xóa',
                text: 'Vai trò hệ thống không thể bị xóa!'
            });
            return;
        }

        mockRoles.splice(index, 1);
        dataTable.clear().rows.add(mockRoles).draw();
        bootstrap.Modal.getInstance(document.getElementById('deleteRoleModal')).hide();

        Swal.fire({
            icon: 'success',
            title: 'Thành công',
            text: 'Xóa vai trò thành công!',
            timer: 1500,
            showConfirmButton: false
        });
    }
}

// Hàm định dạng ngày tháng
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}