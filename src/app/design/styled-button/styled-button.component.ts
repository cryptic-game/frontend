import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-styled-button',
  templateUrl: './styled-button.component.html',
  styleUrls: ['./styled-button.component.scss']
})
export class StyledButtonComponent {

  @Input() disabled = false;


  @Input() flavor: 'primary' | 'success' | 'warning' | 'danger' | 'info' = 'primary';
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onClick: EventEmitter<any> = new EventEmitter();


}
