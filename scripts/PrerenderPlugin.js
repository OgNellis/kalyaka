const fs = require('fs');
const path = require('path');

class PrerenderPlugin {
  constructor(options = {}) {
    this.options = {
      template: options.template || 'public/index.html',
      output: options.output || 'dist/index.html',
      ...options
    };
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync('PrerenderPlugin', (compilation, callback) => {
      try {
        console.log('🚀 Запуск пререндеринга...');
        
        // Читаем HTML файл
        const htmlPath = path.resolve(compiler.outputPath, 'index.html');
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        
        // Создаем пререндеренный контент
        const prerenderedContent = this.generatePrerenderedContent();
        
        // Заменяем пустой root на пререндеренный контент
        const updatedHtml = htmlContent.replace(
          '<div id="root"></div>', 
          `<div id="root">${prerenderedContent}</div>`
        );
        
        // Записываем результат
        fs.writeFileSync(htmlPath, updatedHtml);
        
        console.log('✅ Пререндеринг завершен!');
        callback();
        
      } catch (error) {
        console.error('❌ Ошибка при пререндеринге:', error);
        callback(error);
      }
    });
  }

  generatePrerenderedContent() {
    return `
      <div style="width: 100vw; height: 100vh; position: relative; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">
        <!-- Основной canvas контейнер -->
        <div style="position: absolute; top: 0; left: 0; width: 100vw; height: 100vh; display: flex; justify-content: center; align-items: center; background: white;">
          <canvas style="background: white; cursor: crosshair; touch-action: none;" width="1920" height="1080"></canvas>
        </div>
        
        <!-- Пререндеренный интерфейс -->
        <div style="position: absolute; top: 20px; left: 20px; background: rgba(255,255,255,0.95); padding: 15px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); backdrop-filter: blur(10px);">
          <h2 style="margin: 0; color: #333; font-size: 20px; font-weight: 600;">Kalyaka</h2>
          <p style="margin: 8px 0 0 0; color: #666; font-size: 14px;">Онлайн рисовалка готова к работе</p>
        </div>
        
        <!-- Индикатор загрузки -->
        <div style="position: absolute; bottom: 20px; right: 20px; background: rgba(255,255,255,0.9); padding: 10px 15px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 12px; height: 12px; border-radius: 50%; background: #4CAF50; animation: pulse 2s infinite;"></div>
            <span style="color: #333; font-size: 12px;">Готово</span>
          </div>
        </div>
        
        <!-- CSS для анимации -->
        <style>
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        </style>
      </div>
    `;
  }
}

module.exports = PrerenderPlugin;
