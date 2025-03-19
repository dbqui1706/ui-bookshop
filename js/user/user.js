document.addEventListener('DOMContentLoaded', function () {
    // Khởi tạo tooltip Bootstrap
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    // Hiển thị modal đặt lại mật khẩu khi nhấn nút
    document.getElementById('resetPasswordBtn').addEventListener('click', function () {
        var userName = document.getElementById('edit-firstName').value + ' ' + document.getElementById('edit-lastName').value;
        document.getElementById('resetPasswordUserName').textContent = userName;
        var resetPasswordModal = new bootstrap.Modal(document.getElementById('resetPasswordModal'));
        resetPasswordModal.show();
    });

    // Hiện/ẩn mật khẩu
    document.getElementById('togglePasswordBtn').addEventListener('click', function () {
        var passwordInput = document.getElementById('newPassword');
        var icon = this.querySelector('i');

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('bi-eye');
            icon.classList.add('bi-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('bi-eye-slash');
            icon.classList.add('bi-eye');
        }
    });

    // Kích hoạt/vô hiệu hóa nút xác nhận xóa dựa trên checkbox
    document.getElementById('confirmUserDeletion').addEventListener('change', function () {
        document.getElementById('confirmDeleteUserBtn').disabled = !this.checked;
    });

    // Xử lý khi mở modal xem chi tiết người dùng
    var viewUserModal = document.getElementById('viewUserModal');
    viewUserModal.addEventListener('show.bs.modal', function (event) {
        var button = event.relatedTarget;
        var userId = button.getAttribute('data-id');

        // Lấy thông tin người dùng qua API (giả lập - thực tế sẽ gọi API)
        // fetchUserDetails(userId).then(user => {
        //   // Điền thông tin người dùng vào modal
        // });

        // Giả lập dữ liệu để hiển thị (thay thế bằng dữ liệu thật)
        document.getElementById('viewUserName').textContent = 'Nguyễn Văn ' + userId;
        // Các thông tin khác...
    });

    // Xử lý khi mở modal chỉnh sửa người dùng
    var editUserModal = document.getElementById('editUserModal');
    editUserModal.addEventListener('show.bs.modal', function (event) {
        var button = event.relatedTarget;
        var userId = button.getAttribute('data-id');

        // Điền thông tin vào form chỉnh sửa (giả lập)
        document.getElementById('edit-userId').value = userId;
        // Các thông tin khác...
    });

    // Xử lý khi mở modal xác nhận xóa người dùng
    var deleteUserModal = document.getElementById('deleteUserModal');
    deleteUserModal.addEventListener('show.bs.modal', function (event) {
        var button = event.relatedTarget;
        var userId = button.getAttribute('data-id');
        var userName = 'Người dùng #' + userId; // Giả lập, thực tế sẽ lấy tên thật

        document.getElementById('deleteUserName').textContent = userName;
        document.getElementById('confirmUserDeletion').checked = false;
        document.getElementById('confirmDeleteUserBtn').disabled = true;
    });

    // Xử lý nút thêm mới người dùng
    document.getElementById('saveUserBtn').addEventListener('click', function () {
        var form = document.getElementById('addUserForm');
        // Kiểm tra hợp lệ và xử lý submit form
        if (form.checkValidity()) {
            // Xử lý thêm người dùng...

            // Hiển thị thông báo thành công
            document.getElementById('successMessage').textContent = 'Đã thêm người dùng mới thành công!';
            document.getElementById('successMessage').style.display = 'block';

            // Ẩn thông báo sau 3 giây
            setTimeout(function () {
                document.getElementById('successMessage').style.display = 'none';
            }, 3000);
        } else {
            // Hiển thị validation
            form.classList.add('was-validated');
        }
    });

    // Xử lý nút cập nhật người dùng
    document.getElementById('updateUserBtn').addEventListener('click', function () {
        var form = document.getElementById('editUserForm');
        // Kiểm tra hợp lệ và xử lý submit form
        if (form.checkValidity()) {
            // Xử lý cập nhật người dùng...

            // Đóng modal và làm mới dữ liệu (thực tế)
            var modal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
            modal.hide();
        } else {
            // Hiển thị validation
            form.classList.add('was-validated');
        }
    });

    // Xử lý preview ảnh đại diện khi upload
    document.getElementById('user-avatar').addEventListener('change', function (e) {
        if (e.target.files.length > 0) {
            var src = URL.createObjectURL(e.target.files[0]);
            var preview = document.getElementById('avatarPreview');
            preview.querySelector('img').src = src;
            preview.style.display = 'block';
        }
    });

    document.getElementById('edit-avatar').addEventListener('change', function (e) {
        if (e.target.files.length > 0) {
            var src = URL.createObjectURL(e.target.files[0]);
            document.getElementById('editAvatarPreview').querySelector('img').src = src;
        }
    });
});