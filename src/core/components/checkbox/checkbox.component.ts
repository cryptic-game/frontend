import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'design-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent {

  @Input() disabled: boolean = false;

  @Input() checked: boolean = false;

  @Input() label: string = '';
  @Input() id: string;
  @Input() name: string;

}
