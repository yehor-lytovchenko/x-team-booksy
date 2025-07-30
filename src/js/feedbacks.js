import Swiper from 'swiper';
import { Navigation, Pagination, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const swiper = new Swiper('.swiper-feedback', {
  modules: [Navigation, Pagination, Keyboard],
  wrapperClass: 'swiper-wrapper-feedback',
  slideClass: 'swiper-slide-feedback',
  loop: false,
  direction: 'horizontal',
  slidesPerView: 1,
  slidesPerGroup: 1,
  centeredSlides: false,
  simulateTouch: true,
  touchRatio: 1,
  grabCursor: true,
  watchOverflow: true,
  speed: 250,
  spaceBetween: 24,

  lazy: {
    loadPrevNext: true,
    loadOnTransitionStart: true,
  },

  breakpoints: {
    768: {
      slidesPerView: 2,
      slidesPerGroup: 1,
    },
    1440: {
      slidesPerView: 3,
      slidesPerGroup: 1,
    },
  },

  pagination: {
    el: '.custom-swiper-pagination',
    type: 'bullets',
    clickable: true,
    bulletClass: 'swiper-pagination-bullet',
    bulletActiveClass: 'swiper-pagination-bullet-active',
  },

  navigation: {
    nextEl: '.feedback-custom-swiper-button-next',
    prevEl: '.feedback-custom-swiper-button-prev',
    disabledClass: 'feedback-custom-swiper-button-disabled',
  },

  keyboard: {
    enabled: true,
    onlyInViewport: true,
  },
});

function getCurrentSlidesPerGroup() {
  const width = window.innerWidth;
  if (width >= 1440) return 3;
  if (width >= 768) return 2;
  return 1;
}

function togglePaginationAndNavigation() {
  const totalSlides = swiper.slides.length;
  const currentGroup = getCurrentSlidesPerGroup();

  const paginationEl = document.querySelector('.custom-swiper-pagination');
  const prevBtn = document.querySelector('.feedback-custom-swiper-button-prev');
  const nextBtn = document.querySelector('.feedback-custom-swiper-button-next');

  if (totalSlides <= currentGroup) {
    if (paginationEl) paginationEl.style.display = 'none';
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
  } else {
    if (paginationEl) paginationEl.style.display = '';
    if (prevBtn) prevBtn.style.display = '';
    if (nextBtn) nextBtn.style.display = '';
  }
}

togglePaginationAndNavigation();

// На изменение размера окна — чтобы динамически обновлялось
window.addEventListener('resize', () => {
  togglePaginationAndNavigation();
});