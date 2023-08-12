import puppetteer from 'puppeteer';
import { fork } from 'child_process';

jest.setTimeout(30000); // default puppeteer timeout

describe('Credit Card Validator form', () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = 'http://localhost:9000/';

  beforeEach(async () => {
    server = fork(`${__dirname}/e2e.server.js`);
    await new Promise((resolve, reject) => {
      server.on('error', reject);
      server.on('message', (message) => {
        if (message === 'ok') {
          resolve();
        }
      });
    });

    browser = await puppetteer.launch({
      headless: false,
      slowMo: 100,
      devtools: true,
    });
    page = await browser.newPage();
  });

  afterEach(async () => {
    await browser.close();
    server.kill();
  });

  test('Форма и карточки должны появиться при открытии сайта', async () => {
    await page.goto(baseUrl);

    await page.waitForSelector('.cards-group');
    await page.waitForSelector('.payment-form-widget');
  });

  test('Проверка валидного номера карты', async () => {
    await page.goto(baseUrl);
    await page.waitForSelector('.payment-form-widget');
    await page.waitForSelector('.cards-group');

    const form = await page.$('.payment-form-widget');
    const input = await form.$('.card-number');
    const submit = await form.$('.card-submit');
    const cardGroup = await page.$('.cards-group');

    await input.type('4929440455898021');
    await submit.click();
    const bank = await cardGroup.$('.card .active');
    
    await page.waitForSelector('.dialog');
    const dialog = await page.$('.dialog');
    const message = await dialog.$('.message');
    await page.evaluate((message, bank) => {
      message.textContent = `Номер валидный! Ваша платежная система: ${bank}`;
    }, message, bank);
  });

  test('Проверка невалидного номера карты', async () => {
    await page.goto(baseUrl);
    await page.waitForSelector('.payment-form-widget');
    await page.waitForSelector('.cards-group');

    const form = await page.$('.payment-form-widget');
    const input = await form.$('.card-number');
    const submit = await form.$('.card-submit');

    await input.type('5020797568741371');
    await submit.click();
    await page.waitForSelector('.dialog');
    const dialog = await page.$('.dialog');
    const message = await dialog.$('.message');
    await page.evaluate(message => {
      message.textContent = `Неопределенна платежная система банка`;
    }, message);
  })

  test('Проверка невалидного номера карты', async () => {
    await page.goto(baseUrl);
    await page.waitForSelector('.payment-form-widget');
    await page.waitForSelector('.cards-group');

    const form = await page.$('.payment-form-widget');
    const input = await form.$('.card-number');
    const submit = await form.$('.card-submit');

    await input.type('212121');
    await submit.click();
    await page.waitForSelector('.dialog');
    const dialog = await page.$('.dialog');
    const message = await dialog.$('.message');
    await page.evaluate(message => {
      message.textContent = `Номер не валидный`;
    }, message);
  })
});
