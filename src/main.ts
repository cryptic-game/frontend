import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

loadEnvironment()
  .then(env => {
    if (env.production) {
      enableProdMode();
    }

    platformBrowserDynamic()
      .bootstrapModule(AppModule)
      .catch(err => console.error(err));
  });

async function loadEnvironment(): Promise<{ api: string; production: boolean }> {
  const response = await fetch('./assets/api.json');

  if (response.status === 200) {
    try {
      const {url}: { url: string } = await response.json();
      environment.api = url;
    } catch (e) {
    }
  }

  return environment;
}
