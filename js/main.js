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
        this.items = this.track.querySelectorAll('.slider-item, .event-card, .memory-card, .memory-item, .partner-logo, .testimonial-item');
        
        this.currentIndex = 0;
        this.itemsToShow = this.getItemsToShow();
        
        this.init();
    }
    
    getItemsToShow() {
        const width = window.innerWidth;
        // Testimonials always show 1 item at a time
        if (this.items[0]?.classList.contains('testimonial-item')) {
            return 1;
        }
        if (width < 768) return 1;
        if (width < 992) return 2;
        // Memory items and partner logos show 3 per view on desktop
        if (this.items[0]?.classList.contains('memory-item') || this.items[0]?.classList.contains('partner-logo')) {
            return 3;
        }
        return 4;
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
        // Use appropriate gap based on item type
        let gap = 20;
        if (this.items[0]?.classList.contains('memory-item')) gap = 30;
        if (this.items[0]?.classList.contains('testimonial-item')) gap = 40;
        const offset = -(this.currentIndex * (itemWidth + gap));
        this.track.style.transform = `translateX(${offset}px)`;
    }
}

// ===================================
// EVENTS SLIDER WITH ACTIVE CARD
// ===================================
class EventsSlider extends Slider {
    constructor(containerSelector, trackSelector, prevBtnSelector, nextBtnSelector) {
        super(containerSelector, trackSelector, prevBtnSelector, nextBtnSelector);
        this.visibleCards = this.getVisibleCards();
        // Start with center card (3rd card, index 2) as active
        // currentIndex = 0 means the track starts at position 0, and with 5 visible cards,
        // the card at index 2 will be in the center position
        this.currentIndex = 0;
    }
    
    getVisibleCards() {
        const width = window.innerWidth;
        if (width < 768) return 1;  // Mobile: 1 card visible, center = index 0
        if (width < 992) return 3;  // Tablet: 3 cards visible, center = index 1
        return 5; // Desktop: 5 cards visible, center = index 2 (3rd card)
    }
    
    init() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }
        
        window.addEventListener('resize', () => {
            this.visibleCards = this.getVisibleCards();
            this.updateSlider();
        });
        
        // Set initial state - start with 3rd card (index 2) as center
        // This means currentIndex should be 0 so that card at index 2 is in center position
        this.currentIndex = 0;
        
        // Apply initial styles immediately
        setTimeout(() => {
            this.updateSlider();
            this.updateButtonStates();
        }, 100);
        
        // Also apply on window load to ensure everything is ready
        window.addEventListener('load', () => {
            this.updateSlider();
            this.updateButtonStates();
        });
        
        // Log initial center card for debugging
        const centerPos = Math.floor(this.visibleCards / 2);
        const centerCard = this.currentIndex + centerPos;
        console.log(`Events Slider: Center card is at index ${centerCard} (card ${centerCard + 1})`);
    }
    
    prev() {
        // Allow going back to show first card in center
        const minIndex = -Math.floor(this.visibleCards / 2);
        if (this.currentIndex > minIndex) {
            this.currentIndex--;
            this.updateSlider();
            this.updateButtonStates();
        }
    }
    
    next() {
        // Allow scrolling to show last card in center
        const centerPosition = Math.floor(this.visibleCards / 2);
        const maxIndex = this.items.length - 1 - centerPosition;
        if (this.currentIndex < maxIndex) {
            this.currentIndex++;
            this.updateSlider();
            this.updateButtonStates();
        }
    }
    
    updateButtonStates() {
        const minIndex = -Math.floor(this.visibleCards / 2);
        const centerPosition = Math.floor(this.visibleCards / 2);
        const maxIndex = this.items.length - 1 - centerPosition;
        
        // Update button disabled states
        if (this.prevBtn) {
            this.prevBtn.style.opacity = this.currentIndex <= minIndex ? '0.5' : '1';
            this.prevBtn.style.cursor = this.currentIndex <= minIndex ? 'not-allowed' : 'pointer';
        }
        if (this.nextBtn) {
            this.nextBtn.style.setProperty('opacity', this.currentIndex >= maxIndex ? '0.5' : '1', 'important');
            this.nextBtn.style.setProperty('cursor', this.currentIndex >= maxIndex ? 'not-allowed' : 'pointer', 'important');
        }
    }
    
    updateSlider() {
        // Calculate the center position in viewport
        const centerPosition = Math.floor(this.visibleCards / 2);
        const centerCardIndex = this.currentIndex + centerPosition;
        
        // Apply active styles based on position relative to center
        this.items.forEach((item, index) => {
            const distanceFromCenter = Math.abs(index - centerCardIndex);
            
            if (distanceFromCenter === 0) {
                // Center card
                item.style.setProperty('transform', 'scale(1.05)', 'important');
                item.style.setProperty('opacity', '1', 'important');
                item.style.setProperty('z-index', '3', 'important');
                item.style.setProperty('box-shadow', '0 20px 60px rgba(0, 0, 0, 0.3)', 'important');
            } else if (distanceFromCenter === 1) {
                // Adjacent cards
                item.style.setProperty('transform', 'scale(0.9)', 'important');
                item.style.setProperty('opacity', '0.8', 'important');
                item.style.setProperty('z-index', '2', 'important');
                item.style.setProperty('box-shadow', '0 10px 40px rgba(0, 0, 0, 0.2)', 'important');
            } else if (distanceFromCenter === 2) {
                // Outer cards
                item.style.setProperty('transform', 'scale(0.8)', 'important');
                item.style.setProperty('opacity', '0.6', 'important');
                item.style.setProperty('z-index', '1', 'important');
                item.style.setProperty('box-shadow', '0 10px 40px rgba(0, 0, 0, 0.2)', 'important');
            } else {
                // Far cards
                item.style.setProperty('transform', 'scale(0.75)', 'important');
                item.style.setProperty('opacity', '0.4', 'important');
                item.style.setProperty('z-index', '0', 'important');
                item.style.setProperty('box-shadow', '0 5px 20px rgba(0, 0, 0, 0.15)', 'important');
            }
        });
        
        // Move the track - adjust offset to keep center card in view
        const itemWidth = this.items[0]?.offsetWidth || 0;
        const offset = -(this.currentIndex * itemWidth);
        this.track.style.transform = `translateX(${offset}px)`;
    }
}

// Initialize all sliders
document.addEventListener('DOMContentLoaded', function() {
    // Photo slider
    new Slider('.photo-slider', '.slider-track', '.slider-prev', '.slider-next');
    
    // Events slider with special active card handling
    new EventsSlider('.events-slider', '.events-track', '.slider-prev', '.slider-next');
    
    // Memories slider
    new Slider('.memories-slider-wrapper', '.memories-slider-track', '.memories-prev', '.memories-next');
    
    // Partners slider
    new Slider('.partners-slider', '.partners-track', '.slider-prev', '.slider-next');
    
    // Testimonials slider
    new Slider('.testimonials-slider-wrapper', '.testimonials-slider-track', '.testimonials-prev', '.testimonials-next');
    
    // About page gallery slider
    initAboutGallerySlider();
    
    // Story gallery slider (galeries page)
    initStoryGallerySlider();
});

// ===================================
// ABOUT PAGE GALLERY SLIDER
// ===================================
function initAboutGallerySlider() {
    const slider = document.querySelector('.about-gallery-slider');
    if (!slider) return;
    
    const track = slider.querySelector('.about-gallery-track');
    const prevBtn = slider.querySelector('.about-gallery-prev');
    const nextBtn = slider.querySelector('.about-gallery-next');
    const cards = track.querySelectorAll('.about-gallery-card');
    
    if (!track || !prevBtn || !nextBtn || cards.length === 0) return;
    
    let currentIndex = 0;
    
    function getCardsToShow() {
        const width = window.innerWidth;
        if (width < 768) return 1;
        return 2; // Show 2 cards on desktop/tablet
    }
    
    function updateSlider() {
        const cardsToShow = getCardsToShow();
        const cardWidth = cards[0].offsetWidth;
        const gap = 30; // Match CSS gap
        const offset = -(currentIndex * (cardWidth + gap));
        track.style.transform = `translateX(${offset}px)`;
        
        // Update button states
        const maxIndex = Math.max(0, cards.length - cardsToShow);
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        prevBtn.style.cursor = currentIndex === 0 ? 'not-allowed' : 'pointer';
        nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
        nextBtn.style.cursor = currentIndex >= maxIndex ? 'not-allowed' : 'pointer';
    }
    
    prevBtn.addEventListener('click', function() {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });
    
    nextBtn.addEventListener('click', function() {
        const cardsToShow = getCardsToShow();
        const maxIndex = Math.max(0, cards.length - cardsToShow);
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateSlider();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        updateSlider();
    });
    
    // Initial update
    updateSlider();
}

// ===================================
// STORY GALLERY SLIDER (GALERIES PAGE)
// ===================================
function initStoryGallerySlider() {
    const slider = document.querySelector('.story-gallery-slider');
    if (!slider) return;
    
    const track = slider.querySelector('.story-gallery-track');
    const slides = track.querySelectorAll('.story-gallery-slide');
    const dots = document.querySelectorAll('.story-gallery-dot');
    
    if (!track || slides.length === 0 || dots.length === 0) return;
    
    let currentSlide = 0;
    let autoSlideInterval;
    
    function goToSlide(slideIndex) {
        // Ensure slideIndex is within bounds
        if (slideIndex < 0) slideIndex = slides.length - 1;
        if (slideIndex >= slides.length) slideIndex = 0;
        
        currentSlide = slideIndex;
        
        // Move track
        const offset = -(currentSlide * 100);
        track.style.transform = `translateX(${offset}%)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }
    
    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }
    
    // Add click event to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            goToSlide(index);
            stopAutoSlide();
            startAutoSlide(); // Restart auto-slide after manual interaction
        });
    });
    
    // Pause auto-slide on hover
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);
    
    // Initialize
    goToSlide(0);
    startAutoSlide();
}

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
// 8. SET ACTIVE NAV LINK BASED ON CURRENT PAGE
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href');
        
        // Check if link matches current page
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') ||
            (currentPage === '/' && linkHref === 'index.html')) {
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
