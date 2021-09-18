import { Component, Input, OnInit} from '@angular/core';
@Component({
  selector: 'app-styled-button',
  templateUrl: './styled-button.component.html',
  styleUrls: ['./styled-button.component.scss']
})
export class StyledButtonComponent implements OnInit {

  @Input() disabled = false;
  @Input() styleClass: string;
  ngOnInit() {

  }

  @Input() onClick: (event: Event) => void = () => {};


}
