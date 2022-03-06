import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

if (environment.production) {
  enableProdMode();
}

navigator.serviceWorker.getRegistrations().then(registrations => {
  for (const registration of registrations) {
    registration.unregister().then(() => console.info('Unregistered service worker'));
  }
});

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));

