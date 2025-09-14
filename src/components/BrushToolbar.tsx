import React from 'react';
import styled from 'styled-components';
import { useStore, useEvent } from 'effector-react';
import { drawingStore, setBrushSize } from '../stores/drawing';

const ToolbarContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 5px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 1000;
`;

const BrushSizeButton = styled.button<{ size: number; isActive: boolean }>`
  width: 60px;
  height: 60px;
  border: 3px solid ${props => props.isActive ? '#007bff' : 'rgba(255, 255, 255, 0.8)'};
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
  }
`;

const BrushPreview = styled.div<{ size: number; isActive: boolean }>`
  width: ${props => Math.min(props.size * 2, 40)}px;
  height: ${props => Math.min(props.size * 2, 40)}px;
  background: ${props => props.isActive ? '#007bff' : '#666'};
  border-radius: 50%;
  transition: all 0.2s ease;

  @media (max-width: 768px) {
    width: ${props => Math.min(props.size * 1.5, 30)}px;
    height: ${props => Math.min(props.size * 1.5, 30)}px;
  }
`;

const brushSizes = [
  { size: 5, label: 'Тонкая' },
  { size: 10, label: 'Средняя' },
  { size: 20, label: 'Толстая' },
  { size: 30, label: 'Очень толстая' }
];

export const BrushToolbar: React.FC = () => {
  const { brushSize } = useStore(drawingStore);
  const setBrushSizeEvent = useEvent(setBrushSize);

  const handleBrushSizeChange = (size: number) => {
    setBrushSizeEvent(size);
    
    // Отправляем событие в Яндекс Метрику
    if (typeof ym !== 'undefined') {
      ym(104144056, 'reachGoal', 'change_size');
    }
  };

  return (
    <ToolbarContainer>
      {brushSizes.map(({ size, label }) => (
        <BrushSizeButton
          key={size}
          size={size}
          isActive={brushSize === size}
          onClick={() => handleBrushSizeChange(size)}
          title={label}
        >
          <BrushPreview size={size} isActive={brushSize === size} />
        </BrushSizeButton>
      ))}
    </ToolbarContainer>
  );
};
