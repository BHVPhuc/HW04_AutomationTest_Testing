# AI Audit Report — HW04 Automation Testing

- **Sinh viên:** Bửu Huỳnh Vĩnh Phúc (`23120328`)
- **Công cụ AI sử dụng:** Google Antigravity IDE
- **Ngày thực hiện:** `2026-11-16`
- **Nguyên tắc tuân thủ:** Thực hiện tuần tự 7 bước cho mỗi feature (không dùng 1 prompt viết trọn file spec), tự đối chiếu với đặc tả SRS và mã nguồn EShop SUT, và lưu đầy đủ từng prompt cùng đầu ra thực tế.

---

## Phần I. Nhật Ký 7 Bước Cho Feature A — `FR-06` (Chi tiết sản phẩm)

### Bước 1 — Chọn 12 test case
- **Thời gian:** `2026-11-16 00:26 +07:00`
- **Prompt:** *"Đối chiếu bảng 12 test case gợi ý cho FR-06, FR-08, FR-15 trong tài liệu hướng dẫn HW04 với bộ test case HW02 của tôi (`work_HW02/reports/`). Cho biết dòng nào khớp ID HW02, dòng nào là mới (`AT-xx`) và liệt kê các test case HW02 chưa tự động hóa kèm lý do."*
- **Output:** Đã đối chiếu 22 TC HW02 của FR-06 sang 12 TC mục tiêu (`TC-FR06-AT-01..07`, `TC-FR06-BVA-10`, `TC-FR06-DT-09`, `TC-FR06-DT-11`, `TC-FR06-DT-01`, `TC-FR06-DT-02`); loại `TC-FR06-DT-06` (input `type="number"` không nhận chữ `"abc"` qua `fill()`) và 9 ca biên/ID phụ để giữ đúng 12 ca đại diện.

### Bước 2 — Khảo sát giao diện & Locator
- **Thời gian:** `2026-11-16 01:03 +07:00`
- **Prompt:** *"Đọc `ProductDetail.jsx`, `Home.jsx`, `Cart.jsx` và `backend/database.js` để trích xuất dữ liệu 5 sản phẩm seed và xác định locator chính xác cho trang chi tiết sản phẩm."*
- **Output:** Xác nhận `<input type="number">` không có `id` hay `for` nên dùng `label:has-text("Số lượng:") + input`; nút thêm giỏ hàng đổi nhãn giữa `"Thêm vào giỏ hàng"` và `"Đã thêm"`; điều hướng sang giỏ hàng phải bấm link `"Giỏ hàng"` trên header để không làm mất React state.

### Bước 3 — Thiết kế file dữ liệu JSON
- **Thời gian:** `2026-11-16 01:06 +07:00`
- **Prompt:** *"Tạo `data/FR-06.json` gồm đúng 12 dòng theo cấu trúc data-driven, lấy thông số 5 sản phẩm seed từ `database.js` và đặt `expected` theo đúng đặc tả SRS (không theo bug hiện tại)."*
- **Output:** Đã tạo [data/FR-06.json](../data/FR-06.json) với 12 đối tượng phân nhánh theo `expected` (`product-detail`, `category-visible`, `default-quantity`, `quantity-min-attr`, `added-feedback`, `cart-updated`, `cart-empty`, `navigate-from-home`).

### Bước 4 — Sinh khung script & Chạy thử Chromium
- **Thời gian:** `2026-11-16 01:06 +07:00`
- **Prompt:** *"Viết khung `tests/FR-06.spec.js` đọc dữ liệu từ `data/FR-06.json`, gắn `attachRunBy(testInfo)` trong `beforeEach`, điều hướng và thao tác cơ bản trước khi thêm assertion chi tiết, chạy thử trên Chromium."*
- **Output:** Commit `710c774`, chạy 12/12 ca khung trên Chromium pass (8.9s), xác nhận locator và luồng điều hướng hoạt động ổn định.

### Bước 5 — Thêm assertion (≥ 3 kiểu)
- **Thời gian:** `2026-11-16 01:07 +07:00`
- **Prompt:** *"Bổ sung assertion cho từng nhánh `expected` trong `tests/FR-06.spec.js` dùng nhiều kiểu kiểm tra: `toHaveURL`, `toHaveText`, `toBeVisible`, `toHaveAttribute`, `toHaveValue`, `toHaveCount` và `parseMoney`, sau đó chạy lại trên Chromium."*
- **Output:** Commit `4dff596`. Kết quả chạy đầu tiên: 9 passed, 3 failed. Phát hiện `TC-FR06-DT-09` **Pass giả**.

### Bước 6 & 7 — Chạy 3 trình duyệt, Review & Sửa lỗi AI
- **Thời gian:** `2026-11-16 01:07 – 01:09 +07:00`
- **Prompt:** *"Rà soát lại `tests/FR-06.spec.js`: tại sao `TC-FR06-DT-09` kiểm tra Danh mục lại Pass dù `ProductDetail.jsx` không render Danh mục? Sửa selector và chạy lại trên Chromium, Firefox, WebKit."*
- **Output:** Nguyên nhân do `page.getByText('Điện thoại')` khớp nhầm mô tả `"Điện thoại cao cấp của Apple"`. Sửa sang `{ exact: true }`, khoanh vùng `main img`, gom biến `qtyInput` (commit `1cff5f3`). Chạy lại cả 3 browser: **8 passed, 4 failed** đồng nhất trên Chromium, Firefox, WebKit.

---

## Phần II. Đóng Gói Agent Skill Sau Feature Đầu Tiên

- **Thời gian:** `2026-11-16 01:10 +07:00`
- **Prompt:** *"Đóng gói quy trình 7 bước và toàn bộ các bẫy của EShop SUT (mất state giỏ hàng, nhãn form login, input không có id/for, khớp nhầm chuỗi con, dọn dữ liệu API) thành `skills/eshop-playwright-tester/SKILL.md` để tái sử dụng cho FR-08 và FR-15."*
- **Output:** Tạo [skills/eshop-playwright-tester/SKILL.md](../skills/eshop-playwright-tester/SKILL.md) (commit `291979c`), sau đó bổ sung thêm bẫy ghép chuỗi cột bảng (`#1` vs `#11`) phát hiện khi chạy `FR-08`.

---

## Phần III. Nhật Ký 7 Bước Cho Feature B — `FR-08` (Thanh toán / Checkout)

### Bước 1–2 — Chọn 12 TC & Khảo sát `Checkout.jsx`, `Cart.jsx`, `Profile.jsx`
- **Thời gian:** `2026-11-16 01:04 – 01:10 +07:00`
- **Prompt:** *"Áp dụng skill `eshop-playwright-tester` cho `FR-08`: đối chiếu 12 TC gợi ý với HW02, khảo sát `Checkout.jsx` và `Profile.jsx` để xác định locator ô tổng tiền, danh sách `li`, thông báo thành công và bảng lịch sử đơn hàng."*
- **Output:** Xác định `label:has-text("Tổng tiền thanh toán") + input`, nút `"Xác Nhận Thanh Toán"`, bảng đơn hàng `/profile` lấy ID đơn mới nhất qua `GET /api/orders/my-orders` (do không có API xóa `orders`).

### Bước 3–4 — Thiết kế `data/FR-08.json` & Khung `tests/FR-08.spec.js`
- **Thời gian:** `2026-11-16 01:10 +07:00`
- **Prompt:** *"Tạo `data/FR-08.json` cho 12 ca (gồm cả `editTotalTo: "1000"` cho `TC-FR08-DT-07`) và khung `tests/FR-08.spec.js` dùng helper `loginWebUser`, `addProductFromHome`, không dùng `goto('/cart')`, chạy thử trên Chromium."*
- **Output:** Commit `a9dc893`, khung chạy 12/12 pass trên Chromium (8.1s).

### Bước 5 — Thêm assertion
- **Thời gian:** `2026-11-16 01:11 +07:00`
- **Prompt:** *"Thêm assertion cho `tests/FR-08.spec.js` (bắt `dialog` chưa đăng nhập, `toHaveCount`, `parseMoney`, `not.toBeEditable()`, kiểm tra giỏ trống sau checkout, và đối chiếu đơn mới nhất trên `/profile` + API)."*
- **Output:** Commit `caf35c1`. Chạy Chromium được 9 passed, 3 failed (`DT-06`, `DT-11`, `DT-07`).

### Bước 6 & 7 — Chạy 3 trình duyệt, Review & Sửa lỗi locator bảng `#1` vs `#11`
- **Thời gian:** `2026-11-16 01:11 – 01:15 +07:00`
- **Prompt:** *"Kiểm tra lỗi strict mode violation ở `TC-FR08-AT-04` khi số đơn hàng tăng lên `#11`, đồng thời tối ưu `waitForEvent('dialog')` và gom helper lấy đơn mới nhất, sau đó chạy lại đủ 3 trình duyệt."*
- **Output:** Commit `f8a4dae` & `3f7adaa`. Phát hiện khi số đơn là `#11`, dòng đơn `#1` có `<td>#1</td><td>15/11/2026</td>` ghép chuỗi thành `#115/11/2026`, khiến `hasText: '#11'` khớp 2 dòng. Sửa sang `filter({ has: page.getByText(\`#${latestOrder.id}\`, { exact: true }) })`; chạy lại cả 3 browser ổn định: **9 passed, 3 failed** trên cả Chromium, Firefox, WebKit.

---

## Phần IV. Nhật Ký 7 Bước Cho Feature C — `FR-15` (Quản lý sản phẩm CRUD - Admin)

### Bước 1–2 — Chọn 12 TC & Khảo sát Admin `App.jsx`
- **Thời gian:** `2026-11-16 01:04 – 01:15 +07:00`
- **Prompt:** *"Áp dụng skill `eshop-playwright-tester` cho `FR-15`: đọc `frontend-admin/src/App.jsx` (phần tab Sản phẩm) và `backend/server.js` để xác định placeholder, select danh mục, alert cập nhật và API dọn sản phẩm `id > 5`."*
- **Output:** Xác nhận các placeholder `"Tên sản phẩm"`, `"Giá tiền"`, `"URL Ảnh"`, `"Mô tả"`, `form select`, nút `"Lưu sản phẩm"`, bảng hiển thị `{p.price} ₫`, và `alert("Cập nhật thành công!")` khi sửa.

### Bước 3–4 — Thiết kế `data/FR-15.json` & Khung `tests/FR-15.spec.js`
- **Thời gian:** `2026-11-16 01:16 +07:00`
- **Prompt:** *"Tạo `data/FR-15.json` (dùng `nameLength: 255` và `256` để sinh `'A'.repeat(n)` trong script) và khung `tests/FR-15.spec.js` có `cleanupTestProducts(request)` trong `beforeEach`/`afterAll`, chạy thử Chromium."*
- **Output:** Commit `0aea1c6`, khung chạy 12/12 pass trên Chromium (7.8s).

### Bước 5–7 — Thêm assertion, Chạy 3 trình duyệt & Review bất đồng bộ `POST` + `fetchData()`
- **Thời gian:** `2026-11-16 01:16 – 01:24 +07:00`
- **Prompt:** *"Thêm assertion cho tất cả 12 ca `FR-15` (gồm `validity.valueMissing`, `toHaveValue`, `toHaveCount`, `waitForEvent('dialog')`, kiểm tra API `/api/products`), sau đó review cơ chế chờ sau `POST` khi test các ca `create-rejected` và chạy toàn bộ 9 lượt bằng `node run-all.js`."*
- **Output:** Commit `b1444c1` & `e3f2795`. Đảm bảo đợi `POST /api/products` + lượt `GET /api/products` refresh hoàn tất trước khi assert count (tránh `toHaveCount(5)` pass sớm tại `t=0`). Kết quả `node run-all.js` đồng nhất trên cả 3 browser: **7 passed, 5 failed** (`DT-07`, `DT-05`, `BVA-10`, `DT-04`, `DT-08`).
