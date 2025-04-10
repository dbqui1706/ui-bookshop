// js/app/permissions/permissions.js

// Data mẫu cho quyền hạn
export const mockPermissions = [
    { id: 1, name: "Xem danh sách người dùng", code: "user.view_list", module: "user", description: "Xem danh sách tất cả người dùng", is_system: true, created_at: "2023-05-10 08:30:00" },
    { id: 2, name: "Xem chi tiết người dùng", code: "user.view_detail", module: "user", description: "Xem thông tin chi tiết của người dùng", is_system: true, created_at: "2023-05-10 08:30:00" },
    { id: 3, name: "Tạo người dùng mới", code: "user.create", module: "user", description: "Tạo tài khoản người dùng mới", is_system: true, created_at: "2023-05-10 08:30:00" },
    { id: 4, name: "Chỉnh sửa người dùng", code: "user.edit", module: "user", description: "Chỉnh sửa thông tin người dùng", is_system: true, created_at: "2023-05-10 08:30:00" },
    { id: 5, name: "Xóa người dùng", code: "user.delete", module: "user", description: "Xóa tài khoản người dùng", is_system: true, created_at: "2023-05-10 08:30:00" },
    { id: 6, name: "Xem danh sách sản phẩm", code: "product.view_list", module: "product", description: "Xem danh sách tất cả sản phẩm", is_system: true, created_at: "2023-05-10 08:30:00" },
    { id: 7, name: "Xem chi tiết sản phẩm", code: "product.view_detail", module: "product", description: "Xem thông tin chi tiết của sản phẩm", is_system: true, created_at: "2023-05-10 08:30:00" },
    { id: 8, name: "Tạo sản phẩm mới", code: "product.create", module: "product", description: "Thêm sản phẩm mới vào hệ thống", is_system: true, created_at: "2023-05-10 08:30:00" },
    { id: 9, name: "Xem danh sách đơn hàng", code: "order.view_list", module: "order", description: "Xem danh sách tất cả đơn hàng", is_system: true, created_at: "2023-05-10 08:30:00" },
    { id: 10, name: "Xem chi tiết đơn hàng", code: "order.view_detail", module: "order", description: "Xem thông tin chi tiết của đơn hàng", is_system: true, created_at: "2023-05-10 08:30:00" },
    { id: 11, name: "Xem danh sách vận chuyển", code: "shipping.view_list", module: "shipping", description: "Xem danh sách tất cả đơn vận chuyển", is_system: true, created_at: "2023-05-10 08:30:00" },
    { id: 12, name: "Xem báo cáo doanh thu", code: "report.revenue", module: "report", description: "Xem báo cáo về doanh thu", is_system: true, created_at: "2023-05-10 08:30:00" },
    { id: 13, name: "Quản lý cấu hình hệ thống", code: "system.manage_settings", module: "system", description: "Quản lý các cài đặt và cấu hình hệ thống", is_system: true, created_at: "2023-05-10 08:30:00" },
    { id: 14, name: "Xem nhật ký hệ thống", code: "system.view_logs", module: "system", description: "Xem nhật ký hoạt động của hệ thống", is_system: false, created_at: "2023-06-15 10:45:00" }
];

let dataTable;
let currentPermissionId = null;

// Hàm khởi tạo DataTable và xử lý sự kiện
export function loadPermissions() {
    // Nếu DataTable đã được khởi tạo, hủy nó để tạo lại
    if (dataTable) {
        dataTable.destroy();
    }

    // Khởi tạo DataTable
    dataTable = new DataTable('#permissionsTable', {
        data: mockPermissions,
        columns: [
            { data: 'id' },
            { data: 'name' },
            { data: 'code' },
            { 
                data: 'module',
                render: function(data) {
                    const moduleName = getModuleName(data);
                    return `<span class="badge bg-${getModuleColor(data)}">${moduleName}</span>`;
                }
            },
            { data: 'description' },
            { 
                data: 'is_system',
                render: function(data) {
                    return data ? '<span class="badge bg-primary">Hệ thống</span>' : '<span class="badge bg-secondary">Tùy chỉnh</span>';
                }
            },
            {
                data: null,
                render: function(data) {
                    const editBtn = `<button class="btn btn-sm btn-outline-primary edit-permission me-1" data-id="${data.id}"><i class="bi bi-pencil"></i></button>`;
                    const deleteBtn = data.is_system ? 
                        `<button class="btn btn-sm btn-outline-danger" disabled title="Quyền hệ thống không thể xóa"><i class="bi bi-trash"></i></button>` :
                        `<button class="btn btn-sm btn-outline-danger delete-permission" data-id="${data.id}"><i class="bi bi-trash"></i></button>`;
                    return editBtn + deleteBtn;
                }
            }
        ],
        responsive: true,
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/vi.json',
        }
    });

    // Tạo tab cho từng module
    createModuleTabs();

    // Xử lý sự kiện thêm quyền mới
    document.getElementById('btnAddPermission').addEventListener('click', function() {
        currentPermissionId = null;
        document.getElementById('permissionModalLabel').textContent = 'Thêm quyền mới';
        document.getElementById('permissionForm').reset();
        const permissionModal = new bootstrap.Modal(document.getElementById('permissionModal'));
        permissionModal.show();
    });

    // Xử lý sự kiện lưu quyền
    document.getElementById('btnSavePermission').addEventListener('click', function() {
        savePermission();
    });

    // Xử lý sự kiện sửa quyền
    document.querySelector('#permissionsTable tbody').addEventListener('click', function(e) {
        if (e.target.closest('.edit-permission')) {
            const permissionId = e.target.closest('.edit-permission').getAttribute('data-id');
            editPermission(permissionId);
        }
    });

    // Xử lý sự kiện xóa quyền
    document.querySelector('#permissionsTable tbody').addEventListener('click', function(e) {
        if (e.target.closest('.delete-permission')) {
            const permissionId = e.target.closest('.delete-permission').getAttribute('data-id');
            confirmDeletePermission(permissionId);
        }
    });

    // Xử lý sự kiện xác nhận xóa quyền
    document.getElementById('btnConfirmDeletePermission').addEventListener('click', function() {
        deletePermission();
    });

    // Tự động cập nhật mã quyền khi chọn module và nhập tên
    const permissionModule = document.getElementById('permissionModule');
    const permissionName = document.getElementById('permissionName');
    const permissionCode = document.getElementById('permissionCode');

    if (permissionModule && permissionName && permissionCode) {
        permissionModule.addEventListener('change', updatePermissionCode);
        permissionName.addEventListener('input', updatePermissionCode);
    }
}

// Tạo tab cho từng module
function createModuleTabs() {
    // Lấy tất cả các module duy nhất
    const modules = [...new Set(mockPermissions.map(p => p.module))];
    
    // Tạo nội dung cho từng tab module
    modules.forEach(module => {
        // Bỏ qua tab "all-module" vì đã tạo trong HTML
        if (!document.getElementById(`${module}-module`)) {
            // Tạo tab content
            const tabPane = document.createElement('div');
            tabPane.className = 'tab-pane fade';
            tabPane.id = `${module}-module`;
            tabPane.setAttribute('role', 'tabpanel');
            tabPane.setAttribute('aria-labelledby', `${module}-module-tab`);

            // Tạo bảng cho module
            const tableHtml = `
                <div class="table-responsive">
                    <table id="${module}PermissionsTable" class="table table-striped table-hover" style="width: 100%">
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
            tabPane.innerHTML = tableHtml;
            document.getElementById('permissionModuleTabContent').appendChild(tabPane);

            // Khởi tạo DataTable cho module
            const modulePermissions = mockPermissions.filter(p => p.module === module);
            new DataTable(`#${module}PermissionsTable`, {
                data: modulePermissions,
                columns: [
                    { data: 'id' },
                    { data: 'name' },
                    { data: 'code' },
                    { data: 'description' },
                    { 
                        data: 'is_system',
                        render: function(data) {
                            return data ? '<span class="badge bg-primary">Hệ thống</span>' : '<span class="badge bg-secondary">Tùy chỉnh</span>';
                        }
                    },
                    {
                        data: null,
                        render: function(data) {
                            const editBtn = `<button class="btn btn-sm btn-outline-primary edit-permission me-1" data-id="${data.id}"><i class="bi bi-pencil"></i></button>`;
                            const deleteBtn = data.is_system ? 
                                `<button class="btn btn-sm btn-outline-danger" disabled title="Quyền hệ thống không thể xóa"><i class="bi bi-trash"></i></button>` :
                                `<button class="btn btn-sm btn-outline-danger delete-permission" data-id="${data.id}"><i class="bi bi-trash"></i></button>`;
                            return editBtn + deleteBtn;
                        }
                    }
                ],
                responsive: true,
                language: {
                    url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/vi.json',
                }
            });
        }
    });
}

// Hàm tự động cập nhật mã quyền
function updatePermissionCode() {
    const module = document.getElementById('permissionModule').value;
    let name = document.getElementById('permissionName').value;
    
    if (module && name) {
        // Chuyển tên thành snake_case cho mã
        name = name.toLowerCase()
            .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a")
            .replace(/[èéẹẻẽêềếệểễ]/g, "e")
            .replace(/[ìíịỉĩ]/g, "i")
            .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o")
            .replace(/[ùúụủũưừứựửữ]/g, "u")
            .replace(/[ỳýỵỷỹ]/g, "y")
            .replace(/đ/g, "d")
            .replace(/\s+/g, '_')
            .replace(/[^a-z0-9_]/g, '');
        
        document.getElementById('permissionCode').value = `${module}.${name}`;
    }
}

// Hàm xử lý sửa quyền
function editPermission(permissionId) {
    const permission = mockPermissions.find(p => p.id == permissionId);
    if (permission) {
        currentPermissionId = permission.id;
        document.getElementById('permissionModalLabel').textContent = 'Chỉnh sửa quyền';
        document.getElementById('permissionId').value = permission.id;
        document.getElementById('permissionName').value = permission.name;
        document.getElementById('permissionCode').value = permission.code;
        document.getElementById('permissionModule').value = permission.module;
        document.getElementById('permissionDescription').value = permission.description;
        document.getElementById('isSystemPermission').checked = permission.is_system;
        document.getElementById('isSystemPermission').disabled = permission.is_system; // Không cho phép thay đổi trạng thái hệ thống nếu là quyền hệ thống

        const permissionModal = new bootstrap.Modal(document.getElementById('permissionModal'));
        permissionModal.show();
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Không tìm thấy quyền!'
        });
    }
}

// Hàm xử lý lưu quyền (thêm mới hoặc cập nhật)
function savePermission() {
    const permissionName = document.getElementById('permissionName').value;
    const permissionCode = document.getElementById('permissionCode').value;
    const permissionModule = document.getElementById('permissionModule').value;
    const permissionDescription = document.getElementById('permissionDescription').value;
    const isSystemPermission = document.getElementById('isSystemPermission').checked;

    // Kiểm tra dữ liệu đầu vào
    if (!permissionName || !permissionCode || !permissionModule) {
        Swal.fire({
            icon: 'warning',
            title: 'Thiếu thông tin',
            text: 'Vui lòng điền đầy đủ thông tin bắt buộc!'
        });
        return;
    }

    // Kiểm tra trùng mã quyền
    if (!currentPermissionId && mockPermissions.some(p => p.code === permissionCode)) {
        Swal.fire({
            icon: 'warning',
            title: 'Trùng mã quyền',
            text: 'Mã quyền đã tồn tại!'
        });
        return;
    }

    if (currentPermissionId) {
        // Cập nhật quyền hiện có
        const index = mockPermissions.findIndex(p => p.id == currentPermissionId);
        if (index !== -1) {
            mockPermissions[index].name = permissionName;
            mockPermissions[index].code = permissionCode;
            mockPermissions[index].module = permissionModule;
            mockPermissions[index].description = permissionDescription;
            if (!mockPermissions[index].is_system) { // Chỉ cho phép thay đổi trạng thái hệ thống nếu không phải quyền hệ thống
                mockPermissions[index].is_system = isSystemPermission;
            }
        }
    } else {
        // Thêm quyền mới
        const newId = mockPermissions.length > 0 ? Math.max(...mockPermissions.map(p => p.id)) + 1 : 1;
        const currentDate = new Date().toISOString().replace('T', ' ').substring(0, 19);
        
        mockPermissions.push({
            id: newId,
            name: permissionName,
            code: permissionCode,
            module: permissionModule,
            description: permissionDescription,
            is_system: isSystemPermission,
            created_at: currentDate
        });
    }

    // Cập nhật DataTable và đóng modal
    dataTable.clear().rows.add(mockPermissions).draw();
    // Cập nhật lại tab của module tương ứng
    const moduleTable = $(`#${permissionModule}PermissionsTable`).DataTable();
    if (moduleTable) {
        moduleTable.clear().rows.add(mockPermissions.filter(p => p.module === permissionModule)).draw();
    }
    
    bootstrap.Modal.getInstance(document.getElementById('permissionModal')).hide();

    // Hiển thị thông báo thành công
    Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: currentPermissionId ? 'Cập nhật quyền thành công!' : 'Thêm quyền mới thành công!',
        timer: 1500,
        showConfirmButton: false
    });
}

// Hàm xác nhận xóa quyền
function confirmDeletePermission(permissionId) {
    const permission = mockPermissions.find(p => p.id == permissionId);
    if (permission) {
        currentPermissionId = permission.id;
        document.getElementById('deletePermissionName').textContent = permission.name;
        const deleteModal = new bootstrap.Modal(document.getElementById('deletePermissionModal'));
        deleteModal.show();
    }
}

// Hàm xóa quyền
function deletePermission() {
    const index = mockPermissions.findIndex(p => p.id == currentPermissionId);
    if (index !== -1) {
        if (mockPermissions[index].is_system) {
            Swal.fire({
                icon: 'error',
                title: 'Không thể xóa',
                text: 'Quyền hệ thống không thể bị xóa!'
            });
            return;
        }

        const module = mockPermissions[index].module;
        mockPermissions.splice(index, 1);
        
        // Cập nhật DataTable chính
        dataTable.clear().rows.add(mockPermissions).draw();
        
        // Cập nhật DataTable của module tương ứng
        const moduleTable = $(`#${module}PermissionsTable`).DataTable();
        if (moduleTable) {
            moduleTable.clear().rows.add(mockPermissions.filter(p => p.module === module)).draw();
        }
        
        bootstrap.Modal.getInstance(document.getElementById('deletePermissionModal')).hide();

        Swal.fire({
            icon: 'success',
            title: 'Thành công',
            text: 'Xóa quyền thành công!',
            timer: 1500,
            showConfirmButton: false
        });
    }
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