// Registration page functionality
document.addEventListener('DOMContentLoaded', () => {
    // Auto-scroll functionality for image gallery
    const scrollWrapper = document.querySelector('.scrolling-wrapper');
    
    if (scrollWrapper) {
        let scrollDirection = 1; // 1 for right, -1 for left
        let isUserScrolling = false;
        let userScrollTimeout;
        
        // Auto-scroll function
        function autoScroll() {
            if (!isUserScrolling) {
                const maxScroll = scrollWrapper.scrollWidth - scrollWrapper.clientWidth;
                const currentScroll = scrollWrapper.scrollLeft;
                
                // Check if we've reached the end or beginning
                if (currentScroll >= maxScroll) {
                    scrollDirection = -1; // Start scrolling left
                } else if (currentScroll <= 0) {
                    scrollDirection = 1; // Start scrolling right
                }
                
                // Scroll by 1 pixel in the current direction
                scrollWrapper.scrollLeft += scrollDirection;
            }
        }
        
        // Detect user scrolling
        scrollWrapper.addEventListener('scroll', () => {
            isUserScrolling = true;
            
            // Clear existing timeout
            clearTimeout(userScrollTimeout);
            
            // Resume auto-scroll after user stops scrolling for 3 seconds
            userScrollTimeout = setTimeout(() => {
                isUserScrolling = false;
            }, 3000);
        });
        
        // Pause auto-scroll when mouse is over the gallery
        scrollWrapper.addEventListener('mouseenter', () => {
            isUserScrolling = true;
        });
        
        // Resume auto-scroll when mouse leaves the gallery
        scrollWrapper.addEventListener('mouseleave', () => {
            isUserScrolling = false;
        });
        
        // Start auto-scrolling
        setInterval(autoScroll, 50); // Scroll every 50ms for smooth animation
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