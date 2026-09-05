# TCI V1 – Golden Calibration Draft 1.1

> Điểm dưới đây là **điểm nháp hiệu chuẩn**, chưa phải điểm TCI sản xuất. C2/C6 ưu tiên text của trình tự thực hiện; cấu trúc JSON dùng để đối chiếu và audit.

| # | Mã | TTHC | C1 | C2 | C3 | C4 | C5 | C6 | TCI nháp | Sao | Cảnh báo |
|---:|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| 1 | 1.014977 | Chủ tịch, Phó Chủ tịch UBND tỉnh tiếp khách nước ngoài | 0 | 2 | 1 | 2 | 1 | 4 | **35** | ★★☆☆☆ | STEP_TEXT_STRUCTURE_MISMATCH |
| 2 | 1.014978 | Chủ tịch, Phó Chủ tịch UBND tỉnh tiếp khách trong nước | 0 | 2 | 1 | 2 | 1 | 4 | **35** | ★★☆☆☆ | STEP_TEXT_STRUCTURE_MISMATCH |
| 3 | 1.000253 | Khai báo tạm trú cho người nước ngoài tại Việt Nam bằng Phiếu khai báo tạm trú | 1 | 2 | 2 | 3 | 1 | 3 | **41** | ★★★☆☆ | STEP_TEXT_STRUCTURE_MISMATCH |
| 4 | 1.000771 | Gia hạn tạm trú cho người đã được cấp giấy miễn thị thực tại Cục Quản lý xuất nhập cảnh Bộ Công an | 2 | 3 | 2 | 4 | 4 | 3 | **58** | ★★★☆☆ | STEP_TEXT_STRUCTURE_MISMATCH, PROCESSING_TIME_CONFLICT |
| 5 | 1.001445 | Trình báo mất hộ chiếu phổ thông (thực hiện tại cấp tỉnh) | 1 | 2 | 2 | 1 | 3 | 2 | **35** | ★★☆☆☆ | STEP_TEXT_STRUCTURE_MISMATCH |
| 6 | 1.010386 | Trình báo mất hộ chiếu phổ thông (thực hiện tại cấp xã) | 1 | 2 | 2 | 1 | 3 | 3 | **39** | ★★☆☆☆ | STEP_TEXT_STRUCTURE_MISMATCH |
| 7 | 1.115797 | Giao đất, cho thuê đất, chuyển mục đích sử dụng đất đối với trường hợp giao đất, cho thuê đất không đấu giá quyền sử dụng đất, không đấu thầu lựa chọn nhà đầu tư thực hiện dự án có sử dụng đất; trường hợp giao đất, cho thuê đất thông qua đấu thầu lựa chọn nhà đầu tư thực hiện dự án có sử dụng đất; giao đất và giao rừng; cho thuê đất và cho thuê rừng; gia hạn sử dụng đất khi hết thời hạn sử dụng đất; trường hợp giao đất, cho thuê đất thông qua hình thức đấu giá quyền sử dụng đất (cấp tỉnh) | 5 | 5 | 5 | 5 | 5 | 2 | **88** | ★★★★★ | STEP_TEXT_STRUCTURE_MISMATCH, PROCESSING_TIME_CONFLICT |
| 8 | 3.000671 | Đăng ký, cấp Giấy chứng nhận đối với thửa đất có diện tích tăng thêm do thay đổi ranh giới so với Giấy chứng nhận đã cấp (quy định tại điểm b và điểm c khoản 2 Điều 24 Nghị định số 101/2024/NĐ-CP và khoản 4 Điều 24 Nghị định số 101/2024/NĐ-CP) | 1 | 5 | 1 | 5 | 4 | 2 | **58** | ★★★☆☆ | STEP_TEXT_STRUCTURE_MISMATCH, PROFILE_TEXT_STRUCTURED_ZERO, PROCESSING_TIME_CONFLICT |
| 9 | 3.000579 | Giải quyết trợ cấp hằng tháng đối với thanh niên xung phong đã hoàn thành nhiệm vụ trong kháng chiến trở về địa phương (khoản01 Điều 09 Nghị Quyếtsố 182/2025/NQHĐND) | 2 | 5 | 1 | 3 | 3 | 2 | **54** | ★★★☆☆ |  |
| 10 | 2.002011 | Đăng ký thay đổi: thành viên hợp danh; thành viên công ty trách nhiệm hữu hạn hai thành viên trở lên; người đại diện theo pháp luật của công ty trách nhiệm hữu hạn, công ty cổ phần; chủ sở hữu công ty trách nhiệm hữu hạn một thành viên; chủ doanh nghiệp tư nhân trong trường hợp bán, tặng cho doanh nghiệp, chủ doanh nghiệp chết | 5 | 3 | 5 | 2 | 5 | 2 | **71** | ★★★★☆ |  |
| 11 | 1.004881 | Cấp Giấy chứng nhận lưu hành thuốc thú y; Cấp lại Giấy chứng nhận lưu hành thuốc thú y (trong trường hợp thay đổi thành phần, công thức, dạng bào chế, đường dùng, liều dùng, chỉ định điều trị của thuốc thú y; thay đổi phương pháp, quy trình sản xuất mà làm thay đổi chất lượng sản phẩm; đánh giá lại chất lượng, hiệu quả, độ an toàn của thuốc thú y theo quy định) | 5 | 2 | 1 | 1 | 2 | 2 | **46** | ★★★☆☆ | STEP_TEXT_STRUCTURE_MISMATCH, PROCESSING_TIME_UNKNOWN |
| 12 | 1.014199 | Cấp giấy phép lao động đối với người lao động nước ngoài làm việc tại Việt Nam | 5 | 2 | 4 | 4 | 4 | 1 | **64** | ★★★★☆ | PROCESSING_TIME_CONFLICT |
| 13 | 1.001226 | Cấp giấy phép đến các tỉnh, thành phố của Việt Nam cho công dân Lào nhập cảnh bằng Giấy thông hành biên giới tại Công an cấp tỉnh | 1 | 2 | 1 | 1 | 1 | 3 | **32** | ★★☆☆☆ | STEP_TEXT_STRUCTURE_MISMATCH |
| 14 | 1.003677 | Khai báo tạm vắng | 2 | 2 | 2 | 3 | 1 | 2 | **41** | ★★★☆☆ | STEP_TEXT_STRUCTURE_MISMATCH, PROCESSING_TIME_CONFLICT |
| 15 | 1.014999 | Thủ tục đăng ký sáng chế | 3 | 5 | 3 | 5 | 4 | 3 | **76** | ★★★★☆ | STEP_TEXT_STRUCTURE_MISMATCH |
| 16 | 1.015003 | Thủ tục xử lý đơn Madrid có chỉ định Việt Nam | 0 | 3 | 2 | 5 | 2 | 3 | **49** | ★★★☆☆ | STEP_TEXT_STRUCTURE_MISMATCH |
| 17 | 1.000807 | Cấp lại giấy miễn thị thực tại Cục Quản lý xuất nhập cảnh, Bộ Công an | 3 | 3 | 2 | 4 | 4 | 3 | **62** | ★★★★☆ | STEP_TEXT_STRUCTURE_MISMATCH, PROCESSING_TIME_CONFLICT |
| 18 | 1.000811 | Cấp mới thẻ ABTC (thực hiện tại cấp trung ương) | 2 | 2 | 3 | 5 | 3 | 3 | **58** | ★★★☆☆ | STEP_TEXT_STRUCTURE_MISMATCH, PROCESSING_TIME_CONFLICT |
| 19 | 1.013742 | Cấp giấy đăng ký lưu hành thuốc, nguyên liệu làm thuốc | 5 | 5 | 5 | 5 | 4 | 2 | **86** | ★★★★★ | PROCESSING_TIME_CONFLICT |
| 20 | 1.007659 | Thủ tục miễn thuế đối với hàng hóa xuất khẩu, nhập khẩu | 5 | 3 | 5 | 1 | 5 | 2 | **68** | ★★★★☆ | STEP_TEXT_STRUCTURE_MISMATCH, PROCESSING_TIME_UNKNOWN |
| 21 | 1.009646 | Thủ tục chấp thuận điều chỉnh chủ trương đầu tư thuộc thẩm quyền của Chủ tịch Uỷ ban nhân dân cấp tỉnh | 5 | 5 | 5 | 4 | 4 | 4 | **91** | ★★★★★ | STEP_TEXT_STRUCTURE_MISMATCH |
| 22 | 1.116389 | Đăng ký, cấp Giấy chứng nhận đối với thửa đất có diện tích tăng thêm do thay đổi ranh giới so với Giấy chứng nhận đã cấp (đối với trường hợp quy định tại điểm a khoản 2 Điều 24 Nghị định số 101/2024/NĐ-CP). | 2 | 4 | 2 | 5 | 4 | 5 | **73** | ★★★★☆ | STEP_TEXT_STRUCTURE_MISMATCH, PROCESSING_TIME_CONFLICT |
| 23 | 1.116400 | Tách thửa đất, hợp thửa đất | 2 | 4 | 1 | 5 | 4 | 5 | **70** | ★★★★☆ | STEP_TEXT_STRUCTURE_MISMATCH, PROCESSING_TIME_CONFLICT |
| 24 | 1.001667 | Giải quyết hưởng chế độ ốm đau, thai sản, trợ cấp dưỡng sức phục hồi sức khỏe sau ốm đau, thai sản, TNLĐ, BNN | 5 | 2 | 1 | 4 | 5 | 4 | **69** | ★★★★☆ | PROCESSING_TIME_CONFLICT |
| 25 | 1.116038 | Đăng ký thay đổi nội dung, cập nhật, bổ sung thông tin, cấp lại giấy chứng nhận, hiệu đính thông tin đăng ký hoạt động của Ngân hàng Chính sách xã hội, chi nhánh, phòng giao dịch Ngân hàng Chính sách xã hội. Đăng ký hoạt động lần đầu của chi nhánh, phòng giao dịch Ngân hàng Chính sách xã hội | 5 | 4 | 5 | 1 | 3 | 2 | **68** | ★★★★☆ | PROCESSING_TIME_UNKNOWN |
| 26 | 3.000654 | Đăng ký, cấp Giấy chứng nhận đối với trường hợp chuyển nhượng dự án đầu tư có sử dụng đất | 1 | 4 | 1 | 5 | 4 | 2 | **54** | ★★★☆☆ | STEP_TEXT_STRUCTURE_MISMATCH, PROFILE_TEXT_STRUCTURED_ZERO, PROCESSING_TIME_CONFLICT |
| 27 | 3.000650 | Đăng ký biến động đối với trường hợp thay đổi quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất theo thỏa thuận của các thành viên hộ gia đình hoặc của vợ và chồng; quyền sử dụng đất xây dựng công trình trên mặt đất phục vụ cho việc vận hành, khai thác sử dụng công trình ngầm, quyền sở hữu công trình ngầm; bán tài sản, điều chuyển, chuyển nhượng quyền sử dụng đất là tài sản công theo quy định của pháp luật về quản lý, sử dụng tài sản công; nhận quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất theo kết quả giải quyết tranh chấp, khiếu nại, tố cáo về đất đai hoặc bản án, quyết định của Tòa án, quyết định thi hành án của cơ quan thi hành án đã được thi hành; quyết định hoặc phán quyết của Trọng tài thương mại Việt Nam về giải quyết tranh chấp giữa các bên phát sinh từ hoạt động thương mại liên quan đến đất đai; nhận quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất do xử lý tài sản thế chấp là quyền sử dụng đất, tài sản gắn liền với đất đã được đăng ký, bao gồm cả xử lý khoản nợ có nguồn gốc từ khoản nợ xấu của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài | 1 | 3 | 1 | 5 | 5 | 2 | **52** | ★★★☆☆ | STEP_TEXT_STRUCTURE_MISMATCH, PROFILE_TEXT_STRUCTURED_ZERO, PROCESSING_TIME_CONFLICT |
| 28 | 1.009628 | Thủ tục điều chỉnh dự án đầu tư thuộc thẩm quyền chấp thuận chủ trương đầu tư của Thủ tướng Chính phủ | 5 | 5 | 5 | 4 | 4 | 3 | **87** | ★★★★★ | STEP_TEXT_STRUCTURE_MISMATCH |
| 29 | 2.000575 | Cấp lại Giấy chứng nhận đăng ký hộ kinh doanh, Cấp đổi sang Giấy chứng nhận đăng ký hộ kinh doanh | 5 | 2 | 3 | 2 | 5 | 2 | **61** | ★★★★☆ |  |
| 30 | 1.013285 | Thủ tục chấp thuận độ cao công trình | 2 | 5 | 2 | 5 | 3 | 3 | **67** | ★★★★☆ | PROCESSING_TIME_CONFLICT |

## Kiểm tra riêng C2 – text trình tự thực hiện

| # | Mã | Bước trong text | Bước trong JSON | Bước dùng chấm | Nhánh | Phối hợp |
|---:|---|---:|---:|---:|---:|---:|
| 1 | 1.014977 | 3 | 1 | 3 | 3 | 4 |
| 2 | 1.014978 | 3 | 1 | 3 | 4 | 7 |
| 3 | 1.000253 | 3 | 1 | 3 | 3 | 0 |
| 4 | 1.000771 | 3 | 1 | 3 | 9 | 2 |
| 5 | 1.001445 | 3 | 1 | 3 | 4 | 4 |
| 6 | 1.010386 | 3 | 1 | 3 | 4 | 7 |
| 7 | 1.115797 | 6 | 16 | 6 | 56 | 22 |
| 8 | 3.000671 | 5 | 19 | 5 | 29 | 17 |
| 9 | 3.000579 | 0 | 14 | 14 | 10 | 7 |
| 10 | 2.002011 | 0 | 3 | 3 | 40 | 5 |
| 11 | 1.004881 | 2 | 1 | 2 | 5 | 12 |
| 12 | 1.014199 | 3 | 3 | 3 | 5 | 0 |
| 13 | 1.001226 | 3 | 1 | 3 | 3 | 1 |
| 14 | 1.003677 | 4 | 1 | 4 | 5 | 1 |
| 15 | 1.014999 | 7 | 1 | 7 | 43 | 48 |
| 16 | 1.015003 | 3 | 1 | 3 | 9 | 3 |
| 17 | 1.000807 | 3 | 1 | 3 | 7 | 2 |
| 18 | 1.000811 | 3 | 1 | 3 | 5 | 1 |
| 19 | 1.013742 | 6 | 6 | 6 | 104 | 117 |
| 20 | 1.007659 | 2 | 1 | 2 | 44 | 13 |
| 21 | 1.009646 | 5 | 3 | 5 | 67 | 10 |
| 22 | 1.116389 | 3 | 1 | 3 | 19 | 8 |
| 23 | 1.116400 | 3 | 1 | 3 | 16 | 10 |
| 24 | 1.001667 | 3 | 3 | 3 | 5 | 0 |
| 25 | 1.116038 | 0 | 3 | 3 | 69 | 12 |
| 26 | 3.000654 | 3 | 6 | 3 | 25 | 8 |
| 27 | 3.000650 | 3 | 5 | 3 | 19 | 6 |
| 28 | 1.009628 | 5 | 2 | 5 | 59 | 10 |
| 29 | 2.000575 | 0 | 2 | 2 | 21 | 1 |
| 30 | 1.013285 | 0 | 14 | 14 | 5 | 11 |

## Nguyên tắc hiệu chuẩn

- C2: số bước trong **text** là nguồn chính; JSON chỉ là đối chiếu.
- Không coi nhiều phương thức trực tuyến/trực tiếp/bưu chính là phức tạp nếu không phát sinh thêm công việc hoặc điều kiện xử lý.
- C4: dữ liệu thời gian xung đột phải giữ cảnh báo, không âm thầm chọn min/max.
- C1: `null`, `[]`, chuỗi rỗng không mặc định là “không có hồ sơ” nếu narrative còn thể hiện thành phần hồ sơ.
- C6: ưu tiên cơ quan/vai trò có thực và hoạt động phối hợp, thẩm định, thẩm tra, xin ý kiến, xác minh, trình, phê duyệt trong text.
