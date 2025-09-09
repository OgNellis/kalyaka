import React from 'react';
import styled from 'styled-components';
import { useStore, useEvent } from 'effector-react';
import { drawingStore, setColor, setBrushSize, clearCanvas } from '../stores/drawing';

const ToolbarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;
  min-width: 200px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionTitle = styled.h3`
  margin: 0;
  color: #495057;
  font-size: 1.1rem;
  font-weight: 600;
`;

const ColorPalette = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
`;

const ColorButton = styled.button<{ color: string; isActive: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid ${props => props.isActive ? '#007bff' : 'transparent'};
  background-color: ${props => props.color};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const BrushSizeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const BrushSizeButton = styled.button<{ size: number; isActive: boolean }>`
  padding: 0.5rem 1rem;
  border: 2px solid ${props => props.isActive ? '#007bff' : '#e9ecef'};
  border-radius: 10px;
  background: ${props => props.isActive ? '#007bff' : 'white'};
  color: ${props => props.isActive ? 'white' : '#495057'};
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    border-color: #007bff;
    background: #007bff;
    color: white;
  }

  &::after {
    content: '';
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    width: ${props => props.size}px;
    height: ${props => props.size}px;
    background: ${props => props.isActive ? 'white' : '#495057'};
    border-radius: 50%;
  }
`;

const ActionButton = styled.button`
  padding: 1rem 2rem;
  border: none;
  border-radius: 15px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const colors = [
  '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4',
  '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd',
  '#00d2d3', '#ff9f43', '#10ac84', '#ee5a24',
  '#c44569', '#f8b500', '#6c5ce7', '#a29bfe'
];

const brushSizes = [
  { size: 5, label: 'Тонкая' },
  { size: 10, label: 'Средняя' },
  { size: 20, label: 'Толстая' },
  { size: 30, label: 'Очень толстая' }
];

export const Toolbar: React.FC = () => {
  const { color, brushSize } = useStore(drawingStore);
  const setColorEvent = useEvent(setColor);
  const setBrushSizeEvent = useEvent(setBrushSize);
  const clearCanvasEvent = useEvent(clearCanvas);

  const handleSave = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'мой-рисунок.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <ToolbarContainer>
      <Section>
        <SectionTitle>🎨 Цвета</SectionTitle>
        <ColorPalette>
          {colors.map((colorValue) => (
            <ColorButton
              key={colorValue}
              color={colorValue}
              isActive={color === colorValue}
              onClick={() => setColorEvent(colorValue)}
              title={colorValue}
            />
          ))}
        </ColorPalette>
      </Section>

      <Section>
        <SectionTitle>🖌️ Размер кисти</SectionTitle>
        <BrushSizeContainer>
          {brushSizes.map(({ size, label }) => (
            <BrushSizeButton
              key={size}
              size={size}
              isActive={brushSize === size}
              onClick={() => setBrushSizeEvent(size)}
            >
              {label}
            </BrushSizeButton>
          ))}
        </BrushSizeContainer>
      </Section>

      <Section>
        <SectionTitle>⚡ Действия</SectionTitle>
        <ActionButton onClick={clearCanvasEvent}>
          🗑️ Очистить
        </ActionButton>
        <ActionButton onClick={handleSave}>
          💾 Сохранить
        </ActionButton>
      </Section>
    </ToolbarContainer>
  );
};
