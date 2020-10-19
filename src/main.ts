import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environmentLoader } from './environments/environmentLoader';

environmentLoader.then(env => {
  if (env.production) {
    enableProdMode();
  }

  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (const registration of registrations) {
      registration.unregister().then(() => console.log('Unregistered service worker'));
    }
  });

  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.log(err));
});
