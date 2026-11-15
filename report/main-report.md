# Báo Cáo Kiểm Thử Tự Động HW04 — AI-Assisted Playwright Testing (EShop SUT)

- **Sinh viên thực hiện:** Bửu Huỳnh Vĩnh Phúc — MSSV: `23120328`
- **Môn học:** Kiểm thử phần mềm (Software Testing) — HK1, Năm học 2026–2027
- **Phạm vi phân công (Nhóm 09):** `FR-06` (Chi tiết sản phẩm), `FR-08` (Thanh toán / Checkout), `FR-15` (Quản lý sản phẩm CRUD - Admin)
- **Công cụ:** Playwright `1.65.1` (JavaScript), Chromium / Firefox / WebKit, `locale: 'vi-VN'`, `workers: 1`, `retries: 0`

---

## 1. Quy Trình AI-First & Kiến Trúc Automation

### 1.1. Kiến trúc Data-Driven
Toàn bộ 36 ca kiểm thử (12 ca/feature) được tách dữ liệu hoàn toàn ra 3 file JSON trong `data/` (`FR-06.json`, `FR-08.json`, `FR-15.json`); các file `tests/FR-xx.spec.js` đọc dữ liệu từ JSON và rẽ nhánh thực thi theo trường `expected` (viết theo **đặc tả SRS**, không chỉnh assertion cho pass theo lỗi của EShop).

- **Cấu hình chung ([playwright.config.js](../playwright.config.js)):** Gắn `metadata: { 'Run by': '23120328', 'Started at': STAMP }`, bật `screenshot: 'only-on-failure'`, `trace: 'retain-on-failure'`, chạy trên 3 project `chromium`, `firefox`, `webkit`.
- **Annotation từng test ([helpers/common.js](../helpers/common.js)):** `attachRunBy(testInfo)` đẩy annotation `Run by: 23120328 @ <ISO timestamp>` vào mỗi test case để hiển thị trực tiếp trong từng HTML report.
- **Chạy 9 lượt tự động ([run-all.js](../run-all.js)):** Sinh đủ 9 thư mục report trong `reports/FR-{06,08,15}-{chromium,firefox,webkit}`.

### 1.2. Tổng hợp kết quả chạy 9 lượt (Cross-Browser Summary)

| Feature | Số TC | Chromium (Pass / Fail) | Firefox (Pass / Fail) | WebKit (Pass / Fail) | Tổng lượt chạy (Pass / Fail) | Kiểu Assertion sử dụng (≥ 3) |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **FR-06** Chi tiết sản phẩm | 12 | 8 / 4 | 8 / 4 | 8 / 4 | 24 / 12 (36 lượt) | URL (`toHaveURL`), Hiển thị (`toBeVisible`), Nội dung (`toHaveText`), Thuộc tính (`toHaveAttribute`), Giá trị ô nhập (`toHaveValue`), Số lượng dòng (`toHaveCount`), Giá số (`parseMoney`) |
| **FR-08** Thanh toán / Checkout | 12 | 9 / 3 | 9 / 3 | 9 / 3 | 27 / 9 (36 lượt) | Dialog (`waitForEvent('dialog')`), URL (`toHaveURL`), Hiển thị (`toBeVisible`), Số lượng (`toHaveCount`), Trạng thái khả sửa (`not.toBeEditable`), Nội dung (`toHaveText`), Trạng thái dữ liệu API (`GET /api/orders/my-orders`) |
| **FR-15** Quản lý SP CRUD | 12 | 7 / 5 | 7 / 5 | 7 / 5 | 21 / 15 (36 lượt) | Số lượng dòng (`toHaveCount`), Hiển thị (`toBeVisible`), Nội dung (`toHaveText`), Giá trị ô nhập (`toHaveValue`), HTML5 validity (`validity.valueMissing`), Dialog (`waitForEvent('dialog')`), Trạng thái dữ liệu API (`GET /api/products`) |
| **Tổng cộng** | **36** | **24 / 12** | **24 / 12** | **24 / 12** | **72 / 36 (108 lượt)** | **7+ kiểu assertion** |

---

## 2. Chi Tiết Kết Quả Từng Feature

### 2.1. FR-06 — Chi tiết sản phẩm (`/product/:id`)

#### Ánh xạ Test Cases (12 TC)
| ID HW04 | ID HW02 gốc | Mô tả | Kết quả (3 browsers) | Ghi chú / Bug |
| :--- | :--- | :--- | :---: | :--- |
| `TC-FR06-AT-01` | Mới *(từ BVA-01/DT-01)* | Hiển thị chi tiết SP `id=1` (`h1`, giá, mô tả, `alt`) | **Passed** | Đủ 4 trường checked |
| `TC-FR06-AT-02` | Mới | Hiển thị chi tiết SP `id=2` | **Passed** | |
| `TC-FR06-AT-03` | Mới | Hiển thị chi tiết SP `id=3` | **Passed** | |
| `TC-FR06-AT-04` | Mới | Hiển thị chi tiết SP `id=4` | **Passed** | |
| `TC-FR06-BVA-10` | `TC-FR06-BVA-10` | Hiển thị chi tiết SP `id=5` (Keychron Q1) | **Passed** | Biên trên danh sách seed |
| `TC-FR06-DT-09` | `TC-FR06-DT-09` | Hiển thị tên Danh mục trên trang chi tiết | **Failed** | Thiếu trường Danh mục (HW02 `#20`) |
| `TC-FR06-AT-05` | Mới *(từ BVA-01)* | Ô Số lượng mặc định là `"1"` | **Passed** | |
| `TC-FR06-AT-06` | Mới *(liên quan DT-02)* | Ô Số lượng có thuộc tính `min="1"` | **Failed** | Input thiếu `min="1"` (HW02 `#18`) |
| `TC-FR06-DT-11` | `TC-FR06-DT-11` | Bấm "Thêm vào giỏ hàng" 1 lần đổi thành `"Đã thêm"` | **Failed** | Bỏ qua click đầu tiên (HW02 `#19`) |
| `TC-FR06-DT-01` | `TC-FR06-DT-01` / `BVA-03` | Số lượng `2`, bấm 1 lần, vào giỏ có 1 dòng SL `2` | **Failed** | Giỏ trống vì click đầu bị bỏ qua (HW02 `#19`) |
| `TC-FR06-DT-02` | `TC-FR06-DT-02` / `BVA-02` | Số lượng `0`, bấm 1 lần, vào giỏ phải trống | **Passed*** | **Pass sai lý do:** do click đầu bị nuốt (`clickCount === 0`), không phải vì app chặn `quantity = 0` |
| `TC-FR06-AT-07` | Mới | Từ trang chủ bấm `"Xem chi tiết"` tới `/product/1` | **Passed** | |

#### Review Lỗi AI — FR-06
| AI sai / thiếu gì | Biểu hiện trong code ban đầu | Vì sao AI mắc lỗi | Đã sửa thế nào |
| :--- | :--- | :--- | :--- |
| Khớp nhầm chuỗi con khi kiểm tra Danh mục | Dùng `page.getByText(c.category)` không có `{ exact: true }` ở commit `4dff596` | Mô tả của iPhone 15 Pro Max là `"Điện thoại cao cấp của Apple"` chứa chuỗi con `"Điện thoại"`, khiến `TC-FR06-DT-09` **Pass giả** | Đổi sang `page.getByText(c.category, { exact: true })` (commit `1cff5f3`) để bắt đúng lỗi thiếu Danh mục |
| Dùng selector `img` quá rộng & lặp locator `qtyInput` | Ban đầu dùng `page.locator('img')` và lặp lại `label:has-text("Số lượng:") + input` ở 4 nhánh | Chưa khoanh vùng trong `main` và chưa tách biến dùng chung | Khoanh `page.locator('main img')` và khai báo `qtyInput` một lần dùng chung |
| Không nhận ra Pass giả ở `TC-FR06-DT-02` | Tự động đánh giá test xanh là chức năng chặn `0` hoạt động đúng | AI chỉ nhìn kết quả Pass mà không đối chiếu logic `clickCount === 0` trong `ProductDetail.jsx` | Giữ test chạy 1 click theo đúng đặc tả và ghi rõ cảnh báo **"Pass sai lý do"** vào báo cáo |

#### Test Cases HW02 Chưa Tự Động Hóa — FR-06
- `TC-FR06-DT-06` (`quantity = "abc"`): Thẻ `<input type="number">` không cho phép `fill('abc')` trong Playwright (ném lỗi trước khi submit).
- `TC-FR06-DT-03`, `DT-04`, `DT-05`, `BVA-04`..`09`, `BVA-11`, `DT-07`, `DT-08`, `DT-10`: Các ca số âm/thập phân/cực đại, ID ngoài biên (`0`, `6`, `9999`, `abc`) và Breadcrumb (`#21`) được giữ ở mức thiết kế/kiểm thử tay HW02 để tập trung đúng 12 ca đại diện theo bộ khung HW04.

---

### 2.2. FR-08 — Thanh toán / Checkout (`/checkout`)

#### Ánh xạ Test Cases (12 TC)
| ID HW04 | ID HW02 gốc | Mô tả | Kết quả (3 browsers) | Ghi chú / Bug |
| :--- | :--- | :--- | :---: | :--- |
| `TC-FR08-AT-01` | Mới *(gần `DT-03`)* | Chưa đăng nhập, bấm thanh toán ở giỏ → alert + `/login` | **Passed** | Khác `DT-03` HW02 (vào thẳng `/checkout`) |
| `TC-FR08-AT-02` | Mới *(từ `DT-01`)* | Đã đăng nhập vào `/checkout`, thấy `"Xác Nhận Đơn Hàng"` | **Passed** | |
| `TC-FR08-BVA-02` | `TC-FR08-BVA-02` / `DT-01` | Giỏ 1 SP hiển thị `"iPhone 15 Pro Max x 1"` | **Passed** | |
| `TC-FR08-DT-02` | `TC-FR08-DT-02` | Giỏ 2 SP khác nhau hiển thị 2 dòng `li` | **Passed** | |
| `TC-FR08-BVA-05` | `TC-FR08-BVA-05` / `DT-01` | Tổng tiền 1 SP đúng `30.000.000` | **Passed** | |
| `TC-FR08-BVA-03` | `TC-FR08-BVA-03` / `DT-02` | Tổng tiền 2 SP khác nhau đúng `34.000.000` | **Passed** | |
| `TC-FR08-AT-03` | Mới | Tổng tiền khi thêm 1 SP 2 lần đúng `60.000.000` | **Passed** | |
| `TC-FR08-DT-06` | `TC-FR08-DT-06` | Ô tổng tiền trên UI không cho phép sửa | **Failed** | Input đang editable (HW02 `#33`) |
| `TC-FR08-DT-01` | `TC-FR08-DT-01` | Thanh toán hợp lệ hiện `"Thanh toán thành công!"` | **Passed** | |
| `TC-FR08-DT-11` | `TC-FR08-DT-11` *(phần giỏ)* | Giỏ hàng được xóa trống sau khi thanh toán | **Failed** | Quên gọi `clearCart()` (HW02 `#36`) |
| `TC-FR08-AT-04` | Mới *(từ `DT-11` `/profile`)* | Đơn mới trong `/profile` có trạng thái `"Chờ xác nhận"`, tổng đúng | **Passed** | |
| `TC-FR08-DT-07` | `TC-FR08-DT-07` *(dùng `1000`)* | Sửa tổng thành `1000` rồi thanh toán → backend lưu `30.000.000` | **Failed** | Backend lưu thẳng `1000` (HW02 `#34`) |

#### Review Lỗi AI — FR-08
| AI sai / thiếu gì | Biểu hiện trong code ban đầu | Vì sao AI mắc lỗi | Đã sửa thế nào |
| :--- | :--- | :--- | :--- |
| Lỗi ghép chuỗi cột bảng gây trùng `#1` và `#11` | Dùng `page.locator('tbody tr', { hasText: '#11' })` ở commit `f8a4dae` | Trong `Profile.jsx`, `<td>#1</td><td>15/11/2026</td>` ghép `textContent` thành `#115/11/2026`, chứa chuỗi con `#11` → strict mode violation khi số đơn lên 11 | Đổi sang `page.locator('tbody tr').filter({ has: page.getByText(\`#${latestOrder.id}\`, { exact: true }) })` (commit `3f7adaa`) |
| Bắt `dialog` không đồng bộ | Dùng `page.once('dialog', ...)` không `await` lời hứa trước khi kiểm `dialogMsg` | Trên trình duyệt chậm hơn (Firefox/WebKit), kiểm biến `dialogMsg` ngay sau `.click()` dễ gặp race condition | Dùng `const dialogPromise = page.waitForEvent('dialog')` trước click rồi `await dialogPromise` (commit `f8a4dae`) |
| Lặp code gọi API lấy đơn mới nhất | Gọi lặp `loginApi` + `getMyOrders` ở cả `order-in-profile` và `tamper-recalculated` | Viết thẳng theo từng nhánh `if/else` | Tách thành helper `getLatestTestUserOrder(request)` |

#### Test Cases HW02 Chưa Tự Động Hóa — FR-08
- `TC-FR08-DT-04` (JWT sai/hết hạn), `DT-10` (API `total_amount: "abc"`), `BVA-04` (`29.999.999`), `BVA-06` (`30.000.001`): Là các ca kiểm thử API tampering trực tiếp vào `POST /api/checkout`, tách khỏi phạm vi E2E UI trên trình duyệt.
- `TC-FR08-DT-03` (vào thẳng URL `/checkout` khi chưa login — `#37`), `DT-05` / `BVA-01` (giỏ rỗng — `#35`), `DT-08` / `BVA-08` (`0`), `DT-09` / `BVA-09` (`-1`): Lược bớt để bám đúng 12 ca gợi ý HW04.

---

### 2.3. FR-15 — Quản lý sản phẩm CRUD (Admin, tab `"Sản phẩm"`)

#### Ánh xạ Test Cases (12 TC)
| ID HW04 | ID HW02 gốc | Mô tả | Kết quả (3 browsers) | Ghi chú / Bug |
| :--- | :--- | :--- | :---: | :--- |
| `TC-FR15-AT-01` | Mới | Xem danh sách ban đầu có đúng 5 sản phẩm seed | **Passed** | |
| `TC-FR15-DT-01` | `TC-FR15-DT-01` | Thêm sản phẩm hợp lệ xuất hiện trên bảng & API | **Passed** | |
| `TC-FR15-DT-02` | `TC-FR15-DT-02` / `BVA-02` | Tên rỗng → trình duyệt chặn (`validity.valueMissing`) | **Passed** | |
| `TC-FR15-DT-07` | `TC-FR15-DT-07` | Giá rỗng → không được tạo | **Failed** | Thiếu `required`, vẫn tạo bản ghi thứ 6 |
| `TC-FR15-DT-05` | `TC-FR15-DT-05` / `BVA-08` | Giá = `0` → không được tạo | **Failed** | Thiếu validation `price > 0` (HW02 `#24`) |
| `TC-FR15-BVA-10` | `TC-FR15-BVA-10` | Giá = `-1` → không được tạo | **Failed** | Chấp nhận giá âm `-1` (HW02 `#24`) |
| `TC-FR15-BVA-07` | `TC-FR15-BVA-07` | Giá = `1` → tạo thành công | **Passed** | Biên dưới hợp lệ |
| `TC-FR15-BVA-05` | `TC-FR15-BVA-05` | Tên `255` ký tự → tạo thành công | **Passed** | Sinh động qua `'A'.repeat(255)` |
| `TC-FR15-DT-04` | `TC-FR15-DT-04` / `BVA-06` | Tên `256` ký tự → không được tạo | **Failed** | Thiếu `maxLength="255"` (HW02 `#25`) |
| `TC-FR15-AT-02` | Mới *(từ `DT-08`)* | Bấm `"Sửa"` hiện tiêu đề `"Sửa sản phẩm"` và đổ sẵn giá trị | **Passed** | |
| `TC-FR15-DT-08` | `TC-FR15-DT-08` | Sửa tên SP test → chỉ SP đó đổi tên, `"iPhone 15 Pro Max"` còn nguyên | **Failed** | Lỗi ghi đè toàn bộ danh sách `fakeMassUpdatedProducts` (HW02 `#23`) |
| `TC-FR15-DT-09` | `TC-FR15-DT-09` *(bản UI xóa dòng)* | Xóa sản phẩm test → dòng biến mất, còn lại 5 SP seed | **Passed** | Lưu ý: HW02 `#26` bắt thiếu confirm dialog; ở kịch bản HW04 kiểm tra kết quả xóa dòng nên Pass |

#### Review Lỗi AI — FR-15
| AI sai / thiếu gì | Biểu hiện trong code ban đầu | Vì sao AI mắc lỗi | Đã sửa thế nào |
| :--- | :--- | :--- | :--- |
| Nguy cơ Pass giả do bất đồng bộ `POST` + `fetchData()` | Nếu chỉ gọi `expect(rows).toHaveCount(5)` ngay sau click `"Lưu sản phẩm"`, bảng vẫn đang có 5 dòng trước khi `POST` hoàn tất | `expect(locator).toHaveCount(5)` trả về pass ngay khi thấy 5 dòng tại `t=0`, không chờ request `POST` xong | Đợi `POST /api/products` + lượt `GET /api/products` refresh hoàn tất (commit `e3f2795`) trước khi kiểm tra cả API và bảng UI |
| Dữ liệu tồn đọng làm hỏng lượt chạy browser kế tiếp | Nếu không xóa sản phẩm test (`id > 5`), Firefox/WebKit chạy sau Chromium sẽ thấy 9–10 dòng thay vì 5 dòng | 3 trình duyệt dùng chung 1 SQLite backend | Thêm `cleanupTestProducts(request)` trong `beforeEach` và `afterAll` để xóa mọi sản phẩm có `id > 5` |

#### Test Cases HW02 Chưa Tự Động Hóa — FR-15
- `TC-FR15-DT-10` (`price = "abc"`): Không tự động hóa được bằng Playwright `fill()` trên ô `type="number"`.
- `TC-FR15-BVA-12` (`category_id = 4`): Dropdown Admin chỉ cho chọn 3 danh mục hợp lệ, không thể nhập `id = 4` qua UI (cần gọi API trực tiếp).
- `TC-FR15-DT-03` (khoảng trắng), `DT-11` (sửa giá cô lập), `DT-12` (đồng bộ sang Web User), `BVA-01`, `03`, `04`, `09`, `11`: Giữ ở danh mục thiết kế tay HW02 để bám đúng 12 ca đại diện HW04.

---

## 3. Gap Analysis Tổng Quát (HW02 vs. HW04 Automation)
1. **Lệch giữa giả định trên giao diện và cấu trúc DOM thực tế:** Khi chuyển từ test tay (HW02) sang Playwright (HW04), các bẫy nhỏ như chuỗi con trong bảng (`#1` vs `#11` khi ngày bắt đầu bằng `15/`), chuỗi con trong mô tả (`"Điện thoại"`), hay thời điểm bất đồng bộ (`POST` → `fetchData()`) dễ tạo ra **Pass giả** hoặc **Fail ngẫu nhiên (flaky)** nếu không rà kỹ HTML và network.
2. **Giá trị của dữ liệu tách rời và cross-browser:** Tách data JSON giúp rà từng giá trị `expected` theo đặc tả SRS, không bị AI "uốn" assertion cho khớp bug hiện tại. Chạy 3 browser cho thấy hành vi lỗi chức năng của EShop đồng nhất trên cả Chromium, Firefox và WebKit.
