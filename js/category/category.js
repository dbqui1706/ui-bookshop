export const API_URLS = {
    CATEGORIES: "http://localhost:8080/admin2/api/product/product-category",
};

export const getCategory = async () => {
    try {
        const response = await fetch(API_URLS.CATEGORIES, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json;charset=UTF-8",
            },
        });
        if (response.status === 200) {
            return await response.json();
        }
        return {};
    } catch (error) {
        console.log(error);
        return {};
    }
}

document.addEventListener("DOMContentLoaded", function() {

    // test API
    getCategory().then((data) => {
        console.log(data);
    });

    // Khởi tạo tất cả tooltip trong trang
    var tooltipTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Xử lý sinh tự động slug từ tên thể loại
    const categoryNameInput = document.getElementById("categoryName");
    const categorySlugInput = document.getElementById("categorySlug");

    if (categoryNameInput && categorySlugInput) {
        categoryNameInput.addEventListener("keyup", function() {
            // Chuyển đổi thành slug (loại bỏ dấu, chuyển khoảng trắng thành dấu gạch ngang)
            let slug = this.value
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu tiếng Việt
                .replace(/[đĐ]/g, "d")
                .replace(/[^a-z0-9\s-]/g, "") // Loại bỏ ký tự đặc biệt
                .replace(/[\s-]+/g, "-") // Thay khoảng trắng và nhiều dấu gạch ngang thành một dấu gạch ngang
                .trim();

            categorySlugInput.value = slug;
        });
    }

    // Xử lý nút lưu thể loại
    const saveCategoryBtn = document.getElementById("saveCategoryBtn");
    const addCategoryForm = document.getElementById("addCategoryForm");

    if (saveCategoryBtn && addCategoryForm) {
        saveCategoryBtn.addEventListener("click", function() {
            if (addCategoryForm.checkValidity()) {
                // Giả lập việc lưu thành công
                alert("Thể loại đã được thêm thành công!");

                // Đóng modal
                const modal = bootstrap.Modal.getInstance(
                    document.getElementById("addCategoryModal")
                );
                modal.hide();

                // Reset form
                addCategoryForm.reset();
            } else {
                addCategoryForm.reportValidity();
            }
        });
    }

    // Xử lý nút chỉnh sửa
    const editButtons = document.querySelectorAll(".btn-outline-primary");

    editButtons.forEach((button) => {
        button.addEventListener("click", function() {
            // Lấy thông tin từ hàng được chọn
            const row = this.closest("tr");
            const id = row.cells[0].textContent;
            const name = row.cells[1].textContent;
            const slug = row.cells[2].textContent;
            const status =
                row.cells[6].querySelector(".badge").textContent === "Hoạt động" ?
                    "active" :
                    "inactive";

            // Điền thông tin vào form chỉnh sửa
            document.getElementById("editCategoryId").value = id;
            document.getElementById("editCategoryName").value = name;
            document.getElementById("editCategorySlug").value = slug;

            if (status === "active") {
                document.getElementById(
                    "editCategoryStatusActive"
                ).checked = true;
            } else {
                document.getElementById(
                    "editCategoryStatusInactive"
                ).checked = true;
            }

            document.getElementById("editCategoryOrder").value = 0; // Giả định

            // Mở modal chỉnh sửa
            const editModal = new bootstrap.Modal(
                document.getElementById("editCategoryModal")
            );
            editModal.show();
        });
    });

    // Xử lý nút cập nhật thể loại
    const updateCategoryBtn = document.getElementById("updateCategoryBtn");

    if (updateCategoryBtn) {
        updateCategoryBtn.addEventListener("click", function() {
            // Giả lập việc cập nhật thành công
            alert("Thể loại đã được cập nhật thành công!");

            // Đóng modal
            const modal = bootstrap.Modal.getInstance(
                document.getElementById("editCategoryModal")
            );
            modal.hide();
        });
    }

    // Xử lý nút khóa/mở khóa
    const lockButtons = document.querySelectorAll(".btn-outline-danger");
    const unlockButtons = document.querySelectorAll(".btn-outline-success");

    lockButtons.forEach((button) => {
        button.addEventListener("click", function() {
            if (confirm("Bạn có chắc chắn muốn khóa thể loại này?")) {
                alert("Đã khóa thể loại thành công!");
            }
        });
    });

    unlockButtons.forEach((button) => {
        button.addEventListener("click", function() {
            if (confirm("Bạn có chắc chắn muốn mở khóa thể loại này?")) {
                alert("Đã mở khóa thể loại thành công!");
            }
        });
    });
});