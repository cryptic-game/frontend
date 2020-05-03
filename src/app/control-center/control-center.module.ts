import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ControlCenterComponent } from './control-center.component';
import { ControlCenterSidebarComponent } from './control-center-sidebar/control-center-sidebar.component';
import { ControlCenterSidebarMenuComponent } from './control-center-sidebar-menu/control-center-sidebar-menu.component';
import { ControlCenterDevicePageComponent } from './control-center-device-page/control-center-device-page.component';
import { ControlCenterCreateDevicePageComponent } from './control-center-create-device-page/control-center-create-device-page.component';
import { ControlCenterSettingsPageComponent } from './control-center-settings-page/control-center-settings-page.component';
import { ControlCenterChangelogPageComponent } from './control-center-changelog-page/control-center-changelog-page.component';
import { ControlCenterSoundPageComponent } from './control-center-sound-page/control-center-sound-page.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    ControlCenterComponent,
    ControlCenterSidebarComponent,
    ControlCenterSidebarMenuComponent,
    ControlCenterDevicePageComponent,
    ControlCenterCreateDevicePageComponent,
    ControlCenterSettingsPageComponent,
    ControlCenterSoundPageComponent,
    ControlCenterChangelogPageComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    RouterModule
  ]
})
export class ControlCenterModule {
}
