const axios = require('axios');
const fs = require('fs');
const readline = require('readline');
require('dotenv').config();

const headers = {
    "accept": "application/json",
    "content-type": "application/json"
};

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const askQuestion = (query) => new Promise(resolve => rl.question(query, resolve));
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (url, payload, headers, maxRetries = 5) => {
    for (let i = 0; i <= maxRetries; i++) {
        try {
            const res = await axios.post(url, payload, { headers, timeout: 30000 }); 
            return res.data;
        } catch (err) {
            if (i < maxRetries) {
                const waitTime = Math.pow(2, i) * 1000;
                process.stdout.write(`\n⚠️ Mạng chậm, đang thử lại lần ${i + 1}...`);
                await delay(waitTime);
            } else throw err;
        }
    }
};

function sanitizeBase64(obj) {
    let str = JSON.stringify(obj);
    str = str.replace(/data:image\/[^;]+;base64,[a-zA-Z0-9+/=]+/g, '[Hình ảnh đính kèm trên DVCQG]');
    return JSON.parse(str);
}

function parseFormalityType(type) {
    if (type === 'ASSIGNED_REGULATION') return 'TTHC được luật giao quy định chi tiết';
    if (type === 'SPECIFIC') return 'TTHC Đặc thù';
    if (type === 'STANDARD') return 'TTHC Tiêu chuẩn';
    if (type === 'INTERCONNECTED') return 'TTHC liên thông';
    if (type === 'STANDARD_INTERNAL') return 'TTHC nội bộ';
    if (type === 'INTERCONNECTED_INTERNAL') return 'TTHC nội bộ liên thông';
    return type || 'Không xác định';
}

function parseFormalityCaseLevel(detail) {
    let arr = [];
    if (detail.isWard) arr.push('Cấp xã');
    if (detail.isProvince) arr.push('Cấp tỉnh');
    if (detail.isMinistry) arr.push('Cấp Bộ');
    if (detail.isOtherAgency) arr.push('Cơ quan khác');
    return arr.length > 0 ? arr.join(', ') : 'Chưa xác định';
}

async function main() {
    console.log('\n=== CÔNG CỤ XÂY DỰNG DATA JSON CHO ẤM SIÊU TỐC ===\n');

    // 1. Cấu hình đích đến (Dùng đường dẫn tương đối để chạy trên mây)
    const DATA_DIR = './data';
    const DETAILS_DIR = `${DATA_DIR}/details`;
    
    // Nếu chạy trên GitHub Actions, tự động xóa sạch thư mục data cũ để không lưu rác TTHC đã bị hủy
    if (process.env.GITHUB_ACTIONS && fs.existsSync(DATA_DIR)) {
        fs.rmSync(DATA_DIR, { recursive: true, force: true });
    }
    
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(DETAILS_DIR)) fs.mkdirSync(DETAILS_DIR, { recursive: true });
    
    // Quản lý Cache
    const CACHE_FILE = `${DATA_DIR}/master_cache.json`;
    let localCache = {};
    
    // Tự động bỏ qua Cache, quét mới 100% nếu đang chạy trên mây
    if (process.env.GITHUB_ACTIONS) {
        console.log("🤖 Đang chạy trên GitHub Actions: Tự động chọn Quét mới 100% và ghi đè dữ liệu.");
    } else if (fs.existsSync(CACHE_FILE)) {
        try {
            localCache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
            const choice = await askQuestion('❓ Chạy chế độ nào? [1] Quét mới 100% | [2] Dùng Cache siêu tốc: ');
            if (choice.trim() === '1') localCache = {}; 
        } catch (e) {}
    }
    rl.close();

    let rawList = [];
    let lastId = "";
    console.log(`\n🚀 Đang lấy danh mục TTHC toàn quốc...`);
    while (true) {
        const payload = { limit: 200, lastId: lastId, q: "", categoryId: "", departmentCode: "" };
        const res = await fetchWithRetry('https://dichvucong.gov.vn/api/v1/submitting/formality/list-all-public-formality-by-citizen', payload, headers);
        if (!res || !res.data || !res.data.items || res.data.items.length === 0) break;
        res.data.items.forEach(item => rawList.push(item));
        if (!res.data.lastId || res.data.lastId === lastId) break;
        lastId = res.data.lastId;
        process.stdout.write(`\r   Đã tìm thấy: ${rawList.length} mã`);
        await delay(100);
    }
    console.log(`\n✅ Tổng số TTHC gốc: ${rawList.length}`);

    const fidsToFetch = rawList.map(i => i.id).filter(id => !localCache[id]);
    if (fidsToFetch.length > 0) {
        console.log(`⚡ Tiến hành tải chi tiết cho: ${fidsToFetch.length} thủ tục mới.`);
        const chunkSize = 20; 
        for (let i = 0; i < fidsToFetch.length; i += chunkSize) {
            const chunk = fidsToFetch.slice(i, i + chunkSize);
            const promises = chunk.map(async (fid) => {
                try {
                    const res = await fetchWithRetry('https://dichvucong.gov.vn/api/v1/configuring/formality/get-formality-by-citizen', { id: fid }, headers);
                    if (res && res.data) localCache[fid] = res.data.data || res.data;
                } catch (e) { } 
            });
            await Promise.all(promises);
            process.stdout.write(`\r   Tải chi tiết: ${Math.min(i + chunkSize, fidsToFetch.length)}/${fidsToFetch.length}`);
            await delay(150); 
        }
        fs.writeFileSync(CACHE_FILE, JSON.stringify(localCache));
        console.log(`\n💾 Đã lưu Cache vào ổ cứng.`);
    }

    console.log(`\n🚀 Đang kết xuất dữ liệu ra hệ thống File JSON...`);
    let indexData = [];

    rawList.forEach((item) => {
        const detail = localCache[item.id];
        if (!detail) return; 

        // Trích xuất File Index
        const formalityItem = {
            id: item.id,
            ma_tthc: item.code,
            ten_tthc: item.name,
            cap_thuc_hien: parseFormalityCaseLevel(detail),
            loai_tthc: parseFormalityType(item.type || detail.formalityType),
            linh_vuc: (item.categories && item.categories.length > 0) ? item.categories.join(', ') : '',
            co_quan_thuc_hien: detail.executingAgencies || (item.departments ? item.departments.join(', ') : '')
        };
        indexData.push(formalityItem);

        // Xuất file chi tiết
        const cleanDetail = sanitizeBase64(detail);
        fs.writeFileSync(`${DETAILS_DIR}/${item.id}.json`, JSON.stringify(cleanDetail));
    });

    // Xuất file cấu trúc
    fs.writeFileSync(`${DATA_DIR}/index.json`, JSON.stringify(indexData));
    const versionInfo = { 
        last_updated: new Date().toISOString(),
        total_records: indexData.length 
    };
    fs.writeFileSync(`${DATA_DIR}/version.json`, JSON.stringify(versionInfo));

    console.log(`🎉 HOÀN TẤT TUYỆT ĐỐI!`);
    console.log(`📁 File tra cứu tổng: ${DATA_DIR}/index.json`);
    console.log(`📁 File cấu hình version: ${DATA_DIR}/version.json`);
    console.log(`📁 Thư mục chi tiết: ${DETAILS_DIR} (Chứa ${indexData.length} file .json)`);
}

main();