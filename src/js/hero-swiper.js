import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay, Keyboard } from 'swiper/modules';
import 'swiper/css';

const swiper = new Swiper('.swiper', {
  modules: [Navigation, Pagination, Autoplay, Keyboard],
  direction: 'horizontal',
  loop: false,
  spaceBetween: 16,
  grabCursor: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: true,
    pauseOnMouseEnter: true,
  },

  keyboard: {
    enabled: true,
    onlyInViewport: true,
  },

  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  on: {
    slideChange(swiper) {
      const nextBtn = document.querySelector('.swiper-button-next');
      const prevBtn = document.querySelector('.swiper-button-prev');

      swiper.isEnd
        ? nextBtn?.classList.add('is-disabled')
        : nextBtn?.classList.remove('is-disabled');

      swiper.isBeginning
        ? prevBtn?.classList.add('is-disabled')
        : prevBtn?.classList.remove('is-disabled');
    },

    init(swiper) {
      const prevBtn = document.querySelector('.swiper-button-prev');
      swiper.isBeginning
        ? prevBtn?.classList.add('is-disabled')
        : prevBtn?.classList.remove('is-disabled');
    },
  },
});
document
  .querySelectorAll('.swiper-button-prev, .swiper-button-next')
  .forEach(button => {
    button.addEventListener('mouseup', () => {
      button.blur();
    });
  });

export default swiper;
