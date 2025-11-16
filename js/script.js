// Images array
const images = [
    '705036368.jpg', '705036408.jpg', '705036411.jpg', '705036415.jpg',
    '705036422.jpg', '705036430.jpg', '705036436.jpg', '705036439.jpg',
    '705036443.jpg', '705036446.jpg', '705036452.jpg', '705036454.jpg',
    '705036459.jpg', '705036463.jpg', '705036467.jpg', '705036470.jpg',
    '705036474.jpg', '705036477.jpg', '705036482.jpg', '705036487.jpg',
    '705036491.jpg', '705036494.jpg', '705036496.jpg', '705036502.jpg',
    '705036506.jpg', '705036509.jpg', '705036516.jpg', '705036521.jpg',
    '705036524.jpg'
];

let currentImageIndex = 0;
let currentLang = 'hr';

// Initialize gallery
function initGallery() {
    const galleryGrid = document.getElementById('galleryGrid');

    images.forEach((img, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `
            <img src="images/${img}" alt="Apartment Debussy - Image ${index + 1}" loading="lazy">
            <div class="gallery-overlay">
                <span>&#128065;</span>
            </div>
        `;
        galleryItem.onclick = () => openLightbox(index);
        galleryGrid.appendChild(galleryItem);
    });
}

// Lightbox functions
function openLightbox(index) {
    currentImageIndex = index;
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');

    img.src = `images/${images[currentImageIndex]}`;
    lightbox.classList.add('active');

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function changeImage(direction) {
    currentImageIndex += direction;

    if (currentImageIndex >= images.length) {
        currentImageIndex = 0;
    } else if (currentImageIndex < 0) {
        currentImageIndex = images.length - 1;
    }

    const img = document.getElementById('lightbox-img');
    img.src = `images/${images[currentImageIndex]}`;
}

// Language switching
function changeLanguage(lang) {
    currentLang = lang;

    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-lang="${lang}"]`).classList.add('active');

    // Update all translatable elements
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    // Update HTML lang attribute
    document.documentElement.lang = lang;
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', () => {
    // Initialize gallery
    initGallery();

    // Language switcher
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            changeLanguage(btn.getAttribute('data-lang'));
        });
    });

    // Lightbox controls
    document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    document.querySelector('.lightbox-prev').addEventListener('click', () => changeImage(-1));
    document.querySelector('.lightbox-next').addEventListener('click', () => changeImage(1));

    // Close lightbox on background click
    document.getElementById('lightbox').addEventListener('click', (e) => {
        if (e.target.id === 'lightbox') {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const lightbox = document.getElementById('lightbox');
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') changeImage(-1);
            if (e.key === 'ArrowRight') changeImage(1);
        }
    });

    // Smooth scroll for anchor links
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

    // Navbar scroll effect
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        }

        lastScroll = currentScroll;
    });

    // Intersection Observer for fade-in animations
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

    // Observe elements for animation
    document.querySelectorAll('.highlight-card, .amenity-item, .gallery-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Prevent right-click on images (optional)
document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});
