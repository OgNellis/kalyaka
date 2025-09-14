import React from 'react';
import styled from 'styled-components';
import { useEvent } from 'effector-react';
import { clearCanvas } from '../stores/drawing';

const ToolbarContainer = styled.div`
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 1000;
`;

const ActionButton = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  color: #333;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);

  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }
`;

const ClearButton = styled(ActionButton)`
  background: rgba(255, 99, 99, 0.9);
  color: white;
  border-color: rgba(255, 99, 99, 0.3);

  &:hover {
    background: rgba(255, 99, 99, 1);
  }
`;

const SaveButton = styled(ActionButton)`
  background: rgba(76, 175, 80, 0.9);
  color: white;
  border-color: rgba(76, 175, 80, 0.3);

  &:hover {
    background: rgba(76, 175, 80, 1);
  }
`;

export const TopToolbar: React.FC = () => {
  const clearCanvasEvent = useEvent(clearCanvas);

  const handleClear = () => {
    clearCanvasEvent();
    
    // Отправляем событие в Яндекс Метрику
    if (typeof ym !== 'undefined') {
      ym(104144056, 'reachGoal', 'clear_button');
    }
  };

  const handleSave = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      // Создаем новый canvas с белым фоном
      const exportCanvas = document.createElement('canvas');
      const exportCtx = exportCanvas.getContext('2d');
      
      if (!exportCtx) return;
      
      // Устанавливаем размеры нового canvas
      exportCanvas.width = canvas.width;
      exportCanvas.height = canvas.height;
      
      // Заливаем белым фоном
      exportCtx.fillStyle = '#ffffff';
      exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
      
      // Рисуем содержимое оригинального canvas поверх белого фона
      exportCtx.drawImage(canvas, 0, 0);
      
      // Создаем ссылку для скачивания
      const link = document.createElement('a');
      link.download = 'мой-рисунок.png';
      link.href = exportCanvas.toDataURL('image/png');
      link.click();
      
      // Отправляем событие в Яндекс Метрику
      if (typeof ym !== 'undefined') {
        ym(104144056, 'reachGoal', 'image_download');
      }
    }
  };

  return (
    <ToolbarContainer>
      <ClearButton onClick={handleClear}>
        🗑️ Очистить
      </ClearButton>
      <SaveButton onClick={handleSave}>
        💾 Сохранить
      </SaveButton>
    </ToolbarContainer>
  );
};
