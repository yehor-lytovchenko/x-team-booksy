const SLIDES = [
  {
    alt: 'Mug with book on the table',
    text: 'Get 10% off your ',
    highlight: 'first order',
    link: '#books',
    images: {
      desktop: {
        src: './img/desktop-webp/banner-1-desktop.webp',
        src2x: './img/desktop-webp/banner-1-desktop@2x.webp',
      },
      tablet: {
        src: './img/tablet-webp/banner-1-tablet.webp',
        src2x: './img/tablet-webp/banner-1-tablet@2x.webp',
      },
      mobile: {
        src: './img/mob-webp/banner-1-mob.webp',
        src2x: './img/mob-webp/banner-1-mob@2x.webp',
      },
    },
  },
  {
    alt: 'Glasses with book on the table',
    text: 'Save 15% on ',
    highlight: 'some books',
    link: '#books',
    images: {
      desktop: {
        src: './img/desktop-webp/banner-2-desktop.webp',
        src2x: './img/desktop-webp/banner-2-desktop@2x.webp',
      },
      tablet: {
        src: './img/tablet-webp/banner-2-tablet.webp',
        src2x: './img/tablet-webp/banner-2-tablet@2x.webp',
      },
      mobile: {
        src: './img/mob-webp/banner-2-mob.webp',
        src2x: './img/mob-webp/banner-2-mob@2x.webp',
      },
    },
  },
  {
    alt: 'Shelf with books',
    text: 'Summer Sale! ',
    highlight: 'Up to -40% discounts',
    link: '#books',
    images: {
      desktop: {
        src: './img/desktop-webp/banner-3-desktop.webp',
        src2x: './img/desktop-webp/banner-3-desktop@2x.webp',
      },
      tablet: {
        src: './img/tablet-webp/banner-3-tablet.webp',
        src2x: './img/tablet-webp/banner-3-tablet@2x.webp',
      },
      mobile: {
        src: './img/mob-webp/banner-3-mob.webp',
        src2x: './img/mob-webp/banner-3-mob@2x.webp',
      },
    },
  },
  {
    alt: 'Vase on the table',
    text: 'Last chance to buy our ',
    highlight: 'spring bestsellers',
    link: '#books',
    images: {
      desktop: {
        src: './img/desktop-webp/banner-4-desktop.webp',
        src2x: './img/desktop-webp/banner-4-desktop@2x.webp',
      },
      tablet: {
        src: './img/tablet-webp/banner-4-tablet.webp',
        src2x: './img/tablet-webp/banner-4-tablet@2x.webp',
      },
      mobile: {
        src: './img/mob-webp/banner-4-mob.webp',
        src2x: './img/mob-webp/banner-4-mob@2x.webp',
      },
    },
  },
];

const wrapperContainer = document.querySelector('.hero-js');
const generateMarkup = arr => {
  return arr
    .map(slide => {
      return `<li class="swiper-slide hero-swiper-slide">
      <picture>
      <source media="(min-width: 1440px)" type="image/webp" srcset="${slide.images.desktop.src} 1x, ${slide.images.desktop.src2x} 2x">
      <source media="(min-width: 768px)" type="image/webp" srcset="${slide.images.tablet.src} 1x, ${slide.images.tablet.src2x} 2x">
          <img 
            src="${slide.images.mobile.src}" 
            srcset="${slide.images.mobile.src} 1x, ${slide.images.mobile.src2x} 2x"
            loading="lazy"
            width="343"
            height="199"
            alt="${slide.alt}" />
          </picture>
          <div class="banner-wrapper">
            <p class="hero-text">
              ${slide.text}<span class="hero-text-wrap">${slide.highlight}</span>
            </p>
            <a class="hero-link" href="${slide.link}">Shop Now!</a>
          </div>
        </li>`;
    })
    .join('');
};

const createGallery = slides => {
  wrapperContainer.innerHTML = generateMarkup(slides);
};

createGallery(SLIDES);
