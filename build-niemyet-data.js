const axios = require('axios');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// =======================================================
// BUILD DATA TỐI ƯU CHO TRANG NIÊM YẾT
// - Không sửa tthc_audit2.js
// - Không sửa lay-du-lieu-dvc-v2.js
// - Google Sheet tỉnh là source of truth cho dữ liệu thực thi
// - index.json toàn quốc bổ sung TTHC Bộ/ngành + metadata quốc gia
// =======================================================

const OUTPUT_DIR = path.join(__dirname, 'province-configs');
const SHARD_COUNT = 64;

const MASTER_INDEX_URL =
  'https://raw.githubusercontent.com/ChippedTopaz/am-sieu-toc-data/data/index.json';

const PROVINCE_DIRECTORY_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQlBaBQWrwlVYTKY0zr2t7M-xnplWarLHSWjdDznpg32V1aZUrnxyirY-HNGo11jozXX7ZnUhsoBBoS/pub?gid=0&single=true&output=csv';

const PROVINCES = [
  { code: '01', name: 'Hà Nội', sheetId: '18X7KxPNzqO_3KWFa2wtVCV4klAY7-BKGGTQAWuBBXzA' },
  { code: '04', name: 'Cao Bằng', sheetId: '1Y0VTudHWcD4t5t3DNk1_0MWbNL3Jh5Ix92iJ338HlYA' },
  { code: '08', name: 'Tuyên Quang', sheetId: '19-sDNMcOm1i-OoTeUpTouCcdkVRBEojI6cE83xzge-w' },
  { code: '11', name: 'Điện Biên', sheetId: '1odjzYbT8gY7Bt87BSxqNSfTJFyGsPZf7EIPsHszajXM' },
  { code: '12', name: 'Lai Châu', sheetId: '1J_APRElGPZun4zPB6WO6Oc0XBb4-No--UuKvz7hIviw' },
  { code: '14', name: 'Sơn La', sheetId: '1aPDLysN-ioiT_FpSmajU315uect5tuEQnPrFFNfk_8k' },
  { code: '15', name: 'Lào Cai', sheetId: '1r_zmPeJzTSmFaWZtASwDuZZihQkt07VRUAteJeKX9LE' },
  { code: '19', name: 'Thái Nguyên', sheetId: '1SOinu2ieKe9P0WlROlPzeGz8KnQog44WlE8JlT4-0d4' },
  { code: '20', name: 'Lạng Sơn', sheetId: '1XZjYtHkrf_Agudx98zXPIzwo_zQ-iNKIcufrLmDw0x0' },
  { code: '22', name: 'Quảng Ninh', sheetId: '1G7KpU7umZ10pan8PsIVQdINyJxhffRRbGTafrkel4ns' },
  { code: '24', name: 'Bắc Ninh', sheetId: '1AMz2m4OD4w_kyw5g60CfDtCMO5YoMh6A027XCuQnIN4' },
  { code: '25', name: 'Phú Thọ', sheetId: '1H0L4jM3_uwPjfBOdGZPFhRPllsPZN2lj8y3ed21xx5E' },
  { code: '31', name: 'Hải Phòng', sheetId: '1FS--r88vV1GCGq2Ki9SwYaFfcDCO1GfZiFQ5L3z_f9I' },
  { code: '33', name: 'Hưng Yên', sheetId: '1EljJM6qZleVHywEzcmLuuWqbb5JjHDvO8CrNFVn6ZWk' },
  { code: '37', name: 'Ninh Bình', sheetId: '10PPeuVlMuF1_5ruW98_-8rSx1fiIqTyXOmgVwrWreoA' },
  { code: '38', name: 'Thanh Hóa', sheetId: '1a8eUDctjDrf8BLshBpy1FeeT5yCNBhGU' },
  { code: '40', name: 'Nghệ An', sheetId: '1rmfl05Y_CVK1rTzY_2-Ms-2zJGZSGKeTSgNc1sX34vw' },
  { code: '42', name: 'Hà Tĩnh', sheetId: '11bPBAtqZIQK1C7C3yUMxNvKflKQLTNCfjlCdvfoPh1s' },
  { code: '44', name: 'Quảng Trị', sheetId: '17BxG4hFtrteZnq4SNt0fZuuugr3UdpRVyl8AM4OWK1E' },
  { code: '46', name: 'Huế', sheetId: '1JQ_0HKVH9ExUqsCzIO2l5x4Wsl7bwnczWMSZXWn9wTQ' },
  { code: '48', name: 'Đà Nẵng', sheetId: '16YW-3STv7vEa-34rknbFDWnHk13xoJ278a8KGqCISaM' },
  { code: '51', name: 'Quảng Ngãi', sheetId: '1LKGjaOIc5T84r78tHOA0I6N0x1qpiq5jE1RpXCS1U8w' },
  { code: '52', name: 'Gia Lai', sheetId: '1MNSJfioDeVUqJlbSZgrr-6acJY4ey-s2BVr5oCCzfn8' },
  { code: '56', name: 'Khánh Hòa', sheetId: '1LPtFzEXlsvqMdfricKfaoruNAnzOsEnQYeoWyo0sVyU' },
  { code: '66', name: 'Đắk Lắk', sheetId: '1okl3z6pEvCVlq-8vv5FWIZGUYZd9F0zuWcgpaUCSsyc' },
  { code: '68', name: 'Lâm Đồng', sheetId: '1mvslq3R_rrHqIHD1USzyxemWsD8Ry3zrp2qOuAnIwYI' },
  { code: '75', name: 'Đồng Nai', sheetId: '1mGTF2V1MaUOPAtgmd2llhLoxGMmFeMo5sWoCLSIsEv8' },
  { code: '79', name: 'Hồ Chí Minh', sheetId: '1fL_EUW0Rvvsy-Y15cQaZmZFBxefvjU345iGnsIxuPAw' },
  { code: '80', name: 'Tây Ninh', sheetId: '11n69cLECymVNw5P9YN6XERW9ASdU6cbdNZriq5GtFOM' },
  { code: '82', name: 'Đồng Tháp', sheetId: '1xm130kHRSZdxz2hsrSTF70zbwFFEd8Xs00thJoXDCuo' },
  { code: '86', name: 'Vĩnh Long', sheetId: '1f-YkMkm_58ayybBpNebePvxaJVq2TqN0PRZw1DJF9hU' },
  { code: '91', name: 'An Giang', sheetId: '1vUT1aSPPFfhkJStbHb07feOKH7S_IY54wpS6aj43W6U' },
  { code: '92', name: 'Cần Thơ', sheetId: '1kPzh1UqnEdR2QkbLHY6HlM85DbpgTCE_IeZ8RsXVyj0' },
  { code: '96', name: 'Cà Mau', sheetId: '18LBLIh5-XVnOJj9xEoiKxXV1A73FvRW71ec3PxeDiLk' }
];

function removeAccents(str) {
  return (str || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

function safeKey(str) {
  return removeAccents(str).toLowerCase().replace(/\s+/g, '').trim();
}

function slugify(str) {
  return removeAccents(str)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function cleanCode(value) {
  return (value || '').toString().trim().replace(/^'/, '');
}

function shardKey(value) {
  const input = cleanCode(value);
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  const index = (hash >>> 0) % SHARD_COUNT;
  return index.toString(16).padStart(2, '0');
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function normalizeHeader(value) {
  return safeKey((value || '').toString().replace(/^\uFEFF/, ''));
}

// Parser CSV RFC4180 tối giản, hỗ trợ dấu phẩy/chấm phẩy, quote và xuống dòng trong ô.
function parseCsv(text) {
  text = (text || '').replace(/^\uFEFF/, '');
  if (!text.trim()) return [];

  const firstLine = text.split(/\r?\n/, 1)[0] || '';
  const delimiter = (firstLine.match(/;/g) || []).length > (firstLine.match(/,/g) || []).length ? ';' : ',';

  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          quoted = false;
        }
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      quoted = true;
    } else if (ch === delimiter) {
      row.push(field);
      field = '';
    } else if (ch === '\n') {
      row.push(field.replace(/\r$/, ''));
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += ch;
    }
  }

  if (field.length || row.length) {
    row.push(field.replace(/\r$/, ''));
    rows.push(row);
  }

  if (!rows.length) return [];
  const headers = rows.shift().map(h => h.replace(/^\uFEFF/, '').trim());

  return rows
    .filter(r => r.some(v => (v || '').toString().trim() !== ''))
    .map(r => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = (r[i] ?? '').toString().trim(); });
      return obj;
    });
}

function getByAliases(row, aliases) {
  if (!row) return '';
  const wanted = aliases.map(normalizeHeader);
  for (const key of Object.keys(row)) {
    if (wanted.includes(normalizeHeader(key))) return row[key] || '';
  }
  return '';
}

async function fetchText(url) {
  const res = await axios.get(url, {
    responseType: 'text',
    timeout: 120000,
    headers: { 'User-Agent': 'am-sieu-toc-niemyet-builder/1.0' }
  });
  return typeof res.data === 'string' ? res.data : JSON.stringify(res.data);
}

async function fetchJson(url) {
  const res = await axios.get(url, {
    timeout: 120000,
    headers: { 'User-Agent': 'am-sieu-toc-niemyet-builder/1.0' }
  });
  return res.data;
}

function shouldIncludeMasterItem(item, provinceName) {
  const currentProvClean = removeAccents(provinceName)
    .toLowerCase()
    .replace(/tinh |thanh pho /g, '')
    .trim();

  const cqcb = (item.co_quan_cong_bo || item.departmentPromulgateName || '').toString().trim();
  const cqcbClean = removeAccents(cqcb).toLowerCase();

  const isCurrentProv = currentProvClean !== '' && cqcbClean.includes(currentProvClean);

  // Giữ nguyên logic hiện tại của niemyet.js:
  // chỉ loại TTHC của tỉnh/thành khác; TTHC Bộ/ngành vẫn được giữ.
  const isOtherProv =
    !isCurrentProv &&
    (
      cqcbClean.includes('ubnd') ||
      cqcbClean.includes('uy ban nhan dan') ||
      cqcbClean.includes('tinh ') ||
      cqcbClean.includes('thanh pho ')
    );

  return !isOtherProv;
}

function normalizeSheetRow(row) {
  return {
    maTTHC: cleanCode(getByAliases(row, ['MaTTHC', 'Mã TTHC'])),
    tenTTHC: getByAliases(row, ['Tên TTHC', 'TenTTHC']),
    maDVC: cleanCode(getByAliases(row, ['MaDVC', 'Mã DVC'])),
    tenDVC: getByAliases(row, ['TenDVC', 'Tên DVC']),
    tenCQTH: getByAliases(row, ['TenCQTH', 'Tên CQTH', 'Tên cơ quan thực hiện']),
    maCQTH: cleanCode(getByAliases(row, ['MaCQTH', 'Mã CQTH', 'Mã cơ quan thực hiện'])),
    mucDo: getByAliases(row, ['MucDo', 'Mức độ']),
    trangThai: getByAliases(row, ['Trạng thái', 'TrangThai']),
    linhVuc: getByAliases(row, ['LinhVuc', 'Lĩnh vực']),
    loaiHeThong: getByAliases(row, ['LoaiHeThong', 'Loại hệ thống']),
    capThucHien: getByAliases(row, ['CapThucHien', 'Cấp thực hiện']),
    citizenUrl: getByAliases(row, ['Citizen URL', 'CitizenURL', 'LinkNop', 'URL']),
    coQuanCongBo: getByAliases(row, ['Cơ quan công bố', 'CoQuanCongBo'])
  };
}

function dedupeRows(rows) {
  const seen = new Set();
  const out = [];

  for (const row of rows) {
    const key = [
      row.maTTHC, row.maDVC, row.maCQTH, row.tenCQTH, row.citizenUrl
    ].join('|');

    if (seen.has(key)) continue;
    seen.add(key);
    out.push(row);
  }

  return out;
}

function buildProvincePayload(province, masterIndex, provinceRows) {
  const rowsByMaTTHC = new Map();

  for (const rawRow of provinceRows) {
    const row = normalizeSheetRow(rawRow);
    if (!row.maTTHC) continue;

    if (!rowsByMaTTHC.has(row.maTTHC)) rowsByMaTTHC.set(row.maTTHC, []);
    rowsByMaTTHC.get(row.maTTHC).push(row);
  }

  for (const [code, rows] of rowsByMaTTHC.entries()) {
    rowsByMaTTHC.set(code, dedupeRows(rows));
  }

  const seenMasterCodes = new Set();
  const catalogItems = [];
  const shards = new Map();

  for (const item of masterIndex) {
    if (!item || typeof item !== 'object') continue;
    if (!shouldIncludeMasterItem(item, province.name)) continue;

    const maTTHC = cleanCode(item.ma_tthc || item.code || '');
    if (!maTTHC || seenMasterCodes.has(maTTHC)) continue;
    seenMasterCodes.add(maTTHC);

    const executionRows = rowsByMaTTHC.get(maTTHC) || [];
    const shard = executionRows.length > 0 ? shardKey(maTTHC) : null;

    catalogItems.push({
      id: (item.id || '').toString().trim(),
      ma: maTTHC,
      ten: (item.ten_tthc || item.name || '').toString().trim(),
      lv: (item.linh_vuc || item.linhVuc || '').toString().trim() || 'KHÁC',
      cqcb: (item.co_quan_cong_bo || item.departmentPromulgateName || '').toString().trim() || 'Chưa xác định',
      cap: (item.cap_thuc_hien || item.capThucHien || '').toString().trim(),
      loai: (item.loai_tthc || '').toString().trim(),
      mucDo: (item.muc_do || '').toString().trim(),
      state: (item.state || '').toString().trim(),
      nganhDoc: item.nganh_doc === true,
      hasExecution: executionRows.length > 0,
      shard
    });

    if (executionRows.length > 0) {
      if (!shards.has(shard)) shards.set(shard, {});

      // Nhóm đúng nghiệp vụ hiện tại của niemyet:
      // MaTTHC -> nhiều MaDVC -> các dòng/cơ quan của từng MaDVC.
      // Một MaTTHC có thể có .01, .02... và tuyệt đối không được gộp lẫn.
      const dvcGroups = new Map();

      for (const row of executionRows) {
        const maDVC = row.maDVC || 'CHUA_CO_MA';

        if (!dvcGroups.has(maDVC)) {
          dvcGroups.set(maDVC, {
            d: maDVC,
            n: row.tenDVC || row.tenTTHC || 'Dịch vụ công trực tuyến',
            r: []
          });
        }

        // d,n chỉ lưu một lần ở cấp MaDVC.
        // Dữ liệu theo cơ quan vẫn giữ riêng từng dòng để không làm sai finalURL.
        dvcGroups.get(maDVC).r.push({
          a: row.tenCQTH || '',
          c: row.maCQTH || '',
          u: row.citizenUrl || '',
          m: row.mucDo || '',
          s: row.trangThai || '',
          t: row.loaiHeThong || ''
        });
      }

      shards.get(shard)[maTTHC] = {
        dvc: Array.from(dvcGroups.values())
      };
    }
  }

  const executionRowCount = Array.from(rowsByMaTTHC.values())
    .reduce((sum, rows) => sum + rows.length, 0);
  const withExecutionData = catalogItems.filter(item => item.hasExecution).length;

  return {
    catalog: {
      schemaVersion: 3,
      province: {
        code: province.code,
        name: province.name,
        slug: slugify(province.name)
      },
      stats: {
        procedures: catalogItems.length,
        proceduresWithExecutionData: withExecutionData,
        proceduresWithoutExecutionData: catalogItems.length - withExecutionData
      },
      items: catalogItems
    },
    shards,
    stats: {
      procedures: catalogItems.length,
      proceduresWithExecutionData: withExecutionData,
      executionRows: executionRowCount
    }
  };
}

async function loadProvinceDirectory() {
  const csvText = await fetchText(PROVINCE_DIRECTORY_URL);
  const rows = parseCsv(csvText);

  const map = new Map();
  for (const row of rows) {
    const name = getByAliases(row, ['TenTinh', 'Tên tỉnh', 'Tỉnh']);
    const link = getByAliases(row, ['LinkCSV', 'Link CSV', 'CSV']);
    if (name && link) map.set(safeKey(name), link);
  }

  return map;
}

async function loadProvinceRows(province, directoryMap) {
  const configuredUrl = directoryMap.get(safeKey(province.name));

  const candidates = [
    configuredUrl,
    `https://docs.google.com/spreadsheets/d/${province.sheetId}/export?format=csv&gid=0`
  ].filter(Boolean);

  let lastError = null;

  for (const url of candidates) {
    try {
      const csvText = await fetchText(url);
      const rows = parseCsv(csvText);
      if (rows.length > 0) {
        return { rows, sourceUrl: url };
      }
    } catch (e) {
      lastError = e;
    }
  }

  throw lastError || new Error(`Không tải được dữ liệu Google Sheet tỉnh ${province.name}`);
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const requestedCode = (process.env.PROVINCE_CODE || '').trim();
  const targets = requestedCode
    ? PROVINCES.filter(p => p.code === requestedCode.padStart(2, '0'))
    : PROVINCES;

  if (targets.length === 0) {
    throw new Error(`Không tìm thấy mã tỉnh PROVINCE_CODE=${requestedCode}`);
  }

  console.log('📥 Đang tải index.json toàn quốc...');
  const masterIndex = await fetchJson(MASTER_INDEX_URL);
  if (!Array.isArray(masterIndex)) throw new Error('index.json không phải mảng dữ liệu hợp lệ.');

  console.log('📥 Đang tải danh mục LinkCSV 34 tỉnh...');
  const directoryMap = await loadProvinceDirectory();

  const summary = [];

  for (const province of targets) {
    console.log(`\n🏗️  Build [${province.code}] ${province.name}...`);

    const { rows, sourceUrl } = await loadProvinceRows(province, directoryMap);
    const payload = buildProvincePayload(province, masterIndex, rows);

    const provinceDirName = `${province.code}-${slugify(province.name)}`;
    const provinceDir = path.join(OUTPUT_DIR, provinceDirName);
    const executionDir = path.join(provinceDir, 'execution');

    // Mỗi lần build lại tỉnh: dọn sạch output cũ của riêng tỉnh đó để không còn shard rác.
    if (fs.existsSync(provinceDir)) {
      fs.rmSync(provinceDir, { recursive: true, force: true });
    }
    fs.mkdirSync(executionDir, { recursive: true });

    const catalogText = JSON.stringify(payload.catalog);
    const catalogPath = path.join(provinceDir, 'catalog.json');
    fs.writeFileSync(catalogPath, catalogText);

    const shardInfo = [];
    const shardKeys = Array.from(payload.shards.keys()).sort();

    for (const key of shardKeys) {
      const shardText = JSON.stringify({
        schemaVersion: 3,
        provinceCode: province.code,
        shard: key,
        procedures: payload.shards.get(key)
      });
      const shardPath = path.join(executionDir, `${key}.json`);
      fs.writeFileSync(shardPath, shardText);
      shardInfo.push({
        key,
        bytes: Buffer.byteLength(shardText),
        procedures: Object.keys(payload.shards.get(key)).length
      });
    }

    const versionSeed = catalogText + shardKeys.map(key =>
      key + ':' + JSON.stringify(payload.shards.get(key))
    ).join('|');

    const manifest = {
      schemaVersion: 3,
      province: {
        code: province.code,
        name: province.name,
        slug: slugify(province.name)
      },
      version: sha256(versionSeed).slice(0, 16),
      builtAt: new Date().toISOString(),
      shardCount: shardInfo.length,
      configuredShardCount: SHARD_COUNT,
      stats: payload.stats,
      files: {
        catalog: {
          path: 'catalog.json',
          bytes: Buffer.byteLength(catalogText)
        },
        execution: shardInfo
      }
    };

    const manifestText = JSON.stringify(manifest);
    fs.writeFileSync(path.join(provinceDir, 'manifest.json'), manifestText);

    const executionBytes = shardInfo.reduce((sum, item) => sum + item.bytes, 0);
    const totalBytes = Buffer.byteLength(catalogText) + executionBytes + Buffer.byteLength(manifestText);

    summary.push({
      code: province.code,
      province: province.name,
      folder: provinceDirName,
      catalogKB: Math.round(Buffer.byteLength(catalogText) / 1024),
      shards: shardInfo.length,
      avgShardKB: shardInfo.length ? Math.round((executionBytes / shardInfo.length) / 1024) : 0,
      maxShardKB: shardInfo.length ? Math.round(Math.max(...shardInfo.map(x => x.bytes)) / 1024) : 0,
      totalMB: (totalBytes / 1024 / 1024).toFixed(2),
      procedures: payload.stats.procedures,
      withExecutionData: payload.stats.proceduresWithExecutionData,
      executionRows: payload.stats.executionRows,
      sourceUrl
    });

    console.log(
      `✅ ${provinceDirName}: catalog ${Math.round(Buffer.byteLength(catalogText) / 1024)} KB, ` +
      `${shardInfo.length} shard, TB ${(totalBytes / 1024 / 1024).toFixed(2)} MB`
    );
  }

  console.log('\n🎉 Hoàn tất build dữ liệu Niêm yết.');
  console.table(summary.map(({ sourceUrl, ...rest }) => rest));
}

main().catch(err => {
  console.error('\n❌ BUILD NIÊM YẾT THẤT BẠI:', err.message);
  process.exit(1);
});
