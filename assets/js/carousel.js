/**
 * Odonto Excellence Canela - Testimonials Carousel
 * Carrossel suave e responsivo para os depoimentos de pacientes
 */
class TestimonialsCarousel {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;

    this.slider = this.container.querySelector('.testimonials-slider');
    this.cards = this.container.querySelectorAll('.testimonial-card');
    this.prevBtn = this.container.querySelector('.carousel-prev');
    this.nextBtn = this.container.querySelector('.carousel-next');
    this.dotsContainer = this.container.querySelector('.carousel-dots');

    if (!this.slider || this.cards.length === 0) return;

    this.currentIndex = 0;
    this.totalCards = this.cards.length;
    this.isDragging = false;
    this.startX = 0;
    this.currentTranslate = 0;
    this.prevTranslate = 0;

    this.init();
  }

  init() {
    this.createDots();
    this.updateVisibleCardsCount();

    window.addEventListener('resize', () => {
      this.updateVisibleCardsCount();
      this.goToSlide(this.currentIndex);
    });

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prev());
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.next());
    }

    // Touch events for mobile
    this.slider.addEventListener('touchstart', (e) => this.touchStart(e), { passive: true });
    this.slider.addEventListener('touchmove', (e) => this.touchMove(e), { passive: true });
    this.slider.addEventListener('touchend', () => this.touchEnd());

    // Mouse drag for desktop
    this.slider.addEventListener('mousedown', (e) => this.dragStart(e));
    this.slider.addEventListener('mousemove', (e) => this.dragMove(e));
    this.slider.addEventListener('mouseup', () => this.dragEnd());
    this.slider.addEventListener('mouseleave', () => this.dragEnd());

    // Auto-advance every 6 seconds
    this.startAutoPlay();
    this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
    this.container.addEventListener('mouseleave', () => this.startAutoPlay());
  }

  updateVisibleCardsCount() {
    const width = window.innerWidth;
    if (width > 1024) {
      this.visibleCards = 3;
    } else if (width > 640) {
      this.visibleCards = 2;
    } else {
      this.visibleCards = 1;
    }
    this.maxIndex = Math.max(0, this.totalCards - this.visibleCards);
  }

  createDots() {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = '';
    
    const count = this.totalCards;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button');
      dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Ir para depoimento ${i + 1}`);
      dot.addEventListener('click', () => this.goToSlide(i));
      this.dotsContainer.appendChild(dot);
    }
    this.dots = this.dotsContainer.querySelectorAll('.carousel-dot');
  }

  updateDots() {
    if (!this.dots) return;
    this.dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });
  }

  goToSlide(index) {
    if (index < 0) {
      index = 0;
    } else if (index > this.maxIndex) {
      index = this.maxIndex;
    }

    this.currentIndex = index;
    const cardWidth = this.cards[0].offsetWidth;
    const gap = 28; // 1.75rem in pixels
    const offset = this.currentIndex * (cardWidth + gap);

    this.slider.style.transform = `translateX(-${offset}px)`;
    this.updateDots();
  }

  next() {
    if (this.currentIndex >= this.maxIndex) {
      this.goToSlide(0);
    } else {
      this.goToSlide(this.currentIndex + 1);
    }
  }

  prev() {
    if (this.currentIndex <= 0) {
      this.goToSlide(this.maxIndex);
    } else {
      this.goToSlide(this.currentIndex - 1);
    }
  }

  touchStart(e) {
    this.startX = e.touches[0].clientX;
    this.isDragging = true;
  }

  touchMove(e) {
    if (!this.isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - this.startX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        this.prev();
      } else {
        this.next();
      }
      this.isDragging = false;
    }
  }

  touchEnd() {
    this.isDragging = false;
  }

  dragStart(e) {
    this.startX = e.clientX;
    this.isDragging = true;
    this.slider.style.cursor = 'grabbing';
  }

  dragMove(e) {
    if (!this.isDragging) return;
    const diff = e.clientX - this.startX;
    if (Math.abs(diff) > 60) {
      if (diff > 0) {
        this.prev();
      } else {
        this.next();
      }
      this.isDragging = false;
      this.slider.style.cursor = 'grab';
    }
  }

  dragEnd() {
    this.isDragging = false;
    if (this.slider) this.slider.style.cursor = 'grab';
  }

  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayTimer = setInterval(() => this.next(), 6000);
  }

  stopAutoPlay() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new TestimonialsCarousel('.testimonials-section');
});
