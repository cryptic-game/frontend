import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DesktopMenuComponent } from './desktop/desktop-menu/desktop-menu.component';
import { DesktopStartmenuComponent } from './desktop/desktop-startmenu/desktop-startmenu.component';
import { KontextmenuComponent } from './desktop/kontextmenu/kontextmenu.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DesktopMenuComponent,
    DesktopStartmenuComponent,
    KontextmenuComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
