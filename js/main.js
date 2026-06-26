// ========== 导航栏滚动效果 ==========
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
    updateActiveNav();
});

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

// 点击导航链接关闭移动端菜单
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
    });
});

// ========== 活跃导航高亮 ==========
function updateActiveNav() {
    const scrollPos = window.scrollY + 120;
    let current = '';

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
}

// ========== 数字滚动动画 ==========
const statNumbers = document.querySelectorAll('.stat-number');

function animateNumbers() {
    statNumbers.forEach(el => {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutExpo
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = Math.floor(eased * target);

            if (target >= 1000000000) {
                el.textContent = '$' + (current / 1000000000).toFixed(1) + 'B';
            } else if (target >= 1000000) {
                el.textContent = (current / 1000000).toFixed(0) + 'M';
            } else if (target >= 10000) {
                el.textContent = (current / 10000).toFixed(0) + '万+';
            } else {
                el.textContent = current.toLocaleString() + '+';
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                // 最终精确值
                if (target >= 1000000000) {
                    el.textContent = '$2.0T';
                } else if (target >= 1000000) {
                    el.textContent = (target / 1000000).toFixed(0) + 'M';
                } else if (target >= 10000) {
                    el.textContent = (target / 10000).toFixed(0) + '万+';
                } else {
                    el.textContent = target.toLocaleString() + '+';
                }
            }
        }
        requestAnimationFrame(update);
    });
}

// 使用 IntersectionObserver 触发数字动画
const factsSection = document.getElementById('facts');
const factsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateNumbers();
            factsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

factsObserver.observe(factsSection);

// ========== 和平承诺按钮 ==========
const pledgeBtn = document.getElementById('pledgeBtn');
const countNum = document.getElementById('countNum');

pledgeBtn.addEventListener('click', () => {
    let count = parseInt(countNum.textContent.replace(/,/g, ''));
    count += Math.floor(Math.random() * 3) + 1;

    // 显示效果
    pledgeBtn.textContent = '✓ 已签署';
    pledgeBtn.style.background = 'linear-gradient(135deg, #4caf50, #45a049)';
    pledgeBtn.style.boxShadow = '0 4px 15px rgba(76,175,80,0.3)';
    pledgeBtn.disabled = true;

    // 更新人数
    countNum.textContent = count.toLocaleString();

    // 小庆祝动画
    createConfetti();
});

// ========== 简易彩纸庆祝效果 ==========
function createConfetti() {
    const colors = ['#e8c56b', '#f5e6a3', '#ff6b6b', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd'];

    for (let i = 0; i < 60; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: ${Math.random() * 8 + 4}px;
            height: ${Math.random() * 8 + 4}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}vw;
            top: -10px;
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            pointer-events: none;
            z-index: 9999;
            opacity: 1;
        `;
        document.body.appendChild(confetti);

        const duration = Math.random() * 2000 + 1000;
        const xDrift = (Math.random() - 0.5) * 200;

        confetti.animate([
            { transform: 'translateY(0) translateX(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight + 50}px) translateX(${xDrift}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }).onfinish = () => confetti.remove();
    }
}

// ========== 和平鸽粒子动画 (Canvas) ==========
const canvas = document.getElementById('doveCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
const PARTICLE_COUNT = 80;

function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.speedY = (Math.random() - 0.5) * 0.8 - 0.3;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.baseOpacity = this.opacity;
        this.pulseSpeed = Math.random() * 0.02 + 0.005;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // 脉冲呼吸
        this.opacity = this.baseOpacity + Math.sin(Date.now() * this.pulseSpeed) * 0.15;

        // 边界回绕
        if (this.x < -10) this.x = width + 10;
        if (this.x > width + 10) this.x = -10;
        if (this.y < -10) this.y = height + 10;
        if (this.y > height + 10) this.y = -10;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, Math.min(1, this.opacity))})`;
        ctx.fill();
    }
}

// 初始化粒子
function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }
}

initParticles();

// 绘制鸽子形状粒子群
let doveTargets = [];
let isDoveMode = false;
let dovePhase = 0;

function generateDovePoints() {
    doveTargets = [];
    const cx = width / 2;
    const cy = height / 3;
    const scale = Math.min(width, height) / 15;

    // 鸽子的简化轮廓点
    const points = [];
    // 身体
    for (let i = 0; i < 30; i++) {
        const t = i / 30;
        const angle = t * Math.PI * 2;
        // 鸽子形状的参数化
        const bodyR = scale * (0.6 + 0.3 * Math.sin(angle * 2));
        const px = cx + bodyR * Math.cos(angle);
        const py = cy + bodyR * Math.sin(angle) * 0.7;
        points.push({ x: px, y: py });
    }
    // 翅膀
    for (let i = 0; i < 20; i++) {
        const t = i / 20;
        const wx = cx + scale * (0.3 + t * 1.2);
        const wy = cy - scale * (0.2 + t * 0.6 * Math.sin(t * Math.PI));
        points.push({ x: wx, y: wy });
    }
    // 橄榄枝
    for (let i = 0; i < 15; i++) {
        const t = i / 15;
        const bx = cx + scale * 0.7 + t * scale * 0.5;
        const by = cy + scale * 0.1 - t * scale * 0.3 * Math.sin(t * Math.PI * 3);
        points.push({ x: bx, y: by });
    }

    // 随机选取位置给粒子
    particles.forEach(p => {
        const src = points[Math.floor(Math.random() * points.length)];
        doveTargets.push({
            tx: src.x + (Math.random() - 0.5) * scale * 0.3,
            ty: src.y + (Math.random() - 0.5) * scale * 0.3
        });
    });
}

let animationId;

function animate() {
    ctx.clearRect(0, 0, width, height);

    // 模式切换：鸽子形态循环
    dovePhase += 0.003;
    isDoveMode = Math.sin(dovePhase) > 0.3;

    if (isDoveMode && particles.length > 0 && doveTargets.length === particles.length) {
        // 趋向鸽子形状
        particles.forEach((p, i) => {
            const target = doveTargets[i];
            p.x += (target.x - p.x) * 0.02;
            p.y += (target.y - p.y) * 0.02;
            p.size = Math.random() * 2.5 + 0.5;
            p.opacity = Math.min(0.8, p.opacity + 0.01);
        });
    }

    // 绘制连线（粒子间靠近时连线）
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 * (1 - dist / 120)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }

    // 更新并绘制粒子
    particles.forEach(p => {
        if (!isDoveMode) p.update();
        p.draw();
    });

    animationId = requestAnimationFrame(animate);
}

// 定时重新生成鸽子目标
setInterval(() => {
    if (width > 0 && height > 0) {
        generateDovePoints();
    }
}, 3000);

// 初始生成
setTimeout(() => generateDovePoints(), 500);

// 窗口变化时重置
window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
    generateDovePoints();
});

// 开始动画
animate();

// ========== 平滑出现动画 (Intersection Observer) ==========
const animateElements = document.querySelectorAll('.card, .voice-card, .action-item, .stat-item');

const appearObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    appearObserver.observe(el);
});

// ========== 键盘快捷键 ==========
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        navLinks.classList.remove('open');
    }
});
