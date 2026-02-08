// CampPointe Lake Texoma RV Park - Main JavaScript

// Load header from external file
async function loadHeader() {
    try {
        const response = await fetch('/header.html');
        const headerHTML = await response.text();
        document.getElementById('header-placeholder').innerHTML = headerHTML;
        
        // Set active class on current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
                link.classList.add('active');
            }
        });
        
        // Initialize mobile menu after header is loaded
        initializeMobileMenu();
    } catch (error) {
        console.error('Error loading header:', error);
    }
}

// Initialize mobile menu functionality
function initializeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!hamburger || !navMenu) return;
    
    // Toggle mobile menu
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Dropdown functionality
    const dropdownItems = document.querySelectorAll('.nav-item.dropdown');
    
    dropdownItems.forEach(dropdown => {
        const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
        
        // Mobile dropdown toggle
        dropdownToggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                
                // Close other open dropdowns
                dropdownItems.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('mobile-open');
                    }
                });
                
                dropdown.classList.toggle('mobile-open');
            }
        });
    });
    
    // Close mobile menu when clicking on non-dropdown links
    document.querySelectorAll('.nav-link:not(.dropdown-toggle)').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            dropdownItems.forEach(dropdown => {
                dropdown.classList.remove('mobile-open');
            });
        });
    });
    
    // Close mobile menu when clicking on dropdown links
    document.querySelectorAll('.dropdown-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            dropdownItems.forEach(dropdown => {
                dropdown.classList.remove('mobile-open');
            });
        });
    });
    
    // Close menu on window resize to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
            dropdownItems.forEach(dropdown => {
                dropdown.classList.remove('mobile-open');
            });
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && 
            navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            dropdownItems.forEach(dropdown => {
                dropdown.classList.remove('mobile-open');
            });
        }
    });
}

// Load header on page load
if (document.getElementById('header-placeholder')) {
    loadHeader();
}

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle (for pages without placeholder)
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }

    // Dropdown Menu Functionality
    const dropdownItems = document.querySelectorAll('.nav-item.dropdown');
    
    dropdownItems.forEach(dropdown => {
        const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
        
        // Mobile dropdown toggle
        dropdownToggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                
                // Close other open dropdowns
                dropdownItems.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('mobile-open');
                    }
                });
                
                dropdown.classList.toggle('mobile-open');
            }
        });
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            // Remove mobile-specific classes on desktop
            dropdownItems.forEach(dropdown => {
                dropdown.classList.remove('mobile-open');
            });
            if (navMenu) {
                navMenu.classList.remove('active');
            }
            if (hamburger) {
                hamburger.classList.remove('active');
            }
            document.body.style.overflow = '';
        }
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link:not(.dropdown-toggle)').forEach(n => n.addEventListener('click', () => {
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
        dropdownItems.forEach(dropdown => {
            dropdown.classList.remove('mobile-open');
        });
    }));

    // Close mobile menu when clicking on dropdown links
    document.querySelectorAll('.dropdown-link').forEach(n => n.addEventListener('click', () => {
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
        dropdownItems.forEach(dropdown => {
            dropdown.classList.remove('mobile-open');
        });
    }));
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && 
            navMenu && hamburger &&
            navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            dropdownItems.forEach(dropdown => {
                dropdown.classList.remove('mobile-open');
            });
        }
    });

    // Smooth scrolling for anchor links
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

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe all sections for animation
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Form validation (if contact forms are added)
    function validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });

        return isValid;
    }

    // Phone number click tracking
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', function() {
            // Track phone call clicks
            if (typeof gtag !== 'undefined') {
                gtag('event', 'phone_call', {
                    'event_category': 'Contact',
                    'event_label': this.getAttribute('href')
                });
            }
        });
    });

    // Booking button click tracking
    document.querySelectorAll('a[href*="fireflyreservations"]').forEach(link => {
        link.addEventListener('click', function() {
            // Track booking clicks
            if (typeof gtag !== 'undefined') {
                gtag('event', 'booking_click', {
                    'event_category': 'Reservations',
                    'event_label': 'Book Now Button'
                });
            }
        });
    });

    // Lazy loading for images (fallback for browsers without native support)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Performance optimization - preload critical resources
    function preloadCriticalResources() {
        const criticalImages = [
            'media/images/lake-texoma-aerial.jpg',
            'media/images/camppointe-office.jpg'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    // Call preload function
    preloadCriticalResources();

    // Load amenities dynamically from amenities.html
    async function loadAmenitiesFromPage() {
        // Only run on homepage
        const featuresGrid = document.querySelector('#features .features-grid');
        if (!featuresGrid) return;

        try {
            const response = await fetch('amenities.html');
            const html = await response.text();
            
            // Create a temporary DOM element to parse the HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Get all amenity cards from the amenities page
            const amenityCards = doc.querySelectorAll('.amenity-card');
            
            // Clear existing feature cards
            featuresGrid.innerHTML = '';
            
            // Convert amenity cards to feature cards (limit to first 8 for homepage)
            const cardsToShow = Array.from(amenityCards).slice(0, 8);
            
            cardsToShow.forEach(amenityCard => {
                const icon = amenityCard.querySelector('.amenity-icon')?.textContent || '✓';
                const title = amenityCard.querySelector('h3')?.textContent || '';
                const description = amenityCard.querySelector('p')?.textContent || '';
                
                // Create feature card
                const featureCard = document.createElement('a');
                featureCard.href = 'amenities.html';
                featureCard.className = 'feature-card';
                featureCard.innerHTML = `
                    <div class="feature-icon">${icon}</div>
                    <h3>${title}</h3>
                    <p>${description}</p>
                `;
                
                featuresGrid.appendChild(featureCard);
            });
            
        } catch (error) {
            console.error('Error loading amenities:', error);
            // Keep existing static content if fetch fails
        }
    }

    // Load amenities on homepage
    loadAmenitiesFromPage();

    // Error handling for external resources
    window.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            console.log('Image failed to load:', e.target.src);
            // Could replace with placeholder image
            e.target.src = 'images/placeholder.jpg';
        }
    });

    // Accessibility improvements
    function enhanceAccessibility() {
        // Add keyboard navigation support
        document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
            button.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });

        // Add skip to main content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: #2e8b57;
            color: white;
            padding: 8px;
            z-index: 1000;
            text-decoration: none;
            border-radius: 4px;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    enhanceAccessibility();
});

// Utility functions
const CampPointe = {
    // Scroll to top function
    scrollToTop: function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    },

    // Format phone number for display
    formatPhoneNumber: function(phoneNumber) {
        const cleaned = ('' + phoneNumber).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3];
        }
        return phoneNumber;
    },

    // Check if element is in viewport
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Debounce function for performance
    debounce: function(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
};

// Performance monitoring
if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
                console.log('Page Load Time:', entry.loadEventEnd - entry.loadEventStart);
            }
        }
    });
    observer.observe({entryTypes: ['navigation']});
}

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}