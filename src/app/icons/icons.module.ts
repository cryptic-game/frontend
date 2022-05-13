import {NgModule} from '@angular/core';

import {TablerIconsModule} from 'angular-tabler-icons';
import {IconBriefcase, IconDeviceDesktop, IconAffiliate, IconUser, IconLifebuoy, IconBug, IconActivity, IconCode, IconLicense, IconVolume} from 'angular-tabler-icons/icons';


const icons = {
  IconBriefcase,
  IconDeviceDesktop,
  IconAffiliate,
  IconUser,
  IconLifebuoy,
  IconBug,
  IconActivity,
  IconCode,
  IconLicense,
  IconVolume
};



@NgModule({
  declarations: [],
  imports: [
    TablerIconsModule.pick(icons)
  ],
  exports: [
    TablerIconsModule
  ]
})
export class IconsModule { }
