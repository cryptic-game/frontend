import {Component, Input} from '@angular/core';
import {DesktopComponent} from '../desktop.component';
import {WebsocketService} from 'src/app/websocket.service';
import {AccountService} from '../../account/account.service';
import {DeviceService} from '../../api/devices/device.service';

@Component({
  selector: 'app-desktop-startmenu',
  templateUrl: './desktop-startmenu.component.html',
  styleUrls: ['./desktop-startmenu.component.scss']
})
export class DesktopStartmenuComponent {
  @Input() parent: DesktopComponent;

  searchTerm = '';

  constructor(public websocket: WebsocketService,
              private accountService: AccountService,
              private deviceService: DeviceService) {
  }

  search(term: string) {
    return this.parent.linkages.filter(item =>
      item.displayName
        .trim()
        .toLowerCase()
        .match(term.trim().toLowerCase())
    );
  }

  logout() {
    this.accountService.logout();
    this.parent.hideStartMenu();
  }

  shutdown() {
    this.deviceService.togglePower(this.parent.activeDevice.uuid).subscribe();
    this.parent.hideStartMenu();
  }
}
