# AI Critique — Phản Biện Việc Sử Dụng AI Trong Kiểm Thử Tự Động

Khi xây dựng bộ kiểm thử Playwright cho `FR-06`, `FR-08` và `FR-15` trên EShop SUT, AI giúp tăng tốc rõ rệt ở khâu chuẩn hóa dữ liệu JSON, dựng khung data-driven và bổ sung đa dạng kiểu assertion. Tuy nhiên, nếu dùng một prompt tổng quát để sinh toàn bộ script, AI rất dễ tạo ra test **xanh giả** hoặc **chập chờn** trước DOM thực tế.

Sai lầm phổ biến nhất của AI là đánh giá thiếu ngữ cảnh HTML và bất đồng bộ. Trong `FR-06`, `getByText('Điện thoại')` vô tình khớp với câu mô tả *"Điện thoại cao cấp của Apple"*, làm lỗi thiếu Danh mục bị che lấp. Ở `FR-08`, khi số đơn lên hai chữ số, `hasText: '#11'` lại khớp nhầm dòng `#1` vì ô mã đơn và ngày đặt nối liền thành `#115/11/2026`. Tương tự trong `FR-15`, gọi `toHaveCount(5)` ngay sau khi bấm lưu sẽ pass sớm trước khi request `POST` và lượt `GET` làm mới bảng hoàn tất.

Ngoài ra, khi đọc mã nguồn SUT, AI thường suy đoán hoặc nương theo lỗi sẵn có thay vì bám đặc tả. Chỉ khi chia nhỏ quy trình 7 bước, tách riêng tệp JSON với `expected` cố định theo SRS, dọn dữ liệu qua API giữa các trình duyệt và tự tay rà soát từng locator cùng kết quả đỏ thật, bộ kiểm thử tự động mới phản ánh trung thực chất lượng phần mềm.
