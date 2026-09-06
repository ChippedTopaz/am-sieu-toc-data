# TCI V1 — DVC Mapping Input Schema

## Mục đích

Bảng này là nguồn dữ liệu bổ sung để xác định **Mức độ cung cấp DVC** cho một TTHC. JSON chi tiết TTHC không được dùng để suy ra Toàn trình/Một phần.

## Các cột nguồn

| Thứ tự | Tên cột | Vai trò TCI |
|---:|---|---|
| 1 | STT | Metadata, không dùng để match |
| 2 | MaTTHC | **Khóa ghép chính với `details/*.json`** (`code`) |
| 3 | Tên TTHC | Kiểm tra đối chiếu, không dùng làm khóa chính |
| 4 | MaDVC | Mã dịch vụ công tương ứng |
| 5 | TenDVC | Tên DVC |
| 6 | TenCQTH | Tên cơ quan thực hiện |
| 7 | MaCQTH | Mã cơ quan thực hiện |
| 8 | MucDo | **Nguồn xác định mức DVC: Toàn trình / Một phần / Chưa cung cấp** |
| 9 | Trạng thái | Metadata |
| 10 | LinhVuc | Metadata |
| 11 | LoaiHeThong | Metadata |
| 12 | CapThucHien | Metadata |
| 13 | Citizen URL | Metadata |
| 14 | Cơ quan công bố | Metadata |
| 15 | Cập nhật lúc... | Metadata |

## Quy tắc C5

### Bước 1 — kiểm tra khả năng thực hiện trực tuyến từ JSON TTHC

Nguồn: `executionMethods[].submissionMethod`.

- Có ít nhất một giá trị `ONLINE` → `hasOnlineSubmission = true`.
- Không có `ONLINE` → `hasOnlineSubmission = false` và mức DVC được coi là `NONE`.

Không dùng `isFullProcess`, `returningMethods`, `isOfflineOnly` hoặc `formalityType` để quyết định có phải DVC trực tuyến hay không.

### Bước 2 — khi có ONLINE, tra bảng DVC mapping

Match:

```text
JSON.code (mã TTHC)
        ↓
DVC mapping.MaTTHC
        ↓
MaDVC + MucDo
```

Chuẩn hóa `MucDo`:

- `Toàn trình` → `FULL`
- `Một phần` → `PARTIAL`
- `Chưa cung cấp`, `Không cung cấp`, hoặc giá trị tương đương đã được cấu hình → `NONE`
- Trống/không nhận diện → `UNKNOWN`

### Nhiều dòng cho cùng một MaTTHC

Một `MaTTHC` có thể xuất hiện nhiều lần do khác cơ quan thực hiện hoặc khác dòng dữ liệu. Không được chọn dòng đầu tiên.

- Nếu tất cả dòng hợp lệ đều cho cùng một `MucDo` → dùng mức đó.
- Nếu có nhiều mức khác nhau (`FULL` và `PARTIAL`, hoặc mức mâu thuẫn khác) → `dvcMappingStatus = CONFLICT`, `implementLevel = UNKNOWN` và đưa vào audit.
- Nếu có nhiều `MaDVC` nhưng cùng `MucDo` → hợp lệ; lưu toàn bộ `dvcCodes` để truy vết.
- Nếu TTHC có ONLINE nhưng không tìm thấy `MaTTHC` trong mapping → `dvcMappingStatus = NOT_FOUND`, `implementLevel = UNKNOWN`; tuyệt đối không tự suy ra FULL/PARTIAL.

## C5-A

`implementLevel` chỉ là kết quả sau bước enrich:

- `FULL` → 40 điểm
- `PARTIAL` → 30 điểm
- `NONE` → 0 điểm
- `UNKNOWN/CONFLICT/INVALID` → chưa chấm thành phần này; phải audit/enrich lại

`hasOnlineSubmission` là một tín hiệu riêng, không phải cách thay thế cho `implementLevel`.

## File đầu vào chuẩn khuyến nghị

```text
tci/input/dvc-mapping.csv
```

CSV có thể giữ nguyên BOM UTF-8 ở cột đầu tiên (`﻿STT`). Header tối thiểu bắt buộc để TCI chạy là:

```text
MaTTHC,MaDVC,MucDo
```

Các cột còn lại được giữ để truy vết và đối chiếu.
