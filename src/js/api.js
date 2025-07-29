import axios, { all } from 'axios';

axios.defaults.baseURL = 'https://books-backend.p.goit.global/books/';

let categoriesCache = null;
let totalBooksCache = null;

// Получает список категорий книг
export async function getCategoryList() {
  if (categoriesCache !== null) {
    return categoriesCache;
  }

  try {
    const response = await axios.get('category-list');
    categoriesCache = response.data;
    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

// Получает список топовых книг
export async function getTopBooks() {
  try {
    const response = await axios.get('top-books');
    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

// Получает книги по категории
export async function getBooksByCategory(category) {
  try {
    const encodedCategory = encodeURIComponent(category);
    const response = await axios.get(`category?category=${encodedCategory}`);

    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

// Получает информацию о книге по ID
export async function getBooksById(id) {
  try {
    const response = await axios.get(id);

    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

// Считает общее количество книг во всех категориях
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

    const uniqueTitle = new Set();
    const uniqueBooks = allBooks.filter(book => {
      if (!book.title) return false;
      const normalizeTitle = book.title.trim().toLowerCase();
      if (uniqueTitle.has(normalizeTitle)) return false;
      uniqueTitle.add(normalizeTitle);
      return true;
    });

    totalBooksCache = uniqueBooks;
    return uniqueBooks;
  } catch (error) {
    console.log(error);
    return [];
  }
}

// Считает общее количество книг в определенной категории
export async function getCountBooksByCategory(category) {
  if (!category || category.trim() === '') {
    return 0;
  }

  try {
    const encodedCategory = encodeURIComponent(category);
    const response = await axios.get(`category?category=${encodedCategory}`);
    return response.data.length;
  } catch (error) {
    console.log(error);
    return [];
  }
}
