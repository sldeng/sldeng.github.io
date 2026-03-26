#!/usr/bin/env node

/**
 * 更新所有图片的日期信息
 * 使用方法: node update-dates.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * 获取图片的拍摄日期
 */
function getImageDate(filePath) {
    try {
        const output = execSync(`mdls "${filePath}"`, { encoding: 'utf8' });
        const exifDateMatch = output.match(/kMDItemContentCreationDate\s+=\s+(.+)/);

        if (exifDateMatch) {
            const dateStr = exifDateMatch[1].trim();
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
                return {
                    formatted: formatDate(date),
                    fullDate: formatDetailDate(date)
                };
            }
        }
        return null;
    } catch (error) {
        return null;
    }
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDetailDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}年${month}月${day}日 ${hours}:${minutes}`;
}

// 主逻辑
const config = JSON.parse(fs.readFileSync('travel-data.json', 'utf8'));
const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

console.log('📅 更新图片日期信息\n');

let updatedCount = 0;

config.travels.forEach(travel => {
    console.log(`📁 ${travel.name}`);

    travel.locations.forEach(location => {
        const locationPath = path.join('.', travel.path, location);
        const jsonPath = path.join(locationPath, 'images.json');

        try {
            // 读取现有配置
            const existingData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

            // 更新每张图片的日期信息
            existingData.images.forEach(img => {
                const imagePath = path.join(locationPath, img.file);
                const dateInfo = getImageDate(imagePath);

                if (dateInfo) {
                    img.date = dateInfo.formatted;
                    img.fullDate = dateInfo.fullDate;
                }
            });

            // 写回文件
            fs.writeFileSync(jsonPath, JSON.stringify(existingData, null, 2), 'utf8');
            console.log(`  ✅ ${location} - 已更新`);
            updatedCount++;

        } catch (e) {
            console.log(`  ⚠️  ${location} - ${e.message}`);
        }
    });
});

console.log(`\n✨ 完成！更新了 ${updatedCount} 个地点的日期信息`);
