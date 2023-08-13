import { fork } from 'child_process';
import puppeteer from 'puppeteer';

jest.setTimeout(30000); // default puppeteer timeout

describe('Credit Card Validator form', () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = 'http://localhost:9000/';

  beforeAll(async () => {
    server = fork(`${__dirname}/e2e.server.js`);
    await new Promise((resolve, reject) => {
      server.on('error', reject);
      server.on('message', (message) => {
        if (message === 'ok') {
          resolve();
        }
      });
    });

    browser = await puppeteer.launch({
      headless: 'new',
      slowMo: 1,
      devtools: true,
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
    server.kill();
  });

  test('Проверка валидного номера карты', async () => {
    await page.goto(baseUrl);

    const form = await page.$('.payment-form-widget');
    const input = await form.$('.card-number');
    const submit = await form.$('.card-submit');

    await input.type('4929440455898021');
    await submit.click();

    expect(await page.$eval('.message', (elem) => elem.innerText)).toBe('Номер валиден! Ваша платежная система: visa');
  });

  test('Проверка номера карты с неопределенной платежной системой', async () => {
    await page.goto(baseUrl);

    const form = await page.$('.payment-form-widget');
    const input = await form.$('.card-number');
    const submit = await form.$('.card-submit');

    await input.type('5020797568741371');
    await submit.click();

    expect(await page.$eval('.message', (elem) => elem.innerText)).toBe('Неопределенна платежная система банка');
  });

  test('Проверка невалидного номера карты', async () => {
    await page.goto(baseUrl);

    const form = await page.$('.payment-form-widget');
    const input = await form.$('.card-number');
    const submit = await form.$('.card-submit');

    await input.type('212121');
    await submit.click();

    expect(await page.$eval('.message', (elem) => elem.innerText)).toBe('Номер не валиден');
  });

  test('Проверка подсветки карточек', async () => {
    await page.goto(baseUrl);

    const form = await page.$('.payment-form-widget');
    const input = await form.$('.card-number');

    await input.type('4929440455898021');
    const payment = await page.$eval('img.active', (card) => card.getAttribute('data-id'));

    expect(payment).toBe('visa');
  });
});
