import { Account } from '../../../dataclasses/account';
import { UserService } from '../user.service';
import { Component, Input, OnInit } from '@angular/core';
import { DesktopComponent } from '../desktop.component';
import { WebsocketService } from 'src/app/websocket.service';

@Component({
  selector: 'app-desktop-startmenu',
  templateUrl: './desktop-startmenu.component.html',
  styleUrls: ['./desktop-startmenu.component.scss']
})
export class DesktopStartmenuComponent implements OnInit {
  @Input() parent: DesktopComponent;
  @Input() target;

  searchTerm = '';
  token: string = sessionStorage.getItem('token');
  user: Account = { name: '', email: '', created: 0, last: 0 };

  constructor(
    public userService: UserService,
    public websocket: WebsocketService
  ) {}

  ngOnInit() {
    this.user.name = sessionStorage.getItem('username');
    this.user.email = sessionStorage.getItem('email');
    this.user.created = parseInt(sessionStorage.getItem('created'), 10);
    this.user.last = parseInt(sessionStorage.getItem('last'), 10);
  }

  search(term: string) {
    return this.parent.linkages.filter(item =>
      item.displayName
        .trim()
        .toLowerCase()
        .match(term.trim().toLowerCase())
    );
  }

  openBugReportPageGitHub() {
    window.open("https://github.com/cryptic-game/cryptic/issues/new");
  }

  openBugReportPageForm() {
    window.open("https://docs.google.com/forms/d/e/1FAIpQLSey6IZg-zJliAO4zNRmEdplqPkyqw-qmfKp4hARaBZHgNZSgQ/viewform");
  }
}
