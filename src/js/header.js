
const burgerEl = document.querySelector('#burger-button')
const menuEl = document.querySelector('#mobile_menu')
const navListEl = document.querySelector('#nav-links')
// ? Відкриває мобільне меню
const onBurgerClick = (e) => {
    menuEl.classList.add("mob-menu-open")
}

// ? Закриває мобільне меню
const closeMenuHandler = (e) => {
    // ! Шукає найближчого предка по селектору, якщо такого нема - повертає null
    const button = e.target.closest('button')
    const navLink = e.target.closest('.nav-list-mob-link');
    // ! null = false, якщо хоча б один елемент наявний, провірка проходить далі
  if (button || navLink) {
    menuEl.classList.remove('mob-menu-open');
  }
}

// ? ховає або показує потрібний бургер в залежності від в'юпорта 
const hideElement = () => {
    if (window.innerWidth >= 768) {
        navListEl.classList.remove('visually-hidden');
        burgerEl.classList.add('visually-hidden');
    }
    else {
        burgerEl.classList.remove('visually-hidden');
        navListEl.classList.add('visually-hidden');
    }
}

hideElement() // ? Провірка в'юпорта при загрузці сторінки
burgerEl.addEventListener('click', onBurgerClick);
menuEl.addEventListener('click', closeMenuHandler)
window.addEventListener('resize', hideElement)