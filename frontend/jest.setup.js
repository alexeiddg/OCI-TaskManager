// jest.setup.js
import '@testing-library/jest-dom';
import 'whatwg-fetch'; // Polyfill para fetch en jsdom

import { server } from './tests/mocks/server';

// Configura MSW para interceptar las requests
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
