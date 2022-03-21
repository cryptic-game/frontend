import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseComponentsRoutingModule } from './base-components-routing.module';
import { BaseComponentsComponent } from './base-components.component';
import {ButtonModule} from "../../core/components/button/button.module";


@NgModule({
  declarations: [
    BaseComponentsComponent
  ],
  imports: [
    CommonModule,
    BaseComponentsRoutingModule,
    ButtonModule
  ]
})
export class BaseComponentsModule { }
