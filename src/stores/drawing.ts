import { createStore, createEvent } from 'effector';

export interface DrawingState {
  color: string;
  brushSize: number;
  isDrawing: boolean;
  history: ImageData[];
  historyIndex: number;
}

// События
export const setColor = createEvent<string>();
export const setBrushSize = createEvent<number>();
export const setIsDrawing = createEvent<boolean>();
export const clearCanvas = createEvent();
export const saveToHistory = createEvent<ImageData>();
export const undo = createEvent();

// Store
export const drawingStore = createStore<DrawingState>({
  color: '#ff6b6b',
  brushSize: 10,
  isDrawing: false,
  history: [],
  historyIndex: -1,
})
  .on(setColor, (state, color) => ({ ...state, color }))
  .on(setBrushSize, (state, brushSize) => ({ ...state, brushSize }))
  .on(setIsDrawing, (state, isDrawing) => ({ ...state, isDrawing }))
  .on(saveToHistory, (state, imageData) => {
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(imageData);
    return {
      ...state,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    };
  })
  .on(undo, (state) => {
    if (state.historyIndex >= 0) {
      return {
        ...state,
        historyIndex: state.historyIndex - 1,
      };
    }
    return state;
  });
