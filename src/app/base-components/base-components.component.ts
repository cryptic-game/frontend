import {Component} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-base-components',
  templateUrl: './base-components.component.html',
  styleUrls: ['./base-components.component.scss']
})
export class BaseComponentsComponent {

  control: FormControl = new FormControl({value: 0, disabled: true}, [Validators.required]);
  controlWithValidator: FormControl = new FormControl(0, [Validators.required]);

  pressedAlert(name: string) {
    alert(name + " was pressed!");
  }

  changedText(event: any) {
    console.log(event)
    alert("Text changed! Text: " + event.target.value);
  }

  getValidatorHintText() {
    if (this.controlWithValidator.errors?.['required']) {
      return "Value is required";
    }
    return "";
  }
}
