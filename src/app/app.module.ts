import {HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {DesktopComponent} from './desktop/desktop.component';
import {DesktopMenuComponent} from './desktop/desktop-menu/desktop-menu.component';
import {DesktopStartmenuComponent} from './desktop/desktop-startmenu/desktop-startmenu.component';
import {ContextMenuComponent} from './desktop/context-menu/context-menu.component';
import {DesktopSurfaceComponent} from './desktop/desktop-surface/desktop-surface.component';
import {SignUpComponent} from './sign-up/sign-up.component';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: '', component: DesktopComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignUpComponent},
  {path: '**', redirectTo: '/'}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DesktopComponent,
    DesktopMenuComponent,
    DesktopStartmenuComponent,
    ContextMenuComponent,
    DesktopSurfaceComponent,
    SignUpComponent
  ],
  imports: [RouterModule.forRoot(routes), BrowserModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
