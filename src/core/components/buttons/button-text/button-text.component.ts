import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ButtonFlavor} from "../button/button.component";

@Component({
  selector: 'design-button-text',
  templateUrl: './button-text.component.html',
  styleUrls: ['./button-text.component.scss']
})
export class ButtonTextComponent {

  @Input() public disabled = false;
  @Input() public flavor: ButtonFlavor = 'primary';

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() public onClick = new EventEmitter<MouseEvent>();
}
