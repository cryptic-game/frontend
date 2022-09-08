import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DesktopComponent } from './desktop.component';
import { DesktopGuard } from './desktop.guard';
import { DesktopDeviceResolver } from './desktop-device.resolver';

const routes: Routes = [
  {
    path: '',
    component: DesktopComponent,
    canActivate: [DesktopGuard],
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    resolve: { device: DesktopDeviceResolver },
    data: { animation: 'desktop' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DesktopRoutingModule {}
