import '@testing-library/jest-dom';

// Simple ResizeObserver polyfill for test environment (used by recharts ResponsiveContainer)
// Vitest uses jsdom which doesn't implement ResizeObserver by default.
class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
}

(global as any).ResizeObserver = ResizeObserver;
