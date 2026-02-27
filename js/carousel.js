/**
 * YatraNow - Carousel Module
 * Pure JavaScript carousel with auto-slide, navigation, and lazy-loading
 */

class Carousel {
  constructor(carouselElement) {
    this.carousel = carouselElement;
    this.slidesContainer = this.carousel.querySelector('.carousel-slides');
    this.slides = this.carousel.querySelectorAll('.carousel-slide');
    this.currentIndex = 0;
    this.autoSlideInterval = null;
    this.autoSlideDelay = 5000; // 5 seconds
    this.isPaused = false;
    
    this.init();
  }
  
  init() {
    this.createNavigationArrows();
    this.createIndicatorDots();
    this.setupEventListeners();
    this.lazyLoadImages();
    this.startAutoSlide();
    this.goToSlide(0); // Show first slide
  }
  
  /**
   * Create left and right navigation arrows
   */
  createNavigationArrows() {
    // Left arrow
    const leftArrow = document.createElement('button');
    leftArrow.className = 'carousel-arrow carousel-arrow-left';
    leftArrow.innerHTML = '&#8249;'; // Left chevron
    leftArrow.setAttribute('aria-label', 'Previous slide');
    this.carousel.appendChild(leftArrow);
    
    // Right arrow
    const rightArrow = document.createElement('button');
    rightArrow.className = 'carousel-arrow carousel-arrow-right';
    rightArrow.innerHTML = '&#8250;'; // Right chevron
    rightArrow.setAttribute('aria-label', 'Next slide');
    this.carousel.appendChild(rightArrow);
    
    this.leftArrow = leftArrow;
    this.rightArrow = rightArrow;
  }
  
  /**
   * Create indicator dots at the bottom
   */
  createIndicatorDots() {
    const indicatorsContainer = document.createElement('div');
    indicatorsContainer.className = 'carousel-indicators';
    
    this.slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.dataset.index = index;
      indicatorsContainer.appendChild(dot);
    });
    
    this.carousel.appendChild(indicatorsContainer);
    this.indicators = indicatorsContainer.querySelectorAll('.carousel-dot');
  }
  
  /**
   * Set up all event listeners
   */
  setupEventListeners() {
    // Arrow navigation
    this.leftArrow.addEventListener('click', () => this.previousSlide());
    this.rightArrow.addEventListener('click', () => this.nextSlide());
    
    // Dot navigation
    this.indicators.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.goToSlide(index);
      });
    });
    
    // Pause on hover
    this.carousel.addEventListener('mouseenter', () => this.pauseAutoSlide());
    this.carousel.addEventListener('mouseleave', () => this.resumeAutoSlide());
    
    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    this.carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    this.carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.previousSlide();
      if (e.key === 'ArrowRight') this.nextSlide();
    });
  }
  
  /**
   * Handle touch swipe gestures
   */
  handleSwipe(startX, endX) {
    const swipeThreshold = 50;
    const diff = startX - endX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.nextSlide(); // Swipe left
      } else {
        this.previousSlide(); // Swipe right
      }
    }
  }
  
  /**
   * Lazy load images for performance
   */
  lazyLoadImages() {
    this.slides.forEach((slide) => {
      const bgImage = slide.dataset.bgImage;
      if (bgImage) {
        const img = new Image();
        img.onload = () => {
          slide.style.backgroundImage = `url(${bgImage})`;
        };
        img.src = bgImage;
      }
    });
  }
  
  /**
   * Go to a specific slide
   */
  goToSlide(index) {
    // Ensure index is within bounds
    if (index < 0) {
      this.currentIndex = this.slides.length - 1;
    } else if (index >= this.slides.length) {
      this.currentIndex = 0;
    } else {
      this.currentIndex = index;
    }
    
    // Move slides
    const offset = -this.currentIndex * 100;
    this.slidesContainer.style.transform = `translateX(${offset}%)`;
    
    // Update active dot
    this.updateIndicators();
  }
  
  /**
   * Go to next slide
   */
  nextSlide() {
    this.goToSlide(this.currentIndex + 1);
  }
  
  /**
   * Go to previous slide
   */
  previousSlide() {
    this.goToSlide(this.currentIndex - 1);
  }
  
  /**
   * Update active indicator dot
   */
  updateIndicators() {
    this.indicators.forEach((dot, index) => {
      if (index === this.currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
  
  /**
   * Start auto-sliding
   */
  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      if (!this.isPaused) {
        this.nextSlide();
      }
    }, this.autoSlideDelay);
  }
  
  /**
   * Pause auto-sliding
   */
  pauseAutoSlide() {
    this.isPaused = true;
  }
  
  /**
   * Resume auto-sliding
   */
  resumeAutoSlide() {
    this.isPaused = false;
  }
  
  /**
   * Stop auto-sliding completely
   */
  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }
}

/**
 * Initialize carousel when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  const carouselElement = document.querySelector('.hero-carousel');
  if (carouselElement) {
    new Carousel(carouselElement);
  }
});

/**
 * Export for use in other modules (if needed)
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Carousel;
}
