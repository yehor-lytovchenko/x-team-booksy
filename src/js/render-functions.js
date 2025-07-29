import {
  getCategoryList,
  getTopBooks,
  getTotalBooks,
  getCountBooksByCategory,
} from './api.js';

export const topBooksListEl = document.querySelector('.top-books-list');
const dropdownMenuEl = document.querySelector('.dropdown-menu');
const showMoreBtnEl = document.querySelector('.show-more-btn');
const showCountEl = document.querySelector('.show-count');

const allCategories = await getCategoryList();
const categoryName = allCategories.map(category => category.list_name);

export let allTopBooks = [];
export let page = 1;
export const perPage = 4;
export let currentCategory = 'All categories';
let totalBooksCache = null;

async function getTotalBooksCount() {
  if (totalBooksCache === null) {
    const allBooks = await getTotalBooks();
    totalBooksCache = allBooks.length;
  }
  return totalBooksCache;
}

// Render functions for displaying books and categories
export async function displayBooks(
  books,
  isInitialLoad,
  selectedCategory = 'All categories',
  countBooksOverride = null
) {
  topBooksListEl.innerHTML = '';
  resetPage();

  const filterBooks = filterDublicateBooks(books);

  updateAllBooks(filterBooks);

  const booksForScreen = getBooksPerScreen();
  const firstBook = filterBooks.slice(0, booksForScreen);

  if (firstBook.length > 0) {
    createTopBooksList(firstBook);
  }

  currentCategory = selectedCategory;

  if (isInitialLoad) {
    createCategoryBooksList(categoryName);
  }
  const totalBooksCount = await getTotalBooksCount();

  let countBooks = filterBooks.length;

  createShowCase(countBooks, totalBooksCount);

  if (filterBooks.length > booksForScreen) {
    showShowMoreBtn();
  } else {
    hideShowMoreBtn();
  }
}

export function createTopBooksList(books) {
  const markup = books
    .map(
      book => `
        <li class="top-book-item">
            <img
              class="top-book-img"
              src="${book.book_image}"
              alt="${book.title}"
              width="343" height="488"
              loading="lazy"
            />
          <div class="top-book-info">
          <div class="top-book-info-wrap">
            <h3 class="top-book-title">${book.title}</h3>
            <p class="top-book-price">$${book.price}</p>
            </div>
            <p class="top-book-author">${book.author}</p>
          </div>
          <button class="top-book-btn" type="button">
            Learn More
          </button>
        </li>
      `
    )
    .join('');

  topBooksListEl.insertAdjacentHTML('beforeend', markup);
}

async function createCategoryBooksList(arr) {
  const markup = arr
    .map(item => `<li class="dropdown-item"><p>${item}</p></li>`)
    .join('');

  dropdownMenuEl.insertAdjacentHTML('beforeend', markup);
}

// Исправленная функция createShowCase
export async function createShowCase(count, total) {
  showCountEl.innerHTML = '';
  const markup = `<p>Showing ${count} of ${total}</p>`;

  showCountEl.insertAdjacentHTML('beforeend', markup);
}

// Pagination functions
export function getBooksPerScreen() {
  const screenWidth = window.innerWidth;
  return screenWidth >= 768 ? 24 : 10;
}

export function getPage() {
  return page;
}

export function incrementPage() {
  page += 1;
}

export function resetPage() {
  page = 1;
}

// Filter and utility functions
function filterDublicateBooks(books) {
  const uniqueTitle = new Set();

  return books.filter(book => {
    // Отбрасываем книги без нормального title или без валидной цены (> 0)
    if (!book.title || !book.price || book.price <= 0) return false;

    // Делаем title нижним регистром и убираем лишние пробелы
    const normalizeTitle = book.title.trim().toLowerCase();

    // Если уже добавляли такую книгу — не добавляем снова
    if (uniqueTitle.has(normalizeTitle)) return false;

    uniqueTitle.add(normalizeTitle);
    return true;
  });
}

export function updateAllBooks(books) {
  allTopBooks.length = 0;
  allTopBooks.push(...books);
}

export const showShowMoreBtn = () =>
  showMoreBtnEl.classList.remove('is-hidden');

export const hideShowMoreBtn = () => showMoreBtnEl.classList.add('is-hidden');

getTopBooks().then(data => {
  const initialBooks = data.flatMap(el => el.books);
  displayBooks(initialBooks, true, 'Top', initialBooks.length);
});

// Dropdown menu
export function createDropdown(selector) {
  const dropdown = document.querySelector(selector);
  const btn = dropdown.querySelector('.dropdown-btn');
  const menu = dropdown.querySelector('.dropdown-menu');
  const text = dropdown.querySelector('.dropdown-text');
  const items = dropdown.querySelectorAll('.dropdown-item');

  // Установка начального значения
  const selected = dropdown.querySelector('.dropdown-item.selected');
  if (selected) text.textContent = selected.textContent;

  // Открытие/закрытие
  btn.onclick = () => dropdown.classList.toggle('open');

  // Выбор элемента
  items.forEach(item => {
    item.onclick = () => {
      items.forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      text.textContent = item.textContent;
      dropdown.classList.remove('open'); // Закрываем dropdown после выбора

      // Callback
      dropdown.dispatchEvent(
        new CustomEvent('change', {
          detail: { value: item.dataset.value, text: item.textContent },
        })
      );
    };
  });

  // Закрытие при клике вне элемента
  document.onclick = e => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  };
}

createDropdown('#categoryDropdown');

document.querySelector('#categoryDropdown').addEventListener('change', e => {});
