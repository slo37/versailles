/**
 * VERSAILLES - Main JavaScript
 * Interactions: Sliders, Scroll, FAQ, etc.
 */

// ===================================
// 1. SCROLL TO TOP BUTTON
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const scrollTopBtn = document.getElementById('scrollTop');
    
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Show/hide scroll top button
    window.addEventListener('scroll', function() {
        if (scrollTopBtn) {
            if (window.pageYOffset > 300) {
                scrollTopBtn.style.opacity = '1';
                scrollTopBtn.style.pointerEvents = 'auto';
            } else {
                scrollTopBtn.style.opacity = '0';
                scrollTopBtn.style.pointerEvents = 'none';
            }
        }
    });
});

// ===================================
// 2. NAVBAR SCROLL EFFECT
// ===================================
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    }
});

// ===================================
// 3. SLIDER FUNCTIONALITY
// ===================================
class Slider {
    constructor(containerSelector, trackSelector, prevBtnSelector, nextBtnSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) return;
        
        this.track = this.container.querySelector(trackSelector);
        this.prevBtn = this.container.querySelector(prevBtnSelector);
        this.nextBtn = this.container.querySelector(nextBtnSelector);
        this.items = this.track.querySelectorAll('.slider-item, .event-card, .memory-card, .partner-logo');
        
        this.currentIndex = 0;
        this.itemsToShow = this.getItemsToShow();
        
        this.init();
    }
    
    getItemsToShow() {
        const width = window.innerWidth;
        if (width < 768) return 1;
        if (width < 992) return 2;
        return this.items[0]?.classList.contains('partner-logo') ? 3 : 4;
    }
    
    init() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }
        
        window.addEventListener('resize', () => {
            this.itemsToShow = this.getItemsToShow();
            this.updateSlider();
        });
        
        this.updateSlider();
    }
    
    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateSlider();
        }
    }
    
    next() {
        const maxIndex = Math.max(0, this.items.length - this.itemsToShow);
        if (this.currentIndex < maxIndex) {
            this.currentIndex++;
            this.updateSlider();
        }
    }
    
    updateSlider() {
        const itemWidth = this.items[0]?.offsetWidth || 0;
        const gap = 20;
        const offset = -(this.currentIndex * (itemWidth + gap));
        this.track.style.transform = `translateX(${offset}px)`;
    }
}

// Initialize all sliders
document.addEventListener('DOMContentLoaded', function() {
    // Photo slider
    new Slider('.photo-slider', '.slider-track', '.slider-prev', '.slider-next');
    
    // Events slider
    new Slider('.events-slider', '.events-track', '.slider-prev', '.slider-next');
    
    // Memories slider
    new Slider('.memories-slider', '.memories-track', '.slider-prev', '.slider-next');
    
    // Partners slider
    new Slider('.partners-slider', '.partners-track', '.slider-prev', '.slider-next');
    
    // Testimonial slider (if exists)
    new Slider('.testimonial-slider', '.testimonial-container', '.slider-prev', '.slider-next');
});

// ===================================
// 4. FAQ ACCORDION
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const isActive = this.classList.contains('active');
            
            // Close all other FAQs
            faqQuestions.forEach(q => {
                q.classList.remove('active');
                const answer = q.nextElementSibling;
                if (answer && answer.classList.contains('faq-answer')) {
                    answer.style.maxHeight = '0';
                }
            });
            
            // Toggle current FAQ
            if (!isActive) {
                this.classList.add('active');
                const answer = this.nextElementSibling;
                if (answer && answer.classList.contains('faq-answer')) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            }
        });
    });
});

// ===================================
// 5. GALLERY LIGHTBOX (Simple)
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item, .gallery-grid-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img) {
                // Create lightbox
                const lightbox = document.createElement('div');
                lightbox.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    cursor: pointer;
                `;
                
                const lightboxImg = document.createElement('img');
                lightboxImg.src = img.src;
                lightboxImg.style.cssText = `
                    max-width: 90%;
                    max-height: 90%;
                    object-fit: contain;
                `;
                
                lightbox.appendChild(lightboxImg);
                document.body.appendChild(lightbox);
                
                // Close on click
                lightbox.addEventListener('click', function() {
                    document.body.removeChild(lightbox);
                });
            }
        });
    });
});

// ===================================
// 6. FORM VALIDATION
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // Basic validation
            if (!data.nom || !data.prenom || !data.email || !data.message) {
                alert('Veuillez remplir tous les champs obligatoires.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                alert('Veuillez entrer une adresse email valide.');
                return;
            }
            
            // Success message
            alert('Merci pour votre message ! Nous vous contacterons bientôt.');
            this.reset();
        });
    }
});

// ===================================
// 7. SMOOTH SCROLL FOR ANCHOR LINKS
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});

// ===================================
// 8. ACTIVE NAV LINK ON SCROLL
// ===================================
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// ===================================
// 9. MOBILE MENU CLOSE ON CLICK
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 992 && navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    });
});

// ===================================
// 10. ANIMATION ON SCROLL (Optional)
// ===================================
function animateOnScroll() {
    const elements = document.querySelectorAll('.service-card, .stat-item, .testimonial-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initialize animation styles
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.service-card, .stat-item, .testimonial-card');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Initial check
});

// ===================================
// 11. VIDEO PLAY FUNCTIONALITY
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const videoPlayBtns = document.querySelectorAll('.video-play-btn');
    
    videoPlayBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const videoItem = this.closest('.video-item');
            const videoSrc = videoItem.dataset.videoSrc;
            
            if (videoSrc) {
                // Create video modal
                const modal = document.createElement('div');
                modal.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    cursor: pointer;
                `;
                
                const video = document.createElement('video');
                video.src = videoSrc;
                video.controls = true;
                video.autoplay = true;
                video.style.cssText = `
                    max-width: 90%;
                    max-height: 90%;
                `;
                
                modal.appendChild(video);
                document.body.appendChild(modal);
                
                modal.addEventListener('click', function(e) {
                    if (e.target === modal) {
                        document.body.removeChild(modal);
                    }
                });
            }
        });
    });
});

console.log('Versailles - JavaScript loaded successfully!');
