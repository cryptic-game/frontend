import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseComponentsRoutingModule } from './base-components-routing.module';
import { BaseComponentsComponent } from './base-components.component';
import {ButtonModule} from "../../core/components/buttons/button/button.module";
import {ButtonOutlineModule} from "../../core/components/buttons/button-outline/button-outline.module";
import {ButtonTextModule} from "../../core/components/buttons/button-text/button-text.module";


@NgModule({
  declarations: [
    BaseComponentsComponent
  ],
  imports: [
    CommonModule,
    BaseComponentsRoutingModule,
    ButtonModule,
    ButtonOutlineModule,
    ButtonTextModule
  ]
})
export class BaseComponentsModule { }