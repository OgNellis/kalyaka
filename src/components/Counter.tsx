import React from 'react';
import styled from 'styled-components';
import { useStore, useEvent } from 'effector-react';
import { counterStore, increment, decrement, reset } from '../stores/counter';

const CounterContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const CounterValue = styled.div`
  font-size: 4rem;
  font-weight: bold;
  margin: 1rem 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ResetButton = styled(Button)`
  background: rgba(255, 99, 99, 0.3);
  border-color: rgba(255, 99, 99, 0.5);

  &:hover {
    background: rgba(255, 99, 99, 0.5);
    border-color: rgba(255, 99, 99, 0.7);
  }
`;

export const Counter: React.FC = () => {
  const count = useStore(counterStore);
  const incrementEvent = useEvent(increment);
  const decrementEvent = useEvent(decrement);
  const resetEvent = useEvent(reset);

  return (
    <CounterContainer>
      <h2>Счетчик</h2>
      <CounterValue>{count}</CounterValue>
      <ButtonGroup>
        <Button onClick={decrementEvent}>
          -1
        </Button>
        <Button onClick={incrementEvent}>
          +1
        </Button>
        <ResetButton onClick={resetEvent}>
          Сброс
        </ResetButton>
      </ButtonGroup>
    </CounterContainer>
  );
};
