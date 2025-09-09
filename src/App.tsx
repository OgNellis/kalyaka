import React from 'react';
import styled from 'styled-components';
import { DrawingCanvas } from './components/DrawingCanvas';
import { TopToolbar } from './components/TopToolbar';
import { ColorToolbar } from './components/ColorToolbar';
import { BrushToolbar } from './components/BrushToolbar';

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

const App: React.FC = () => {
  return (
    <AppContainer>
      <DrawingCanvas />
      <TopToolbar />
      <ColorToolbar />
      <BrushToolbar />
    </AppContainer>
  );
};

export { App };
