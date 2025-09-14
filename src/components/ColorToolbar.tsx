import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useStore, useEvent } from 'effector-react';
import { drawingStore, setColor } from '../stores/drawing';

const ToolbarContainer = styled.div`
  position: fixed;
  top: 50%;
  right: 5px;
  transform: translateY(-50%);
  z-index: 1000;
`;

const ScrollContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  max-height: 80vh;
  overflow-y: auto;
  overflow-x: hidden;
  
  /* Стилизация скроллбара для WebKit браузеров */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
    transition: background 0.2s ease;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }
  
  /* Скрытие скроллбара на мобильных устройствах */
  @media (max-width: 768px) {
    &::-webkit-scrollbar {
      width: 4px;
    }
    
    /* Для Firefox */
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
  }
  
  /* Плавная прокрутка */
  scroll-behavior: smooth;
  
  /* Поддержка touch-событий */
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
`;

const ColorButton = styled.button<{ color: string; isActive: boolean }>`
  width: 50px;
  height: 50px;
  min-width: 50px;
  min-height: 50px;
  flex-shrink: 0;
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
    min-width: 40px;
    min-height: 40px;
  }
`;

const ScrollIndicator = styled.div<{ visible: boolean; direction: 'up' | 'down' }>`
  position: absolute;
  right: 0;
  ${props => props.direction === 'up' ? 'top: -10px;' : 'bottom: -10px;'}
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  display: ${props => props.visible ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 1001;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.1);
  }
  
  @media (max-width: 768px) {
    width: 16px;
    height: 16px;
    font-size: 10px;
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const handleColorChange = (colorValue: string) => {
    setColorEvent(colorValue);
    
    // Отправляем событие в Яндекс Метрику
    if (typeof ym !== 'undefined') {
      ym(104144056, 'reachGoal', 'change_color');
    }
  };

  const checkScrollability = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      setCanScrollUp(scrollTop > 0);
      setCanScrollDown(scrollTop < scrollHeight - clientHeight - 1);
    }
  };

  const scrollTo = (direction: 'up' | 'down') => {
    if (scrollRef.current) {
      const scrollAmount = 60; // Примерно высота одной кнопки + gap
      const currentScroll = scrollRef.current.scrollTop;
      const newScroll = direction === 'up' 
        ? Math.max(0, currentScroll - scrollAmount)
        : currentScroll + scrollAmount;
      
      scrollRef.current.scrollTo({
        top: newScroll,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    checkScrollability();
    
    const handleResize = () => {
      setTimeout(checkScrollability, 100);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ToolbarContainer>
      <ScrollIndicator 
        visible={canScrollUp} 
        direction="up"
        onClick={() => scrollTo('up')}
        title="Прокрутить вверх"
      >
        ↑
      </ScrollIndicator>
      
      <ScrollContainer 
        ref={scrollRef}
        onScroll={checkScrollability}
      >
        {colors.map((colorValue) => (
          <ColorButton
            key={colorValue}
            color={colorValue}
            isActive={color === colorValue}
            onClick={() => handleColorChange(colorValue)}
            title={colorValue}
          />
        ))}
      </ScrollContainer>
      
      <ScrollIndicator 
        visible={canScrollDown} 
        direction="down"
        onClick={() => scrollTo('down')}
        title="Прокрутить вниз"
      >
        ↓
      </ScrollIndicator>
    </ToolbarContainer>
  );
};
