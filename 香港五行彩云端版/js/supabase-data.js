// ===== 香港五行彩 - Supabase 数据同步层 =====

// 初始化
let db = null;
let realtimeChannels = [];

async function initDB() {
    db = getSupabase();
    if (!db) {
        console.error('数据库未初始化');
        return false;
    }
    // 测试连接
    const { data, error } = await db.from('qishu').select('*').limit(1);
    if (error) {
        console.error('数据库连接失败:', error);
        return false;
    }
    console.log('✅ 数据库连接成功');
    return true;
}

// ========== 期数管理 ==========
async function loadQishu() {
    if (!db) await initDB();
    const { data, error } = await db.from('qishu').select('*').order('updated_at', { ascending: false }).limit(1);
    if (error) { console.error('加载期数失败:', error); return null; }
    return data && data[0] ? data[0] : null;
}

async function saveQishuDB(qishuData) {
    if (!db) await initDB();
    // 先删除旧数据，再插入新数据（简化版）
    await db.from('qishu').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const { data, error } = await db.from('qishu').insert([qishuData]);
    if (error) { console.error('保存期数失败:', error); return false; }
    return true;
}

// ========== 子盘管理 ==========
async function createPan(name, frontId) {
    if (!db) await initDB();
    const { data, error } = await db.from('pans').insert([{
        name: name,
        front_id: frontId,
        password: '123456',
        status: 'active'
    }]).select();
    if (error) { console.error('创建子盘失败:', error); return null; }
    return data && data[0] ? data[0] : null;
}

async function getPanById(panId) {
    if (!db) await initDB();
    const { data, error } = await db.from('pans').select('*').eq('id', panId).single();
    if (error) { console.error('获取子盘失败:', error); return null; }
    return data;
}

async function getAllPans() {
    if (!db) await initDB();
    const { data, error } = await db.from('pans').select('*').eq('status', 'active').order('created_at', { ascending: true });
    if (error) { console.error('获取子盘列表失败:', error); return []; }
    return data || [];
}

async function updatePanPassword(panId, newPassword) {
    if (!db) await initDB();
    const { error } = await db.from('pans').update({ password: newPassword }).eq('id', panId);
    if (error) { console.error('更新密码失败:', error); return false; }
    return true;
}

// ========== 投注数据 ==========
async function saveBet(panId, dimension, item, amount, mode) {
    if (!db) await initDB();
    const { data, error } = await db.from('bets').insert([{
        pan_id: panId,
        dimension: dimension,
        item: item,
        amount: amount,
        mode: mode
    }]);
    if (error) { console.error('保存投注失败:', error); return false; }
    return true;
}

async function getBetsByPan(panId) {
    if (!db) await initDB();
    const { data, error } = await db.from('bets').select('*').eq('pan_id', panId);
    if (error) { console.error('获取投注失败:', error); return []; }
    return data || [];
}

async function getAllBets() {
    if (!db) await initDB();
    const { data, error } = await db.from('bets').select('*');
    if (error) { console.error('获取全部投注失败:', error); return []; }
    return data || [];
}

async function deleteBet(betId) {
    if (!db) await initDB();
    const { error } = await db.from('bets').delete().eq('id', betId);
    if (error) { console.error('删除投注失败:', error); return false; }
    return true;
}

// ========== 赔率配置 ==========
async function loadOdds() {
    if (!db) await initDB();
    const { data, error } = await db.from('odds_config').select('*');
    if (error) { console.error('加载赔率失败:', error); return []; }
    return data || [];
}

async function saveOdds(dimension, item, topOdds, bottomOdds, commission) {
    if (!db) await initDB();
    const { error } = await db.from('odds_config').upsert({
        dimension: dimension,
        item: item,
        top_odds: topOdds,
        bottom_odds: bottomOdds,
        commission: commission
    });
    if (error) { console.error('保存赔率失败:', error); return false; }
    return true;
}

// ========== 前台辅注 ==========
async function saveFrontExtra(dimension, item, amount) {
    if (!db) await initDB();
    const { error } = await db.from('front_extra').upsert({
        dimension: dimension,
        item: item,
        amount: amount
    });
    if (error) { console.error('保存辅注失败:', error); return false; }
    return true;
}

async function getFrontExtra() {
    if (!db) await initDB();
    const { data, error } = await db.from('front_extra').select('*');
    if (error) { console.error('获取辅注失败:', error); return []; }
    return data || [];
}

// ========== 实时订阅 ==========
function subscribeBets(callback) {
    if (!db) return;
    const channel = db.channel('bets-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'bets' }, callback)
        .subscribe();
    realtimeChannels.push(channel);
}

function subscribeQishu(callback) {
    if (!db) return;
    const channel = db.channel('qishu-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'qishu' }, callback)
        .subscribe();
    realtimeChannels.push(channel);
}

function subscribePans(callback) {
    if (!db) return;
    const channel = db.channel('pans-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'pans' }, callback)
        .subscribe();
    realtimeChannels.push(channel);
}

// 导出
window.initDB = initDB;
window.loadQishu = loadQishu;
window.saveQishuDB = saveQishuDB;
window.createPan = createPan;
window.getPanById = getPanById;
window.getAllPans = getAllPans;
window.updatePanPassword = updatePanPassword;
window.saveBet = saveBet;
window.getBetsByPan = getBetsByPan;
window.getAllBets = getAllBets;
window.deleteBet = deleteBet;
window.loadOdds = loadOdds;
window.saveOdds = saveOdds;
window.saveFrontExtra = saveFrontExtra;
window.getFrontExtra = getFrontExtra;
window.subscribeBets = subscribeBets;
window.subscribeQishu = subscribeQishu;
window.subscribePans = subscribePans;
