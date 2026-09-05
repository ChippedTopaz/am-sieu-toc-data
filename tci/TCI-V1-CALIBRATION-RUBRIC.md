# TCI V1 – Khung hiệu chuẩn Golden Cases

## 1. Nguyên tắc cốt lõi

TCI đo **mức độ phức tạp của việc thực hiện một thủ tục hành chính**, không đo độ dài của biểu mẫu hay chỉ số kỹ thuật của JSON.

Nguồn chính để đánh giá là **nội dung text của TTHC**. Các trường cấu trúc (`executionSteps`, `profileComponents`, `department*Ids`, `processingTime`...) chỉ dùng để đối chiếu, bổ sung bằng chứng và phát hiện bất thường.

Không được coi `null`, `[]`, chuỗi rỗng hoặc cờ `false` là bằng chứng rằng đặc tính không tồn tại. Trạng thái tối thiểu phải phân biệt:

- `KNOWN`: có bằng chứng rõ.
- `UNKNOWN`: thiếu bằng chứng.
- `CONFLICT`: các nguồn dữ liệu mâu thuẫn.
- `NOT_APPLICABLE`: đặc tính không áp dụng.

## 2. Sáu tiêu chí

| Tiêu chí | Trọng số | Điều cần đo |
|---|---:|---|
| C1 – Thành phần hồ sơ | 20% | Số lượng hồ sơ/giấy tờ, mức độ đa dạng, hồ sơ theo từng trường hợp, hồ sơ có điều kiện hoặc phụ thuộc nhánh |
| C2 – Số bước và độ phức tạp quy trình | 20% | Số bước thực tế trong text, thứ tự xử lý, chuyển bước, nhánh, thao tác qua lại; không dùng riêng `executionSteps.length` |
| C3 – Điều kiện, yêu cầu | 15% | Điều kiện đầu vào, tiêu chuẩn, ngoại lệ, điều kiện loại trừ, ngưỡng, trường hợp đặc biệt |
| C4 – Thời gian giải quyết | 15% | Thời lượng thực tế, đơn vị thời gian, nhiều trường hợp, nhiều mốc, thời gian không xác định và xung đột thời gian |
| C5 – Phương thức thực hiện và mức độ linh hoạt | 10% | Số phương thức và khả năng lựa chọn; chỉ tăng độ phức tạp khi phương thức kéo theo ràng buộc/quy trình phụ; không phạt chỉ vì có nhiều phương thức |
| C6 – Phối hợp, thẩm định, phê duyệt và nhiều tác nhân | 20% | Số vai trò/cơ quan tham gia thực chất, phối hợp, xin ý kiến, thẩm định, thẩm tra, xác minh, hội đồng, phê duyệt, chuyển hồ sơ giữa các cơ quan |

## 3. Quy tắc C2 – Text-first

### 3.1 Xác định số bước

Ưu tiên số thứ tự `Bước X:` trong nội dung text. Nếu text không có đánh số thì dùng cấu trúc `executionSteps` như nguồn phụ.

Ví dụ: một phần tử `executionSteps` có thể chứa `Bước 1`, `Bước 2`, `Bước 3`; khi đó số bước thực tế là 3, không phải 1.

### 3.2 Mức điểm dự kiến

- 0: Không xác định được hoặc không có trình tự thực hiện có ý nghĩa.
- 1: 1–2 bước, tuyến tính, ít điều kiện.
- 2: 3–4 bước, chủ yếu tuyến tính.
- 3: 5–7 bước hoặc có nhánh/kiểm tra đáng kể.
- 4: 8–12 bước hoặc có nhiều nhánh/chuyển tác nhân.
- 5: >12 bước hoặc quy trình rất nhiều nhánh, vòng lặp, chuyển giao, thẩm định/xin ý kiến ngay trong trình tự.

Điểm C2 có thể tăng trong cùng một khoảng số bước khi text thể hiện rõ nhánh hoặc nhiều lần chuyển giao, nhưng không được cộng chỉ vì văn bản dài.

## 4. Quy tắc C1 – Hồ sơ

Đếm các thành phần hồ sơ có bằng chứng thực tế từ root và `executionCases`, loại trùng theo mã/ID/tên chuẩn hóa.

Nếu cấu trúc cho 0 nhưng text nói rõ phải nộp hồ sơ/giấy tờ thì trạng thái là `UNKNOWN_STRUCTURED_ZERO`, không được cho C1 = 0 một cách máy móc.

Mức tham chiếu:

- 0: Không có hồ sơ được yêu cầu hoặc thủ tục không dựa trên hồ sơ.
- 1: 1–2 thành phần.
- 2: 3–5 thành phần.
- 3: 6–10 thành phần.
- 4: 11–30 thành phần hoặc hồ sơ theo nhiều trường hợp.
- 5: >30 thành phần, rất nhiều trường hợp hoặc bộ hồ sơ có nhiều nhánh/ràng buộc.

Có thể nâng một bậc khi phần lớn hồ sơ chỉ xuất hiện trong nhánh điều kiện hoặc nhiều execution case khác nhau.

## 5. Quy tắc C3 – Điều kiện, yêu cầu

Phải đọc text, không dùng số lượng từ khóa đơn thuần. Cần xem:

- có điều kiện đầu vào hay không;
- có nhiều trường hợp `nếu`, `trường hợp`, `đối với`;
- có điều kiện loại trừ;
- có tiêu chuẩn/ngưỡng;
- có yêu cầu chứng minh, xác minh;
- có ngoại lệ hoặc điều kiện phụ thuộc dữ liệu/cơ sở pháp lý.

Mức tham chiếu:

- 0–1: hầu như không có điều kiện đặc biệt.
- 2: vài điều kiện đơn giản.
- 3: nhiều điều kiện hoặc 1–2 nhánh.
- 4: nhiều nhánh, điều kiện loại trừ, tiêu chuẩn/ngưỡng.
- 5: hệ thống điều kiện phức tạp, nhiều trường hợp và ngoại lệ đan xen.

## 6. Quy tắc C4 – Thời gian

Không tự động lấy `min` hoặc `max` khi có xung đột.

- 0: Không có thời hạn áp dụng/không thể xác định.
- 1: ≤1 ngày.
- 2: >1 đến 5 ngày.
- 3: >5 đến 15 ngày.
- 4: >15 đến 60 ngày.
- 5: >60 ngày.

Nếu có nhiều thời lượng cho nhiều nhánh hợp lệ thì đánh giá trên **phạm vi thực tế của thủ tục**, đồng thời ghi nhận nhiều trường hợp.

Nếu các nguồn cùng mô tả một trường hợp nhưng cho thời gian khác nhau thì trạng thái `CONFLICT`; không tự ý chọn giá trị “đẹp” hơn.

## 7. Quy tắc C5 – Phương thức

Ba phương thức `ONLINE`, `DIRECT`, `POSTAL` không tự động làm thủ tục phức tạp hơn. Trường hợp nhiều phương thức nhưng các bước gần như giống nhau có thể vẫn ở C5 thấp.

C5 tăng khi phương thức kéo theo thao tác phụ, ví dụ:

- nộp trực tuyến nhưng phải gửi bổ sung bản giấy;
- phải chứng thực điện tử;
- phương thức khác nhau có thành phần hồ sơ khác nhau;
- nhận kết quả theo nhiều luồng với điều kiện riêng.

## 8. Quy tắc C6 – Nhiều tác nhân

Phải phân biệt **có tên cơ quan** với **thực sự có phối hợp trong quy trình**.

Bằng chứng mạnh:

- `phối hợp`;
- `xin ý kiến`;
- `thẩm định` / `thẩm tra`;
- `xác minh` / `đối chiếu`;
- `hội đồng`;
- `trình` / `phê duyệt`;
- hồ sơ chuyển qua nhiều cơ quan/đơn vị;
- cơ quan thực hiện, cơ quan có thẩm quyền, cơ quan phối hợp khác nhau.

Số lượng department chỉ là bằng chứng phụ. 29 department được khai báo nhưng không có dấu vết quy trình tương ứng không nên mặc nhiên = C6 tối đa.

## 9. Quy đổi TCI

Mỗi C1–C6 chấm 0–5.

`TCI = (C1×20 + C2×20 + C3×15 + C4×15 + C5×10 + C6×20) / 5`

Kết quả trong khoảng 0–100.

Sao tham chiếu:

- 0–20: 1★
- >20–40: 2★
- >40–60: 3★
- >60–80: 4★
- >80–100: 5★

## 10. Không được khóa ngưỡng chỉ từ 30 mẫu

30 Golden Cases dùng để:

1. tìm anchor thấp/trung/cao;
2. phát hiện tiêu chí bị đếm trùng;
3. kiểm tra tính đơn điệu: thủ tục rõ ràng phức tạp hơn không được nhận điểm thấp hơn vô lý;
4. kiểm tra trường hợp dữ liệu lỗi;
5. điều chỉnh ngưỡng để toàn bộ thang điểm sử dụng được.

Sau Golden Cases cần kiểm tra lại trên toàn bộ 6.258 TTHC trước khi đưa TCI vào production.

## 11. Trạng thái kết quả

- `CALCULATED`: đủ bằng chứng cho các tiêu chí chính.
- `REVIEW_REQUIRED`: có một hoặc nhiều xung đột/mismatch cần xem xét.
- `INSUFFICIENT_DATA`: thiếu dữ liệu quan trọng cho một hoặc nhiều tiêu chí.
- `INVALID`: JSON hoặc cấu trúc dữ liệu không hợp lệ.

TCI production chỉ công bố điểm khi quy tắc dữ liệu đã xác định rõ cách xử lý trạng thái trên.
