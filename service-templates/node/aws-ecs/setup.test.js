global.console = {
  error: jest.fn(),
  // Keep native behaviour for other methods, use those to print out things in your own tests, not `console.log`
  warn: console.warn, // eslint-disable-line no-console
  info: console.info, // eslint-disable-line no-console
  debug: console.debug, // eslint-disable-line no-console
  log: console.log, // eslint-disable-line no-console
};
