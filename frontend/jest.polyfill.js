// jest.polyfills.js
const { TextEncoder, TextDecoder } = require("util");

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock manual de BroadcastChannel
global.BroadcastChannel = class {
  constructor(name) {
    this.name = name;
    this.onmessage = null;
  }
  postMessage(message) {
    if (this.onmessage) {
      this.onmessage({ data: message });
    }
  }
  close() {}
  addEventListener() {}
  removeEventListener() {}
};
