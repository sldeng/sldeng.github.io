/**
 * 图片碎片效果 - 最优性能版本
 * 使用 CSS 网格分割 + GPU 加速
 */
class ParticleImage {
    constructor(card) {
        this.card = card;
        this.img = card.querySelector('img');
        if (!this.img) return;

        this.gridSize = 8; // 8x8 = 64 个碎片，性能最优
        this.fragments = [];
        this.isExploding = false;

        this.init();
    }

    init() {
        // 设置 CORS
        if (!this.img.crossOrigin) {
            this.img.crossOrigin = 'anonymous';
        }

        // 创建碎片容器 - 添加3D透视
        this.container = document.createElement('div');
        this.container.className = 'particle-container';
        this.container.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 100;
            perspective: 800px;
            perspective-origin: center center;
            transform-style: preserve-3d;
        `;

        // 插入到 img 之前
        if (this.img.parentNode) {
            this.img.parentNode.insertBefore(this.container, this.img);
        }

        // 等待图片加载
        if (this.img.complete) {
            this.createFragments();
        } else {
            this.img.addEventListener('load', () => this.createFragments(), { once: true });
        }

        // 监听鼠标事件
        this.card.addEventListener('mouseenter', () => this.explode());
        this.card.addEventListener('mouseleave', () => this.assemble());

        // 点击事件
        this.container.addEventListener('click', () => this.card.click());
        this.container.style.pointerEvents = 'auto';

        // 鼠标移动时的3D跟随效果
        this.card.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }

    handleMouseMove(e) {
        if (!this.isExploding || this.fragments.length === 0) return;

        const rect = this.container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        this.container.style.perspectiveOrigin = `${50 + x * 30}% ${50 + y * 30}%`;
    }

    createFragments() {
        // 确保图片尺寸可用
        if (!this.img.naturalWidth || !this.img.naturalHeight) {
            setTimeout(() => this.createFragments(), 100);
            return;
        }

        const wrapper = this.img.closest('.img-wrapper, .photo-card-inner') || this.card;
        const rect = wrapper.getBoundingClientRect();

        if (rect.width < 10 || rect.height < 10) {
            setTimeout(() => this.createFragments(), 100);
            return;
        }

        const width = rect.width;
        const height = rect.height;
        const fragmentW = width / this.gridSize;
        const fragmentH = height / this.gridSize;

        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const fragment = document.createElement('div');
                fragment.className = 'particle-fragment';

                const x = col * fragmentW;
                const y = row * fragmentH;

                fragment.style.cssText = `
                    position: absolute;
                    width: ${fragmentW + 1}px;
                    height: ${fragmentH + 1}px;
                    left: ${x}px;
                    top: ${y}px;
                    background-image: url(${this.img.src});
                    background-size: ${width}px ${height}px;
                    background-position: -${x}px -${y}px;
                    transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                                opacity 0.5s ease;
                    will-change: transform, opacity;
                `;

                fragment.dataset.row = row;
                fragment.dataset.col = col;

                this.container.appendChild(fragment);
                this.fragments.push(fragment);
            }
        }

        // 隐藏原图
        this.img.style.opacity = '0';
    }

    explode() {
        if (this.isExploding || this.fragments.length === 0) return;
        this.isExploding = true;

        const centerX = this.gridSize / 2;
        const centerY = this.gridSize / 2;

        // 创建爆炸闪光效果
        this.createFlashEffect();

        this.fragments.forEach((fragment, index) => {
            const row = parseFloat(fragment.dataset.row);
            const col = parseFloat(fragment.dataset.col);

            // 计算从中心向外的方向
            const dirX = (col - centerX) / centerX;
            const dirY = (row - centerY) / centerY;
            const distFromCenter = Math.sqrt(dirX * dirX + dirY * dirY);

            // 超强爆炸参数
            const explodeForce = 150 + Math.random() * 200; // 更大的爆炸力
            const distanceX = dirX * explodeForce * (1 + distFromCenter);
            const distanceY = dirY * explodeForce * (1 + distFromCenter);
            const distanceZ = (Math.random() - 0.3) * 400; // 更强的Z轴
            const rotateX = (Math.random() - 0.5) * 720; // 更快的旋转
            const rotateY = (Math.random() - 0.5) * 720;
            const rotateZ = (Math.random() - 0.5) * 540;
            const scale = 0.2 + Math.random() * 0.6;

            // 延迟爆炸，产生冲击波效果
            const delay = distFromCenter * 150;

            setTimeout(() => {
                fragment.style.transition = 'all 0.8s cubic-bezier(0.1, 0.8, 0.2, 1)';
                fragment.style.transform = `
                    translate3d(${distanceX}px, ${distanceY}px, ${distanceZ}px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    rotateZ(${rotateZ}deg)
                    scale(${scale})
                `;

                // 彩虹发光效果
                const hue = (index / this.fragments.length) * 360;
                fragment.style.opacity = '0.9';
                fragment.style.filter = `
                    brightness(1.8)
                    drop-shadow(0 0 20px hsla(${hue}, 100%, 60%, 0.8))
                    drop-shadow(0 0 40px hsla(${hue + 30}, 100%, 50%, 0.5))
                `;
                fragment.style.zIndex = Math.floor(distanceZ);

            }, delay);
        });
    }

    createFlashEffect() {
        // 创建中心爆炸闪光
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 10px;
            height: 10px;
            background: radial-gradient(circle, #fff 0%, rgba(255,255,255,0.8) 30%, transparent 70%);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: flash-bang 0.6s ease-out forwards;
            pointer-events: none;
            z-index: 1000;
        `;

        // 添加动画样式
        if (!document.getElementById('particle-flash-style')) {
            const style = document.createElement('style');
            style.id = 'particle-flash-style';
            style.textContent = `
                @keyframes flash-bang {
                    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
                    50% { transform: translate(-50%, -50%) scale(80); opacity: 0.8; }
                    100% { transform: translate(-50%, -50%) scale(150); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        this.container.appendChild(flash);
        setTimeout(() => flash.remove(), 600);
    }

    assemble() {
        if (!this.isExploding) return;
        this.isExploding = false;

        // 重置透视中心
        this.container.style.perspectiveOrigin = 'center center';

        // 创建聚合冲击波
        this.createImplodeEffect();

        this.fragments.forEach((fragment) => {
            const row = parseFloat(fragment.dataset.row);
            const col = parseFloat(fragment.dataset.col);
            const centerX = this.gridSize / 2;
            const centerY = this.gridSize / 2;
            const distFromCenter = Math.sqrt(
                Math.pow(col - centerX, 2) + Math.pow(row - centerY, 2)
            );

            // 从外向内旋转聚合
            const delay = (this.gridSize - distFromCenter) * 50 + Math.random() * 100;

            setTimeout(() => {
                fragment.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
                fragment.style.transform = `
                    translate3d(0, 0, 0)
                    rotateX(0deg)
                    rotateY(0deg)
                    rotateZ(0deg)
                    scale(1)
                `;
                fragment.style.opacity = '1';
                fragment.style.filter = 'brightness(1.2) drop-shadow(0 0 10px rgba(255,255,255,0.5))';
                fragment.style.zIndex = 1;

                // 聚合完成后的闪光
                setTimeout(() => {
                    fragment.style.filter = 'brightness(1)';
                }, 300);

            }, delay);
        });
    }

    createImplodeEffect() {
        // 创建聚合吸入效果
        const implode = document.createElement('div');
        implode.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 50%);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(2);
            animation: implode-suck 0.8s ease-in forwards;
            pointer-events: none;
            z-index: 999;
        `;

        if (!document.getElementById('particle-implode-style')) {
            const style = document.createElement('style');
            style.id = 'particle-implode-style';
            style.textContent = `
                @keyframes implode-suck {
                    0% { transform: translate(-50%, -50%) scale(2); opacity: 0.5; }
                    100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        this.container.appendChild(implode);
        setTimeout(() => implode.remove(), 800);
    }

    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.remove();
        }
        this.img.style.opacity = '1';
    }
}

// 初始化 - 使用 IntersectionObserver 懒加载
function initParticleImages() {
    const cards = document.querySelectorAll('.image-card, .photo-card');
    console.log(`🎆 扫描到 ${cards.length} 个图片卡片`);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.particleInit) {
                const img = entry.target.querySelector('img');
                if (img && img.src) {
                    new ParticleImage(entry.target);
                    entry.target.dataset.particleInit = 'true';
                }
            }
        });
    }, { rootMargin: '100px' });

    cards.forEach(card => observer.observe(card));
}

// 延迟初始化
setTimeout(() => {
    console.log('🎆 开始初始化碎片效果');
    initParticleImages();
}, 1000);

// 监听新图片
const mutationObserver = new MutationObserver(() => {
    setTimeout(initParticleImages, 300);
});
mutationObserver.observe(document.body, { childList: true, subtree: true });

// 暴露到全局
window.ParticleImage = ParticleImage;
window.initParticleImages = initParticleImages;
window.forceInitParticles = function() {
    document.querySelectorAll('.image-card, .photo-card').forEach(card => {
        if (card.querySelector('.particle-container')) {
            card.querySelector('.particle-container').remove();
        }
        delete card.dataset.particleInit;
    });
    initParticleImages();
};
