import {Component} from '@angular/core';

@Component({
  selector: 'app-base-components',
  templateUrl: './base-components.component.html',
  styleUrls: ['./base-components.component.scss']
})
export class BaseComponentsComponent {

  pressedAlert(name: string) {
    alert(name + " was pressed!");
  }

  changedText(event: any) {
    console.log(event)
    alert("Text changed! Text: " + event.target.value);
  }
}
