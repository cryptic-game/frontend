import {ErrorHandler, NgModule, Provider} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {RouteReuseStrategy} from '@angular/router';
import {AppRouteReuseStrategy} from './app-route-reuse-strategy';
import {ContextMenuModule} from "../core/components/context-menu/context-menu.module";
import {AppRoutingModule} from "./app-routing.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import * as Sentry from "@sentry/angular";
import {environment} from 'src/environments/environment';

const providers: Provider[] = [{provide: RouteReuseStrategy, useClass: AppRouteReuseStrategy}];

if (environment.production) {
  providers.push({
    provide: ErrorHandler,
    useValue: Sentry.createErrorHandler({
      showDialog: true,
      dialogOptions: {
        onLoad: () => {
          tryRemove('id_name', 'User');
          tryRemove('id_email', 'user@cryptic-game.net');
        }
      }
    })
  });
}

function tryRemove(id: string, value: string) {
  const emailInput = document.getElementById(id) as HTMLInputElement | null;

  if (!emailInput) {
    setTimeout(() => tryRemove(id, value), 100);
    return;
  }

  emailInput.value = value;
  emailInput.parentElement!.style.display = 'none';
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ContextMenuModule.forRoot()
  ],
  providers,
  bootstrap: [AppComponent]
})
export class AppModule {
}
