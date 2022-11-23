import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'design-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss']
})
export class SwitchComponent {

  @Input() disabled: boolean = false;

  @Input() checked: boolean = false;
  @Output() checkedChange = new EventEmitter<boolean>();

  @Input() label: string = '';
  @Input() id: string;
  @Input() name: string;

  onChange() {
    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
  }

}
