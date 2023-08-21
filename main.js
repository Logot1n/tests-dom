/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/validateCards.js
function isLuhnValid(number) {
  // Преобразование номера в строку и удаление пробелов
  const strippedNumber = String(number).replace(/\s/g, '');

  // Проверка, что номер состоит только из цифр
  if (!/^\d+$/.test(strippedNumber)) {
    return false;
  }
  let sum = 0;
  let isEven = false;

  // Итерация по цифрам номера справа налево
  for (let i = strippedNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(strippedNumber.charAt(i), 10);

    // Удваиваем цифру на четных позициях
    if (isEven) {
      digit *= 2;

      // Если результат больше 9, вычитаем 9
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    isEven = !isEven;
  }

  // Номер валиден, если сумма делится на 10 без остатка
  return sum % 10 === 0;
}
;// CONCATENATED MODULE: ./src/js/getPayment.js
function getPayment(cardNumber) {
  const prefixes = {
    visa: /^(4)/,
    mastercard: /^(51|52|53|54|55)/,
    americanExpress: /^(34|37)/,
    discover: /^(60)/,
    jcb: /^(31|35)/,
    diners: /^(30|36|38)/,
    mir: /^(2)/
  };
  for (const [system, prefix] of Object.entries(prefixes)) {
    if (prefix.test(cardNumber)) {
      return system;
    }
  }
  return 'unknown';
}
;// CONCATENATED MODULE: ./src/js/widget.js


class PaymentWidget {
  constructor(container) {
    this.container = container;
    this.onInput = this.onInput.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.element = null;
    this.submit = null;
    this.input = null;
  }
  static get markup() {
    return `
            <form class="payment-form-widget">
                <div class="form-control">
                    <input class="card-number" data-id="card-number" type="text">
                    <button class="card-submit">Click to validate</button>
                </div>
            </form>
        `;
  }
  bindToDom() {
    this.container.innerHTML += PaymentWidget.markup;
    this.element = this.container.querySelector('.payment-form-widget');
    this.submit = this.container.querySelector('.card-submit');
    this.input = this.container.querySelector('.card-number');
    this.element.addEventListener('input', this.onInput);
    this.element.addEventListener('submit', this.onSubmit);
  }
  createMessage(messageText) {
    const dialogDiv = document.querySelector('.dialog');
    if (dialogDiv) {
      dialogDiv.remove();
    }
    const dialog = document.createElement('div');
    dialog.classList.add('dialog');
    const message = document.createElement('span');
    message.classList.add('message');
    message.textContent = messageText;
    const closeButton = document.createElement('button');
    closeButton.classList.add('button-close');
    closeButton.textContent = 'OK';
    closeButton.addEventListener('click', () => {
      dialog.remove();
    });
    dialog.appendChild(message);
    dialog.appendChild(closeButton);
    return dialog;
  }
  onInput(e) {
    e.preventDefault();
    const cardNumber = this.input.value;
    const cardImages = document.querySelectorAll('.card');
    if (cardNumber.length < 8) {
      cardImages.forEach(cardImage => cardImage.classList.remove('active'));
      this.input.classList.remove('valid');
      this.input.classList.remove('invalid');
    }
    if (isLuhnValid(cardNumber)) {
      this.input.classList.add('valid');
      this.input.classList.remove('invalid');
      const payment = getPayment(cardNumber);
      if (payment !== 'unknown') {
        const cardImage = Array.from(cardImages).find(image => image.getAttribute('data-id') === payment);
        if (cardImage) {
          cardImages.forEach(image => image.classList.remove('active'));
          cardImage.classList.add('active');
        }
      }
    } else {
      this.input.classList.remove('valid');
      this.input.classList.add('invalid');
    }
  }
  onSubmit(e) {
    e.preventDefault();
    const cardNumber = this.input.value;
    const payment = getPayment(cardNumber);
    const cardImages = document.querySelectorAll('.card');
    try {
      if (isLuhnValid(cardNumber) && payment !== 'unknown') {
        const message = this.createMessage(`Номер валиден! Ваша платежная система: ${payment}`);
        this.container.appendChild(message);
      } else if (isLuhnValid(cardNumber) && payment === 'unknown') {
        const message = this.createMessage('Неопределенна платежная система банка');
        this.container.appendChild(message);
      } else {
        const message = this.createMessage('Номер не валиден');
        this.container.appendChild(message);
      }
    } catch (e) {
      const message = this.createMessage(e);
      this.container.appendChild(message);
    }
    cardImages.forEach(cardImage => cardImage.classList.remove('active'));
    this.input.value = '';
  }
}
;// CONCATENATED MODULE: ./src/js/app.js

const container = document.querySelector('.container');
const app_form = new PaymentWidget(container);
app_form.bindToDom();

// Точка входа приложения
;// CONCATENATED MODULE: ./src/index.js



// Точка входа Webpack
/******/ })()
;