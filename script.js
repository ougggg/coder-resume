(() => {
    'use strict';

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    function createMotionPreference() {
        const button = document.getElementById('motion-toggle');
        const label = button?.querySelector('[data-motion-label]');
        const heroText = document.querySelector('.hero-text');
        const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
        const listeners = new Set();
        const storageKey = 'coder-resume-motion-paused';
        let manuallyPaused = false;

        const markArrived = () => {
            heroText?.classList.add('has-arrived');
            heroText?.removeEventListener('animationend', onArrival);
        };
        const onArrival = event => {
            if (event.target === heroText.lastElementChild && event.animationName === 'arrive') markArrived();
        };
        heroText?.addEventListener('animationend', onArrival);

        try {
            manuallyPaused = localStorage.getItem(storageKey) === 'true';
        } catch {
            // Browser privacy settings may block storage; the control still works.
        }

        const allowed = () => !preference.matches && !manuallyPaused;
        const update = () => {
            const paused = !allowed();
            // Once readable, the introduction should never replay its entrance when motion resumes.
            if (paused) markArrived();
            document.body.classList.toggle('is-paused', paused);
            document.documentElement.classList.toggle('motion-paused', paused);
            if (button) {
                button.setAttribute('aria-pressed', String(paused));
                button.disabled = preference.matches;
                button.title = preference.matches ? '已遵循系统的减少动态设置' : '';
            }
            if (label) label.textContent = preference.matches ? '已减少动态' : paused ? '开启动效' : '暂停动效';
            listeners.forEach(listener => listener(allowed()));
        };

        button?.addEventListener('click', () => {
            if (preference.matches) return;
            manuallyPaused = !manuallyPaused;
            try {
                localStorage.setItem(storageKey, String(manuallyPaused));
            } catch {
                // Keep the current-page preference when storage is unavailable.
            }
            update();
        });

        if (preference.addEventListener) {
            preference.addEventListener('change', update);
        } else {
            preference.addListener(update);
        }
        update();

        return {
            allowed,
            subscribe(listener) {
                listeners.add(listener);
                listener(allowed());
            }
        };
    }

    function createMenu() {
        const button = document.getElementById('menu-toggle');
        const links = document.getElementById('nav-links');
        const desktop = window.matchMedia('(min-width: 769px)');
        let isOpen = false;

        const close = (restoreFocus = false) => {
            isOpen = false;
            links?.classList.remove('is-open');
            button?.setAttribute('aria-expanded', 'false');
            button?.setAttribute('aria-label', '展开导航');
            if (restoreFocus) button?.focus();
        };

        button?.addEventListener('click', () => {
            isOpen = !isOpen;
            links?.classList.toggle('is-open', isOpen);
            button.setAttribute('aria-expanded', String(isOpen));
            button.setAttribute('aria-label', isOpen ? '收起导航' : '展开导航');
        });
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && isOpen) close(true);
        });
        document.addEventListener('click', event => {
            if (isOpen && !links?.contains(event.target) && !button?.contains(event.target)) close();
        });
        links?.addEventListener('click', event => {
            if (event.target.closest('a')) close();
        });

        // Native anchors preserve URL hashes, browser history and scrolling behavior.
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', event => {
                if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                const hash = anchor.getAttribute('href');
                if (!hash || hash === '#') return;
                let target;
                try {
                    target = document.getElementById(decodeURIComponent(hash.slice(1)));
                } catch {
                    return;
                }
                if (!target) return;
                close();
                if (!target.hasAttribute('tabindex')) {
                    target.setAttribute('tabindex', '-1');
                    target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
                }
                target.focus({ preventScroll: true });
            });
        });

        close();
        return { resize: () => { if (desktop.matches) close(); } };
    }

    function createNavigation() {
        const navbar = document.querySelector('.navbar');
        const links = [...document.querySelectorAll('#nav-links a[href^="#"]')];
        const sections = [...document.querySelectorAll('section[id], footer#contact')];
        let activeId = '';

        return () => {
            navbar?.classList.toggle('scrolled', window.scrollY > 24);
            const readingLine = (navbar?.offsetHeight || 80) + 100;
            let current = sections[0]?.id;
            sections.forEach(section => {
                if (section.getBoundingClientRect().top <= readingLine) current = section.id;
            });
            if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8) {
                current = sections[sections.length - 1]?.id;
            }
            if (!current || current === activeId) return;
            activeId = current;
            links.forEach(link => {
                const active = link.getAttribute('href') === `#${current}`;
                link.classList.toggle('active', active);
                if (active) link.setAttribute('aria-current', 'location');
                else link.removeAttribute('aria-current');
            });
        };
    }

    function createReveals(motion) {
        const elements = [...document.querySelectorAll('.fade-in')];
        const revealAll = () => elements.forEach(element => element.classList.add('visible'));
        if (!('IntersectionObserver' in window) || !motion.allowed()) {
            revealAll();
            return;
        }

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
        elements.forEach(element => observer.observe(element));
        motion.subscribe(allowed => {
            if (!allowed) {
                revealAll();
                observer.disconnect();
            }
        });
    }

    function createFireflies(canvas) {
        let context;
        try {
            context = canvas?.getContext('2d');
        } catch {
            return null;
        }
        if (!context) return null;

        const sprite = document.createElement('canvas');
        sprite.width = 40;
        sprite.height = 40;
        const spriteContext = sprite.getContext('2d');
        if (!spriteContext) return null;
        const glow = spriteContext.createRadialGradient(20, 20, 0, 20, 20, 20);
        glow.addColorStop(0, 'rgba(246, 255, 228, 1)');
        glow.addColorStop(0.12, 'rgba(219, 255, 188, 0.9)');
        glow.addColorStop(0.35, 'rgba(164, 235, 174, 0.24)');
        glow.addColorStop(1, 'rgba(164, 235, 174, 0)');
        spriteContext.fillStyle = glow;
        spriteContext.fillRect(0, 0, 40, 40);

        let width = 1;
        let height = 1;
        let particles = [];
        let exclusions = [];
        const depths = [
            { radius: [3, 6], speed: [1.8, 3.5], opacity: [0.2, 0.36], drift: 2, frequency: 0.3 },
            { radius: [5, 8], speed: [3.5, 5.8], opacity: [0.3, 0.48], drift: 4, frequency: 0.5 },
            { radius: [9, 11], speed: [6, 8], opacity: [0.36, 0.55], drift: 6, frequency: 0.75 }
        ];
        const depthOrder = [0, 0, 1, 0, 0, 0, 0, 1, 0, 2, 0, 0, 1, 0];
        const randomBetween = ([min, max]) => min + Math.random() * (max - min);
        const visibilityAt = (x, y, radius = 0) => exclusions.reduce((visibility, rectangle) => {
            const distanceX = Math.max(rectangle.left - x, 0, x - rectangle.right);
            const distanceY = Math.max(rectangle.top - y, 0, y - rectangle.bottom);
            // Fade outside the reading area; the whole glow remains clear of the text.
            const fade = clamp((Math.hypot(distanceX, distanceY) - radius) / 40, 0, 1);
            return Math.min(visibility, fade * fade * (3 - 2 * fade));
        }, 1);

        return {
            setExclusions(rectangles) {
                exclusions = rectangles;
            },
            resize(nextWidth, nextHeight) {
                const scaleX = nextWidth / width;
                const scaleY = nextHeight / height;
                width = Math.max(nextWidth, 1);
                height = Math.max(nextHeight, 1);
                const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
                canvas.width = Math.round(width * ratio);
                canvas.height = Math.round(height * ratio);
                context.setTransform(ratio, 0, 0, ratio, 0, 0);
                particles.forEach(particle => {
                    particle.x *= scaleX;
                    particle.y *= scaleY;
                });
                const count = window.innerWidth <= 768 ? 14 : 32;
                particles = particles.slice(0, count);
                while (particles.length < count) {
                    const depth = depths[depthOrder[particles.length % depthOrder.length]];
                    particles.push({
                        x: Math.random() * width,
                        y: Math.random() * height,
                        radius: randomBetween(depth.radius),
                        speed: randomBetween(depth.speed),
                        opacity: randomBetween(depth.opacity),
                        drift: depth.drift,
                        frequency: depth.frequency,
                        phase: Math.random() * Math.PI * 2,
                        pulse: Math.random() * Math.PI * 2
                    });
                }
            },
            draw(time, delta, pointer) {
                context.clearRect(0, 0, width, height);
                const pointerX = pointer.x * width;
                const pointerY = pointer.y * height;
                const canAttract = pointer.active && visibilityAt(pointerX, pointerY, 11) === 1;
                particles.forEach(particle => {
                    particle.x += Math.sin(time * particle.frequency + particle.phase) * delta * particle.drift;
                    particle.y -= particle.speed * delta;
                    if (canAttract) {
                        const distanceX = pointerX - particle.x;
                        const distanceY = pointerY - particle.y;
                        const distance = Math.hypot(distanceX, distanceY);
                        if (distance > 1 && distance < 210) {
                            const attraction = (1 - distance / 210) * delta * particle.drift;
                            particle.x += distanceX / distance * attraction;
                            particle.y += distanceY / distance * attraction;
                        }
                    }
                    if (particle.y < -24) particle.y = height + 24;
                    if (particle.x < -24) particle.x = width + 24;
                    if (particle.x > width + 24) particle.x = -24;
                    const visibility = visibilityAt(particle.x, particle.y, particle.radius);
                    if (visibility === 0) return;
                    const pulse = 0.72 + (Math.sin(time * particle.frequency + particle.pulse) + 1) * 0.14;
                    context.globalAlpha = particle.opacity * pulse * visibility;
                    context.drawImage(sprite, particle.x - particle.radius, particle.y - particle.radius,
                        particle.radius * 2, particle.radius * 2);
                });
                context.globalAlpha = 1;
            }
        };
    }

    function createScene(motion) {
        const hero = document.getElementById('hero');
        if (!hero) return { resize() {}, scroll() {} };
        const fireflies = createFireflies(document.getElementById('fireflies'));
        const readingAreas = [...hero.querySelectorAll('.hero-text, .hero-bottom, .scene-caption')];
        const navbar = document.querySelector('.navbar');
        const pointer = { x: 0.5, y: 0.5, active: false };
        const position = { x: 0, y: 0, scroll: 0 };
        let bounds = hero.getBoundingClientRect();
        let visible = bounds.bottom > 0 && bounds.top < window.innerHeight;
        let running = false;
        let frame = null;
        let previousTime = 0;
        let sceneTime = 0;
        let targetScroll = 0;

        const applyPosition = () => {
            hero.style.setProperty('--pointer-x', `${position.x.toFixed(2)}px`);
            hero.style.setProperty('--pointer-y', `${position.y.toFixed(2)}px`);
            hero.style.setProperty('--scroll-y', `${position.scroll.toFixed(2)}px`);
        };
        const animate = timestamp => {
            frame = null;
            if (!running) return;
            frame = window.requestAnimationFrame(animate);
            // Limit scene work to 30fps; time-based motion stays consistent across displays.
            const elapsed = timestamp - previousTime;
            if (previousTime && elapsed < 1000 / 30 - 0.5) return;
            const delta = previousTime ? Math.min(elapsed / 1000, 0.08) : 1 / 30;
            previousTime = timestamp;
            sceneTime += delta;
            const easing = Math.min(delta * 4, 1);
            position.x += ((pointer.active ? (pointer.x - 0.5) * 36 : 0) - position.x) * easing;
            position.y += ((pointer.active ? (pointer.y - 0.5) * 26 : 0) - position.y) * easing;
            position.scroll += (targetScroll - position.scroll) * easing;
            applyPosition();
            fireflies?.draw(sceneTime, delta, pointer);
        };
        const sync = () => {
            const idle = !visible || document.hidden;
            document.body.classList.toggle('scene-idle', idle);
            const shouldRun = motion.allowed() && !idle;
            if (shouldRun === running) return;
            running = shouldRun;
            if (running) {
                previousTime = 0;
                frame = window.requestAnimationFrame(animate);
            } else {
                window.cancelAnimationFrame(frame);
                frame = null;
                pointer.active = false;
                if (!motion.allowed()) {
                    position.x = 0;
                    position.y = 0;
                    position.scroll = 0;
                    applyPosition();
                }
            }
        };

        hero.addEventListener('pointermove', event => {
            if (!running || event.pointerType !== 'mouse') return;
            pointer.x = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
            pointer.y = clamp((event.clientY - bounds.top) / bounds.height, 0, 1);
            pointer.active = true;
        }, { passive: true });
        hero.addEventListener('pointerleave', () => { pointer.active = false; }, { passive: true });
        document.addEventListener('visibilitychange', sync);
        const hasObserver = 'IntersectionObserver' in window;
        if (hasObserver) {
            const observer = new IntersectionObserver(entries => {
                visible = entries[0].isIntersecting;
                sync();
            }, { threshold: 0 });
            observer.observe(hero);
        }
        motion.subscribe(sync);

        return {
            resize() {
                bounds = hero.getBoundingClientRect();
                fireflies?.resize(hero.clientWidth, hero.clientHeight);
                const rectangles = readingAreas.map(element => element.getBoundingClientRect())
                    .filter(rectangle => rectangle.width > 0 && rectangle.height > 0)
                    .map(rectangle => ({
                        left: rectangle.left - bounds.left,
                        right: rectangle.right - bounds.left,
                        top: rectangle.top - bounds.top,
                        bottom: rectangle.bottom - bounds.top
                    }));
                rectangles.push({
                    left: 0,
                    right: hero.clientWidth,
                    top: 0,
                    bottom: Math.max(90, navbar?.getBoundingClientRect().height || 0)
                });
                fireflies?.setExclusions(rectangles);
                if (!running) fireflies?.draw(sceneTime, 0, pointer);
            },
            scroll() {
                bounds = hero.getBoundingClientRect();
                targetScroll = clamp(-bounds.top * 0.045, 0, 28);
                if (!hasObserver) {
                    visible = bounds.bottom > 0 && bounds.top < window.innerHeight;
                    sync();
                }
            }
        };
    }

    function observeViewport(scene, menu, updateNavigation) {
        let frame = null;
        let needsResize = true;
        const update = () => {
            frame = null;
            if (needsResize) {
                scene.resize();
                menu.resize();
                needsResize = false;
            }
            scene.scroll();
            updateNavigation();
        };
        const schedule = (resize = false) => {
            needsResize = needsResize || resize;
            if (frame === null && !document.hidden) frame = window.requestAnimationFrame(update);
        };
        window.addEventListener('scroll', () => schedule(), { passive: true });
        window.addEventListener('resize', () => schedule(true), { passive: true });
        window.addEventListener('hashchange', () => schedule());
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                window.cancelAnimationFrame(frame);
                frame = null;
            } else {
                schedule(true);
            }
        });
        if ('ResizeObserver' in window) {
            const hero = document.getElementById('hero');
            if (hero) new ResizeObserver(() => schedule(true)).observe(hero);
        }
        document.fonts?.ready.then(() => schedule(true));
        update();
    }

    function initialize() {
        const motion = createMotionPreference();
        const menu = createMenu();
        const scene = createScene(motion);
        createReveals(motion);
        observeViewport(scene, menu, createNavigation());
        // Content starts visible; CSS reveals activate only after setup succeeds.
        document.body.classList.add('motion-ready');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize, { once: true });
    } else {
        initialize();
    }
})();
