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
  showBooksLoader,
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

  await updateBooksCounter();

  // Smooth scroll
  const firstItemEl = document.querySelector('.top-book-item');

  if (firstItemEl) {
    const cardHeight = firstItemEl.getBoundingClientRect().height;

    window.scrollBy({
      top: cardHeight,
      behavior: 'smooth',
    });
  }

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

  // Remove selected class from all items and add to current
  const allDropdownItems = document.querySelectorAll('.dropdown-item');
  allDropdownItems.forEach(item => {
    item.classList.remove('selected');
  });
  categoryItem.classList.add('selected');

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

export function createDropdown(selector) {
  const dropdown = document.querySelector(selector);
  const btn = dropdown.querySelector('.dropdown-btn');
  const menu = dropdown.querySelector('.dropdown-menu');
  const text = dropdown.querySelector('.dropdown-text');

  // Set initial value
  const selected = dropdown.querySelector('.dropdown-item.selected');
  if (selected) text.textContent = selected.textContent;

  // Open/close
  btn.onclick = () => dropdown.classList.toggle('open');

  // Item selection
  const updateSelection = selectedItem => {
    const items = dropdown.querySelectorAll('.dropdown-item');
    items.forEach(i => i.classList.remove('selected'));
    selectedItem.classList.add('selected');
    text.textContent = selectedItem.textContent;
    dropdown.classList.remove('open');

    // Callback
    dropdown.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          value: selectedItem.dataset.value,
          text: selectedItem.textContent,
        },
      })
    );
  };

  menu.addEventListener('click', e => {
    const item = e.target.closest('.dropdown-item');
    if (item) {
      updateSelection(item);
    }
  });

  // Close when clicking outside element
  document.onclick = e => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  };
}

// Event listeners

document.addEventListener('DOMContentLoaded', showBooksLoader);

if (showMoreBtnEl) {
  showMoreBtnEl.addEventListener('click', handleShowMore);
}

if (dropdownMenuEl) {
  dropdownMenuEl.addEventListener('click', handleCategoryClick);
}
