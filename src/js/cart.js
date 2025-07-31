import iziToast from 'izitoast';

const [cartElDesktop, cartElMobile] =
  document.querySelectorAll('.cart-open-link');
const [badgeElDesktop, badgeElMobile] =
  document.querySelectorAll('.cart-badge');
const backdrop = document.querySelector('.js-backdrop-cart');
const closeBtn = document.querySelector('.js-close-btn-cart');
const cartList = document.querySelector('#cart-list');
// що має відображати корзина:
// - фото
// - назва книги
// - автор

const STORE_CART_KEY = 'stored-cart-booksy';
let books = [];
let cartListClickHandler;
let cartListInputHandler;
const CART_PLACEHOLDER = `<div style="text-align:center;margin:auto;" id="cart-total">Your cart is empty</div>`;

window.addEventListener('DOMContentLoaded', () => {
  books = getLocalStorage(STORE_CART_KEY) ?? [];
  setBadge(books.reduce((acc, el) => (acc += el.quantity), 0));
});

const onCartElClick = e => {
  e.preventDefault();
  openModal();
  renderCartHTML(books);
};

cartElDesktop.addEventListener('click', onCartElClick);
cartElMobile.addEventListener('click', onCartElClick);

function openModal() {
  backdrop.classList.add('is-open');
  const body = document.querySelector('body');
  body.classList.add('no-scroll');
}

function closeModal() {
  backdrop.classList.remove('is-open');
  const body = document.querySelector('body');
  body.classList.remove('no-scroll');
  const nextSibling = cartList.nextElementSibling;
  setTimeout(() => {
    nextSibling.remove();
  }, 300);
}

function onInputChange(e) {
  const input = e.target;
  if (!input.classList.contains('js-qty-input')) {
    return;
  }

  const li = input.closest('li');
  const bookId = li.dataset.id;
  const cartItem = findBookById(bookId, books);
  if (!cartItem) {
    return;
  }

  const quantityEl = li.querySelector('.quantity');
  const totalPriceEl = li.querySelector('.total-price');

  let newQty = Number(input.value);
  if (isNaN(newQty) || newQty < 1) {
    newQty = 1;
  }

  cartItem.quantity = newQty;

  quantityEl.textContent = `q-ty: ${newQty}`;
  totalPriceEl.textContent = `total: ${(parseFloat(cartItem.book.price) * newQty).toFixed(2)}`;
  input.value = newQty;
  setLocalStorage(STORE_CART_KEY, books);

  setBadge(books.reduce((acc, el) => acc + el.quantity, 0));
  updateTotal();
}

function onClickEvent(e) {
  const btn = e.target;
  if (btn.classList.contains('continue')) {
    handleContinue();
    return;
  }

  if (btn.classList.contains('buy')) {
    handleBuy();
    return;
  }

  const li = btn.closest('li');
  if (!li) {
    return;
  }

  const bookId = li.dataset.id;
  const cartItem = findBookById(bookId, books);
  if (!cartItem) {
    return;
  }

  const quantityEl = li.querySelector('.quantity');
  const totalPriceEl = li.querySelector('.total-price');
  const inputEl = li.querySelector('.js-qty-input');

  const price = parseFloat(cartItem.book.price);

  if (btn.classList.contains('decrease')) {
    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
      e.target.blur();
      updateItem();
    }
  }

  if (btn.classList.contains('increase')) {
    cartItem.quantity += 1;
    e.target.blur();
    updateItem();
  }

  if (btn.classList.contains('js-remove-book')) {
    removeItem();
  }

  function updateItem() {
    const newQty = cartItem.quantity;
    quantityEl.textContent = `q-ty: ${newQty}`;
    totalPriceEl.textContent = `total: ${(price * newQty).toFixed(2)}$`;
    inputEl.value = newQty;

    setBadge(books.reduce((acc, el) => acc + el.quantity, 0));
    setLocalStorage(STORE_CART_KEY, books);
    updateTotal();
  }
  function handleBuy() {
    clearCart();
    closeModal();

    iziToast.success({
      title: 'Hello',
      message: 'Thank you for your purchase!',
      position: 'topRight',
    });
  }
  function handleContinue() {
    closeModal();
  }

  function removeItem() {
    const { success } = removeFromCart(bookId);
    if (success) {
      setBadge(books.reduce((acc, el) => acc + el.quantity, 0));
      li.remove();
      setLocalStorage(STORE_CART_KEY, books);
      updateTotal();
    } else {
      console.warn('Woops');
    }
  }
}

const onCloseBtnClick = e => {
  closeModal();
};

closeBtn.addEventListener('click', onCloseBtnClick);
backdrop.addEventListener('click', e => {
  if (e.target === e.currentTarget) {
    closeModal();
  }
});

function findBookById(id) {
  const book = books.find(cartItem => cartItem.book._id === id);
  return book;
}

function addToCart(book, quantity = 1) {
  const bookId = book._id;
  const bookIndex = books.findIndex(cartItem => cartItem.book._id === bookId);

  if (bookIndex === -1) {
    const bookData = {
      quantity,
      book,
    };
    books.push(bookData);
  } else {
    books[bookIndex].quantity += quantity;
  }
  const totalQuantity = books.reduce((acc, el) => (acc += el.quantity), 0);
  setBadge(totalQuantity);
  setLocalStorage(STORE_CART_KEY, books);
}

function removeFromCart(id) {
  const bookIndex = books.findIndex(cartItem => cartItem.book._id === id);

  if (bookIndex < 0) {
    return { success: false };
  } else {
    books.splice(bookIndex, 1);
    setLocalStorage(STORE_CART_KEY, books);
    return { success: true };
  }
}

// function setBadge(quantity) {
//   if (!quantity) {
//     badgeElDesktop.textContent = '';
//     badgeElMobile.textContent = '';
//     ('visually-hidden');
//     return;
//   }

//   badgeElDesktop.textContent = quantity;
//   badgeElMobile.textContent = quantity;
// }

function setBadge(quantity) {
  const isHiddenDesktop = badgeElDesktop.classList.contains('visually-hidden');
  const isHiddenMobile = badgeElMobile.classList.contains('visually-hidden');

  if (!quantity) {
    badgeElDesktop.textContent = '';
    badgeElMobile.textContent = '';

    if (!isHiddenDesktop) {
      badgeElDesktop.classList.add('visually-hidden');
    }
    if (!isHiddenMobile) {
      badgeElMobile.classList.add('visually-hidden');
    }
    return;
  }

  const displayQuantity = quantity > 99 ? '99+' : quantity;

  badgeElDesktop.textContent = displayQuantity;
  badgeElMobile.textContent = displayQuantity;

  if (isHiddenDesktop) {
    badgeElDesktop.classList.remove('visually-hidden');
  }
  if (isHiddenMobile) {
    badgeElMobile.classList.remove('visually-hidden');
  }
}

function clearCart() {
  books = [];
  setLocalStorage(STORE_CART_KEY, []);
  setBadge(0);
}

function getLocalStorage(key) {
  const stored = localStorage.getItem(key);

  return stored ? JSON.parse(stored) : null;
}

function setLocalStorage(key, value) {
  localStorage.setItem(
    key,
    typeof value === 'string' ? value : JSON.stringify(value)
  );
}

// todo implement cleanup on unmount cart modal;

function renderCartHTML(books) {
  function generateCartMarkup(books) {
    return books
      .map(cartItem => {
        const { book: b, quantity } = cartItem;

        return `<li class="cart-item-inner" data-id="${b._id}">
        <div class="purchase-item-content">
                  <div class="purchase-item-head">
                  <p>${b.title}</p>
                    <img class="cart-item-img" src="${b.book_image}" alt="${b.title}" />
                  </div>

                  </div>
                  <div class="enter-value">
                  <div>
                    <p>price: ${parseFloat(b.price).toFixed(2)}$</p>
                    <p class="quantity">q-ty: ${quantity}</p>
                    <p class="total-price">total: ${(parseFloat(b.price) * quantity).toFixed(2)}$</p>
                  </div>
                    <div class="qty-group">
                      <button class="enter-value-btn decrease">-</button>
                      <input min="1" class="js-qty-input qty-input" value="${quantity}" />
                      <button class="enter-value-btn increase">+</button>
                    </div>
                    <button class="js-remove-book remove-book">remove</button>
                  </div>
                </li>`;
      })
      .join('');
  }

  function generateTotalBlock() {
    const totalPrice = books
      .reduce((acc, el) => (acc += el.quantity * parseFloat(el.book.price)), 0)
      .toFixed(2);
    const totalQty = books.reduce((acc, el) => (acc += el.quantity), 0);

    if (!parseInt(totalPrice) || !totalQty) {
      return CART_PLACEHOLDER;
    }

    return ` <div class="cart-total" id="cart-total">
              <ul>
                <li>
                <p id="cart-total-price">Total: ${totalPrice}$</p>
                <p id="cart-total-qty">Amount: ${totalQty}</p>
                </li>
              </ul>
              <ul class="total-buttons">
                <li><button class="remove-book continue">Keep shopping</button></li>
                <li><button class="remove-book buy">BUY</button></li>
              </ul>
            </div>`;
  }

  cartList.innerHTML = generateCartMarkup(books);
  cartList.insertAdjacentHTML('afterend', generateTotalBlock());
  const nextSibling = cartList.nextElementSibling;

  cartListClickHandler = onClickEvent;
  cartListInputHandler = onInputChange;

  nextSibling.addEventListener('click', cartListClickHandler);
  cartList.addEventListener('click', cartListClickHandler);
  cartList.addEventListener('input', cartListInputHandler);
}

function updateTotal() {
  const totalEl = backdrop.querySelector('#cart-total');
  const totalPriceEl = totalEl.querySelector('#cart-total-price');
  const totalQtyEl = totalEl.querySelector('#cart-total-qty');

  const totalPrice = books
    .reduce((acc, el) => (acc += el.quantity * parseFloat(el.book.price)), 0)
    .toFixed(2);
  const totalQty = books.reduce((acc, el) => (acc += el.quantity), 0);

  if (!parseInt(totalPrice) || !totalQty) {
    totalEl.innerHTML = CART_PLACEHOLDER;
    return;
  }

  totalPriceEl.textContent = `Total: ${totalPrice}$`;
  totalQtyEl.textContent = `Amount: ${totalQty}`;
}
export { addToCart, renderCartHTML };
