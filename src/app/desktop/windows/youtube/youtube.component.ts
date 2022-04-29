import {Component, Type} from '@angular/core';
import {WindowComponent, WindowConstraints, WindowDelegate} from '../../window/window-delegate';
@Component({
  selector: 'youtube-app',
  templateUrl: './youtube.component.html',
  styleUrls: ['./youtube.component.scss']
})
export class YoutubeComponent extends WindowComponent {

    override delegate: YoutubeDelegate;


  constructor() {
    super();
  }
}

export class YoutubeDelegate extends WindowDelegate {
  title = 'Youtube';
  icon = 'assets/desktop/img/gear.svg';
  type: Type<any> = YoutubeComponent;

  override constraints = new WindowConstraints({resizable: false, maximizable: false});

  constructor() {
    super();
    this.position.width = 570;
    this.position.height = 360;
  }
}