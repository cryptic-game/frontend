import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {DesktopComponent} from './desktop/desktop.component';
import {DesktopMenuComponent} from './desktop/desktop-menu/desktop-menu.component';
import {DesktopStartmenuComponent} from './desktop/desktop-startmenu/desktop-startmenu.component';
import {KontextmenuComponent} from './desktop/kontextmenu/kontextmenu.component';
import {DesktopSurfaceComponent} from './desktop/desktop-surface/desktop-surface.component';
import {HttpClientModule} from '@angular/common/http';
import {LoginService} from './login/login.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DesktopComponent,
    DesktopMenuComponent,
    DesktopStartmenuComponent,
    KontextmenuComponent,
    DesktopSurfaceComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    LoginService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
