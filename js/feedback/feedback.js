/* JavaScript cho trang Quản lý phản hồi */
document.addEventListener('DOMContentLoaded', function () {
    // Khởi tạo tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Xử lý cho checkbox Thêm ghi chú nội bộ
    const internalNoteCheck = document.getElementById('internalNoteCheck');
    if (internalNoteCheck) {
        internalNoteCheck.addEventListener('change', function () {
            const internalNoteContainer = document.getElementById('internalNoteContainer');
            internalNoteContainer.style.display = this.checked ? 'block' : 'none';
        });
    }

    // Xử lý cho select Lý do đóng
    const closeReason = document.getElementById('closeReason');
    if (closeReason) {
        closeReason.addEventListener('change', function () {
            const otherReasonContainer = document.getElementById('otherReasonContainer');
            otherReasonContainer.style.display = this.value === 'other' ? 'block' : 'none';
        });
    }

    // Xử lý nút làm mới
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function () {
            // Làm mới dữ liệu (thực tế sẽ gọi API)
            alert('Đang làm mới dữ liệu...');
            // Làm mới trang sau 1 giây
            setTimeout(function () {
                window.location.reload();
            }, 1000);
        });
    }

    // Xử lý nút gửi phản hồi
    const sendReplyBtn = document.getElementById('sendReplyBtn');
    if (sendReplyBtn) {
        sendReplyBtn.addEventListener('click', function () {
            // Validate form
            const replyContent = document.getElementById('replyContent');
            if (!replyContent.value.trim()) {
                alert('Vui lòng nhập nội dung trả lời!');
                return;
            }

            // Thực hiện gửi phản hồi (thực tế sẽ gọi API)
            alert('Đã gửi phản hồi thành công!');

            // Đóng modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('replyFeedbackModal'));
            modal.hide();

            // Làm mới trang sau 1 giây
            setTimeout(function () {
                window.location.reload();
            }, 1000);
        });
    }

    // Xử lý nút đóng phản hồi
    const confirmCloseBtn = document.getElementById('confirmCloseBtn');
    if (confirmCloseBtn) {
        confirmCloseBtn.addEventListener('click', function () {
            // Validate form
            const closeReason = document.getElementById('closeReason');
            if (!closeReason.value) {
                alert('Vui lòng chọn lý do đóng phản hồi!');
                return;
            }

            // Thực hiện đóng phản hồi (thực tế sẽ gọi API)
            alert('Đã đóng phản hồi thành công!');

            // Đóng modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('closeFeedbackModal'));
            modal.hide();

            // Làm mới trang sau 1 giây
            setTimeout(function () {
                window.location.reload();
            }, 1000);
        });
    }

    // Xử lý nút mở lại phản hồi
    const confirmReopenBtn = document.getElementById('confirmReopenBtn');
    if (confirmReopenBtn) {
        confirmReopenBtn.addEventListener('click', function () {
            // Thực hiện mở lại phản hồi (thực tế sẽ gọi API)
            alert('Đã mở lại phản hồi thành công!');

            // Đóng modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('reopenFeedbackModal'));
            modal.hide();

            // Làm mới trang sau 1 giây
            setTimeout(function () {
                window.location.reload();
            }, 1000);
        });
    }

    // Xử lý nút chuyển phản hồi
    const confirmAssignBtn = document.getElementById('confirmAssignBtn');
    if (confirmAssignBtn) {
        confirmAssignBtn.addEventListener('click', function () {
            // Validate form
            const assignDepartment = document.getElementById('assignDepartment');
            const assignStaff = document.getElementById('assignStaff');
            if (!assignDepartment.value && !assignStaff.value) {
                alert('Vui lòng chọn bộ phận hoặc nhân viên để chuyển phản hồi!');
                return;
            }

            // Thực hiện chuyển phản hồi (thực tế sẽ gọi API)
            alert('Đã chuyển phản hồi thành công!');

            // Đóng modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('assignFeedbackModal'));
            modal.hide();

            // Làm mới trang sau 1 giây
            setTimeout(function () {
                window.location.reload();
            }, 1000);
        });
    }
});