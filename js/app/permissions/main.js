// js/app/permissions/main.js
import { loadRoles } from './roles.js';
import { loadPermissions } from './permissions.js';
import { loadRolePermissions } from './rolePermissions.js';
import { loadUserRoles } from './userRoles.js';

// Khi trang đã tải xong
document.addEventListener('DOMContentLoaded', async function() {
    // Nạp nội dung cho các tab
    try {
        await loadTabContent('roles-container', 'roles.html');
        await loadTabContent('permissions-container', 'permissions.html');
        await loadTabContent('role-permissions-container', 'role-permissions.html');
        await loadTabContent('user-roles-container', 'user-roles.html');
        
        // Khởi tạo tab đang active
        initActiveTab();
    } catch (error) {
        console.error('Error loading tab content:', error);
        Swal.fire({
            icon: 'error',
            title: 'Lỗi tải dữ liệu',
            text: 'Đã xảy ra lỗi khi tải nội dung. Vui lòng thử lại sau.'
        });
    }
});

// Hàm nạp nội dung cho tab
async function loadTabContent(containerId, htmlFile) {
    try {
        const response = await fetch(`templates/permissions/${htmlFile}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        document.getElementById(containerId).innerHTML = html;
    } catch (error) {
        console.error(`Error loading ${htmlFile}:`, error);
        throw error;
    }
}

// Khởi tạo tab đang active
function initActiveTab() {
    const activeTabId = document.querySelector('#permissionTabs .nav-link.active').getAttribute('id');
    
    switch(activeTabId) {
        case 'roles-tab':
            loadRoles();
            break;
        case 'permissions-tab':
            loadPermissions();
            break;
        case 'role-permissions-tab':
            loadRolePermissions();
            break;
        case 'user-roles-tab':
            loadUserRoles();
            break;
    }

    // Xử lý sự kiện khi chuyển tab
    document.querySelectorAll('#permissionTabs .nav-link').forEach(tab => {
        tab.addEventListener('shown.bs.tab', function(event) {
            const tabId = event.target.getAttribute('id');
            
            switch(tabId) {
                case 'roles-tab':
                    loadRoles();
                    break;
                case 'permissions-tab':
                    loadPermissions();
                    break;
                case 'role-permissions-tab':
                    loadRolePermissions();
                    break;
                case 'user-roles-tab':
                    loadUserRoles();
                    break;
            }
        });
    });
}