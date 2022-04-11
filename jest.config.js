module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/*.test.(ts|tsx)", "**/tests/*/*.test.(ts|tsx)"],
  clearMocks: true,
};
