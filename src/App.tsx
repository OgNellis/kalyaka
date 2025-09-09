import React from 'react';
import styled from 'styled-components';
import { DrawingCanvas } from './components/DrawingCanvas';
import { Toolbar } from './components/Toolbar';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  padding: 2rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin: 0 0 1rem 0;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-weight: 800;
`;

const Subtitle = styled.p`
  font-size: 1.3rem;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
`;

const MainContent = styled.main`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 2rem;
  flex-wrap: wrap;
  max-width: 1400px;
  margin: 0 auto;
`;

const CanvasSection = styled.section`
  flex: 1;
  min-width: 300px;
`;

const ToolbarSection = styled.section`
  flex: 0 0 auto;
`;

const App: React.FC = () => {
  return (
    <AppContainer>
      <Header>
        <Title>🎨 Kalyaka - Рисовалка для детей</Title>
        <Subtitle>Рисуй мышкой или пальцем на планшете!</Subtitle>
      </Header>
      
      <MainContent>
        <CanvasSection>
          <DrawingCanvas width={800} height={600} />
        </CanvasSection>
        
        <ToolbarSection>
          <Toolbar />
        </ToolbarSection>
      </MainContent>
    </AppContainer>
  );
};

export { App };
