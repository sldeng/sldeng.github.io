# 图片日期功能说明

## 功能概述

旅行画廊现在支持显示每张照片的拍摄日期。日期信息从图片的EXIF数据中自动提取。

## 文件结构

```
项目根目录/
├── extract-date.js        # 日期提取工具
├── update-dates.js        # 快速更新日期脚本
├── generate-image-lists.js # 完整重新生成
└── 北京行/故宫/
    └── images.json        # 包含日期信息
```

## images.json 格式

```json
{
  "images": [
    {
      "file": "IMG_5040.jpg",
      "date": "2022-08-06",
      "fullDate": "2022年08月06日 10:37"
    }
  ]
}
```

## 使用方法

### 首次添加日期

运行完整脚本重新生成所有images.json：

```bash
node update-travel-data.js
```

### 更新现有日期

如果添加了新照片，快速更新日期信息：

```bash
node update-dates.js
```

### 单独查看图片日期

```bash
node extract-date.js "北京行/故宫/IMG_5040.jpg"
```

## 日期显示

- **默认状态**：日期标签隐藏
- **鼠标悬停**：在图片底部显示完整的拍摄日期
- **格式**：`2022年08月06日 10:37`

## 工作原理

1. 使用macOS的`mdls`命令读取图片EXIF数据
2. 提取`kMDItemContentCreationDate`字段
3. 如果没有EXIF数据，使用文件修改日期
4. 保存到images.json中供前端显示

## 支持的图片格式

- `.jpg` / `.jpeg`
- `.png`
- `.gif`
- `.webp`

## 注意事项

- 日期提取功能需要macOS系统
- 图片必须包含EXIF信息才有准确日期
- 如果EXIF信息缺失，会显示文件修改日期

## 自定义日期格式

编辑`extract-date.js`中的`formatDetailDate`函数：

```javascript
function formatDetailDate(date) {
    // 修改这里的格式
    return `${year}年${month}月${day}日 ${hours}:${minutes}`;
}
```

## 故障排除

### 日期显示错误

如果日期不正确，检查：
1. 图片是否包含EXIF信息
2. 文件是否被编辑过（可能丢失EXIF）

### 重新生成所有数据

```bash
# 删除所有旧的images.json
find */* -name "images.json" -delete

# 重新生成
node update-travel-data.js
```

## 兼容性

- **旧版images.json**（只有文件名）仍然兼容
- 新旧格式可以共存
- 缺少日期的图片不会报错
