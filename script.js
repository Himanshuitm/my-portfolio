// Terminal Portfolio JavaScript

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const typedText = document.querySelector('.typed-text');
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

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

// Console welcome message
console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║  🚀 Welcome to Himanshu Saini's Terminal Portfolio!          ║
║                                                               ║
║  Thanks for checking out the console!                        ║
║  Try the Konami Code: ↑↑↓↓←→←→BA                            ║
║                                                               ║
║  Let's build something amazing together! 💻                  ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`);
