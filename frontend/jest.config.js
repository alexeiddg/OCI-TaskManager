// jest.config.js
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // Ajusta si usas aliases como "@/components/..."
    "^.+\\.(css|scss|sass)$": "identity-obj-proxy",
  },
  clearMocks: true,
};

module.exports = createJestConfig(customJestConfig);
