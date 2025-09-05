// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const hamburger = mobileMenuBtn.querySelector('.hamburger');

    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
        
        // Animate hamburger
        if (mobileMenu.classList.contains('active')) {
            hamburger.style.transform = 'rotate(45deg)';
            hamburger.style.backgroundColor = 'transparent';
        } else {
            hamburger.style.transform = 'rotate(0deg)';
            hamburger.style.backgroundColor = 'var(--foreground)';
        }
    });

    // Close mobile menu when clicking on a link
    const mobileLinks = document.querySelectorAll('.nav-link-mobile');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            hamburger.style.transform = 'rotate(0deg)';
            hamburger.style.backgroundColor = 'var(--foreground)';
        });
    });

    // Smooth scrolling for all navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add scroll effect to header
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            header.style.backdropFilter = 'blur(12px)';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(8px)';
        }
        
        lastScrollY = currentScrollY;
    });

    // Add loading animation to CTA buttons
    const ctaButtons = document.querySelectorAll('a[href^="tel:"]');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Add a subtle animation when phone links are clicked
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections and cards for animations
    const animatedElements = document.querySelectorAll('.feature-card, .service-card, .review-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add click tracking for analytics (if needed)
    const trackableElements = document.querySelectorAll('a[href^="tel:"], a[href*="maps.google"]');
    trackableElements.forEach(element => {
        element.addEventListener('click', function() {
            // You can add analytics tracking here
            console.log('User interaction:', this.href);
        });
    });

    // Handle form focus states (if you add a contact form later)
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentNode.classList.remove('focused');
            }
        });
    });

    // Add hover effects for service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-4px)';
        });
    });

    // Preload critical images
    const heroImage = new Image();
    heroImage.src = 'src/assets/hero-auto-body-shop.jpg';

    // Add error handling for phone links
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Check if device supports tel: links
            if (!('ontouchstart' in window) && !/Mobi|Android/i.test(navigator.userAgent)) {
                // Desktop - show alert with phone number
                e.preventDefault();
                const phoneNumber = this.href.replace('tel:', '');
                alert(`Please call us at: ${phoneNumber}`);
            }
        });
    });
});