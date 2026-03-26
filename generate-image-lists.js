#!/usr/bin/env node

/**
 * 自动生成每个地点的images.json文件
 * 使用方法: node generate-image-lists.js
 */

const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
    baseDir: __dirname,
    imageExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    ignoredFiles: ['.DS_Store', 'images.json']
};

/**
 * 获取文件夹内的所有图片文件
 */
function getImagesInDir(dirPath) {
    try {
        const items = fs.readdirSync(dirPath);
        const images = [];

        for (const item of items) {
            if (CONFIG.ignoredFiles.includes(item)) continue;

            const fullPath = path.join(dirPath, item);
            const ext = path.extname(item).toLowerCase();

            // 只处理图片文件
            if (CONFIG.imageExtensions.includes(ext) && fs.statSync(fullPath).isFile()) {
                images.push(item);
            }
        }

        // 按文件名排序
        return images.sort((a, b) => {
            // 尝试数字排序
            const numA = parseInt(a.match(/\d+/g)?.join('') || '999999');
            const numB = parseInt(b.match(/\d+/g)?.join('') || '999999');
            if (numA !== numB) {
                return numA - numB;
            }
            return a.localeCompare(b);
        });
    } catch (error) {
        console.error(`读取文件夹失败: ${dirPath}`, error.message);
        return [];
    }
}

/**
 * 为地点生成images.json
 */
function generateImagesJson(locationPath, locationName) {
    const images = getImagesInDir(locationPath);

    if (images.length === 0) {
        console.log(`  ⚠️  ${locationName} - 没有图片`);
        return false;
    }

    const jsonContent = JSON.stringify({ images }, null, 2);
    const jsonPath = path.join(locationPath, 'images.json');

    try {
        fs.writeFileSync(jsonPath, jsonContent, 'utf8');
        console.log(`  ✅ ${locationName} - ${images.length} 张图片`);
        return true;
    } catch (error) {
        console.error(`  ❌ ${locationName} - 写入失败:`, error.message);
        return false;
    }
}

/**
 * 扫描所有旅行地点
 */
function scanAllLocations() {
    console.log('🔍 扫描旅行文件夹...\n');

    // 读取主配置
    const configPath = path.join(CONFIG.baseDir, 'travel-data.json');
    let travels = [];

    try {
        const configContent = fs.readFileSync(configPath, 'utf8');
        const config = JSON.parse(configContent);
        travels = config.travels;
    } catch (error) {
        console.error('读取travel-data.json失败:', error.message);
        return;
    }

    let totalLocations = 0;
    let totalImages = 0;

    // 遍历每个旅行
    travels.forEach(travel => {
        console.log(`📁 ${travel.name}`);

        if (travel.locations.length === 0) {
            console.log('  (无地点)\n');
            return;
        }

        // 遍历每个地点
        travel.locations.forEach(location => {
            const locationPath = path.join(CONFIG.baseDir, travel.path, location);
            const images = getImagesInDir(locationPath);

            if (images.length > 0) {
                generateImagesJson(locationPath, location);
                totalLocations++;
                totalImages += images.length;
            } else {
                console.log(`  ⚠️  ${location} - 没有图片`);
            }
        });

        console.log('');
    });

    console.log(`\n✨ 完成！`);
    console.log(`📊 统计: ${totalLocations} 个地点, ${totalImages} 张图片`);
}

/**
 * 主函数
 */
function main() {
    console.log('🖼️  生成图片清单工具\n');
    console.log('=================================\n');

    scanAllLocations();

    console.log('\n💡 提示: 运行 update-travel-data.js 更新主配置文件');
}

// 运行脚本
if (require.main === module) {
    main();
}

module.exports = { getImagesInDir, generateImagesJson };
