module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testRegex: "./tests/.+\\.test\\.ts$",
  moduleNameMapper: {
    "^~(.*)": "<rootDir>/src/$1",
  },
};
