/**
 * animations.js
 * High-performance Intersection Observer scroll reveals and stagger controller.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Reveal Animations on Scroll
    const revealOptions = {
        root: null,
        rootMargin: '0px -10% -10% 0px', // Trigger slightly before element enters center
        threshold: 0.05
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the .active class to trigger the CSS transition
                entry.target.classList.add('active');
                
                // If it contains an SVG to draw, trigger SVG path animation
                if (entry.target.classList.contains('draw-svg')) {
                    const paths = entry.target.querySelectorAll('path');
                    paths.forEach(path => {
                        path.style.strokeDashoffset = '0';
                    });
                }

                // Stop observing once reveal is triggered
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    // Dynamic Stagger Animations for children
    document.querySelectorAll('[data-reveal-group]').forEach(parent => {
        const children = parent.querySelectorAll('[data-reveal]');
        children.forEach((child, index) => {
            child.style.transitionDelay = `${(index + 1) * 120}ms`;
        });
    });

    // Observe all individual reveal elements
    document.querySelectorAll('[data-reveal]').forEach(el => {
        revealObserver.observe(el);
    });
});
