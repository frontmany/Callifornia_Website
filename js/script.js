document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('active');
            
            const spans = this.querySelectorAll('span');
            if (this.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
            } else {
                spans.forEach(span => {
                    span.style.transform = '';
                    span.style.opacity = '';
                });
            }
        });
    }
    
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768 && menuToggle && nav) {
                menuToggle.classList.remove('active');
                nav.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = '';
                    span.style.opacity = '';
                });
            }
        });
    });

    // Scroll reveal animations
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
        const revealTargets = [
            '.hero-text',
            '.hero-image',
            '.features-preview .feature-card',
            '.problem-solution .comparison-grid',
            '.download-section .download-card'
        ].map(sel => Array.from(document.querySelectorAll(sel))).flat();

        if (revealTargets.length) {
            revealTargets.forEach((el, i) => {
                el.classList.add('reveal');
                el.style.transitionDelay = (Math.min(i, 6) * 60) + 'ms';
            });

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

            revealTargets.forEach(el => observer.observe(el));
        }
    }

    // Scroll Progress Bar
    createScrollProgressBar();

    // Particle Animation Background
    createParticleAnimation();

    // 3D Card Tilt Effect (subtle)
    init3DCardTilt();

    // Ripple Effect on Buttons
    initRippleEffect();

    // Smooth Scroll with Easing
    initSmoothScroll();

    // Scroll to Top Button
    initScrollToTop();

    // Subtle hover effects
    initHoverEffects();

    // Roadmap timeline scroll animations
    initRoadmapScrollAnimations();
});

// ========================================
// SCROLL PROGRESS BAR
// ========================================
function createScrollProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// ========================================
// PARTICLE ANIMATION
// ========================================
function createParticleAnimation() {
    const canvas = document.createElement('canvas');
    canvas.className = 'particle-canvas';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 30; // Reduced for subtlety

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = `rgba(0, 102, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Draw connections
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.strokeStyle = `rgba(0, 102, 255, ${0.1 * (1 - distance / 150)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(animateParticles);
    }

    animateParticles();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ========================================
// 3D CARD TILT EFFECT (SUBTLE)
// ========================================
function init3DCardTilt() {
    const cards = document.querySelectorAll('.feature-card, .download-card, .problem-card, .solution-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // More subtle rotation (divided by 20 instead of 10)
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

// ========================================
// RIPPLE EFFECT ON BUTTONS
// ========================================
function initRippleEffect() {
    const buttons = document.querySelectorAll('.cta-button, .download-button');

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// ========================================
// SMOOTH SCROLL
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========================================
// SCROLL TO TOP BUTTON
// ========================================
function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTop');
    if (!scrollBtn) return;

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });

    // Smooth scroll to top on click
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================================
// HOVER EFFECTS
// ========================================
function initHoverEffects() {
    // Subtle scale effect on card hover
    const allCards = document.querySelectorAll('.feature-card, .download-card');
    
    allCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
}

// ========================================
// ROADMAP SLIDER ANIMATIONS
// ========================================
function initRoadmapScrollAnimations() {
    // Проверяем, находимся ли мы на странице roadmap
    const roadmapTimeline = document.querySelector('.roadmap-timeline');
    const timelineSlider = document.getElementById('timeline-slider');
    
    if (!roadmapTimeline || !timelineSlider) return;

    // Получаем все элементы timeline
    const timelineItems = document.querySelectorAll('.timeline-item');
    const sliderSteps = document.querySelectorAll('.slider-step');
    const sliderValue = document.querySelector('.slider-value');
    
    if (timelineItems.length === 0) return;

    // Массив меток для слайдера
    const stepLabels = [
        'Q4 2025',
        'Q1 2026',
        'Q2 2026',
        'Q3 2026',
        '2027+'
    ];

    // Функция для обновления видимости блоков
    function updateTimelineVisibility(value) {
        const stepValue = parseInt(value);
        
        // Обновляем текст текущего значения
        if (sliderValue) {
            sliderValue.textContent = stepLabels[stepValue] || 'Q4 2025';
        }

        // Обновляем активный шаг
        sliderSteps.forEach((step, index) => {
            if (index === stepValue) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Показываем/скрываем блоки в зависимости от значения слайдера
        timelineItems.forEach((item, index) => {
            // Показываем только карточку, соответствующую текущему положению ползунка
            if (index === stepValue) {
                // Элемент должен быть виден - показываем с анимацией
                if (!item.classList.contains('visible')) {
                    item.classList.add('visible');
                }
            } else {
                // Скрываем все остальные элементы
                item.classList.remove('visible');
            }
        });
        
        // Обновляем высоту контейнера под видимую карточку
        setTimeout(() => {
            const visibleItem = timelineItems[stepValue];
            if (visibleItem && visibleItem.classList.contains('visible')) {
                const itemHeight = visibleItem.offsetHeight;
                roadmapTimeline.style.minHeight = (itemHeight + 64) + 'px'; // +64 для padding
            }
        }, 100);
    }

    // Обработчик изменения слайдера
    timelineSlider.addEventListener('input', function() {
        updateTimelineVisibility(this.value);
    });

    // Обработчики клика на метки шагов
    sliderSteps.forEach((step, index) => {
        step.addEventListener('click', function() {
            timelineSlider.value = index;
            updateTimelineVisibility(index);
        });
    });

    // Инициализация: показываем только текущую версию
    updateTimelineVisibility(timelineSlider.value);
}

// ========================================
// DOWNLOAD TRIANGLE NETWORK
// ========================================
function initDownloadTriangles() {
    const container = document.querySelector('.tri-hero');
    const canvas = container ? container.querySelector('canvas') : null;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = container.clientWidth;
    let height = container.clientHeight;

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = container.clientWidth;
        height = container.clientHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        buildGrid();
    }

    const grid = [];
    const cells = [];
    let cols = 16;
    let rows = 7;
    const phases = [];

    function buildGrid() {
        grid.length = 0;
        cells.length = 0;
        phases.length = 0;

        // Adjust density based on width
        cols = Math.max(12, Math.round(width / 70));
        rows = Math.max(6, Math.round(height / 40));

        const xStep = width / (cols - 1);
        const yStep = height / (rows - 1);

        for (let j = 0; j < rows; j++) {
            for (let i = 0; i < cols; i++) {
                const jitterX = (Math.random() - 0.5) * xStep * 0.2;
                const jitterY = (Math.random() - 0.5) * yStep * 0.2;
                grid.push({
                    bx: i * xStep,
                    by: j * yStep,
                    x: i * xStep + jitterX,
                    y: j * yStep + jitterY,
                    phase: Math.random() * Math.PI * 2,
                    speed: 0.6 + Math.random() * 0.6
                });
            }
        }

        for (let j = 0; j < rows - 1; j++) {
            for (let i = 0; i < cols - 1; i++) {
                const idx = j * cols + i;
                const a = grid[idx];
                const b = grid[idx + 1];
                const c = grid[idx + cols];
                const d = grid[idx + cols + 1];
                cells.push([a, b, c]); // triangle 1
                cells.push([b, d, c]); // triangle 2
            }
        }
    }

    const mouse = { x: width / 2, y: height / 2, over: false };

    function update(t) {
        const time = t * 0.001;
        for (let p of grid) {
            const rdx = Math.sin(time * p.speed + p.phase) * 3;
            const rdy = Math.cos(time * p.speed + p.phase) * 3;
            p.x = p.bx + rdx;
            p.y = p.by + rdy;
            if (mouse.over) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.hypot(dx, dy);
                const influence = Math.max(0, 1 - dist / 180);
                p.x += dx * -0.08 * influence;
                p.y += dy * -0.08 * influence;
            }
        }
    }

    function render() {
        ctx.clearRect(0, 0, width, height);
        for (let tri of cells) {
            const cx = (tri[0].x + tri[1].x + tri[2].x) / 3;
            const cy = (tri[0].y + tri[1].y + tri[2].y) / 3;
            const mdx = cx - mouse.x;
            const mdy = cy - mouse.y;
            const md = Math.hypot(mdx, mdy);
            const near = Math.max(0, 1 - md / 260);

            const hue = 205 + near * 30; // shift towards teal near cursor
            const sat = 68;
            const light = 82 - near * 22;
            const fillA = 0.06 + near * 0.08;
            const strokeA = 0.06 + near * 0.12;

            ctx.beginPath();
            ctx.moveTo(tri[0].x, tri[0].y);
            ctx.lineTo(tri[1].x, tri[1].y);
            ctx.lineTo(tri[2].x, tri[2].y);
            ctx.closePath();

            ctx.fillStyle = `hsla(${hue}, ${sat}%, ${light}%, ${fillA})`;
            ctx.fill();

            ctx.strokeStyle = `hsla(${hue}, ${sat}%, ${light - 8}%, ${strokeA})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
        }
    }

    let rafId = 0;
    function loop(t) {
        update(t || 0);
        render();
        rafId = requestAnimationFrame(loop);
    }

    function onPointerMove(e) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = (e.clientX - rect.left) * (width / rect.width);
        mouse.y = (e.clientY - rect.top) * (height / rect.height);
        mouse.over = true;
    }

    function onPointerLeave() {
        mouse.over = false;
    }

    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerleave', onPointerLeave);

    if (prefersReducedMotion) {
        render();
        return;
    }

    loop(0);
}