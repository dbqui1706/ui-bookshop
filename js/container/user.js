// ==========================================================
// user.js - Module quản lý người dùng
// ==========================================================

import {
    getUsers,
    getUserStats,
} from '../service/user.js';
import {
    showLoading,
    hideLoading,
    showAlert,
    formatDateTime,
    initializeTooltip
} from '../utils/index.js';

import {
    addUserModal,
    userDetailModal,
    editUserModal,
    toggleUserStatusModal
} from '../components/user-modal/modal.js';

// Filter state
export const filterState = {
    search: "",
    role: "",
    status: "",
    sort: "",
    page: 1,
    totalPages: 1,
    limit: 5,
    data: []
};

const badgeRole = {
    ADMIN: '<span class="badge bg-primary">Quản trị viên</span>',
    CUSTOMER: '<span class="badge bg-secondary">Khách hàng</span>',
    EMPLOYEE: '<span class="badge bg-success">Nhân viên</span>',
    SHIPPING: '<span class="badge bg-info">Người giao hàng</span>'
}

const badgeStatus = {
    ACTIVE: '<span class="badge bg-success">Hoạt động</span>',
    INACTIVE: '<span class="badge bg-warning text-dark">Không hoạt động</span>',
    LOCKED: '<span class="badge bg-danger">Bị khóa</span>'
}

// Render bảng người dùng
export const renderUserTable = (users) => {
    const tableBody = document.getElementById('userTableBody');
    tableBody.innerHTML = '';
    console.log(users);
    const isActive = users.active;
    const isLocked = users.isLocked;

    users.forEach(user => {
        const row = document.createElement('tr');

        // Format ngày tháng
        const createdDate = formatDateTime(user.createdAt, { dateStyle: 'short' });
        const lastLogin = user.lastLogin ? formatDateTime(user.lastLogin, { dateStyle: 'short' }) : 'Chưa đăng nhập';

        row.innerHTML = `
            <td>#${user.id}</td>
            <td>
                <div class="d-flex align-items-center">
                    <img src="https://via.placeholder.com/40" alt="${user.fullname}" width="40" height="40" class="rounded-circle me-2"/>
                </div>
            </td>
            <td>
                <div>
                    <div class="fw-bold">${user.fullname}</div>
                    <div class="small text-muted">${user.email}</div>
                </div>
            </td>
            <td>${badgeRole[user.role]}</td>
            <td>${user.phoneNumber}</td>
            <td>${lastLogin}</td>
            <td>
                ${isActive ? badgeStatus.ACTIVE : badgeStatus.INACTIVE}
                ${isLocked ? badgeStatus.LOCKED : ''}
            </td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-secondary view-user" data-bs-toggle="tooltip" data-bs-placement="top" title="Chi tiết" data-user-id="${user.id}">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-outline-primary edit-user" data-bs-toggle="tooltip" data-bs-placement="top" title="Chỉnh sửa" data-user-id="${user.id}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-${user.active ? 'danger' : 'success'} toggle-status" data-bs-toggle="tooltip" data-bs-placement="top" 
                            title="${user.active ? 'Khóa tài khoản' : 'Kích hoạt'}" data-user-id="${user.id}" data-status="${user.active}">
                        <i class="bi bi-${user.active ? 'lock' : 'unlock'}"></i>
                    </button>
                </div>
            </td>`;
        tableBody.appendChild(row);
    });

    // Khởi tạo lại tooltip sau khi render
    initializeTooltip('[data-bs-toggle="tooltip"]');

    // Thêm sự kiện cho các nút
    addButtonEventListeners();
};

// Cập nhật phân trang
export const updatePagination = (currentPage, totalPages) => {
    const pagination = document.getElementById('userPagination');
    pagination.innerHTML = '';

    // Nút Previous
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `
    <a class="page-link" href="#" aria-label="Previous" data-page="${currentPage - 1}">
        <span aria-hidden="true">&laquo;</span>
    </a>`;
    pagination.appendChild(prevLi);

    // Các nút trang
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageLi = document.createElement('li');
        pageLi.className = `page-item ${i === currentPage ? 'active' : ''}`;
        pageLi.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
        pagination.appendChild(pageLi);
    }

    // Nút Next
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `
    <a class="page-link" href="#" aria-label="Next" data-page="${currentPage + 1}">
        <span aria-hidden="true">&raquo;</span>
    </a>`;
    pagination.appendChild(nextLi);

    // Thêm sự kiện cho các nút phân trang
    document.querySelectorAll('.pagination .page-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const page = parseInt(this.getAttribute('data-page'));
            if (page > 0 && page <= totalPages) {
                filterState.page = page;
                loadUsers();
            }
        });
    });
};

// Thêm các sự kiện cho nút
export const addButtonEventListeners = () => {
    // Nút thêm người dùng mới
    const addUserBtn = document.getElementById('addUserBtn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', function() {
            addUserModal();
        });
    }
    
    // Nút xem chi tiết
    document.querySelectorAll('.view-user').forEach(button => {
        button.addEventListener('click', function () {
            const userId = this.getAttribute('data-user-id');
            viewUser(userId);
        });
    });

    // Nút chỉnh sửa
    document.querySelectorAll('.edit-user').forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            editUser(userId);
        });
    });

    // Nút toggle trạng thái (khóa/mở khóa)
    document.querySelectorAll('.toggle-status').forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            const isActive = this.getAttribute('data-status') === 'true';
            toggleUserStatus(userId, isActive);
        });
    });
};

// Xem chi tiết người dùng
export const viewUser = (userId) => {
    const user = filterState.data.find(u => u.id == userId);
    if (user) {
        // Hiển thị modal chi tiết
        userDetailModal(user);
    }
};

// Chỉnh sửa người dùng
export const editUser = (userId) => {
    const user = filterState.data.find(u => u.id == userId);
    if (user) {
        // Hiển thị modal chỉnh sửa
        editUserModal(user);
    }
};

// Thay đổi trạng thái người dùng
export const toggleUserStatus = (userId, currentStatus) => {
    const user = filterState.data.find(u => u.id == userId);
    if (user) {
        // Hiển thị modal xác nhận thay đổi trạng thái
        toggleUserStatusModal(user);
    }
};

// Tải danh sách người dùng
export const loadUsers = async () => {
    try {
        showLoading();
        const data = await getUsers(filterState);
        filterState.data = data.users;
        renderUserTable(data.users);
        updatePagination(data.currentPage, data.totalPages);

        // Cập nhật tổng số người dùng hiển thị
        const countElement = document.getElementById('totalItemsLabel');
        if (countElement) {
            countElement.textContent = `người dùng trên mỗi trang (Tổng số: ${data.totalUsers})`;
        }
    } catch (error) {
        console.error('Error loading users:', error);
        showAlert('error', 'Không thể tải danh sách người dùng!');
    } finally {
        hideLoading();
    }
};

// Tải thống kê
export const loadStatistics = async () => {
    // Lấy tham chiếu đến các phần tử DOM
    const totalUsers = document.getElementById("totalUsers");
    const activeUsers = document.getElementById("activeUsers");
    const totalNewUsers = document.getElementById("totalNewUsers");
    const blockedUsers = document.getElementById("blockedUsers");
    
    try {
        // Lấy và hiển thị thống kê
        const stats = await getUserStats();
        if (stats) {
            if (totalUsers) totalUsers.textContent = stats.totalUsers;
            if (activeUsers) activeUsers.textContent = stats.activeUsers;
            if (blockedUsers) blockedUsers.textContent = stats.blockedUsers;
            if (totalNewUsers) totalNewUsers.textContent = stats.newUsersThisMonth;
        }
    } catch (error) {
        console.error('Error loading user statistics:', error);
    }
};

// Thiết lập sự kiện cho các bộ lọc
export const setupFilterEvents = () => {
    // Sự kiện cho ô tìm kiếm
    const searchInput = document.getElementById('searchUser');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                filterState.search = this.value;
                filterState.page = 1;
                loadUsers();
            }, 300);
        });
    }

    // Sự kiện cho bộ lọc vai trò
    $('#roleFilter').on('select2:select', function (e) {
        filterState.role = e.params.data.id;
        filterState.page = 1;
        loadUsers();
    });

    // Sự kiện cho bộ lọc trạng thái
    $('#statusFilter').on('select2:select', function (e) {
        filterState.status = e.params.data.id;
        filterState.page = 1;
        loadUsers();
    });

    // Sự kiện cho bộ lọc sắp xếp
    $('#sortOption').on('select2:select', function (e) {
        filterState.sort = e.params.data.id;
        filterState.page = 1;
        loadUsers();
    });

    // Thêm sự kiện cho select box items per page
    const itemsPerPageSelect = document.getElementById('itemsPerPage');
    if (itemsPerPageSelect) {
        itemsPerPageSelect.addEventListener('change', function () {
            filterState.limit = parseInt(this.value);
            filterState.page = 1;
            loadUsers();
        });
    }
};

// Thiết lập giá trị mặc định cho items per page
export const setDefaultItemsPerPage = () => {
    const itemsPerPageSelect = document.getElementById('itemsPerPage');
    if (itemsPerPageSelect) {
        itemsPerPageSelect.value = filterState.limit;
    }
};