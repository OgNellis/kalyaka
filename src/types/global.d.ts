// Глобальные типы для приложения

// Яндекс Метрика
declare global {
  interface Window {
    ym: (counterId: number, method: string, target: string, params?: any) => void;
  }
  
  // Глобальная функция ym
  const ym: (counterId: number, method: string, target: string, params?: any) => void;
}

export {};
