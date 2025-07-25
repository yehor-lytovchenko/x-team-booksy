// Swiper slider //

import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const swiper = new Swiper('.events-swiper', {
  modules: [Navigation, Pagination],
  loop: true,
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
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
});


// Random event time function //

function getRandomFutureTime(daysAhead = 30) {
  const now = new Date();
  const future = new Date(now.getTime() + Math.random() * daysAhead * 24 * 60 * 60 * 1000);

  const options = {
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  const formattedDate = future.toLocaleString('en-US', options);
  return ` | ${formattedDate}`;
}

const timeElements = document.querySelectorAll('.events-item-time');
timeElements.forEach(el => {
  el.textContent = getRandomFutureTime();
});
