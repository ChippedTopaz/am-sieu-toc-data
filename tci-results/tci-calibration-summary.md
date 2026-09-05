# TCI V1 – Calibration Sample Report

- Tổng JSON trong details: **6258**
- Phân tích thành công: **6258**
- Số mẫu chọn: **50**
- Random: **Không**
- Chưa tính điểm TCI.
- Hồ sơ được đọc từ **root.profileComponents** và **executionCases[].profileComponents**.

## Coverage

- ✅ G01_SIMPLE_STEPS: 7
- ✅ G02_MANY_STEPS: 5
- ✅ G03_FEW_PROFILES: 5
- ✅ G04_MANY_PROFILES: 6
- ✅ G05_SHORT_TIME: 7
- ✅ G06_LONG_TIME: 4
- ✅ G07_MULTIPLE_METHODS: 4
- ✅ G08_COMPLEX_CONDITIONS: 5
- ❌ G09_MANY_ACTORS: 0
- ✅ G10_EXECUTION_CASES: 3
- ❌ G11_ANOMALIES: 0
- ✅ G12_VERY_SIMPLE: 12
- ✅ G13_VERY_COMPLEX: 12

## 50 mẫu

1. **1.000178 — Giải quyết khiếu nại về quyết định hành chính, hành vi hành chính của công dân đối với lực lượng Công an nhân dân (thực hiện tại cấp Trung ương)**
   - Bước: 1; Hồ sơ: 8 (executionCases); Phương thức: 2; Cases: 1; Thời gian: 60
   - Điều kiện signal: 6; Actor signal: 2; Cảnh báo: 0
   - Nhóm: G01_SIMPLE_STEPS

2. **1.000253 — Khai báo tạm trú cho người nước ngoài tại Việt Nam bằng Phiếu khai báo tạm trú**
   - Bước: 1; Hồ sơ: 1 (executionCases); Phương thức: 1; Cases: 2; Thời gian: 7
   - Điều kiện signal: 1; Actor signal: 1; Cảnh báo: 0
   - Nhóm: G01_SIMPLE_STEPS, G03_FEW_PROFILES

3. **1.000382 — Cấp Giấy chứng nhận xuất xứ hàng hoá (C/O) ưu đãi mẫu EAV**
   - Bước: 1; Hồ sơ: 21 (executionCases); Phương thức: 3; Cases: 1; Thời gian: 6–24
   - Điều kiện signal: 0; Actor signal: 2; Cảnh báo: 1 (PROCESSING_TIME_CONFLICT)
   - Nhóm: G04_MANY_PROFILES

4. **1.000431 — Cấp Giấy chứng nhận xuất xứ hàng hoá (C/O) ưu đãi mẫu VK**
   - Bước: 1; Hồ sơ: 21 (executionCases); Phương thức: 3; Cases: 1; Thời gian: 6–24
   - Điều kiện signal: 0; Actor signal: 2; Cảnh báo: 1 (PROCESSING_TIME_CONFLICT)
   - Nhóm: G04_MANY_PROFILES

5. **1.000432 — Cấp Giấy chứng nhận xuất xứ hàng hoá (C/O) ưu đãi mẫu AJ**
   - Bước: 1; Hồ sơ: 21 (executionCases); Phương thức: 3; Cases: 1; Thời gian: 6–24
   - Điều kiện signal: 0; Actor signal: 3; Cảnh báo: 1 (PROCESSING_TIME_CONFLICT)
   - Nhóm: G04_MANY_PROFILES

6. **1.000564 — Thủ tục xét tặng “Giải thưởng Nhà nước” về văn học, nghệ thuật**
   - Bước: 1; Hồ sơ: 6 (executionCases); Phương thức: 3; Cases: 1; Thời gian: 305
   - Điều kiện signal: 0; Actor signal: 3; Cảnh báo: 0
   - Nhóm: G06_LONG_TIME

7. **1.000771 — Gia hạn tạm trú cho người đã được cấp giấy miễn thị thực tại Cục Quản lý xuất nhập cảnh Bộ Công an**
   - Bước: 1; Hồ sơ: 4 (executionCases); Phương thức: 3; Cases: 1; Thời gian: 5
   - Điều kiện signal: 6; Actor signal: 1; Cảnh báo: 0
   - Nhóm: G01_SIMPLE_STEPS, G07_MULTIPLE_METHODS

8. **1.000807 — Cấp lại giấy miễn thị thực tại Cục Quản lý xuất nhập cảnh, Bộ Công an**
   - Bước: 1; Hồ sơ: 7 (executionCases); Phương thức: 3; Cases: 2; Thời gian: 5
   - Điều kiện signal: 8; Actor signal: 1; Cảnh báo: 0
   - Nhóm: G01_SIMPLE_STEPS, G07_MULTIPLE_METHODS

9. **1.000811 — Cấp mới thẻ ABTC (thực hiện tại cấp trung ương)**
   - Bước: 1; Hồ sơ: 5 (executionCases); Phương thức: 3; Cases: 1; Thời gian: 21
   - Điều kiện signal: 12; Actor signal: 1; Cảnh báo: 1 (PROCESSING_TIME_CONFLICT)
   - Nhóm: G01_SIMPLE_STEPS, G07_MULTIPLE_METHODS

10. **1.000871 — Thủ tục xét tặng “Giải thưởng Hồ Chí Minh” về văn học, nghệ thuật**
   - Bước: 1; Hồ sơ: 6 (executionCases); Phương thức: 3; Cases: 1; Thời gian: 305
   - Điều kiện signal: 0; Actor signal: 3; Cảnh báo: 0
   - Nhóm: G06_LONG_TIME

11. **1.000931 — Cấp giấy phép vào khu vực cấm, khu vực biên giới cho người nước ngoài tại Công an cấp tỉnh**
   - Bước: 1; Hồ sơ: 3 (executionCases); Phương thức: 1; Cases: 1; Thời gian: 5
   - Điều kiện signal: 0; Actor signal: 1; Cảnh báo: 0
   - Nhóm: G01_SIMPLE_STEPS

12. **1.001226 — Cấp giấy phép đến các tỉnh, thành phố của Việt Nam cho công dân Lào nhập cảnh bằng Giấy thông hành biên giới tại Công an cấp tỉnh**
   - Bước: 1; Hồ sơ: 2 (executionCases); Phương thức: 1; Cases: 1; Thời gian: 1
   - Điều kiện signal: 3; Actor signal: 2; Cảnh báo: 0
   - Nhóm: G01_SIMPLE_STEPS, G05_SHORT_TIME

13. **1.001445 — Trình báo mất hộ chiếu phổ thông (thực hiện tại cấp tỉnh)**
   - Bước: 1; Hồ sơ: 1 (executionCases); Phương thức: 3; Cases: 1; Thời gian: 1
   - Điều kiện signal: 11; Actor signal: 1; Cảnh báo: 0
   - Nhóm: G03_FEW_PROFILES, G05_SHORT_TIME, G07_MULTIPLE_METHODS

14. **1.003425 — Kiểm tra, xét duyệt nhân sự, cấp phép nhập cảnh cho người nước ngoài, người Việt Nam định cư ở nước ngoài nhập cảnh vào Việt Nam tại Cục Quản lý xuất nhập cảnh, Bộ Công an**
   - Bước: 1; Hồ sơ: 1 (executionCases); Phương thức: 1; Cases: 2; Thời gian: 5
   - Điều kiện signal: 17; Actor signal: 1; Cảnh báo: 0
   - Nhóm: G03_FEW_PROFILES

15. **1.003677 — Khai báo tạm vắng**
   - Bước: 1; Hồ sơ: 2 (executionCases); Phương thức: 1; Cases: 2; Thời gian: 1–2
   - Điều kiện signal: 8; Actor signal: 1; Cảnh báo: 1 (PROCESSING_TIME_CONFLICT)
   - Nhóm: G05_SHORT_TIME

16. **1.007659 — Thủ tục miễn thuế đối với hàng hóa xuất khẩu, nhập khẩu**
   - Bước: 1; Hồ sơ: 9 (executionCases); Phương thức: 3; Cases: 14; Thời gian: UNKNOWN
   - Điều kiện signal: 46; Actor signal: 1; Cảnh báo: 0
   - Nhóm: G08_COMPLEX_CONDITIONS, G10_EXECUTION_CASES, G13_VERY_COMPLEX

17. **1.008759 — Đăng ký thuế trong trường hợp chia, tách, hợp nhất, sáp nhập tổ chức**
   - Bước: 10; Hồ sơ: 10 (executionCases); Phương thức: 3; Cases: 5; Thời gian: 3
   - Điều kiện signal: 5; Actor signal: 4; Cảnh báo: 0
   - Nhóm: G02_MANY_STEPS

18. **1.009628 — Thủ tục điều chỉnh dự án đầu tư thuộc thẩm quyền chấp thuận chủ trương đầu tư của Thủ tướng Chính phủ**
   - Bước: 2; Hồ sơ: 10 (executionCases); Phương thức: 3; Cases: 9; Thời gian: 25
   - Điều kiện signal: 45; Actor signal: 2; Cảnh báo: 0
   - Nhóm: G08_COMPLEX_CONDITIONS, G13_VERY_COMPLEX

19. **1.009646 — Thủ tục chấp thuận điều chỉnh chủ trương đầu tư thuộc thẩm quyền của Chủ tịch Uỷ ban nhân dân cấp tỉnh**
   - Bước: 3; Hồ sơ: 8 (executionCases); Phương thức: 3; Cases: 11; Thời gian: 17
   - Điều kiện signal: 45; Actor signal: 2; Cảnh báo: 0
   - Nhóm: G08_COMPLEX_CONDITIONS, G13_VERY_COMPLEX

20. **1.009759 — Thủ tục chấp thuận điều chỉnh chủ trương đầu tư thuộc thẩm quyền của Ban quản lý khu công nghiệp, khu chế xuất, khu công nghệ cao, khu kinh tế**
   - Bước: 3; Hồ sơ: 9 (executionCases); Phương thức: 3; Cases: 10; Thời gian: 17
   - Điều kiện signal: 45; Actor signal: 1; Cảnh báo: 0
   - Nhóm: G08_COMPLEX_CONDITIONS, G13_VERY_COMPLEX

21. **1.010047 — Đăng ký xuất cảnh, nhập cảnh qua cổng kiểm soát tự động**
   - Bước: 1; Hồ sơ: 2 (executionCases); Phương thức: 2; Cases: 1; Thời gian: 1
   - Điều kiện signal: 12; Actor signal: 1; Cảnh báo: 0
   - Nhóm: G05_SHORT_TIME

22. **1.010049 — Trình báo mất giấy thông hành (thực hiện tại cấp tỉnh)**
   - Bước: 1; Hồ sơ: 2 (executionCases); Phương thức: 3; Cases: 1; Thời gian: 1
   - Điều kiện signal: 8; Actor signal: 1; Cảnh báo: 0
   - Nhóm: G05_SHORT_TIME

23. **1.010386 — Trình báo mất hộ chiếu phổ thông (thực hiện tại cấp xã)**
   - Bước: 1; Hồ sơ: 1 (executionCases); Phương thức: 3; Cases: 1; Thời gian: 1
   - Điều kiện signal: 11; Actor signal: 1; Cảnh báo: 0
   - Nhóm: G03_FEW_PROFILES, G05_SHORT_TIME

24. **1.011410 — Cấp tài khoản định danh điện tử mức độ 01 cho công dân Việt Nam**
   - Bước: 1; Hồ sơ: 1 (executionCases); Phương thức: 1; Cases: 1; Thời gian: 1
   - Điều kiện signal: 0; Actor signal: 1; Cảnh báo: 0
   - Nhóm: G03_FEW_PROFILES, G05_SHORT_TIME

25. **1.013285 — Thủ tục chấp thuận độ cao công trình**
   - Bước: 14; Hồ sơ: 3 (executionCases); Phương thức: 3; Cases: 1; Thời gian: 10–30
   - Điều kiện signal: 5; Actor signal: 1; Cảnh báo: 1 (PROCESSING_TIME_CONFLICT)
   - Nhóm: G02_MANY_STEPS

26. **1.013742 — Cấp giấy đăng ký lưu hành thuốc, nguyên liệu làm thuốc**
   - Bước: 6; Hồ sơ: 36 (executionCases); Phương thức: 3; Cases: 2; Thời gian: 12
   - Điều kiện signal: 47; Actor signal: 1; Cảnh báo: 0
   - Nhóm: G04_MANY_PROFILES, G08_COMPLEX_CONDITIONS, G13_VERY_COMPLEX

27. **1.014039 — Cấp giấy đăng ký lưu hành thuốc cổ truyền**
   - Bước: 1; Hồ sơ: 15 (executionCases); Phương thức: 3; Cases: 2; Thời gian: 12
   - Điều kiện signal: 41; Actor signal: 1; Cảnh báo: 0
   - Nhóm: G13_VERY_COMPLEX

28. **1.014119 — Cấp Giấy chứng nhận xuất xứ hàng hoá (C/O) ưu đãi Mẫu VI**
   - Bước: 1; Hồ sơ: 23 (executionCases); Phương thức: 3; Cases: 1; Thời gian: 8–24
   - Điều kiện signal: 0; Actor signal: 1; Cảnh báo: 1 (PROCESSING_TIME_CONFLICT)
   - Nhóm: G04_MANY_PROFILES

29. **1.014196 — Cấp giấy xác nhận không thuộc diện cấp giấy phép lao động đối với người lao động nước ngoài làm việc tại Việt Nam**
   - Bước: 3; Hồ sơ: 12 (executionCases); Phương thức: 3; Cases: 15; Thời gian: 3–5
   - Điều kiện signal: 36; Actor signal: 2; Cảnh báo: 1 (PROCESSING_TIME_CONFLICT)
   - Nhóm: G10_EXECUTION_CASES, G13_VERY_COMPLEX

30. **1.014977 — Chủ tịch, Phó Chủ tịch UBND tỉnh tiếp khách nước ngoài**
   - Bước: 1; Hồ sơ: 0 (missing); Phương thức: 1; Cases: 1; Thời gian: 0
   - Điều kiện signal: 0; Actor signal: 4; Cảnh báo: 1 (EMPTY_PROFILE_COMPONENTS)
   - Nhóm: G12_VERY_SIMPLE

31. **1.014978 — Chủ tịch, Phó Chủ tịch UBND tỉnh tiếp khách trong nước**
   - Bước: 1; Hồ sơ: 0 (missing); Phương thức: 1; Cases: 1; Thời gian: 0
   - Điều kiện signal: 0; Actor signal: 4; Cảnh báo: 1 (EMPTY_PROFILE_COMPONENTS)
   - Nhóm: G12_VERY_SIMPLE

32. **1.014999 — Thủ tục đăng ký sáng chế**
   - Bước: 1; Hồ sơ: 8 (executionCases); Phương thức: 3; Cases: 2; Thời gian: 420
   - Điều kiện signal: 18; Actor signal: 2; Cảnh báo: 0
   - Nhóm: G06_LONG_TIME

33. **1.015003 — Thủ tục xử lý đơn Madrid có chỉ định Việt Nam**
   - Bước: 1; Hồ sơ: 0 (missing); Phương thức: 3; Cases: 1; Thời gian: 360
   - Điều kiện signal: 19; Actor signal: 2; Cảnh báo: 1 (EMPTY_PROFILE_COMPONENTS)
   - Nhóm: G06_LONG_TIME

34. **1.115797 — Giao đất, cho thuê đất, chuyển mục đích sử dụng đất đối với trường hợp giao đất, cho thuê đất không đấu giá quyền sử dụng đất, không đấu thầu lựa chọn nhà đầu tư thực hiện dự án có sử dụng đất; trường hợp giao đất, cho thuê đất thông qua đấu thầu lựa chọn nhà đầu tư thực hiện dự án có sử dụng đất; giao đất và giao rừng; cho thuê đất và cho thuê rừng; gia hạn sử dụng đất khi hết thời hạn sử dụng đất; trường hợp giao đất, cho thuê đất thông qua hình thức đấu giá quyền sử dụng đất (cấp tỉnh)**
   - Bước: 16; Hồ sơ: 4 (executionCases); Phương thức: 3; Cases: 9; Thời gian: 15–24
   - Điều kiện signal: 33; Actor signal: 1; Cảnh báo: 1 (PROCESSING_TIME_CONFLICT)
   - Nhóm: G02_MANY_STEPS, G13_VERY_COMPLEX

35. **1.115996 — Giao đất, cho thuê đất, chuyển mục đích sử dụng đất đối với trường hợp giao đất, cho thuê đất không đấu giá quyền sử dụng đất, không đấu thầu lựa chọn nhà đầu tư thực hiện dự án có sử dụng đất và trường hợp giao đất, cho thuê đất thông qua đấu thầu lựa chọn nhà đầu tư thực hiện dự án có sử dụng đất; giao đất và giao rừng; cho thuê đất và cho thuê rừng; gia hạn sử dụng đất khi hết thời hạn sử dụng đất (cấp tỉnh - tỉnh Phú Thọ)**
   - Bước: 5; Hồ sơ: 54 (executionCases); Phương thức: 3; Cases: 2; Thời gian: 15–25
   - Điều kiện signal: 8; Actor signal: 4; Cảnh báo: 1 (PROCESSING_TIME_CONFLICT)
   - Nhóm: G04_MANY_PROFILES, G13_VERY_COMPLEX

36. **1.116139 — Đăng ký kinh doanh 0408_2026**
   - Bước: 1; Hồ sơ: 0 (missing); Phương thức: 1; Cases: 1; Thời gian: 3
   - Điều kiện signal: 0; Actor signal: 1; Cảnh báo: 1 (EMPTY_PROFILE_COMPONENTS)
   - Nhóm: G12_VERY_SIMPLE

37. **1.116216 — Đính chính Giấy chứng nhận 01**
   - Bước: 1; Hồ sơ: 0 (missing); Phương thức: 1; Cases: 1; Thời gian: 7
   - Điều kiện signal: 0; Actor signal: 1; Cảnh báo: 1 (EMPTY_PROFILE_COMPONENTS)
   - Nhóm: G12_VERY_SIMPLE

38. **2.001538 — Thủ tục đề nghị danh hiệu thi đua, hình thức khen thưởng thuộc phạm vi chức năng quản lý của NHNN**
   - Bước: 8; Hồ sơ: 11 (executionCases); Phương thức: 3; Cases: 1; Thời gian: 1
   - Điều kiện signal: 36; Actor signal: 2; Cảnh báo: 0
   - Nhóm: G13_VERY_COMPLEX

39. **2.002011 — Đăng ký thay đổi: thành viên hợp danh; thành viên công ty trách nhiệm hữu hạn hai thành viên trở lên; người đại diện theo pháp luật của công ty trách nhiệm hữu hạn, công ty cổ phần; chủ sở hữu công ty trách nhiệm hữu hạn một thành viên; chủ doanh nghiệp tư nhân trong trường hợp bán, tặng cho doanh nghiệp, chủ doanh nghiệp chết**
   - Bước: 3; Hồ sơ: 14 (executionCases); Phương thức: 3; Cases: 26; Thời gian: 3
   - Điều kiện signal: 38; Actor signal: 1; Cảnh báo: 0
   - Nhóm: G10_EXECUTION_CASES, G13_VERY_COMPLEX

40. **3.000029 — Thủ tục cấp, cấp lại, điều chỉnh Giấy chứng nhận đủ điều kiện kinh doanh dịch vụ xếp hạng tín nhiệm**
   - Bước: 2; Hồ sơ: 17 (executionCases); Phương thức: 2; Cases: 3; Thời gian: 10–60
   - Điều kiện signal: 44; Actor signal: 1; Cảnh báo: 1 (PROCESSING_TIME_CONFLICT)
   - Nhóm: G13_VERY_COMPLEX

41. **3.000364 — Cấp giấy phép hoạt động đối với cơ sở cai nghiện ma túy tự nguyện**
   - Bước: 1; Hồ sơ: 0 (missing); Phương thức: 3; Cases: 0; Thời gian: 15
   - Điều kiện signal: 0; Actor signal: 1; Cảnh báo: 1 (EMPTY_PROFILE_COMPONENTS)
   - Nhóm: G12_VERY_SIMPLE

42. **3.000579 — Giải quyết trợ cấp hằng tháng đối với thanh niên xung phong đã hoàn thành nhiệm vụ trong kháng chiến trở về địa phương (khoản01 Điều 09 Nghị Quyếtsố 182/2025/NQHĐND)**
   - Bước: 14; Hồ sơ: 3 (executionCases); Phương thức: 3; Cases: 1; Thời gian: 7
   - Điều kiện signal: 7; Actor signal: 2; Cảnh báo: 0
   - Nhóm: G02_MANY_STEPS

43. **3.000635 — Công bố Danh mục khu đất dự kiến thực hiện dự án thí điểm thực hiện dự án nhà ở thương mại thông qua thỏa thuận về nhận quyền sử dụng đất hoặc đang có quyền sử dụng đất**
   - Bước: 1; Hồ sơ: 0 (missing); Phương thức: 1; Cases: 1; Thời gian: 15
   - Điều kiện signal: 0; Actor signal: 1; Cảnh báo: 1 (EMPTY_PROFILE_COMPONENTS)
   - Nhóm: G12_VERY_SIMPLE

44. **3.000671 — Đăng ký, cấp Giấy chứng nhận đối với thửa đất có diện tích tăng thêm do thay đổi ranh giới so với Giấy chứng nhận đã cấp (quy định tại điểm b và điểm c khoản 2 Điều 24 Nghị định số 101/2024/NĐ-CP và khoản 4 Điều 24 Nghị định số 101/2024/NĐ-CP)**
   - Bước: 19; Hồ sơ: 0 (missing); Phương thức: 3; Cases: 1; Thời gian: 30
   - Điều kiện signal: 0; Actor signal: 1; Cảnh báo: 1 (EMPTY_PROFILE_COMPONENTS)
   - Nhóm: G02_MANY_STEPS

45. **5.002546 — Phê duyệt quy chế phối hợp tìm kiếm, cứu nạn hàng hải trong vùng nước cảng biển và trên các vùng biển**
   - Bước: 1; Hồ sơ: 0 (missing); Phương thức: 1; Cases: 1; Thời gian: 0
   - Điều kiện signal: 0; Actor signal: 2; Cảnh báo: 1 (EMPTY_PROFILE_COMPONENTS)
   - Nhóm: G12_VERY_SIMPLE

46. **5.002548 — Phê duyệt quy hoạch phát triển hệ thống cảng cạn**
   - Bước: 1; Hồ sơ: 0 (missing); Phương thức: 1; Cases: 1; Thời gian: 0
   - Điều kiện signal: 0; Actor signal: 2; Cảnh báo: 1 (EMPTY_PROFILE_COMPONENTS)
   - Nhóm: G12_VERY_SIMPLE

47. **5.003850 — Thủ tục cho phép trường phổ thông dân tộc bán trú hoạt động giáo dục trở lại**
   - Bước: 1; Hồ sơ: 0 (missing); Phương thức: 1; Cases: 1; Thời gian: 7
   - Điều kiện signal: 0; Actor signal: 1; Cảnh báo: 1 (EMPTY_PROFILE_COMPONENTS)
   - Nhóm: G12_VERY_SIMPLE

48. **5.003872 — Đăng ký kinh doanh (fix)**
   - Bước: 1; Hồ sơ: 0 (missing); Phương thức: 1; Cases: 1; Thời gian: 2
   - Điều kiện signal: 0; Actor signal: 1; Cảnh báo: 1 (EMPTY_PROFILE_COMPONENTS)
   - Nhóm: G12_VERY_SIMPLE

49. **6.003501 — Lập, thẩm định, phê duyệt và điều chỉnh kế hoạch bảo trì công trình đường bộ sử dụng ngân sách trung ương**
   - Bước: 1; Hồ sơ: 0 (missing); Phương thức: 1; Cases: 1; Thời gian: 30
   - Điều kiện signal: 0; Actor signal: 1; Cảnh báo: 1 (EMPTY_PROFILE_COMPONENTS)
   - Nhóm: G12_VERY_SIMPLE

50. **6.006578 — Thẩm định báo cáo rà soát tiêu chí phân loại đô thị, báo cáo đánh giá trình độ phát triển cơ sở hạ tầng đô thị**
   - Bước: 1; Hồ sơ: 0 (missing); Phương thức: 1; Cases: 1; Thời gian: 30
   - Điều kiện signal: 0; Actor signal: 3; Cảnh báo: 1 (EMPTY_PROFILE_COMPONENTS)
   - Nhóm: G12_VERY_SIMPLE

