const test = require('node:test');
const assert = require('node:assert/strict');
const { buildProvincePayload } = require('../build-niemyet-data');

test('builder tạo danh sách cơ quan nhỏ, duy nhất và sắp xếp', () => {
  const province = { code: '48', name: 'Đà Nẵng' };
  const master = [{
    id: 'procedure-1',
    ma_tthc: '1.001',
    ten_tthc: 'Thủ tục thử nghiệm',
    linh_vuc: 'Hộ tịch',
    co_quan_cong_bo: 'UBND thành phố Đà Nẵng',
    cap_thuc_hien: 'Cấp xã'
  }];
  const rows = [
    { MaTTHC: '1.001', MaDVC: '1.001.01', TenCQTH: 'Sở Tư pháp; UBND Phường A' },
    { MaTTHC: '1.001', MaDVC: '1.001.02', TenCQTH: 'Sở Tư pháp' },
    { MaTTHC: '', MaDVC: '', TenCQTH: 'Công an thành phố' }
  ];

  const payload = buildProvincePayload(province, master, rows);
  assert.equal(payload.agencies.schemaVersion, 1);
  assert.deepEqual(payload.agencies.province, { code: '48', name: 'Đà Nẵng', slug: 'da-nang' });
  assert.deepEqual(payload.agencies.items, ['Công an thành phố', 'Sở Tư pháp', 'UBND Phường A']);
});
