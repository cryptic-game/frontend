import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ControlCenterComponent} from "./control-center.component";
import {ControlCenterGuard} from "./control-center.guard";
import {ControlCenterService} from "./control-center.service";
import {ControlCenterDevicePageComponent} from "./control-center-device-page/control-center-device-page.component";
import {
  ControlCenterDevicePageHardwareResolver
} from "./control-center-device-page/control-center-device-page-hardware.resolver";
import {
  ControlCenterCreateDevicePageComponent
} from "./control-center-create-device-page/control-center-create-device-page.component";
import {
  ControlCenterInventoryPageItemsResolver
} from "./control-center-inventory-page/control-center-inventory-page-items.resolver";
import {
  ControlCenterInventoryPageComponent
} from "./control-center-inventory-page/control-center-inventory-page.component";
import {
  ControlCenterSettingsPageComponent
} from "./control-center-settings-page/control-center-settings-page.component";
import {ControlCenterSoundPageComponent} from "./control-center-sound-page/control-center-sound-page.component";
import {ControlCenterNetworkPageComponent} from "./control-center-network-page/control-center-network-page.component";
import {
  ControlCenterChangelogPageComponent
} from "./control-center-changelog-page/control-center-changelog-page.component";

const routes: Routes = [
  {
    path: '',
    component: ControlCenterComponent,
    canActivate: [ControlCenterGuard],
    resolve: {
      devices: ControlCenterService
    },
    data: {animation: 'control-center'},
    children: [
      {
        path: 'device',
        component: ControlCenterDevicePageComponent,
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
        resolve: {hardware: ControlCenterDevicePageHardwareResolver}
      },
      {
        path: 'create-device',
        component: ControlCenterCreateDevicePageComponent,
        resolve: {inventoryItems: ControlCenterInventoryPageItemsResolver}
      },
      {
        path: 'inventory',
        component: ControlCenterInventoryPageComponent,
        resolve: {items: ControlCenterInventoryPageItemsResolver}
      },
      {path: 'settings', component: ControlCenterSettingsPageComponent},
      {path: 'sound', component: ControlCenterSoundPageComponent},
      {path: 'network', component: ControlCenterNetworkPageComponent},
      {path: 'changelog', component: ControlCenterChangelogPageComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControlCenterRoutingModule {
}
