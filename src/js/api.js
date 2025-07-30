import axios from 'axios';
import iziToast from 'izitoast';

axios.defaults.baseURL = 'https://books-backend.p.goit.global/books/';

let categoriesCache = null;
let totalBooksCache = null;

// Gets list of book categories
export async function getCategoryList() {
  if (categoriesCache !== null) {
    return categoriesCache;
  }

  try {
    const response = await axios.get('category-list');
    // Filter out empty or invalid categories
    const filteredCategories = response.data.filter(
      category =>
        category &&
        category.list_name &&
        category.list_name.trim() !== '' &&
        category.list_name.trim() !== ' '
    );
    categoriesCache = filteredCategories;
    return filteredCategories;
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to load categories',
      position: 'topRight',
    });
    return [];
  }
}

// Gets list of top books
export async function getTopBooks() {
  try {
    const response = await axios.get('top-books');
    return response.data;
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to load top books',
      position: 'topRight',
    });
    return [];
  }
}

// Gets books by category
export async function getBooksByCategory(category) {
  try {
    const encodedCategory = encodeURIComponent(category);
    const response = await axios.get(`category?category=${encodedCategory}`);

    return response.data;
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: `Failed to load books for category: ${category}`,
      position: 'topRight',
    });
    return [];
  }
}

// Gets book information by ID
export async function getBooksById(id) {
  try {
    const response = await axios.get(id);
    return response.data;
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to load book details',
      position: 'topRight',
    });
    return [];
  }
}

// Gets all unique books from all categories
export async function getTotalBooks() {
  if (totalBooksCache !== null) {
    return totalBooksCache;
  }
  try {
    const categories = await getCategoryList();
    if (!categories || !Array.isArray(categories)) {
      return [];
    }
    const categoryNames = categories
      .filter(category => category.list_name)
      .map(category => category.list_name);

    const booksDataArrays = await Promise.all(
      categoryNames.map(getBooksByCategory)
    );

    const allBooks = booksDataArrays.flat();

    // Filter duplicates and books with zero price
    const uniqueTitles = new Set();
    const filteredBooks = allBooks.filter(book => {
      // Remove books without title or with price 0.00
      if (!book.title || !book.price || parseFloat(book.price) <= 0) {
        return false;
      }

      const normalizedTitle = book.title.trim().toLowerCase();
      if (uniqueTitles.has(normalizedTitle)) {
        return false;
      }

      uniqueTitles.add(normalizedTitle);
      return true;
    });

    totalBooksCache = filteredBooks;
    return filteredBooks;
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to load all books',
      position: 'topRight',
    });
    return [];
  }
}

// Counts number of books in specific category
export async function getCountBooksByCategory(category) {
  if (!category || category.trim() === '') {
    return 0;
  }

  try {
    const encodedCategory = encodeURIComponent(category);
    const response = await axios.get(`category?category=${encodedCategory}`);
    return response.data.length;
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: `Failed to count books in category: ${category}`,
      position: 'topRight',
    });
    return 0;
  }
}
