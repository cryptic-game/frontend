import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwitchComponent } from './switch.component';



@NgModule({
  declarations: [
    SwitchComponent
  ],
  exports: [
    SwitchComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SwitchModule { }
