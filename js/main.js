/**
 * main.js
 * Global application logic, premium 3D interactions, magnetic effects, page transitions, and animations.
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('TezTecch application initialized.');

    // ---------------------------------------------------------
    // 1. Dynamic Scroll Progress Bar
    // ---------------------------------------------------------
    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    document.body.appendChild(progress);

    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
            const percentage = (window.scrollY / totalHeight) * 100;
            progress.style.width = `${percentage}%`;
        }
    });

    // ---------------------------------------------------------
    // 2. Mobile Menu Toggle & Hamburger Animation
    // ---------------------------------------------------------
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            mobileBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }

    // ---------------------------------------------------------
    // 3. Active Page Highlighting
    // ---------------------------------------------------------
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

    // ---------------------------------------------------------
    // 4. Navbar Scroll Effect (Glassmorphic Blur Transformation)
    // ---------------------------------------------------------
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (lastScrollY > 50) {
                    navbar.style.boxShadow = 'var(--shadow-medium)';
                    navbar.style.background = 'rgba(255, 255, 255, 0.82)';
                    navbar.style.backdropFilter = 'blur(24px)';
                    navbar.style.webkitBackdropFilter = 'blur(24px)';
                    navbar.style.borderBottom = '1px solid rgba(255,255,255,0.8)';
                    navbar.style.padding = '0.75rem 0';
                } else {
                    navbar.style.boxShadow = 'none';
                    navbar.style.background = 'rgba(255, 255, 255, 0.01)';
                    navbar.style.backdropFilter = 'blur(10px)';
                    navbar.style.webkitBackdropFilter = 'blur(10px)';
                    navbar.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
                    navbar.style.padding = '1.25rem 0';
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    // ---------------------------------------------------------
    // 5. Counters with Dynamic Easing (Intersection Observer)
    // ---------------------------------------------------------
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalValue = parseInt(target.getAttribute('data-target'));
                    let currentValue = 0;
                    const duration = 2200; // Eased count-up speed
                    const startTime = performance.now();

                    const runCounter = (currentTime) => {
                        const elapsed = currentTime - startTime;
                        const progressRatio = Math.min(elapsed / duration, 1);
                        
                        // Ease Out Expo progress mapping
                        const easeOutRatio = progressRatio === 1 ? 1 : 1 - Math.pow(2, -10 * progressRatio);
                        currentValue = easeOutRatio * finalValue;

                        target.innerText = Math.ceil(currentValue) + '+';

                        if (progressRatio < 1) {
                            requestAnimationFrame(runCounter);
                        } else {
                            target.innerText = finalValue + '+';
                            target.classList.add('pulse-glow-highlight');
                        }
                    };

                    requestAnimationFrame(runCounter);
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.3 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    // ---------------------------------------------------------
    // 6. FAQ Accordion Logic
    // ---------------------------------------------------------
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

    // ---------------------------------------------------------
    // 7. Contact Form Validation and Micro-Interactions
    // ---------------------------------------------------------
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.btn-primary');
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();
            const formMessage = document.getElementById('formMessage');
            
            // Basic validation
            if (!name || !email || !phone || !message) {
                showFormError('Please fill out all required fields.');
                return;
            }
            
            // Email validation regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFormError('Please enter a valid email address.');
                return;
            }
            
            // Phone validation
            const phoneRegex = /^[\d\s\+\-\(\)]{10,}$/;
            if (!phoneRegex.test(phone)) {
                showFormError('Please enter a valid phone number.');
                return;
            }

            // Simulate Loading State on Submit Button
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.style.pointerEvents = 'none';
            submitBtn.innerHTML = '<span class="loading-spinner"></span> Sending...';

            setTimeout(() => {
                // Success simulation
                formMessage.innerHTML = `
                    <div class="success-alert">
                        <svg class="check-icon" viewBox="0 0 52 52"><circle class="check-circle" cx="26" cy="26" r="25" fill="none"/><path class="check-path" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>
                        <span>Thank you! Your message has been successfully received. We will respond shortly.</span>
                    </div>`;
                formMessage.className = 'form-message success active';
                contactForm.reset();
                submitBtn.style.pointerEvents = 'auto';
                submitBtn.innerHTML = originalBtnText;
                
                setTimeout(() => {
                    formMessage.classList.remove('active');
                }, 6000);
            }, 1500);

            function showFormError(msgText) {
                formMessage.textContent = msgText;
                formMessage.className = 'form-message error active';
                // Trigger shake visual response
                contactForm.classList.add('shake-validation');
                setTimeout(() => contactForm.classList.remove('shake-validation'), 500);
            }
        });
    }

    // ---------------------------------------------------------
    // 8. Dynamic 3D Card Tilt Interactions
    // ---------------------------------------------------------
    const tiltCards = document.querySelectorAll('.service-card, .founder-card, .contact-card, .timeline-item, .about-card');
    
    tiltCards.forEach(card => {
        // Create an inner shine reflection element dynamically
        const shine = document.createElement('div');
        shine.className = 'card-shine-glare';
        card.appendChild(shine);
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Map cursors relative to center to angle rotation limits
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Limit tilt angles (maximum 8 degrees for premium control)
            const rotateX = ((centerY - y) / centerY) * 6;
            const rotateY = ((x - centerX) / centerX) * 6;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            
            // Move reflection glow
            const percentageX = (x / rect.width) * 100;
            const percentageY = (y / rect.height) * 100;
            shine.style.background = `radial-gradient(circle at ${percentageX}% ${percentageY}%, rgba(253, 184, 19, 0.15), transparent 75%)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
            shine.style.background = 'transparent';
        });
    });

    // ---------------------------------------------------------
    // 9. Premium Magnetic Button Interaction
    // ---------------------------------------------------------
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-accent, .btn-glass');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - (rect.width / 2);
            const y = e.clientY - rect.top - (rect.height / 2);
            
            // Move element toward cursor (max 8px magnetic drag)
            btn.style.transform = `translate3d(${x * 0.35}px, ${y * 0.35}px, 0) scale(1.02)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate3d(0px, 0px, 0px) scale(1)';
        });
    });

    // ---------------------------------------------------------
    // 10. Elegant Page Transitions
    // ---------------------------------------------------------
    const transitionOverlay = document.createElement('div');
    transitionOverlay.className = 'page-transition-overlay';
    document.body.appendChild(transitionOverlay);

    // Fade out overlay on load
    window.addEventListener('pageshow', () => {
        transitionOverlay.classList.remove('active');
    });

    document.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        
        // Exclude external anchors, hashes, and blank addresses
        if (href && !href.startsWith('http') && !href.startsWith('#') && !link.getAttribute('target') && href.endsWith('.html')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                transitionOverlay.classList.add('active');
                
                setTimeout(() => {
                    window.location.href = href;
                }, 400); // Sync timing with CSS transition
            });
        }
    });
});
