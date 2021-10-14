import 'jest-preset-angular/setup-jest';

/**
 * Begin warning suppression for material core and hammerjs
 */
const WARN_SUPPRESSING_PATTERNS = [/Could not find Angular Material core theme/, /Could not find HammerJS/];

const warn = console.warn;

Object.defineProperty(console, 'warn', {
  value: (...params: string[]) => {
    if (!WARN_SUPPRESSING_PATTERNS.some((pattern) => pattern.test(params[0]))) {
      warn(...params);
    }
  },
});
/**
 * End warning suppression for material core and hammerjs
 */

/**
 * Used to clean up local storage so that each test has a fresh local storage.
 */
global.afterEach(() => {
  localStorage.clear();
});
