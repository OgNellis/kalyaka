const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Функция для пререндеринга с использованием Puppeteer
async function prerender() {
  let browser;
  
  try {
    console.log('🚀 Начинаем пререндеринг с Puppeteer...');
    
    // Запускаем браузер
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Устанавливаем размер viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Читаем HTML файл из dist
    const htmlPath = path.resolve(__dirname, '../dist/index.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // Устанавливаем содержимое страницы
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    // Ждем загрузки React приложения
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Ждем немного для полной загрузки
    await page.waitForTimeout(2000);
    
    // Получаем отрендеренный HTML
    const renderedHtml = await page.content();
    
    // Записываем результат обратно в dist
    fs.writeFileSync(htmlPath, renderedHtml);
    
    console.log('✅ Пререндеринг завершен успешно!');
    console.log(`📁 HTML обновлен в: ${htmlPath}`);
    
  } catch (error) {
    console.error('❌ Ошибка при пререндеринге:', error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Запускаем пререндеринг
prerender();
