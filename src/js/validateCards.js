export default function isLuhnValid(number) {
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