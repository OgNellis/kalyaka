import React from 'react';
import styled from 'styled-components';
import { useStore, useEvent } from 'effector-react';
import { drawingStore, undo } from '../stores/drawing';

const UndoButtonContainer = styled.div`
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 1000;
`;

const UndoButton = styled.button<{ disabled: boolean }>`
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 50%;
  background: ${props => props.disabled ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.9)'};
  backdrop-filter: blur(10px);
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props => props.disabled ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 1)'};
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.disabled ? '0 4px 15px rgba(0, 0, 0, 0.1)' : '0 6px 20px rgba(0, 0, 0, 0.15)'};
  }

  &:active {
    transform: ${props => props.disabled ? 'none' : 'translateY(0)'};
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

const UndoIcon = styled.svg<{ disabled: boolean }>`
  width: 24px;
  height: 24px;
  fill: ${props => props.disabled ? '#999' : '#333'};
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
  }
`;

export const UndoButtonComponent: React.FC = () => {
  const { historyIndex } = useStore(drawingStore);
  const undoEvent = useEvent(undo);

  const canUndo = historyIndex >= 0;

  return (
    <UndoButtonContainer>
      <UndoButton 
        disabled={!canUndo}
        onClick={canUndo ? undoEvent : undefined}
        title={canUndo ? 'Отменить последнее действие' : 'Нет действий для отмены'}
      >
        <UndoIcon disabled={!canUndo} viewBox="0 0 24 24">
          <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/>
        </UndoIcon>
      </UndoButton>
    </UndoButtonContainer>
  );
};
