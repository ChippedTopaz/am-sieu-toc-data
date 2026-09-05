# TCI V1 – Golden Calibration Draft 1.2

> Draft hiệu chuẩn, chưa khóa sản xuất. C2/C6 ưu tiên text trình tự thực hiện. C5 coi Direct/Online/Postal là phương thức mặc định. C4 phân biệt biến thể thời gian với xung đột dữ liệu.

| # | Mã | TTHC | C1 | C2 | C3 | C4 | C5 | C6 | TCI | Sao | Cảnh báo |
|---:|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| 1 | 1.014977 | Chủ tịch, Phó Chủ tịch UBND tỉnh tiếp khách nước ngoài | 0 | 2 | 1 | 2 | 1 | 5 | **39** | ★★☆☆☆ | STEP_TEXT_STRUCTURE_MISMATCH |
| 2 | 1.014978 | Chủ tịch, Phó Chủ tịch UBND tỉnh tiếp khách trong nước | 0 | 2 | 1 | 2 | 1 | 5 | **39** | ★★☆☆☆ | STEP_TEXT_STRUCTURE_MISMATCH |
| 3 | 1.000253 | Khai báo tạm trú cho người nước ngoài tại Việt Nam bằng Phiếu khai báo tạm trú | 1 | 2 | 2 | 3 | 1 | 2 | **37** | ★★☆☆☆ | STEP_TEXT_STRUCTURE_MISMATCH |
| 4 | 1.000771 | Gia hạn tạm trú cho người đã được cấp giấy miễn thị thực tại Cục Quản lý xuất nhập cảnh Bộ Công an | 2 | 3 | 2 | 3 | 5 | 2 | **53** | ★★★☆☆ | STEP_TEXT_STRUCTURE_MISMATCH, PROCESSING_TIME_VARIANT |
| 5 | 1.001445 | Trình báo mất hộ chiếu phổ thông (thực hiện tại cấp tỉnh) | 1 | 2 | 2 | 1 | 2 | 2 | **33** | ★★☆☆☆ | STEP_TEXT_STRUCTURE_MISMATCH |
| 6 | 1.010386 | Trình báo mất hộ chiếu phổ thông (thực hiện tại cấp xã) | 1 | 2 | 2 | 1 | 2 | 3 | **37** | ★★☆☆☆ | STEP_TEXT_STRUCTURE_MISMATCH |
| 7 | 1.115797 | Giao đất, cho thuê đất, chuyển mục đích sử dụng đất đối với trường hợp giao đất, cho thuê đất không đấu giá quyền sử dụng đất, không đấu thầu lựa chọn nhà đầu tư thực hiện dự án có sử dụng đất; trường hợp giao đất, cho thuê đất thông qua đấu thầu lựa chọn nhà đầu tư thực hiện dự án có sử dụng đất; giao đất và giao rừng; cho thuê đất và cho thuê rừng; gia hạn sử dụng đất khi hết thời hạn sử dụng đất; trường hợp giao đất, cho thuê đất thông qua hình thức đấu giá quyền sử dụng đất (cấp tỉnh) | 5 | 5 | 5 | 4 | 5 | 5 | **97** | ★★★★★ | STEP_TEXT_STRUCTURE_MISMATCH, PROCESSING_TIME_VARIANT |
| 8 | 3.000671 | Đăng ký, cấp Giấy chứng nhận đối với thửa đất có diện tích tăng thêm do thay đổi ranh giới so với Giấy chứng nhận đã cấp (quy định tại điểm b và điểm c khoản 2 Điều 24 Nghị định số 101/2024/NĐ-CP và khoản 4 Điều 24 Nghị định số 101/2024/NĐ-CP) | 1 | 5 | 1 | 4 | 4 | 5 | **67** | ★★★★☆ | STEP_TEXT_STRUCTURE_MISMATCH, PROFILE_TEXT_STRUCTURED_ZERO, PROCESSING_TIME_VARIANT |
| 9 | 3.000579 | Giải quyết trợ cấp hằng tháng đối với thanh niên xung phong đã hoàn thành nhiệm vụ trong kháng chiến trở về địa phương (khoản01 Điều 09 Nghị Quyếtsố 182/2025/NQHĐND) | 2 | 5 | 1 | 3 | 2 | 2 | **52** | ★★★☆☆ |  |
| 10 | 2.002011 | Đăng ký thay đổi: thành viên hợp danh; thành viên công ty trách nhiệm hữu hạn hai thành viên trở lên; người đại diện theo pháp luật của công ty trách nhiệm hữu hạn, công ty cổ phần; chủ sở hữu công ty trách nhiệm hữu hạn một thành viên; chủ doanh nghiệp tư nhân trong trường hợp bán, tặng cho doanh nghiệp, chủ doanh nghiệp chết | 5 | 3 | 5 | 2 | 5 | 4 | **79** | ★★★★☆ |  |
| 11 | 1.004881 | Cấp Giấy chứng nhận lưu hành thuốc thú y; Cấp lại Giấy chứng nhận lưu hành thuốc thú y (trong trường hợp thay đổi thành phần, công thức, dạng bào chế, đường dùng, liều dùng, chỉ định điều trị của thuốc thú y; thay đổi phương pháp, quy trình sản xuất mà làm thay đổi chất lượng sản phẩm; đánh giá lại chất lượng, hiệu quả, độ an toàn của thuốc thú y theo quy định) | 5 | 2 | 1 | 1 | 1 | 3 | **48** | ★★★☆☆ | STEP_TEXT_STRUCTURE_MISMATCH, PROCESSING_TIME_UNKNOWN |
| 12 | 1.014199 | Cấp giấy phép lao động đối với người lao động nước ngoài làm việc tại Việt Nam | 5 | 2 | 4 | 3 | 4 | 2 | **65** | ★★★★☆ | PROCESSING_TIME_VARIANT |
| 13 | 1.001226 | Cấp giấy phép đến các tỉnh, thành phố của Việt Nam cho công dân Lào nhập cảnh bằng Giấy thông hành biên giới tại Công an cấp tỉnh | 1 | 2 | 1 | 1 | 1 | 2 | **28** | ★★☆☆☆ | STEP_TEXT_STRUCTURE_MISMATCH |
| 14 | 1.003677 | Khai báo tạm vắng | 2 | 2 | 2 | 2 | 3 | 2 | **42** | ★★★☆☆ | STEP_TEXT_STRUCTURE_MISMATCH, PROCESSING_TIME_VARIANT |
| 15 | 1.014999 | Thủ tục đăng ký sáng chế | 3 | 5 | 3 | 5 | 5 | 3 | **78** | ★★★★☆ | STEP_TEXT_STRUCTURE_MISMATCH |
| 16 | 1.015003 | Thủ tục xử lý đơn Madrid có chỉ định Việt Nam | 0 | 3 | 2 | 5 | 1 | 3 | **47** | ★★★☆☆ | STEP_TEXT_STRUCTURE_MISMATCH |
| 17 | 1.000807 | Cấp lại giấy miễn thị thực tại Cục Quản lý xuất nhập cảnh, Bộ Công an | 3 | 3 | 2 | 3 | 5 | 2 | **57** | ★★★☆☆ | STEP_TEXT_STRUCTURE_MISMATCH, PROCESSING_TIME_VARIANT |
| 18 | 1.000811 | Cấp mới thẻ ABTC (thực hiện tại cấp trung ương) | 2 | 2 | 3 | 4 | 2 | 2 | **49** | ★★★☆☆ | STEP_TEXT_STRUCTURE_MISMATCH, PROCESSING_TIME_VARIANT |
| 19 | 1.013742 | Cấp giấy đăng ký lưu hành thuốc, nguyên liệu làm thuốc | 5 | 5 | 5 | 5 | 5 | 4 | **96** | ★★★★★ | PROCESSING_TIME_VARIANT |
| 20 | 1.007659 | Thủ tục miễn thuế đối với hàng hóa xuất khẩu, nhập khẩu | 5 | 3 | 5 | 1 | 5 | 5 | **80** | ★★★★☆ | STEP_TEXT_STRUCTURE_MISMATCH, PROCESSING_TIME_UNKNOWN |
| 21 | 1.009646 | Thủ tục chấp thuận điều chỉnh chủ trương đầu tư thuộc thẩm quyền của Chủ tịch Uỷ ban nhân dân cấp tỉnh | 5 | 5 | 5 | 4 | 5 | 5 | **97** | ★★★★★ | STEP_TEXT_STRUCTURE_MISMATCH |
| 22 | 1.116389 | Đăng ký, cấp Giấy chứng nhận đối với thửa đất có diện tích tăng thêm do thay đổi ranh giới so với Giấy chứng nhận đã cấp (đối với trường hợp quy định tại điểm a khoản 2 Điều 24 Nghị định số 101/2024/NĐ-CP). | 2 | 4 | 2 | 4 | 4 | 3 | **62** | ★★★★☆ | STEP_TEXT_STRUCTURE_MISMATCH, PROCESSING_TIME_VARIANT |
| 23 | 1.116400 | Tách thửa đất, hợp thửa đất | 2 | 4 | 1 | 4 | 4 | 2 | **55** | ★★★☆☆ | STEP_TEXT_STRUCTURE_MISMATCH, PROCESSING_TIME_VARIANT |
| 24 | 1.001667 | Giải quyết hưởng chế độ ốm đau, thai sản, trợ cấp dưỡng sức phục hồi sức khỏe sau ốm đau, thai sản, TNLĐ, BNN | 5 | 2 | 1 | 3 | 5 | 1 | **54** | ★★★☆☆ | PROCESSING_TIME_VARIANT |
| 25 | 1.116038 | Đăng ký thay đổi nội dung, cập nhật, bổ sung thông tin, cấp lại giấy chứng nhận, hiệu đính thông tin đăng ký hoạt động của Ngân hàng Chính sách xã hội, chi nhánh, phòng giao dịch Ngân hàng Chính sách xã hội. Đăng ký hoạt động lần đầu của chi nhánh, phòng giao dịch Ngân hàng Chính sách xã hội | 5 | 4 | 5 | 1 | 2 | 5 | **78** | ★★★★☆ | PROCESSING_TIME_UNKNOWN |
| 26 | 3.000654 | Đăng ký, cấp Giấy chứng nhận đối với trường hợp chuyển nhượng dự án đầu tư có sử dụng đất | 1 | 4 | 1 | 4 | 5 | 3 | **57** | ★★★☆☆ | STEP_TEXT_STRUCTURE_MISMATCH, PROFILE_TEXT_STRUCTURED_ZERO, PROCESSING_TIME_VARIANT |
| 27 | 3.000650 | Đăng ký biến động đối với trường hợp thay đổi quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất theo thỏa thuận của các thành viên hộ gia đình hoặc của vợ và chồng; quyền sử dụng đất xây dựng công trình trên mặt đất phục vụ cho việc vận hành, khai thác sử dụng công trình ngầm, quyền sở hữu công trình ngầm; bán tài sản, điều chuyển, chuyển nhượng quyền sử dụng đất là tài sản công theo quy định của pháp luật về quản lý, sử dụng tài sản công; nhận quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất theo kết quả giải quyết tranh chấp, khiếu nại, tố cáo về đất đai hoặc bản án, quyết định của Tòa án, quyết định thi hành án của cơ quan thi hành án đã được thi hành; quyết định hoặc phán quyết của Trọng tài thương mại Việt Nam về giải quyết tranh chấp giữa các bên phát sinh từ hoạt động thương mại liên quan đến đất đai; nhận quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất do xử lý tài sản thế chấp là quyền sử dụng đất, tài sản gắn liền với đất đã được đăng ký, bao gồm cả xử lý khoản nợ có nguồn gốc từ khoản nợ xấu của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài | 1 | 3 | 1 | 4 | 5 | 3 | **53** | ★★★☆☆ | STEP_TEXT_STRUCTURE_MISMATCH, PROFILE_TEXT_STRUCTURED_ZERO, PROCESSING_TIME_VARIANT |
| 28 | 1.009628 | Thủ tục điều chỉnh dự án đầu tư thuộc thẩm quyền chấp thuận chủ trương đầu tư của Thủ tướng Chính phủ | 5 | 5 | 5 | 4 | 5 | 3 | **89** | ★★★★★ | STEP_TEXT_STRUCTURE_MISMATCH |
| 29 | 2.000575 | Cấp lại Giấy chứng nhận đăng ký hộ kinh doanh, Cấp đổi sang Giấy chứng nhận đăng ký hộ kinh doanh | 5 | 2 | 3 | 2 | 5 | 3 | **65** | ★★★★☆ |  |
| 30 | 1.013285 | Thủ tục chấp thuận độ cao công trình | 2 | 5 | 2 | 4 | 2 | 2 | **58** | ★★★☆☆ | PROCESSING_TIME_VARIANT |

## C5 – Phương thức thực hiện

Direct/Online/Postal không tự tăng điểm. Chỉ tín hiệu đặc thù như bản gốc/đối chiếu, chứng thực/xác thực, điều kiện theo phương thức, bổ sung hồ sơ hoặc quy trình trả kết quả phức tạp mới làm tăng điểm.

## C6 – Phối hợp và nhiều tác nhân

C6 không dùng số lượng `departmentExecutingIds` làm điểm chính. Điểm dựa trên tác nhân thực sự xuất hiện cùng hành động xử lý trong text, cộng tín hiệu phối hợp, chuyển giao, thẩm định/xác minh và phê duyệt. Nhiều cơ quan có thể được trao quyền giải quyết nhưng không đồng nghĩa hồ sơ phải đi qua tất cả các cơ quan đó.

## C4 – Thời gian

Nhiều thời hạn gắn với các trường hợp/nhánh khác nhau được đánh dấu `TIME_VARIANT`, không coi là mâu thuẫn. Chỉ khi nhiều nguồn cho cùng một phạm vi xử lý mà không có căn cứ cho biến thể mới đánh dấu `CONFLICT`.

## C2 – Text-first

Số bước trong text là nguồn chính; cấu trúc `executionSteps` chỉ dùng để đối chiếu.
