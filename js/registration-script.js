// Registration page functionality
document.addEventListener('DOMContentLoaded', () => {
    // Auto-scroll functionality for image gallery
    const scrollWrapper = document.querySelector('.scrolling-wrapper');
    
    if (scrollWrapper) {
        let isUserInteracting = false;
        let userInteractionTimeout;
        let scrollPosition = 0;
        
        // Clone images for seamless loop
        const images = scrollWrapper.querySelectorAll('.image-card');
        const imageWidth = 316; // 300px image + 16px margin
        
        // Clone all images and append them for seamless scrolling
        images.forEach(img => {
            const clone = img.cloneNode(true);
            scrollWrapper.appendChild(clone);
        });
        
        // Auto-scroll function with wrap-around
        function autoScroll() {
            if (!isUserInteracting) {
                scrollPosition += 2; // Faster scroll speed (2px per frame)
                
                const totalWidth = images.length * imageWidth;
                
                // Reset position when we've scrolled past the original set
                if (scrollPosition >= totalWidth) {
                    scrollPosition = 0;
                }
                
                scrollWrapper.scrollLeft = scrollPosition;
            }
        }
        
        // Pause auto-scroll when mouse is over the gallery
        scrollWrapper.addEventListener('mouseenter', () => {
            isUserInteracting = true;
        });
        
        // Resume auto-scroll when mouse leaves the gallery
        scrollWrapper.addEventListener('mouseleave', () => {
            clearTimeout(userInteractionTimeout);
            userInteractionTimeout = setTimeout(() => {
                isUserInteracting = false;
            }, 1000); // Resume after 1 second
        });
        
        // Handle manual scrolling
        scrollWrapper.addEventListener('scroll', () => {
            if (!isUserInteracting) {
                scrollPosition = scrollWrapper.scrollLeft;
            }
        });
        
        // Start auto-scrolling with faster interval
        setInterval(autoScroll, 20); // Every 20ms for smoother, faster animation
    }

    // Sidebar navigation functionality
    const sidebarButtons = document.querySelectorAll('.sidebar-button');
    const sections = document.querySelectorAll('.section');
    
    // Smooth scrolling for sidebar buttons
    sidebarButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSection = button.getAttribute('data-section');
            const section = document.getElementById(targetSection);
            
            if (section) {
                section.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Scroll detection and active state management
    function updateActiveSection() {
        const scrollPosition = window.scrollY + 200; // Offset for header
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.id;
            }
        });
        
        // Update sidebar button states
        sidebarButtons.forEach(button => {
            const buttonSection = button.getAttribute('data-section');
            
            if (buttonSection === currentSection) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }
    
    // Throttle scroll events for better performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(updateActiveSection, 50);
    });
    
    // Initial call to set correct active state
    updateActiveSection();
    
    // Add intersection observer for more precise section detection
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                
                // Update sidebar buttons
                sidebarButtons.forEach(button => {
                    const buttonSection = button.getAttribute('data-section');
                    
                    if (buttonSection === sectionId) {
                        button.classList.add('active');
                    } else {
                        button.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    // Observe all sections
    sections.forEach(section => {
        observer.observe(section);
    });
}); 