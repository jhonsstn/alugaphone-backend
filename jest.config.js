module.exports = {
  roots: ['<rootDir>/src'],
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  transform: {
    '.+\\.ts$': 'ts-jest',
  },
};
