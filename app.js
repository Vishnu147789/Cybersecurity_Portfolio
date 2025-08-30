// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const scrollTopBtn = document.getElementById('scroll-top');
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
const formError = document.getElementById('form-error');
const submitBtn = document.getElementById('submit-btn');
const downloadResumeBtn = document.getElementById('download-resume');

// Mobile Navigation Toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth Scrolling for Navigation Links - Fixed to prevent form interference
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll indicator in hero section
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', (e) => {
        e.preventDefault();
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
            const offsetTop = aboutSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
}

// Improved Active Navigation Link Highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 150; // Increased offset for better detection
    
    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop - 100 && scrollPos < sectionTop + sectionHeight - 100) {
            currentSection = sectionId;
        }
    });

    // Special case for top of page
    if (window.scrollY < 100) {
        currentSection = 'home';
    }

    // Update active nav link
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Scroll to Top Button
function toggleScrollTopBtn() {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.remove('hidden');
    } else {
        scrollTopBtn.classList.add('hidden');
    }
}

if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Add animation classes to elements
function addAnimationClasses() {
    // Add fade-in to section headers
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
        header.classList.add('fade-in');
    });

    // Add slide-in animations to cards and items
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach((category, index) => {
        category.classList.add(index % 2 === 0 ? 'slide-in-left' : 'slide-in-right');
    });

    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.animationDelay = `${index * 200}ms`;
    });

    const educationItems = document.querySelectorAll('.education-item');
    educationItems.forEach((item, index) => {
        item.classList.add('slide-in-left');
        item.style.animationDelay = `${index * 300}ms`;
    });

    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach((item, index) => {
        item.classList.add('slide-in-left');
        item.style.animationDelay = `${index * 150}ms`;
    });

    const aboutStats = document.querySelectorAll('.stat-item');
    aboutStats.forEach((stat, index) => {
        stat.classList.add('fade-in');
        stat.style.animationDelay = `${index * 200}ms`;
    });
}

// CRITICAL FIX: Contact Form Handling - Prevent navigation interference
if (contactForm) {
    // Prevent form field clicks from triggering navigation
    const formElements = contactForm.querySelectorAll('input, textarea, button');
    formElements.forEach(element => {
        element.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        element.addEventListener('focus', (e) => {
            e.stopPropagation();
        });
    });

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Hide any existing messages first
        hideAllMessages();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        // Basic validation
        if (!name || !email || !subject || !message) {
            showFormMessage('Please fill in all fields.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Show loading state
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');

        // Simulate form submission (2 second delay)
        setTimeout(() => {
            // Reset button first
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            
            // Show success message
            showFormMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
            
            // Reset form fields to empty
            contactForm.reset();
            
            // Auto-hide success message after 5 seconds
            setTimeout(() => {
                hideAllMessages();
            }, 5000);
            
        }, 2000);
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function hideAllMessages() {
    if (formSuccess) {
        formSuccess.style.display = 'none';
        formSuccess.classList.remove('show');
    }
    if (formError) {
        formError.style.display = 'none';
        formError.classList.remove('show');
    }
}

function showFormMessage(message, type) {
    // Hide all messages first
    hideAllMessages();
    
    if (type === 'success' && formSuccess) {
        // Update success message text
        const messageSpan = formSuccess.querySelector('span');
        if (messageSpan) {
            messageSpan.textContent = message;
        }
        
        // Show success message
        formSuccess.style.display = 'flex';
        // Use setTimeout to allow display change to take effect before adding show class
        setTimeout(() => {
            formSuccess.classList.add('show');
        }, 10);
        
    } else if (type === 'error' && formError) {
        // Update error message text
        const messageSpan = formError.querySelector('span');
        if (messageSpan) {
            messageSpan.textContent = message;
        }
        
        // Show error message
        formError.style.display = 'flex';
        // Use setTimeout to allow display change to take effect before adding show class
        setTimeout(() => {
            formError.classList.add('show');
        }, 10);
        
        // Auto-hide error message after 5 seconds
        setTimeout(() => {
            hideAllMessages();
        }, 5000);
    }
}

// Resume Download with proper feedback
if (downloadResumeBtn) {
    downloadResumeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const originalText = downloadResumeBtn.innerHTML;
        
        // Show preparing state
        downloadResumeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing...';
        downloadResumeBtn.disabled = true;
        
        // Simulate preparation time
        setTimeout(() => {
            // Show downloading state
            downloadResumeBtn.innerHTML = '<i class="fas fa-download"></i> Downloading...';
            
            setTimeout(() => {
                // Show success state
                downloadResumeBtn.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
                downloadResumeBtn.style.background = 'linear-gradient(45deg, #10b981, #059669)';
                
                // Create a mock download (in real app, this would download actual file)
                const mockDownloadData = `
Portfolio Resume - Konatham Vishnu Vardhan Reddy
=================================================

Contact Information:
Email: konathamvishnu2675@gmail.com
Phone: +91 7396623095
LinkedIn: linkedin.com/in/kvvreddy-cybersecurity
GitHub: github.com/5687462/Vishnu

Education:
- Computer Science Engineering (Cybersecurity) - Bharath Institute (Expected 2026)
- Intermediate (Science) - NRI Junior College, Hyderabad (2020-2022)
- 10th (SSC Board) - Triveni Talent School, Hyderabad (2020)

Skills: Burp Suite, Wireshark, Tenable Nessus, Kali Linux, Penetration Testing, Vulnerability Assessment

This is a mock resume download. In a real application, this would be a PDF file.
                `;
                
                // Create blob and download
                const blob = new Blob([mockDownloadData], { type: 'text/plain' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'Konatham_Vishnu_Vardhan_Reddy_Resume.txt';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    downloadResumeBtn.innerHTML = originalText;
                    downloadResumeBtn.disabled = false;
                    downloadResumeBtn.style.background = '';
                }, 3000);
            }, 1000);
        }, 1500);
    });
}

// Navbar Background on Scroll
function updateNavbarBackground() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 15, 0.98)';
            navbar.style.backdropFilter = 'blur(15px)';
        } else {
            navbar.style.background = 'rgba(10, 10, 15, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    }
}

// FIXED: Hero Title Display - Remove typing effect, show name immediately
function initHeroTitle() {
    const heroTitle = document.querySelector('.hero-title .name-highlight');
    if (heroTitle) {
        // Ensure the full name is displayed immediately
        heroTitle.textContent = 'Konatham Vishnu Vardhan Reddy';
        heroTitle.style.opacity = '1';
        heroTitle.style.visibility = 'visible';
    }
}

// Skill Tags Hover Effect
function initSkillTagsEffect() {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            tag.style.transform = 'scale(1.05) rotate(2deg)';
        });
        
        tag.addEventListener('mouseleave', () => {
            tag.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// Project Cards Tilt Effect
function initProjectTiltEffect() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// Particle Background Effect (subtle)
function initParticleBackground() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.1';
    
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1
        };
    }
    
    function initParticles() {
        particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push(createParticle());
        }
    }
    
    function updateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = '#00d4ff';
            ctx.fill();
        });
        
        requestAnimationFrame(updateParticles);
    }
    
    resizeCanvas();
    initParticles();
    updateParticles();
    
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });
}

// Enhanced Scroll Event Listener with throttling for better performance
let ticking = false;

function handleScroll() {
    if (!ticking) {
        requestAnimationFrame(() => {
            updateActiveNavLink();
            toggleScrollTopBtn();
            updateNavbarBackground();
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', handleScroll);

// Window Load Event
window.addEventListener('load', () => {
    // CRITICAL: Initialize hero title first
    initHeroTitle();
    
    addAnimationClasses();
    initScrollAnimations();
    initSkillTagsEffect();
    initProjectTiltEffect();
    initParticleBackground();
    
    // Set initial states
    updateActiveNavLink();
    toggleScrollTopBtn();
    updateNavbarBackground();
    
    // Ensure form messages are hidden on load
    hideAllMessages();
});

// Window Resize Event
window.addEventListener('resize', () => {
    // Close mobile menu on resize
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Keyboard Navigation Support
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
    
    // Scroll to top with Home key
    if (e.key === 'Home' && e.ctrlKey) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // Scroll to bottom with End key
    if (e.key === 'End' && e.ctrlKey) {
        e.preventDefault();
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    }
});

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // CRITICAL: Initialize hero title immediately
    initHeroTitle();
    
    // Set initial active nav link
    updateActiveNavLink();
    
    // Initialize scroll top button state
    toggleScrollTopBtn();
    
    // Initialize navbar background
    updateNavbarBackground();
    
    // Ensure form messages are properly hidden
    hideAllMessages();
    
    console.log('Cybersecurity Portfolio loaded successfully!');
});