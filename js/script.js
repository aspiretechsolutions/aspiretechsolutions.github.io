/**
 * AspireTech Solutions - JavaScript
 * Freelance Portfolio Website
 */

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('AspireTech Solutions Website Initialized');
    
    // Initialize navigation immediately (critical for mobile menu)
    initializeNavigation();
    initializeSmoothScrolling();
    initializeScrollAnimations();
    initializeParallax();
    
    // Wait for config to load before initializing config-dependent features
    if (typeof initializeConfig === 'function') {
        initializeConfig().then(() => {
            initializeContactForm();
            console.log('Configuration loaded and applied');
        }).catch(err => {
            console.warn('Config loading failed:', err);
            initializeContactForm();
        });
    } else {
        initializeContactForm();
    }
});

// Navigation functionality
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.getElementById('header');

    // Mobile menu toggle
    if (hamburger && navMenu) {
        console.log('Mobile menu initialized');
        
        // Toggle menu function
        const toggleMenu = function(e) {
            e.preventDefault();
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        };
        
        // Add click and touch events
        hamburger.addEventListener('click', toggleMenu);
        hamburger.addEventListener('touchstart', function(e) {
            e.preventDefault();
            toggleMenu(e);
        }, { passive: false });

        // Close menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }

    // Header scroll behavior
    if (header) {
        let lastScrollTop = 0;
        const headerHeight = header.offsetHeight;

        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add/remove scrolled class
            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScrollTop = scrollTop;
        }, { passive: true });
    }

    // Active section highlighting
    highlightActiveSection();
}

// Highlight active section in navigation
function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.pageYOffset + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, { passive: true });
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    const animateElements = document.querySelectorAll(
        '.service-card, .benefit-card, .tech-card, .process-step, .contact-method, .job-card, .industry-card, .stat-card, .expertise-card, .why-card'
    );
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add animate-in class styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// Contact form handling
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        // Web3Forms handles the submission
        form.addEventListener('submit', function(e) {
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value;

            // Basic validation
            if (!name || !email || !service || !message) {
                e.preventDefault();
                showMessage('Please fill in all required fields', 'error');
                return false;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                e.preventDefault();
                showMessage('Please enter a valid email address', 'error');
                return false;
            }

            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            // Form will be submitted by Web3Forms
            return true;
        });
    }
}

// Show message function
function showMessage(message, type) {
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    
    // Style the message
    Object.assign(messageDiv.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        backgroundColor: type === 'success' ? '#10b981' : '#ef4444',
        color: 'white',
        fontWeight: '600',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
        zIndex: '9999',
        animation: 'slideIn 0.3s ease',
        maxWidth: '400px'
    });

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Add to body
    document.body.appendChild(messageDiv);

    // Remove after 5 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            messageDiv.remove();
        }, 300);
    }, 5000);
}

// Add stagger animation delay to cards
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    const benefitCards = document.querySelectorAll('.benefit-card');
    benefitCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    const processSteps = document.querySelectorAll('.process-step');
    processSteps.forEach((step, index) => {
        step.style.transitionDelay = `${index * 0.15}s`;
    });

    const jobCards = document.querySelectorAll('.job-card');
    jobCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    const industryCards = document.querySelectorAll('.industry-card');
    industryCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    const expertiseCards = document.querySelectorAll('.expertise-card');
    expertiseCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.15}s`;
    });

    const whyCards = document.querySelectorAll('.why-card');
    whyCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // Initialize FAQ accordion
    initializeFAQ();
});

// FAQ Accordion functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach((item) => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other open items
            const isActive = item.classList.contains('active');
            
            faqItems.forEach((otherItem) => {
                otherItem.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
    
    console.log('✅ FAQ accordion initialized');
}

// Performance optimization - lazy load images if any are added
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Parallax effect
function initializeParallax() {
    const hero = document.querySelector('.hero');
    const heroBackground = document.querySelector('.hero-background');
    
    if (hero && heroBackground) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroHeight = hero.offsetHeight;
            
            if (scrolled < heroHeight) {
                heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        }, { passive: true });
    }

    // Add floating animation to sections
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                const scrollPercent = (window.innerHeight - rect.top) / window.innerHeight;
                const translateY = Math.max(0, (1 - scrollPercent) * 30);
                
                const decorativeElements = section.querySelectorAll('.service-icon, .benefit-icon');
                decorativeElements.forEach((el, index) => {
                    el.style.transform = `translateY(${translateY * (index % 2 === 0 ? 1 : -1)}px)`;
                });
            }
        });
    }, { passive: true });
}

// Add hover effect to navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link:not(.contact-btn)');
    
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Console log for debugging
console.log('%cAspireTech Solutions', 'color: #2563eb; font-size: 24px; font-weight: bold;');
console.log('%cWebsite & Android App Development', 'color: #6b7280; font-size: 14px;');
