import {Component, EventEmitter, Input, Output} from '@angular/core';

export type ButtonFlavor = 'primary' | 'success' | 'warning' | 'danger' | 'info';

@Component({
  selector: 'app-styled-button',
  templateUrl: './styled-button.component.html',
  styleUrls: ['./styled-button.component.scss']
})
export class StyledButtonComponent {

  @Input() public disabled = false;
  @Input() public flavor: ButtonFlavor = 'primary';

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() public onClick = new EventEmitter<MouseEvent>();
}
