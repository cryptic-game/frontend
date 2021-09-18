import { Component, Input, OnInit } from '@angular/core';
@Component({
  selector: 'app-styled-button',
  templateUrl: './styled-button.component.html',
  styleUrls: ['./styled-button.component.scss']
})
export class StyledButtonComponent implements OnInit {
  constructor(ststy: StandardStyle) {
    switch (ststy) {
      case StandardStyle.Primary:
        break;
      case StandardStyle.Warning:
        break;
      case StandardStyle.Error:
        break;
      case StandardStyle.Success:
        break;
      case StandardStyle.Info:
        break;
      default:
        this.buttonClass = 'primary';
        break;
    }
  }

  @Input() disabled = false;


  buttonClass = 'primary';
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  @Input() onClick: (event: Event) => void = () => {};



}
