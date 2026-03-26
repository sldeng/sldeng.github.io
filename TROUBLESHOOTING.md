# 旅行画廊 - 故障排除指南

## 问题：Tab按钮无法点击

### 快速诊断

1. **打开测试页面**
   ```bash
   # 在项目目录运行HTTP服务器
   python -m http.server 8000

   # 然后访问
   http://localhost:8000/QUICK-TEST.html
   ```

2. **在浏览器控制台运行调试脚本**
   ```javascript
   // 复制debug-gallery.js的内容到控制台执行
   ```

### 常见问题和解决方案

#### 1. 使用file://协议访问
**症状**: 控制台显示CORS错误
**原因**: 浏览器安全限制，file://协议无法加载JSON文件
**解决**: 使用HTTP服务器
```bash
python -m http.server 8000
# 或
npx http-server
```

#### 2. CSS变量未定义
**症状**: Tab按钮颜色异常，无法点击
**原因**: travel-gallery.css在index.html的<style>之前加载
**解决**: 已修复，现在使用具体颜色值而非CSS变量

#### 3. z-index层级问题
**症状**: 按钮被其他元素覆盖
**解决**: 已修复，现在画廊使用z-index: 1000+

#### 4. pointer-events被禁用
**症状**: 鼠标悬停时显示默认指针而非手型
**解决**: 已修复，添加了pointer-events: auto

### 验证修复

1. **清除浏览器缓存** (Ctrl+Shift+R 或 Cmd+Shift+R)

2. **检查控制台** (F12)
   - 应该看到: "开始初始化旅行画廊..."
   - 应该看到: "成功加载 X 个旅行数据"
   - 应该看到: "画廊UI已创建"
   - 应该看到: "已渲染 X 个旅行标签"

3. **测试点击**
   - 在控制台运行:
   ```javascript
   document.querySelector('.travel-tab')?.click()
   ```
   - 应该看到: "切换到旅行 0: 北京行"

### 如果问题仍然存在

请提供以下信息：
1. 浏览器类型和版本
2. 控制台的错误消息
3. 运行调试脚本后的输出
4. 是否通过HTTP服务器访问

### 手动测试步骤

1. 确认文件存在:
   ```bash
   ls -la travel-gallery.*
   ls -la travel-data.json
   ```

2. 确认HTTP服务器运行:
   ```bash
   curl http://localhost:8000/travel-data.json
   ```

3. 检查元素可见性:
   - 打开浏览器开发者工具
   - 检查 #travel-gallery 元素
   - 查看 .travel-tab 按钮的computed样式

### 最新修复 (已应用)

✅ CSS: 添加 pointer-events: auto
✅ CSS: 提高 z-index 到 1000+
✅ CSS: 使用具体颜色值代替变量
✅ JS: 改进事件监听器，添加 preventDefault
✅ JS: 添加 touchstart 支持移动端
✅ JS: 添加详细的调试日志
