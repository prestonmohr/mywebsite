document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('nav');
    const revealEls = document.querySelectorAll('.scroll-reveal');

    // Make all elements visible immediately on load
    revealEls.forEach(el => el.classList.add('visible'));

    // Smooth scroll for navigation links
    nav.addEventListener('click', (event) => {
        if (event.target.tagName === 'A') {
            event.preventDefault();
            const targetId = event.target.getAttribute('href').slice(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});
