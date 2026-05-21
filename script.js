document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('nav');
    const revealEls = document.querySelectorAll('.scroll-reveal');

    revealEls.forEach(el => el.classList.add('visible'));

    nav.addEventListener('click', (event) => {
        if (event.target.tagName === 'A') {
            event.preventDefault();
            const targetId = event.target.getAttribute('href').slice(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                window.scrollTo({ top: targetSection.offsetTop, behavior: 'smooth' });
            }
        }
    });

    // ─── Night mode toggle ─────────────────────────────────────────────────
    const toggle = document.getElementById('nightToggle');
    const thumb  = document.getElementById('nightToggleThumb');
    const isDark = localStorage.getItem('nightMode') === 'true';
    if (isDark) document.body.classList.add('dark');

    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        localStorage.setItem('nightMode', document.body.classList.contains('dark'));
    });

    // Animate the thumb with the pink/purple gradient on hover
    let thumbRaf = null;
    let thumbStart = null;

    function animateThumb(now) {
        if (!thumbStart) thumbStart = now;
        const t = ((now - thumbStart) % CYCLE_MS) / CYCLE_MS;
        const gradient = buildGradient(t);
        thumb.style.background = gradient;
        thumbRaf = requestAnimationFrame(animateThumb);
    }

    toggle.addEventListener('mouseenter', () => {
        thumbStart = null;
        thumbRaf = requestAnimationFrame(animateThumb);
    });

    toggle.addEventListener('mouseleave', () => {
        if (thumbRaf) cancelAnimationFrame(thumbRaf);
        thumbRaf = null;
        thumbStart = null;
        thumb.style.background = '';
    });

    // ─── Gradient hover system ─────────────────────────────────────────────
    // Add data-gradient="text" or data-gradient="pill" to any element in HTML.

    const CYCLE_MS = 1800;
    const PINK     = '#f9c2eb';
    const PURPLE   = '#a8c2ee';

    function hexToRgb(hex) {
        const n = parseInt(hex.slice(1), 16);
        return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }

    const P = hexToRgb(PINK);
    const Q = hexToRgb(PURPLE);

    function lerp(a, b, t) {
        return [
            Math.round(a[0] + (b[0] - a[0]) * t),
            Math.round(a[1] + (b[1] - a[1]) * t),
            Math.round(a[2] + (b[2] - a[2]) * t),
        ];
    }

    function toRgb([r, g, b]) { return `rgb(${r},${g},${b})`; }

    function buildGradient(t) {
        const tL = (Math.sin(t * Math.PI * 2) + 1) / 2;
        const tR = (Math.sin((t + 0.5) * Math.PI * 2) + 1) / 2;
        return `linear-gradient(90deg, ${toRgb(lerp(P, Q, tL))} 0%, ${toRgb(lerp(P, Q, tR))} 100%)`;
    }

    const rafIds = new Map();

    function applyText(el, gradient) {
        el.style.backgroundImage      = gradient;
        el.style.backgroundSize       = '100% 100%';
        el.style.webkitBackgroundClip = 'text';
        el.style.backgroundClip       = 'text';
        el.style.webkitTextFillColor  = 'transparent';
    }

    function applyPill(el, gradient) {
        el.style.backgroundImage = gradient;
        el.style.backgroundSize  = '100% 100%';
        el.style.outlineColor    = 'transparent';
        el.style.color           = '#3a3f45';
    }

    function startGradient(el, mode) {
        if (rafIds.has(el)) cancelAnimationFrame(rafIds.get(el));
        if (!el._gradStart) el._gradStart = performance.now();

        function frame(now) {
            const t = ((now - el._gradStart) % CYCLE_MS) / CYCLE_MS;
            const gradient = buildGradient(t);
            mode === 'text' ? applyText(el, gradient) : applyPill(el, gradient);
            rafIds.set(el, requestAnimationFrame(frame));
        }
        rafIds.set(el, requestAnimationFrame(frame));
    }

    function stopGradient(el) {
        if (rafIds.has(el)) {
            cancelAnimationFrame(rafIds.get(el));
            rafIds.delete(el);
        }
        el._gradStart = null;
        el.style.cssText = '';
    }

    document.querySelectorAll('[data-gradient]').forEach(el => {
        const mode = el.dataset.gradient;
        el.addEventListener('mouseenter', () => startGradient(el, mode));
        el.addEventListener('mouseleave', () => stopGradient(el));
    });
});
