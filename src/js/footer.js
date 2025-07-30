import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.footer-form');
  const input = document.querySelector('.footer-form-input');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const trimmedValue = input.value.trim();
    if (trimmedValue === '') {
      input.classList.add('error');

      iziToast.error({
        title: 'Error',
        message: 'Email field cannot be empty',
        position: 'topRight',
        timeout: 4000,
      });
      return;
    }

    input.value = trimmedValue;

    if (!input.checkValidity()) {
      input.classList.add('error');

      let errorMessage = 'Please enter a valid email address';

      if (input.validity.valueMissing) {
        errorMessage = 'Email field cannot be empty';
      } else if (input.validity.typeMismatch) {
        errorMessage = 'Please enter a valid email format (example@domain.com)';
      } else if (input.validity.patternMismatch) {
        errorMessage =
          'Email format not supported. Use simple format like name@domain.com';
      }

      iziToast.error({
        title: 'Error',
        message: errorMessage,
        position: 'topRight',
        timeout: 4000,
      });
      return;
    }

    const existingEmails =
      JSON.parse(localStorage.getItem('subscribedEmails')) || [];
    if (existingEmails.some(item => item.email === trimmedValue)) {
      input.classList.add('error');

      iziToast.warning({
        title: 'Warning',
        message: 'You are already subscribed with this email address',
        position: 'topRight',
        timeout: 4000,
      });
      return;
    }

    saveEmailToStorage(trimmedValue);
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
