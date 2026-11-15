---
name: eshop-playwright-tester
description: Quy trình 7 bước AI-first để thiết kế, sinh script Playwright data-driven (JavaScript), chạy cross-browser (Chromium, Firefox, WebKit) và review lỗi cho hệ thống EShop SUT.
---

# EShop Playwright Automation Tester Skill

Skill này đóng gói quy trình 7 bước AI-first và các lưu ý kỹ thuật đặc thù của EShop SUT (tích lũy sau khi hoàn thành `FR-06`) để áp dụng cho các feature tiếp theo (`FR-08`, `FR-15`).

## 1. Quy trình 7 bước bắt buộc cho mỗi Feature

Không dùng 1 prompt duy nhất để sinh toàn bộ script. Thực hiện tuần tự 7 bước và ghi lại prompt + output vào `ai/audit-report.md`:

1. **Chọn 12 test case:** Đối chiếu đặc tả SRS và bộ test case HW02; chọn 12 case tự động hóa được (đặt `AT-xx` cho ca bổ sung mới), liệt kê các case bị loại kèm lý do.
2. **Khảo sát giao diện & Locator:** Đọc mã nguồn `.jsx` của trang mục tiêu để xác định locator chính xác; kiểm tra lại bằng `npx playwright codegen`.
3. **Thiết kế file dữ liệu (`data/FR-xx.json`):** Tách toàn bộ test data ra JSON riêng (tuyệt đối không hardcode mảng trong `.spec.js`). Trường `expected` phải bám **đặc tả SRS**, không viết theo bug hiện tại của app.
4. **Sinh khung script (`tests/FR-xx.spec.js`):** Đọc dữ liệu từ `data/FR-xx.json`, gắn `attachRunBy(testInfo)` và hàm dọn dữ liệu trong `beforeEach`/`afterEach`, chạy thử trên Chromium trước khi thêm assertion chi tiết.
5. **Thêm assertion (≥ 3 kiểu):** Rẽ nhánh assertion theo `c.expected`, sử dụng ít nhất 3 kiểu khác nhau (URL, hiển thị, nội dung, số lượng, `toHaveValue`, `toHaveAttribute`, `dialog`, trạng thái dữ liệu qua API).
6. **Chạy 3 trình duyệt & Phân loại lỗi:** Chạy `chromium`, `firefox`, `webkit`. Nếu fail do script sai (locator, chờ, state) thì sửa script; nếu fail do bug thật của EShop thì **giữ nguyên assertion đỏ** để làm bằng chứng log bug.
7. **Review & Ghi bảng lỗi AI:** Đọc lại toàn bộ `.spec.js` và ghi vào báo cáo bảng *"AI sai gì / thiếu gì / vì sao / đã sửa thế nào"*.

---

## 2. Các bẫy đặc thù của EShop SUT cần tránh

| Bẫy EShop | Nguyên nhân trong code | Cách xử lý chuẩn trong Playwright |
| :--- | :--- | :--- |
| **Mất giỏ hàng khi `page.goto()`** | Giỏ hàng chỉ nằm trong React state (`CartContext`), không lưu `localStorage` | Chỉ `goto('/')` hoặc `/login` lúc đầu; điều hướng sang `/cart` bằng `getByRole('link', { name: 'Giỏ hàng' })`, về trang chủ bằng logo `EShop` |
| **Nhãn form Đăng nhập bất thường** | Trang `/login` dùng `<h2>Đăng Ký</h2>`, label `"Username"`, nút `"Sign In"` | Dùng helper `loginWebUser(page)` khớp đúng UI đang hiển thị |
| **Input không có `id` / `for`** | Form tối giản, `<label>` đứng ngay trước `<input>` | Web: `page.locator('label:has-text("...") + input')`; Admin: `getByPlaceholder(...)` |
| **Khớp nhầm chuỗi con (`getByText`)** | Từ khóa ngắn (vd `"Điện thoại"`) xuất hiện trong câu mô tả sản phẩm | Luôn truyền `{ exact: true }` khi kiểm tra nhãn/danh mục/tab |
| **Nhiều nút `Sửa` / `Xóa` trùng tên** | Mỗi dòng `<tr>` đều có nút giống nhau | Khoanh vùng theo dòng: `page.locator('tbody tr', { hasText: name })` |
| **Ghép text cột bảng gây trùng tiền tố (`#1` vs `#11`)** | `tr` nối liền `<td>#1</td><td>15/11/2026</td>` thành `#115/11/...` | Dùng `filter({ has: page.getByText('#11', { exact: true }) })` thay vì `hasText` |
| **Hộp thoại `alert()` chặn luồng** | Checkout, Profile, Admin dùng `window.alert()` | Đăng ký `page.once('dialog', ...)` **trước** khi bấm nút submit, lưu `dialog.message()` rồi `accept()` |
| **HTML5 `required` không hiện text lỗi trong DOM** | Trình duyệt chặn submit bằng validation bubble riêng | Kiểm tra `await input.evaluate(el => el.validity.valueMissing)` là `true` và URL/số dòng không đổi |
| **Ô `type="number"` không nhận chữ** | Playwright `fill('abc')` báo lỗi ngay | Đưa TC nhập chữ vào ô số vào mục không tự động hóa kèm lý do |
| **Format tiền tệ phụ thuộc locale** | Dùng `.toLocaleString()` | Cấu hình `locale: 'vi-VN'` và dùng `parseMoney(text)` để so sánh giá trị số |
| **Dữ liệu tồn đọng giữa các trình duyệt** | 3 browser chạy tuần tự trên cùng SQLite | Gọi `cleanupTestProducts(request)` trong `beforeEach` (`id > 5`). Với bảng `orders` (không có API xóa), chỉ assert trên đơn mới nhất từ `GET /api/orders/my-orders` |
| **Lần click đầu không ăn ở ProductDetail** | `clickCount === 0` bị bỏ qua có chủ đích | Không bấm 2 lần để "lách"; giữ 1 click cho test fail đúng bug |
| **Admin chạy ở cổng 5174** | Frontend Admin tách riêng cổng `5174` | Dùng URL đầy đủ `http://localhost:5174` qua helper `loginAdmin(page, tabName)` |
