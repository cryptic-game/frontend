import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ButtonFlavor} from "../button/button.component";

@Component({
  selector: 'design-button-outline',
  templateUrl: './button-outline.component.html',
  styleUrls: ['./button-outline.component.scss']
})
export class ButtonOutlineComponent {

  @Input() public disabled = false;
  @Input() public flavor: ButtonFlavor = 'primary';

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() public onClick = new EventEmitter<MouseEvent>();
}
