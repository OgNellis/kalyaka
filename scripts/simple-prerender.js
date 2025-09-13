const fs = require('fs');
const path = require('path');

// Простой пререндеринг без внешних зависимостей
function simplePrerender() {
  try {
    console.log('🚀 Начинаем простой пререндеринг...');
    
    // Читаем HTML файл из dist
    const htmlPath = path.resolve(__dirname, '../dist/index.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // Создаем базовый HTML с пререндеренным контентом
    const prerenderedContent = `
      <div id="root">
        <div style="width: 100vw; height: 100vh; position: relative; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">
          <div style="position: absolute; top: 0; left: 0; width: 100vw; height: 100vh; display: flex; justify-content: center; align-items: center; background: white;">
            <canvas style="background: white; cursor: crosshair; touch-action: none;" width="1920" height="1080"></canvas>
          </div>
          <!-- Пререндеренные элементы интерфейса -->
          <div style="position: absolute; top: 20px; left: 20px; background: rgba(255,255,255,0.9); padding: 10px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="margin: 0; color: #333; font-size: 18px;">Kalyaka - Онлайн Рисовалка</h2>
            <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Готов к рисованию...</p>
          </div>
        </div>
      </div>
    `;
    
    // Заменяем пустой root на пререндеренный контент
    const updatedHtml = htmlContent.replace(
      '<div id="root"></div>', 
      prerenderedContent
    );
    
    // Записываем результат
    fs.writeFileSync(htmlPath, updatedHtml);
    
    console.log('✅ Простой пререндеринг завершен!');
    console.log(`📁 HTML обновлен в: ${htmlPath}`);
    
  } catch (error) {
    console.error('❌ Ошибка при пререндеринге:', error);
    process.exit(1);
  }
}

// Запускаем пререндеринг
simplePrerender();
