import puppeteer  from 'puppeteer';
import { fork } from 'child_process';

jest.setTimeout(10000); // default puppeteer timeout

describe('Credit Card Validator form', () => {
  let browser;
  let page;
  let server;
  const baseUrl = 'http://localhost:9000';

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
      headless: false,
      slowMo: 250,
      devtools: true,
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
    server.kill();
  });

  test('Форма и карточки должны появиться при открытии сайта', async () => {
    await page.goto(baseUrl);

    await page.waitForSelector('cards-group');
    await page.waitForSelector('payment-form-widget');
  });

  test('Проверка валидации номера карты', async () => {
    try {
        await page.goto(baseUrl);
        await page.waitForSelector('payment-form-widget');

        const form = await page.$('payment-form-widget');
        const input = await form.$('card-input');
        const submit = await form.$('.submit');

        await input.type('4929440455898021');
        await submit.click();
        await page.waitForFunction(() => alert);
        const alertText = await page.evaluate(() => alert.textContent);

        expect(alertText).toContain('Номер валидный! Ваша платежная система:');
    } catch (e) {
        throw new Error('Номер не валидный');
    }
  })
});