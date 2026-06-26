/**
 * animations.js
 * Handles scroll-based animations and intersection observers.
 */

document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const elementObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the animation class when scrolled into view
                entry.target.classList.add('animate-fade-up');
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements with 'data-animate' attribute will be observed
    document.querySelectorAll('[data-animate]').forEach(el => {
        // Ensure element starts invisible if it's going to fade in
        el.style.opacity = '0';
        elementObserver.observe(el);
    });
});
