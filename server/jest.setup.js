const crypto = require('crypto');
const uuid = require('uuid');

Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: () => crypto.randomUUID(),
  },
});

Object.defineProperty(globalThis, 'uuid', {
  value: {
    parse: (value) => uuid.parse(value),
  },
});
