import Swiper from 'swiper/bundle';
import { Navigation, Pagination, Keyboard } from 'swiper/modules';
import 'swiper/css/bundle';
import '../css/feedbacks.css';

const swiper = new Swiper('.swiper-feedback', {
  direction: 'horizontal',
  slidesPerView: 1,
  slidesPerGroup: 1,
  centeredSlides: false,
  simulateTouch: true,
  touchRatio: 1,
  spaceBetween: 0,
  grabCursor: true,
  watchOverflow: true,
  speed: 250,
  lazy: {
    loadPrevNext: true,
    loadOnTransitionStart: true,
  },
  breakpoints: {
    768: {
      slidesPerView: 2,
      spaceBetween: 24,
      slidesPerGroup: 1,
    },
    1440: {
      slidesPerView: 3,
      spaceBetween: 24,
      slidesPerGroup: 1,
    },
  },
  pagination: {
    el: '.custom-swiper-pagination',
    type: 'bullets',
    clickable: true,
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
  modules: [Navigation, Pagination, Keyboard],
});
