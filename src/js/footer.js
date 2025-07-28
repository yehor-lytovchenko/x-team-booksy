import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.footer-form');
  const input = document.querySelector('.footer-form-input');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = input.value.trim();

    if (email === '') {
      input.classList.add('error');

      iziToast.error({
        title: 'Error',
        message: 'Email field cannot be empty',
        position: 'topRight',
        timeout: 4000,
      });
      return;
    }

    if (!input.checkValidity()) {
      input.classList.add('error');

      iziToast.error({
        title: 'Error',
        message: 'Please enter a valid email format (example@domain.com)',
        position: 'topRight',
        timeout: 4000,
      });
      return;
    }

    const existEmails =
      JSON.parse(localStorage.getItem('subscribedEmails')) || [];
    if (existEmails.some(item => item.email === email)) {
      input.classList.add('error');

      iziToast.warning({
        title: 'Warning',
        message: 'You are already subscribed with this email address',
        position: 'topRight',
        timeout: 4000,
      });
      return;
    }

    saveEmailToStorage(email);

    input.value = '';

    iziToast.success({
      title: 'Success!',
      message: 'Thank you! Your email has been successfully submitted.',
      position: 'topRight',
      timeout: 4000,
      theme: 'light',
    });
  });

  input.addEventListener('input', function () {
    this.classList.remove('error');
  });

  function saveEmailToStorage(email) {
    let emails = JSON.parse(localStorage.getItem('subscribedEmails')) || [];

    emails.push({
      email: email,
    });

    localStorage.setItem('subscribedEmails', JSON.stringify(emails));
  }
});
