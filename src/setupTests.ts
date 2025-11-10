import '@testing-library/jest-dom';
// Use a proper ResizeObserver polyfill for tests so components relying on
// ResizeObserver (e.g. recharts ResponsiveContainer) behave more realistically.
import { ResizeObserver as JuggleResizeObserver } from '@juggle/resize-observer';

(global as any).ResizeObserver = JuggleResizeObserver;
