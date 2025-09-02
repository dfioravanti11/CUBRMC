document.addEventListener('DOMContentLoaded', function() {
    const animationContainer = document.getElementById('animationContainer');
    const mainContent = document.getElementById('mainContent');
    
    // Show the main content after the heart animation completes (7 seconds)
    setTimeout(() => {
        // Hide the animation container
        animationContainer.style.display = 'none';
        
        // Show the main content
        mainContent.style.display = 'block';
        
        // Add a slight delay before fading in the content
        setTimeout(() => {
            mainContent.classList.add('show');
        }, 100);
    }, 7000); // 7 seconds to match the animation duration
}); 