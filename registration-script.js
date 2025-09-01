// Auto-scroll functionality for image gallery
document.addEventListener('DOMContentLoaded', () => {
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
}); 