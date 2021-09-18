import { Component, Input, OnInit} from '@angular/core';
@Component({
  selector: 'app-styled-button',
  templateUrl: './styled-button.component.html',
  styleUrls: ['./styled-button.component.scss']
})
export class StyledButtonComponent {

  @Input() disabled = false;
  @Input() styleClass: string;


  @Input() onClick: (event: Event) => void = () => {};


}
