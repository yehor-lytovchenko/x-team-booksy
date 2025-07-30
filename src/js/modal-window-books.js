import Accordion from 'accordion-js';
import 'accordion-js/dist/accordion.min.css';
import { body } from './header';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { getBooksById } from './api.js';
import { topBooksListEl } from './render-functions.js';
import { addToCart } from './cart.js';

const accordionInstance = new Accordion('#accordion', { showMultiple: true });
const textWrapperEl = document.querySelector('#text-wrap-modal-books');
const accordionEl = document.querySelector('#accordion');
const modalBooksEl = document.querySelector('#modal-books');
const formEl = document.querySelector('#book-modal-form');
const cartEl = document.querySelector('#cart-button');
const dynamicText = modalBooksEl.querySelector('#dynamic-text');

let bookId;

// ? Елементи лічильника кількості книжок, що добавляються в корзину.
const quantityEl = document.querySelector('#quantity-wrapper');
const decreaseEl = quantityEl.children[0];
const inputEl = quantityEl.children[1];
const increaseEl = quantityEl.children[2];

// ? Змінна відповідає за кількість товарів в корзині і айді книжки
export let totalQuantity = 0;
export let bookCartId;

// ? Відкриття модального вікна
const modalOpen = async e => {
  if (e.target.classList.contains('top-book-btn')) {
    modalBooksEl.classList.add('books-window-is-open');
    body.classList.add('no-scroll');
    inputEl.value = 1;
    // ? Дістаєм найближчий елемент списку, читаєм його айді.
    let bookListEl = e.target.closest('li');
    bookId = bookListEl.id;

    // ? Якщо айді присутній, відправляється запит по айдішнику і виконується розмітка. Якщо ні, виводиться помилка і модальне вікно закривається.
    if (bookId) {
      try {
        const bookData = await getBooksById(bookId);
        markupHandler(bookData);
      } catch (err) {
        iziToast.error({
          title: 'Error',
          message: `Failed to fetch book data: ${err}`,
          position: 'topRight',
        });
      }
    } else {
      iziToast.error({
        title: 'Error',
        message: `Book ID not found`,
        position: 'topRight',
      });
      modalBooksEl.classList.remove('books-window-is-open');
      body.classList.remove('no-scroll');
    }
  }
};
topBooksListEl.addEventListener('click', modalOpen);

const markupCleaner = () => {
  const dynamicAccordion = accordionEl.querySelector('.ac-dynamic');
  if (dynamicAccordion) dynamicAccordion.remove();

  const bookImage = modalBooksEl.querySelector('.books-modal-image');
  if (bookImage) bookImage.remove();

  if (dynamicText) dynamicText.innerHTML = '';
};

const markupHandler = ({
  title,
  description,
  author,
  book_image,
  book_image_width,
  book_image_height,
  price,
}) => {
  markupCleaner();
  if (description === '') {
    description = 'There is no description for this book.';
  }
  textWrapperEl.insertAdjacentHTML(
    'beforebegin',
    `<img  class="books-modal-image" loading="lazy" src="${book_image}" width="${book_image_width}" height="${book_image_height}" alt="${title}">`
  );
  dynamicText.insertAdjacentHTML(
    'afterbegin',
    `<h2 class="book-title-modal">${title}</h2>
        <h3 class="book-author-modal">${author}</h3>
        <h3 class="book-price">$${price}</h3>`
  );
  accordionEl.insertAdjacentHTML(
    'afterbegin',
    `<div class="ac ac-dynamic">
          <h2 class="ac-header">
            <button type="button" class="ac-trigger">Details
              <span class="chevron-span">
                <svg class="icon-chevron" width="24" height="25">
                  <use
                    class="chevron-use"
                    href="./img/icons.svg#icon-chevron-down"
                  ></use>
                </svg>
              </span></button>
          </h2>
          <div class="ac-panel">
            <p class="ac-text">
              ${description}
            </p>
          </div>
        </div>`
  );
  accordionInstance.update();
};

// ? Функціонал кнопок відняти/додати
const increaseHandler = e => {
  e.target.blur();
  inputEl.value = Number(inputEl.value) + 1;
};
const decreaseHandler = e => {
  e.target.blur();
  if (Number(inputEl.value) != 1) {
    inputEl.value = Number(inputEl.value) - 1;
  }
};
increaseEl.addEventListener('click', increaseHandler);
decreaseEl.addEventListener('click', decreaseHandler);

// ? Логіка кнопки корзини
const cartHandler = e => {
  e.target.blur();
  totalQuantity += Number(inputEl.value); //? Відповідає за кількість цієї книжки у корзині
  bookCartId = bookId; // ? Відповідає за айді книжки у корзині
  getBooksById(bookCartId)
    .then(book => {
      if (book) {
        addToCart(book, Number(inputEl.value));
      } else {
        iziToast.error({
          title: 'Error',
          message: `Failed to add book to the cart!`,
          position: 'topRight',
        });
      }
    })
    .catch(console.error);

  iziToast.info({
    title: 'Hello',
    message: `Successfully added ${inputEl.value} item(s) to the cart!`,
    position: 'topRight',
  });
};
cartEl.addEventListener('click', cartHandler);

// ? Логіка кнопки купити
const onSubmit = e => {
  e.preventDefault();
  e.target.blur();
  iziToast.success({
    title: 'Hello',
    message: 'Thank you for your purchase!',
    position: 'topRight',
  });
};
formEl.addEventListener('submit', onSubmit);

// ? Відповідає за закривання вікна на кнопку закриття, бекдроп або кнопку купівлі, а також нажату клавішу Escape
const modalCloseClickHandler = e => {
  if (
    e.target.classList.contains('mob-books-close') ||
    e.target.classList.contains('modal-window-books-backdrop') ||
    e.target.classList.contains('buy-button')
  ) {
    modalBooksEl.classList.remove('books-window-is-open');
    body.classList.remove('no-scroll');
  }
};
const modalEscapeHandler = e => {
  if (e.key === 'Escape') {
    modalBooksEl.classList.remove('books-window-is-open');
    body.classList.remove('no-scroll');
  }
};
document.addEventListener('keydown', modalEscapeHandler);
modalBooksEl.addEventListener('click', modalCloseClickHandler);
