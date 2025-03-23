// Script để quản lý Popover và Modal
document.addEventListener('DOMContentLoaded', function () {
    // ===== 1. POPOVER CHO COUPON INFO ICON =====
    const couponInfoIcons = document.querySelectorAll('.coupon-info-icon i');

    couponInfoIcons.forEach(icon => {
        // Tạo popover container
        const couponCode = "XTRA2470QCC0";
        const popover = document.createElement('div');
        popover.className = 'coupon-popover';
        popover.innerHTML = `
            <div class="popover-header">
                <span>Mã</span>
                <span class="popover-code">${couponCode} <i class="fas fa-copy" title="Nhấn để sao chép"></i></span>
                <span class="copy-tooltip">Đã sao chép!</span>
            </div>
            <div class="popover-content">
                <div class="popover-detail">
                    <div class="detail-row">
                        <span class="detail-label">Hạn sử dụng</span>
                        <span class="detail-value">30/08/36</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Điều kiện</span>
                        <ul class="detail-conditions">
                            <li>Giảm 70K phí vận chuyển cho đơn hàng từ 100K.</li>
                            <li>Chỉ áp dụng cho các sản phẩm có gắn nhãn Freeship Xtra</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;

        // Thêm chức năng copy khi click vào biểu tượng copy
        const copyIcon = popover.querySelector('.fa-copy');
        copyIcon.addEventListener('click', function () {
            // Sao chép mã vào clipboard
            navigator.clipboard.writeText(couponCode).then(() => {
                // Hiển thị tooltip "Đã sao chép"
                const tooltip = popover.querySelector('.copy-tooltip');
                tooltip.style.visibility = 'visible';
                tooltip.style.opacity = '1';

                // Ẩn tooltip sau 2 giây
                setTimeout(() => {
                    tooltip.style.visibility = 'hidden';
                    tooltip.style.opacity = '0';
                }, 2000);
            }).catch(err => {
                console.error('Không thể sao chép văn bản: ', err);
                // Sử dụng phương pháp thay thế nếu clipboard API không hoạt động
                const textArea = document.createElement('textarea');
                textArea.value = couponCode;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);

                // Hiển thị tooltip
                const tooltip = popover.querySelector('.copy-tooltip');
                tooltip.style.visibility = 'visible';
                tooltip.style.opacity = '1';

                setTimeout(() => {
                    tooltip.style.visibility = 'hidden';
                    tooltip.style.opacity = '0';
                }, 2000);
            });
        });

        document.body.appendChild(popover);

        // Hiển thị/ẩn popover khi hover - hiển thị ở trên biểu tượng
        icon.addEventListener('mouseenter', function (e) {
            const rect = icon.getBoundingClientRect();
            popover.style.display = 'block';
            // Điều chỉnh hiển thị popover ở phía trên biểu tượng
            popover.style.top = (rect.top + window.scrollY - popover.offsetHeight - 10) + 'px';
            popover.style.left = (rect.left + window.scrollX - 220) + 'px';
        });

        // Tạo một biến để theo dõi trạng thái hover
        let isHoveringIcon = false;
        let isHoveringPopover = false;

        // Khi hover vào icon
        icon.addEventListener('mouseenter', function () {
            isHoveringIcon = true;
            updatePopoverVisibility();
        });

        // Khi không hover vào icon nữa
        icon.addEventListener('mouseleave', function () {
            isHoveringIcon = false;
            // Dùng setTimeout để tạo độ trễ và kiểm tra trạng thái hover của popover
            setTimeout(updatePopoverVisibility, 100);
        });

        // Khi hover vào popover
        popover.addEventListener('mouseenter', function () {
            isHoveringPopover = true;
            updatePopoverVisibility();
        });

        // Khi không hover vào popover nữa
        popover.addEventListener('mouseleave', function () {
            isHoveringPopover = false;
            updatePopoverVisibility();
        });

        // Hàm cập nhật hiển thị popover dựa trên trạng thái hover
        function updatePopoverVisibility() {
            if (isHoveringIcon || isHoveringPopover) {
                popover.style.display = 'block';
            } else {
                popover.style.display = 'none';
            }
        }
    });

    // ===== 2. MODAL CHO XEM THÊM MÃ GIẢM GIÁ =====
    const moreCouponsLinks = document.querySelectorAll('.more-coupons');

    moreCouponsLinks.forEach(link => {
        link.addEventListener('click', function () {
            openCouponModal();
        });
    });

    function openCouponModal() {
        // Tạo modal backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';
        document.body.appendChild(backdrop);

        // Tạo modal container
        const modal = document.createElement('div');
        modal.className = 'coupon-modal';
        modal.innerHTML = `
            <div class="modal-header">
                <h4>Tiki Khuyến Mãi</h4>
                <button class="close-modal"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <div class="coupon-search">
                    <input type="text" placeholder="Nhập mã giảm giá" class="coupon-input">
                    <button class="btn-apply-coupon">Áp dụng</button>
                </div>
                
                <div class="coupon-section">
                    <div class="section-header">
                        <h5>Mã Giảm Giá</h5>
                        <span class="section-badge">Áp dụng tối đa: 1</span>
                    </div>
                    
                    <div class="coupon-list">
                        <div class="coupon-card">
                            <div class="coupon-card-left">
                                <img src="/asset/images/tiki-logo.png" alt="Tiki Logo">
                            </div>
                            <div class="coupon-card-right">
                                <div class="coupon-info">
                                    <div class="coupon-title">Giảm 3%</div>
                                    <div class="coupon-desc">Cho đơn hàng từ 300K</div>
                                    <div class="coupon-date">HSD: 31/03/25</div>
                                </div>
                                <div class="coupon-status">
                                    <span class="status-badge">CHƯA THỎA ĐIỀU KIỆN</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="coupon-card">
                            <div class="coupon-card-left">
                                <img src="/asset/images/tiki-logo.png" alt="Tiki Logo">
                            </div>
                            <div class="coupon-card-right">
                                <div class="coupon-info">
                                    <div class="coupon-title">Giảm 15% tối đa 70K</div>
                                    <div class="coupon-desc">Cho đơn hàng từ 399K</div>
                                    <div class="coupon-date">HSD: 31/03/25</div>
                                </div>
                                <div class="coupon-status">
                                    <span class="status-badge">CHƯA THỎA ĐIỀU KIỆN</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="coupon-section mt-4">
                        <div class="section-header">
                            <h5>Mã Vận Chuyển</h5>
                            <span class="section-badge">Áp dụng tối đa: 1</span>
                        </div>
                        
                        <div class="coupon-list">
                            <div class="coupon-card selected">
                                <div class="coupon-card-left freeship-xtra">
                                    <div class="xtra-logo">FREESHIP<br>XTRA</div>
                                    <div class="xtra-free">Miễn phí<br>vận chuyển</div>
                                </div>
                                <div class="coupon-card-right">
                                    <div class="coupon-info">
                                        <div class="coupon-title">Giảm 70K</div>
                                        <div class="coupon-desc">Cho đơn hàng từ 100K</div>
                                        <div class="coupon-date">HSD: 30/08/36</div>
                                    </div>
                                    <div class="coupon-status">
                                        <button class="btn-select-coupon selected">Bỏ Chọn</button>
                                        <i class="fas fa-info-circle coupon-info-trigger"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Xử lý đóng modal
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', function () {
            document.body.removeChild(backdrop);
            document.body.removeChild(modal);
        });

        backdrop.addEventListener('click', function () {
            document.body.removeChild(backdrop);
            document.body.removeChild(modal);
        });

        // Xử lý copy mã giảm giá trong modal
        const copyButtons = modal.querySelectorAll('.fa-copy');
        copyButtons.forEach(button => {
            button.addEventListener('click', function () {
                const couponCode = this.getAttribute('data-code');

                // Sao chép mã vào clipboard
                navigator.clipboard.writeText(couponCode).then(() => {
                    // Hiển thị tooltip "Đã sao chép"
                    const tooltip = this.nextElementSibling;
                    tooltip.style.visibility = 'visible';
                    tooltip.style.opacity = '1';

                    // Ẩn tooltip sau 2 giây
                    setTimeout(() => {
                        tooltip.style.visibility = 'hidden';
                        tooltip.style.opacity = '0';
                    }, 2000);
                }).catch(err => {
                    console.error('Không thể sao chép văn bản: ', err);
                    // Sử dụng phương pháp thay thế nếu clipboard API không hoạt động
                    const textArea = document.createElement('textarea');
                    textArea.value = couponCode;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);

                    // Hiển thị tooltip
                    const tooltip = this.nextElementSibling;
                    tooltip.style.visibility = 'visible';
                    tooltip.style.opacity = '1';

                    setTimeout(() => {
                        tooltip.style.visibility = 'hidden';
                        tooltip.style.opacity = '0';
                    }, 2000);
                });
            });
        });

        // Info popover cho coupon trong modal - hiển thị ở trên biểu tượng
        const infoTriggers = modal.querySelectorAll('.coupon-info-trigger');
        infoTriggers.forEach(trigger => {
            let modalIsHoveringIcon = false;
            let modalIsHoveringPopover = false;
            const popover = document.querySelector('.coupon-popover');

            trigger.addEventListener('mouseenter', function (e) {
                const rect = trigger.getBoundingClientRect();
                modalIsHoveringIcon = true;
                // Điều chỉnh hiển thị popover ở phía trên biểu tượng
                popover.style.top = (rect.top + window.scrollY - popover.offsetHeight - 10) + 'px';
                popover.style.left = (rect.left + window.scrollX - 220) + 'px';
                updateModalPopoverVisibility();
            });

            trigger.addEventListener('mouseleave', function () {
                modalIsHoveringIcon = false;
                setTimeout(updateModalPopoverVisibility, 100);
            });

            popover.addEventListener('mouseenter', function () {
                modalIsHoveringPopover = true;
                updateModalPopoverVisibility();
            });

            popover.addEventListener('mouseleave', function () {
                modalIsHoveringPopover = false;
                updateModalPopoverVisibility();
            });

            function updateModalPopoverVisibility() {
                if (modalIsHoveringIcon || modalIsHoveringPopover) {
                    popover.style.display = 'block';
                } else {
                    popover.style.display = 'none';
                }
            }
        });
    }

    // ===== 3. MODAL CHO THAY ĐỔI ĐỊA CHỈ =====
    const changeAddressLinks = document.querySelectorAll('.change-address a');

    changeAddressLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            openAddressModal();
        });
    });

    function openAddressModal() {
        // Tạo modal backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';
        document.body.appendChild(backdrop);

        // Tạo modal container
        const modal = document.createElement('div');
        modal.className = 'address-modal';
        modal.innerHTML = `
        <div class="modal-header">
            <h4>Thay đổi địa chỉ giao hàng</h4>
            <button class="close-modal"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
            <form class="address-form">
                <div class="form-row">
                    <label class="form-label">Họ tên</label>
                    <div class="form-input">
                        <input type="text" id="fullname" class="form-control" value="Quí Đặng">
                    </div>
                </div>
                
                <div class="form-row">
                    <label class="form-label">Điện thoại di động</label>
                    <div class="form-input">
                        <input type="text" id="phone" class="form-control" value="0975688272">
                    </div>
                </div>
                
                <div class="form-row">
                    <label class="form-label">Tỉnh/Thành phố</label>
                    <div class="form-input">
                        <select id="province" class="form-select">
                            <option value="">Chọn Tỉnh/Thành phố</option>
                            <option value="HN">Hà Nội</option>
                            <option value="HCM">Hồ Chí Minh</option>
                            <option value="BD" selected>Bình Dương</option>
                            <option value="DN">Đà Nẵng</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-row">
                    <label class="form-label">Quận/Huyện</label>
                    <div class="form-input">
                        <select id="district" class="form-select">
                            <option value="">Chọn Quận/Huyện</option>
                            <option value="TD">Thủ Đức</option>
                            <option value="DA" selected>Thành phố Dĩ An</option>
                            <option value="TDM">Thành phố Thủ Dầu Một</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-row">
                    <label class="form-label">Phường/Xã</label>
                    <div class="form-input">
                        <select id="ward" class="form-select">
                            <option value="">Chọn Phường/Xã</option>
                            <option value="TB" selected>Phường Tân Bình</option>
                            <option value="DP">Phường Đông Hòa</option>
                            <option value="BD">Phường Bình Đường</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-row">
                    <label class="form-label">Địa chỉ</label>
                    <div class="form-input">
                        <textarea id="address" class="form-control">22 N3, Phường Tân Bình</textarea>
                    </div>
                </div>
                <div class="address-note">
                    Để nhận hàng thuận tiện hơn, bạn vui lòng cho Tiki biết loại địa chỉ.
                </div>
                
                <div class="form-row">
                    <label class="form-label">Loại địa chỉ</label>
                    <div class="form-input">
                        <div class="address-types">
                            <div class="address-type">
                                <input type="radio" id="home" name="addressType" checked>
                                <label for="home">Nhà riêng / Chung cư</label>
                            </div>
                            <div class="address-type">
                                <input type="radio" id="company" name="addressType">
                                <label for="company">Cơ quan / Công ty</label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="default-address">
                    <input type="checkbox" id="defaultAddress" checked>
                    <label for="defaultAddress">Sử dụng địa chỉ này làm mặc định.</label>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn-cancel">Hủy bỏ</button>
                    <button type="button" class="btn-update">Cập nhật</button>
                </div>
            </form>
        </div>
    `;

        document.body.appendChild(modal);

        // Thêm CSS cho modal
    //     const style = document.createElement('style');
    //     style.innerHTML = `
    //     .modal-backdrop {
    //         position: fixed;
    //         top: 0;
    //         left: 0;
    //         width: 100%;
    //         height: 100%;
    //         background-color: rgba(0, 0, 0, 0.5);
    //         z-index: 1050;
    //     }
        
    //     .address-modal {
    //         position: fixed;
    //         top: 50%;
    //         left: 50%;
    //         transform: translate(-50%, -50%);
    //         width: 90%;
    //         max-width: 550px;
    //         background-color: white;
    //         border-radius: 8px;
    //         z-index: 1100;
    //         max-height: 90vh;
    //         animation: modalFadeIn 0.3s ease-out;
    //     }
        
    //     .modal-header {
    //         display: flex;
    //         justify-content: space-between;
    //         align-items: center;
    //         padding: 15px 20px;
    //         border-bottom: 1px solid #f1f1f1;
    //     }
        
    //     .modal-header h4 {
    //         font-size: 18px;
    //         font-weight: 500;
    //         margin: 0;
    //     }
        
    //     .close-modal {
    //         background: none;
    //         border: none;
    //         font-size: 16px;
    //         color: #757575;
    //         cursor: pointer;
    //     }
        
    //     .modal-body {
    //         padding: 20px;
    //     }
        
    //     .form-row {
    //         display: flex;
    //         margin-bottom: 15px;
    //         align-items: center;
    //     }
        
    //     .form-label {
    //         width: 130px;
    //         font-weight: 500;
    //         margin-bottom: 0;
    //         font-size: 14px;
    //     }
        
    //     .form-input {
    //         flex: 1;
    //     }
        
    //     .form-control, .form-select {
    //         padding: 8px 12px;
    //         border: 1px solid #ddd;
    //         border-radius: 4px;
    //         font-size: 14px;
    //         width: 100%;
    //     }
        
    //     textarea.form-control {
    //         resize: vertical;
    //         min-height: 60px;
    //     }
        
    //     .address-note {
    //         padding-left: 130px;
    //         font-size: 12px;
    //         color: #757575;
    //         margin-top: 5px;
    //         margin-bottom: 15px;
    //     }
        
    //     .address-types {
    //         display: flex;
    //         gap: 20px;
    //     }
        
    //     .address-type {
    //         display: flex;
    //         align-items: center;
    //     }
        
    //     .address-type input[type="radio"] {
    //         margin-right: 8px;
    //     }
        
    //     .default-address {
    //         padding-left: 130px;
    //         display: flex;
    //         align-items: center;
    //         margin-top: 5px;
    //         margin-bottom: 15px;
    //     }
        
    //     .default-address input[type="checkbox"] {
    //         margin-right: 8px;
    //         width: 18px;
    //         height: 18px;
    //     }
        
    //     .form-actions {
    //         display: flex;
    //         justify-content: flex-end;
    //         gap: 15px;
    //         margin-top: 20px;
    //     }
        
    //     .btn-cancel {
    //         padding: 8px 20px;
    //         background-color: #f1f1f1;
    //         border: 1px solid #ddd;
    //         border-radius: 4px;
    //         font-size: 14px;
    //         cursor: pointer;
    //         min-width: 120px;
    //         text-align: center;
    //     }
        
    //     .btn-update {
    //         padding: 8px 20px;
    //         background-color: #1a94ff;
    //         color: white;
    //         border: none;
    //         border-radius: 4px;
    //         font-size: 14px;
    //         cursor: pointer;
    //         min-width: 120px;
    //         text-align: center;
    //     }
        
    //     @keyframes modalFadeIn {
    //         from {
    //             opacity: 0;
    //             transform: translate(-50%, -60%);
    //         }
    //         to {
    //             opacity: 1;
    //             transform: translate(-50%, -50%);
    //         }
    //     }
        
    //     @media (max-width: 600px) {
    //         .form-row {
    //             flex-direction: column;
    //             align-items: flex-start;
    //         }
            
    //         .form-label {
    //             width: 100%;
    //             margin-bottom: 5px;
    //         }
            
    //         .form-input {
    //             width: 100%;
    //         }
            
    //         .address-note, .default-address {
    //             padding-left: 0;
    //         }
            
    //         .address-types {
    //             flex-direction: column;
    //             gap: 10px;
    //         }
            
    //         .form-actions {
    //             flex-direction: column;
    //         }
            
    //         .btn-cancel, .btn-update {
    //             width: 100%;
    //         }
    //     }
    // `;
    //     document.head.appendChild(style);

        // Xử lý đóng modal
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', function () {
            document.body.removeChild(backdrop);
            document.body.removeChild(modal);
            document.head.removeChild(style);
        });

        backdrop.addEventListener('click', function () {
            document.body.removeChild(backdrop);
            document.body.removeChild(modal);
            document.head.removeChild(style);
        });

        // Xử lý nút Hủy bỏ
        const cancelBtn = modal.querySelector('.btn-cancel');
        cancelBtn.addEventListener('click', function () {
            document.body.removeChild(backdrop);
            document.body.removeChild(modal);
            document.head.removeChild(style);
        });

        // Xử lý nút Cập nhật
        const updateBtn = modal.querySelector('.btn-update');
        updateBtn.addEventListener('click', function () {
            // Lấy dữ liệu từ form
            const fullname = modal.querySelector('#fullname').value;
            const phone = modal.querySelector('#phone').value;
            const province = modal.querySelector('#province option:checked').text;
            const district = modal.querySelector('#district option:checked').text;
            const ward = modal.querySelector('#ward option:checked').text;
            const address = modal.querySelector('#address').value;
            const isDefault = modal.querySelector('#defaultAddress').checked;
            const addressType = modal.querySelector('input[name="addressType"]:checked').id === 'home' ?
                'Nhà' : 'Công ty';

            // Cập nhật địa chỉ trên trang giỏ hàng (nếu các phần tử này tồn tại)
            const customerNameEl = document.querySelector('.customer-name');
            const customerPhoneEl = document.querySelector('.customer-phone');
            const deliveryAddressTextEl = document.querySelector('.delivery-address-text');
            const addressTagEl = document.querySelector('.address-tag');

            if (customerNameEl) customerNameEl.textContent = fullname;
            if (customerPhoneEl) customerPhoneEl.textContent = phone;
            if (deliveryAddressTextEl) deliveryAddressTextEl.textContent =
                `${address}, ${ward}, ${district}, ${province}`;
            if (addressTagEl) addressTagEl.textContent = addressType;

            // Đóng modal
            document.body.removeChild(backdrop);
            document.body.removeChild(modal);
            document.head.removeChild(style);
        });
    }
});