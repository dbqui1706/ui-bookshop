import { OrderDetailContainer } from "../containers/orders/OrderDetailContainer.js";

// Khởi tạo container khi trang được tải
document.addEventListener('DOMContentLoaded', () => {
    // Lấy element container
    const containerElement = document.getElementById('content');
    
    if (containerElement) {
        // Khởi tạo container
        new OrderDetailContainer(containerElement);
    } else {
        console.error('Container element not found');
    }
});

// // Dữ liệu mẫu đơn hàng
// const orderData = {
//     id: 1,
//     code: "ORD-2023-04-18",
//     orderDate: "18/04/2025 14:30:25",
//     status: "Đang giao hàng",
//     paymentStatus: "Đã thanh toán",
//     paymentMethod: "Chuyển khoản ngân hàng",
//     note: "Giao hàng trong giờ hành chính, gọi trước khi giao",
//     customer: {
//         name: "Nguyễn Văn Anh",
//         phone: "0987654321",
//         email: "nguyenvananh@gmail.com",
//         address: "123 Nguyễn Trãi, Phường Nguyễn Cư Trinh, Quận 1, TP. Hồ Chí Minh"
//     },
//     items: [
//         {
//             id: 1,
//             image: "https://avatar.iran.liara.run/book",
//             name: "Sách Đắc Nhân Tâm - Dale Carnegie",
//             sku: "SKU-DNT-001",
//             price: 150000,
//             quantity: 2,
//             total: 300000
//         },
//         {
//             id: 2,
//             image: "https://avatar.iran.liara.run/book",
//             name: "Sách Nhà Giả Kim - Paulo Coelho",
//             sku: "SKU-NGK-002",
//             price: 120000,
//             quantity: 1,
//             total: 120000
//         },
//         {
//             id: 3,
//             image: "https://avatar.iran.liara.run/book",
//             name: "Sách Người Giàu Có Nhất Thành Babylon",
//             sku: "SKU-NGCNTB-003",
//             price: 89000,
//             quantity: 3,
//             total: 267000
//         }
//     ],
//     summary: {
//         subtotal: 687000,
//         discount: 50000,
//         shipping: 30000,
//         total: 667000
//     },
//     timeline: [
//         {
//             date: "18/04/2025 14:30:25",
//             status: "Đơn hàng đã đặt",
//             description: "Khách hàng đã đặt đơn hàng thành công"
//         },
//         {
//             date: "18/04/2025 15:45:12",
//             status: "Đã xác nhận",
//             description: "Đơn hàng đã được xác nhận bởi nhân viên Trần Văn Bình"
//         },
//         {
//             date: "19/04/2025 09:15:33",
//             status: "Đang đóng gói",
//             description: "Đơn hàng đang được đóng gói tại kho"
//         },
//         {
//             date: "19/04/2025 14:22:45",
//             status: "Đang giao hàng",
//             description: "Đơn hàng đã được giao cho đơn vị vận chuyển J&T Express"
//         }
//     ]
// };

// // Format tiền tệ VND
// function formatCurrency(amount) {
//     return new Intl.NumberFormat('vi-VN', {
//         style: 'currency',
//         currency: 'VND',
//         minimumFractionDigits: 0
//     }).format(amount);
// }

// // Hàm hiển thị trạng thái đơn hàng với màu tương ứng
// function renderOrderStatus(status) {
//     let badgeClass = "";
//     let iconClass = "";
    
//     switch(status.toLowerCase()) {
//         case "chờ xác nhận":
//             badgeClass = "bg-pending";
//             iconClass = "bi-hourglass-split";
//             break;
//         case "đã xác nhận":
//             badgeClass = "bg-info";
//             iconClass = "bi-check-circle";
//             break;
//         case "đang đóng gói":
//             badgeClass = "bg-primary";
//             iconClass = "bi-box-seam";
//             break;
//         case "đang giao hàng":
//             badgeClass = "bg-shipped";
//             iconClass = "bi-truck";
//             break;
//         case "đã giao hàng":
//             badgeClass = "bg-delivered";
//             iconClass = "bi-check2-all";
//             break;
//         case "đã hủy":
//             badgeClass = "bg-cancelled";
//             iconClass = "bi-x-circle";
//             break;
//         case "hoàn trả":
//             badgeClass = "bg-returned";
//             iconClass = "bi-arrow-return-left";
//             break;
//         default:
//             badgeClass = "bg-secondary";
//             iconClass = "bi-question-circle";
//     }
    
//     return `<span class="badge ${badgeClass} status-badge"><i class="bi ${iconClass} me-1"></i>${status}</span>`;
// }

// // Hiển thị thông tin khách hàng
// function populateCustomerInfo() {
//     document.getElementById("customerName").textContent = orderData.customer.name;
//     document.getElementById("customerPhone").textContent = orderData.customer.phone;
//     document.getElementById("customerEmail").textContent = orderData.customer.email;
//     document.getElementById("customerAddress").textContent = orderData.customer.address;
// }

// // Hiển thị thông tin đơn hàng
// function populateOrderInfo() {
//     document.getElementById("orderDetailTitle").innerHTML = `Chi tiết đơn hàng <strong>${orderData.code}</strong>`;
//     document.getElementById("orderCode").textContent = orderData.code;
//     document.getElementById("orderDate").textContent = orderData.orderDate;
//     document.getElementById("orderStatus").innerHTML = renderOrderStatus(orderData.status);
//     document.getElementById("paymentStatus").innerHTML = `<span class="badge bg-success">${orderData.paymentStatus}</span>`;
//     document.getElementById("paymentMethod").textContent = ` (${orderData.paymentMethod})`;
//     document.getElementById("orderNote").textContent = orderData.note || "Không có ghi chú";
// }

// // Hiển thị danh sách sản phẩm
// function populateOrderItems() {
//     const container = document.getElementById("orderItemsContainer");
//     let html = `
//         <div class="card border-0 shadow-sm mb-4 rounded">
//             <div class="table-responsive rounded">
//                 <table class="table product-table mb-0 ">
//                     <thead>
//                         <tr>
//                             <th class="ps-4" style="width: 50px">STT</th>
//                             <th style="width: 100px">Ảnh</th>
//                             <th>Sản phẩm</th>
//                             <th style="width: 250px">Mã SKU</th>
//                             <th style="width: 130px">Đơn giá</th>
//                             <th style="width: 100px" class="text-center">Số lượng</th>
//                             <th style="width: 150px" class="text-end pe-4">Thành tiền</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//     `;

//     orderData.items.forEach((item, index) => {
//         html += `
//             <tr class="product-row">
//                 <td class="ps-4">${index + 1}</td>
//                 <td>
//                     <div class="product-image-container">
//                         <img src="${item.image}" class="product-image" alt="${item.name}">
//                     </div>
//                 </td>
//                 <td>
//                     <div class="product-info">
//                         <div class="product-name">${item.name}</div>
//                     </div>
//                 </td>
//                 <td><span class="sku-badge">${item.sku}</span></td>
//                 <td>
//                     <span class="product-price">${formatCurrency(item.price)}</span>
//                     <span class="product-base-price" style="color: #999;text-decoration: line-through;">
//                         ${formatCurrency(item.price)}
//                     </span>
//                 </td>
//                 <td class="text-center">
//                     <span class="quantity-badge">${item.quantity}</span>
//                 </td>
//                 <td class="text-end pe-4 fw-bold text-primary">${formatCurrency(item.total)}</td>
//             </tr>
//         `;
//     });

//     html += `
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     `;

//     container.innerHTML = html;
// }

// // Hiển thị thông tin thanh toán
// function populateOrderSummary() {
//     document.getElementById("orderSubtotal").textContent = formatCurrency(orderData.summary.subtotal);
//     document.getElementById("orderDiscount").textContent = `- ${formatCurrency(orderData.summary.discount)}`;
//     document.getElementById("orderShipping").textContent = formatCurrency(orderData.summary.shipping);
//     document.getElementById("orderTotal").textContent = formatCurrency(orderData.summary.total);
// }

// // Hiển thị lịch sử đơn hàng
// function populateOrderTimeline() {
//     const timeline = document.getElementById("orderTimeline");
//     let html = "";

//     orderData.timeline.forEach((item, index) => {
//         html += `
//             <div class="timeline-item">
//                 <div class="timeline-marker"></div>
//                 <div class="timeline-content rounded">
//                     <div class="d-flex justify-content-between">
//                         <h6 class="mb-1">${item.status}</h6>
//                         <small class="text-muted">${item.date}</small>
//                     </div>
//                     <p class="text-muted mb-0">${item.description}</p>
//                 </div>
//             </div>
//         `;
//     });

//     timeline.innerHTML = html;
// }

// // Xử lý các sự kiện
// function setupEventListeners() {
//     // Nút quay lại
//     document.getElementById("btnBackToOrders").addEventListener("click", function() {
//         Swal.fire({
//             title: 'Quay lại danh sách đơn hàng?',
//             text: "Các thay đổi chưa lưu sẽ bị mất!",
//             icon: 'warning',
//             showCancelButton: true,
//             confirmButtonColor: '#3085d6',
//             cancelButtonColor: '#d33',
//             confirmButtonText: 'Đồng ý',
//             cancelButtonText: 'Hủy bỏ'
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 // Redirect về trang danh sách đơn hàng
//                 // window.location.href = 'order-list.html';
//                 console.log("Quay lại danh sách đơn hàng");
//             }
//         });
//     });

//     document.getElementById("btnBackToOrdersBottom").addEventListener("click", function() {
//         document.getElementById("btnBackToOrders").click();
//     });

//     // Nút cập nhật trạng thái
//     document.getElementById("btnUpdateStatus").addEventListener("click", function() {
//         Swal.fire({
//             title: 'Cập nhật trạng thái',
//             html: `
//                 <select id="swal-status" class="form-select mb-3">
//                     <option value="">-- Chọn trạng thái --</option>
//                     <option value="Đã xác nhận">Đã xác nhận</option>
//                     <option value="Đang đóng gói">Đang đóng gói</option>
//                     <option value="Đang giao hàng">Đang giao hàng</option>
//                     <option value="Đã giao hàng">Đã giao hàng</option>
//                     <option value="Đã hủy">Đã hủy</option>
//                     <option value="Hoàn trả">Hoàn trả</option>
//                 </select>
//                 <textarea id="swal-note" class="form-control" placeholder="Ghi chú (nếu có)"></textarea>
//             `,
//             showCancelButton: true,
//             confirmButtonText: 'Cập nhật',
//             cancelButtonText: 'Hủy bỏ',
//             preConfirm: () => {
//                 const status = document.getElementById('swal-status').value;
//                 const note = document.getElementById('swal-note').value;
                
//                 if (!status) {
//                     Swal.showValidationMessage('Vui lòng chọn trạng thái');
//                     return false;
//                 }
                
//                 return { status, note };
//             }
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 // Thêm vào timeline
//                 const now = new Date();
//                 const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
                
//                 orderData.timeline.push({
//                     date: formattedDate,
//                     status: result.value.status,
//                     description: result.value.note || `Đơn hàng đã được cập nhật trạng thái thành "${result.value.status}"`
//                 });
                
//                 // Cập nhật trạng thái đơn hàng
//                 orderData.status = result.value.status;
                
//                 // Cập nhật giao diện
//                 document.getElementById("orderStatus").innerHTML = renderOrderStatus(orderData.status);
//                 populateOrderTimeline();
                
//                 Swal.fire({
//                     title: 'Thành công!',
//                     text: 'Đã cập nhật trạng thái đơn hàng',
//                     icon: 'success',
//                     confirmButtonText: 'Đóng'
//                 });
//             }
//         });
//     });

//     // Nút in đơn hàng
//     document.getElementById("btnPrintOrder").addEventListener("click", function() {
//         Swal.fire({
//             title: 'Đang chuẩn bị in...',
//             text: 'Vui lòng đợi trong giây lát',
//             timer: 2000,
//             timerProgressBar: true,
//             didOpen: () => {
//                 Swal.showLoading();
//             }
//         }).then(() => {
//             window.print();
//         });
//     });
// }

// // Khởi tạo trang
// document.addEventListener("DOMContentLoaded", function() {
//     // Sidebar Toggle
//     document.getElementById("sidebarCollapse").addEventListener("click", function() {
//         document.getElementById("sidebar").classList.toggle("active");
//     });
    
//     // Populate data
//     populateCustomerInfo();
//     populateOrderInfo();
//     populateOrderItems();
//     populateOrderSummary();
//     populateOrderTimeline();
//     setupEventListeners();
// });