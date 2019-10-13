import { Component, OnInit, Type } from '@angular/core';
import { WindowComponent, WindowDelegate } from '../../window/window-delegate';
import { WebsocketService } from '../../../websocket.service';

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.scss']
})
export class FileManagerComponent extends WindowComponent implements OnInit {
  public files: string[];

  constructor(private websocket: WebsocketService) {
    super();
  }

  ngOnInit() {
    this.update();

    // update shown files every 1 sec
    setInterval(() => this.update(), 1000);
  }

  private update(): void {
    const activeDevice = JSON.parse(sessionStorage.getItem('activeDevice'));

    this.websocket.ms('device', ['file', 'all'], {
      device_uuid: activeDevice['uuid']
    }).subscribe(r => {
      if (r.files != null) {
        if (this.files === undefined || JSON.stringify(r.files) !== JSON.stringify(this.files)) {
          this.files = r.files.map(x => x);
        }
      }
    });
  }

}

export class FileManagerWindowDelegate extends WindowDelegate {
  title = 'File Manager';
  icon = 'assets/desktop/img/filemanager.svg';
  type: Type<any> = FileManagerComponent;
}
