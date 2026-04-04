document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('nav');
    const sections = document.querySelectorAll('section');

    // Make all sections visible on load
    sections.forEach(section => {
        section.classList.add('active');
    });

    // Smooth scroll for navigation links
    nav.addEventListener('click', (event) => {
        if (event.target.tagName === 'A') {
            event.preventDefault();
            const targetSection = document.getElementById(event.target.getAttribute('href').slice(1));

            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});
