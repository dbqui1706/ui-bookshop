// Sidebar Toggle
document
    .getElementById("sidebarCollapse")
    .addEventListener("click", function () {
        document.getElementById("sidebar").classList.toggle("collapsed");
        document.getElementById("content").classList.toggle("expanded");
    });

// Submenu Toggle
document.querySelectorAll(".dropdown-toggle").forEach((item) => {
    item.addEventListener("click", (event) => {
        event.preventDefault();
        const submenu = document.getElementById(
            item.getAttribute("data-bs-toggle")
        );
        submenu.classList.toggle("show");
    });
});

