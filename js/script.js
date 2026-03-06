// ==================== Page Load Animations ====================
document.addEventListener("DOMContentLoaded", function () {
    console.log("✨ CareerConnect - Professional Job Portal Loaded");
    
    // Initialize scroll animations
    observeElements();
    
    // Add click ripple effect
    addRippleEffect();
    
    // Header scroll effect
    addHeaderScrollEffect();
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Add scroll parallax effect to hero
    addParallaxEffect();
    
    // Initialize button interactions
    initializeHeaderButtons();
});

// ==================== Header Scroll Effect ====================
function addHeaderScrollEffect() {
    const headerMain = document.querySelector('.header-main');
    let lastScrollPos = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50 && headerMain) {
            headerMain.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.15)';
            headerMain.style.background = 'rgba(255, 255, 255, 0.98)';
        } else if (headerMain) {
            headerMain.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
            headerMain.style.background = 'white';
        }
        
        lastScrollPos = currentScroll;
    });
}

// ==================== Header Button Interactions ====================
function initializeHeaderButtons() {
    const signInBtn = document.querySelector('.login-btn');
    const signUpBtn = document.querySelector('.signup-btn');
    
    if (signInBtn) {
        signInBtn.addEventListener('click', function() {
            showNotification("📝 Sign In feature coming soon!", "info");
        });
    }
    
    if (signUpBtn) {
        signUpBtn.addEventListener('click', function() {
            showNotification("🚀 Get Started - Redirecting to registration...", "success");
            setTimeout(() => {
                document.querySelector('a[href="apply.html"]')?.click();
            }, 1500);
        });
    }
}

// ==================== Scroll Animation Observer ====================
function observeElements() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards and boxes
    document.querySelectorAll('.feature-box, .job-card, form').forEach(el => {
        observer.observe(el);
    });
}

// ==================== Ripple Effect ====================
function addRippleEffect() {
    document.querySelectorAll('.btn, button, .nav-link').forEach(element => {
        element.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') return;
            
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.className = 'ripple-effect';
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// ==================== Parallax Effect ====================
function addParallaxEffect() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = heroSection.querySelectorAll('.hero h2, .hero p');
        
        parallaxElements.forEach((el, index) => {
            const speed = 0.5 + (index * 0.1);
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// ==================== Form Validation ====================
const form = document.querySelector("form");

if (form) {
    // Real-time validation for all field types
    form.querySelectorAll("input[type='text'], input[type='email'], input[type='tel'], textarea, select").forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('change', validateField);
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField.call(this);
            }
        });
    });

    // File upload styling
    form.querySelectorAll('input[type="file"]').forEach(fileInput => {
        const fileUploadContainer = fileInput.closest('.file-upload');
        if (fileUploadContainer) {
            fileUploadContainer.addEventListener('dragover', (e) => {
                e.preventDefault();
                fileUploadContainer.style.borderColor = 'var(--primary)';
                fileUploadContainer.style.background = 'rgba(37, 99, 235, 0.15)';
            });

            fileUploadContainer.addEventListener('dragleave', (e) => {
                e.preventDefault();
                fileUploadContainer.style.borderColor = 'var(--primary)';
                fileUploadContainer.style.background = 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)';
            });

            fileUploadContainer.addEventListener('drop', (e) => {
                e.preventDefault();
                fileInput.files = e.dataTransfer.files;
                fileUploadContainer.style.borderColor = 'var(--secondary)';
                validateField.call(fileInput);
            });
        }
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        
        const allInputs = form.querySelectorAll("input[type='text'], input[type='email'], input[type='tel'], input[type='file'], textarea, select");
        let isValid = true;
        let formData = {};

        allInputs.forEach(input => {
            if (!validateField.call(input)) {
                isValid = false;
            } else {
                formData[input.name || input.placeholder] = input.value;
            }
        });

        if (!isValid) {
            showNotification("⚠️ Please fill all required fields correctly!", "error");
            return;
        }

        // Show success with animation
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.classList.add('loading');
        submitBtn.textContent = '✓ Submitted!';
        
        showNotification("✅ Application Submitted Successfully! We'll get back to you soon.", "success");
        
        // Reset form
        setTimeout(() => {
            form.reset();
            submitBtn.classList.remove('loading');
            submitBtn.textContent = originalText;
            allInputs.forEach(input => input.classList.remove('error'));
        }, 2000);
    });
}

// ==================== Field Validation ====================
function validateField() {
    const value = this.value.trim();
    const type = this.type;
    const fieldName = this.name || this.placeholder || 'field';
    let isValid = true;

    if (!this.hasAttribute('required') && value === "") {
        this.classList.remove('error');
        return true;
    }

    if (this.hasAttribute('required') && value === "") {
        isValid = false;
    } else if (type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value) || value === "";
    } else if (type === 'tel') {
        // Phone validation - accepts 10-15 digits with optional +, -, space, ()
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        isValid = phoneRegex.test(value) || value === "";
    } else if (type === 'url') {
        // URL validation
        try {
            new URL(value);
            isValid = true;
        } catch {
            isValid = value === "";
        }
    } else if (type === 'file') {
        // File validation - check if file is selected for required fields
        isValid = this.files.length > 0;
        if (!isValid) {
            showNotification("⚠️ Please upload a file", "error");
        }
    } else if (type === 'text' && value.length < 2  && value !== "") {
        isValid = false;
    } else if (this.tagName === 'SELECT' && this.hasAttribute('required')) {
        isValid = value !== "";
    }

    // Apply visual feedback
    if (!isValid) {
        this.classList.add('error');
        if (type !== 'file') {
            this.style.borderColor = "#ef4444";
            this.style.boxShadow = "0 0 0 3px rgba(239, 68, 68, 0.1)";
        }
    } else {
        this.classList.remove('error');
        if (type !== 'file') {
            this.style.borderColor = "#10b981";
            this.style.boxShadow = "0 0 0 3px rgba(16, 185, 129, 0.1)";
        }
    }

    return isValid;
}

// ==================== Notification System ====================
function showNotification(message, type) {
    const notification = document.createElement("div");
    const bgColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';
    const icon = type === 'success' ? '✓' : type === 'error' ? '⚠️' : 'ℹ️';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${bgColor};
        color: white;
        border-radius: 10px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        z-index: 2000;
        animation: slideInNotification 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        font-weight: 500;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        font-size: 0.95rem;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Add animation if not already added
    if (!document.querySelector('style[data-notification-animation]')) {
        const style = document.createElement('style');
        style.setAttribute('data-notification-animation', 'true');
        style.textContent = `
            @keyframes slideInNotification {
                from {
                    transform: translateX(400px) scale(0.8);
                    opacity: 0;
                }
                to {
                    transform: translateX(0) scale(1);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutNotification {
                from {
                    transform: translateX(0) scale(1);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px) scale(0.8);
                    opacity: 0;
                }
            }
            
            .ripple-effect {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            }
            
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            input.error, textarea.error {
                animation: shake 0.4s ease-in-out;
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remove notification with animation
    setTimeout(() => {
        notification.style.animation = 'slideOutNotification 0.4s ease-in forwards';
        setTimeout(() => notification.remove(), 400);
    }, 4000);
}

// ==================== Mouse Follow Animation ====================
if (document.querySelector('.hero::before')) {
    document.addEventListener('mousemove', function(e) {
        const moveX = (e.clientX / window.innerWidth) * 20 - 10;
        const moveY = (e.clientY / window.innerHeight) * 20 - 10;
        
        const heroBefore = document.querySelector('.hero::before');
        if (heroBefore) {
            document.documentElement.style.setProperty('--mouse-x', moveX + 'px');
            document.documentElement.style.setProperty('--mouse-y', moveY + 'px');
        }
    });
}