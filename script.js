// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const navItems = document.querySelectorAll('.nav-link');

// Sticky Navbar & Scroll Spy
window.addEventListener('scroll', () => {
    // Add shadow/blur on scroll
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Active link highlighting
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = hamburger.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu when a link is clicked
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = hamburger.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// Smooth Scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 70, // Adjust for fixed navbar height
                behavior: 'smooth'
            });
        }
    });
});

// Scroll Reveal Animations
const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

function reveal() {
    const windowHeight = window.innerHeight;
    const elementVisible = 100;
    
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

// Attach scroll event for reveal
window.addEventListener('scroll', reveal);
// Trigger once on load to show elements initially in viewport
reveal();

// WhatsApp Integration
const whatsappBtn = document.getElementById('whatsapp-btn');

whatsappBtn.addEventListener('click', () => {
    const phoneNumber = '919730207552'; // Updated with official number
    
    const message = `Hello The Programmers Academy,

I would like to know more about your courses.

Please share details regarding:

• Placement-Oriented Programming
• Full Stack Mobile App Development

Including:
- Course Syllabus
- Fees
- Duration
- Batch Timings
- Upcoming Batches
- Placement Assistance

Thank you.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
});

// Form Validation & Submission
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        
        const nameInput = document.getElementById('name');
        const phoneInput = document.getElementById('phone');
        const emailInput = document.getElementById('email');
        const courseInput = document.getElementById('course');
        const messageInput = document.getElementById('message');
        
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phonePattern = /^\+?[\d\s-]{10,}$/;

        if (!nameInput.value.trim()) {
            showError(nameInput, 'Name is required');
            isValid = false;
        } else {
            removeError(nameInput);
        }

        if (!phoneInput.value.trim()) {
            showError(phoneInput, 'Phone number is required');
            isValid = false;
        } else if (!phonePattern.test(phoneInput.value.trim())) {
            showError(phoneInput, 'Please enter a valid phone number');
            isValid = false;
        } else {
            removeError(phoneInput);
        }

        if (!emailInput.value.trim()) {
            showError(emailInput, 'Email is required');
            isValid = false;
        } else if (!emailPattern.test(emailInput.value.trim())) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        } else {
            removeError(emailInput);
        }

        if (!courseInput.value) {
            showError(courseInput, 'Please select a course');
            isValid = false;
        } else {
            removeError(courseInput);
        }

        if (!messageInput.value.trim()) {
            showError(messageInput, 'Message is required');
            isValid = false;
        } else if (messageInput.value.trim().length < 10) {
            showError(messageInput, 'Message must be at least 10 characters');
            isValid = false;
        } else {
            removeError(messageInput);
        }

        if (isValid) {
            const name = nameInput.value.trim();
            const phone = phoneInput.value.trim();
            const email = emailInput.value.trim();
            const courseText = courseInput.options[courseInput.selectedIndex].text;
            const userMessage = messageInput.value.trim();
            
            const whatsappNumber = '919730207552';
            const textMessage = `Hello The Programmers Academy,

I have submitted an enquiry via your website form:

• *Name:* ${name}
• *Phone:* ${phone}
• *Email:* ${email}
• *Course Interested In:* ${courseText}
• *Message:* ${userMessage}`;

            const encodedMessage = encodeURIComponent(textMessage);
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            
            window.open(whatsappUrl, '_blank');
            
            const btn = contactForm.querySelector('button');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Redirected to WhatsApp!';
            btn.style.background = 'var(--whatsapp-color)';
            
            setTimeout(() => {
                contactForm.reset();
                btn.innerHTML = originalHTML;
                btn.style.background = '';
            }, 3500);
        }
    });

    document.querySelectorAll('#contact-form input, #contact-form select, #contact-form textarea').forEach(element => {
        element.addEventListener('input', () => {
            removeError(element);
        });
    });
}

function showError(input, message) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.add('has-error');
    const errorMsg = formGroup.querySelector('.error-msg');
    if (errorMsg) {
        errorMsg.textContent = message;
    }
}

function removeError(input) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.remove('has-error');
}
