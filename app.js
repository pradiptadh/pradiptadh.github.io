// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const themeToggle = document.getElementById('theme-toggle');
const backToTop = document.getElementById('back-to-top');
const contactForm = document.getElementById('contact-form');
const header = document.getElementById('header');
const navLinks = document.querySelectorAll('.nav__link');
const filterBtns = document.querySelectorAll('.filter__btn');
const projectCards = document.querySelectorAll('.project__card');

// Email integration elements
const setupModal = document.getElementById('setup-modal');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const setupGuideBtn = document.getElementById('setup-guide-btn');
const notification = document.getElementById('notification');
const notificationClose = document.getElementById('notification-close');
const emailMethodInputs = document.querySelectorAll('input[name="email-method"]');
const submitBtn = document.getElementById('submit-btn');

// Email configuration placeholders
const EMAIL_CONFIG = {
    web3forms: {
        endpoint: 'https://api.web3forms.com/submit',
        accessKey: '84d656eb-56fa-4558-bc05-420f1f93e554' // Replace with your actual access key
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeNavigation();
    initializeScrollEffects();
    initializeProjectFilters();
    initializeContactForm();
    initializeBackToTop();
    initializeEmailSetup();
    initializeNotifications();
    initializeAnimations();
    
    // Initialize EmailJS if selected
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAIL_CONFIG.emailjs.publicKey);
    }
});

// Theme Management
function initializeTheme() {
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    // Apply theme immediately
    document.documentElement.setAttribute('data-color-scheme', initialTheme);
    updateThemeIcon(initialTheme);

    // Add click listener
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-color-scheme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Apply new theme
    document.documentElement.setAttribute('data-color-scheme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Add smooth transition animation
    document.documentElement.style.transition = 'color 0.3s ease, background-color 0.3s ease';
    setTimeout(() => {
        document.documentElement.style.transition = '';
    }, 300);
}

function updateThemeIcon(theme) {
    if (themeToggle) {
        const icon = themeToggle.querySelector('.theme-toggle__icon');
        if (icon) {
            icon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }
}

// Navigation Management
function initializeNavigation() {
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            closeMobileMenu();
            
            const targetId = link.getAttribute('href');
            if (!targetId || targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = targetElement.offsetTop - headerHeight - 10;
                
                // Smooth scroll
                window.scrollTo({
                    top: Math.max(0, targetPosition),
                    behavior: 'smooth'
                });
                
                // Update active link after scroll
                setTimeout(() => {
                    updateActiveNavLink();
                }, 100);
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu && navToggle && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    if (navToggle && navMenu) {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('show');
    }
}

function closeMobileMenu() {
    if (navToggle && navMenu) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('show');
    }
}

// Scroll Effects
function initializeScrollEffects() {
    window.addEventListener('scroll', debounce(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Header background change on scroll
        if (header) {
            const currentTheme = document.documentElement.getAttribute('data-color-scheme') || 'light';
            if (scrollTop > 100) {
                if (currentTheme === 'dark') {
                    header.style.background = 'rgba(31, 33, 33, 0.95)';
                } else {
                    header.style.background = 'rgba(252, 252, 249, 0.95)';
                }
                header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)';
            } else {
                if (currentTheme === 'dark') {
                    header.style.background = 'rgba(31, 33, 33, 0.95)';
                } else {
                    header.style.background = 'rgba(252, 252, 249, 0.95)';
                }
                header.style.boxShadow = 'none';
            }
        }
        
        // Update active navigation link
        updateActiveNavLink();
        
        // Show/hide back to top button
        if (backToTop) {
            if (scrollTop > 500) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        }
    }, 10));
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('.section, .hero');
    const scrollPosition = window.scrollY + 150;
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    // If we're at the very top, highlight "home"
    if (window.scrollY < 100) {
        currentSection = 'home';
    }
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Project Filtering
function initializeProjectFilters() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // Update active filter button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter projects
            filterProjects(filter);
        });
    });
}

function filterProjects(filter) {
    projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        
        // Reset styles first
        card.classList.remove('filtered-out');
        card.style.display = '';
        card.style.opacity = '';
        card.style.transform = '';
        
        if (filter === 'all') {
            // Show all projects
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, 50);
        } else {
            // Check if project matches filter
            const shouldShow = categories.toLowerCase().includes(filter.toLowerCase()) ||
                             card.textContent.toLowerCase().includes(filter.toLowerCase());
            
            if (shouldShow) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 50);
            } else {
                card.classList.add('filtered-out');
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        }
    });
}

// Contact Form Management
function initializeContactForm() {
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Real-time validation
    const inputs = contactForm.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
    
    // Email method change listener
    emailMethodInputs.forEach(input => {
        input.addEventListener('change', updateFormAction);
    });
    
    // Initialize with default method
    updateFormAction();
}

function updateFormAction() {
    const selectedMethodInput = document.querySelector('input[name="email-method"]:checked');
    if (!selectedMethodInput || !contactForm) return;
    
    const selectedMethod = selectedMethodInput.value;
    
    // Reset form attributes
    contactForm.removeAttribute('action');
    contactForm.removeAttribute('method');
    
    switch (selectedMethod) {
        case 'web3forms':
            contactForm.action = EMAIL_CONFIG.web3forms.endpoint;
            contactForm.method = 'POST';
            break;
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!contactForm) return;
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    const selectedMethodInput = document.querySelector('input[name="email-method"]:checked');
    const selectedMethod = selectedMethodInput ? selectedMethodInput.value : 'web3forms';
    
    // Validate all fields
    let isValid = true;
    const fields = ['name', 'email', 'subject', 'message'];
    
    fields.forEach(field => {
        const input = document.getElementById(field);
        if (input && !validateField(input)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('Please fix the errors in the form', 'error');
        return;
    }
    
    // Check if configuration is set up
    if (!isMethodConfigured(selectedMethod)) {
        const methodNames = {
            web3forms: 'Web3Forms'
        };
        showNotification(`${methodNames[selectedMethod]} is not configured yet. Please check the setup guide by clicking the "📧 Email Setup Guide" button.`, 'warning');
        return;
    }
    
    // Show loading state
    setSubmitLoading(true);
    
    try {
        await submitForm(data, selectedMethod);
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        contactForm.reset();
    } catch (error) {
        console.error('Form submission error:', error);
        showNotification('Failed to send message. Please try again or contact me directly at pradiptaharyadi@gmail.com', 'error');
    } finally {
        setSubmitLoading(false);
    }
}

function isMethodConfigured(method) {
    switch (method) {
        case 'web3forms':
            return EMAIL_CONFIG.web3forms.accessKey !== 'YOUR_WEB3FORMS_ACCESS_KEY';
        default:
            return false;
    }
}

async function submitForm(data, method) {
    switch (method) {
        case 'web3forms':
            return await submitWeb3Forms(data);
        default:
            throw new Error('Unknown email method');
    }
}

// Web3Forms submission
async function submitWeb3Forms(data) {
    const formData = new FormData();
    
    // Add all form fields
    Object.keys(data).forEach(key => {
        if (key !== 'botcheck') { // Skip honeypot field
            formData.append(key, data[key]);
        }
    });
    
    // Add access key
    formData.append('access_key', EMAIL_CONFIG.web3forms.accessKey);
    
    const response = await fetch(EMAIL_CONFIG.web3forms.endpoint, {
        method: 'POST',
        body: formData
    });
    
    const result = await response.json();
    
    if (!result.success) {
        throw new Error(result.message || 'Failed to send email');
    }
    
    return result;
}

function setSubmitLoading(loading) {
    if (!submitBtn) return;
    
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');
    
    if (loading) {
        if (btnText) btnText.textContent = 'Sending...';
        if (btnSpinner) btnSpinner.classList.remove('hidden');
        submitBtn.disabled = true;
    } else {
        if (btnText) btnText.textContent = 'Send Message';
        if (btnSpinner) btnSpinner.classList.add('hidden');
        submitBtn.disabled = false;
    }
}

function validateField(input) {
    if (!input) return true;
    
    const value = input.value.trim();
    const fieldName = input.name;
    
    clearFieldError(input);
    
    // Required field validation
    if (!value) {
        showFieldError(input, `${capitalize(fieldName)} is required`);
        return false;
    }
    
    // Email validation
    if (fieldName === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(input, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Message length validation
    if (fieldName === 'message' && value.length < 10) {
        showFieldError(input, 'Message should be at least 10 characters long');
        return false;
    }
    
    // Name validation
    if (fieldName === 'name' && value.length < 2) {
        showFieldError(input, 'Name should be at least 2 characters long');
        return false;
    }
    
    // Subject validation
    if (fieldName === 'subject' && value.length < 3) {
        showFieldError(input, 'Subject should be at least 3 characters long');
        return false;
    }
    
    return true;
}

function showFieldError(input, message) {
    const errorElement = document.getElementById(`${input.name}-error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    if (input) {
        input.style.borderColor = 'var(--color-error)';
    }
}

function clearFieldError(input) {
    if (!input) return;
    
    const errorElement = document.getElementById(`${input.name}-error`);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
    input.style.borderColor = '';
}

// Email Setup Modal
function initializeEmailSetup() {
    if (setupGuideBtn) {
        setupGuideBtn.addEventListener('click', openSetupModal);
    }
    
    if (modalClose) {
        modalClose.addEventListener('click', closeSetupModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeSetupModal);
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && setupModal && !setupModal.classList.contains('hidden')) {
            closeSetupModal();
        }
    });
}

function openSetupModal() {
    if (setupModal) {
        setupModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Force display
        setTimeout(() => {
            setupModal.style.opacity = '1';
        }, 10);
    }
}

function closeSetupModal() {
    if (setupModal) {
        setupModal.classList.add('hidden');
        document.body.style.overflow = '';
        setupModal.style.opacity = '';
    }
}

// Notification System
function initializeNotifications() {
    if (notificationClose) {
        notificationClose.addEventListener('click', hideNotification);
    }
}

function showNotification(message, type = 'info') {
    if (!notification) return;
    
    const icon = notification.querySelector('.notification__icon');
    const messageEl = notification.querySelector('.notification__message');
    
    // Set message
    if (messageEl) {
        messageEl.textContent = message;
    }
    
    // Set icon and type
    notification.className = `notification ${type} show`;
    
    if (icon) {
        switch (type) {
            case 'success':
                icon.textContent = '✅';
                break;
            case 'error':
                icon.textContent = '❌';
                break;
            case 'warning':
                icon.textContent = '⚠️';
                break;
            case 'info':
            default:
                icon.textContent = 'ℹ️';
                break;
        }
    }
    
    // Auto-hide after 6 seconds
    setTimeout(() => {
        hideNotification();
    }, 6000);
}

function hideNotification() {
    if (!notification) return;
    
    notification.classList.remove('show');
    notification.classList.add('hidden');
    
    setTimeout(() => {
        notification.classList.remove('hidden');
    }, 300);
}

// Back to Top Button
function initializeBackToTop() {
    if (!backToTop) return;
    
    // Scroll to top functionality
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize Animations
function initializeAnimations() {
    // Initialize intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe sections for animations
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Animate stats counters
    animateStatsCounters();
    
    // Initialize typing animation for hero
    initializeTypingAnimation();
}

// Animate Stats Counters
function animateStatsCounters() {
    const statNumbers = document.querySelectorAll('.stat__number');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                const numericValue = parseInt(finalValue.replace(/\D/g, ''), 10);
                const suffix = finalValue.replace(/\d/g, '');
                
                animateCounter(target, 0, numericValue, suffix, 2000);
                statsObserver.unobserve(target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
}

function animateCounter(element, start, end, suffix, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 16);
}

// Typing Animation for Hero Section
function initializeTypingAnimation() {
    const heroTitle = document.querySelector('.hero__title');
    if (!heroTitle) return;
    
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.borderRight = '2px solid var(--color-primary)';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        } else {
            // Remove cursor after typing is complete
            setTimeout(() => {
                heroTitle.style.borderRight = 'none';
            }, 500);
        }
    };
    
    // Start typing animation after a short delay
    setTimeout(typeWriter, 1000);
}

// Utility Functions
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Performance optimization: Debounce function
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

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('show')) {
        closeMobileMenu();
    }
    
    // Navigate through filter buttons with arrow keys
    if (document.activeElement && document.activeElement.classList.contains('filter__btn')) {
        const currentIndex = Array.from(filterBtns).indexOf(document.activeElement);
        
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
            e.preventDefault();
            filterBtns[currentIndex - 1].focus();
        } else if (e.key === 'ArrowRight' && currentIndex < filterBtns.length - 1) {
            e.preventDefault();
            filterBtns[currentIndex + 1].focus();
        }
    }
    
    // Navigate through email method options with arrow keys
    if (document.activeElement && document.activeElement.name === 'email-method') {
        const currentIndex = Array.from(emailMethodInputs).indexOf(document.activeElement);
        
        if (e.key === 'ArrowDown' && currentIndex < emailMethodInputs.length - 1) {
            e.preventDefault();
            emailMethodInputs[currentIndex + 1].focus();
            emailMethodInputs[currentIndex + 1].checked = true;
            updateFormAction();
        } else if (e.key === 'ArrowUp' && currentIndex > 0) {
            e.preventDefault();
            emailMethodInputs[currentIndex - 1].focus();
            emailMethodInputs[currentIndex - 1].checked = true;
            updateFormAction();
        }
    }
});

// Handle resize events
window.addEventListener('resize', debounce(() => {
    // Close mobile menu on desktop view
    if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('show')) {
        closeMobileMenu();
    }
    
    // Close modal on very small screens
    if (window.innerWidth < 480 && setupModal && !setupModal.classList.contains('hidden')) {
        closeSetupModal();
    }
}, 100));


// Development helper: Log configuration status
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🔧 Email Integration Configuration Status:');
    console.log('Web3Forms:', isMethodConfigured('web3forms') ? '✅ Configured' : '❌ Not configured');
    console.log('EmailJS:', isMethodConfigured('emailjs') ? '✅ Configured' : '❌ Not configured');
    console.log('FormSubmit:', isMethodConfigured('formsubmit') ? '✅ Configured' : '❌ Not configured');
    console.log('💡 Check the setup guide for configuration instructions.');
}

// Ensure smooth scrolling fallback
document.documentElement.style.scrollBehavior = 'smooth';

window.addEventListener('load', () => {
    
    // Add welcome message
    setTimeout(() => {
        showNotification('Welcome to Pradipta\'s Portfolio! Feel free to explore and get in touch.', 'info');
    }, 2000);
});

// Portfolio-specific features
function initializePortfolioFeatures() {
    // Add click handlers for project cards
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            // Could add project detail modal here in the future
            const projectTitle = card.querySelector('.project__title')?.textContent;
            if (projectTitle) {
                showNotification(`Clicked on: ${projectTitle}. More details coming soon!`, 'info');
            }
        });
    });
    
    // Add animation to skill tags
    const skillTags = document.querySelectorAll('.skill__tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            tag.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        tag.addEventListener('mouseleave', () => {
            tag.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Initialize portfolio features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializePortfolioFeatures, 500);
});

// Add some Easter eggs for fun
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        showNotification('🎉 Konami Code activated! You found the easter egg!', 'success');
        konamiCode = [];
        
        // Add some fun animation
        document.body.style.animation = 'rainbow 2s linear';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 2000);
    }
});

// Add rainbow animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        25% { filter: hue-rotate(90deg); }
        50% { filter: hue-rotate(180deg); }
        75% { filter: hue-rotate(270deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);