import { isDevMode } from '@angular/core';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const environment = {
  API_KEY: 'https://sfl.com:3001/rest',
  providers: [
    provideStoreDevtools({
      maxAge: 25,
      autoPause: true,
      trace: false,
      traceLimit: 75,
      connectInZone: true,
      logOnly: !isDevMode(),
    }),
  ],
};
