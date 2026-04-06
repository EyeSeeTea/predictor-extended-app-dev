declare module "*.png";

// Vitest + @testing-library/jest-dom types are not included in this project yet.
// We only need matchers for test assertions.
declare module "@testing-library/jest-dom/matchers";

// `qs` doesn't ship types in this repo.
declare module "qs";
