import getPayment from '../../getPayment';

describe('Получаем название платёжной системы функцией getPayment', () => {
  test.each([
    ['44', 'visa'],
    ['52', 'mastercard'],
    ['34', 'american-express'],
    ['6011', 'discover'],
    ['35', 'jcb'],
    ['36', 'diners'],
    ['22', 'mir'],
  ])('Получаем название платёжной системы для карты номер %s', (cardNumber, expected) => {
    const result = getPayment(cardNumber);
    expect(result).toBe(expected);
  });
});
