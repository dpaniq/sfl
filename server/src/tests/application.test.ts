import {Application} from '../app';

describe('application.ts', () => {
  let application: Application;

  beforeAll(() => {
    application = new Application();
  });

  it('application should be defined', () => {
    expect(application).toBeDefined();
  });
});
