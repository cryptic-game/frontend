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
    useValue: Sentry.createErrorHandler({showDialog: true})
  });
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
