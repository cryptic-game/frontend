import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from './text-input.component';



@NgModule({
  declarations: [
    TextInputComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TextInputComponent
  ]
})
export class TextInputModule { }
