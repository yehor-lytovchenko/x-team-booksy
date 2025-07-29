import { getBooksByCategory, getTotalBooks } from './api.js';
import {
  displayBooks,
  getBooksPerScreen,
  createTopBooksList,
  hideShowMoreBtn,
  getPage,
  incrementPage,
  allTopBooks,
  updateBooksCounter,
} from './render-functions.js';
import iziToast from 'izitoast';

const dropdownMenuEl = document.querySelector('.dropdown-menu');
const showMoreBtnEl = document.querySelector('.show-more-btn');

const perPage = 4;
let paginationValue = getBooksPerScreen();

export function getPaginationValue() {
  return paginationValue;
}

export function setPaginationValue(value) {
  paginationValue = value;
}

// Button show more
async function handleShowMore() {
  showMoreBtnEl.blur();

  incrementPage();
  const page = getPage();
  const booksForScreen = getBooksPerScreen();

  const start = booksForScreen + (page - 2) * perPage;
  const end = start + perPage;
  const nextBooks = allTopBooks.slice(start, end);
  paginationValue = Math.min(end, allTopBooks.length);

  createTopBooksList(nextBooks);

  // Обновляем счетчик после добавления новых книг
  await updateBooksCounter();

  // If reached end of list
  if (end >= allTopBooks.length) {
    hideShowMoreBtn();
    iziToast.info({
      message: "You've reached the end of the book list.",
      position: 'topRight',
    });
  }
}

// Filter valid categories
function filterValidCategories(category) {
  return (
    category &&
    category.trim() !== '' &&
    category.trim() !== ' ' &&
    category.toLowerCase() !== 'undefined' &&
    category.toLowerCase() !== 'null'
  );
}

// Select dropdown
async function handleCategoryClick(event) {
  const categoryItem = event.target.closest('.dropdown-item');
  if (!categoryItem) return;

  const selectedCategory = categoryItem.textContent.trim();

  // Filter out invalid categories
  if (!filterValidCategories(selectedCategory)) {
    iziToast.warning({
      title: 'Warning',
      message: 'Invalid category selected',
      position: 'topRight',
    });
    return;
  }

  // Update button text
  const btnText = document.querySelector('.dropdown-btn .dropdown-text');
  if (btnText) {
    btnText.textContent = selectedCategory;
  }

  // Get books for selected category
  let books;
  if (selectedCategory === 'All categories') {
    books = await getTotalBooks();
  } else {
    books = await getBooksByCategory(selectedCategory);
  }

  // Display books
  await displayBooks(books, {
    selectedCategory: selectedCategory,
    resetContent: true,
  });

  // Close dropdown
  const dropdown = document.querySelector('#categoryDropdown');
  dropdown.classList.remove('open');
}

// Event listeners
if (showMoreBtnEl) {
  showMoreBtnEl.addEventListener('click', handleShowMore);
}

if (dropdownMenuEl) {
  dropdownMenuEl.addEventListener('click', handleCategoryClick);
}
