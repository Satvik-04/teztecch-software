/**
 * main.js
 * Global application logic, state management, and initializations.
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('TezTecch application initialized.');
    
    // 1. Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            mobileBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Prevent scrolling when menu is open
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }

    // 2. Active Page Highlighting
    let currentPage = window.location.pathname.split('/').pop();
    if (!currentPage || currentPage === '') {
        currentPage = 'index.html';
    }
    
    const navItems = document.querySelectorAll('.nav-link');
    navItems.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
        }
    });

    // 3. Navbar scroll effect (Performance Optimized)
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (lastScrollY > 50) {
                    navbar.style.boxShadow = 'var(--shadow-soft)';
                    navbar.style.background = 'rgba(255, 255, 255, 0.85)';
                    navbar.style.backdropFilter = 'blur(20px)';
                    navbar.style.webkitBackdropFilter = 'blur(20px)';
                    navbar.style.borderBottom = '1px solid rgba(255,255,255,0.8)';
                } else {
                    navbar.style.boxShadow = 'none';
                    navbar.style.background = 'rgba(255, 255, 255, 0.01)';
                    navbar.style.backdropFilter = 'blur(10px)';
                    navbar.style.webkitBackdropFilter = 'blur(10px)';
                    navbar.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    // 4. Animated Counters (Intersection Observer)
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalValue = parseInt(target.getAttribute('data-target'));
                    let currentValue = 0;
                    const duration = 2000; // 2 seconds
                    const increment = finalValue / (duration / 16); // 60fps

                    const updateCounter = () => {
                        currentValue += increment;
                        if (currentValue < finalValue) {
                            target.innerText = Math.ceil(currentValue) + '+';
                            requestAnimationFrame(updateCounter);
                        } else {
                            target.innerText = finalValue + '+';
                        }
                    };

                    updateCounter();
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    // 5. FAQ Accordion Logic
    const faqHeaders = document.querySelectorAll('.faq-header');
    faqHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            
            // Close all others
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current
            item.classList.toggle('active');
        });
    });

    // 6. Contact Form Validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();
            const formMessage = document.getElementById('formMessage');
            
            // Basic validation
            if (!name || !email || !phone || !message) {
                formMessage.textContent = 'Please fill out all required fields.';
                formMessage.className = 'form-message error';
                return;
            }
            
            // Email validation regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                formMessage.textContent = 'Please enter a valid email address.';
                formMessage.className = 'form-message error';
                return;
            }
            
            // Phone validation (minimum 10 digits)
            const phoneRegex = /^[\d\s\+\-\(\)]{10,}$/;
            if (!phoneRegex.test(phone)) {
                formMessage.textContent = 'Please enter a valid phone number.';
                formMessage.className = 'form-message error';
                return;
            }
            
            // Success simulation
            formMessage.textContent = 'Thank you! Your inquiry has been submitted successfully. Our team will contact you shortly.';
            formMessage.className = 'form-message success';
            contactForm.reset();
            
            // Remove success message after 5 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
                setTimeout(() => formMessage.style.display = '', 100);
                formMessage.className = 'form-message';
            }, 5000);
        });
    }
});
