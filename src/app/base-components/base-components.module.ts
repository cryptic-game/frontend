import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseComponentsRoutingModule } from './base-components-routing.module';
import { BaseComponentsComponent } from './base-components.component';


@NgModule({
  declarations: [
    BaseComponentsComponent
  ],
  imports: [
    CommonModule,
    BaseComponentsRoutingModule
  ]
})
export class BaseComponentsModule { }
