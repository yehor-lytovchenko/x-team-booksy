import { getBooksByCategory, getTopBooks, getTotalBooks } from './api.js';
import {
  displayBooks,
  getBooksPerScreen,
  createTopBooksList,
  hideShowMoreBtn,
  getPage,
  incrementPage,
  allTopBooks,
} from './render-functions.js';
import iziToast from 'izitoast';

const dropdownMenuEl = document.querySelector('.dropdown-menu');
const showMoreBtnEl = document.querySelector('.show-more-btn');

const perPage = 4;

// Show more button
const onClick = e => {
  showMoreBtnEl.blur();

  incrementPage();
  const page = getPage();

  const booksForScreen = getBooksPerScreen();
  const start = booksForScreen + (page - 2) * perPage;
  const end = start + perPage;
  const nextBooks = allTopBooks.slice(start, end);

  createTopBooksList(nextBooks);

  if (end >= allTopBooks.length) {
    hideShowMoreBtn();
    iziToast.error({
      message: "We're sorry, but you've reached the end of search results.",
      position: 'topRight',
    });
  }
};
showMoreBtnEl.addEventListener('click', onClick);

// Select category from dropdown menu
async function onClickedCategory(e) {
  const selectedCategory = e.target.textContent.trim();

  const btnText = document.querySelector('.dropdown-btn .dropdown-text');
  if (btnText) btnText.textContent = selectedCategory;

  let books;
  if (selectedCategory === 'All categories') {
    books = await getTotalBooks();
  } else {
    books = await getBooksByCategory(selectedCategory);
  }

  displayBooks(books, false, selectedCategory);

  const dropdown = document.querySelector('#categoryDropdown');
  dropdown.classList.remove('open');
}

dropdownMenuEl.addEventListener('click', onClickedCategory);
