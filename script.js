// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const hamburger = mobileMenuBtn.querySelector('.hamburger');

    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
        
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
            hamburger.style.transform = 'rotate(0)';
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
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            header.style.backdropFilter = 'blur(12px)';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(8px)';
        }
    });

    // CTA button animation
    const ctaButtons = document.querySelectorAll('a[href^="tel:"]');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => this.style.transform = 'scale(1)', 150);
        });
    });

    // Fade-in animations using Intersection Observer
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    const animatedElements = document.querySelectorAll('.feature-card, .service-card, .review-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Trackable clicks (analytics)
    const trackableElements = document.querySelectorAll('a[href^="tel:"], a[href*="maps.google"]');
    trackableElements.forEach(el => {
        el.addEventListener('click', () => console.log('User interaction:', el.href));
    });

    // Input focus styling
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => input.parentNode.classList.add('focused'));
        input.addEventListener('blur', () => {
            if (!input.value) input.parentNode.classList.remove('focused');
        });
    });

    // Service card hover effects
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-8px)');
        card.addEventListener('mouseleave', () => card.style.transform = 'translateY(-4px)');
    });

    // Preload hero image
    const heroImage = new Image();
    heroImage.src = 'assets/hero-abs-bg.jpg';

    // Initialize EmailJS
    (function() {
        emailjs.init("xgc5kttSxxpgzvyMC");
    })();

    // Quote Modal setup
    const quoteModal = document.getElementById('quoteModal');
    const openQuoteBtns = document.querySelectorAll('.openQuoteModal');
    const closeQuoteBtn = quoteModal.querySelector('.close');
    const quoteForm = document.getElementById('quoteForm');
    const formMessage = document.getElementById('formMessage');

    openQuoteBtns.forEach(btn => btn.addEventListener('click', () => {
        quoteModal.style.display = 'block';
    }));
    closeQuoteBtn.addEventListener('click', () => quoteModal.style.display = 'none');
    window.addEventListener('click', e => {
        if (e.target === quoteModal) quoteModal.style.display = 'none';
    });

    // === UPLOADCARE + EMAILJS INTEGRATION ===
    const form = document.getElementById('quoteForm');

    // Array to store uploaded file URLs
    let uploadedFiles = [];

    // Open Uploadcare dialog when button is clicked (robust handling)
    document.getElementById('openUploader').addEventListener('click', async () => {
        if (typeof uploadcare === 'undefined') {
            console.error('Uploadcare widget is not loaded.');
            formMessage.style.color = 'red';
            formMessage.textContent = 'Uploader Not Available. Please Refresh The Page.';
            return;
        }

        try {
            const dialog = uploadcare.openDialog(null, { multiple: true, clearable: true });

            // Wrap the dialog callbacks in a Promise so we can use async/await
            const result = await new Promise((resolve, reject) => {
                dialog.done(resolve).fail(reject);
            });

            // result may be a single file, an array, or a file group. Normalize to URLs.
            const urls = [];

            const extractFromFileLike = async (item) => {
                if (!item) return;
                // If item already has cdnUrl, use it
                if (item.cdnUrl) {
                    urls.push(item.cdnUrl);
                    return;
                }
                // If item has a promise() method (Uploadcare file/fileGroup), await it
                if (typeof item.promise === 'function') {
                    try {
                        const info = await item.promise();
                        // info might be an object with files array or a single file info
                        if (Array.isArray(info)) {
                            info.forEach(f => f && f.cdnUrl && urls.push(f.cdnUrl));
                        } else if (info && Array.isArray(info.files)) {
                            info.files.forEach(f => f && f.cdnUrl && urls.push(f.cdnUrl));
                        } else if (info && info.cdnUrl) {
                            urls.push(info.cdnUrl);
                        } else {
                            console.warn('Unexpected uploadcare info shape:', info);
                        }
                    } catch (e) {
                        console.warn('Error resolving uploadcare item promise', e);
                    }
                }
            };

            if (Array.isArray(result)) {
                for (const item of result) await extractFromFileLike(item);
            } else {
                await extractFromFileLike(result);
            }

            if (urls.length === 0) {
                console.warn('No file URLs returned from Uploadcare dialog', result);
                formMessage.style.color = 'red';
                formMessage.textContent = 'No Images Uploaded. Please Try Again.';
                uploadedFiles = [];
                return;
            }

            uploadedFiles = urls;
            console.log('Uploaded files:', uploadedFiles);

        } catch (err) {
            console.error('Upload failed', err);
            formMessage.style.color = 'red';
            formMessage.textContent = 'Upload Failed. Please Try Again.';
        }
    });

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        formMessage.style.color = 'white';
        formMessage.textContent = 'Sending...';

        const imageLinksText = uploadedFiles.length ? uploadedFiles.join('\n') : 'No Images Uploaded.';

        // Prepare template params - must match your EmailJS template variables
        const templateParams = {
            user_name: form.user_name.value,
            user_email: form.user_email.value,
            user_phone: form.user_phone.value,
            message: form.message.value,
            image_links: imageLinksText
        };

        // Log the params so you can verify values in the browser console
        console.log('Sending EmailJS with params:', templateParams);

        // Send email using EmailJS
        emailjs.send("service_l28lpnd", "template_u2rwwj9", templateParams)
        .then(() => {
            formMessage.style.color = 'green';
            formMessage.textContent = 'Request Sent Successfully';
            form.reset();
            uploadedFiles = [];
        })
        .catch(err => {
            console.error('EmailJS send error:', err);
            formMessage.style.color = 'red';
            formMessage.textContent = 'Oops! Something Went Wrong. Try Again.';
        });
    });

    // Call Modal setup
    const callModal = document.getElementById('callModal');
    const openCallBtns = document.querySelectorAll('#openCallModal');
    const closeCallBtn = callModal.querySelector('.close');
    const callNowBtn = document.getElementById('callNowBtn');

    openCallBtns.forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            callModal.style.display = 'block';
            callNowBtn.href = btn.href;
            callNowBtn.style.display = 'inline-block';
        });
    });

    closeCallBtn.addEventListener('click', () => callModal.style.display = 'none');
    window.addEventListener('click', e => {
        if (e.target === callModal) callModal.style.display = 'none';
    });

    callNowBtn.addEventListener('click', function() {
        window.location.href = this.href;
    });
});

// === BEFORE & AFTER SLIDESHOW (Auto mode) ===
let slideIndex = 0;
autoSlides();

function autoSlides() {
    const slides = document.getElementsByClassName("slide");
    const dots = document.getElementsByClassName("dot");

    for (let i = 0; i < slides.length; i++) slides[i].style.display = "none";
    slideIndex++;
    if (slideIndex > slides.length) slideIndex = 1;

    for (let i = 0; i < dots.length; i++) dots[i].classList.remove("active");

    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].classList.add("active");

    setTimeout(autoSlides, 6000);
}
