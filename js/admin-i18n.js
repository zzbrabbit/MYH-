/* ==========================================================================
   admin-i18n.js — 后台中英双语显示
   把后台界面上的英文文案统一显示为「English 中文」，与 About 页面 schema
   的标注风格一致，方便不懂英文的同事维护。
   做法：词条词典 + DOM 注入（覆盖静态 HTML 与 JS 动态渲染内容），
   不改动业务代码、不影响任何 value / 用户数据。
   顶栏按钮可一键切换中英显示，状态记在 localStorage。
   ========================================================================== */
(function () {
  'use strict';

  var STORE_KEY = 'myh_admin_zh';

  /* ---------- 主词典：英文 → 中文 ---------- */
  var DICT = {
    /* 导航 / 标签页 */
    'MYH Beauty Admin': 'MYH 美容后台',
    'Admin': '后台',
    'View Store': '查看店铺',
    'Back to Site': '返回网站',
    'Logout': '退出登录',
    'Sign out': '退出登录',
    'Products': '产品',
    'Page Content': '页面内容',
    'Home Banners': '首页横幅',
    'Category Icons': '分类图标',
    'Blog Articles': '博客文章',
    'Social Links': '社交链接',
    'Messages': '客户留言',

    /* 各页标题与说明 */
    'Product Management': '产品管理',
    'Manage your beauty instrument product catalog': '管理你的美容仪器产品目录',
    'Page Content Management': '页面内容管理',
    'Edit text and images on every page of your website': '编辑网站每个页面的文字与图片',
    'Home Banner Management': '首页横幅管理',
    'Add, edit and reorder the poster carousel shown at the top of the homepage': '新增、编辑、排序首页顶部的海报轮播',
    'Replace the small category icons shown under the homepage poster carousel': '替换首页海报轮播下方的小分类图标',
    'Blog Article Management': '博客文章管理',
    'Add, edit or delete the articles shown on the Blog page': '新增、编辑或删除博客页显示的文章',
    'Social Media Links': '社交媒体链接',
    'Manage the social icons shown in the site footer and on the Contact page': '管理网站页脚和联系页显示的社交图标',
    'Customer Messages': '客户留言',
    'Messages submitted by customers from the Contact page': '客户在联系页提交的留言',

    /* 按钮 */
    'Add Product': '新增产品',
    'Add Article': '新增文章',
    'Add Social Link': '新增社交链接',
    'Add Spec Row': '新增一行规格',
    'Import': '导入',
    'Export Data': '导出数据',
    'Export': '导出',
    'Publish to Website': '发布到网站',
    'Sync to GitHub': '同步到 GitHub',
    'Save Product': '保存产品',
    'Save Article': '保存文章',
    'Save Link': '保存链接',
    'Save Changes': '保存修改',
    'Save Banners': '保存横幅',
    'Save Icons': '保存图标',
    'Save Images': '保存图片',
    'Reset Page': '重置本页',
    'Reset Defaults': '恢复默认',
    'Restore Defaults': '恢复默认',
    'Restore Sample Articles': '恢复示例文章',
    'Use Default Icons': '使用默认图标',
    'Refresh': '刷新',
    'Clear All': '清空全部',
    'Send Reply': '发送回复',
    'Open in Email': '在邮件中打开',
    'Forward To Email': '转发到邮箱',
    'Send Test': '发送测试',
    'Test Connection': '测试连接',
    'Push Whole Site': '推送整站代码',
    'Push as files': '按文件推送',
    'Push Now': '立即推送',
    'Copy to Clipboard': '复制到剪贴板',
    'Upload': '上传',
    'Remove': '移除',
    'Cancel': '取消',
    'Delete': '删除',
    'Edit': '编辑',
    'Save': '保存',
    'Close': '关闭',
    'Preview': '预览',
    'Live Preview': '实时预览',
    'Not set': '未设置',
    'Add': '添加',
    'or': '或',
    'Actions': '操作',
    'Delete Product?': '删除产品？',

    /* 表单字段 */
    'Product Name': '产品名称',
    'Category': '分类',
    'Price (USD)': '价格（美元）',
    'Compare-at Price (USD)': '原价（美元）',
    'Rating (0-5)': '评分（0-5）',
    'Review Count': '评价数量',
    'Brand': '品牌',
    'Tag': '标签',
    'Tags comma separated': '标签（英文逗号分隔）',
    'Product Icon': '产品图标',
    'Card Color': '卡片配色',
    'Product Main Image': '产品主图',
    'Detail Gallery Images': '详情页图集',
    'Specification Table': '规格参数表',
    'Description': '产品描述',
    'Short Description': '简短描述',
    'Application Area': '适用部位',
    'Specifications': '规格参数',
    'Key Features': '核心卖点',
    'Article Title': '文章标题',
    'Article Content': '文章正文',
    'Read Time': '阅读时长',
    'Excerpt': '摘要',
    'Featured Article': '精选文章',
    'Cover Image': '封面图',
    'Platform': '平台',
    'Profile URL': '主页链接',
    'Repository owner': '仓库所有者',
    'Repository name': '仓库名称',
    'File path in repo': '仓库内文件路径',
    'GitHub access token': 'GitHub 访问令牌',
    'Branch': '分支',
    'Author': '作者',
    'Date': '日期',
    'Message': '留言内容',
    'Replies': '回复记录',
    'Storage': '存储',
    'Success': '成功',
    'Featured': '精选',
    'Created': '创建时间',
    'No image': '暂无图片',
    'No Products Found': '暂无产品',
    'Start by adding your first product or import existing data.': '请先新增第一个产品，或导入已有数据。',
    'Show on homepage featured section': '显示在首页推荐位',
    'Show as the big article on the Blog page': '作为博客页的大图文章展示',

    /* 下拉选项：筛选 */
    'All Categories': '全部分类',
    'Select category...': '请选择分类…',
    'Select brand...': '请选择品牌…',
    'Select area...': '请选择部位…',
    'Select Page to Edit': '选择要编辑的页面',

    /* 下拉选项：产品分类 */
    'RF Technology': 'RF 射频',
    'LED Therapy': 'LED 光疗',
    'Microcurrent': '微电流',
    'Ultrasonic': '超声波',
    'Body Care': '身体护理',
    'Cavitation Machine': '爆脂仪',
    'Dermabrasion': '磨皮焕肤',
    'Vacuum Therapy': '负压理疗',
    'Hair Removal': '脱毛',
    'EMS Machine': 'EMS 仪器',
    'S Shape Machine': 'S 塑形仪',
    'Cryolipolysis': '冷冻溶脂',
    'Microneedling': '微针',

    /* 下拉选项：部位 / 标签 */
    'Face & Neck': '面部与颈部',
    'Eye Area': '眼周',
    'Full Body': '全身',
    'Full Body Treatment': '全身护理',
    'Localized Body': '局部身体',
    'Scalp & Hair': '头皮与毛发',
    'Best Seller': '热销',
    'Professional': '专业级',
    'Home Use': '家用',
    'Popular': '人气',
    'Pro Series': '专业系列',
    'Limited': '限量',
    'Hot Sale': '促销',
    'Salon Grade': '沙龙级',
    'OEM Ready': '支持 OEM',
    'Top Rated': '好评',

    /* 搜索与输入提示 */
    'Search products...': '搜索产品…',
    'Search articles...': '搜索文章…',
    'Search messages...': '搜索留言…',
    'Paste image URL': '粘贴图片链接',
    'Write a reply to this customer...': '写给这位客户的回复…',
    'Write the full article here...': '在此撰写正文…',
    'A short summary of the article...': '文章的简短摘要…',
    'Brief product description...': '产品简短描述…',
    'Your email address': '你的邮箱地址',
    'Enter text...': '请输入文字…',
    'Enter a number...': '请输入数字…',
    'Enter HTML content...': '请输入 HTML 内容…',

    /* 富文本工具条 */
    'Bold (Ctrl+B)': '加粗 (Ctrl+B)',
    'Italic (Ctrl+I)': '斜体 (Ctrl+I)',
    'Underline (Ctrl+U)': '下划线 (Ctrl+U)',
    'Heading': '标题',
    'Paragraph': '段落',
    'Bullet List': '项目符号',
    'Numbered List': '编号列表',
    'Insert Link': '插入链接',
    'Clear Formatting': '清除格式',

    /* 登录页 */
    'Admin Dashboard': '管理后台',
    'Username': '用户名',
    'Password': '密码',
    'Enter your username': '请输入用户名',
    'Enter your password': '请输入密码',
    'Sign In': '登录',
    'Signing in...': '登录中…',
    'Back to Website': '返回网站',
    'Remember me': '记住我',

    /* 表格 / 计数 / 其它界面词 */
    'Product': '产品',
    'Article': '文章',
    'Categories': '分类',
    'HTML': '富文本',
    'Activate': '激活',
    'Describe this poster': '描述这张海报',
    'Describe this image': '描述这张图片',
    'editable fields available': '个可编辑项',
    'fields customized': '项已自定义',
    'Instagram': 'Instagram 照片墙',
    'Facebook': 'Facebook 脸书',
    'YouTube': 'YouTube 油管',
    'LinkedIn': 'LinkedIn 领英',
    'Twitter': 'Twitter 推特',
    'Pinterest': 'Pinterest 拼趣',
    'TikTok': 'TikTok 抖音',
    'WeChat': 'WeChat 微信',
    'Weibo': 'Weibo 微博',
    'WhatsApp': 'WhatsApp',

    /* 类型标签 */
    'Text': '文字',
    'Number': '数字',
    'Image': '图片',
    'Modified': '已修改'
  };

  /* ---------- 规则：带数字的计数文案 ---------- */
  var RULES = [
    [/(\d+)\s+products\b/g, '$1 个产品'],
    [/(\d+)\s+articles\b/g, '$1 篇文章'],
    [/(\d+)\s+messages\b/g, '$1 条留言'],
    [/(\d+)\s+of\s+(\d+)\s+fields customized/g, '共 $2 项，已自定义 $1 项'],
    [/(\d+)\s+editable fields available/g, '共 $1 个可编辑项']
  ];

  /* ---------- 上下文词典：同一英文在不同位置含义不同 ---------- */
  var CONTEXT = [
    { selector: '.msg-filter', dict: { 'All': '全部', 'New': '未读', 'Read': '已读', 'Replied': '已回复' } }
  ];

  /* ---------- 长提示语：英文原文 + 简短中文 ---------- */
  var HINTS = [
    ['Recommended image size: 1920 × 650 (wide poster). The slider auto-scrolls through your posters. Drag-free ordering uses the ↑ / ↓ buttons.',
     '建议图片尺寸 1920×650 宽幅海报，轮播自动播放，用 ↑ / ↓ 调整顺序。'],
    ['Upload a square image (recommended 120 × 120 or larger, PNG/JPG). Leave a tile empty to keep its built-in blue line icon.',
     '建议上传正方形图片 120×120 以上（PNG/JPG），留空则显示内置蓝色线条图标。'],
    ['Recommended cover image: 900 × 560 (wide). Articles are sorted by date (newest first). The one marked Featured appears as the big article on the Blog page.',
     '封面建议 900×560 宽图；文章按日期倒序，标记为精选的会作为博客页大图。'],
    ['Paste the full URL (starting with https://) for each platform — e.g. https://www.facebook.com/yourpage. Icons with an empty URL still show as a dimmed placeholder until you fill it in. Order here = order on the website.',
     '请粘贴完整链接（以 https:// 开头）；未填写的图标会显示为灰色占位。此处顺序 = 网站显示顺序。'],
    ['Profile URL Full link starting with https:// (or mailto: / tel:). Leave empty to keep a placeholder icon.',
     '请填写 https:// 开头的完整链接（或 mailto: / tel:），留空则显示占位图标。'],
    ['Additional images shown in the product detail popup.', '产品详情页弹窗中展示的更多图片。'],
    ['Used as product thumbnail on cards and main image in detail view.', '作为卡片缩略图与详情页主图。'],
    ['This action cannot be undone. The product will be permanently removed from your catalog.',
     '此操作不可撤销，产品将从目录中永久删除。'],
    ['Store as files in the repo (recommended): images → images/, products/posts → content/*.json, and a slim data.js index. Keeps the repo clean and the live site loads faster.',
     '推荐按文件存储：图片 → images/，产品/文章 → content/*.json，data.js 只留索引，仓库更干净、网站加载更快。'],
    ['Excerpt shown on article cards', '显示在文章卡片上的摘要']
  ];

  /* ---------- 工具 ---------- */
  var CJK = /[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]/;

  function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  function buildRe(dict) {
    var keys = Object.keys(dict).sort(function (a, b) { return b.length - a.length; });
    if (!keys.length) return null;
    return new RegExp('(?<![A-Za-z])(' + keys.map(esc).join('|') + ')(?![A-Za-z])', 'g');
  }

  var RE_MAIN = buildRe(DICT);
  var RE_CTX = CONTEXT.map(function (c) {
    return { sel: c.selector, re: buildRe(c.dict), dict: c.dict };
  });

  function translate(str, re, dict) {
    if (!str || !re) return str;
    if (CJK.test(str)) return str;                 // 已含中文 → 不再处理
    return str.replace(re, function (m) {
      var zh = dict[m];
      return zh ? m + ' ' + zh : m;
    });
  }

  function translateAll(str) {
    var out = str;
    RULES.forEach(function (r) { out = out.replace(r[0], r[1]); });
    RE_CTX.forEach(function (c) { out = translate(out, c.re, c.dict); });
    return translate(out, RE_MAIN, DICT);
  }

  /* 上下文专用（如留言筛选按钮） */
  function translateInContext(el, str) {
    for (var i = 0; i < RE_CTX.length; i++) {
      if (el.matches && el.matches(RE_CTX[i].sel)) {
        return translate(str, RE_CTX[i].re, RE_CTX[i].dict);
      }
    }
    return null;
  }

  /* ---------- 记录原文，便于切换回纯英文 ---------- */
  var textOrig = new WeakMap();
  var attrOrig = new WeakMap();
  var applying = false;

  function applyNode(node) {
    if (node.nodeType !== 3) return;
    var parent = node.parentElement;
    if (!parent) return;
    var tag = parent.tagName;
    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEXTAREA' || tag === 'NOSCRIPT') return;
    if (parent.closest && parent.closest('[data-no-i18n]')) return;

    var orig = textOrig.get(node);
    var base = orig !== undefined ? orig : node.nodeValue;
    if (!base || !base.trim()) return;

    var next;
    var ctx = translateInContext(parent, base);
    next = ctx !== null ? ctx : translateAll(base);
    if (next === base) return;

    if (orig === undefined) textOrig.set(node, base);
    applying = true;
    node.nodeValue = next;
    applying = false;
  }

  var ATTRS = ['placeholder', 'title', 'aria-label', 'alt'];

  function applyElement(el) {
    ATTRS.forEach(function (a) {
      if (!el.hasAttribute || !el.hasAttribute(a)) return;
      var map = attrOrig.get(el) || {};
      var base = map[a] !== undefined ? map[a] : el.getAttribute(a);
      if (!base || !base.trim()) return;
      var next = translateAll(base);
      if (next === base) return;
      map[a] = base;
      attrOrig.set(el, map);
      applying = true;
      el.setAttribute(a, next);
      applying = false;
    });

    // 长提示语：整段匹配后追加中文
    if (el.children.length === 0) {
      var txt = el.textContent;
      if (txt && txt.length > 40 && !CJK.test(txt)) {
        var t = txt.replace(/\s+/g, ' ').trim();
        for (var i = 0; i < HINTS.length; i++) {
          if (t === HINTS[i][0].replace(/\s+/g, ' ').trim()) {
            applying = true;
            el.textContent = txt.trim() + '  ' + HINTS[i][1];
            applying = false;
            break;
          }
        }
      }
    }
  }

  function apply(root) {
    root = root || document.body;
    var tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = tw.nextNode())) applyNode(n);
    var els = root.querySelectorAll ? root.querySelectorAll('*') : [];
    for (var i = 0; i < els.length; i++) applyElement(els[i]);
  }

  function restore(root) {
    root = root || document.body;
    var tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = tw.nextNode())) {
      var o = textOrig.get(n);
      if (o !== undefined) { applying = true; n.nodeValue = o; applying = false; textOrig.delete(n); }
    }
    var els = root.querySelectorAll ? root.querySelectorAll('*') : [];
    for (var i = 0; i < els.length; i++) {
      var map = attrOrig.get(els[i]);
      if (!map) continue;
      applying = true;
      Object.keys(map).forEach(function (a) { els[i].setAttribute(a, map[a]); });
      applying = false;
      attrOrig.delete(els[i]);
    }
  }

  /* ---------- 开关 ---------- */
  var enabled = true;
  try { enabled = localStorage.getItem(STORE_KEY) !== '0'; } catch (e) { /* ignore */ }

  function buildToggle() {
    var host = document.querySelector('.admin-nav-actions');
    if (!host || document.getElementById('btnZhToggle')) return;
    var btn = document.createElement('button');
    btn.className = 'btn-logout';
    btn.id = 'btnZhToggle';
    btn.type = 'button';
    btn.title = 'Toggle Chinese labels 切换中文标注';
    btn.style.marginRight = '.25rem';
    btn.innerHTML = '<span></span>';
    btn.addEventListener('click', function () {
      enabled = !enabled;
      try { localStorage.setItem(STORE_KEY, enabled ? '1' : '0'); } catch (e) { /* ignore */ }
      if (enabled) apply(document.body); else restore(document.body);
      syncToggleLabel();
    });
    host.insertBefore(btn, host.firstChild);
    syncToggleLabel();
  }

  function syncToggleLabel() {
    var btn = document.getElementById('btnZhToggle');
    if (!btn) return;
    var span = btn.querySelector('span');
    if (span) span.textContent = enabled ? '中文 开' : '中文 关';
  }

  /* ---------- 启动 ---------- */
  function start() {
    if (enabled) apply(document.body);
    buildToggle();
    if (typeof MutationObserver !== 'undefined') {
      var pending = false;
      new MutationObserver(function () {
        if (applying || pending) return;
        pending = true;
        requestAnimationFrame(function () {
          pending = false;
          if (enabled) apply(document.body);
        });
      }).observe(document.body, { childList: true, subtree: true, characterData: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  window.AdminI18N = { apply: apply, restore: restore, dict: DICT };
})();
