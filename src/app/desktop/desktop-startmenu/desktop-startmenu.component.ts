import { Account } from '../../../dataclasses/account';
import { UserService } from '../user.service';
import { Component, Input, OnInit } from '@angular/core';
import { DesktopComponent } from '../desktop.component';

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
  user: Account = {name: '', email: '', created: 0, last: 0};

  constructor(public userService: UserService) {
  }

  ngOnInit() {
    this.user.name = localStorage.getItem('username');
    this.user.email = localStorage.getItem('email');
    this.user.created = parseInt(localStorage.getItem('created'), 10);
    this.user.last = parseInt(localStorage.getItem('last'), 10);
  }

  search(term: string) {
    return this.parent.linkages.filter(item => item
      .displayName
      .trim()
      .toLowerCase()
      .match(term.trim().toLowerCase())
    );
  }
}
