// Enhanced script to ensure the favicon is properly loaded and displays larger

document.addEventListener('DOMContentLoaded', function() {
  // Force browser to reload favicon and make it larger
  
  // Remove all existing favicon links
  const existingLinks = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
  existingLinks.forEach(link => {
    if (link) {
      link.parentNode.removeChild(link);
    }
  });
  
  // Create multiple favicon links with different sizes, prioritizing larger ones
  // This makes browsers more likely to use the larger versions
  const sizes = [256, 192, 128, 96, 64, 48, 32];
  
  sizes.forEach(size => {
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = 'dog.png?' + new Date().getTime(); // Add timestamp to bypass cache
    link.sizes = size + 'x' + size;
    document.head.appendChild(link);
  });
  
  // Attempt to force preloading of the favicon image
  const preload = document.createElement('link');
  preload.rel = 'preload';
  preload.as = 'image';
  preload.href = 'dog.png';
  preload.type = 'image/png';
  document.head.appendChild(preload);
});