import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { init as Sentry, setTag } from '@sentry/angular';

if (environment.production) {
  Sentry({
    dsn: 'https://201e994a90e7465495a4937fc36eb7c7@glitchtip.cryptic-game.net/7',
    autoSessionTracking: false,
  });

  setTag('host', location.host);

  enableProdMode();
}

navigator.serviceWorker?.getRegistrations().then((registrations) => {
  for (const registration of registrations) {
    registration.unregister().then(() => console.info('Unregistered service worker'));
  }
});

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
