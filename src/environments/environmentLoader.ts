import { environment } from './environment';

export const environmentLoader = new Promise<{ api: string, production: boolean }>((resolve => {
  const request = new XMLHttpRequest();
  request.open('GET', './assets/api.json', true);
  request.onload = () => {
    if (request.status === 200) {
      try {
        environment.api = JSON.parse(request.responseText)['url'];
        resolve(environment);
      } catch (e) {
        resolve(environment);
      }
    } else {
      resolve(environment);
    }
  };
  request.send();
}));
