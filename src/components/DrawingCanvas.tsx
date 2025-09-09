import React, { useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useStore, useEvent } from 'effector-react';
import { drawingStore, setIsDrawing, clearCanvas, saveToHistory, undo } from '../stores/drawing';

const CanvasContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
`;

const Canvas = styled.canvas`
  background: white;
  cursor: crosshair;
  touch-action: none;
  
  &:active {
    cursor: grabbing;
  }
`;

export const DrawingCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { color, brushSize, isDrawing, history, historyIndex } = useStore(drawingStore);
  const setIsDrawingEvent = useEvent(setIsDrawing);
  const saveToHistoryEvent = useEvent(saveToHistory);
  const undoEvent = useEvent(undo);

  const getPointFromEvent = useCallback((e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    let clientX: number, clientY: number;

    if (e instanceof MouseEvent) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    return {
      x: (clientX - rect.left),
      y: (clientY - rect.top),
    };
  }, []);

  const startDrawing = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    setIsDrawingEvent(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Сохраняем текущее состояние в историю перед началом рисования
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    saveToHistoryEvent(imageData);

    const point = getPointFromEvent(e);
    
    // Применяем текущие настройки
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = color;
    ctx.shadowBlur = 1;
    
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
  }, [color, brushSize, getPointFromEvent, setIsDrawingEvent, saveToHistoryEvent]);

  const draw = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const point = getPointFromEvent(e);
    
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  }, [isDrawing, getPointFromEvent]);

  const stopDrawing = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    setIsDrawingEvent(false);
  }, [setIsDrawingEvent]);

  const clearCanvasHandler = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Очищаем весь canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  const resizeCanvasHandler = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Увеличиваем разрешение для сглаживания
    const devicePixelRatio = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    
    // Масштабируем canvas для отображения
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    
    // Масштабируем контекст
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }
  }, []);

  useEffect(() => {
    resizeCanvasHandler();
    
    // Сохраняем пустое состояние в историю при инициализации
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        saveToHistoryEvent(imageData);
      }
    }
  }, [saveToHistoryEvent]);

  // Слушаем событие очистки из store
  useEffect(() => {
    const unsubscribe = clearCanvas.watch(clearCanvasHandler);
    return unsubscribe;
  }, [clearCanvasHandler]);

  // Слушаем событие отмены из store
  useEffect(() => {
    const unsubscribe = undo.watch(() => {
      const canvas = canvasRef.current;
      if (!canvas || history.length === 0) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Восстанавливаем состояние из истории
      if (historyIndex >= 0 && history[historyIndex]) {
        ctx.putImageData(history[historyIndex], 0, 0);
      } else {
        // Если нет истории, очищаем canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    });
    return unsubscribe;
  }, [history, historyIndex]);

  // Обновляем настройки canvas при изменении цвета или размера кисти
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = color;
    ctx.shadowBlur = 1;
  }, [color, brushSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // resizeCanvas();
    window.addEventListener('resize', resizeCanvasHandler);

    // Настройка canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = color;
    ctx.shadowBlur = 1;

    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Touch events
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing, { passive: false });

    return () => {
      window.removeEventListener('resize', resizeCanvasHandler);
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);
      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDrawing);
    };
  }, [startDrawing, draw, stopDrawing, color, brushSize]);


  return (
    <CanvasContainer>
      <Canvas ref={canvasRef} />
    </CanvasContainer>
  );
};
