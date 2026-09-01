# 香港五行彩 - 云端版部署说明

## 📦 文件结构

```
香港五行彩云端版/
├── index.html          # 总台页面
├── front.html          # 前台页面
├── pan.html            # 子盘页面
├── _redirects          # Netlify 路由配置
├── supabase-init.sql   # 数据库初始化脚本
└── js/
    ├── supabase-config.js   # Supabase 配置（已填好密钥）
    └── supabase-data.js     # 数据同步层
```

## 🚀 部署步骤

### 第一步：初始化 Supabase 数据库

1. 登录 Supabase 官网：https://supabase.com
2. 进入项目：study-data
3. 点击左侧 **SQL Editor**
4. 新建查询，粘贴 `supabase-init.sql` 文件的全部内容
5. 点击 **Run** 执行

### 第二步：部署到 Netlify

1. 登录 Netlify 官网：https://netlify.com
2. 点击 **Add new site** → **Deploy manually**
3. 拖拽整个 `香港五行彩云端版` 文件夹到上传区域
4. 等待部署完成，获取网站域名（如 `https://xxx.netlify.app`）

### 第三步：访问使用

| 页面 | 访问地址 |
|------|---------|
| **总台** | `https://您的域名/` 或 `/admin` |
| **前台** | `https://您的域名/front` |
| **子盘** | `https://您的域名/pan?id=子盘UUID`（由前台生成） |

## 🔑 默认密码

| 页面 | 初始密码 |
|------|---------|
| 总台 | 123456 |
| 前台 | 123456 |
| 子盘 | 123456（每个子盘独立） |

## 📡 数据同步说明

- 所有数据实时同步到 Supabase 云端
- 子盘投注数据自动同步到前台和总台
- 总台设置的期数自动同步到所有页面
- 支持多电脑同时访问，数据实时一致

## ⚠️ 注意事项

1. Supabase 免费版有数据库行数限制（约50万行），如需更多请升级
2. Netlify 免费版有流量限制（100GB/月），一般足够使用
3. 建议定期备份数据库

## 🎉 完成！

部署完成后，您可以在任何有网络的电脑上通过浏览器访问系统，数据全部云端同步！
