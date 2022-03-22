import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'design-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent {

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() public onChange = new EventEmitter<InputEvent>();
}
