import PaymentWidget from './widget';

const container = document.querySelector('.container');
const form = new PaymentWidget(container);

form.bindToDom();

// Точка входа приложения