import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonComponent} from './button/button.component';
import {TextFieldComponent} from './text-field/text-field.component';
import {FormGroupComponent} from './form-group/form-group.component';

@NgModule({
  declarations: [
    ButtonComponent,
    TextFieldComponent,
    FormGroupComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ButtonComponent,
    TextFieldComponent,
    FormGroupComponent
  ]
})
export class DesignModule {
}
