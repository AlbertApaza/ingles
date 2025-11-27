// ============================================
// ROYAL CUTS - JAVASCRIPT FUNCTIONALITY
// ============================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // NAVIGATION FUNCTIONALITY
    // ============================================
    
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
        const icon = this.querySelector('i');
        if (mobileMenu.classList.contains('hidden')) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        } else {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
    
    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ============================================
    // COUNTER ANIMATION FOR STATS
    // ============================================
    
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16); // 60fps
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    }
    
    // Intersection Observer for counter animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-count'));
                if (target) {
                    animateCounter(entry.target, target);
                    statsObserver.unobserve(entry.target);
                }
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('[data-count]').forEach(stat => {
        statsObserver.observe(stat);
    });
    
    // ============================================
    // SCROLL ANIMATIONS
    // ============================================
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Apply animation to cards
    document.querySelectorAll('.challenge-card, .service-card, .testimonial-card, .gallery-item').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        animateOnScroll.observe(card);
    });
    
    // ============================================
    // FORM VALIDATION AND SUBMISSION
    // ============================================
    
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = new FormData(contactForm);
            const firstName = contactForm.querySelector('input[type="text"]').value;
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="loading"></span> Processing...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Show success message
                submitBtn.innerHTML = '<i class="fas fa-check-circle mr-2"></i> Booked Successfully!';
                submitBtn.classList.remove('btn-primary');
                submitBtn.classList.add('bg-green-500');
                
                // Show alert
                showNotification('Success!', `Thanks ${firstName}! Your battle has been scheduled. Check your email for confirmation.`, 'success');
                
                // Reset form after 2 seconds
                setTimeout(() => {
                    contactForm.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.classList.add('btn-primary');
                    submitBtn.classList.remove('bg-green-500');
                }, 2000);
            }, 1500);
        });
    }
    
    // ============================================
    // NOTIFICATION SYSTEM
    // ============================================
    
    function showNotification(title, message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-24 right-4 z-50 max-w-md p-6 rounded-2xl shadow-2xl transform translate-x-0 transition-all duration-500 ${
            type === 'success' ? 'bg-gradient-to-r from-green-500 to-green-600' :
            type === 'error' ? 'bg-gradient-to-r from-red-500 to-red-600' :
            'bg-gradient-to-r from-blue-500 to-blue-600'
        }`;
        
        notification.innerHTML = `
            <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                    <i class="fas ${
                        type === 'success' ? 'fa-check-circle' :
                        type === 'error' ? 'fa-exclamation-circle' :
                        'fa-info-circle'
                    } text-white text-2xl"></i>
                </div>
                <div class="flex-1">
                    <h4 class="text-white font-bold text-lg mb-1">${title}</h4>
                    <p class="text-white/90 text-sm">${message}</p>
                </div>
                <button class="flex-shrink-0 text-white/80 hover:text-white transition-colors" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Slide in animation
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }
    
    // ============================================
    // BUTTON CLICK HANDLERS
    // ============================================
    
    // Accept Challenge buttons
    document.querySelectorAll('.btn-primary').forEach(btn => {
        if (btn.textContent.includes('Accept Challenge') || btn.textContent.includes('Book')) {
            btn.addEventListener('click', function(e) {
                if (this.type !== 'submit') {
                    e.preventDefault();
                    // Scroll to contact section
                    document.querySelector('#contact').scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Focus on form
                    setTimeout(() => {
                        const firstInput = document.querySelector('#contact-form input');
                        if (firstInput) firstInput.focus();
                    }, 800);
                }
            });
        }
    });
    
    // View Services button
    document.querySelectorAll('.btn-secondary').forEach(btn => {
        if (btn.textContent.includes('View Services')) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                document.querySelector('#services').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        }
    });
    
    // ============================================
    // GALLERY FUNCTIONALITY
    // ============================================
    
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            // Create modal for image viewing
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm';
            modal.innerHTML = `
                <div class="relative max-w-6xl w-full mx-4">
                    <button class="absolute -top-12 right-0 text-white text-3xl hover:text-royal-400 transition-colors">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-4 border border-royal-500/30">
                        ${this.innerHTML}
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Close modal
            modal.addEventListener('click', function(e) {
                if (e.target === modal || e.target.closest('button')) {
                    modal.style.opacity = '0';
                    setTimeout(() => modal.remove(), 300);
                }
            });
            
            // Animate in
            modal.style.opacity = '0';
            setTimeout(() => modal.style.opacity = '1', 10);
            modal.style.transition = 'opacity 0.3s ease';
        });
    });
    
    // ============================================
    // PARALLAX EFFECT
    // ============================================
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.absolute.inset-0');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
    
    // ============================================
    // CURSOR TRAIL EFFECT (Optional Enhancement)
    // ============================================
    
    let cursorTrail = [];
    const trailLength = 10;
    
    document.addEventListener('mousemove', function(e) {
        // Only on larger screens
        if (window.innerWidth < 768) return;
        
        cursorTrail.push({ x: e.clientX, y: e.clientY });
        
        if (cursorTrail.length > trailLength) {
            cursorTrail.shift();
        }
    });
    
    // ============================================
    // EASTER EGG: KONAMI CODE
    // ============================================
    
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.key);
        konamiCode.splice(-konamiSequence.length - 1, konamiCode.length - konamiSequence.length);
        
        if (konamiCode.join('').includes(konamiSequence.join(''))) {
            activateEasterEgg();
            konamiCode = [];
        }
    });
    
    function activateEasterEgg() {
        // Add fun animation or effect
        document.body.style.animation = 'pulse-slow 2s ease-in-out';
        showNotification(
            '🎮 KONAMI CODE ACTIVATED! 🎮',
            'You found the secret! All challengers today get a special discount!',
            'success'
        );
        
        // Create confetti effect
        createConfetti();
    }
    
    // ============================================
    // CONFETTI EFFECT
    // ============================================
    
    function createConfetti() {
        const colors = ['#0ea5e9', '#7c3aed', '#f59e0b', '#10b981', '#ef4444'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.position = 'fixed';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.top = '-10px';
                confetti.style.width = '10px';
                confetti.style.height = '10px';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.opacity = '1';
                confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
                confetti.style.zIndex = '9999';
                confetti.style.pointerEvents = 'none';
                confetti.style.transition = 'all 3s ease-out';
                
                document.body.appendChild(confetti);
                
                setTimeout(() => {
                    confetti.style.top = '100vh';
                    confetti.style.left = (parseFloat(confetti.style.left) + (Math.random() * 40 - 20)) + '%';
                    confetti.style.opacity = '0';
                    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
                }, 10);
                
                setTimeout(() => confetti.remove(), 3000);
            }, i * 30);
        }
    }
    
    // ============================================
    // LAZY LOADING IMAGES (when added)
    // ============================================
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
    
    // ============================================
    // BATTLE SIMULATOR (Fun Feature)
    // ============================================
    
    function simulateBattle() {
        const outcomes = [
            { result: 'win', message: 'Victory! You earned a FREE haircut!' },
            { result: 'lose', message: 'Defeat! Time to pay double... but you\'ll look amazing!' },
            { result: 'draw', message: 'It\'s a draw! Regular price applies.' }
        ];
        
        const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
        return randomOutcome;
    }
    
    // ============================================
    // THEME TOGGLE (Hidden Feature)
    // ============================================
    
    let clickCount = 0;
    const logo = document.querySelector('.fa-crown');
    
    if (logo) {
        logo.addEventListener('click', function() {
            clickCount++;
            
            if (clickCount === 5) {
                showNotification(
                    '👑 Royal Status Unlocked!',
                    'You\'ve discovered the secret! Screenshot this for 10% off your next visit.',
                    'success'
                );
                clickCount = 0;
                createConfetti();
            }
        });
    }
    
    // ============================================
    // PERFORMANCE MONITORING
    // ============================================
    
    // Log page load time
    window.addEventListener('load', function() {
        const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
        console.log(`⚡ Page loaded in ${loadTime}ms`);
    });
    
    // ============================================
    // SERVICE WORKER REGISTRATION (Progressive Web App)
    // ============================================
    
    if ('serviceWorker' in navigator) {
        // Uncomment when service worker is created
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('Service Worker registered'))
        //     .catch(err => console.log('Service Worker registration failed'));
    }
    
    // ============================================
    // ACCESSIBILITY IMPROVEMENTS
    // ============================================
    
    // Trap focus in modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close any open modals
            document.querySelectorAll('.fixed.inset-0').forEach(modal => {
                modal.remove();
            });
        }
    });
    
    // ============================================
    // INIT MESSAGE
    // ============================================
    
    console.log('%c⚔️ ROYAL CUTS BARBERSHOP ⚔️', 'color: #0ea5e9; font-size: 24px; font-weight: bold;');
    console.log('%cWelcome, warrior! Ready to battle for your haircut?', 'color: #f59e0b; font-size: 14px;');
    console.log('%cTry the Konami Code for a surprise... 🎮', 'color: #7c3aed; font-size: 12px;');
    
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Generate random ID
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}
