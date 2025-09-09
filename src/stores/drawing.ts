import { createStore, createEvent } from 'effector';

export interface DrawingState {
  color: string;
  brushSize: number;
  isDrawing: boolean;
}

// События
export const setColor = createEvent<string>();
export const setBrushSize = createEvent<number>();
export const setIsDrawing = createEvent<boolean>();
export const clearCanvas = createEvent();

// Store
export const drawingStore = createStore<DrawingState>({
  color: '#ff6b6b',
  brushSize: 10,
  isDrawing: false,
})
  .on(setColor, (state, color) => ({ ...state, color }))
  .on(setBrushSize, (state, brushSize) => ({ ...state, brushSize }))
  .on(setIsDrawing, (state, isDrawing) => ({ ...state, isDrawing }));
