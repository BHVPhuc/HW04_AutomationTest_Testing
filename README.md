# HW04 — AI-Assisted Automation Testing on EShop SUT

- **Sinh viên thực hiện:** Bửu Huỳnh Vĩnh Phúc — MSSV: `23120328`
- **Môn học:** Kiểm thử phần mềm (Software Testing) — HK1, Năm học 2026–2027
- **Phân công Nhóm 09:** Pool A `FR-06` (Chi tiết sản phẩm) · Pool B `FR-08` (Checkout) · Pool C `FR-15` (CRUD Sản phẩm - Admin)
- **Trang GitHub Issues của nhóm:** https://github.com/kqanGit/eshop-sut/issues
- **Repo cá nhân HW04:** https://github.com/BHVPhuc/HW04_AutomationTest_Testing
- **Video Demo chính (YouTube unlisted ≥ 5 phút):** *(Điền link YouTube sau khi quay)*
- **Video Agent Skill (YouTube unlisted):** *(Điền link YouTube sau khi quay)*

---

## 1. Bảng Tự Đánh Giá Khắt Khe (Strict Self-Assessment)

> Điểm tự đánh giá tổng thể: **91 / 100** (tương ứng tên file nộp: `23120328_HW04_AI_Automation_091.zip`).

| STT | Tiêu chí đánh giá | Điểm tối đa | Tự chấm | Lý do tự trừ điểm (Phản biện hạn chế) | Minh chứng |
| :---: | :--- | :---: | :---: | :--- | :--- |
| 1 | **Feature A: FR-06 Chi tiết sản phẩm** | 25 | **23** | **-2 điểm:** Đã tự động hóa đủ 12 TC data-driven trên 3 trình duyệt (8 Pass, 4 Fail bắt đúng lỗi `#18`, `#19`, `#20`). Tự trừ 2đ do ca `TC-FR06-DT-02` xanh một phần do app nuốt click đầu chứ chưa tách kiểm thử nút bấm sau 2 lần click, và các ca nhập chữ vào ô số (`DT-06`) không tự động hóa trực tiếp được. | [tests/FR-06.spec.js](./tests/FR-06.spec.js), [data/FR-06.json](./data/FR-06.json), [reports/FR-06-chromium](./reports/FR-06-chromium/index.html) |
| 2 | **Feature B: FR-08 Thanh toán / Checkout** | 25 | **23** | **-2 điểm:** Tự động hóa đủ 12 TC trên 3 browser (9 Pass, 3 Fail bắt đúng lỗi `#33`, `#34`, `#36`). Tự trừ 2đ do bảng `orders` không có API xóa nên số đơn tích lũy tăng dần qua các lượt chạy, và các ca kiểm thử API tampering thuần túy từ HW02 (`DT-04`, `DT-10`) được giữ ngoài phạm vi UI spec. | [tests/FR-08.spec.js](./tests/FR-08.spec.js), [data/FR-08.json](./data/FR-08.json), [reports/FR-08-chromium](./reports/FR-08-chromium/index.html) |
| 3 | **Feature C: FR-15 CRUD Sản phẩm (Admin)** | 25 | **23** | **-2 điểm:** Tự động hóa đủ 12 TC với `cleanupTestProducts` trước/sau khi chạy (7 Pass, 5 Fail bắt đúng lỗi giá rỗng/`0`/`-1`, tên 256 ký tự, ghi đè tên hàng loạt `#23`). Tự trừ 2đ do chưa tự động hóa đồng bộ kiểm tra chéo từ Admin sang Web User trong cùng 1 test và không tự động hóa ca `category_id = 4` qua UI. | [tests/FR-15.spec.js](./tests/FR-15.spec.js), [data/FR-15.json](./data/FR-15.json), [reports/FR-15-chromium](./reports/FR-15-chromium/index.html) |
| 4 | **Video Demo (Cross-browser, HTML report, git diff)** | 15 | **13** | **-2 điểm:** Đã chuẩn bị đầy đủ 9 HTML report có metadata `"Run by: 23120328"` + timestamp ISO và 10 commit sửa `.spec.js` để minh họa lịch sử sửa lỗi AI; tự trừ 2đ do video quay màn hình tập trung trình bày tiêu biểu 1 feature trong thời lượng ≥ 5 phút thay vì đi hết cả 36 test case. | `git-commit-log.txt`, `reports/` |
| 5 | **Agent Skill & AI Audit / Critique** | 10 | **9** | **-1 điểm:** Đã xây dựng `eshop-playwright-tester/SKILL.md` ngay sau `FR-06` và áp dụng cho `FR-08`, `FR-15`, kèm nhật ký 7 bước × 3 feature và critique 200–300 từ; tự trừ 1đ do skill thiết kế chuyên biệt cho kiến trúc React/SQLite của EShop SUT, chưa tổng quát hóa đa framework. | [skills/eshop-playwright-tester/SKILL.md](./skills/eshop-playwright-tester/SKILL.md), [ai/audit-report.md](./ai/audit-report.md), [ai/critique.md](./ai/critique.md) |
| **Tổng** | **Tổng điểm tự đánh giá** | **100** | **91** | **Tự trừ -9 điểm** | `23120328_HW04_AI_Automation_091.zip` |

---

## 2. Test Summary (Tổng Hợp Kết Quả Chạy Tự Động)

- **Số feature tự động hóa:** 3 (`FR-06`, `FR-08`, `FR-15`)
- **Số test case data-driven:** 36 (12 TC / feature, dữ liệu tách riêng trong `data/`)
- **Số lượt chạy trình duyệt:** 9 lượt (`3 feature × 3 browser: chromium, firefox, webkit`)
- **Tổng số lần thực thi test:** **108** (`36 × 3`)
  - **Passed:** **72** (`24` ca unique × 3 browser)
  - **Failed (do bug thật của EShop):** **36** (`12` ca unique × 3 browser)
  - **Flaky / Lỗi script:** **0**
- **Số bug ghi nhận:** **11 lỗi/triệu chứng** trên `FR-06`, `FR-08`, `FR-15` (tương ứng 12 ca Fail, chi tiết trong [report/bugs.md](./report/bugs.md))
- **Số commit sửa `.spec.js`:** 10 commit (tổng 12+ commit trong [git-commit-log.txt](./git-commit-log.txt))

---

## 3. Cấu Trúc Thư Mục & Tài Liệu

- [tests/](./tests): `FR-06.spec.js`, `FR-08.spec.js`, `FR-15.spec.js`
- [data/](./data): `FR-06.json`, `FR-08.json`, `FR-15.json`
- [helpers/common.js](./helpers/common.js): Helper đăng nhập Web/Admin, `parseMoney`, `attachRunBy`, `cleanupTestProducts`, `getMyOrders`
- [playwright.config.js](./playwright.config.js) & [run-all.js](./run-all.js): Chạy 9 lượt và xuất 9 HTML report
- [reports/](./reports): 9 thư mục HTML report (`FR-{06,08,15}-{chromium,firefox,webkit}`)
- [report/main-report.md](./report/main-report.md) & [report/bugs.md](./report/bugs.md) + [report/screenshots/](./report/screenshots)
- [ai/audit-report.md](./ai/audit-report.md) & [ai/critique.md](./ai/critique.md)
- [skills/eshop-playwright-tester/SKILL.md](./skills/eshop-playwright-tester/SKILL.md)
- [git-commit-log.txt](./git-commit-log.txt)

---

## 4. Hướng Dẫn Chạy Lại

1. Chạy EShop SUT trên 3 terminal (`backend` cổng `3000`, `frontend-web` cổng `5173`, `frontend-admin` cổng `5174`).
2. Tại thư mục repo:
   ```bash
   npm install
   npx playwright install chromium firefox webkit
   node run-all.js
   ```
3. Mở một báo cáo HTML bất kỳ:
   ```bash
   npx playwright show-report reports/FR-06-chromium
   ```
