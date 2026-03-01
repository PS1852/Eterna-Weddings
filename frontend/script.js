// --- Navigation & Mobile Menu ---
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const navbar = document.getElementById("navbar");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
}));

// Navbar Scroll Effect
window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

// --- Smooth Scroll Animation (Intersection Observer) ---
const scrollElements = document.querySelectorAll(".scroll-anim");

const elementInView = (el, dividend = 1) => {
    const elementTop = el.getBoundingClientRect().top;
    return (elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend);
};

const displayScrollElement = (element) => {
    element.classList.add("in-view");
};

const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
        if (elementInView(el, 1.1)) {
            displayScrollElement(el);
        }
    })
}

// Initial check
handleScrollAnimation();

window.addEventListener("scroll", () => {
    handleScrollAnimation();
});

// --- Testimonials Carousel ---
const track = document.querySelector('.carousel-track');
const slides = Array.from(track.children);
const nextButton = document.querySelector('.carousel-btn.next');
const prevButton = document.querySelector('.carousel-btn.prev');
const dotsNav = document.querySelector('.carousel-dots');

// Create dots
slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => moveToSlide(index));
    dotsNav.appendChild(dot);
});

const dots = Array.from(dotsNav.children);
let currentSlideIndex = 0;

const moveToSlide = (index) => {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    
    track.style.transform = 'translateX(-' + index * 100 + '%)';
    
    // Update classes
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlideIndex = index;
};

nextButton.addEventListener('click', () => moveToSlide(currentSlideIndex + 1));
prevButton.addEventListener('click', () => moveToSlide(currentSlideIndex - 1));

// Auto move
setInterval(() => {
    moveToSlide(currentSlideIndex + 1);
}, 6000);

// --- Form Submission Logic ---
const inquiryForm = document.getElementById('inquiryForm');
const formMessage = document.getElementById('formMessage');
const submitBtn = document.getElementById('submitBtn');

inquiryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    const formData = new FormData(inquiryForm);
    const data = Object.fromEntries(formData.entries());
    
    try {
        // Change URL if deployed
        const response = await fetch('http://127.0.0.1:8000/api/inquiry', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        
        if (response.ok) {
            formMessage.textContent = "Thank you! We have received your inquiry and will contact you shortly.";
            formMessage.className = "form-message success";
            inquiryForm.reset();
        } else {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('Error:', error);
        formMessage.textContent = "Oops! Something went wrong. Please try again later or contact us directly.";
        formMessage.className = "form-message error";
    } finally {
        submitBtn.textContent = 'Send Inquiry';
        submitBtn.disabled = false;
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
});
