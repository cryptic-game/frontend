import {Component, EventEmitter, Input, Output} from '@angular/core';

export type ButtonFlavor = 'primary' | 'success' | 'warning' | 'danger' | 'info';

@Component({
  selector: 'design-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {

  @Input() public disabled = false;
  @Input() public flavor: ButtonFlavor = 'primary';

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() public onClick = new EventEmitter<MouseEvent>();
}
