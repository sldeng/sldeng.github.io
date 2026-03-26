# 旅行 · 拾光 | Travel Memories

一个优雅的旅行照片展示网站，支持通过Tab导航浏览不同旅行地点的照片。

## 功能特点

- ✨ Tab导航切换不同旅行（北京行、南京行等）
- 📍 子Tab切换具体地点（故宫、长城等）
- 🖼️ 网格布局展示图片
- 🔍 点击图片放大查看
- 📱 响应式设计，支持移动端
- 🔄 自动扫描更新旅行数据

## 项目结构

```
.
├── index.html                    # 主页面
├── game.js                       # 2048游戏
├── travel-gallery.js             # 图片画廊模块
├── travel-gallery.css            # 画廊样式
├── travel-data.json              # 旅行数据配置
├── update-travel-data.js         # 自动扫描脚本
├── CLAUDE.md                     # Claude配置
└── .claude/
    └── skills/
        └── check-travels.md      # 检查旅行文件夹skill
```

## 添加新旅行

### 1. 创建文件夹结构

在项目根目录创建以"行"结尾的文件夹：

```
项目根目录/
└── 上海行/          # 新的旅行文件夹
    ├── 外滩/        # 地点1
    │   ├── 1.jpg
    │   └── 2.jpg
    └── 豫园/        # 地点2
        ├── 1.jpg
        └── 2.jpg
```

### 2. 更新配置

运行自动扫描脚本：

```bash
node update-travel-data.js
```

或使用Claude Code skill：

```
/check-travels
```

### 3. 提交更改

```bash
git add .
git commit -m "Add new travel: 上海行"
git push
```

## 图片命名规范

脚本会自动检测以下格式的图片：

- 数字命名：`1.jpg`, `2.jpg`, `3.png`...
- 相机命名：`IMG_0001.jpg`, `IMG_0002.jpg`...
- 支持格式：`.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`

## 本地开发

### 启动本地服务器

由于浏览器的CORS限制，需要通过HTTP服务器访问：

```bash
# Python 3
python -m http.server 8000

# Node.js (需要安装 http-server)
npx http-server

# PHP
php -S localhost:8000
```

然后访问 `http://localhost:8000`

### 部署到GitHub Pages

1. 推送到GitHub仓库
2. 在仓库设置中启用GitHub Pages
3. 选择主分支作为源

## 自定义配置

### 修改颜色主题

在 `index.html` 和 `travel-gallery.css` 中修改CSS变量：

```css
:root {
    --primary: #d4a574;    /* 主色调 */
    --secondary: #8b7355;  /* 次要色调 */
    --dark: #1a1814;       /* 深色背景 */
    --light: #f5f0e8;      /* 浅色文字 */
}
```

### 添加更多旅行

编辑 `.claude/skills/check-travels.md` 中的规则，或直接编辑 `travel-data.json`。

## 技术栈

- 纯HTML/CSS/JavaScript
- 无外部框架依赖
- 支持现代浏览器
- 移动端友好

## License

MIT
