import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const modal = document.getElementById('modal');
const backdrop = document.getElementById('modalBackdrop');
const closeBtn = document.getElementById('modalClose');
const form = document.getElementById('registerForm');

// Ключі для localStorage
const STORAGE_KEY = 'register-form-data';

// Витягуємо посилання на поля
const nameInput = form.elements.name;
const emailInput = form.elements.email;
const messageInput = form.elements.message;

// ==============================
// 1. Збереження в localStorage
// ==============================
function saveToStorage() {
  const formData = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    message: messageInput.value.trim(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
}

// ==============================
// 2. Відновлення з localStorage
// ==============================
function restoreFromStorage() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;

  try {
    const data = JSON.parse(saved);
    if (data.name) nameInput.value = data.name;
    if (data.email) emailInput.value = data.email;
    if (data.message) messageInput.value = data.message;
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to restore saved data.',
      position: 'topRight',
    });
  }
}

// ==============================
// 3. Очистка після сабміту
// ==============================
function clearStorage() {
  localStorage.removeItem(STORAGE_KEY);
}

// ==============================
// 4. Відкриття та закриття
// ==============================
const openButtons = document.querySelectorAll('.open-modal-btn');
const subtitleEl = modal.querySelector('.modal-subtitle');

openButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const subtitle = btn.dataset.subtitle || '';
    subtitleEl.textContent = subtitle;
    openModal();
  });
});

function openModal() {
  modal.style.display = 'block';
  backdrop.style.display = 'block';
  document.body.classList.add('modal-open');
  restoreFromStorage();
}

function closeModal() {
  modal.style.display = 'none';
  backdrop.style.display = 'none';
  document.body.classList.remove('modal-open');
}

// ==============================
// 5. Обробники подій
// ==============================

closeBtn.addEventListener('click', closeModal);
backdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

[nameInput, emailInput, messageInput].forEach(input => {
  input.addEventListener('input', saveToStorage);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();

  if (!name || !email) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please fill out required fields: Name and Email',
      position: 'topRight',
    });
    return;
    }
    
    // Валідація email на наявність @
  if (!email.includes('@')) {
    iziToast.error({
      title: 'Invalid Email',
      message: 'Email must contain "@" symbol',
      position: 'topRight',
    });
    return;
  }

  try {
    // Емуляція помилки
    if (email === 'error@example.com') {
      throw new Error('Simulated server error');
    }

    iziToast.success({
      title: 'Success',
      message: 'Form submitted!',
      position: 'topRight',
    });

    form.reset();
    clearStorage();
    closeModal();

  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: `Something went wrong: ${error.message}`,
      position: 'topRight',
    });
  }
});

// Відкриваємо модалку автоматично для демонстрації
openModal();
