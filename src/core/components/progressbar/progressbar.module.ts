import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressbarComponent } from './progressbar.component';


@NgModule({
  declarations: [
    ProgressbarComponent
  ],
  exports: [
    ProgressbarComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ProgressbarModule { }
