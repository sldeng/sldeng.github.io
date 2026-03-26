/**
 * Travel Gallery Module
 * 自动检测和展示旅行照片的画廊模块
 */

class TravelGallery {
    constructor() {
        this.currentTravel = 0;
        this.currentLocation = 0;
        this.travels = [];
        this.init();
    }

    async init() {
        console.log('=== 开始初始化旅行画廊 ===');

        try {
            // 加载旅行数据
            console.log('正在加载 travel-data.json...');
            const response = await fetch('travel-data.json');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.travels = data.travels;
            console.log(`✓ 成功加载 ${this.travels.length} 个旅行数据:`, this.travels);

            // 创建画廊UI
            this.createGalleryUI();

            // 加载第一个旅行的图片
            await this.loadTravel(0);

            console.log('=== 画廊初始化完成 ===');

        } catch (error) {
            console.error('✗ 加载旅行数据失败:', error);
            // 创建一个简单的错误提示UI
            this.showErrorUI(`无法加载旅行数据: ${error.message}<br><br>请确保：<br>1. 通过HTTP服务器访问（不能使用file://）<br>2. travel-data.json文件存在`);
        }
    }

    showErrorUI(message) {
        const section = document.createElement('section');
        section.className = 'travel-gallery-section';
        section.innerHTML = `
            <div class="gallery-container">
                <div class="error-message" style="text-align: center; padding: 40px; color: #ff6b6b;">
                    <h3>⚠️ 加载失败</h3>
                    <p>${message}</p>
                </div>
            </div>
        `;
        document.body.appendChild(section);
    }

    createGalleryUI() {
        // 检查是否已存在画廊容器
        if (document.getElementById('travel-gallery')) {
            console.log('画廊容器已存在，跳过创建');
            return;
        }

        console.log('开始创建画廊UI...');

        // 创建画廊容器
        const section = document.createElement('section');
        section.id = 'travel-gallery';
        section.className = 'travel-gallery-section';

        section.innerHTML = `
            <div class="gallery-container">
                <!-- Tab导航 -->
                <nav class="travel-tabs" id="travel-tabs">
                    <div class="tabs-scroll" id="travel-tabs-scroll">
                        <!-- 动态生成的tab按钮 -->
                    </div>
                </nav>

                <!-- 地点子标签 -->
                <nav class="location-tabs" id="location-tabs">
                    <div class="location-tabs-scroll" id="location-tabs-scroll">
                        <!-- 动态生成的地点按钮 -->
                    </div>
                </nav>

                <!-- 图片展示区 -->
                <div class="gallery-content">
                    <div class="image-grid" id="image-grid">
                        <!-- 动态生成的图片 -->
                    </div>
                </div>

                <!-- 加载状态 -->
                <div class="loading-state" id="loading-state" style="display: none;">
                    <div class="spinner"></div>
                    <p>加载中...</p>
                </div>
            </div>
        `;

        // 插入到页面中（在body的末尾）
        document.body.appendChild(section);

        console.log('✓ 画廊UI已创建并添加到页面');

        // 生成旅行标签
        this.renderTravelTabs();
    }

    renderTravelTabs() {
        const tabsContainer = document.getElementById('travel-tabs-scroll');
        if (!tabsContainer) {
            console.error('✗ 找不到tabs容器 (travel-tabs-scroll)');
            return;
        }
        tabsContainer.innerHTML = '';

        console.log(`开始渲染 ${this.travels.length} 个旅行标签...`);

        this.travels.forEach((travel, index) => {
            const tab = document.createElement('button');
            tab.className = `travel-tab ${index === this.currentTravel ? 'active' : ''}`;
            tab.textContent = travel.name;
            tab.setAttribute('data-index', index);
            tab.setAttribute('type', 'button');

            // 确保样式正确
            tab.style.cssText = 'pointer-events: auto; cursor: pointer; position: relative;';

            // 使用箭头函数确保this正确
            const handleClick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(`🖱️ 点击旅行Tab ${index}: ${travel.name}`);
                this.loadTravel(index);
            };

            tab.addEventListener('click', handleClick, { passive: false });
            tab.addEventListener('touchstart', handleClick, { passive: false });

            tabsContainer.appendChild(tab);
            console.log(`  ✓ 创建tab: ${travel.name}`);
        });

        console.log(`✓ 已渲染 ${this.travels.length} 个旅行标签`);
    }

    renderLocationTabs() {
        const tabsContainer = document.getElementById('location-tabs-scroll');
        if (!tabsContainer) {
            console.error('✗ 找不到地点tabs容器 (location-tabs-scroll)');
            return;
        }
        tabsContainer.innerHTML = '';

        const currentTravelData = this.travels[this.currentTravel];

        if (!currentTravelData.locations || currentTravelData.locations.length === 0) {
            tabsContainer.innerHTML = '<p class="no-locations">暂无地点分类</p>';
            return;
        }

        console.log(`开始渲染 ${currentTravelData.locations.length} 个地点标签...`);

        currentTravelData.locations.forEach((location, index) => {
            const tab = document.createElement('button');
            tab.className = `location-tab ${index === this.currentLocation ? 'active' : ''}`;
            tab.textContent = location;
            tab.setAttribute('data-location', index);
            tab.setAttribute('type', 'button');

            // 确保样式正确
            tab.style.cssText = 'pointer-events: auto; cursor: pointer; position: relative;';

            const handleClick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(`🖱️ 点击地点Tab ${index}: ${location}`);
                this.loadLocation(index);
            };

            tab.addEventListener('click', handleClick, { passive: false });
            tab.addEventListener('touchstart', handleClick, { passive: false });

            tabsContainer.appendChild(tab);
        });

        console.log(`✓ 已渲染 ${currentTravelData.locations.length} 个地点标签`);
    }

    async loadTravel(index) {
        console.log(`切换到旅行 ${index}: ${this.travels[index].name}`);

        this.currentTravel = index;
        this.currentLocation = 0;

        // 更新tab样式
        const travelTabs = document.querySelectorAll('.travel-tab');
        travelTabs.forEach((tab, i) => {
            if (i === index) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // 更新地点标签
        this.renderLocationTabs();

        // 加载第一个地点的图片
        if (this.travels[index].locations.length > 0) {
            await this.loadImages(0);
        } else {
            this.showNoImages();
        }
    }

    async loadLocation(index) {
        const currentTravelData = this.travels[this.currentTravel];
        const locationName = currentTravelData.locations[index];
        console.log(`切换到地点 ${index}: ${locationName}`);

        this.currentLocation = index;

        // 更新tab样式
        const locationTabs = document.querySelectorAll('.location-tab');
        locationTabs.forEach((tab, i) => {
            if (i === index) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // 加载图片
        await this.loadImages(index);
    }

    async loadImages(locationIndex) {
        const grid = document.getElementById('image-grid');
        const loading = document.getElementById('loading-state');
        const travel = this.travels[this.currentTravel];
        const location = travel.locations[locationIndex];

        // 显示加载状态
        grid.innerHTML = '';
        loading.style.display = 'flex';

        try {
            // 获取该地点的图片清单
            const images = await this.getImageList(travel.path, location);

            // 隐藏加载状态
            loading.style.display = 'none';

            if (images.length === 0) {
                this.showNoImages();
                return;
            }

            // 渲染图片网格
            images.forEach((imageUrl, idx) => {
                const imgCard = this.createImageCard(imageUrl, idx);
                grid.appendChild(imgCard);
            });

            console.log(`已加载 ${images.length} 张图片`);

        } catch (error) {
            console.error('加载图片失败:', error);
            loading.style.display = 'none';
            this.showError('图片加载失败: ' + error.message);
        }
    }

    /**
     * 获取地点的图片列表
     * 从images.json配置文件读取
     */
    async getImageList(travelPath, location) {
        const imagePath = `${travelPath}/${location}/`;

        try {
            // 加载该地点的images.json配置
            const response = await fetch(`${imagePath}images.json`);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            const images = data.images || [];

            // 返回完整的图片URL
            return images.map(img => `${imagePath}${img}`);

        } catch (error) {
            console.error(`加载 ${location} 的图片清单失败:`, error);
            return [];
        }
    }

    createImageCard(imageUrl, index) {
        const card = document.createElement('div');
        card.className = 'image-card';
        card.style.animationDelay = `${index * 0.05}s`;

        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = `旅行照片 ${index + 1}`;
        img.loading = 'lazy';

        // 点击放大
        card.addEventListener('click', () => this.openLightbox(imageUrl));

        card.appendChild(img);
        return card;
    }

    openLightbox(imageUrl) {
        // 创建lightbox
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <img src="${imageUrl}" alt="放大查看">
            </div>
        `;

        document.body.appendChild(lightbox);

        // 关闭事件
        lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
            lightbox.classList.add('closing');
            setTimeout(() => lightbox.remove(), 300);
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.add('closing');
                setTimeout(() => lightbox.remove(), 300);
            }
        });

        requestAnimationFrame(() => {
            lightbox.classList.add('active');
        });
    }

    checkImageExists(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve({ exists: true, url });
            img.onerror = () => resolve({ exists: false, url: null });
            img.src = url;
        });
    }

    showNoImages() {
        const grid = document.getElementById('image-grid');
        grid.innerHTML = '<p class="no-images">暂无图片</p>';
    }

    showError(message) {
        const grid = document.getElementById('image-grid');
        grid.innerHTML = `<p class="error-message">${message}</p>`;
    }
}

// 初始化画廊
function initGallery() {
    console.log('初始化旅行画廊...');
    window.travelGallery = new TravelGallery();
}

// DOM加载完成后初始化，如果已经加载完成则立即初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGallery);
} else {
    initGallery();
}

// 导出用于外部调用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TravelGallery;
}
