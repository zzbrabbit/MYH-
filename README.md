# MYHBeauty 网站源码（可上传版）

打包时间：2026-09-16 15:34

## 目录内容

根目录页面：`404.html`、`about.html`、`admin.html`、`blog.html`、`contact.html`、`deploy-guide.html`、`index.html`、`login.html`、`products.html`、`treatments.html`

其余文件：

- `data.js`（223 字节）
- `favicon.svg`（501 字节）
- `robots.txt`（144 字节）
- `sitemap.xml`（926 字节）

资源目录：

- `css/`: admin.css、style.css
- `js/`: admin.js、github-sync.js、main.js、store.js

## 上传方式

### Cloudflare Pages（推荐）

1. Workers & Pages → Create → Pages → Upload assets
2. 直接把这个文件夹拖进去（或上传 zip）
3. 部署完成后到 Custom domains 绑定你的域名

### 任何静态主机（Netlify / Vercel / 虚拟主机 / OSS）

把文件夹内的全部内容传到站点根目录即可，无需构建、无需 Node 环境。

## 上传后要做的事

1. 打开 `admin.html` 登录（账号 `MYH`），逐项改成你的真实内容并上传图片
2. 点 **Publish to Website**，浏览器会下载一个新的 `data.js`
3. 用下载到的 `data.js` 覆盖根目录同名文件，重新部署 → 全站内容生效
   （也可以用后台的 **Sync to GitHub** 直接推送，需要 GitHub Token）

## 说明

- `data.js` 目前是占位文件（内容为 `null`），所以新站点首次打开显示的是内置示例数据；
  替换成后台导出的 `data.js` 后才会显示你自己管理的内容和图片。
- `deploy-guide.html` 是给使用者的部署说明页，已随包带上；如不想对外公开可删除。
- 源码里已剔除调试残留（`.bak`、`__audit_*`、`__e2e_*`）与本地预览用的 `server.js`。
