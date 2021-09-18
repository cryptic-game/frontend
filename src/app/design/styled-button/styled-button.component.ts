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
        this.buttonClass = 'primary';
        break;
      case StandardStyle.Warning:
        this.buttonClass = 'warning';
        break;
      case StandardStyle.Error:
        this.buttonClass = 'error';
        break;
      case StandardStyle.Success:
        this.buttonClass = 'success';
        break;
      case StandardStyle.Info:
        this.buttonClass = 'info';
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
