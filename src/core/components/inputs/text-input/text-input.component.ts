import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'design-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent {

  @Input() placeholder: string = "Placeholder";
  @Input() hintText: string = "This is a small hint.";
  @Input() label: string = "Label";

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() public onEnter = new EventEmitter<InputEvent>();
}
