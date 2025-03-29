// ==========================================================
// permission.js - Container xử lý logic cho trang phân quyền
// ==========================================================

import {  editRoleModal, viewRoleModal, deleteRoleModal } from '../components/permission-modal/modal.js';

// Dữ liệu mẫu cho roles
const mockRoles = [
    {
        id: 1,
        name: 'Quản trị viên',
        description: 'Có toàn quyền truy cập và quản lý hệ thống',
        userCount: 3,
        status: 'active',
        createdAt: '2023-05-10 08:30:00',
        updatedAt: '2023-09-15 14:22:10',
        permissions: [
            { id: 1, name: 'Xem trang tổng quan', module: 'Dashboard', granted: true },
            { id: 2, name: 'Quản lý người dùng', module: 'Người dùng', granted: true },
            { id: 3, name: 'Xem danh sách người dùng', module: 'Người dùng', granted: true },
            { id: 4, name: 'Thêm người dùng', module: 'Người dùng', granted: true },
            { id: 5, name: 'Sửa người dùng', module: 'Người dùng', granted: true },
            { id: 6, name: 'Xóa người dùng', module: 'Người dùng', granted: true },
            { id: 7, name: 'Quản lý phân quyền', module: 'Phân quyền', granted: true },
            { id: 8, name: 'Quản lý sản phẩm', module: 'Sản phẩm', granted: true },
            { id: 9, name: 'Quản lý đơn hàng', module: 'Đơn hàng', granted: true },
            { id: 10, name: 'Xem báo cáo', module: 'Báo cáo', granted: true },
        ]
    },
    {
        id: 2,
        name: 'Nhân viên bán hàng',
        description: 'Quản lý đơn hàng và khách hàng',
        userCount: 12,
        status: 'active',
        createdAt: '2023-05-12 10:15:30',
        updatedAt: '2023-10-05 09:45:20',
        permissions: [
            { id: 1, name: 'Xem trang tổng quan', module: 'Dashboard', granted: true },
            { id: 2, name: 'Quản lý người dùng', module: 'Người dùng', granted: false },
            { id: 3, name: 'Xem danh sách người dùng', module: 'Người dùng', granted: false },
            { id: 8, name: 'Quản lý sản phẩm', module: 'Sản phẩm', granted: true },
            { id: 9, name: 'Quản lý đơn hàng', module: 'Đơn hàng', granted: true },
            { id: 10, name: 'Xem báo cáo', module: 'Báo cáo', granted: false },
        ]
    },
    {
        id: 3,
        name: 'Nhân viên kho',
        description: 'Quản lý kho hàng và sản phẩm',
        userCount: 5,
        status: 'active',
        createdAt: '2023-06-20 14:30:00',
        updatedAt: '2023-11-10 11:20:45',
        permissions: [
            { id: 1, name: 'Xem trang tổng quan', module: 'Dashboard', granted: true },
            { id: 8, name: 'Quản lý sản phẩm', module: 'Sản phẩm', granted: true },
            { id: 9, name: 'Quản lý đơn hàng', module: 'Đơn hàng', granted: false },
        ]
    },
    {
        id: 4,
        name: 'Khách hàng VIP',
        description: 'Những khách hàng đặc biệt với quyền lợi riêng',
        userCount: 28,
        status: 'active',
        createdAt: '2023-07-05 09:20:15',
        updatedAt: '2023-12-01 16:40:30',
        permissions: [
            { id: 1, name: 'Xem trang tổng quan', module: 'Dashboard', granted: false },
            { id: 11, name: 'Xem ưu đãi VIP', module: 'Ưu đãi', granted: true },
            { id: 12, name: 'Đặt hàng ưu tiên', module: 'Đơn hàng', granted: true },
        ]
    },
    {
        id: 5,
        name: 'Nhân viên hỗ trợ',
        description: 'Hỗ trợ khách hàng và giải quyết vấn đề',
        userCount: 8,
        status: 'inactive',
        createdAt: '2023-08-15 11:45:30',
        updatedAt: '2023-12-20 13:30:55',
        permissions: [
            { id: 1, name: 'Xem trang tổng quan', module: 'Dashboard', granted: true },
            { id: 13, name: 'Xử lý khiếu nại', module: 'Khiếu nại', granted: true },
            { id: 14, name: 'Trả lời tin nhắn', module: 'Hỗ trợ', granted: true },
        ]
    }
];

// Dữ liệu mẫu cho các module quyền
const permissionModules = [
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

// Dữ liệu thống kê
const mockStats = {
    totalRoles: 5,
    activeRoles: 4,
    newRolesThisMonth: 2,
    inactiveRoles: 1
};

// Các biến toàn cục
let currentPage = 1;
let itemsPerPage = 5;
let totalPages = 0;
let filteredRoles = [...mockRoles];

// Load thống kê
export function loadStatistics() {
    document.getElementById('totalUsers').textContent = mockStats.totalRoles;
    document.getElementById('totalActiveUsers').textContent = mockStats.activeRoles;
    document.getElementById('totalNewUsers').textContent = mockStats.newRolesThisMonth;
    document.getElementById('totalLockedUsers').textContent = mockStats.inactiveRoles;
}

// Tải danh sách vai trò
export function loadRoles() {
    // Hiển thị loading
    document.getElementById('loadingRoles').classList.remove('d-none');
    document.getElementById('noRolesMessage').classList.add('d-none');
    document.getElementById('rolesTableBody').innerHTML = '';
    
    // Giả lập API call
    setTimeout(() => {
        // Tính toán phân trang
        totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedRoles = filteredRoles.slice(startIndex, startIndex + itemsPerPage);
        
        // Ẩn loading
        document.getElementById('loadingRoles').classList.add('d-none');
        
        // Kiểm tra nếu không có dữ liệu
        if (paginatedRoles.length === 0) {
            document.getElementById('noRolesMessage').classList.remove('d-none');
            return;
        }
        
        // Render vai trò
        renderRolesTable(paginatedRoles);
        
        // Render phân trang
        renderPagination();
        
        // Khởi tạo các sự kiện cho buttons
        initializeRoleActions();
    }, 500);
}

// Render bảng vai trò
function renderRolesTable(roles) {
    const tableBody = document.getElementById('rolesTableBody');
    tableBody.innerHTML = '';
    
    roles.forEach((role, index) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const rowNumber = startIndex + index + 1;
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${rowNumber}</td>
            <td>
                <div class="fw-semibold">${role.name}</div>
            </td>
            <td>
                <small class="text-muted">${role.description || 'Không có mô tả'}</small>
            </td>
            <td>
                <span class="badge bg-info rounded-pill">${role.userCount}</span>
            </td>
            <td>
                ${role.status === 'active' 
                    ? '<span class="badge bg-success">Đang hoạt động</span>' 
                    : '<span class="badge bg-danger">Không hoạt động</span>'}
            </td>
            <td>
                <small class="text-muted">${formatDate(role.createdAt)}</small>
            </td>
            <td class="text-end">
                <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-outline-primary view-role" data-id="${role.id}" 
                        data-bs-toggle="tooltip" title="Xem chi tiết">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-success edit-role" data-id="${role.id}"
                        data-bs-toggle="tooltip" title="Chỉnh sửa">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-danger delete-role" data-id="${role.id}"
                        data-bs-toggle="tooltip" title="Xóa">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(tr);
    });
    
    // Khởi tạo lại tooltip
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Render phân trang
function renderPagination() {
    const pagination = document.getElementById('userPagination');
    pagination.innerHTML = '';
    
    // Nếu chỉ có 1 trang thì không hiển thị phân trang
    if (totalPages <= 1) return;
    
    // Previous button
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `
        <a class="page-link" href="#" aria-label="Previous" ${currentPage > 1 ? 'data-page="' + (currentPage - 1) + '"' : ''}>
            <span aria-hidden="true">&laquo;</span>
        </a>
    `;
    pagination.appendChild(prevLi);
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageLi = document.createElement('li');
        pageLi.className = `page-item ${i === currentPage ? 'active' : ''}`;
        pageLi.innerHTML = `
            <a class="page-link" href="#" data-page="${i}">${i}</a>
        `;
        pagination.appendChild(pageLi);
    }
    
    // Next button
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `
        <a class="page-link" href="#" aria-label="Next" ${currentPage < totalPages ? 'data-page="' + (currentPage + 1) + '"' : ''}>
            <span aria-hidden="true">&raquo;</span>
        </a>
    `;
    pagination.appendChild(nextLi);
    
    // Add event listeners
    const pageLinks = pagination.querySelectorAll('.page-link');
    pageLinks.forEach(link => {
        if (link.dataset.page) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                currentPage = parseInt(link.dataset.page);
                loadRoles();
            });
        }
    });
}

// Hàm thiết lập sự kiện cho filter
export function setupFilterEvents() {
    const searchInput = document.getElementById('searchRole');
    
    // Sự kiện search
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            filteredRoles = [...mockRoles];
        } else {
            filteredRoles = mockRoles.filter(role => {
                return role.name.toLowerCase().includes(searchTerm) || 
                       (role.description && role.description.toLowerCase().includes(searchTerm));
            });
        }
        
        currentPage = 1;
        loadRoles();
    });
    
    // Sự kiện thay đổi số lượng hiển thị mỗi trang
    const itemsPerPageSelect = document.getElementById('itemsPerPage');
    itemsPerPageSelect.addEventListener('change', () => {
        itemsPerPage = parseInt(itemsPerPageSelect.value);
        currentPage = 1;
        loadRoles();
    });
    
    // Sự kiện thêm vai trò mới
    const addRoleBtn = document.getElementById('addRoleBtn');
    addRoleBtn.addEventListener('click', () => {
        initPermissionModules();
        const addRoleModal = new bootstrap.Modal(document.getElementById('addRoleModal'));
        addRoleModal.show();
    });
}

// Thiết lập giá trị mặc định cho items per page
export function setDefaultItemsPerPage() {
    const itemsPerPageSelect = document.getElementById('itemsPerPage');
    itemsPerPageSelect.value = itemsPerPage.toString();
}

// Khởi tạo module quyền trong modal thêm vai trò và sửa vai trò
function initPermissionModules() {
    // Thêm vai trò mới
    const permissionGroupsContainer = document.querySelector('.permission-groups');
    permissionGroupsContainer.innerHTML = '';
    
    permissionModules.forEach(module => {
        const moduleSection = document.createElement('div');
        moduleSection.className = 'card mb-3';
        
        let permissionsHtml = '';
        module.permissions.forEach(permission => {
            permissionsHtml += `
                <div class="form-check">
                    <input class="form-check-input permission-checkbox" type="checkbox" 
                           id="perm_${permission.id}" data-id="${permission.id}" data-module="${module.id}">
                    <label class="form-check-label" for="perm_${permission.id}">
                        ${permission.name}
                    </label>
                </div>
            `;
        });
        
        moduleSection.innerHTML = `
            <div class="card-header bg-light d-flex justify-content-between align-items-center">
                <h6 class="mb-0">${module.name}</h6>
                <div class="form-check">
                    <input class="form-check-input module-checkbox" type="checkbox" 
                           id="module_${module.id}" data-module="${module.id}">
                    <label class="form-check-label" for="module_${module.id}">
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
    const moduleCheckboxes = document.querySelectorAll('.module-checkbox');
    moduleCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const moduleId = this.dataset.module;
            const permissionCheckboxes = document.querySelectorAll(`.permission-checkbox[data-module="${moduleId}"]`);
            
            permissionCheckboxes.forEach(permCheckbox => {
                permCheckbox.checked = this.checked;
            });
        });
    });
    
    // Thiết lập sự kiện cho các permission checkbox
    const permissionCheckboxes = document.querySelectorAll('.permission-checkbox');
    permissionCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const moduleId = this.dataset.module;
            const moduleCheckbox = document.querySelector(`.module-checkbox[data-module="${moduleId}"]`);
            const permissionCheckboxes = document.querySelectorAll(`.permission-checkbox[data-module="${moduleId}"]`);
            const allChecked = [...permissionCheckboxes].every(cb => cb.checked);
            
            moduleCheckbox.checked = allChecked;
        });
    });
}

// Khởi tạo sự kiện cho các nút trong bảng
function initializeRoleActions() {
    // Nút xem chi tiết
    const viewButtons = document.querySelectorAll('.view-role');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const roleId = parseInt(this.dataset.id);
            const role = mockRoles.find(r => r.id === roleId);
            
            if (role) {
                viewRoleModal(role);
            }
        });
    });
    
    // Nút chỉnh sửa
    const editButtons = document.querySelectorAll('.edit-role');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const roleId = parseInt(this.dataset.id);
            const role = mockRoles.find(r => r.id === roleId);
            
            if (role) {
                editRoleModal(role);
            }
        });
    });
    
    // Nút xóa
    const deleteButtons = document.querySelectorAll('.delete-role');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const roleId = parseInt(this.dataset.id);
            const role = mockRoles.find(r => r.id === roleId);
            
            if (role) {
                deleteRoleModal(role);
            }
        });
    });
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