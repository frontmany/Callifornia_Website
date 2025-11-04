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
