#!/usr/bin/env node

/**
 * 从图片文件提取拍摄日期
 * 使用macOS的mdls命令读取EXIF数据
 */

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

/**
 * 获取图片的拍摄日期
 */
function getImageDate(filePath) {
    try {
        // 使用mdls读取图片元数据
        const output = execSync(`mdls "${filePath}"`, { encoding: 'utf8' });

        // 尝试获取EXIF日期
        const exifDateMatch = output.match(/kMDItemContentCreationDate\s+=\s+(.+)/);
        const gpsDateMatch = output.match(/kMDItemGPSDateStamp\s+=\s+"(\d{4}:\d{2}:\d{2})"/);

        if (exifDateMatch) {
            const dateStr = exifDateMatch[1].trim();
            // 解析日期 "2022-08-06 02:37:36 +0000"
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
                return {
                    raw: dateStr,
                    formatted: formatDate(date),
                    year: date.getFullYear(),
                    month: date.getMonth() + 1,
                    day: date.getDate()
                };
            }
        }

        // 尝试GPS日期
        if (gpsDateMatch) {
            const dateStr = gpsDateMatch[1].replace(/:/g, '-');
            return {
                raw: dateStr,
                formatted: dateStr,
                source: 'GPS'
            };
        }

        // 使用文件修改日期作为后备
        const stats = fs.statSync(filePath);
        const mtime = stats.mtime;
        return {
            raw: mtime.toISOString(),
            formatted: formatDate(mtime),
            source: 'file'
        };

    } catch (error) {
        console.error(`无法读取 ${filePath} 的日期:`, error.message);
        return null;
    }
}

/**
 * 格式化日期
 */
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * 格式化详细日期
 */
function formatDetailDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}年${month}月${day}日 ${hours}:${minutes}`;
}

// 导出函数
module.exports = {
    getImageDate,
    formatDate,
    formatDetailDate
};

// 如果直接运行此脚本
if (require.main === module) {
    const filePath = process.argv[2];
    if (!filePath) {
        console.log('用法: node extract-date.js <图片路径>');
        process.exit(1);
    }

    const dateInfo = getImageDate(filePath);
    console.log(JSON.stringify(dateInfo, null, 2));
}
