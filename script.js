// Terminal Portfolio JavaScript

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const typedText = document.querySelector('.typed-text');
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

// Terminal typing effect
const commands = [
    'whoami',
    'cat profile.txt',
    'ls -la skills/',
    'git status',
    'npm start portfolio'
];

let commandIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeCommand() {
    const currentCommand = commands[commandIndex];
    
    if (isDeleting) {
        typedText.textContent = currentCommand.substring(0, charIndex - 1);
        charIndex--;
        
        if (charIndex === 0) {
            isDeleting = false;
            commandIndex = (commandIndex + 1) % commands.length;
        }
    } else {
        typedText.textContent = currentCommand.substring(0, charIndex + 1);
        charIndex++;
        
        if (charIndex === currentCommand.length) {
            isDeleting = true;
            setTimeout(typeCommand, 2000); // Pause before deleting
            return;
        }
    }
    
    setTimeout(typeCommand, isDeleting ? 50 : 100);
}

// Start typing effect
setTimeout(typeCommand, 1000);

// Theme Toggle
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    body.classList.toggle('light-theme');
    
    // Save theme preference
    const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
});

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.classList.remove('dark-theme', 'light-theme');
    body.classList.add(savedTheme + '-theme');
} else {
    body.classList.add('dark-theme'); // Default theme
}

// Mobile Menu Toggle
mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Close menu when clicking outside
    document.addEventListener('click', closeMobileMenuOnOutsideClick);
});

function closeMobileMenuOnOutsideClick(event) {
    if (!mobileMenuToggle.contains(event.target) && !navMenu.contains(event.target)) {
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.removeEventListener('click', closeMobileMenuOnOutsideClick);
    }
}

// Close mobile menu when clicking on nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.removeEventListener('click', closeMobileMenuOnOutsideClick);
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Parallax scrolling effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Skill bars animation
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const width = skillBar.getAttribute('data-width');
                skillBar.style.width = width;
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Initialize skill bars animation
animateSkillBars();

// Contact form handling
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const submitBtn = contactForm.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    
    // Show loading state
    btnText.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('contact.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
        } else {
            showMessage(result.message || 'Something went wrong. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Network error. Please check your connection and try again.', 'error');
    } finally {
        // Reset button state
        btnText.textContent = 'Send Message';
        submitBtn.disabled = false;
    }
});

// Show form message
function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    
    // Hide message after 5 seconds
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
}

// Active navigation link highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        
        if (window.pageYOffset >= sectionTop && 
            window.pageYOffset < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Update active nav link on scroll
window.addEventListener('scroll', updateActiveNavLink);

// Terminal window interactions
document.querySelectorAll('.terminal-window').forEach(window => {
    window.addEventListener('mouseenter', () => {
        window.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    window.addEventListener('mouseleave', () => {
        window.style.transform = 'translateY(0) scale(1)';
    });
});

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });
});

// Easter egg: Konami code
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
        showEasterEgg();
        konamiCode = [];
    }
});

function showEasterEgg() {
    const easterEgg = document.createElement('div');
    easterEgg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--bg-terminal);
        border: 2px solid var(--text-primary);
        border-radius: 8px;
        padding: 30px;
        z-index: 9999;
        text-align: center;
        box-shadow: 0 20px 60px var(--shadow-color);
    `;
    
    easterEgg.innerHTML = `
        <h3 style="color: var(--text-primary); margin-bottom: 20px;">🎉 Easter Egg Found!</h3>
        <p style="color: var(--text-secondary); margin-bottom: 20px;">
            You found the secret developer mode!<br>
            <code style="color: var(--text-accent);">console.log("Hire me! 🚀")</code>
        </p>
        <button onclick="this.parentElement.remove()" style="
            background: var(--text-primary);
            color: var(--bg-terminal);
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-family: var(--font-mono);
        ">Close</button>
    `;
    
    document.body.appendChild(easterEgg);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (easterEgg.parentElement) {
            easterEgg.remove();
        }
    }, 10000);
}

// Performance optimization: Debounce scroll events
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

// Apply debouncing to scroll events
const debouncedParallax = debounce(() => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
}, 10);

const debouncedNavUpdate = debounce(updateActiveNavLink, 10);

// Replace original scroll listeners with debounced versions
window.removeEventListener('scroll', updateActiveNavLink);
window.addEventListener('scroll', debouncedParallax);
window.addEventListener('scroll', debouncedNavUpdate);

// CV Download functionality
function downloadCV() {
    const btn = document.querySelector('.cv-download-btn');
    const btnText = btn.querySelector('.btn-text');
    const originalText = btnText.textContent;
    
    // Show downloading state
    btnText.textContent = 'Downloading...';
    btn.disabled = true;
    
    // Simulate download process with terminal-style animation
    const downloadSteps = [
        'Initializing download...',
        'Connecting to server...',
        'Downloading CV...',
        'Download complete!'
    ];
    
    let stepIndex = 0;
    const downloadInterval = setInterval(() => {
        if (stepIndex < downloadSteps.length) {
            btnText.textContent = downloadSteps[stepIndex];
            stepIndex++;
        } else {
            clearInterval(downloadInterval);
            
            // Create download link
            const link = document.createElement('a');
            link.href = 'assets/Himanshu_Saini_CV.txt';
            link.download = 'Himanshu_Saini_CV.txt';
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Reset button
            setTimeout(() => {
                btnText.textContent = originalText;
                btn.disabled = false;
                showMessage('CV downloaded successfully! 📄', 'success');
            }, 500);
        }
    }, 800);
}

// Enhanced parallax scrolling with terminal opening effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    const terminalEffects = document.querySelector('.terminal-effects-bg');
    
    // Main parallax effect
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
    
    // Terminal opening effect
    if (terminalEffects) {
        const scrollProgress = Math.min(scrolled / window.innerHeight, 1);
        const scale = 0.5 + (scrollProgress * 0.5);
        const opacity = 0.1 + (scrollProgress * 0.2);
        const rotation = scrollProgress * 5;
        
        terminalEffects.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
        terminalEffects.style.opacity = opacity;
    }
    
    // Add downloading effect to sections as they come into view
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && !section.classList.contains('loaded')) {
            section.classList.add('loaded');
            simulateTerminalLoading(section);
        }
    });
});

// Simulate terminal loading effect for sections
function simulateTerminalLoading(section) {
    const sectionHeader = section.querySelector('.section-header h2');
    if (sectionHeader && !sectionHeader.dataset.animated) {
        sectionHeader.dataset.animated = 'true';
        const originalText = sectionHeader.textContent;
        sectionHeader.textContent = '';
        
        // Typing effect for section headers
        let charIndex = 0;
        const typingInterval = setInterval(() => {
            if (charIndex < originalText.length) {
                sectionHeader.textContent += originalText[charIndex];
                charIndex++;
            } else {
                clearInterval(typingInterval);
                // Add completion indicator
                setTimeout(() => {
                    const cursor = document.createElement('span');
                    cursor.textContent = ' ✓';
                    cursor.style.color = 'var(--text-primary)';
                    cursor.style.animation = 'blink 1s infinite';
                    sectionHeader.appendChild(cursor);
                    
                    setTimeout(() => {
                        cursor.remove();
                    }, 2000);
                }, 300);
            }
        }, 50);
    }
}

// Console welcome message
console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║  🚀 Welcome to Himanshu Saini's Terminal Portfolio!          ║
║                                                               ║
║  Thanks for checking out the console!                        ║
║  Try the Konami Code: ↑↑↓↓←→←→BA                            ║
║  Download CV button: Click to get my resume!                 ║
║                                                               ║
║  Let's build something amazing together! 💻                  ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`);
