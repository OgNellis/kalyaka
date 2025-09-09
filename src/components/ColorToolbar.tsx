import React from 'react';
import styled from 'styled-components';
import { useStore, useEvent } from 'effector-react';
import { drawingStore, setColor } from '../stores/drawing';

const ToolbarContainer = styled.div`
  position: fixed;
  top: 50%;
  right: 5px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  z-index: 1000;
`;

const ColorButton = styled.button<{ color: string; isActive: boolean }>`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 3px solid ${props => props.isActive ? '#007bff' : 'rgba(255, 255, 255, 0.8)'};
  background-color: ${props => props.color};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(5px);

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

const colors = [
  '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4',
  '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd',
  '#00d2d3', '#ff9f43', '#10ac84', '#ee5a24',
  '#c44569', '#f8b500', '#6c5ce7', '#a29bfe'
];

export const ColorToolbar: React.FC = () => {
  const { color } = useStore(drawingStore);
  const setColorEvent = useEvent(setColor);

  return (
    <ToolbarContainer>
      {colors.map((colorValue) => (
        <ColorButton
          key={colorValue}
          color={colorValue}
          isActive={color === colorValue}
          onClick={() => setColorEvent(colorValue)}
          title={colorValue}
        />
      ))}
    </ToolbarContainer>
  );
};
