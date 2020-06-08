import { Component, Input, OnInit } from '@angular/core';
import { DesktopComponent } from '../desktop.component';
import { WebsocketService } from 'src/app/websocket.service';
import { AccountService } from '../../account/account.service';

@Component({
  selector: 'app-desktop-startmenu',
  templateUrl: './desktop-startmenu.component.html',
  styleUrls: ['./desktop-startmenu.component.scss']
})
export class DesktopStartmenuComponent implements OnInit {
  @Input() parent: DesktopComponent;
  @Input() target;

  searchTerm = '';

  constructor(public websocket: WebsocketService, private accountService: AccountService) {
  }

  ngOnInit() {
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
  }

  openBugReportPageGitHub() {
    window.open('https://github.com/cryptic-game/cryptic/issues/new/choose');
  }

  openBugReportPageForm() {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSey6IZg-zJliAO4zNRmEdplqPkyqw-qmfKp4hARaBZHgNZSgQ/viewform');
  }
}
