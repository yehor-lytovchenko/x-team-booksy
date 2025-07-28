import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

document.addEventListener('DOMContentLoaded', () => {
  const swiper = new Swiper('.events-swiper', {
    modules: [Navigation, Pagination],
    wrapperClass: 'events-swiper-wrapper',
    slideClass: 'events-swiper-slide',
    loop: false,
    spaceBetween: 20,
    slidesPerView: 1,

    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      1440: {
        slidesPerView: 3,
      },
    },

    navigation: {
      nextEl: '.events-swiper-button-next',
      prevEl: '.events-swiper-button-prev',
      disabledClass: 'events-swiper-button-disabled',
    },

    pagination: {
      el: '.events-swiper-pagination',
      clickable: true,
    },
  });

  /* Random date function */

  const timeElements = document.querySelectorAll('.events-item-time');
  timeElements.forEach(el => {
    el.textContent = getRandomFutureTime();
  });
});

function getRandomFutureTime(daysAhead = 30) {
  const now = new Date();
  const future = new Date(
    now.getTime() + Math.random() * daysAhead * 24 * 60 * 60 * 1000
  );

  const options = {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  return ` | ${future.toLocaleString('en-US', options)}`;
}
