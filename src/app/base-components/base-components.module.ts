import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseComponentsRoutingModule } from './base-components-routing.module';
import { BaseComponentsComponent } from './base-components.component';
import {ButtonModule} from "../../core/components/buttons/button/button.module";
import {ButtonOutlineModule} from "../../core/components/buttons/button-outline/button-outline.module";
import {ButtonTextModule} from "../../core/components/buttons/button-text/button-text.module";
import { ProgressbarComponent } from 'src/core/components/progressbar/progressbar.component';

@NgModule({
  declarations: [
    BaseComponentsComponent,
    ProgressbarComponent
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
