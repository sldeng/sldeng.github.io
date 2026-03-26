#!/usr/bin/env node

/**
 * 自动扫描旅行文件夹并更新travel-data.json
 * 使用方法: node update-travel-data.js
 */

const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
    baseDir: __dirname,
    outputFile: path.join(__dirname, 'travel-data.json'),
    ignoredFiles: ['.DS_Store', 'node_modules', '.git'],
    imageExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
};

/**
 * 检查是否是文件夹
 */
function isDirectory(filePath) {
    try {
        return fs.statSync(filePath).isDirectory();
    } catch {
        return false;
    }
}

/**
 * 获取文件夹内的子文件夹（地点）
 */
function getSubFolders(dirPath) {
    try {
        const items = fs.readdirSync(dirPath);
        const subFolders = [];

        for (const item of items) {
            if (CONFIG.ignoredFiles.includes(item)) continue;

            const fullPath = path.join(dirPath, item);
            if (isDirectory(fullPath)) {
                // 检查文件夹内是否有图片
                if (hasImages(fullPath)) {
                    subFolders.push(item);
                }
            }
        }

        return subFolders.sort();
    } catch (error) {
        console.error(`读取文件夹失败: ${dirPath}`, error.message);
        return [];
    }
}

/**
 * 检查文件夹内是否有图片
 */
function hasImages(dirPath) {
    try {
        const items = fs.readdirSync(dirPath);
        return items.some(item => {
            const ext = path.extname(item).toLowerCase();
            return CONFIG.imageExtensions.includes(ext);
        });
    } catch {
        return false;
    }
}

/**
 * 扫描所有旅行文件夹
 */
function scanTravelFolders() {
    const travels = [];

    try {
        const items = fs.readdirSync(CONFIG.baseDir);

        for (const item of items) {
            // 跳过非文件夹和被忽略的文件
            const fullPath = path.join(CONFIG.baseDir, item);
            if (!isDirectory(fullPath) || CONFIG.ignoredFiles.includes(item)) {
                continue;
            }

            // 检查是否是旅行文件夹（以"行"结尾）
            if (item.endsWith('行')) {
                const locations = getSubFolders(fullPath);
                travels.push({
                    name: item,
                    path: item,
                    locations: locations
                });
            }
        }

        // 按名称排序
        travels.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));

        return travels;
    } catch (error) {
        console.error('扫描文件夹失败:', error.message);
        return [];
    }
}

/**
 * 更新travel-data.json文件
 */
function updateTravelData(travels) {
    const data = { travels };
    const jsonContent = JSON.stringify(data, null, 2);

    try {
        fs.writeFileSync(CONFIG.outputFile, jsonContent, 'utf8');
        console.log(`✅ 成功更新 ${CONFIG.outputFile}`);
        console.log(`📁 发现 ${travels.length} 个旅行文件夹:`);
        travels.forEach(travel => {
            console.log(`   - ${travel.name} (${travel.locations.length} 个地点)`);
            travel.locations.forEach(loc => {
                console.log(`     · ${loc}`);
            });
        });
    } catch (error) {
        console.error('写入文件失败:', error.message);
        process.exit(1);
    }
}

/**
 * 主函数
 */
function main() {
    console.log('🔍 开始扫描旅行文件夹...\n');

    const travels = scanTravelFolders();

    if (travels.length === 0) {
        console.warn('⚠️  未找到任何旅行文件夹');
        console.log('💡 提示: 文件夹名称需要以"行"结尾（如：北京行、南京行）');
        return;
    }

    updateTravelData(travels);

    // 自动生成图片清单
    console.log('\n🖼️  开始生成图片清单...\n');
    require('./generate-image-lists.js');

    console.log('\n✨ 完成！');
    console.log('💡 提示: 刷新浏览器页面查看效果');
}

// 运行脚本
if (require.main === module) {
    main();
}

module.exports = { scanTravelFolders, getSubFolders, hasImages };
