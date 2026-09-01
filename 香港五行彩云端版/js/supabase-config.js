// Supabase 配置
const SUPABASE_URL = 'https://aeihmceswzywoyixzvsgi.supabase.co';
const SUPABASE_KEY = 'sb_publishable_rdTbQzl2gtdkZgxxLF_nNw_gH8lZjcr';

let supabaseClient = null;

function initSupabase() {
    if (typeof supabase !== 'undefined' && supabase.createClient) {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log('✅ Supabase 连接成功');
        return supabaseClient;
    }
    console.error('❌ Supabase 库未加载');
    return null;
}

function getSupabase() {
    if (!supabaseClient) return initSupabase();
    return supabaseClient;
}

window.SUPABASE_URL = SUPABASE_URL;
window.SUPABASE_KEY = SUPABASE_KEY;
window.initSupabase = initSupabase;
window.getSupabase = getSupabase;
