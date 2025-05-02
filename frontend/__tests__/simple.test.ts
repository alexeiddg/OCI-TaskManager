// __tests__/simple.test.ts
import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextDecoder, TextEncoder });


test('true equals true', () => {
  expect(true).toBe(true);
});