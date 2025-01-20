// DOM Elements
const header = document.querySelector('header');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const form = document.querySelector('.join-form');
const cards = document.querySelectorAll('.about-card, .value-card');
const content = document.querySelector('.content');
const ambientBg = document.querySelector('.ambient-background');
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

// Card hover effect
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
});

// Mobile menu toggle
if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu after clicking a link
            menuToggle?.classList.remove('active');
            navLinks?.classList.remove('active');
        }
    });
});

// Header scroll behavior with smooth transition
let lastScroll = 0;
const scrollThreshold = 50;

function updateHeader() {
    const currentScroll = window.scrollY;
    
    if (currentScroll <= 0) {
        header.classList.remove('scrolled');
        header.style.background = 'rgba(3, 7, 18, 0.8)';
        return;
    }
    
    if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Adjust header background opacity based on scroll
    const opacity = Math.min(0.95, 0.8 + (currentScroll / 1000));
    header.style.background = `rgba(3, 7, 18, ${opacity})`;
    
    lastScroll = currentScroll;
}

window.addEventListener('scroll', updateHeader);

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Particle system
class Particle {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }
    
    draw() {
        ctx.fillStyle = `rgba(183, 148, 244, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const particles = Array(100).fill().map(() => new Particle());

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    requestAnimationFrame(animate);
}

animate();

// Enhanced ambient background effect
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

document.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth) * 100;
    targetY = (e.clientY / window.innerHeight) * 100;
});

function updateAmbientBackground() {
    mouseX += (targetX - mouseX) * 0.1;
    mouseY += (targetY - mouseY) * 0.1;
    
    ambientBg.style.background = `
        radial-gradient(circle at ${mouseX}% ${mouseY}%, 
            rgba(183, 148, 244, 0.15), 
            transparent 40%),
        radial-gradient(circle at ${100 - mouseX}% ${100 - mouseY}%, 
            rgba(183, 148, 244, 0.1), 
            transparent 40%)
    `;
    
    requestAnimationFrame(updateAmbientBackground);
}

updateAmbientBackground();

// Enhanced content parallax
document.addEventListener('mousemove', (e) => {
    const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
    
    content.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
});

// Intersection Observer for enhanced fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            // Add stagger effect to child elements
            const children = entry.target.children;
            Array.from(children).forEach((child, index) => {
                child.style.animationDelay = `${index * 0.1}s`;
                child.classList.add('fade-in');
            });
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements with stagger effect
document.querySelectorAll('.section, .about-card, .value-card').forEach(el => {
    observer.observe(el);
});

// Form handling with enhanced feedback
if (form) {
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('.submit-button');
        const originalText = submitBtn.innerHTML;
        
        // Disable form
        inputs.forEach(input => input.disabled = true);
        submitBtn.disabled = true;
        
        // Show loading state
        submitBtn.innerHTML = `
            <span class="loading-text">Processing</span>
            <span class="loading-dots">...</span>
        `;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success state
            submitBtn.innerHTML = `
                <span style="opacity: 0;">.</span>
                <span class="success-icon">✓</span>
                <span style="opacity: 0;">.</span>
            `;
            submitBtn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Your request has been received. We will contact you if selected.';
            form.appendChild(successMessage);
            
            // Reset form after delay
            setTimeout(() => {
                form.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                inputs.forEach(input => {
                    input.disabled = false;
                    input.parentElement.classList.remove('focused');
                });
                submitBtn.disabled = false;
                
                if (successMessage.parentNode) {
                    successMessage.remove();
                }
            }, 5000);
            
        } catch (error) {
            console.error('Error:', error);
            submitBtn.innerHTML = '× Error';
            submitBtn.style.background = 'linear-gradient(135deg, #EF4444, #DC2626)';
            
            // Reset button after delay
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                inputs.forEach(input => input.disabled = false);
                submitBtn.disabled = false;
            }, 3000);
        }
    });
} 