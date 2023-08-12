import isLuhnValid from './validateCards';
import getPayment from './getPayment';

export default class PaymentWidget {
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

    this.element.addEventListener('input', (this.onInput));
    this.element.addEventListener('submit', (this.onSubmit));
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
      cardImages.forEach((cardImage) => cardImage.classList.remove('active'));
      this.input.classList.remove('valid');
      this.input.classList.remove('invalid');
    }

    if (isLuhnValid(cardNumber)) {
      this.input.classList.add('valid');
      this.input.classList.remove('invalid');
      const payment = getPayment(cardNumber);
      if (payment !== 'unknown') {
        const cardImage = Array.from(cardImages).find((image) => image.getAttribute('data-id') === payment);
        if (cardImage) {
          cardImages.forEach((image) => image.classList.remove('active'));
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

    cardImages.forEach((cardImage) => cardImage.classList.remove('active'));
    this.input.value = '';
  }
}
