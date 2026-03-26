/**
 * 旅行画廊调试工具
 * 在浏览器控制台运行此脚本来诊断问题
 */

(function() {
    console.log('=== 旅行画廊调试工具 ===\n');

    // 1. 检查CSS是否加载
    const styles = Array.from(document.styleSheets);
    const galleryStyles = styles.filter(s => s.href && s.href.includes('travel-gallery.css'));

    console.log('📋 CSS加载状态:');
    if (galleryStyles.length > 0) {
        console.log('✅ travel-gallery.css 已加载');
        console.log('   URL:', galleryStyles[0].href);
    } else {
        console.log('❌ travel-gallery.css 未加载！');
    }

    // 2. 检查JavaScript是否加载
    console.log('\n📋 JavaScript加载状态:');
    if (window.TravelGallery) {
        console.log('✅ TravelGallery 类已定义');
    } else if (window.travelGallery) {
        console.log('✅ travelGallery 实例已创建');
    } else {
        console.log('❌ travel-gallery.js 未正确加载！');
    }

    // 3. 检查DOM元素
    console.log('\n📋 DOM元素检查:');
    const gallerySection = document.getElementById('travel-gallery');
    if (gallerySection) {
        console.log('✅ 画廊容器已创建');
        console.log('   位置:', gallerySection.getBoundingClientRect());
        console.log('   z-index:', getComputedStyle(gallerySection).zIndex);
        console.log('   pointer-events:', getComputedStyle(gallerySection).pointerEvents);

        // 检查按钮
        const tabs = gallerySection.querySelectorAll('.travel-tab');
        console.log(`\n   找到 ${tabs.length} 个旅行tab:`);

        tabs.forEach((tab, i) => {
            const styles = window.getComputedStyle(tab);
            console.log(`   [${i}] ${tab.textContent}`);
            console.log(`      - pointer-events: ${styles.pointerEvents}`);
            console.log(`      - cursor: ${styles.cursor}`);
            console.log(`      - z-index: ${styles.zIndex}`);
            console.log(`      - display: ${styles.display}`);
            console.log(`      - 可见性: ${styles.visibility}`);
            console.log(`      - 位置:`, tab.getBoundingClientRect());

            // 检查是否有事件监听器
            const hasListener = tab.onclick !== null;
            console.log(`      - 有点击监听器: ${hasListener ? '✅' : '❌'}`);
        });

        const locationTabs = gallerySection.querySelectorAll('.location-tab');
        console.log(`\n   找到 ${locationTabs.length} 个地点tab:`);

        locationTabs.forEach((tab, i) => {
            const styles = window.getComputedStyle(tab);
            console.log(`   [${i}] ${tab.textContent}`);
            console.log(`      - pointer-events: ${styles.pointerEvents}`);
            console.log(`      - cursor: ${styles.cursor}`);
        });

    } else {
        console.log('❌ 画廊容器未创建！');
    }

    // 4. 检查覆盖层
    console.log('\n📋 覆盖层检查:');
    const overlays = [
        { name: 'grain-overlay', selector: '.grain-overlay' },
        { name: 'bg-gradient', selector: '.bg-gradient' },
        { name: 'particles', selector: '.particles' }
    ];

    overlays.forEach(overlay => {
        const el = document.querySelector(overlay.selector);
        if (el) {
            const styles = window.getComputedStyle(el);
            console.log(`${overlay.name}:`);
            console.log(`   - z-index: ${styles.zIndex}`);
            console.log(`   - pointer-events: ${styles.pointerEvents}`);
            console.log(`   - 位置:`, el.getBoundingClientRect());

            if (styles.pointerEvents !== 'none') {
                console.log(`   ⚠️  可能阻挡点击！`);
            }
        }
    });

    // 5. 测试点击
    console.log('\n📋 测试点击:');
    if (gallerySection) {
        const firstTab = gallerySection.querySelector('.travel-tab');
        if (firstTab) {
            console.log('尝试模拟点击第一个tab...');
            try {
                firstTab.click();
                console.log('✅ 点击成功！');
            } catch (e) {
                console.log('❌ 点击失败:', e.message);
            }
        }
    }

    // 6. 检查travel-data.json
    console.log('\n📋 数据加载检查:');
    fetch('travel-data.json')
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        })
        .then(data => {
            console.log('✅ travel-data.json 加载成功');
            console.log(`   包含 ${data.travels.length} 个旅行:`);
            data.travels.forEach((t, i) => {
                console.log(`   [${i}] ${t.name} (${t.locations.length} 个地点)`);
            });
        })
        .catch(error => {
            console.log('❌ travel-data.json 加载失败:', error.message);
            console.log('   可能原因: 需要通过HTTP服务器访问，不能使用file://协议');
        });

    // 7. 建议修复
    console.log('\n💡 诊断建议:');
    const issues = [];
    const fixes = [];

    if (gallerySection) {
        const sectionStyles = getComputedStyle(gallerySection);
        if (sectionStyles.zIndex === 'auto' || parseInt(sectionStyles.zIndex) < 1000) {
            issues.push('画廊z-index太低');
            fixes.push('在CSS中设置 .travel-gallery-section { z-index: 1000; }');
        }

        const tabs = gallerySection.querySelectorAll('.travel-tab');
        tabs.forEach(tab => {
            const styles = getComputedStyle(tab);
            if (styles.pointerEvents === 'none') {
                issues.push('Tab按钮pointer-events为none');
                fixes.push('在CSS中设置 .travel-tab { pointer-events: auto !important; }');
            }
        });
    } else {
        issues.push('画廊容器未创建');
        fixes.push('检查JavaScript是否正确加载和执行');
    }

    if (issues.length > 0) {
        console.log('❌ 发现问题:');
        issues.forEach((issue, i) => {
            console.log(`   ${i + 1}. ${issue}`);
            console.log(`      修复: ${fixes[i]}`);
        });
    } else {
        console.log('✅ 未发现明显问题');
    }

    console.log('\n=== 调试完成 ===\n');

    // 返回调试工具
    return {
        testClick: function() {
            const tab = document.querySelector('.travel-tab');
            if (tab) {
                tab.click();
                console.log('已点击第一个旅行tab');
            } else {
                console.log('找不到旅行tab');
            }
        },
        reloadGallery: function() {
            if (window.travelGallery) {
                console.log('重新加载画廊...');
                document.getElementById('travel-gallery')?.remove();
                window.travelGallery = new TravelGallery();
            } else {
                console.log('travelGallery实例不存在');
            }
        }
    };
})();
