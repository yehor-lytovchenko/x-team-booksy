import {
  getCategoryList,
  getTopBooks,
  getTotalBooks,
  getCountBooksByCategory,
} from './api.js';
import { getPaginationValue, setPaginationValue } from './books.js';
import iziToast from 'izitoast';

// DOM elements
export const topBooksListEl = document.querySelector('.top-books-list');
const dropdownMenuEl = document.querySelector('.dropdown-menu');
const showMoreBtnEl = document.querySelector('.show-more-btn');
const showCountEl = document.querySelector('.show-count');

// Global state variables
export let allTopBooks = [];
export let page = 1;
export const perPage = 4;
export let currentCategory = 'All categories';

// Constants
const INITIAL_CATEGORY = 'Top';

// Cache for total books count
let totalBooksCache = null;

async function getTotalBooksCount() {
  if (totalBooksCache === null) {
    const allBooks = await getTotalBooks();
    totalBooksCache = allBooks.length;
  }
  return totalBooksCache;
}

// Main function for displaying books
export async function displayBooks(books, options = {}) {
  // Destructure options with default values
  const {
    isInitialLoad = false,
    selectedCategory = 'All categories',
    resetContent = true,
  } = options;

  try {
    // Clear content and reset pagination if needed
    if (resetContent) {
      clearBooksContent();
      resetPage();
    }

    // Input data validation
    if (!Array.isArray(books)) {
      iziToast.warning({
        title: 'Warning',
        message: 'displayBooks: books should be an array',
        position: 'topRight',
      });
      return;
    }

    // Filter books from duplicates and zero prices
    const filteredBooks = filterBooks(books);

    // Update global state
    updateAllBooks(filteredBooks);
    currentCategory = selectedCategory;

    // Calculate number of books for first screen
    const booksPerScreen = getBooksPerScreen();
    const initialBooks = filteredBooks.slice(0, booksPerScreen);

    setPaginationValue(initialBooks.length);

    // Display books
    if (initialBooks.length > 0) {
      createTopBooksList(initialBooks);
    } else {
      showEmptyState();
    }

    // Initialize categories only on first load
    if (isInitialLoad) {
      await initializeCategories();
    }

    // Update counter and manage "Show more" button
    await updateBooksCounter();
    toggleShowMoreButton(filteredBooks.length > booksPerScreen);
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Error in displayBooks function',
      position: 'topRight',
    });
    showErrorState();
  }
}

// Create HTML markup for books list
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

// Filter valid categories
function filterValidCategories(categories) {
  return categories.filter(
    category =>
      category &&
      category.list_name &&
      category.list_name.trim() !== '' &&
      category.list_name.trim() !== ' ' &&
      category.list_name.toLowerCase() !== 'undefined' &&
      category.list_name.toLowerCase() !== 'null'
  );
}

// Create categories list in dropdown
async function createCategoryBooksList(arr) {
  // Filter valid category names
  const validCategories = arr.filter(
    categoryName =>
      categoryName &&
      categoryName.trim() !== '' &&
      categoryName.trim() !== ' ' &&
      categoryName.toLowerCase() !== 'undefined' &&
      categoryName.toLowerCase() !== 'null'
  );

  const markup = validCategories
    .map(item => `<li class="dropdown-item"><p>${item}</p></li>`)
    .join('');

  dropdownMenuEl.insertAdjacentHTML('beforeend', markup);
}

// Display books counter
export async function createShowCase(count, total) {
  showCountEl.innerHTML = '';
  const markup = `<p>Showing ${count} of ${total}</p>`;
  console.log(count, total);
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

// Book filtering function
function filterBooks(books) {
  const uniqueTitles = new Set();

  return books.filter(book => {
    // Remove books without title or with price 0.00
    if (!book.title || !book.price || parseFloat(book.price) <= 0) {
      return false;
    }

    // Normalize title (remove spaces and convert to lowercase)
    const normalizedTitle = book.title.trim().toLowerCase();

    // Check if this title already exists
    if (uniqueTitles.has(normalizedTitle)) {
      return false;
    }

    // Add title to unique set
    uniqueTitles.add(normalizedTitle);
    return true;
  });
}

// State management functions
export function updateAllBooks(books) {
  allTopBooks.length = 0;
  allTopBooks.push(...books);
}

export const showShowMoreBtn = () =>
  showMoreBtnEl.classList.remove('is-hidden');

export const hideShowMoreBtn = () => showMoreBtnEl.classList.add('is-hidden');

// Helper functions for improved displayBooks
function clearBooksContent() {
  topBooksListEl.innerHTML = '';
}

function showEmptyState() {
  topBooksListEl.innerHTML = '<li class="empty-state">No books found</li>';
}

function showErrorState() {
  topBooksListEl.innerHTML = '<li class="error-state">Error loading books</li>';
}

async function initializeCategories() {
  try {
    const allCategories = await getCategoryList();
    // Filter valid categories
    const validCategories = filterValidCategories(allCategories);
    const categoryNames = validCategories.map(category => category.list_name);
    createCategoryBooksList(categoryNames);
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Error initializing categories',
      position: 'topRight',
    });
  }
}

async function updateBooksCounter() {
  try {
    const totalCount = await getTotalBooksCount();

    const renderedCount = getPaginationValue();
    createShowCase(renderedCount, totalCount);
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Error updating books counter',
      position: 'topRight',
    });
  }
}

export { updateBooksCounter };

function toggleShowMoreButton(shouldShow) {
  if (shouldShow) {
    showShowMoreBtn();
  } else {
    hideShowMoreBtn();
  }
}

// App initialization functions
function extractBooksFromCategories(categoriesData) {
  if (!Array.isArray(categoriesData)) {
    iziToast.warning({
      title: 'Warning',
      message: 'Incorrect categories data',
      position: 'topRight',
    });
    return [];
  }

  return categoriesData.flatMap(category => {
    if (category && Array.isArray(category.books)) {
      return category.books;
    }
    return [];
  });
}

function showLoadingState() {
  const loadingEl = document.querySelector('.loading-indicator');
  if (loadingEl) {
    loadingEl.classList.remove('is-hidden');
  }
}

function hideLoadingState() {
  const loadingEl = document.querySelector('.loading-indicator');
  if (loadingEl) {
    loadingEl.classList.add('is-hidden');
  }
}

function showInitializationError() {
  topBooksListEl.innerHTML = `
    <li class="error-state">
      <p>Failed to load books. Please refresh the page.</p>
      <button onclick="location.reload()" class="retry-btn">Refresh</button>
    </li>
  `;
}

// App initialization function
async function initializeApp() {
  try {
    showLoadingState();

    const topBooksData = await getTopBooks();
    const initialBooks = extractBooksFromCategories(topBooksData);

    await displayBooks(initialBooks, {
      isInitialLoad: true,
      selectedCategory: INITIAL_CATEGORY,
      resetContent: true,
    });

    hideLoadingState();
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'App initialization error',
      position: 'topRight',
    });
    showInitializationError();
  }
}

// Dropdown menu creation function
export function createDropdown(selector) {
  const dropdown = document.querySelector(selector);
  const btn = dropdown.querySelector('.dropdown-btn');
  const menu = dropdown.querySelector('.dropdown-menu');
  const text = dropdown.querySelector('.dropdown-text');
  const items = dropdown.querySelectorAll('.dropdown-item');

  // Set initial value
  const selected = dropdown.querySelector('.dropdown-item.selected');
  if (selected) text.textContent = selected.textContent;

  // Open/close
  btn.onclick = () => dropdown.classList.toggle('open');

  // Item selection
  items.forEach(item => {
    item.onclick = () => {
      items.forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      text.textContent = item.textContent;
      dropdown.classList.remove('open');

      // Callback
      dropdown.dispatchEvent(
        new CustomEvent('change', {
          detail: { value: item.dataset.value, text: item.textContent },
        })
      );
    };
  });

  // Close when clicking outside element
  document.onclick = e => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  };
}

// App initialization
document.addEventListener('DOMContentLoaded', initializeApp);

// Dropdown initialization
createDropdown('#categoryDropdown');

// Empty event handler for dropdown (can be extended if needed)
document.querySelector('#categoryDropdown').addEventListener('change', e => {});
