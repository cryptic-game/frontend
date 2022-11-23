import { Component, Input } from '@angular/core';

@Component({
  selector: 'design-radiobutton',
  templateUrl: './radiobutton.component.html',
  styleUrls: ['./radiobutton.component.scss']
})
export class RadiobuttonComponent {

  @Input() disabled: boolean = false;
  
  @Input() checked: boolean = false;
  
  @Input() label: string = '';
  @Input() id: string;
  @Input() name: string;

}
