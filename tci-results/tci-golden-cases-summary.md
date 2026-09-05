# TCI V1 – Golden Cases

- Candidate: **50**
- Golden Cases: **30**
- Random: **Không**
- Quota tổng: **30**
- Chưa tính điểm TCI.

## Coverage

- ✅ G12_VERY_SIMPLE: 2/2
- ✅ G01_SIMPLE_STEPS: 5/2
- ✅ G03_FEW_PROFILES: 3/2
- ✅ G02_MANY_STEPS: 4/3
- ✅ G04_MANY_PROFILES: 7/3
- ✅ G05_SHORT_TIME: 4/2
- ✅ G06_LONG_TIME: 2/2
- ✅ G07_MULTIPLE_METHODS: 4/2
- ✅ G08_COMPLEX_CONDITIONS: 4/3
- ✅ G09_MANY_ACTORS: 2/2
- ✅ G10_EXECUTION_CASES: 6/2
- ✅ G11_ANOMALIES: 2/2
- ✅ G13_VERY_COMPLEX: 6/3

## Golden Cases

1. **1.014977 — Chủ tịch, Phó Chủ tịch UBND tỉnh tiếp khách nước ngoài**
   - Bước: 1; Hồ sơ: 0; Phương thức: 1; Cases: 1; Thời gian: 0
   - Điều kiện: 0; Tác nhân: 4; Anomaly: 1
   - Nhóm: G12_VERY_SIMPLE
   - Lý do: Chọn từ G12_VERY_SIMPLE; Bắt buộc có mẫu rất đơn giản; Golden anchor: G12_VERY_SIMPLE

2. **1.014978 — Chủ tịch, Phó Chủ tịch UBND tỉnh tiếp khách trong nước**
   - Bước: 1; Hồ sơ: 0; Phương thức: 1; Cases: 1; Thời gian: 0
   - Điều kiện: 0; Tác nhân: 4; Anomaly: 1
   - Nhóm: G12_VERY_SIMPLE
   - Lý do: Chọn từ G12_VERY_SIMPLE; Bắt buộc có mẫu rất đơn giản; Golden anchor: G12_VERY_SIMPLE

3. **1.000253 — Khai báo tạm trú cho người nước ngoài tại Việt Nam bằng Phiếu khai báo tạm trú**
   - Bước: 1; Hồ sơ: 1; Phương thức: 1; Cases: 2; Thời gian: 7
   - Điều kiện: 1; Tác nhân: 1; Anomaly: 0
   - Nhóm: G01_SIMPLE_STEPS, G03_FEW_PROFILES
   - Lý do: Chọn từ G01_SIMPLE_STEPS; Chọn từ G03_FEW_PROFILES; Bắt buộc coverage ít hồ sơ; Golden anchor: G01_SIMPLE_STEPS

4. **1.000771 — Gia hạn tạm trú cho người đã được cấp giấy miễn thị thực tại Cục Quản lý xuất nhập cảnh Bộ Công an**
   - Bước: 1; Hồ sơ: 4; Phương thức: 3; Cases: 1; Thời gian: 5
   - Điều kiện: 6; Tác nhân: 1; Anomaly: 0
   - Nhóm: G01_SIMPLE_STEPS, G07_MULTIPLE_METHODS
   - Lý do: Chọn từ G01_SIMPLE_STEPS; Chọn từ G07_MULTIPLE_METHODS; Bắt buộc coverage nhiều phương thức; Golden anchor: G01_SIMPLE_STEPS

5. **1.001445 — Trình báo mất hộ chiếu phổ thông (thực hiện tại cấp tỉnh)**
   - Bước: 1; Hồ sơ: 1; Phương thức: 3; Cases: 1; Thời gian: 1
   - Điều kiện: 11; Tác nhân: 1; Anomaly: 0
   - Nhóm: G03_FEW_PROFILES, G05_SHORT_TIME, G07_MULTIPLE_METHODS
   - Lý do: Chọn từ G03_FEW_PROFILES; Chọn từ G05_SHORT_TIME; Chọn từ G07_MULTIPLE_METHODS; Bắt buộc coverage thời gian ngắn; Golden anchor: G03_FEW_PROFILES

6. **1.010386 — Trình báo mất hộ chiếu phổ thông (thực hiện tại cấp xã)**
   - Bước: 1; Hồ sơ: 1; Phương thức: 3; Cases: 1; Thời gian: 1
   - Điều kiện: 11; Tác nhân: 1; Anomaly: 0
   - Nhóm: G03_FEW_PROFILES, G05_SHORT_TIME
   - Lý do: Chọn từ G03_FEW_PROFILES; Chọn từ G05_SHORT_TIME; Bắt buộc coverage ít hồ sơ; Golden anchor: G03_FEW_PROFILES

7. **1.115797 — Giao đất, cho thuê đất, chuyển mục đích sử dụng đất đối với trường hợp giao đất, cho thuê đất không đấu giá quyền sử dụng đất, không đấu thầu lựa chọn nhà đầu tư thực hiện dự án có sử dụng đất; trường hợp giao đất, cho thuê đất thông qua đấu thầu lựa chọn nhà đầu tư thực hiện dự án có sử dụng đất; giao đất và giao rừng; cho thuê đất và cho thuê rừng; gia hạn sử dụng đất khi hết thời hạn sử dụng đất; trường hợp giao đất, cho thuê đất thông qua hình thức đấu giá quyền sử dụng đất (cấp tỉnh)**
   - Bước: 16; Hồ sơ: 15; Phương thức: 3; Cases: 9; Thời gian: 15–24
   - Điều kiện: 33; Tác nhân: 1; Anomaly: 1
   - Nhóm: G02_MANY_STEPS, G13_VERY_COMPLEX
   - Lý do: Chọn từ G02_MANY_STEPS; Chọn từ G13_VERY_COMPLEX; Bắt buộc coverage nhiều bước; Golden anchor: G02_MANY_STEPS

8. **3.000671 — Đăng ký, cấp Giấy chứng nhận đối với thửa đất có diện tích tăng thêm do thay đổi ranh giới so với Giấy chứng nhận đã cấp (quy định tại điểm b và điểm c khoản 2 Điều 24 Nghị định số 101/2024/NĐ-CP và khoản 4 Điều 24 Nghị định số 101/2024/NĐ-CP)**
   - Bước: 19; Hồ sơ: 0; Phương thức: 3; Cases: 1; Thời gian: 30
   - Điều kiện: 0; Tác nhân: 1; Anomaly: 1
   - Nhóm: G02_MANY_STEPS
   - Lý do: Chọn từ G02_MANY_STEPS; Bắt buộc coverage nhiều bước; Golden anchor: G02_MANY_STEPS

9. **3.000579 — Giải quyết trợ cấp hằng tháng đối với thanh niên xung phong đã hoàn thành nhiệm vụ trong kháng chiến trở về địa phương (khoản01 Điều 09 Nghị Quyếtsố 182/2025/NQHĐND)**
   - Bước: 14; Hồ sơ: 3; Phương thức: 3; Cases: 1; Thời gian: 7
   - Điều kiện: 7; Tác nhân: 2; Anomaly: 0
   - Nhóm: G02_MANY_STEPS
   - Lý do: Chọn từ G02_MANY_STEPS; Bắt buộc coverage nhiều bước; Golden anchor: G02_MANY_STEPS

10. **2.002011 — Đăng ký thay đổi: thành viên hợp danh; thành viên công ty trách nhiệm hữu hạn hai thành viên trở lên; người đại diện theo pháp luật của công ty trách nhiệm hữu hạn, công ty cổ phần; chủ sở hữu công ty trách nhiệm hữu hạn một thành viên; chủ doanh nghiệp tư nhân trong trường hợp bán, tặng cho doanh nghiệp, chủ doanh nghiệp chết**
   - Bước: 3; Hồ sơ: 115; Phương thức: 3; Cases: 26; Thời gian: 3
   - Điều kiện: 38; Tác nhân: 1; Anomaly: 0
   - Nhóm: G04_MANY_PROFILES, G10_EXECUTION_CASES, G13_VERY_COMPLEX
   - Lý do: Chọn từ G04_MANY_PROFILES; Chọn từ G10_EXECUTION_CASES; Chọn từ G13_VERY_COMPLEX; Bắt buộc coverage executionCases; Golden anchor: G04_MANY_PROFILES

11. **1.004881 — Cấp Giấy chứng nhận lưu hành thuốc thú y; Cấp lại Giấy chứng nhận lưu hành thuốc thú y (trong trường hợp thay đổi thành phần, công thức, dạng bào chế, đường dùng, liều dùng, chỉ định điều trị của thuốc thú y; thay đổi phương pháp, quy trình sản xuất mà làm thay đổi chất lượng sản phẩm; đánh giá lại chất lượng, hiệu quả, độ an toàn của thuốc thú y theo quy định)**
   - Bước: 1; Hồ sơ: 77; Phương thức: 3; Cases: 8; Thời gian: 0
   - Điều kiện: 0; Tác nhân: 1; Anomaly: 0
   - Nhóm: G04_MANY_PROFILES
   - Lý do: Chọn từ G04_MANY_PROFILES; Bắt buộc coverage nhiều hồ sơ; Golden anchor: G04_MANY_PROFILES

12. **1.014199 — Cấp giấy phép lao động đối với người lao động nước ngoài làm việc tại Việt Nam**
   - Bước: 3; Hồ sơ: 66; Phương thức: 3; Cases: 14; Thời gian: 3–10
   - Điều kiện: 19; Tác nhân: 2; Anomaly: 1
   - Nhóm: G04_MANY_PROFILES, G10_EXECUTION_CASES
   - Lý do: Chọn từ G04_MANY_PROFILES; Chọn từ G10_EXECUTION_CASES; Bắt buộc coverage nhiều hồ sơ; Golden anchor: G04_MANY_PROFILES

13. **1.001226 — Cấp giấy phép đến các tỉnh, thành phố của Việt Nam cho công dân Lào nhập cảnh bằng Giấy thông hành biên giới tại Công an cấp tỉnh**
   - Bước: 1; Hồ sơ: 2; Phương thức: 1; Cases: 1; Thời gian: 1
   - Điều kiện: 3; Tác nhân: 2; Anomaly: 0
   - Nhóm: G01_SIMPLE_STEPS, G05_SHORT_TIME
   - Lý do: Chọn từ G01_SIMPLE_STEPS; Chọn từ G05_SHORT_TIME; Bắt buộc coverage thời gian ngắn; Golden anchor: G05_SHORT_TIME

14. **1.003677 — Khai báo tạm vắng**
   - Bước: 1; Hồ sơ: 3; Phương thức: 1; Cases: 2; Thời gian: 1–2
   - Điều kiện: 8; Tác nhân: 1; Anomaly: 1
   - Nhóm: G05_SHORT_TIME
   - Lý do: Chọn từ G05_SHORT_TIME; Bắt buộc coverage thời gian ngắn; Golden anchor: G05_SHORT_TIME

15. **1.014999 — Thủ tục đăng ký sáng chế**
   - Bước: 1; Hồ sơ: 8; Phương thức: 3; Cases: 2; Thời gian: 420
   - Điều kiện: 18; Tác nhân: 2; Anomaly: 0
   - Nhóm: G06_LONG_TIME
   - Lý do: Chọn từ G06_LONG_TIME; Bắt buộc coverage thời gian dài; Golden anchor: G06_LONG_TIME

16. **1.015003 — Thủ tục xử lý đơn Madrid có chỉ định Việt Nam**
   - Bước: 1; Hồ sơ: 0; Phương thức: 3; Cases: 1; Thời gian: 360
   - Điều kiện: 19; Tác nhân: 2; Anomaly: 1
   - Nhóm: G06_LONG_TIME
   - Lý do: Chọn từ G06_LONG_TIME; Bắt buộc coverage thời gian dài; Golden anchor: G06_LONG_TIME

17. **1.000807 — Cấp lại giấy miễn thị thực tại Cục Quản lý xuất nhập cảnh, Bộ Công an**
   - Bước: 1; Hồ sơ: 9; Phương thức: 3; Cases: 2; Thời gian: 5
   - Điều kiện: 8; Tác nhân: 1; Anomaly: 0
   - Nhóm: G01_SIMPLE_STEPS, G07_MULTIPLE_METHODS
   - Lý do: Chọn từ G01_SIMPLE_STEPS; Chọn từ G07_MULTIPLE_METHODS; Bắt buộc coverage nhiều phương thức; Golden anchor: G07_MULTIPLE_METHODS

18. **1.000811 — Cấp mới thẻ ABTC (thực hiện tại cấp trung ương)**
   - Bước: 1; Hồ sơ: 5; Phương thức: 3; Cases: 1; Thời gian: 21
   - Điều kiện: 12; Tác nhân: 1; Anomaly: 1
   - Nhóm: G01_SIMPLE_STEPS, G07_MULTIPLE_METHODS
   - Lý do: Chọn từ G01_SIMPLE_STEPS; Chọn từ G07_MULTIPLE_METHODS; Bắt buộc coverage nhiều phương thức; Golden anchor: G07_MULTIPLE_METHODS

19. **1.013742 — Cấp giấy đăng ký lưu hành thuốc, nguyên liệu làm thuốc**
   - Bước: 6; Hồ sơ: 48; Phương thức: 3; Cases: 2; Thời gian: 12
   - Điều kiện: 47; Tác nhân: 1; Anomaly: 0
   - Nhóm: G04_MANY_PROFILES, G08_COMPLEX_CONDITIONS, G13_VERY_COMPLEX
   - Lý do: Chọn từ G04_MANY_PROFILES; Chọn từ G08_COMPLEX_CONDITIONS; Chọn từ G13_VERY_COMPLEX; Bắt buộc coverage điều kiện/nhánh; Golden anchor: G08_COMPLEX_CONDITIONS

20. **1.007659 — Thủ tục miễn thuế đối với hàng hóa xuất khẩu, nhập khẩu**
   - Bước: 1; Hồ sơ: 43; Phương thức: 3; Cases: 14; Thời gian: UNKNOWN
   - Điều kiện: 46; Tác nhân: 1; Anomaly: 0
   - Nhóm: G08_COMPLEX_CONDITIONS, G10_EXECUTION_CASES, G13_VERY_COMPLEX
   - Lý do: Chọn từ G08_COMPLEX_CONDITIONS; Chọn từ G10_EXECUTION_CASES; Chọn từ G13_VERY_COMPLEX; Bắt buộc coverage điều kiện/nhánh; Golden anchor: G08_COMPLEX_CONDITIONS

21. **1.009646 — Thủ tục chấp thuận điều chỉnh chủ trương đầu tư thuộc thẩm quyền của Chủ tịch Uỷ ban nhân dân cấp tỉnh**
   - Bước: 3; Hồ sơ: 46; Phương thức: 3; Cases: 11; Thời gian: 17
   - Điều kiện: 45; Tác nhân: 2; Anomaly: 0
   - Nhóm: G04_MANY_PROFILES, G08_COMPLEX_CONDITIONS, G13_VERY_COMPLEX
   - Lý do: Chọn từ G04_MANY_PROFILES; Chọn từ G08_COMPLEX_CONDITIONS; Chọn từ G13_VERY_COMPLEX; Bắt buộc coverage điều kiện/nhánh; Golden anchor: G08_COMPLEX_CONDITIONS

22. **1.116389 — Đăng ký, cấp Giấy chứng nhận đối với thửa đất có diện tích tăng thêm do thay đổi ranh giới so với Giấy chứng nhận đã cấp (đối với trường hợp quy định tại điểm a khoản 2 Điều 24 Nghị định số 101/2024/NĐ-CP).**
   - Bước: 1; Hồ sơ: 4; Phương thức: 3; Cases: 1; Thời gian: 10
   - Điều kiện: 4; Tác nhân: 29; Anomaly: 0
   - Nhóm: G09_MANY_ACTORS
   - Lý do: Chọn từ G09_MANY_ACTORS; Bắt buộc coverage nhiều tác nhân; Golden anchor: G09_MANY_ACTORS

23. **1.116400 — Tách thửa đất, hợp thửa đất**
   - Bước: 1; Hồ sơ: 5; Phương thức: 3; Cases: 1; Thời gian: 12
   - Điều kiện: 2; Tác nhân: 29; Anomaly: 0
   - Nhóm: G09_MANY_ACTORS
   - Lý do: Chọn từ G09_MANY_ACTORS; Bắt buộc coverage nhiều tác nhân; Golden anchor: G09_MANY_ACTORS

24. **1.001667 — Giải quyết hưởng chế độ ốm đau, thai sản, trợ cấp dưỡng sức phục hồi sức khỏe sau ốm đau, thai sản, TNLĐ, BNN**
   - Bước: 3; Hồ sơ: 48; Phương thức: 3; Cases: 28; Thời gian: 6
   - Điều kiện: 0; Tác nhân: 2; Anomaly: 0
   - Nhóm: G04_MANY_PROFILES, G10_EXECUTION_CASES
   - Lý do: Chọn từ G04_MANY_PROFILES; Chọn từ G10_EXECUTION_CASES; Bắt buộc coverage executionCases; Golden anchor: G10_EXECUTION_CASES

25. **1.116038 — Đăng ký thay đổi nội dung, cập nhật, bổ sung thông tin, cấp lại giấy chứng nhận, hiệu đính thông tin đăng ký hoạt động của Ngân hàng Chính sách xã hội, chi nhánh, phòng giao dịch Ngân hàng Chính sách xã hội. Đăng ký hoạt động lần đầu của chi nhánh, phòng giao dịch Ngân hàng Chính sách xã hội**
   - Bước: 3; Hồ sơ: 33; Phương thức: 3; Cases: 22; Thời gian: UNKNOWN
   - Điều kiện: 27; Tác nhân: 1; Anomaly: 0
   - Nhóm: G10_EXECUTION_CASES
   - Lý do: Chọn từ G10_EXECUTION_CASES; Bắt buộc coverage executionCases; Golden anchor: G10_EXECUTION_CASES

26. **3.000654 — Đăng ký, cấp Giấy chứng nhận đối với trường hợp chuyển nhượng dự án đầu tư có sử dụng đất**
   - Bước: 6; Hồ sơ: 0; Phương thức: 3; Cases: 1; Thời gian: 18–30
   - Điều kiện: 0; Tác nhân: 1; Anomaly: 2
   - Nhóm: G11_ANOMALIES
   - Lý do: Chọn từ G11_ANOMALIES; Bổ sung anomaly để audit; Golden anchor: G11_ANOMALIES

27. **3.000650 — Đăng ký biến động đối với trường hợp thay đổi quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất theo thỏa thuận của các thành viên hộ gia đình hoặc của vợ và chồng; quyền sử dụng đất xây dựng công trình trên mặt đất phục vụ cho việc vận hành, khai thác sử dụng công trình ngầm, quyền sở hữu công trình ngầm; bán tài sản, điều chuyển, chuyển nhượng quyền sử dụng đất là tài sản công theo quy định của pháp luật về quản lý, sử dụng tài sản công; nhận quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất theo kết quả giải quyết tranh chấp, khiếu nại, tố cáo về đất đai hoặc bản án, quyết định của Tòa án, quyết định thi hành án của cơ quan thi hành án đã được thi hành; quyết định hoặc phán quyết của Trọng tài thương mại Việt Nam về giải quyết tranh chấp giữa các bên phát sinh từ hoạt động thương mại liên quan đến đất đai; nhận quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất do xử lý tài sản thế chấp là quyền sử dụng đất, tài sản gắn liền với đất đã được đăng ký, bao gồm cả xử lý khoản nợ có nguồn gốc từ khoản nợ xấu của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài**
   - Bước: 5; Hồ sơ: 0; Phương thức: 3; Cases: 1; Thời gian: 18–20
   - Điều kiện: 0; Tác nhân: 1; Anomaly: 2
   - Nhóm: G11_ANOMALIES
   - Lý do: Chọn từ G11_ANOMALIES; Bổ sung anomaly để audit; Golden anchor: G11_ANOMALIES

28. **1.009628 — Thủ tục điều chỉnh dự án đầu tư thuộc thẩm quyền chấp thuận chủ trương đầu tư của Thủ tướng Chính phủ**
   - Bước: 2; Hồ sơ: 50; Phương thức: 3; Cases: 9; Thời gian: 25
   - Điều kiện: 45; Tác nhân: 2; Anomaly: 0
   - Nhóm: G04_MANY_PROFILES, G08_COMPLEX_CONDITIONS, G13_VERY_COMPLEX
   - Lý do: Chọn từ G04_MANY_PROFILES; Chọn từ G08_COMPLEX_CONDITIONS; Chọn từ G13_VERY_COMPLEX; Bắt buộc coverage điều kiện/nhánh; Golden anchor: G13_VERY_COMPLEX

29. **2.000575 — Cấp lại Giấy chứng nhận đăng ký hộ kinh doanh, Cấp đổi sang Giấy chứng nhận đăng ký hộ kinh doanh**
   - Bước: 2; Hồ sơ: 38; Phương thức: 3; Cases: 18; Thời gian: 3
   - Điều kiện: 11; Tác nhân: 1; Anomaly: 0
   - Nhóm: G10_EXECUTION_CASES
   - Lý do: Chọn từ G10_EXECUTION_CASES; Bắt buộc coverage executionCases; Golden bổ sung để lấp coverage

30. **1.013285 — Thủ tục chấp thuận độ cao công trình**
   - Bước: 14; Hồ sơ: 3; Phương thức: 3; Cases: 1; Thời gian: 10–30
   - Điều kiện: 5; Tác nhân: 1; Anomaly: 1
   - Nhóm: G02_MANY_STEPS
   - Lý do: Chọn từ G02_MANY_STEPS; Bắt buộc coverage nhiều bước; Golden bổ sung để lấp coverage

