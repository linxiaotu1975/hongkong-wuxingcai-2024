-- 香港五行彩 Supabase 数据库初始化脚本

-- 1. 子盘表
CREATE TABLE IF NOT EXISTS pans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    password TEXT NOT NULL DEFAULT '123456',
    front_id TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 投注数据表
CREATE TABLE IF NOT EXISTS bets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pan_id UUID REFERENCES pans(id) ON DELETE CASCADE,
    dimension TEXT NOT NULL, -- 特码/生肖/平码/波色/五行/大小/单双
    item TEXT NOT NULL, -- 具体项目（如"01"或"鼠"）
    amount NUMERIC NOT NULL DEFAULT 0,
    mode TEXT DEFAULT 'add', -- add/reduce
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 期数设置表
CREATE TABLE IF NOT EXISTS qishu (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year INTEGER NOT NULL,
    date TEXT NOT NULL,
    qishu_num INTEGER NOT NULL,
    time TEXT NOT NULL DEFAULT '22:30',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 赔率配置表
CREATE TABLE IF NOT EXISTS odds_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dimension TEXT NOT NULL,
    item TEXT,
    top_odds NUMERIC,
    bottom_odds NUMERIC,
    commission NUMERIC DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 前台辅注表
CREATE TABLE IF NOT EXISTS front_extra (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dimension TEXT NOT NULL,
    item TEXT NOT NULL,
    amount NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 插入默认期数
INSERT INTO qishu (year, date, qishu_num, time) 
VALUES (2026, '2026-08-31', 137, '22:30')
ON CONFLICT DO NOTHING;

-- 插入默认赔率（示例）
INSERT INTO odds_config (dimension, item, top_odds, bottom_odds, commission) VALUES
('特码', 'default', 48.5, 48.5, 0),
('生肖', 'default', 11.5, 11.5, 0),
('生肖', '马', 12.0, 12.0, 0),
('平码', 'default', 7.0, 7.0, 0),
('波色', '红波', 2.8, 2.8, 0),
('波色', '蓝波', 2.8, 2.8, 0),
('波色', '绿波', 2.8, 2.8, 0),
('五行', 'default', 4.5, 4.5, 0),
('大小', '大', 1.95, 1.95, 0),
('大小', '小', 1.95, 1.95, 0),
('单双', '单', 1.95, 1.95, 0),
('单双', '双', 1.95, 1.95, 0)
ON CONFLICT DO NOTHING;

-- 启用 RLS
ALTER TABLE pans ENABLE ROW LEVEL SECURITY;
ALTER TABLE bets ENABLE ROW LEVEL SECURITY;
ALTER TABLE qishu ENABLE ROW LEVEL SECURITY;
ALTER TABLE odds_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE front_extra ENABLE ROW LEVEL SECURITY;

-- 创建公开访问策略（简化版，实际生产应加认证）
CREATE POLICY "public_pans" ON pans FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_bets" ON bets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_qishu" ON qishu FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_odds" ON odds_config FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_extra" ON front_extra FOR ALL USING (true) WITH CHECK (true);

-- 创建实时订阅
BEGIN;
  --  bets 表实时
  ALTER TABLE bets REPLICA IDENTITY FULL;
  -- pans 表实时
  ALTER TABLE pans REPLICA IDENTITY FULL;
  -- qishu 表实时
  ALTER TABLE qishu REPLICA IDENTITY FULL;
COMMIT;
