# TCI V1 – Golden Calibration Matrix 1.0

## Mục đích

Đây là ma trận tham chiếu cho 30 Golden Cases trước khi khóa công thức TCI V1 sản xuất. Điểm `Ref` là mức đánh giá nghiệp vụ dự kiến dùng để đối chiếu với điểm máy; không coi đây là chân lý tuyệt đối.

### Nguyên tắc nền

1. **C5 – Phương thức thực hiện:** Direct / Online / Postal là ba kênh mặc định và không tự làm tăng độ phức tạp. Chỉ tăng điểm khi phương thức tạo thêm điều kiện, bản gốc, đối chiếu, chứng thực/xác thực, bổ sung hoặc nhánh xử lý khác.
2. **C6 – Phối hợp:** số cơ quan được trao quyền giải quyết không phải số tác nhân trong một luồng hồ sơ. Chỉ tính các tác nhân thực sự tham gia trong text của trình tự, cùng hoạt động phối hợp, chuyển giao, thẩm định, xác minh, xin ý kiến, trình và phê duyệt.
3. **C4 – Thời gian:** các thời hạn khác nhau nhưng gắn với các trường hợp/nhánh hợp lệ là `TIME_VARIANT`, không phải `CONFLICT`.
4. **C2 – Trình tự:** text của trình tự thực hiện là nguồn chính; cấu trúc JSON chỉ dùng để đối chiếu/audit.

## Ma trận 30 Golden Cases

| # | Mã TTHC | C1 | C2 | C3 | C4 | C5 | C6 | Ghi chú hiệu chuẩn |
|---:|---|---:|---:|---:|---:|---:|---:|---|
| 1 | 1.014977 | 0 | 2 | 1 | 2 | 1 | 4 | Nhiều hoạt động phối hợp thực tế trong text; 4 đơn vị metadata không phải 4 tuyến xử lý. |
| 2 | 1.014978 | 0 | 2 | 1 | 2 | 1 | 4 | Có cơ quan chủ trì, Văn phòng UBND, lãnh đạo và cơ quan liên quan cùng tham gia. |
| 3 | 1.000253 | 1 | 2 | 2 | 3 | 1 | 2 | Luồng tương đối đơn giản, ít tác nhân. |
| 4 | 1.000771 | 2 | 3 | 2 | 4 | 2 | 3 | 3 kênh nộp không tự tăng C5; tăng nhẹ vì có yêu cầu đặc thù với hồ sơ trực tuyến. |
| 5 | 1.001445 | 1 | 2 | 2 | 1 | 1 | 2 | 3 kênh nộp là mặc định. |
| 6 | 1.010386 | 1 | 2 | 2 | 1 | 1 | 2 | Tương tự cấp tỉnh nhưng thực hiện ở cấp xã. |
| 7 | 1.115797 | 5 | 5 | 5 | 5 | 1 | 4 | Rất phức tạp; C6 cao do phối hợp thực tế, không do tổng số cơ quan có thể giải quyết. |
| 8 | 3.000671 | 1 | 5 | 1 | 5 | 1 | 3 | Nhiều bước; thiếu hồ sơ cấu trúc phải giữ cảnh báo thay vì suy diễn. |
| 9 | 3.000579 | 2 | 5 | 1 | 3 | 1 | 3 | Quy trình nhiều bước, phối hợp mức trung bình. |
| 10 | 2.002011 | 5 | 3 | 5 | 2 | 1 | 3 | Rất nhiều hồ sơ/trường hợp; không phạt C5 vì 3 kênh nộp. |
| 11 | 1.004881 | 5 | 2 | 1 | 1 | 1 | 3 | Hồ sơ nhiều nhưng quy trình text không dài tương ứng; có phối hợp chuyên môn. |
| 12 | 1.014199 | 5 | 2 | 4 | 4 | 1 | 3 | Điều kiện đáng kể; nhiều phương thức không đồng nghĩa C5 cao. |
| 13 | 1.001226 | 1 | 2 | 1 | 1 | 1 | 2 | Quy trình ngắn, ít hồ sơ/tác nhân. |
| 14 | 1.003677 | 2 | 2 | 2 | 3 | 1 | 2 | Có nhánh/điều kiện nhưng chưa có chuỗi phối hợp sâu. |
| 15 | 1.014999 | 3 | 5 | 3 | 5 | 1 | 4 | Đăng ký sáng chế có quy trình và thời gian phức tạp. |
| 16 | 1.015003 | 0 | 3 | 2 | 5 | 1 | 3 | Độ sâu nghiệp vụ đáng kể; C5 không tăng do kênh nộp mặc định. |
| 17 | 1.000807 | 3 | 3 | 2 | 4 | 2 | 3 | Có điều kiện/bước xử lý đáng kể; C5 chỉ tăng do yêu cầu thực hiện đặc thù. |
| 18 | 1.000811 | 2 | 2 | 3 | 5 | 2 | 3 | Thời gian dài nhưng ít bước; 3 kênh không phải độ phức tạp. |
| 19 | 1.013742 | 5 | 5 | 5 | 5 | 1 | 4 | Rất nhiều hồ sơ/điều kiện, quy trình và thời gian dài. |
| 20 | 1.007659 | 5 | 3 | 5 | 1 | 1 | 4 | Hồ sơ/điều kiện rất nhiều; C6 chỉ cao khi text cho thấy phối hợp thực tế. |
| 21 | 1.009646 | 5 | 5 | 5 | 4 | 1 | 5 | Chuỗi phối hợp/thẩm định/trình phê duyệt là tín hiệu chính của C6. |
| 22 | 1.116389 | 2 | 4 | 2 | 5 | 1 | 2 | Nhiều cơ quan được trao quyền không có nghĩa 29 tác nhân cùng xử lý một hồ sơ. |
| 23 | 1.116400 | 2 | 4 | 1 | 5 | 1 | 2 | Tương tự #22; metadata không được biến thành điểm C6. |
| 24 | 1.001667 | 5 | 2 | 1 | 4 | 1 | 3 | Nhiều hồ sơ/trường hợp nhưng luồng xử lý không tương ứng 5 điểm C2. |
| 25 | 1.116038 | 5 | 4 | 5 | 1 | 1 | 3 | Nhiều hồ sơ/nhánh; thời gian cấu trúc thiếu nên C4 cần UNKNOWN/audit. |
| 26 | 3.000654 | 1 | 4 | 1 | 5 | 1 | 3 | Nhiều bước; chênh thời gian cần audit, không do nhiều kênh nộp. |
| 27 | 3.000650 | 1 | 3 | 1 | 5 | 1 | 4 | Nhiều trường hợp pháp lý; C6 chỉ tăng theo phối hợp thực tế. |
| 28 | 1.009628 | 5 | 5 | 5 | 4 | 1 | 4 | 25 ngày và 12 ngày gắn với các nhánh khác nhau → `TIME_VARIANT`. |
| 29 | 2.000575 | 5 | 2 | 3 | 2 | 1 | 2 | Hồ sơ nhiều nhưng quy trình tương đối ngắn. |
| 30 | 1.013285 | 2 | 5 | 2 | 5 | 1 | 3 | 14 bước làm C2 cao; C6 chỉ trung bình nếu chưa có chuỗi nhiều tác nhân sâu. |

## Cách sử dụng

Ma trận này phải được đặt cạnh `tci-golden-calibration.json` để xem chênh lệch từng C1–C6. Bất kỳ ca nào lệch từ **1 điểm trở lên ở nhiều tiêu chí**, hoặc lệch 1 điểm ở C6/C5 do nguyên nhân cấu trúc dữ liệu, phải được rà lại trước khi khóa công thức.

## Không được khóa TCI V1 chỉ dựa trên 30 ca

30 Golden Cases dùng để tìm anchor, phát hiện double-counting và hiệu chỉnh logic. Sau vòng này phải chạy thử trên toàn bộ 6.258 TTHC để kiểm tra phân bố điểm, cảnh báo dữ liệu, các cụm bất thường và các trường hợp cực trị trước khi đưa điểm TCI lên giao diện sản xuất.
