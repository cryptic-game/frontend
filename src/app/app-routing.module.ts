import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: '', loadChildren: () => import('./control-center/control-center.module').then(m => m.ControlCenterModule)},
  {path: 'desktop', loadChildren: () => import('./desktop/desktop.module').then(m => m.DesktopModule)},
  {path: '', loadChildren: () => import('./account/account.module').then(m => m.AccountModule)},
  {path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {relativeLinkResolution: "legacy"})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
