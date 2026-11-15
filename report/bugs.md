# Báo Cáo Lỗi Tự Động Hóa HW04 (Bug Report)

- **Sinh viên thực hiện:** Bửu Huỳnh Vĩnh Phúc (`23120328`)
- **Repo Issues chung của nhóm:** https://github.com/kqanGit/eshop-sut/issues
- **Quy ước log Issue HW04:** Tiêu đề `[FR-xx] Mô tả ngắn`, gắn nhãn `Phúc`, `FR-xx`, `HW04`, đính kèm screenshot từ lần chạy Playwright và dẫn link tới Issue cũ ở HW02 (nếu đã có).

---

## Tổng Hợp Lỗi Tái Hiện Qua Playwright (3/3 Browser: Chromium, Firefox, WebKit)

| STT | Feature | Test Case ID (HW04) | Mô tả lỗi | Issue HW02 | Screenshot bằng chứng (Chromium run) |
| :---: | :---: | :--- | :--- | :---: | :--- |
| 1 | FR-06 | `TC-FR06-DT-09` | Trang chi tiết sản phẩm không hiển thị trường **Danh mục** dù đặc tả FR-06 yêu cầu | `#20` | [FR06_detail_missing_category_min_firstclick.png](./screenshots/FR06_detail_missing_category_min_firstclick.png) |
| 2 | FR-06 | `TC-FR06-AT-06` | Ô nhập `Số lượng` thiếu thuộc tính `min="1"`, không chặn biên dưới | `#18` | [FR06_detail_missing_category_min_firstclick.png](./screenshots/FR06_detail_missing_category_min_firstclick.png) |
| 3 | FR-06 | `TC-FR06-DT-11`, `TC-FR06-DT-01` | Nút `"Thêm vào giỏ hàng"` bỏ qua lần click đầu tiên (`clickCount === 0`), không đổi trạng thái `"Đã thêm"` và không thêm sản phẩm vào giỏ | `#19` | [FR06_DT01_cart_empty_after_first_click.png](./screenshots/FR06_DT01_cart_empty_after_first_click.png) |
| 4 | FR-08 | `TC-FR08-DT-06` | Ô `"Tổng tiền thanh toán (VND)"` trên `/checkout` là `<input type="number">` cho phép người dùng tự ý chỉnh sửa | `#33` | [FR08_DT06_editable_total_input.png](./screenshots/FR08_DT06_editable_total_input.png) |
| 5 | FR-08 | `TC-FR08-DT-11` | Sau khi thanh toán thành công, giỏ hàng không được xóa trống (quên gọi `clearCart()`) | `#36` | [FR08_DT11_cart_not_cleared.png](./screenshots/FR08_DT11_cart_not_cleared.png) |
| 6 | FR-08 | `TC-FR08-DT-07` | Khi sửa tổng tiền trên UI thành `1000`, backend `POST /api/checkout` không tự tính lại mà lưu thẳng đơn `1000 ₫` | `#34` | [FR08_DT07_tampered_total_accepted.png](./screenshots/FR08_DT07_tampered_total_accepted.png) |
| 7 | FR-15 | `TC-FR15-DT-07` | Admin cho phép tạo sản phẩm khi bỏ trống ô `"Giá tiền"` | *(Mở mới `HW04`)* | [FR15_DT07_empty_price_accepted.png](./screenshots/FR15_DT07_empty_price_accepted.png) |
| 8 | FR-15 | `TC-FR15-DT-05` | Admin cho phép tạo sản phẩm với giá bằng `0 ₫` | `#24` | [FR15_DT05_zero_price_accepted.png](./screenshots/FR15_DT05_zero_price_accepted.png) |
| 9 | FR-15 | `TC-FR15-BVA-10` | Admin cho phép tạo sản phẩm với giá âm `-1 ₫` | `#24` | [FR15_BVA10_negative_price_accepted.png](./screenshots/FR15_BVA10_negative_price_accepted.png) |
| 10 | FR-15 | `TC-FR15-DT-04` | Ô `"Tên sản phẩm"` không giới hạn 255 ký tự, cho phép tạo tên 256 ký tự | `#25` | [FR15_DT04_256char_name_accepted.png](./screenshots/FR15_DT04_256char_name_accepted.png) |
| 11 | FR-15 | `TC-FR15-DT-08` | Sửa tên một sản phẩm làm toàn bộ các sản phẩm khác trên bảng Admin bị đổi tên theo (`fakeMassUpdatedProducts`) | `#23` | [FR15_DT08_edit_mass_update_all_rows.png](./screenshots/FR15_DT08_edit_mass_update_all_rows.png) |

---

## Chi Tiết & Mẫu Nội Dung Mở GitHub Issues (Nhãn `HW04`)

> **Lưu ý khi nộp:** Mở các issue mới trên `kqanGit/eshop-sut` gắn nhãn `Phúc`, `FR-xx`, `HW04`, đính kèm ảnh tương ứng trong `report/screenshots/`, dẫn link sang issue HW02 cũ, và chụp ảnh trang danh sách Issues sau khi tạo xong.

### 1. `[FR-06] Thiếu hiển thị Danh mục trên trang chi tiết sản phẩm`
- **Test Case:** `TC-FR06-DT-09` (Failed trên Chromium, Firefox, WebKit)
- **Liên kết HW02:** https://github.com/kqanGit/eshop-sut/issues/20
- **Mô tả:** Tại `/product/1`, Playwright tìm `getByText('Điện thoại', { exact: true })` không thấy nhãn Danh mục nào được render.
- **Screenshot:** `report/screenshots/FR06_detail_missing_category_min_firstclick.png`

### 2. `[FR-06] Ô Số lượng thiếu min="1" và nút Thêm vào giỏ hàng bỏ qua lần click đầu tiên`
- **Test Case:** `TC-FR06-AT-06`, `TC-FR06-DT-11`, `TC-FR06-DT-01` (Failed trên Chromium, Firefox, WebKit)
- **Liên kết HW02:** https://github.com/kqanGit/eshop-sut/issues/18, https://github.com/kqanGit/eshop-sut/issues/19
- **Mô tả:** `<input type="number">` không có thuộc tính `min="1"`. Bấm `"Thêm vào giỏ hàng"` lần 1 không đổi nút sang `"Đã thêm"` và vào `/cart` giỏ vẫn trống.
- **Screenshot:** `report/screenshots/FR06_DT01_cart_empty_after_first_click.png`

### 3. `[FR-08] Ô Tổng tiền thanh toán trên UI cho phép chỉnh sửa và Backend lưu thẳng giá trị giả mạo 1000`
- **Test Case:** `TC-FR08-DT-06`, `TC-FR08-DT-07` (Failed trên Chromium, Firefox, WebKit)
- **Liên kết HW02:** https://github.com/kqanGit/eshop-sut/issues/33, https://github.com/kqanGit/eshop-sut/issues/34
- **Mô tả:** Trên `/checkout`, ô tổng tiền là `<input type="number">` editable; khi sửa thành `1000` và bấm thanh toán, API `GET /api/orders/my-orders` ghi nhận đơn hàng mới có `total_amount = 1000` thay vì `30000000`.
- **Screenshot:** `report/screenshots/FR08_DT06_editable_total_input.png`, `report/screenshots/FR08_DT07_tampered_total_accepted.png`

### 4. `[FR-08] Giỏ hàng không được xóa trống sau khi thanh toán thành công`
- **Test Case:** `TC-FR08-DT-11` (Failed trên Chromium, Firefox, WebKit)
- **Liên kết HW02:** https://github.com/kqanGit/eshop-sut/issues/36
- **Mô tả:** Sau khi thấy `"Thanh toán thành công!"`, bấm link `"Giỏ hàng"` vẫn còn sản phẩm, không hiện `"Giỏ hàng của bạn đang trống"`.
- **Screenshot:** `report/screenshots/FR08_DT11_cart_not_cleared.png`

### 5. `[FR-15] Form sản phẩm Admin chấp nhận giá rỗng, giá = 0, giá âm (-1) và tên 256 ký tự`
- **Test Case:** `TC-FR15-DT-07`, `TC-FR15-DT-05`, `TC-FR15-BVA-10`, `TC-FR15-DT-04` (Failed trên Chromium, Firefox, WebKit)
- **Liên kết HW02:** https://github.com/kqanGit/eshop-sut/issues/24, https://github.com/kqanGit/eshop-sut/issues/25
- **Mô tả:** Khi thêm sản phẩm với giá rỗng/`0`/`-1` hoặc tên 256 ký tự, hệ thống không chặn và `GET /api/products` trả về 6 sản phẩm (thêm thành công bản ghi không hợp lệ).
- **Screenshot:** `report/screenshots/FR15_DT07_empty_price_accepted.png`, `report/screenshots/FR15_DT05_zero_price_accepted.png`, `report/screenshots/FR15_BVA10_negative_price_accepted.png`, `report/screenshots/FR15_DT04_256char_name_accepted.png`

### 6. `[FR-15] Sửa tên một sản phẩm làm đổi tên hàng loạt các sản phẩm khác trên bảng Admin`
- **Test Case:** `TC-FR15-DT-08` (Failed trên Chromium, Firefox, WebKit)
- **Liên kết HW02:** https://github.com/kqanGit/eshop-sut/issues/23
- **Mô tả:** Sau khi sửa sản phẩm test thành `"SP Test Đã Đổi Tên"` và bấm `"Lưu sản phẩm"`, toàn bộ các dòng trong bảng (bao gồm `"iPhone 15 Pro Max"`) đều bị đổi tên theo trên UI.
- **Screenshot:** `report/screenshots/FR15_DT08_edit_mass_update_all_rows.png`
