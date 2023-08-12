import isLuhnValid from './validateCards'
import getPaymentBank from './getPaymentBank'


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

        this.element.addEventListener('input', (this.onInput))
        this.element.addEventListener('submit', (this.onSubmit))
    }

    onInput(e) {
        e.preventDefault();

        let cardNumber = this.input.value;
        const cardImages = document.querySelectorAll('.card');

        if (cardNumber.length < 8) {
            cardImages.forEach(cardImage => cardImage.classList.remove('active'));
            this.input.classList.remove('valid');
            this.input.classList.remove('invalid');
        }

        if (isLuhnValid(cardNumber)) {
            this.input.classList.add('valid');
            this.input.classList.remove('invalid');
            const bank = getPaymentBank(cardNumber);
            if (bank !== 'unknown') {
                const cardImage = Array.from(cardImages).find(image => image.getAttribute('data-id') === bank);
                if (cardImage) {
                    cardImages.forEach(cardImage => cardImage.classList.remove('active'));
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
        const bank = getPaymentBank(cardNumber);
        const cardImages = document.querySelectorAll('.card');

        try {
            if(isLuhnValid(cardNumber) && bank !== 'unknown') {
                alert('Номер валидный! Ваша платежная система: ' + bank);
            } else if(isLuhnValid(cardNumber) && bank === 'unknown') {
                throw new Error('Неопределенна платежная система банка');
            } else {
                throw new Error('Номер не валидный');
            }
        } catch (e) {
            alert(e.message);
        }

        cardImages.forEach(cardImage => cardImage.classList.remove('active'));
        this.input.value = '';
    }
}