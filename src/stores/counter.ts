import { createStore, createEvent } from 'effector';

// События
export const increment = createEvent();
export const decrement = createEvent();
export const reset = createEvent();

// Store
export const counterStore = createStore(0)
  .on(increment, (state) => state + 1)
  .on(decrement, (state) => state - 1)
  .reset(reset);
