const axios = require('axios');
const fs = require('fs');
const readline = require('readline');
require('dotenv').config();

const headers = {
    "accept": "application/json",
    "content-type": "application/json"
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (url, payload, headers, maxRetries = 5) => {
    for (let i = 0; i <= maxRetries; i++) {
        try {
            const res = await axios.post(url, payload, { headers, timeout: 30000 }); 
            return res.data;
        } catch (err) {
            if (i < maxRetries) {
                const waitTime = Math.pow(2, i) * 1000;
                console.log(`\n⚠️ Mạng chậm, đang thử lại lần ${i + 1}...`);
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
    console.log('\n=== CÔNG CỤ XÂY DỰNG DATA JSON (BẢN CLOUD - GITHUB ACTIONS) ===\n');

    // CẤU HÌNH ĐƯỜNG DẪN MÁY CHỦ ẢO (LINUX)
    const DATA_DIR = './data';
    const DETAILS_DIR = `${DATA_DIR}/details`;
    const previous = await axios.get('https://raw.githubusercontent.com/ChippedTopaz/am-sieu-toc-data/data/index.json?t=' + Date.now(), { timeout: 30000 });
    if (!Array.isArray(previous.data) || previous.data.length < 5000) throw new Error('Healthy previous index unavailable. Publication blocked.');
    
    // Xóa sạch data cũ mỗi lần cào mới để kho lưu trữ không bị rác
    if (fs.existsSync(DATA_DIR)) fs.rmSync(DATA_DIR, { recursive: true, force: true });
    
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.mkdirSync(DETAILS_DIR, { recursive: true });

    let rawList = [];
    let lastId = "";
    console.log(`🚀 Đang lấy danh mục TTHC toàn quốc...`);
    
    while (true) {
        const payload = { limit: 200, lastId: lastId, q: "", categoryId: "", departmentCode: "" };
        const res = await fetchWithRetry('https://dichvucong.gov.vn/api/v1/submitting/formality/list-all-public-formality-by-citizen', payload, headers);
        if (!res || !res.data || !Array.isArray(res.data.items)) throw new Error('Invalid list API response. Publication blocked.');
        if (res.data.items.length === 0) break;
        res.data.items.forEach(item => rawList.push(item));
        if (!res.data.lastId) break;
        if (res.data.lastId === lastId) throw new Error('Pagination cursor repeated. Publication blocked.');
        lastId = res.data.lastId;
        console.log(`   Đã tìm thấy: ${rawList.length} mã`);
        await delay(100);
    }
    console.log(`✅ Tổng số TTHC gốc: ${rawList.length}`);
    if (rawList.length < Math.max(5000, Math.ceil(previous.data.length * 0.9))) throw new Error('Procedure count unexpectedly small. Publication blocked.');

    if (rawList.length > 0) {
        console.log(`⚡ Tiến hành tải chi tiết cho: ${rawList.length} thủ tục.`);
        const chunkSize = 20; 
        
        let indexData = [];

        for (let i = 0; i < rawList.length; i += chunkSize) {
            const chunk = rawList.slice(i, i + chunkSize);
            const promises = chunk.map(async (item) => {
                try {
                    const res = await fetchWithRetry('https://dichvucong.gov.vn/api/v1/configuring/formality/get-formality-by-citizen', { id: item.id }, headers);
                    if (res && res.data) {
                        let detail = res.data.data || res.data;
                        
                        // 1. Tạo dữ liệu cho file Index
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

                        // 2. Xuất file chi tiết
                        const cleanDetail = sanitizeBase64(detail);
                        fs.writeFileSync(`${DETAILS_DIR}/${item.id}.json`, JSON.stringify(cleanDetail));
                    }
                } catch (e) { } 
            });
            await Promise.all(promises);
            console.log(`   Tải chi tiết & Lưu file: ${Math.min(i + chunkSize, rawList.length)}/${rawList.length}`);
            await delay(150); 
        }

        if (indexData.length !== rawList.length) throw new Error('Missing procedure details. Publication blocked.');
        // Xuất file cấu trúc Index
        fs.writeFileSync(`${DATA_DIR}/index.json`, JSON.stringify(indexData));
        const versionInfo = { 
            last_updated: new Date().toISOString(),
            total_records: indexData.length 
        };
        fs.writeFileSync(`${DATA_DIR}/version.json`, JSON.stringify(versionInfo));

        console.log(`🎉 HOÀN TẤT TUYỆT ĐỐI! Toàn bộ dữ liệu đã sẵn sàng để đẩy ra nhánh data.`);
    }
}

main().catch(err => {
    console.error('CRAWL FAILED - publication blocked:', err.code || err.message);
    process.exitCode = 1;
});

