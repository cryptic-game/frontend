import {NgModule} from '@angular/core';

import {TablerIconsModule} from 'angular-tabler-icons';
import {IconBriefcase, IconDeviceDesktop, IconAffiliate, IconUser, IconLifebuoy, IconBug, IconActivity, IconCode, IconLicense} from 'angular-tabler-icons/icons';


const icons = {
  IconBriefcase,
  IconDeviceDesktop,
  IconAffiliate,
  IconUser,
  IconLifebuoy,
  IconBug,
  IconActivity,
  IconCode,
  IconLicense
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
