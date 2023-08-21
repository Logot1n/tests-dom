import isLuhnValid from '../../validateCards';

describe('isLuhnValid', () => {
  test('Проверка валидности номера на true', () => {
    const result = isLuhnValid('4916631193071088');
    expect(result).toBe(true);
  });

  test('Проверка валидности номера на false', () => {
    const result = isLuhnValid('212121');
    expect(result).toBe(false);
  });
});
