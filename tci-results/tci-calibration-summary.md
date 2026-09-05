# TCI V1 – Calibration Sample Report

- Tổng JSON trong details: **6258**
- Phân tích thành công: **6258**
- Số mẫu chọn: **50**
- Random: **Không**
- Chưa tính điểm TCI.

## Coverage

- ✅ G01_SIMPLE_STEPS: 6
- ✅ G02_MANY_STEPS: 4
- ✅ G03_FEW_PROFILES: 3
- ✅ G04_MANY_PROFILES: 7
- ✅ G05_SHORT_TIME: 4
- ✅ G06_LONG_TIME: 3
- ✅ G07_MULTIPLE_METHODS: 5
- ✅ G08_COMPLEX_CONDITIONS: 4
- ✅ G09_MANY_ACTORS: 4
- ✅ G10_EXECUTION_CASES: 6
- ✅ G11_ANOMALIES: 15
- ✅ G12_VERY_SIMPLE: 4
- ✅ G13_VERY_COMPLEX: 6

## 50 mẫu

1. **1.000005 — Thủ tục hải quan đối với khí, nguyên liệu xuất khẩu, nhập khẩu bằng đường ống chuyên dụng**
   - Bước: 1; Hồ sơ: 19; Phương thức: 1; Cases: 3; Thời gian: 1
   - Điều kiện signal: 0; Actor signal: 1; Cảnh báo: 0
   - Nhóm: G14_DETERMINISTIC_SPREAD

2. **1.000253 — Khai báo tạm trú cho người nước ngoài tại Việt Nam bằng Phiếu khai báo tạm trú**
   - Bước: 1; Hồ sơ: 1; Phương thức: 1; Cases: 2; Thời gian: 7
   - Điều kiện signal: 1; Actor signal: 1; Cảnh báo: 0
   - Nhóm: G01_SIMPLE_STEPS, G03_FEW_PROFILES

3. **1.000564 — Thủ tục xét tặng “Giải thưởng Nhà nước” về văn học, nghệ thuật**
   - Bước: 1; Hồ sơ: 6; Phương thức: 3; Cases: 1; Thời gian: 305
   - Điều kiện signal: 0; Actor signal: 3; Cảnh báo: 0
   - Nhóm: G06_LONG_TIME

4. **1.000771 — Gia hạn tạm trú cho người đã được cấp giấy miễn thị thực tại Cục Quản lý xuất nhập cảnh Bộ Công an**
   - Bước: 1; Hồ sơ: 4; Phương thức: 3; Cases: 1; Thời gian: 5
   - Điều kiện signal: 6; Actor signal: 1; Cảnh báo: 0
   - Nhóm: G01_SIMPLE_STEPS, G07_MULTIPLE_METHODS

5. **1.000807 — Cấp lại giấy miễn thị thực tại Cục Quản lý xuất nhập cảnh, Bộ Công an**
   - Bước: 1; Hồ sơ: 9; Phương thức: 3; Cases: 2; Thời gian: 5
   - Điều kiện signal: 8; Actor signal: 1; Cảnh báo: 0
   - Nhóm: G01_SIMPLE_STEPS, G07_MULTIPLE_METHODS

6. **1.000811 — Cấp mới thẻ ABTC (thực hiện tại cấp trung ương)**
   - Bước: 1; Hồ sơ: 5; Phương thức: 3; Cases: 1; Thời gian: 21
   - Điều kiện signal: 12; Actor signal: 1; Cảnh báo: 1 (PROCESSING_TIME_MULTI_SOURCE)
   - Nhóm: G01_SIMPLE_STEPS, G07_MULTIPLE_METHODS

7. **1.001146 — Gia hạn tạm trú cho người nước ngoài tại Việt Nam (thực hiện tại cấp tỉnh)**
   - Bước: 1; Hồ sơ: 3; Phương thức: 3; Cases: 1; Thời gian: 5
   - Điều kiện signal: 8; Actor signal: 1; Cảnh báo: 0
   - Nhóm: G01_SIMPLE_STEPS, G07_MULTIPLE_METHODS

8. **1.001226 — Cấp giấy phép đến các tỉnh, thành phố của Việt Nam cho công dân Lào nhập cảnh bằng Giấy thông hành biên giới tại Công an cấp tỉnh**
   - Bước: 1; Hồ sơ: 2; Phương thức: 1; Cases: 1; Thời gian: 1
   - Điều kiện signal: 3; Actor signal: 2; Cảnh báo: 0
   - Nhóm: G01_SIMPLE_STEPS, G05_SHORT_TIME

9. **1.001445 — Trình báo mất hộ chiếu phổ thông (thực hiện tại cấp tỉnh)**
   - Bước: 1; Hồ sơ: 1; Phương thức: 3; Cases: 1; Thời gian: 1
   - Điều kiện signal: 11; Actor signal: 1; Cảnh báo: 0
   - Nhóm: G03_FEW_PROFILES, G05_SHORT_TIME, G07_MULTIPLE_METHODS

10. **1.001667 — Giải quyết hưởng chế độ ốm đau, thai sản, trợ cấp dưỡng sức phục hồi sức khỏe sau ốm đau, thai sản, TNLĐ, BNN**
   - Bước: 3; Hồ sơ: 48; Phương thức: 3; Cases: 28; Thời gian: 6
   - Điều kiện signal: 0; Actor signal: 2; Cảnh báo: 0
   - Nhóm: G04_MANY_PROFILES, G10_EXECUTION_CASES

11. **1.003677 — Khai báo tạm vắng**
   - Bước: 1; Hồ sơ: 3; Phương thức: 1; Cases: 2; Thời gian: 1–2
   - Điều kiện signal: 8; Actor signal: 1; Cảnh báo: 1 (PROCESSING_TIME_CONFLICT_SAME_METHOD)
   - Nhóm: G05_SHORT_TIME

12. **1.004881 — Cấp Giấy chứng nhận lưu hành thuốc thú y; Cấp lại Giấy chứng nhận lưu hành thuốc thú y (trong trường hợp thay đổi thành phần, công thức, dạng bào chế, đường dùng, liều dùng, chỉ định điều trị của thuốc thú y; thay đổi phương pháp, quy trình sản xuất mà làm thay đổi chất lượng sản phẩm; đánh giá lại chất lượng, hiệu quả, độ an toàn của thuốc thú y theo quy định)**
   - Bước: 1; Hồ sơ: 77; Phương thức: 3; Cases: 8; Thời gian: 0
   - Điều kiện signal: 0; Actor signal: 1; Cảnh báo: 0
   - Nhóm: G04_MANY_PROFILES

13. **1.007659 — Thủ tục miễn thuế đối với hàng hóa xuất khẩu, nhập khẩu**
   - Bước: 1; Hồ sơ: 43; Phương thức: 3; Cases: 14; Thời gian: UNKNOWN
   - Điều kiện signal: 46; Actor signal: 1; Cảnh báo: 0
   - Nhóm: G08_COMPLEX_CONDITIONS, G10_EXECUTION_CASES, G13_VERY_COMPLEX

14. **1.009628 — Thủ tục điều chỉnh dự án đầu tư thuộc thẩm quyền chấp thuận chủ trương đầu tư của Thủ tướng Chính phủ**
   - Bước: 2; Hồ sơ: 50; Phương thức: 3; Cases: 9; Thời gian: 25
   - Điều kiện signal: 45; Actor signal: 2; Cảnh báo: 0
   - Nhóm: G04_MANY_PROFILES, G08_COMPLEX_CONDITIONS, G13_VERY_COMPLEX

15. **1.009646 — Thủ tục chấp thuận điều chỉnh chủ trương đầu tư thuộc thẩm quyền của Chủ tịch Uỷ ban nhân dân cấp tỉnh**
   - Bước: 3; Hồ sơ: 46; Phương thức: 3; Cases: 11; Thời gian: 17
   - Điều kiện signal: 45; Actor signal: 2; Cảnh báo: 0
   - Nhóm: G04_MANY_PROFILES, G08_COMPLEX_CONDITIONS, G13_VERY_COMPLEX

16. **1.010386 — Trình báo mất hộ chiếu phổ thông (thực hiện tại cấp xã)**
   - Bước: 1; Hồ sơ: 1; Phương thức: 3; Cases: 1; Thời gian: 1
   - Điều kiện signal: 11; Actor signal: 1; Cảnh báo: 0
   - Nhóm: G03_FEW_PROFILES, G05_SHORT_TIME

17. **1.013285 — Thủ tục chấp thuận độ cao công trình**
   - Bước: 14; Hồ sơ: 3; Phương thức: 3; Cases: 1; Thời gian: 10–30
   - Điều kiện signal: 5; Actor signal: 1; Cảnh báo: 1 (PROCESSING_TIME_CONFLICT_SAME_METHOD)
   - Nhóm: G02_MANY_STEPS

18. **1.013742 — Cấp giấy đăng ký lưu hành thuốc, nguyên liệu làm thuốc**
   - Bước: 6; Hồ sơ: 48; Phương thức: 3; Cases: 2; Thời gian: 12
   - Điều kiện signal: 47; Actor signal: 1; Cảnh báo: 0
   - Nhóm: G04_MANY_PROFILES, G08_COMPLEX_CONDITIONS, G13_VERY_COMPLEX

19. **1.014199 — Cấp giấy phép lao động đối với người lao động nước ngoài làm việc tại Việt Nam**
   - Bước: 3; Hồ sơ: 66; Phương thức: 3; Cases: 14; Thời gian: 3–10
   - Điều kiện signal: 19; Actor signal: 2; Cảnh báo: 1 (PROCESSING_TIME_CONFLICT_SAME_METHOD)
   - Nhóm: G04_MANY_PROFILES, G10_EXECUTION_CASES

20. **1.014977 — Chủ tịch, Phó Chủ tịch UBND tỉnh tiếp khách nước ngoài**
   - Bước: 1; Hồ sơ: 0; Phương thức: 1; Cases: 1; Thời gian: 0
   - Điều kiện signal: 0; Actor signal: 4; Cảnh báo: 1 (EMPTY_PROFILE_COMPONENTS)
   - Nhóm: G12_VERY_SIMPLE

21. **1.014978 — Chủ tịch, Phó Chủ tịch UBND tỉnh tiếp khách trong nước**
   - Bước: 1; Hồ sơ: 0; Phương thức: 1; Cases: 1; Thời gian: 0
   - Điều kiện signal: 0; Actor signal: 4; Cảnh báo: 1 (EMPTY_PROFILE_COMPONENTS)
   - Nhóm: G12_VERY_SIMPLE

22. **1.014999 — Thủ tục đăng ký sáng chế**
   - Bước: 1; Hồ sơ: 8; Phương thức: 3; Cases: 2; Thời gian: 420
   - Điều kiện signal: 18; Actor signal: 2; Cảnh báo: 0
   - Nhóm: G06_LONG_TIME

23. **1.015003 — Thủ tục xử lý đơn Madrid có chỉ định Việt Nam**
   - Bước: 1; Hồ sơ: 0; Phương thức: 3; Cases: 1; Thời gian: 360
   - Điều kiện signal: 19; Actor signal: 2; Cảnh báo: 1 (EMPTY_PROFILE_COMPONENTS)
   - Nhóm: G06_LONG_TIME

24. **1.115353 — Thu hồi Giấy chứng nhận đã cấp không đúng quy định của pháp luật đất đai do người sử dụng đất, chủ sở hữu tài sản gắn liền với đất phát hiện và cấp lại Giấy chứng nhận sau khi thu hồi**
   - Bước: 2; Hồ sơ: 2; Phương thức: 3; Cases: 1; Thời gian: 26.5–30
   - Điều kiện signal: 0; Actor signal: 29; Cảnh báo: 1 (PROCESSING_TIME_CONFLICT_SAME_METHOD)
   - Nhóm: G09_MANY_ACTORS

25. **1.115797 — Giao đất, cho thuê đất, chuyển mục đích sử dụng đất đối với trường hợp giao đất, cho thuê đất không đấu giá quyền sử dụng đất, không đấu thầu lựa chọn nhà đầu tư thực hiện dự án có sử dụng đất; trường hợp giao đất, cho thuê đất thông qua đấu thầu lựa chọn nhà đầu tư thực hiện dự án có sử dụng đất; giao đất và giao rừng; cho thuê đất và cho thuê rừng; gia hạn sử dụng đất khi hết thời hạn sử dụng đất; trường hợp giao đất, cho thuê đất thông qua hình thức đấu giá quyền sử dụng đất (cấp tỉnh)**
   - Bước: 16; Hồ sơ: 15; Phương thức: 3; Cases: 9; Thời gian: 15–24
   - Điều kiện signal: 33; Actor signal: 1; Cảnh báo: 1 (PROCESSING_TIME_CONFLICT_SAME_METHOD)
   - Nhóm: G02_MANY_STEPS, G13_VERY_COMPLEX

26. **1.115994 — Thủ tục giao đất, cho thuê đất, chuyển mục đích sử dụng đất đối với trường hợp giao đất, cho thuê đất không đấu giá quyền sử dụng đất, không đấu thầu lựa chọn nhà đầu tư thực hiện dự án có sử dụng đất và trường hợp giao đất, cho thuê đất thông qua đấu thầu lựa chọn nhà đầu tư thực hiện dự án có sử dụng đất; giao đất và giao rừng; cho thuê đất và cho thuê rừng; gia hạn sử dụng đất khi hết thời hạn sử dụng đất (cấp xã - tỉnh Phú Thọ)**
   - Bước: 2; Hồ sơ: 0; Phương thức: 3; Cases: 1; Thời gian: 15–25
   - Điều kiện signal: 0; Actor signal: 4; Cảnh báo: 2 (EMPTY_PROFILE_COMPONENTS, PROCESSING_TIME_CONFLICT_SAME_METHOD)
   - Nhóm: G11_ANOMALIES

27. **1.116012 — Thu hồi Giấy chứng nhận đã cấp không đúng quy định của pháp luật đất đai do người sử dụng đất, chủ sở hữu tài sản gắn liền với đất phát hiện (VPĐK đất đai - tỉnh Phú Thọ)**
   - Bước: 1; Hồ sơ: 0; Phương thức: 3; Cases: 1; Thời gian: 25–35
   - Điều kiện signal: 0; Actor signal: 3; Cảnh báo: 2 (EMPTY_PROFILE_COMPONENTS, PROCESSING_TIME_CONFLICT_SAME_METHOD)
   - Nhóm: G11_ANOMALIES

28. **1.116017 — tính, tính lại tiền sử dụng đất đối với hộ gia đình, cá nhân theo quy định tại các điểm a, b, c và d khoản 2 Điều 12 Nghị định số 50/2026/NĐ-CP (Tình Phú Thọ)**
   - Bước: 1; Hồ sơ: 0; Phương thức: 3; Cases: 0; Thời gian: 7.5–9.5
   - Điều kiện signal: 0; Actor signal: 2; Cảnh báo: 2 (EMPTY_PROFILE_COMPONENTS, PROCESSING_TIME_CONFLICT_SAME_METHOD)
   - Nhóm: G11_ANOMALIES

29. **1.116038 — Đăng ký thay đổi nội dung, cập nhật, bổ sung thông tin, cấp lại giấy chứng nhận, hiệu đính thông tin đăng ký hoạt động của Ngân hàng Chính sách xã hội, chi nhánh, phòng giao dịch Ngân hàng Chính sách xã hội. Đăng ký hoạt động lần đầu của chi nhánh, phòng giao dịch Ngân hàng Chính sách xã hội**
   - Bước: 3; Hồ sơ: 33; Phương thức: 3; Cases: 22; Thời gian: UNKNOWN
   - Điều kiện signal: 27; Actor signal: 1; Cảnh báo: 0
   - Nhóm: G10_EXECUTION_CASES

30. **1.116388 — Xác nhận tiếp tục sử dụng đất nông nghiệp**
   - Bước: 1; Hồ sơ: 2; Phương thức: 3; Cases: 1; Thời gian: 7
   - Điều kiện signal: 0; Actor signal: 29; Cảnh báo: 0
   - Nhóm: G09_MANY_ACTORS

31. **1.116389 — Đăng ký, cấp Giấy chứng nhận đối với thửa đất có diện tích tăng thêm do thay đổi ranh giới so với Giấy chứng nhận đã cấp (đối với trường hợp quy định tại điểm a khoản 2 Điều 24 Nghị định số 101/2024/NĐ-CP).**
   - Bước: 1; Hồ sơ: 4; Phương thức: 3; Cases: 1; Thời gian: 10
   - Điều kiện signal: 4; Actor signal: 29; Cảnh báo: 0
   - Nhóm: G09_MANY_ACTORS

32. **1.116400 — Tách thửa đất, hợp thửa đất**
   - Bước: 1; Hồ sơ: 5; Phương thức: 3; Cases: 1; Thời gian: 12
   - Điều kiện signal: 2; Actor signal: 29; Cảnh báo: 0
   - Nhóm: G09_MANY_ACTORS

33. **2.000575 — Cấp lại Giấy chứng nhận đăng ký hộ kinh doanh, Cấp đổi sang Giấy chứng nhận đăng ký hộ kinh doanh**
   - Bước: 2; Hồ sơ: 38; Phương thức: 3; Cases: 18; Thời gian: 3
   - Điều kiện signal: 11; Actor signal: 1; Cảnh báo: 0
   - Nhóm: G10_EXECUTION_CASES

34. **2.002011 — Đăng ký thay đổi: thành viên hợp danh; thành viên công ty trách nhiệm hữu hạn hai thành viên trở lên; người đại diện theo pháp luật của công ty trách nhiệm hữu hạn, công ty cổ phần; chủ sở hữu công ty trách nhiệm hữu hạn một thành viên; chủ doanh nghiệp tư nhân trong trường hợp bán, tặng cho doanh nghiệp, chủ doanh nghiệp chết**
   - Bước: 3; Hồ sơ: 115; Phương thức: 3; Cases: 26; Thời gian: 3
   - Điều kiện signal: 38; Actor signal: 1; Cảnh báo: 0
   - Nhóm: G04_MANY_PROFILES, G10_EXECUTION_CASES, G13_VERY_COMPLEX

35. **3.000579 — Giải quyết trợ cấp hằng tháng đối với thanh niên xung phong đã hoàn thành nhiệm vụ trong kháng chiến trở về địa phương (khoản01 Điều 09 Nghị Quyếtsố 182/2025/NQHĐND)**
   - Bước: 14; Hồ sơ: 3; Phương thức: 3; Cases: 1; Thời gian: 7
   - Điều kiện signal: 7; Actor signal: 2; Cảnh báo: 0
   - Nhóm: G02_MANY_STEPS

36. **3.000640 — Cấp đổi Giấy chứng nhận quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất**
   - Bước: 3; Hồ sơ: 0; Phương thức: 3; Cases: 1; Thời gian: 15–20
   - Điều kiện signal: 0; Actor signal: 1; Cảnh báo: 2 (EMPTY_PROFILE_COMPONENTS, PROCESSING_TIME_CONFLICT_SAME_METHOD)
   - Nhóm: G11_ANOMALIES

37. **3.000644 — Thu hồi Giấy chứng nhận đã cấp không đúng quy định của pháp luật đất đai do người sử dụng đất, chủ sở hữu tài sản gắn liền với đất phát hiện và cấp lại Giấy chứng nhận sau khi thu hồi.**
   - Bước: 4; Hồ sơ: 0; Phương thức: 3; Cases: 1; Thời gian: 30–35
   - Điều kiện signal: 0; Actor signal: 1; Cảnh báo: 2 (EMPTY_PROFILE_COMPONENTS, PROCESSING_TIME_CONFLICT_SAME_METHOD)
   - Nhóm: G11_ANOMALIES

38. **3.000647 — Đăng ký biến động quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất trong các trường hợp chuyển đổi quyền sử dụng đất nông nghiệp mà không theo phương án dồn điền, đổi thửa; chuyển nhượng, thừa kế, tặng cho quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất, góp vốn bằng quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất; cho thuê, cho thuê lại quyền sử dụng đất trong dự án xây dựng kinh doanh kết cấu hạ tầng; bán hoặc tặng cho hoặc để thừa kế hoặc góp vốn bằng tài sản gắn liền với đất thuê của Nhà nước theo hình thức thuê đất trả tiền hàng năm**
   - Bước: 3; Hồ sơ: 0; Phương thức: 3; Cases: 1; Thời gian: 14–18
   - Điều kiện signal: 0; Actor signal: 1; Cảnh báo: 2 (EMPTY_PROFILE_COMPONENTS, PROCESSING_TIME_CONFLICT_SAME_METHOD)
   - Nhóm: G11_ANOMALIES

39. **3.000648 — Đăng ký biến động đối với trường hợp đổi tên hoặc thay đổi thông tin về người sử dụng đất, chủ sở hữu tài sản gắn liền với đất hoặc thay đổi số hiệu hoặc địa chỉ của thửa đất; thay đổi hạn chế quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất hoặc có thay đổi quyền đối với thửa đất liền kề; giảm diện tích thửa đất do sạt lở tự nhiên**
   - Bước: 3; Hồ sơ: 0; Phương thức: 3; Cases: 1; Thời gian: 14–20
   - Điều kiện signal: 0; Actor signal: 1; Cảnh báo: 2 (EMPTY_PROFILE_COMPONENTS, PROCESSING_TIME_CONFLICT_SAME_METHOD)
   - Nhóm: G11_ANOMALIES

40. **3.000649 — Đăng ký biến động thay đổi quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất do chia, tách, hợp nhất, sáp nhập tổ chức hoặc chuyển đổi mô hình tổ chức, chuyển đổi loại hình doanh nghiệp theo quy định của pháp luật về doanh nghiệp; điều chỉnh quy hoạch xây dựng chi tiết; cấp Giấy chứng nhận cho từng thửa đất theo quy hoạch xây dựng chi tiết cho chủ đầu tư dự án có nhu cầu**
   - Bước: 3; Hồ sơ: 0; Phương thức: 3; Cases: 1; Thời gian: 15–18
   - Điều kiện signal: 0; Actor signal: 1; Cảnh báo: 2 (EMPTY_PROFILE_COMPONENTS, PROCESSING_TIME_CONFLICT_SAME_METHOD)
   - Nhóm: G11_ANOMALIES

41. **3.000650 — Đăng ký biến động đối với trường hợp thay đổi quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất theo thỏa thuận của các thành viên hộ gia đình hoặc của vợ và chồng; quyền sử dụng đất xây dựng công trình trên mặt đất phục vụ cho việc vận hành, khai thác sử dụng công trình ngầm, quyền sở hữu công trình ngầm; bán tài sản, điều chuyển, chuyển nhượng quyền sử dụng đất là tài sản công theo quy định của pháp luật về quản lý, sử dụng tài sản công; nhận quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất theo kết quả giải quyết tranh chấp, khiếu nại, tố cáo về đất đai hoặc bản án, quyết định của Tòa án, quyết định thi hành án của cơ quan thi hành án đã được thi hành; quyết định hoặc phán quyết của Trọng tài thương mại Việt Nam về giải quyết tranh chấp giữa các bên phát sinh từ hoạt động thương mại liên quan đến đất đai; nhận quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất do xử lý tài sản thế chấp là quyền sử dụng đất, tài sản gắn liền với đất đã được đăng ký, bao gồm cả xử lý khoản nợ có nguồn gốc từ khoản nợ xấu của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài**
   - Bước: 5; Hồ sơ: 0; Phương thức: 3; Cases: 1; Thời gian: 18–20
   - Điều kiện signal: 0; Actor signal: 1; Cảnh báo: 2 (EMPTY_PROFILE_COMPONENTS, PROCESSING_TIME_CONFLICT_SAME_METHOD)
   - Nhóm: G11_ANOMALIES

42. **3.000654 — Đăng ký, cấp Giấy chứng nhận đối với trường hợp chuyển nhượng dự án đầu tư có sử dụng đất**
   - Bước: 6; Hồ sơ: 0; Phương thức: 3; Cases: 1; Thời gian: 18–30
   - Điều kiện signal: 0; Actor signal: 1; Cảnh báo: 2 (EMPTY_PROFILE_COMPONENTS, PROCESSING_TIME_CONFLICT_SAME_METHOD)
   - Nhóm: G11_ANOMALIES

43. **3.000655 — Đăng ký tài sản gắn liền với thửa đất đã được cấp Giấy chứng nhận hoặc đăng ký thay đổi về tài sản gắn liền với đất so với nội dung đã đăng ký, gia hạn thời hạn sở hữu nhà ở của tổ chức nước ngoài, cá nhân nước ngoài theo quy định của pháp luật về nhà ở nội dung đã đăng ký**
   - Bước: 5; Hồ sơ: 0; Phương thức: 3; Cases: 1; Thời gian: 15–18
   - Điều kiện signal: 0; Actor signal: 1; Cảnh báo: 2 (EMPTY_PROFILE_COMPONENTS, PROCESSING_TIME_CONFLICT_SAME_METHOD)
   - Nhóm: G11_ANOMALIES

44. **3.000657 — Đăng ký đất đai, tài sản gắn liền với đất, cấp Giấy chứng nhận quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất lần đầu đối với tổ chức đang sử dụng đất**
   - Bước: 3; Hồ sơ: 0; Phương thức: 3; Cases: 1; Thời gian: 27–30
   - Điều kiện signal: 0; Actor signal: 1; Cảnh báo: 2 (EMPTY_PROFILE_COMPONENTS, PROCESSING_TIME_CONFLICT_SAME_METHOD)
   - Nhóm: G11_ANOMALIES

45. **3.000668 — Đăng ký đất đai, tài sản gắn liền với đất, cấp Giấy chứng nhận quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất lần đầu đối với tổ chức đang sử dụng đất**
   - Bước: 3; Hồ sơ: 0; Phương thức: 3; Cases: 1; Thời gian: 27–30
   - Điều kiện signal: 0; Actor signal: 1; Cảnh báo: 2 (EMPTY_PROFILE_COMPONENTS, PROCESSING_TIME_CONFLICT_SAME_METHOD)
   - Nhóm: G11_ANOMALIES

46. **3.000669 — Đăng ký đất đai, tài sản gắn liền với đất, cấp Giấy chứng nhận quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất lần đầu đối với hộ gia đình, cá nhân, cộng đồng dân cư, người gốc Việt Nam định cư ở nước ngoài**
   - Bước: 5; Hồ sơ: 0; Phương thức: 3; Cases: 1; Thời gian: 27–30
   - Điều kiện signal: 0; Actor signal: 1; Cảnh báo: 2 (EMPTY_PROFILE_COMPONENTS, PROCESSING_TIME_CONFLICT_SAME_METHOD)
   - Nhóm: G11_ANOMALIES

47. **3.000671 — Đăng ký, cấp Giấy chứng nhận đối với thửa đất có diện tích tăng thêm do thay đổi ranh giới so với Giấy chứng nhận đã cấp (quy định tại điểm b và điểm c khoản 2 Điều 24 Nghị định số 101/2024/NĐ-CP và khoản 4 Điều 24 Nghị định số 101/2024/NĐ-CP)**
   - Bước: 19; Hồ sơ: 0; Phương thức: 3; Cases: 1; Thời gian: 30
   - Điều kiện signal: 0; Actor signal: 1; Cảnh báo: 1 (EMPTY_PROFILE_COMPONENTS)
   - Nhóm: G02_MANY_STEPS

48. **5.003809 — Thẩm định nhiệm vụ quy hoạch, quy hoạch đô thị và nông thôn thuộc thẩm quyền phê duyệt của Thủ tướng Chính phủ hoặc thẩm định các nhiệm vụ quy hoạch, quy hoạch đô thị và nông thôn theo phân công của Thủ tướng Chính phủ**
   - Bước: 4; Hồ sơ: 0; Phương thức: 3; Cases: 1; Thời gian: 15–20
   - Điều kiện signal: 0; Actor signal: 2; Cảnh báo: 2 (EMPTY_PROFILE_COMPONENTS, PROCESSING_TIME_CONFLICT_SAME_METHOD)
   - Nhóm: G11_ANOMALIES

49. **6.006577 — Thẩm định đề án phân loại đô thị loại I, II, III và loại IV
Thẩm định đề án phân loại đô thị loại I, II, III và loại IV**
   - Bước: 1; Hồ sơ: 0; Phương thức: 1; Cases: 2; Thời gian: 15
   - Điều kiện signal: 0; Actor signal: 3; Cảnh báo: 1 (EMPTY_PROFILE_COMPONENTS)
   - Nhóm: G12_VERY_SIMPLE

50. **6.006578 — Thẩm định báo cáo rà soát tiêu chí phân loại đô thị, báo cáo đánh giá trình độ phát triển cơ sở hạ tầng đô thị**
   - Bước: 1; Hồ sơ: 0; Phương thức: 1; Cases: 1; Thời gian: 30
   - Điều kiện signal: 0; Actor signal: 3; Cảnh báo: 1 (EMPTY_PROFILE_COMPONENTS)
   - Nhóm: G12_VERY_SIMPLE

