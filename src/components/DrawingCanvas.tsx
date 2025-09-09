import React, { useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useStore, useEvent } from 'effector-react';
import { drawingStore, setIsDrawing, clearCanvas } from '../stores/drawing';

const CanvasContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;
`;

const Canvas = styled.canvas`
  border: 3px solid #e9ecef;
  border-radius: 15px;
  background: white;
  cursor: crosshair;
  touch-action: none;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  
  &:active {
    cursor: grabbing;
  }
`;

interface DrawingCanvasProps {
  width?: number;
  height?: number;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ 
  width = 800, 
  height = 600 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { color, brushSize, isDrawing } = useStore(drawingStore);
  const setIsDrawingEvent = useEvent(setIsDrawing);

  const getPointFromEvent = useCallback((e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX: number, clientY: number;

    if (e instanceof MouseEvent) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }, []);

  const startDrawing = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    setIsDrawingEvent(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const point = getPointFromEvent(e);
    
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [color, brushSize, getPointFromEvent, setIsDrawingEvent]);

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

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Слушаем событие очистки из store
  useEffect(() => {
    const unsubscribe = clearCanvas.watch(clearCanvasHandler);
    return unsubscribe;
  }, [clearCanvasHandler]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Настройка canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

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
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);
      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDrawing);
    };
  }, [startDrawing, draw, stopDrawing]);


  return (
    <CanvasContainer>
      <Canvas
        ref={canvasRef}
        width={width}
        height={height}
      />
    </CanvasContainer>
  );
};
