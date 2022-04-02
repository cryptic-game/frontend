import { Component, Input} from '@angular/core';

@Component({
  selector: 'design-progressbar',
  templateUrl: './progressbar.component.html',
  styleUrls: ['./progressbar.component.scss']
})
export class ProgressbarComponent {

  @Input() value = '100';

}
